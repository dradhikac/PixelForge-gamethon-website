import type { VercelRequest, VercelResponse } from "@vercel/node";

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

  const isProduction =
    process.env.NODE_ENV === "production";

  res.setHeader(
    "Set-Cookie",
    [
      "admin_session=",
      "HttpOnly",
      "Path=/",
      "SameSite=Strict",
      "Max-Age=0",
      isProduction ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  );

  return res.status(200).json({
    success: true,
  });
}