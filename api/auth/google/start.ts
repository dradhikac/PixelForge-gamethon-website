import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed.");
  }

  if (!clientId || !clientSecret) {
    return res.status(500).send(
      "Missing Google OAuth environment variables."
    );
  }

  const redirectUri =
    "https://gamecraft-website.vercel.app/api/auth/google/callback";

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  });

  return res.redirect(302, authUrl);
}