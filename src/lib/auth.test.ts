import { hashPassword, createSessionToken, verifySessionToken } from "./auth";

describe("auth.ts helper functions", () => {
  describe("hashPassword", () => {
    it("should produce a consistent SHA256 hex digest for a password", () => {
      const password = "mySecurePassword123";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 is 64 characters in hex
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should produce different hashes for different passwords", () => {
      const hash1 = hashPassword("password123");
      const hash2 = hashPassword("password124");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Session Tokens", () => {
    it("should create a formatted session token containing username, timestamp and signature", () => {
      const username = "admin";
      const token = createSessionToken(username);

      const parts = token.split(":");
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe(username);
      expect(Number(parts[1])).toBeGreaterThan(0);
      expect(parts[2]).toMatch(/^[a-f0-9]{64}$/); // Hmac SHA256 signature
    });

    it("should verify a valid recently-created session token", () => {
      const username = "admin";
      const token = createSessionToken(username);

      const result = verifySessionToken(token);
      expect(result).not.toBeNull();
      expect(result?.username).toBe(username);
      expect(result?.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it("should reject session token with tampered signature", () => {
      const username = "admin";
      const token = createSessionToken(username);

      // Tamper the signature part of the token (the last part)
      const parts = token.split(":");
      parts[2] = parts[2].substring(0, 63) + (parts[2].endsWith("0") ? "1" : "0");
      const tamperedToken = parts.join(":");

      const result = verifySessionToken(tamperedToken);
      expect(result).toBeNull();
    });

    it("should reject session token with modified username", () => {
      const username = "admin";
      const token = createSessionToken(username);

      // Modify the username part of the token
      const parts = token.split(":");
      parts[0] = "hacker";
      const modifiedToken = parts.join(":");

      const result = verifySessionToken(modifiedToken);
      expect(result).toBeNull();
    });

    it("should reject expired session tokens", () => {
      const username = "admin";
      const expiredTimestamp = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago (limit is 24 hours)

      // Manually construct an expired token with valid signature for that expired time
      const crypto = require("crypto");
      const SECRET_KEY = process.env.ADMIN_SECRET || "loc-portfolio-secret-key-123456";
      const rawData = `${username}:${expiredTimestamp}`;
      const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(rawData)
        .digest("hex");
      
      const expiredToken = `${username}:${expiredTimestamp}:${signature}`;

      const result = verifySessionToken(expiredToken);
      expect(result).toBeNull();
    });

    it("should return null for malformed tokens", () => {
      expect(verifySessionToken("")).toBeNull();
      expect(verifySessionToken("invalidTokenFormat")).toBeNull();
      expect(verifySessionToken("user:123456789")).toBeNull(); // Missing signature
      expect(verifySessionToken("user::signature")).toBeNull(); // Missing timestamp
      expect(verifySessionToken("user:notANumber:signature")).toBeNull(); // Invalid timestamp
    });
  });
});
