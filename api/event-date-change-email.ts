import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

const cronSecret = process.env.CRON_SECRET;

const GAMECRAFT_EMAIL = "gamecraftsupport2026@gmail.com";

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Missing Supabase server environment variables.");
}

if (!clientId || !clientSecret || !refreshToken) {
  throw new Error("Missing Google OAuth environment variables.");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function encodeMessage(message: string) {
  return Buffer.from(message, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sendEmail(
  gmail: ReturnType<typeof google.gmail>,
  to: string,
  subject: string,
  text: string,
  html: string
) {
  const raw = [
    `From: GAMECRAFT 2026 <${GAMECRAFT_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="GAMECRAFT_DATE_CHANGE"',
    "",
    "--GAMECRAFT_DATE_CHANGE",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    "--GAMECRAFT_DATE_CHANGE",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    "--GAMECRAFT_DATE_CHANGE--",
  ].join("\r\n");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodeMessage(raw),
    },
  });
}

function buildDateChangeEmail(
  memberName: string,
  teamName: string,
  registrationId: string
) {
  const safeName = escapeHtml(memberName);
  const safeTeam = escapeHtml(teamName);
  const safeRegistration = escapeHtml(registrationId);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GAMECRAFT 2026 | Important Event Date Update</title>
</head>

<body style="margin:0;padding:0;background:#eee;font-family:Arial,Helvetica,sans-serif;color:#111">

  <div style="padding:28px 0">

    <div style="max-width:680px;margin:auto;background:#fff;border:3px solid #111">

      <!-- Header -->
      <div style="background:#ff3b9d;padding:34px 28px;border-bottom:3px solid #111">

        <div style="font-size:11px;font-weight:900;letter-spacing:2px">
          GAMECRAFT // IMPORTANT UPDATE
        </div>

        <div style="font-size:42px;line-height:1;font-weight:900;margin-top:14px">
          EVENT DATE<br>UPDATED.
        </div>

        <div style="font-size:15px;line-height:1.6;font-weight:700;margin-top:16px">
          Please note the revised dates for GAMECRAFT 2026.
        </div>

      </div>

      <!-- Main -->
      <div style="padding:30px 28px 34px">

        <p style="font-size:16px;font-weight:700">
          Hello ${safeName},
        </p>

        <p style="font-size:15px;line-height:1.7;color:#333">
          We have an important update regarding your registration for
          <strong>GAMECRAFT 2026</strong>.
        </p>

        <!-- Date Change -->
        <div style="margin-top:26px;padding:24px;background:#111;color:#fff;border:3px solid #111;text-align:center">

          <div style="color:#bbb;font-size:10px;font-weight:900;letter-spacing:2px">
            REVISED EVENT DATES
          </div>

          <div style="font-size:30px;font-weight:900;margin-top:10px">
            29–30 OCTOBER 2026
          </div>

          <div style="color:#ddd;font-size:13px;margin-top:8px">
            DSATM
          </div>

        </div>

        <!-- Previous Date -->
        <div style="margin-top:24px;padding:20px;border:2px solid #111;background:#f5f5f5">

          <div style="font-size:11px;font-weight:900;letter-spacing:2px">
            WHAT CHANGED?
          </div>

          <div style="font-size:15px;line-height:1.8;margin-top:10px">
            <strong>Previous dates:</strong> 30–31 October 2026<br>
            <strong>New dates:</strong> 29–30 October 2026
          </div>

        </div>

        <!-- Registration -->
        <div style="margin-top:24px;padding:20px;background:#ff3b9d;border:3px solid #111">

          <div style="font-size:11px;font-weight:900;letter-spacing:2px">
            YOUR REGISTRATION
          </div>

          <div style="font-size:18px;font-weight:900;margin-top:10px">
            ${safeTeam}
          </div>

          <div style="font-size:13px;margin-top:6px">
            Registration ID:
            <strong>${safeRegistration}</strong>
          </div>

        </div>

        <!-- Important -->
        <div style="margin-top:28px">

          <div style="font-size:11px;font-weight:900;letter-spacing:2px">
            PLEASE NOTE
          </div>

          <div style="font-size:14px;line-height:1.9;color:#333;margin-top:10px">
            • Your registration remains valid.<br>
            • Your selected events remain unchanged.<br>
            • No re-registration is required.<br>
            • Please inform every member of your team about the revised dates.<br>
            • Please update your calendars accordingly.
          </div>

        </div>

        <!-- Event Info -->
        <div style="margin-top:28px;padding:20px;border:2px solid #111">

          <div style="font-size:11px;font-weight:900;letter-spacing:2px">
            GAMECRAFT 2026
          </div>

          <div style="font-size:15px;line-height:1.8;margin-top:10px">
            <strong>Dates:</strong> 29–30 October 2026<br>
            <strong>Venue:</strong> DSATM<br>
            <strong>Registration:</strong> Confirmed
          </div>

        </div>

        <!-- Support -->
        <div style="margin-top:28px;font-size:13px;line-height:1.7;color:#555">

          If you have any questions regarding the date change,
          please contact:

          <br><br>

          <strong style="color:#111">
            ${GAMECRAFT_EMAIL}
          </strong>

        </div>

        <!-- CTA -->
        <div style="margin-top:30px;padding:22px;background:#111;color:#fff;text-align:center;border:3px solid #111">

          <div style="font-size:28px;font-weight:900">
            SEE YOU AT GAMECRAFT.
          </div>

          <div style="color:#ddd;font-size:13px;margin-top:8px">
            Build. Compete. Strategize. Win.
          </div>

        </div>

      </div>

      <!-- Footer -->
      <div style="padding:20px 28px;background:#f3f3f3;border-top:3px solid #111;font-size:11px;font-weight:900;letter-spacing:1.5px">
        GAMECRAFT 2026 // DSATM
      </div>

    </div>

  </div>

</body>
</html>`;

  const text = `GAMECRAFT 2026 | IMPORTANT EVENT DATE UPDATE

Hello ${memberName},

We have an important update regarding your registration for GAMECRAFT 2026.

REVISED EVENT DATES
29-30 OCTOBER 2026
DSATM

WHAT CHANGED?

Previous dates: 30-31 October 2026
New dates: 29-30 October 2026

YOUR REGISTRATION

Team: ${teamName}
Registration ID: ${registrationId}

PLEASE NOTE

- Your registration remains valid.
- Your selected events remain unchanged.
- No re-registration is required.
- Please inform every member of your team about the revised dates.
- Please update your calendars accordingly.

GAMECRAFT 2026

Dates: 29-30 October 2026
Venue: DSATM
Registration: Confirmed

If you have any questions regarding the date change, please contact:

${GAMECRAFT_EMAIL}

SEE YOU AT GAMECRAFT.

Build. Compete. Strategize. Win.`;

  return { text, html };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  /*
   * ------------------------------------------------------------
   * ONE-TIME EVENT DATE CHANGE EMAIL
   * ------------------------------------------------------------
   *
   * This endpoint is intentionally NOT configured as a cron.
   *
   * It sends the date-change announcement to every member
   * belonging to every PAID team.
   *
   * Authentication uses the existing CRON_SECRET.
   */

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
  }

  if (
    !cronSecret ||
    req.headers.authorization !== `Bearer ${cronSecret}`
  ) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized.",
    });
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const auth = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://gamecraft-website.vercel.app/api/auth/google/callback"
  );

  auth.setCredentials({
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  try {
    // --------------------------------------------------
    // Get all paid/registered teams
    // --------------------------------------------------

    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id, registration_id, team_name")
      .eq("payment_status", "PAID")
      .order("created_at", {
        ascending: true,
      });

    if (teamsError) {
      throw teamsError;
    }

    if (!teams?.length) {
      return res.status(200).json({
        success: true,
        teams: 0,
        members: 0,
        emails_sent: 0,
        emails_failed: 0,
      });
    }

    const teamIds = teams.map((team) => team.id);

    // --------------------------------------------------
    // Get every member
    // --------------------------------------------------

    const {
      data: members,
      error: membersError,
    } = await supabase
      .from("team_members")
      .select("team_id, name, email")
      .in("team_id", teamIds)
      .order("member_number", {
        ascending: true,
      });

    if (membersError) {
      throw membersError;
    }

    const teamMap = new Map(
      teams.map((team) => [team.id, team])
    );

    let emailsSent = 0;
    let emailsFailed = 0;

    // --------------------------------------------------
    // Send individually
    // --------------------------------------------------

    for (const member of members || []) {
      const team = teamMap.get(member.team_id);

      if (!team) {
        continue;
      }

      const { text, html } = buildDateChangeEmail(
        String(member.name),
        String(team.team_name),
        String(team.registration_id)
      );

      try {
        await sendEmail(
          gmail,
          member.email,
          "GAMECRAFT 2026 | Important Update: Event Dates Changed",
          text,
          html
        );

        emailsSent++;

        console.log(
          "Date change email sent:",
          member.email,
          team.registration_id
        );
      } catch (error) {
        emailsFailed++;

        console.error(
          "Date change email failed:",
          member.email,
          error
        );
      }
    }

    // --------------------------------------------------
    // Final response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      teams: teams.length,
      members: members?.length || 0,
      emails_sent: emailsSent,
      emails_failed: emailsFailed,
    });
  } catch (error) {
    console.error(
      "Event date change email error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to send event date change emails.",
    });
  }
}