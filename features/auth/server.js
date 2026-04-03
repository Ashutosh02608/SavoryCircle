import crypto from "node:crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "@/shared/lib/mongodb";
import { sendSignupOtpEmail } from "@/shared/lib/mailer";
import {
  validateLoginInput,
  validateSignupInput,
  validateSignupOtpVerifyInput,
  validateChangePasswordInput,
} from "@/shared/lib/validation";

export const SESSION_COOKIE_NAME = "auth_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const SIGNUP_OTP_DURATION_MS = 1000 * 60 * 10;
const SIGNUP_OTP_MAX_ATTEMPTS = 5;

let indexesReady = false;

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, storedHash] = String(passwordHash || "").split(":");

  if (!salt || !storedHash || storedHash.length !== 128) {
    return false;
  }

  const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(storedHash, "hex"),
    Buffer.from(computedHash, "hex")
  );
}

function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtpCode(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
}

async function ensureIndexes() {
  if (indexesReady) {
    return;
  }

  const db = await getDb();
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("signupOtps").createIndex({ email: 1 }, { unique: true }),
    db.collection("signupOtps").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);

  indexesReady = true;
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function registerUser(payload) {
  const validation = validateSignupInput(payload);

  if (!validation.isValid) {
    return {
      error: validation.error,
      fieldErrors: validation.fieldErrors,
      validationError: true,
    };
  }

  await ensureIndexes();

  const db = await getDb();
  const users = db.collection("users");

  const newUser = {
    name: validation.values.name,
    email: validation.values.email,
    passwordHash: hashPassword(validation.values.password),
    createdAt: new Date(),
  };

  try {
    const result = await users.insertOne(newUser);
    return {
      user: sanitizeUser({ ...newUser, _id: result.insertedId }),
    };
  } catch (error) {
    if (error?.code === 11000) {
      return {
        error: "An account with that email already exists.",
        fieldErrors: { email: "An account with that email already exists." },
        conflict: true,
      };
    }

    throw error;
  }
}

