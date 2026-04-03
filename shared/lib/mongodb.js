import { MongoClient } from "mongodb";

let client;
let clientPromise;

function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true" || normalized === "1") {
    return true;
  }
  if (normalized === "false" || normalized === "0") {
    return false;
  }

  return undefined;
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
}

function getMongoOptions() {
  const tls = parseBoolean(process.env.MONGODB_TLS);
  const tlsAllowInvalidCertificates = parseBoolean(
    process.env.MONGODB_TLS_ALLOW_INVALID_CERTIFICATES
  );
  const tlsAllowInvalidHostnames = parseBoolean(
    process.env.MONGODB_TLS_ALLOW_INVALID_HOSTNAMES
  );
  const family = parseNumber(process.env.MONGODB_IP_FAMILY, undefined);

  const options = {
    serverSelectionTimeoutMS: parseNumber(
      process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
      10_000
    ),
    connectTimeoutMS: parseNumber(process.env.MONGODB_CONNECT_TIMEOUT_MS, 10_000),
    socketTimeoutMS: parseNumber(process.env.MONGODB_SOCKET_TIMEOUT_MS, 30_000),
  };

  if (tls !== undefined) {
    options.tls = tls;
  }

  if (tlsAllowInvalidCertificates !== undefined) {
    options.tlsAllowInvalidCertificates = tlsAllowInvalidCertificates;
  }

  if (tlsAllowInvalidHostnames !== undefined) {
    options.tlsAllowInvalidHostnames = tlsAllowInvalidHostnames;
  }

  if (Number.isFinite(family) && (family === 4 || family === 6)) {
    options.family = family;
  }

  return options;
}

function getClientPromise() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment variables.");
  }

  if (clientPromise) {
    return clientPromise;
  }

  const options = getMongoOptions();

  if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalThis._mongoClientPromise = client.connect();
    }

    clientPromise = globalThis._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb() {
  const resolvedClient = await getClientPromise();
  const dbName = process.env.MONGODB_DB || "t10";
  return resolvedClient.db(dbName);
}
