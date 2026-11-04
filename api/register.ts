import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  IncomingForm,
  type Fields,
  type Files,
  type File,
} from "formidable";
import { google } from "googleapis";
import fs from "node:fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

// --------------------------------------------------
// Environment variables
// --------------------------------------------------

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY;

const googleOAuthClientId =
  process.env.GOOGLE_OAUTH_CLIENT_ID;

const googleOAuthClientSecret =
  process.env.GOOGLE_OAUTH_CLIENT_SECRET;

const googleOAuthRefreshToken =
  process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

const googleDriveFolderId =
  process.env.GOOGLE_DRIVE_FOLDER_ID;

// --------------------------------------------------
// Environment checks
// --------------------------------------------------

console.log(
  "SUPABASE URL loaded:",
  !!supabaseUrl
);

console.log(
  "SUPABASE SECRET loaded:",
  !!supabaseSecretKey
);

console.log(
  "GOOGLE OAUTH CLIENT ID loaded:",
  !!googleOAuthClientId
);

console.log(
  "GOOGLE OAUTH CLIENT SECRET loaded:",
  !!googleOAuthClientSecret
);

console.log(
  "GOOGLE OAUTH REFRESH TOKEN loaded:",
  !!googleOAuthRefreshToken
);

console.log(
  "GOOGLE DRIVE FOLDER loaded:",
  !!googleDriveFolderId
);

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Missing Supabase server environment variables."
  );
}

if (
  !googleOAuthClientId ||
  !googleOAuthClientSecret ||
  !googleOAuthRefreshToken ||
  !googleDriveFolderId
) {
  throw new Error(
    "Missing Google OAuth / Drive environment variables."
  );
}

// --------------------------------------------------
// Supabase
// --------------------------------------------------

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

// --------------------------------------------------
// Google OAuth authentication
// --------------------------------------------------

const googleAuth = new google.auth.OAuth2(
  googleOAuthClientId,
  googleOAuthClientSecret,
  "https://gamecraft-website.vercel.app/api/auth/google/callback"
);

googleAuth.setCredentials({
  refresh_token: googleOAuthRefreshToken,
});

// --------------------------------------------------
// Google Drive
// --------------------------------------------------

const drive = google.drive({
  version: "v3",
  auth: googleAuth,
});

// --------------------------------------------------
// Gmail
// --------------------------------------------------

const gmail = google.gmail({
  version: "v1",
  auth: googleAuth,
});

const GAMECRAFT_EMAIL =
  "pixelforgesupport2026@gmail.com";

// Comma-separated organiser/lecturer email addresses.
// Configure this in Vercel as:
// GAMECRAFT_ORGANIZER_EMAILS=lecturer1@example.com,lecturer2@example.com
const GAMECRAFT_ORGANIZER_EMAILS =
  (process.env.GAMECRAFT_ORGANIZER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

// --------------------------------------------------
// Constants
// --------------------------------------------------

const VALID_EVENTS = [
  "STRATEGY",
  "MARKETS",
  "MECHANISMS",
  "GOVERNANCE",
  "BOT ARENA",
  "GAMECRAFT",
];

const MAX_SCREENSHOT_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

// Teams can share campus Wi-Fi or a mobile hotspot, so a small per-IP limit
// blocks legitimate registrations after a few retries. This remains a bound
// on uploads while allowing normal shared-network use.
const REGISTRATION_RATE_LIMIT_MAX_ATTEMPTS = 20;
const REGISTRATION_RATE_LIMIT_WINDOW_MINUTES = 15;

// --------------------------------------------------
// Types
// --------------------------------------------------

type Member = {
  member_number: number;
  name: string;
  phone: string;
  email: string;
  github_username: string;
};

type RegistrationBody = {
  team_name: string;
  member_count: 3 | 4;
  state_city: string;
  members: Member[];
  event_short_names: string[];
};

function getSafeErrorDetails(error: unknown) {
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

  return {
    name: typeof candidate?.name === "string" ? candidate.name : "Error",
    message:
      typeof candidate?.message === "string"
        ? candidate.message
        : "Unknown error",
    code: candidate?.code,
    status: candidate?.status || candidate?.response?.status,
    reason: candidate?.response?.data?.error,
    description: candidate?.response?.data?.error_description,
  };
}

// --------------------------------------------------
// Validation helpers
// --------------------------------------------------

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return (
    digits.length >= 10 &&
    digits.length <= 15
  );
}

function isValidGitHubUsername(
  username: string
) {
  return /^[a-zA-Z0-9-]{1,39}$/.test(
    username
  );
}

function normalizeGitHub(value: string) {
  let username = value.trim();

  username = username.replace(
    /^https?:\/\/(www\.)?github\.com\//i,
    ""
  );

  username = username.replace(/\/+$/, "");

  return username;
}

// --------------------------------------------------
// Multipart helpers
// --------------------------------------------------

function getSingleField(
  field: string | string[] | undefined
): string | undefined {
  if (Array.isArray(field)) {
    return field[0];
  }

  return field;
}

function getSingleFile(
  file: File | File[] | undefined
): File | undefined {
  if (Array.isArray(file)) {
    return file[0];
  }

  return file;
}

function parseMultipartForm(
  req: VercelRequest
): Promise<{
  fields: Fields;
  files: Files;
}> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
      maxFiles: 1,
      maxFileSize: MAX_SCREENSHOT_SIZE,
      maxTotalFileSize:
        MAX_SCREENSHOT_SIZE,
      allowEmptyFiles: false,
      keepExtensions: true,
    });

    form.parse(
      req,
      (error, fields, files) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          fields,
          files,
        });
      }
    );
  });
}

// --------------------------------------------------
// Google Drive upload
// --------------------------------------------------

