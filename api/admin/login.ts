import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 8; // 8 hours

const createSignature = (
  payload: string,
  secret: string
) => {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
};

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    return res.status(500).json({
      success: false,
      error: "Admin authentication is not configured.",
    });
  }

  const { password } = req.body || {};

  if (
    typeof password !== "string" ||
    password !== adminPassword
  ) {
    return res.status(401).json({
      success: false,
      error: "Invalid password.",
    });
  }

  const timestamp = Date.now().toString();

  const signature = createSignature(
    timestamp,
    sessionSecret
  );

  const token = `${timestamp}.${signature}`;

  const isProduction =
    process.env.NODE_ENV === "production";

  res.setHeader(
    "Set-Cookie",
    [
      `${COOKIE_NAME}=${token}`,
      "HttpOnly",
      "Path=/",
      "SameSite=Strict",
      `Max-Age=${SESSION_DURATION}`,
      isProduction ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  );

  return res.status(200).json({
    success: true,
  });
}