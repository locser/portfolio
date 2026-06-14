import crypto from "crypto";

const SECRET_KEY = process.env.ADMIN_SECRET || "loc-portfolio-secret-key-123456";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function createSessionToken(username: string): string {
  const timestamp = Date.now();
  const rawData = `${username}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(rawData)
    .digest("hex");
  return `${username}:${timestamp}:${signature}`;
}

export function verifySessionToken(token: string): { username: string; timestamp: number } | null {
  try {
    if (!token) return null;

    const parts = token.split(":");
    if (parts.length !== 3) return null;

    const username = parts[0];
    const timestampStr = parts[1];
    const signature = parts[2];

    if (!username || !timestampStr || !signature) return null;

    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) return null;

    // Check if session has expired
    if (Date.now() - timestamp > SESSION_DURATION) {
      return null;
    }

    // Recompute signature and verify
    const rawData = `${username}:${timestamp}`;
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(rawData)
      .digest("hex");

    if (signature === expectedSignature) {
      return { username, timestamp };
    }

    return null;
  } catch (error) {
    console.error("Error verifying session token:", error);
    return null;
  }
}