async function uploadPaymentScreenshot(
  file: File,
  registrationData: RegistrationBody,
  utrId: string
) {
  if (!file.filepath) {
    throw new Error(
      "Uploaded screenshot file is unavailable."
    );
  }

  const extension =
    file.originalFilename
      ?.split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const safeTeamName =
    registrationData.team_name
      .trim()
      .replace(
        /[^a-zA-Z0-9_-]+/g,
        "_"
      )
      .slice(0, 50);

  const fileName =
    `GAMECRAFT_2026_${safeTeamName}_${utrId}.${extension}`;

  const uploadResponse =
    await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [googleDriveFolderId],
      },

      media: {
        mimeType:
          file.mimetype ||
          "application/octet-stream",

        body: fs.createReadStream(
          file.filepath
        ),
      },

      fields:
        "id,name,mimeType,size",
    });

  const driveFileId =
    uploadResponse.data.id;

  if (!driveFileId) {
    throw new Error(
      "Google Drive did not return a file ID."
    );
  }

  const driveFileUrl =
    `https://drive.google.com/file/d/${driveFileId}/view`;

  return {
    driveFileId,
    driveFileUrl,
    fileName,
  };
}

// --------------------------------------------------
// Email helpers
// --------------------------------------------------

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function encodeGmailMessage(message: string) {
  return Buffer.from(message, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sendGmailMessage(
  recipientEmail: string,
  subject: string,
  plainText: string,
  html: string
) {
  const message = [
    `From: GAMECRAFT 2026 <${GAMECRAFT_EMAIL}>`,
    `To: ${recipientEmail}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="GAMECRAFT_BOUNDARY"',
    "",
    "--GAMECRAFT_BOUNDARY",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    plainText,
    "",
    "--GAMECRAFT_BOUNDARY",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    "--GAMECRAFT_BOUNDARY--",
  ].join("\r\n");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodeGmailMessage(message) },
  });
}

// --------------------------------------------------
// Email 1 - Registration confirmation
// --------------------------------------------------

async function sendRegistrationEmail(
  recipientEmail: string,
  registrationId: string,
  registrationData: RegistrationBody,
  utrId: string
) {
  const recipient = registrationData.members.find(
    (member) => member.email.toLowerCase() === recipientEmail.toLowerCase()
  );
  const name = recipient?.name || "Participant";
  const events = registrationData.event_short_names;

  const eventBadges = events.map((event) => `
    <span style="display:inline-block;margin:0 6px 6px 0;padding:8px 12px;background:#ff3b9d;color:#111;border:2px solid #111;font-size:12px;font-weight:900;">${escapeHtml(event)}</span>
  `).join("");

  const members = registrationData.members.map((member) => `
    <tr>
      <td style="padding:11px 8px;border-bottom:1px solid #ddd;font-weight:900;">${member.member_number}</td>
      <td style="padding:11px 8px;border-bottom:1px solid #ddd;">
        ${escapeHtml(member.name)}${member.member_number === 1 ? '<div style="font-size:10px;font-weight:900;color:#777;margin-top:3px;">TEAM LEAD</div>' : ""}
      </td>
      <td style="padding:11px 8px;border-bottom:1px solid #ddd;font-size:12px;word-break:break-word;">${escapeHtml(member.email)}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>GAMECRAFT 2026 | You're Officially In!</title></head><body style="margin:0;padding:0;background:#eee;font-family:Arial,Helvetica,sans-serif;color:#111"><div style="padding:28px 0"><div style="max-width:680px;margin:auto;background:#fff;border:3px solid #111">
    <div style="background:#ff3b9d;padding:30px 28px;border-bottom:3px solid #111"><div style="font-size:12px;font-weight:900;letter-spacing:2px">GAMECRAFT // 2026</div><div style="font-size:38px;line-height:1;font-weight:900;margin-top:14px">YOU'RE<br>OFFICIALLY IN.</div><div style="font-size:15px;line-height:1.6;font-weight:700;margin-top:16px">Your team is officially registered. The games are set. The challenge is on.</div></div>
    <div style="padding:30px 28px 34px"><p style="font-size:16px;font-weight:700;margin:0 0 10px">Hey ${escapeHtml(name)},</p><p style="font-size:15px;line-height:1.7;color:#333;margin:0">Your registration is confirmed and your team is now locked in for <strong>GAMECRAFT 2026</strong>.</p>
      <div style="margin:28px 0;padding:20px;background:#111;color:#fff;border:3px solid #111"><div style="font-size:10px;font-weight:900;letter-spacing:2px;color:#bbb">YOUR REGISTRATION</div><div style="font-size:30px;font-weight:900;margin-top:8px">${escapeHtml(registrationId)}</div><div style="font-size:13px;color:#ddd;margin-top:12px">Keep this ID safe for future GAMECRAFT communication.</div></div>
      <div style="margin-top:30px"><div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">YOUR TEAM</div><div style="border:2px solid #111;padding:18px;background:#fafafa"><div style="font-size:23px;font-weight:900">${escapeHtml(registrationData.team_name)}</div><div style="font-size:13px;line-height:1.8;color:#444;margin-top:10px"><strong>${registrationData.member_count}</strong> team members<br><strong>Location:</strong> ${escapeHtml(registrationData.state_city)}</div></div></div>
      <div style="margin-top:30px"><div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">YOUR SQUAD</div><table style="width:100%;border-collapse:collapse;border:2px solid #111"><thead><tr style="background:#f3f3f3"><th style="padding:10px;text-align:left;border-bottom:2px solid #111">#</th><th style="padding:10px;text-align:left;border-bottom:2px solid #111">NAME</th><th style="padding:10px;text-align:left;border-bottom:2px solid #111">EMAIL</th></tr></thead><tbody>${members}</tbody></table></div>
      <div style="margin-top:30px"><div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">WHAT YOU'RE PLAYING</div><div style="padding:16px;border:2px solid #111">${eventBadges}</div></div>
      <div style="margin-top:30px"><div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">PAYMENT RECEIVED</div><div style="padding:18px;border:2px solid #111;background:#fafafa;font-size:13px;line-height:2"><strong>Amount:</strong> INR 250<br><strong>Status:</strong> PAYMENT RECEIVED<br><strong>UTR / Transaction ID:</strong> ${escapeHtml(utrId)}</div></div>
      <div style="margin-top:30px;padding:22px;background:#111;color:#fff;border:3px solid #111"><div style="font-size:10px;font-weight:900;letter-spacing:2px;color:#bbb">SAVE THE DATE</div><div style="font-size:27px;font-weight:900;margin-top:8px">29-30 OCTOBER 2026</div><div style="font-size:13px;color:#ddd;margin-top:10px">Two days. Multiple challenges. One GAMECRAFT.</div></div>
      <div style="margin-top:30px;padding:20px;background:#ff3b9d;border:3px solid #111"><div style="font-size:12px;font-weight:900;letter-spacing:2px">WHAT'S NEXT?</div><div style="font-size:14px;line-height:1.7;font-weight:700;margin-top:10px">Your registration is locked in. Watch your inbox for the GAMECRAFT game plan, rules, schedule and official event updates.</div></div>
      <div style="margin-top:34px;text-align:center"><div style="font-size:28px;font-weight:900">LET THE GAMES BEGIN.</div><div style="font-size:13px;color:#666;margin-top:10px">Build. Compete. Strategize. Win.</div></div>
      <div style="margin-top:34px;padding-top:20px;border-top:2px solid #111;font-size:13px;color:#555;line-height:1.7">Questions?<br><strong style="color:#111">${GAMECRAFT_EMAIL}</strong></div>
    </div><div style="padding:20px 28px;background:#f3f3f3;border-top:3px solid #111;font-size:11px;font-weight:900;letter-spacing:1.5px">GAMECRAFT 2026 // DSATM<br><span style="font-weight:400;letter-spacing:0">WHERE STRATEGY MEETS INNOVATION</span></div>
  </div></div></body></html>`;

  const plainText = `GAMECRAFT 2026 | YOU'RE OFFICIALLY IN!\n\nHey ${name},\n\nYour team is officially registered for GAMECRAFT 2026.\n\nRegistration ID: ${registrationId}\nTeam: ${registrationData.team_name}\nTeam Size: ${registrationData.member_count}\nLocation: ${registrationData.state_city}\n\nYOUR SQUAD\n${registrationData.members.map((m) => `Member ${m.member_number}: ${m.name} - ${m.email}`).join("\n")}\n\nWHAT YOU'RE PLAYING\n${events.join(", ")}\n\nPAYMENT RECEIVED\nAmount: INR 250\nStatus: PAYMENT RECEIVED\nUTR / Transaction ID: ${utrId}\n\nSAVE THE DATE\n29-30 OCTOBER 2026\n\nLET THE GAMES BEGIN.\nBuild. Compete. Strategize. Win.\n\nQuestions: ${GAMECRAFT_EMAIL}`;

  await sendGmailMessage(recipientEmail, `GAMECRAFT 2026 | You're Officially In! | ${registrationId}`, plainText, html);
}

// --------------------------------------------------
// Email 2 - GAMECRAFT game plan
// --------------------------------------------------

async function sendGamePlanEmail(
  recipientEmail: string,
  registrationId: string,
  registrationData: RegistrationBody
) {
  const recipient = registrationData.members.find(
    (member) => member.email.toLowerCase() === recipientEmail.toLowerCase()
  );
  const name = recipient?.name || "Participant";
  const selectedEvents = registrationData.event_short_names;
  const descriptions: Record<string, string> = {
    STRATEGY: "Prisoner's Dilemma Arena - Nash equilibrium and dominant strategies.",
    MARKETS: "Live Auction Championship - Vickrey auctions, VCG and truthful bidding.",
    MECHANISMS: "Mechanism Design Hackathon - incentive compatibility and revelation principle.",
    GOVERNANCE: "Voting & Governance Challenge - social choice and Arrow's impossibility.",
    "BOT ARENA": "Multi-Agent Bot Arena - no-regret dynamics, multi-agent learning and price of anarchy.",
    GAMECRAFT: "GAMECRAFT Challenge - build, play and demo a playable game with a real strategy concept.",
  };

  const eventRows = selectedEvents.map((event, i) => `
    <div style="padding:14px;border:2px solid #111;margin-bottom:10px;background:${i % 2 === 0 ? "#ff3b9d" : "#f5f5f5"}"><strong>${escapeHtml(event)}</strong><div style="font-size:12px;color:#333;margin-top:5px;line-height:1.5">${escapeHtml(descriptions[event] || "Selected GAMECRAFT challenge.")}</div></div>
  `).join("");

  const scheduleRow = (time: string, item: string, highlight = false) => `<div style="padding:12px 14px;border-bottom:1px solid #ddd;${highlight ? "background:#ff3b9d;" : ""}"><strong>${time}</strong>&nbsp; ${item}</div>`;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>GAMECRAFT 2026 | Your Game Plan Starts Here</title></head><body style="margin:0;padding:0;background:#eee;font-family:Arial,Helvetica,sans-serif;color:#111"><div style="padding:28px 0"><div style="max-width:700px;margin:auto;background:#fff;border:3px solid #111">
    <div style="background:#111;color:#fff;padding:30px 28px;border-bottom:4px solid #ff3b9d"><div style="color:#ff3b9d;font-size:11px;font-weight:900;letter-spacing:2px">GAMECRAFT // 2026</div><div style="font-size:34px;line-height:1.05;font-weight:900;margin-top:14px">YOUR GAME PLAN<br>STARTS HERE.</div><div style="color:#ddd;font-size:14px;line-height:1.6;margin-top:14px">Hey ${escapeHtml(name)}. You're registered. Now here's what awaits your team inside the arena.</div></div>
    <div style="padding:30px 28px 36px"><div style="padding:18px;border:3px solid #111;background:#ff3b9d"><div style="font-size:10px;font-weight:900;letter-spacing:2px">TEAM</div><div style="font-size:25px;font-weight:900;margin-top:7px">${escapeHtml(registrationData.team_name)}</div><div style="font-size:12px;font-weight:700;margin-top:6px">Registration ID: ${escapeHtml(registrationId)}</div></div>
      <div style="margin-top:30px;text-align:center;padding:24px 18px;background:#111;color:#fff;border:3px solid #111"><div style="color:#bbb;font-size:10px;font-weight:900;letter-spacing:2px">THE MISSION</div><div style="font-size:22px;font-weight:900;margin-top:12px">ENTER &rarr; STRATEGIZE &rarr; BUILD &rarr; DEMO</div><div style="color:#ddd;font-size:12px;line-height:1.6;margin-top:12px">Choose your competitive events. Apply game theory under pressure. Build during the 30-hour challenge. Present, compete and defend your decisions.</div></div>
      <div style="margin-top:30px"><div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">YOUR SELECTED EVENTS</div>${eventRows}</div>
      <div style="margin-top:30px;padding:22px;background:#111;color:#fff;border:3px solid #111"><div style="color:#ff3b9d;font-size:10px;font-weight:900;letter-spacing:2px">GAMECRAFT CHALLENGE</div><div style="font-size:25px;font-weight:900;margin-top:8px">30-HOUR CONTINUOUS BUILD</div><div style="font-size:13px;color:#ddd;margin-top:10px">Build window: <strong style="color:#fff">10:30 Day 01 &rarr; 16:30 Day 02</strong></div></div>
      <div style="margin-top:30px"><div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">DAY 01 // STRATEGY &amp; MARKETS</div><div style="border:2px solid #111">${scheduleRow("08:30 - 09:00","Registration &amp; Team Check-in")}${scheduleRow("09:00 - 09:15","Welcome Address")}${scheduleRow("09:15 - 10:00","Inaugural Keynote")}${scheduleRow("10:00 - 10:30","GAMECRAFT Challenge - Briefing &amp; Kickoff",true)}${scheduleRow("10:30 - 12:00","Prisoner's Dilemma Arena")}${scheduleRow("12:00 - 13:00","Lunch Break")}${scheduleRow("13:00 - 15:00","Live Auction Championship")}${scheduleRow("15:00 - 15:15","Tea Break")}${scheduleRow("15:15 - 17:15","Mechanism Design Hackathon")}${scheduleRow("17:15 - 18:00","Panel: Game Theory in Industry")}${scheduleRow("18:00 onwards","Networking + Overnight Build",true)}</div></div>
      <div style="margin-top:30px"><div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">DAY 02 // SYSTEMS &amp; FINALE</div><div style="border:2px solid #111">${scheduleRow("08:15 - 09:00","Breakfast")}${scheduleRow("09:00 - 10:00","Voting &amp; Governance Challenge")}${scheduleRow("10:00 - 11:30","Multi-Agent Bot Arena")}${scheduleRow("11:30 - 11:45","Short Break")}${scheduleRow("13:30 - 14:15","Lunch Break")}${scheduleRow("14:15 - 16:30","GAMECRAFT Challenge - Final Build Time",true)}${scheduleRow("16:30","Submission Upload &amp; Setup Buffer")}${scheduleRow("17:00 - 18:30","Demo Expo")}${scheduleRow("18:30 - 19:00","Judges' Deliberation")}${scheduleRow("19:00 - 20:00","Awards Ceremony &amp; Closing",true)}</div></div>
      <div style="margin-top:30px;padding:20px;border:3px solid #111;background:#f5f5f5"><div style="font-size:12px;font-weight:900;letter-spacing:2px">KNOW BEFORE YOU PLAY</div><div style="font-size:13px;line-height:1.8;color:#333;margin-top:10px"><strong>Team size:</strong> 3-4 members<br><strong>Competitive events:</strong> Maximum 2<br><strong>GAMECRAFT Challenge:</strong> Excluded from the 2-event limit<br><strong>Eligibility:</strong> UG / PG students from recognized institutions<br><strong>College ID:</strong> Required<br><strong>Team lead:</strong> One designated lead per team</div></div>
      <div style="margin-top:30px;padding:20px;background:#ff3b9d;border:3px solid #111"><div style="font-size:12px;font-weight:900;letter-spacing:2px">JUDGING</div><div style="font-size:15px;font-weight:900;line-height:1.7;margin-top:8px">STRATEGIC FIDELITY &bull; PLAYABILITY &bull; EMERGENT STRATEGY &bull; POLISH</div></div>
      <div style="margin-top:30px;padding:22px;background:#111;color:#fff;text-align:center;border:3px solid #111"><div style="font-size:10px;color:#bbb;font-weight:900;letter-spacing:2px">EVENT</div><div style="font-size:26px;font-weight:900;margin-top:8px">29-30 OCTOBER 2026</div><div style="font-size:13px;color:#ddd;margin-top:6px">DAYANANDA SAGAR ACADEMY OF TECHNOLOGY AND MANAGEMENT</div></div>
      <div style="margin-top:30px;text-align:center"><a href="https://gamecraft-website.vercel.app/rulebook" style="display:inline-block;margin:4px;padding:13px 18px;background:#111;color:#fff;text-decoration:none;border:2px solid #111;font-size:12px;font-weight:900">OPEN RULEBOOK</a><a href="https://gamecraft-website.vercel.app/brochure" style="display:inline-block;margin:4px;padding:13px 18px;background:#ff3b9d;color:#111;text-decoration:none;border:2px solid #111;font-size:12px;font-weight:900">OPEN BROCHURE</a></div>
      <div style="margin-top:30px;padding-top:20px;border-top:2px solid #111;font-size:13px;color:#555;line-height:1.7">Questions?<br><strong style="color:#111">${GAMECRAFT_EMAIL}</strong></div><div style="margin-top:28px;text-align:center"><div style="font-size:27px;font-weight:900">SEE YOU IN THE ARENA.</div><div style="font-size:13px;color:#666;margin-top:8px">Strategy. Markets. Mechanisms. Beyond.</div></div>
    </div><div style="padding:20px 28px;background:#f3f3f3;border-top:3px solid #111;font-size:11px;font-weight:900;letter-spacing:1.5px">GAMECRAFT 2026 // DSATM</div>
  </div></div></body></html>`;

  const plainText = `GAMECRAFT 2026 | YOUR GAME PLAN STARTS HERE\n\nHey ${name},\n\nYou're registered. Now here's what awaits your team inside the arena.\n\nTEAM\n${registrationData.team_name}\nRegistration ID: ${registrationId}\n\nTHE MISSION\nENTER -> STRATEGIZE -> BUILD -> DEMO\n\nYOUR SELECTED EVENTS\n${selectedEvents.map((event) => `${event}: ${descriptions[event] || "Selected GAMECRAFT challenge."}`).join("\n")}\n\nGAMECRAFT CHALLENGE\n30-HOUR CONTINUOUS BUILD\n10:30 Day 01 -> 16:30 Day 02\n\nDAY 01 - STRATEGY & MARKETS\n08:30 - 09:00 Registration & Team Check-in\n09:00 - 09:15 Welcome Address\n09:15 - 10:00 Inaugural Keynote\n10:00 - 10:30 GAMECRAFT Challenge - Briefing & Kickoff\n10:30 - 12:00 Prisoner's Dilemma Arena\n12:00 - 13:00 Lunch Break\n13:00 - 15:00 Live Auction Championship\n15:00 - 15:15 Tea Break\n15:15 - 17:15 Mechanism Design Hackathon\n17:15 - 18:00 Panel: Game Theory in Industry\n18:00 onwards Networking + Overnight Build\n\nDAY 02 - SYSTEMS & FINALE\n08:15 - 09:00 Breakfast\n09:00 - 10:00 Voting & Governance Challenge\n10:00 - 11:30 Multi-Agent Bot Arena\n11:30 - 11:45 Short Break\n13:30 - 14:15 Lunch Break\n14:15 - 16:30 GAMECRAFT Challenge - Final Build Time\n16:30 Submission Upload & Setup Buffer\n17:00 - 18:30 Demo Expo\n18:30 - 19:00 Judges' Deliberation\n19:00 - 20:00 Awards Ceremony & Closing\n\nKNOW BEFORE YOU PLAY\nTeam size: 3-4 members\nCompetitive events: Maximum 2\nGAMECRAFT Challenge is excluded from the limit\nCollege ID required\n\nJUDGING\nStrategic Fidelity - Playability - Emergent Strategy - Polish\n\nEVENT\n29-30 OCTOBER 2026\nDAYANANDA SAGAR ACADEMY OF TECHNOLOGY AND MANAGEMENT\n\nRulebook: https://gamecraft-website.vercel.app/rulebook\nBrochure: https://gamecraft-website.vercel.app/brochure\n\nSEE YOU IN THE ARENA.\n${GAMECRAFT_EMAIL}`;

  await sendGmailMessage(recipientEmail, `GAMECRAFT 2026 | Your Game Plan Starts Here | ${registrationId}`, plainText, html);
}

// --------------------------------------------------
// Email 3 - New registration notification for organisers
// --------------------------------------------------

async function sendOrganizerRegistrationEmail(
  registrationId: string,
  registrationData: RegistrationBody,
  utrId: string,
  paymentScreenshotUrl: string
) {
  if (GAMECRAFT_ORGANIZER_EMAILS.length === 0) {
    throw new Error(
      "GAMECRAFT_ORGANIZER_EMAILS is not configured."
    );
  }

  const memberRows = registrationData.members
    .map(
      (member) => `
        <tr>
          <td style="padding:10px 8px;border:1px solid #ddd;font-weight:900;">
            ${member.member_number}
          </td>
          <td style="padding:10px 8px;border:1px solid #ddd;">
            ${escapeHtml(member.name)}
            ${
              member.member_number === 1
                ? '<div style="font-size:10px;font-weight:900;color:#777;margin-top:3px;">TEAM LEAD</div>'
                : ""
            }
          </td>
          <td style="padding:10px 8px;border:1px solid #ddd;word-break:break-word;">
            ${escapeHtml(member.email)}
          </td>
          <td style="padding:10px 8px;border:1px solid #ddd;">
            ${escapeHtml(member.phone)}
          </td>
          <td style="padding:10px 8px;border:1px solid #ddd;word-break:break-word;">
            ${escapeHtml(member.github_username)}
          </td>
        </tr>
      `
    )
    .join("");

  const eventBadges = registrationData.event_short_names
    .map(
      (event) => `
        <span style="display:inline-block;margin:0 6px 6px 0;padding:8px 12px;background:#ff3b9d;color:#111;border:2px solid #111;font-size:12px;font-weight:900;">
          ${escapeHtml(event)}
        </span>
      `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GAMECRAFT 2026 | New Registration</title>
</head>
<body style="margin:0;padding:0;background:#eee;font-family:Arial,Helvetica,sans-serif;color:#111">
  <div style="padding:28px 0">
    <div style="max-width:720px;margin:auto;background:#fff;border:3px solid #111">

      <div style="background:#ff3b9d;padding:30px 28px;border-bottom:3px solid #111">
        <div style="font-size:12px;font-weight:900;letter-spacing:2px">
          GAMECRAFT // 2026
        </div>
        <div style="font-size:36px;line-height:1;font-weight:900;margin-top:14px">
          NEW REGISTRATION.
        </div>
        <div style="font-size:15px;line-height:1.6;font-weight:700;margin-top:16px">
          A new team has successfully registered for GAMECRAFT 2026.
        </div>
      </div>

      <div style="padding:30px 28px 34px">

        <p style="font-size:16px;font-weight:700;margin:0 0 24px">
          Hello GAMECRAFT Team,
        </p>

        <p style="font-size:15px;line-height:1.7;color:#333;margin:0">
          A new registration has been successfully created. Below are the
          complete registration and payment details for your records.
        </p>

        <div style="margin-top:28px;padding:20px;background:#111;color:#fff;border:3px solid #111">
          <div style="font-size:10px;font-weight:900;letter-spacing:2px;color:#bbb">
            REGISTRATION
          </div>
          <div style="font-size:30px;font-weight:900;margin-top:8px">
            ${escapeHtml(registrationId)}
          </div>
        </div>

        <div style="margin-top:30px">
          <div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">
            TEAM DETAILS
          </div>

          <div style="border:2px solid #111;padding:18px;background:#fafafa;font-size:14px;line-height:2">
            <strong>Team Name:</strong> ${escapeHtml(registrationData.team_name)}<br>
            <strong>Team Size:</strong> ${registrationData.member_count}<br>
            <strong>Location:</strong> ${escapeHtml(registrationData.state_city)}
          </div>
        </div>

        <div style="margin-top:30px">
          <div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">
            TEAM MEMBERS
          </div>

          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;border:2px solid #111;font-size:12px">
              <thead>
                <tr style="background:#f3f3f3">
                  <th style="padding:10px 8px;border:1px solid #ddd;text-align:left">#</th>
                  <th style="padding:10px 8px;border:1px solid #ddd;text-align:left">NAME</th>
                  <th style="padding:10px 8px;border:1px solid #ddd;text-align:left">EMAIL</th>
                  <th style="padding:10px 8px;border:1px solid #ddd;text-align:left">PHONE</th>
                  <th style="padding:10px 8px;border:1px solid #ddd;text-align:left">GITHUB</th>
                </tr>
              </thead>
              <tbody>
                ${memberRows}
              </tbody>
            </table>
          </div>
        </div>

        <div style="margin-top:30px">
          <div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">
            SELECTED EVENTS
          </div>

          <div style="padding:16px;border:2px solid #111">
            ${eventBadges}
          </div>
        </div>

        <div style="margin-top:30px">
          <div style="font-size:12px;font-weight:900;letter-spacing:2px;margin-bottom:14px">
            PAYMENT
          </div>

          <div style="padding:18px;border:2px solid #111;background:#fafafa;font-size:13px;line-height:2">
            <strong>Amount:</strong> INR 250<br>
            <strong>Status:</strong> PAID<br>
            <strong>UTR / Transaction ID:</strong> ${escapeHtml(utrId)}
          </div>
        </div>

        <div style="margin-top:24px">
          <a
            href="${escapeHtml(paymentScreenshotUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            style="display:inline-block;padding:13px 18px;background:#ff3b9d;color:#111;text-decoration:none;border:2px solid #111;font-size:12px;font-weight:900;"
          >
            VIEW PAYMENT SCREENSHOT ↗
          </a>
        </div>

        <div style="margin-top:30px;padding:20px;background:#111;color:#fff;border:3px solid #111">
          <div style="font-size:10px;font-weight:900;letter-spacing:2px;color:#bbb">
            EVENT
          </div>
          <div style="font-size:25px;font-weight:900;margin-top:8px">
            29-30 OCTOBER 2026
          </div>
          <div style="font-size:13px;color:#ddd;margin-top:8px">
            DAYANANDA SAGAR ACADEMY OF TECHNOLOGY AND MANAGEMENT
          </div>
        </div>

        <div style="margin-top:30px;padding-top:20px;border-top:2px solid #111;font-size:13px;color:#555;line-height:1.7">
          This is an automated GAMECRAFT 2026 registration notification.
          <br>
          <strong style="color:#111">${GAMECRAFT_EMAIL}</strong>
        </div>

      </div>

      <div style="padding:20px 28px;background:#f3f3f3;border-top:3px solid #111;font-size:11px;font-weight:900;letter-spacing:1.5px">
        GAMECRAFT 2026 // DSATM
        <br>
        <span style="font-weight:400;letter-spacing:0">
          WHERE STRATEGY MEETS INNOVATION
        </span>
      </div>

    </div>
  </div>
</body>
</html>`;

  const plainText = `GAMECRAFT 2026 | NEW REGISTRATION

Hello GAMECRAFT Team,

A new team has successfully registered for GAMECRAFT 2026.

REGISTRATION
${registrationId}

TEAM DETAILS
Team Name: ${registrationData.team_name}
Team Size: ${registrationData.member_count}
Location: ${registrationData.state_city}

TEAM MEMBERS
${registrationData.members
  .map(
    (member) =>
      `Member ${member.member_number}: ${member.name} | ${member.email} | ${member.phone} | GitHub: ${member.github_username}`
  )
  .join("\n")}

SELECTED EVENTS
${registrationData.event_short_names.join(", ")}

PAYMENT
Amount: INR 250
Status: PAID
UTR / Transaction ID: ${utrId}

PAYMENT SCREENSHOT
${paymentScreenshotUrl}

EVENT
29-30 OCTOBER 2026
DAYANANDA SAGAR ACADEMY OF TECHNOLOGY AND MANAGEMENT

This is an automated GAMECRAFT 2026 registration notification.
${GAMECRAFT_EMAIL}`;

  await sendGmailMessage(
    GAMECRAFT_ORGANIZER_EMAILS.join(", "),
    `GAMECRAFT 2026 | New Registration | ${registrationId}`,
    plainText,
    html
  );
}

// --------------------------------------------------
// Registration rate limiting
// --------------------------------------------------

function getClientIp(req: VercelRequest): string {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = req.headers["x-real-ip"];

  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  return "unknown";
}

async function checkRegistrationRateLimit(
  req: VercelRequest
): Promise<boolean> {
  const clientIp = getClientIp(req);

  const { data, error } = await supabase.rpc(
    "check_registration_rate_limit",
    {
      p_ip_address: clientIp,
      p_max_attempts: REGISTRATION_RATE_LIMIT_MAX_ATTEMPTS,
      p_window_minutes: REGISTRATION_RATE_LIMIT_WINDOW_MINUTES,
    }
  );

  if (error) {
    console.error(
      "Registration rate-limit check failed:",
      getSafeErrorDetails(error)
    );

    throw new Error(
      "Registration rate-limit service unavailable."
    );
  }

  return data === true;
}

// --------------------------------------------------
// API handler
// --------------------------------------------------

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  // --------------------------------------------------
  // Registration rate limit
  // --------------------------------------------------
  // 20 POST attempts per IP within a 15-minute window.
  // This runs before multipart parsing and before any
  // Google Drive upload to reduce abuse/cost.
  try {
    const rateLimitAllowed =
      await checkRegistrationRateLimit(req);

    if (!rateLimitAllowed) {
      res.setHeader(
        "Retry-After",
        String(REGISTRATION_RATE_LIMIT_WINDOW_MINUTES * 60)
      );

      return res.status(429).json({
        success: false,
        error:
          "Too many registration attempts. Please try again in a few minutes.",
      });
    }
  } catch (rateLimitError) {
    console.error(
      "Registration rate-limit infrastructure error:",
      getSafeErrorDetails(rateLimitError)
    );

    return res.status(503).json({
      success: false,
      error:
        "Registration service is temporarily unavailable. Please try again shortly.",
    });
  }

  let uploadedDriveFileId:
    | string
    | null = null;

  try {
    // --------------------------------------------------
    // Parse multipart/form-data
    // --------------------------------------------------

    const {
      fields,
      files,
    } = await parseMultipartForm(req);

    const registrationJson =
      getSingleField(
        fields.registration
      );

    const utrId =
      getSingleField(
        fields.utr_id
      )?.trim();

    if (!registrationJson) {
      return res.status(400).json({
        success: false,
        error:
          "Registration data is required.",
      });
    }

    if (!utrId) {
      return res.status(400).json({
        success: false,
        error:
          "UTR ID is required.",
      });
    }

    if (
      utrId.length < 6 ||
      utrId.length > 100
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please enter a valid UTR ID.",
      });
    }

    let body: RegistrationBody;

    try {
      body =
        JSON.parse(
          registrationJson
        ) as RegistrationBody;
    } catch {
      return res.status(400).json({
        success: false,
        error:
          "Invalid registration data.",
      });
    }

    const paymentScreenshot =
      getSingleFile(
        files.payment_screenshot as
          | File
          | File[]
          | undefined
      );

    if (!paymentScreenshot) {
      return res.status(400).json({
        success: false,
        error:
          "Payment screenshot is required.",
      });
    }

    // --------------------------------------------------
    // Screenshot validation
    // --------------------------------------------------

    if (
      paymentScreenshot.size >
      MAX_SCREENSHOT_SIZE
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Payment screenshot must be 5 MB or smaller.",
      });
    }

    if (
      !paymentScreenshot.mimetype ||
      !ALLOWED_IMAGE_TYPES.has(
        paymentScreenshot.mimetype
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Payment screenshot must be a JPG, PNG, or WebP image.",
      });
    }

    // --------------------------------------------------
    // Team validation
    // --------------------------------------------------

    const teamName =
      body.team_name?.trim();

    const stateCity =
      body.state_city?.trim();

    const memberCount =
      body.member_count;

    const members =
      body.members;

    const events =
      body.event_short_names;

    if (
      !teamName ||
      teamName.length < 2 ||
      teamName.length > 100
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please enter a valid team name.",
      });
    }

    if (
      memberCount !== 3 &&
      memberCount !== 4
    ) {
      return res.status(400).json({
        success: false,
        error:
          "A team must have 3 or 4 members.",
      });
    }

    if (
      !stateCity ||
      stateCity.length < 2 ||
      stateCity.length > 150
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please enter your state and city.",
      });
    }

    // --------------------------------------------------
    // Member validation
    // --------------------------------------------------

    if (
      !Array.isArray(members) ||
      members.length !== memberCount
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Member information is incomplete.",
      });
    }

    const memberNumbers =
      members.map(
        (member) =>
          member.member_number
      );

    const expectedNumbers =
      Array.from(
        {
          length: memberCount,
        },
        (_, index) => index + 1
      );

    if (
      JSON.stringify(
        [...memberNumbers].sort(
          (a, b) => a - b
        )
      ) !==
      JSON.stringify(
        expectedNumbers
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid member numbering.",
      });
    }

    const normalizedMembers:
      Member[] = [];

    for (const member of members) {
      const name =
        member.name?.trim();

      const phone =
        member.phone?.trim();

      const email =
        member.email
          ?.trim()
          .toLowerCase();

      const githubUsername =
        normalizeGitHub(
          member.github_username ||
            ""
        );

      if (
        !name ||
        name.length < 2 ||
        name.length > 100
      ) {
        return res.status(400).json({
          success: false,
          error:
            `Invalid name for Member ${member.member_number}.`,
        });
      }

      if (
        !isValidPhone(phone)
      ) {
        return res.status(400).json({
          success: false,
          error:
            `Invalid phone number for Member ${member.member_number}.`,
        });
      }

      if (
        !isValidEmail(email)
      ) {
        return res.status(400).json({
          success: false,
          error:
            `Invalid email for Member ${member.member_number}.`,
        });
      }

      if (
        !isValidGitHubUsername(
          githubUsername
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            `Invalid GitHub username for Member ${member.member_number}.`,
        });
      }

      normalizedMembers.push({
        member_number:
          member.member_number,

        name,

        phone,

        email,

        github_username:
          githubUsername,
      });
    }

    // --------------------------------------------------
    // Prevent duplicate emails
    // --------------------------------------------------

    const emails =
      normalizedMembers.map(
        (member) =>
          member.email
      );

    if (
      new Set(emails).size !==
      emails.length
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Each team member must use a different email address.",
      });
    }

    // --------------------------------------------------
    // Event validation
    // --------------------------------------------------

    if (
      !Array.isArray(events) ||
      events.length < 1
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please select at least one event.",
      });
    }

    const uniqueEvents =
      [...new Set(events)];

    if (
      uniqueEvents.length !==
      events.length
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Duplicate events are not allowed.",
      });
    }

    const invalidEvents =
      uniqueEvents.filter(
        (event) =>
          !VALID_EVENTS.includes(
            event
          )
      );

    if (
      invalidEvents.length > 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "One or more selected events are invalid.",
      });
    }

    const competitiveEvents =
      uniqueEvents.filter(
        (event) =>
          event !== "GAMECRAFT"
      );

    if (
      competitiveEvents.length > 2
    ) {
      return res.status(400).json({
        success: false,
        error:
          "You can select a maximum of 2 competitive events.",
      });
    }

    if (!uniqueEvents.includes("GAMECRAFT")) {
      return res.status(400).json({
        success: false,
        error:
          "GameCraft Challenge is compulsory for every team.",
      });
    }

    // --------------------------------------------------
    // Upload screenshot to Google Drive
    // --------------------------------------------------

    const uploadResult =
      await uploadPaymentScreenshot(
        paymentScreenshot,
        {
          team_name: teamName,
          member_count: memberCount,
          state_city: stateCity,
          members:
            normalizedMembers,
          event_short_names:
            uniqueEvents,
        },
        utrId
      );

    uploadedDriveFileId =
      uploadResult.driveFileId;

    console.log(
      "Payment screenshot uploaded to Google Drive:",
      uploadResult.driveFileId
    );

    // --------------------------------------------------
    // Create registration in Supabase
    // --------------------------------------------------

    const {
      data,
      error,
    } = await supabase.rpc(
      "create_registration",
      {
        p_team_name:
          teamName,

        p_member_count:
          memberCount,

        p_state_city:
          stateCity,

        p_members:
          normalizedMembers,

        p_event_short_names:
          uniqueEvents,

        p_utr_id:
          utrId,

        p_screenshot_drive_id:
          uploadResult.driveFileId,

        p_screenshot_drive_url:
          uploadResult.driveFileUrl,
      }
    );

    if (error) {
      console.error(
        "Registration database error:",
        getSafeErrorDetails(error)
      );

      // --------------------------------------------------
      // Remove orphaned Drive file
      // --------------------------------------------------

      try {
        await drive.files.delete({
          fileId:
            uploadResult.driveFileId,
        });

        console.log(
          "Removed orphaned Google Drive file:",
          uploadResult.driveFileId
        );
      } catch (deleteError) {
        console.error(
          "Failed to remove orphaned Drive file:",
          getSafeErrorDetails(deleteError)
        );
      }

      uploadedDriveFileId =
        null;

      return res.status(500).json({
        success: false,
        error:
          "Unable to create registration.",
      });
    }

    // --------------------------------------------------
    // Registration succeeded
    // --------------------------------------------------

    const registrationId =
      data as string;

    console.log(
      "Registration created successfully:",
      registrationId
    );

    // --------------------------------------------------
    // Send confirmation emails
    //
    // IMPORTANT:
    // Email failure does NOT fail registration.
    // --------------------------------------------------

    const registrationEmailData:
      RegistrationBody = {
      team_name: teamName,
      member_count:
        memberCount,
      state_city:
        stateCity,
      members:
        normalizedMembers,
      event_short_names:
        uniqueEvents,
    };

    const emailJobs = normalizedMembers.flatMap((member) => [
      sendRegistrationEmail(
        member.email,
        registrationId,
        registrationEmailData,
        utrId
      ),
      sendGamePlanEmail(
        member.email,
        registrationId,
        registrationEmailData
      ),
    ]);

    // Notify all configured organisers after the registration succeeds.
    // Email failures never roll back a successful registration.
    emailJobs.push(
      sendOrganizerRegistrationEmail(
        registrationId,
        registrationEmailData,
        utrId,
        uploadResult.driveFileUrl
      )
    );

    // Do not make a completed registration wait for several Gmail requests.
    // On serverless hosting, that can turn a successful database write into a
    // browser timeout and invite duplicate retries. Delivery remains best effort.
    void Promise.allSettled(emailJobs).then((emailResults) => {
      emailResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log("GAMECRAFT email sent:", index + 1);
        } else {
          console.error(
            "GAMECRAFT email failed:",
            index + 1,
            getSafeErrorDetails(result.reason)
          );
        }
      });
    });

    // --------------------------------------------------
    // Final response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      registration_id:
        registrationId,
      payment_status: "PAID",
      amount: 250,
      currency: "INR",
    });
  } catch (error) {
    console.error(
      "Registration API error:",
      getSafeErrorDetails(error)
    );

    const safeErrorDetails =
      getSafeErrorDetails(error);

    // --------------------------------------------------
    // Best-effort Drive cleanup
    // --------------------------------------------------

    if (uploadedDriveFileId) {
      try {
        await drive.files.delete({
          fileId:
            uploadedDriveFileId,
        });

        console.log(
          "Cleaned up Google Drive file after failure:",
          uploadedDriveFileId
        );
      } catch (deleteError) {
        console.error(
          "Failed to clean up Drive file:",
          getSafeErrorDetails(deleteError)
        );
      }
    }

    const isUploadFailure =
      /drive|oauth|upload|google|gaxios|invalid_grant/i.test(
        JSON.stringify(safeErrorDetails)
      );

    return res.status(502).json({
      success: false,
      error:
        isUploadFailure
          ? "Payment screenshot upload is unavailable because the organizer Google connection needs renewal. Your registration was not created. Please contact the organizers rather than retrying."
          : "Registration could not be processed. Your registration was not created; please try again in a few minutes.",
    });
  }
}