export async function requestSignupOtp(payload) {
  const validation = validateSignupInput(payload);

  if (!validation.isValid) {
    return {
      error: validation.error,
      fieldErrors: validation.fieldErrors,
      validationError: true,
    };
  }

  await ensureIndexes();

  const db = await getDb();
  const users = db.collection("users");
  const signupOtps = db.collection("signupOtps");

  const existingUser = await users.findOne({ email: validation.values.email }, { projection: { _id: 1 } });

  if (existingUser) {
    return {
      error: "An account with that email already exists.",
      fieldErrors: { email: "An account with that email already exists." },
      conflict: true,
    };
  }

  const code = generateOtpCode();
  const now = new Date();
  const expiresAt = new Date(Date.now() + SIGNUP_OTP_DURATION_MS);

  await signupOtps.updateOne(
    { email: validation.values.email },
    {
      $set: {
        name: validation.values.name,
        email: validation.values.email,
        passwordHash: hashPassword(validation.values.password),
        codeHash: hashOtpCode(code),
        attempts: 0,
        updatedAt: now,
        expiresAt,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );
  try {
    await sendSignupOtpEmail({
      toEmail: validation.values.email,
      name: validation.values.name,
      otp: code,
    });
  } catch {
    return {
      error: "Unable to send verification email right now.",
      status: 500,
    };
  }

  return {
    ok: true,
    message: "Verification code sent to your email.",
    expiresInSeconds: Math.floor(SIGNUP_OTP_DURATION_MS / 1000),
  };
}

export async function verifySignupOtp(payload) {
  const validation = validateSignupOtpVerifyInput(payload);

  if (!validation.isValid) {
    return {
      error: validation.error,
      fieldErrors: validation.fieldErrors,
      validationError: true,
    };
  }

  await ensureIndexes();

  const db = await getDb();
  const users = db.collection("users");
  const signupOtps = db.collection("signupOtps");

  const otpDoc = await signupOtps.findOne({ email: validation.values.email });

  if (!otpDoc || !otpDoc.expiresAt || new Date(otpDoc.expiresAt) <= new Date()) {
    return {
      error: "OTP expired. Request a new code.",
      fieldErrors: { otp: "OTP expired. Request a new code." },
    };
  }

  const attempts = Number(otpDoc.attempts ?? 0);

  if (attempts >= SIGNUP_OTP_MAX_ATTEMPTS) {
    return {
      error: "Too many attempts. Request a new OTP.",
      fieldErrors: { otp: "Too many attempts. Request a new OTP." },
    };
  }

  if (hashOtpCode(validation.values.otp) !== String(otpDoc.codeHash || "")) {
    await signupOtps.updateOne(
      { _id: otpDoc._id },
      { $set: { attempts: attempts + 1, updatedAt: new Date() } }
    );

    return {
      error: "Incorrect OTP.",
      fieldErrors: { otp: "Incorrect OTP." },
    };
  }

  const existingUser = await users.findOne({ email: validation.values.email }, { projection: { _id: 1 } });

  if (existingUser) {
    await signupOtps.deleteOne({ _id: otpDoc._id });
    return {
      error: "An account with that email already exists.",
      fieldErrors: { email: "An account with that email already exists." },
      conflict: true,
    };
  }

  const newUser = {
    name: otpDoc.name || "Cook",
    email: otpDoc.email,
    passwordHash: otpDoc.passwordHash,
    createdAt: new Date(),
  };

  const result = await users.insertOne(newUser);
  await signupOtps.deleteOne({ _id: otpDoc._id });

  return {
    user: sanitizeUser({ ...newUser, _id: result.insertedId }),
  };
}

export async function loginUser(payload) {
  const validation = validateLoginInput(payload);

  if (!validation.isValid) {
    return {
      error: validation.error,
      fieldErrors: validation.fieldErrors,
      validationError: true,
    };
  }

  await ensureIndexes();

  const db = await getDb();
  const user = await db.collection("users").findOne({ email: validation.values.email });

  if (!user || !verifyPassword(validation.values.password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }

  return { user: sanitizeUser(user) };
}

export async function changeUserPassword({ userId, payload }) {
  const validation = validateChangePasswordInput(payload);

  if (!validation.isValid) {
    return {
      error: validation.error,
      fieldErrors: validation.fieldErrors,
      validationError: true,
    };
  }

  await ensureIndexes();

  if (!ObjectId.isValid(userId)) {
    return { error: "Unauthorized.", status: 401 };
  }

  const db = await getDb();
  const userObjectId = new ObjectId(userId);
  const user = await db.collection("users").findOne({ _id: userObjectId });

  if (!user) {
    return { error: "User not found.", status: 404 };
  }

  if (!verifyPassword(validation.values.currentPassword, user.passwordHash)) {
    return {
      error: "Current password is incorrect.",
      fieldErrors: { currentPassword: "Current password is incorrect." },
      status: 422,
    };
  }

  const passwordHash = hashPassword(validation.values.newPassword);

  await db.collection("users").updateOne(
    { _id: userObjectId },
    { $set: { passwordHash } }
  );

  return { ok: true };
}

export async function createSession(userId) {
  await ensureIndexes();

  const db = await getDb();
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.collection("sessions").insertOne({
    userId: new ObjectId(userId),
    tokenHash,
    createdAt: new Date(),
    expiresAt,
  });

  return {
    token,
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  };
}

export async function setSessionCookie(token, maxAge) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function deleteSessionByToken(token) {
  if (!token) {
    return;
  }

  const db = await getDb();
  await db.collection("sessions").deleteOne({ tokenHash: hashSessionToken(token) });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  const db = await getDb();
  const session = await db.collection("sessions").findOne({
    tokenHash: hashSessionToken(rawToken),
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return null;
  }

  const user = await db.collection("users").findOne(
    { _id: session.userId },
    { projection: { passwordHash: 0 } }
  );

  return sanitizeUser(user);
}








