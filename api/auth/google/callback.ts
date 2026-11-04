import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

export default async function handler(
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

  const code =
    typeof req.query.code === "string"
      ? req.query.code
      : undefined;

  if (!code) {
    const error =
      typeof req.query.error === "string"
        ? req.query.error
        : "No authorization code received.";

    return res.status(400).send(
      `Google authorization failed: ${error}`
    );
  }

  const redirectUri =
    "https://gamecraft-website.vercel.app/api/auth/google/callback";

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return res.status(400).send(
        "Google did not return a refresh token. Please try the authorization again."
      );
    }

    return res.status(200).send(`
      <html>
        <head>
          <title>GameCraft Google Authorization</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            code {
              display: block;
              padding: 16px;
              background: #f4f4f4;
              border-radius: 8px;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <h1>Google authorization successful ✅</h1>
          <p>
            The authorization was successful.
          </p>
          <p>
            Copy the refresh token below into the
            <code>GOOGLE_OAUTH_REFRESH_TOKEN</code> environment variable in Vercel.
          </p>
          <code>${tokens.refresh_token}</code>
          <p>
            <strong>Do NOT share this token or save it in logs, source files, or screenshots.</strong>
          </p>
        </body>
      </html>
    `);
  } catch (error) {
    const candidate = error as {
      name?: unknown;
      message?: unknown;
      code?: unknown;
      status?: unknown;
      response?: {
        status?: unknown;
        data?: {
          error?: unknown;
          error_description?: unknown;
        };
      };
    };

    console.error("Google OAuth callback error:", {
      name:
        typeof candidate?.name === "string"
          ? candidate.name
          : "Error",
      message:
        typeof candidate?.message === "string"
          ? candidate.message
          : "Unknown error",
      code: candidate?.code,
      status: candidate?.status || candidate?.response?.status,
      reason: candidate?.response?.data?.error,
      description:
        candidate?.response?.data?.error_description,
    });

    return res.status(500).send(
      "Failed to exchange Google authorization code."
    );
  }
}
