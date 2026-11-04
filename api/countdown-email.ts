import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
const cronSecret = process.env.CRON_SECRET;

const GAMECRAFT_EMAIL = "pixelforgesupport2026@gmail.com";

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
    'Content-Type: multipart/alternative; boundary="GAMECRAFT_COUNTDOWN"',
    "",
    "--GAMECRAFT_COUNTDOWN",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    "--GAMECRAFT_COUNTDOWN",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    "--GAMECRAFT_COUNTDOWN--",
  ].join("\r\n");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodeMessage(raw),
    },
  });
}

function buildCountdownEmail(
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
  <title>GAMECRAFT 2026 | 10 Days To Go</title>
</head>

<body style="margin:0;padding:0;background:#eee;font-family:Arial,Helvetica,sans-serif;color:#111">

  <div style="padding:28px 0">

    <div style="max-width:680px;margin:auto;background:#fff;border:3px solid #111">

      <!-- Header -->
      <div style="background:#ff3b9d;padding:34px 28px;border-bottom:3px solid #111">

        <div style="font-size:11px;font-weight:900;letter-spacing:2px">
          GAMECRAFT // COUNTDOWN
        </div>

        <div style="font-size:46px;line-height:.95;font-weight:900;margin-top:14px">
          10 DAYS<br>TO GO.
        </div>

        <div style="font-size:15px;line-height:1.6;font-weight:700;margin-top:16px">
          The arena is getting closer. Your team is already in. Now it's time to get ready.
        </div>

      </div>

      <!-- Main -->
      <div style="padding:30px 28px 34px">

        <p style="font-size:16px;font-weight:700">
          Hey ${safeName},
        </p>

        <p style="font-size:15px;line-height:1.7;color:#333">
          ${safeTeam} is officially registered for GAMECRAFT 2026.
        </p>

        <!-- Arena -->
        <div style="margin-top:26px;padding:22px;background:#111;color:#fff;border:3px solid #111;text-align:center">

          <div style="color:#bbb;font-size:10px;font-weight:900;letter-spacing:2px">
            THE ARENA OPENS
          </div>

          <div style="font-size:30px;font-weight:900;margin-top:9px">
            29-30 OCTOBER 2026
          </div>

          <div style="color:#ddd;font-size:13px;margin-top:8px">
            DSATM
          </div>

        </div>

        <!-- Checklist -->
        <div style="margin-top:28px;padding:20px;border:3px solid #111;background:#ff3b9d">

          <div style="font-size:11px;font-weight:900;letter-spacing:2px">
            YOUR COUNTDOWN CHECKLIST
          </div>

          <div style="font-size:14px;line-height:1.9;font-weight:700;margin-top:12px">
            01 &nbsp; Know your selected events<br>
            02 &nbsp; Read the rulebook<br>
            03 &nbsp; Keep your college ID ready<br>
            04 &nbsp; Keep your registration ID handy<br>
            05 &nbsp; Get your team ready for the 30-hour build
          </div>

        </div>

        <!-- Two Days -->
        <div style="margin-top:28px;border:2px solid #111">

          <div style="padding:15px;background:#111;color:#fff;font-size:12px;font-weight:900;letter-spacing:2px">
            TWO DAYS. ONE ARENA.
          </div>

          <div style="padding:17px;border-bottom:1px solid #ddd">
            <strong>DAY 01</strong><br>
            Strategy &amp; Markets
          </div>

          <div style="padding:17px;border-bottom:1px solid #ddd">
            <strong>DAY 02</strong><br>
            Systems &amp; Finale
          </div>

          <div style="padding:17px;background:#ff3b9d">
            <strong>30-HOUR BUILD</strong><br>
            10:30 Day 01 &rarr; 16:30 Day 02
          </div>

        </div>

        <!-- Participation -->
        <div style="margin-top:28px;padding:20px;border:2px solid #111;background:#f5f5f5">

          <div style="font-size:11px;font-weight:900;letter-spacing:2px">
            PARTICIPATION REMINDERS
          </div>

          <div style="font-size:13px;line-height:1.8;color:#333;margin-top:10px">
            Team size: <strong>3-4 members</strong><br>
            Competitive events: <strong>Maximum 2</strong><br>
            GAMECRAFT Challenge is excluded from the limit<br>
            College ID required
          </div>

        </div>

        <!-- Links -->
        <div style="margin-top:28px;text-align:center">

          <a
            href="https://gamecraft-website.vercel.app/rulebook"
            style="display:inline-block;margin:4px;padding:13px 18px;background:#111;color:#fff;text-decoration:none;border:2px solid #111;font-size:12px;font-weight:900"
          >
            READ RULEBOOK
          </a>

          <a
            href="https://gamecraft-website.vercel.app/brochure"
            style="display:inline-block;margin:4px;padding:13px 18px;background:#ff3b9d;color:#111;text-decoration:none;border:2px solid #111;font-size:12px;font-weight:900"
          >
            VIEW BROCHURE
          </a>

        </div>

        <!-- Final CTA -->
        <div style="margin-top:30px;padding:22px;background:#111;color:#fff;text-align:center;border:3px solid #111">

          <div style="font-size:28px;font-weight:900">
            YOUR MOVE.
          </div>

          <div style="color:#ddd;font-size:13px;margin-top:8px">
            Build. Compete. Strategize. Win.
          </div>

        </div>

        <!-- Footer info -->
        <div style="margin-top:28px;font-size:12px;line-height:1.7;color:#555">

          Registration ID:
          <strong style="color:#111">
            ${safeRegistration}
          </strong>

          <br>

          Questions:
          <strong style="color:#111">
            ${GAMECRAFT_EMAIL}
          </strong>

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

  const text = `GAMECRAFT 2026 | 10 DAYS TO GO

Hey ${memberName},

${teamName} is officially registered for GAMECRAFT 2026.

THE ARENA OPENS
29-30 OCTOBER 2026
DSATM

YOUR COUNTDOWN CHECKLIST
01. Know your selected events
02. Read the rulebook
03. Keep your college ID ready
04. Keep your registration ID handy
05. Get your team ready for the 30-hour build

TWO DAYS. ONE ARENA.
DAY 01 - Strategy & Markets
DAY 02 - Systems & Finale
30-HOUR BUILD - 10:30 Day 01 -> 16:30 Day 02

Team size: 3-4 members
Competitive events: Maximum 2
GAMECRAFT Challenge is excluded from the limit
College ID required

Rulebook: https://gamecraft-website.vercel.app/rulebook
Brochure: https://gamecraft-website.vercel.app/brochure

Registration ID: ${registrationId}
Questions: ${GAMECRAFT_EMAIL}

YOUR MOVE.
Build. Compete. Strategize. Win.`;

  return { text, html };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  /*
   * CRON AUTHENTICATION
   *
   * Only an authorized Vercel Cron request
   * with the correct CRON_SECRET can execute this endpoint.
   */
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
    /*
     * ============================================================
     * PRODUCTION COUNTDOWN EMAIL
     * ============================================================
     *
     * Vercel Cron calls this endpoint on October 20.
     *
     * It sends the countdown email to every member
     * belonging to every PAID team.
     */

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
        emails_sent: 0,
        emails_failed: 0,
      });
    }

    const teamIds = teams.map((team) => team.id);

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
      (
        teams as Array<{
          id: string;
          registration_id: string;
          team_name: string;
        }>
      ).map((team) => [team.id, team])
    );

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const member of members || []) {
      const team = teamMap.get(member.team_id);

      if (!team) {
        continue;
      }

      const { text, html } = buildCountdownEmail(
        String(member.name),
        String(team.team_name),
        String(team.registration_id)
      );

      try {
        await sendEmail(
          gmail,
          member.email,
          "GAMECRAFT 2026 | 10 Days To Go!",
          text,
          html
        );

        emailsSent++;
      } catch (error) {
        emailsFailed++;

        console.error(
          "Countdown email failed:",
          member.email,
          error
        );
      }
    }

    return res.status(200).json({
      success: true,
      teams: teams.length,
      emails_sent: emailsSent,
      emails_failed: emailsFailed,
    });
  } catch (error) {
    console.error(
      "Countdown email error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to send countdown emails.",
    });
  }
}