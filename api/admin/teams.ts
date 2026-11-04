import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 8; // 8 hours

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Missing Supabase server environment variables."
  );
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

type PaymentRow = {
  team_id: string | null;
  amount: number | string | null;
  currency: string | null;
  status: string | null;
  utr_id: string | null;
  screenshot_drive_id: string | null;
  screenshot_drive_url: string | null;
  created_at: string | null;
};

const createSignature = (
  payload: string,
  secret: string
) => {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
};

const isAuthenticated = (req: VercelRequest) => {
  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret) {
    return false;
  }

  const cookies = req.headers.cookie || "";

  const sessionCookie = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) =>
      cookie.startsWith(`${COOKIE_NAME}=`)
    );

  if (!sessionCookie) {
    return false;
  }

  const token = sessionCookie.substring(
    `${COOKIE_NAME}=`.length
  );

  const parts = token.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const [timestamp, signature] = parts;

  if (!timestamp || !signature) {
    return false;
  }

  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber)) {
    return false;
  }

  const age = Date.now() - timestampNumber;

  if (
    age < 0 ||
    age > SESSION_DURATION * 1000
  ) {
    return false;
  }

  const expectedSignature = createSignature(
    timestamp,
    sessionSecret
  );

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // --------------------------------------------------
  // Method check
  // --------------------------------------------------

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  // --------------------------------------------------
  // Admin authentication
  // --------------------------------------------------

  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized.",
    });
  }

  try {
    // --------------------------------------------------
    // Fetch team registrations
    // --------------------------------------------------

    const {
      data: teams,
      error: teamsError,
    } = await supabase
      .from("team_registration_details")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (teamsError) {
      console.error(
        "Admin teams error:",
        teamsError
      );

      return res.status(500).json({
        success: false,
        error:
          "Unable to retrieve registrations.",
      });
    }

    // --------------------------------------------------
    // No registrations
    // --------------------------------------------------

    if (!teams || teams.length === 0) {
      return res.status(200).json({
        success: true,
        teams: [],
      });
    }

    // --------------------------------------------------
    // Get team IDs
    // --------------------------------------------------

    const teamIds = teams
      .map((team) => team.team_id)
      .filter(
        (teamId): teamId is string =>
          typeof teamId === "string" &&
          teamId.length > 0
      );

    // --------------------------------------------------
    // Fetch payment details
    // --------------------------------------------------
    //
    // The registration view contains the basic
    // payment information, but the UTR and payment
    // screenshot URL are stored in public.payments.
    //
    // Fetch them server-side using the Supabase
    // secret key. This endpoint is already protected
    // by the signed admin session above.
    // --------------------------------------------------

    const {
      data: paymentRows,
      error: paymentsError,
    } = await supabase
      .from("payments")
      .select(
        [
          "team_id",
          "amount",
          "currency",
          "status",
          "utr_id",
          "screenshot_drive_id",
          "screenshot_drive_url",
          "created_at",
        ].join(", ")
      )
      .in("team_id", teamIds)
      .order("created_at", {
        ascending: false,
      });

    if (paymentsError) {
      console.error(
        "Admin payments error:",
        paymentsError
      );

      return res.status(500).json({
        success: false,
        error:
          "Unable to retrieve payment details.",
      });
    }

    // --------------------------------------------------
    // Map payments by team ID
    // --------------------------------------------------

    const paymentByTeamId = new Map<string, PaymentRow>();

    // This project does not include generated Supabase database types, so the
    // client falls back to GenericStringError for table rows. The selected
    // columns are validated below before being sent to the admin dashboard.
    const typedPaymentRows =
      (paymentRows || []) as unknown as PaymentRow[];

    for (const payment of typedPaymentRows) {
      if (
        typeof payment.team_id !== "string"
      ) {
        continue;
      }

      // Keep the newest payment record if, for
      // any reason, multiple records exist.
      if (
        !paymentByTeamId.has(
          payment.team_id
        )
      ) {
        paymentByTeamId.set(
          payment.team_id,
          {
            team_id: payment.team_id,
            amount:
              typeof payment.amount ===
              "number"
                ? payment.amount
                : Number(
                    payment.amount || 0
                  ),
            currency:
              payment.currency || "INR",
            status:
              payment.status || "",
            utr_id:
              payment.utr_id || null,
            screenshot_drive_id:
              payment.screenshot_drive_id ||
              null,
            screenshot_drive_url:
              payment.screenshot_drive_url ||
              null,
            created_at:
              payment.created_at || "",
          }
        );
      }
    }

    // --------------------------------------------------
    // Merge payment details into teams
    // --------------------------------------------------

    const enrichedTeams = teams.map(
      (team) => {
        const payment =
          typeof team.team_id === "string"
            ? paymentByTeamId.get(
                team.team_id
              )
            : undefined;

        return {
          ...team,

          payment:
            payment ||
            team.payment ||
            null,
        };
      }
    );

    // --------------------------------------------------
    // Return admin data
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      teams: enrichedTeams,
    });
  } catch (error) {
    console.error(
      "Admin API error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Something went wrong.",
    });
  }
}
