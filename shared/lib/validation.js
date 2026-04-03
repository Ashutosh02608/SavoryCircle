const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_UPPERCASE_REGEX = /[A-Z]/;
const HAS_LOWERCASE_REGEX = /[a-z]/;
const HAS_NUMBER_REGEX = /\d/;
const HAS_SPECIAL_REGEX = /[^A-Za-z0-9]/;

export const PASSWORD_RULE =
  "Password must be 8-64 characters and include uppercase, lowercase, number, and special character.";

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function firstError(fieldErrors) {
  const keys = Object.keys(fieldErrors);
  return keys.length ? fieldErrors[keys[0]] : "Invalid input.";
}

function validatePasswordStrength(password) {
  if (password.length < 8 || password.length > 64) {
    return "Password must be 8-64 characters.";
  }

  if (
    !HAS_UPPERCASE_REGEX.test(password) ||
    !HAS_LOWERCASE_REGEX.test(password) ||
    !HAS_NUMBER_REGEX.test(password) ||
    !HAS_SPECIAL_REGEX.test(password)
  ) {
    return PASSWORD_RULE;
  }

  return "";
}

export function validateSignupInput(input) {
  const name = String(input?.name || "").trim();
  const email = normalizeEmail(input?.email);
  const password = String(input?.password || "");
  const confirmPassword = String(input?.confirmPassword || "");
  const fieldErrors = {};

  if (name.length < 2 || name.length > 80) {
    fieldErrors.name = "Name must be between 2 and 80 characters.";
  }

  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (confirmPassword !== password) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    error: firstError(fieldErrors),
    fieldErrors,
    values: {
      name,
      email,
      password,
      confirmPassword,
    },
  };
}

export function validateSignupOtpVerifyInput(input) {
  const email = normalizeEmail(input?.email);
  const otp = String(input?.otp || "").trim();
  const fieldErrors = {};

  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!/^\d{6}$/.test(otp)) {
    fieldErrors.otp = "Enter the 6-digit code.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    error: firstError(fieldErrors),
    fieldErrors,
    values: {
      email,
      otp,
    },
  };
}

export function validateLoginInput(input) {
  const email = normalizeEmail(input?.email);
  const password = String(input?.password || "");
  const fieldErrors = {};

  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    error: firstError(fieldErrors),
    fieldErrors,
    values: {
      email,
      password,
    },
  };
}

export function validateChangePasswordInput(input) {
  const currentPassword = String(input?.currentPassword || "");
  const newPassword = String(input?.newPassword || "");
  const confirmPassword = String(input?.confirmPassword || "");
  const fieldErrors = {};

  if (!currentPassword) {
    fieldErrors.currentPassword = "Current password is required.";
  }

  const newPasswordError = validatePasswordStrength(newPassword);
  if (newPasswordError) {
    fieldErrors.newPassword = newPasswordError;
  }

  if (confirmPassword !== newPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    fieldErrors.newPassword = "New password must be different from current password.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    error: firstError(fieldErrors),
    fieldErrors,
    values: {
      currentPassword,
      newPassword,
      confirmPassword,
    },
  };
}
