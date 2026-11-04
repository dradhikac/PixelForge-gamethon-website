import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { events } from "../data/events";
import "./Registration.css";

type Member = {
  name: string;
  phone: string;
  email: string;
  github_username: string;
};

type RegistrationPayload = {
  team_name: string;
  member_count: 3 | 4;
  state_city: string;
  members: Member[];
  event_short_names: string[];
};

type RegistrationResponse = {
  success: boolean;
  registration_id?: string;
  payment_status?: string;
  amount?: number;
  currency?: string;
  error?: string;
};

const EVENT_SHORT_NAMES: Record<string, string> = {
  "prisoners-dilemma": "STRATEGY",
  "auction-championship": "MARKETS",
  "mechanism-design": "MECHANISMS",
  "voting-governance": "GOVERNANCE",
  "bot-arena": "BOT ARENA",
  "gamecraft-challenge": "GAMECRAFT",
};

const GAMECRAFT_EVENT_ID = "gamecraft-challenge";

const createMember = (): Member => ({
  name: "",
  phone: "",
  email: "",
  github_username: "",
});

const Registration = () => {
  const [teamName, setTeamName] = useState("");
  const [memberCount, setMemberCount] = useState<3 | 4>(3);
  const [stateCity, setStateCity] = useState("");

  const [members, setMembers] = useState<Member[]>([
    createMember(),
    createMember(),
    createMember(),
  ]);

  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    GAMECRAFT_EVENT_ID,
  ]);

  const [step, setStep] = useState(1);

  // Payment
  const [utrId, setUtrId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const submissionInFlightRef = useRef(false);
  const [error, setError] = useState("");

  const [registrationResult, setRegistrationResult] =
    useState<RegistrationResponse | null>(null);

  const competitiveEvents = useMemo(
    () =>
      selectedEvents.filter(
        (eventId) => eventId !== GAMECRAFT_EVENT_ID
      ),
    [selectedEvents]
  );

  const updateMember = (
    index: number,
    field: keyof Member,
    value: string
  ) => {
    setMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index
          ? { ...member, [field]: value }
          : member
      )
    );
  };

  const changeMemberCount = (count: 3 | 4) => {
    setMemberCount(count);

    setMembers((current) => {
      if (count === 4 && current.length === 3) {
        return [...current, createMember()];
      }

      return current.slice(0, count);
    });
  };

  const toggleEvent = (eventId: string) => {
    if (eventId === GAMECRAFT_EVENT_ID) {
      return;
    }

    setSelectedEvents((current) => {
      if (current.includes(eventId)) {
        return current.filter((id) => id !== eventId);
      }

      if (competitiveEvents.length >= 2) {
        return current;
      }

      return [...current, eventId];
    });
  };

  const validateTeam = () => {
    if (teamName.trim().length < 2) {
      setError("Please enter a valid team name.");
      return false;
    }

    if (stateCity.trim().length < 2) {
      setError("Please enter your state and city.");
      return false;
    }

    setError("");
    return true;
  };

  const validateMembers = () => {
    for (let index = 0; index < members.length; index++) {
      const member = members[index];

      if (member.name.trim().length < 2) {
        setError(
          `Please enter the name of Member ${index + 1}.`
        );
        return false;
      }

      if (!member.phone.trim()) {
        setError(
          `Please enter the phone number of Member ${
            index + 1
          }.`
        );
        return false;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          member.email.trim()
        )
      ) {
        setError(
          `Please enter a valid email for Member ${
            index + 1
          }.`
        );
        return false;
      }

      if (!member.github_username.trim()) {
        setError(
          `Please enter the GitHub username of Member ${
            index + 1
          }.`
        );
        return false;
      }
    }

    const emails = members.map((member) =>
      member.email.trim().toLowerCase()
    );

    if (new Set(emails).size !== emails.length) {
      setError(
        "Each team member must use a different email address."
      );
      return false;
    }

    setError("");
    return true;
  };

  const validateEvents = () => {
    if (!selectedEvents.includes(GAMECRAFT_EVENT_ID)) {
      setError(
        "GameCraft Challenge is compulsory for every team."
      );
      return false;
    }

    if (competitiveEvents.length > 2) {
      setError(
        "You can select a maximum of 2 competitive events."
      );
      return false;
    }

    setError("");
    return true;
  };

  const validatePayment = () => {
    if (!utrId.trim()) {
      setError("Please enter your UTR / transaction ID.");
      return false;
    }

    if (utrId.trim().length < 6) {
      setError("Please enter a valid UTR / transaction ID.");
      return false;
    }

    if (!paymentScreenshot) {
      setError(
        "Please upload a screenshot of your successful payment."
      );
      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(paymentScreenshot.type)) {
      setError(
        "Please upload a JPG, PNG, or WebP payment screenshot."
      );
      return false;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (paymentScreenshot.size > maxFileSize) {
      setError(
        "Payment screenshot must be smaller than 5 MB."
      );
      return false;
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    setError("");

    if (step === 1 && !validateTeam()) {
      return;
    }

    if (step === 2 && !validateMembers()) {
      return;
    }

    if (step === 3 && !validateEvents()) {
      return;
    }

    setStep((current) => Math.min(current + 1, 4));
  };

  const previousStep = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  };

  const submitRegistration = async () => {
    if (submissionInFlightRef.current) {
      return;
    }

    if (!validateEvents()) {
      return;
    }

    if (!validatePayment()) {
      return;
    }

    submissionInFlightRef.current = true;
    setSubmitting(true);
    setError("");

    const payload: RegistrationPayload = {
      team_name: teamName.trim(),
      member_count: memberCount,
      state_city: stateCity.trim(),

      members: members.map((member, index) => ({
        member_number: index + 1,
        name: member.name.trim(),
        phone: member.phone.trim(),
        email: member.email.trim().toLowerCase(),
        github_username: member.github_username
          .trim()
          .replace(
            /^https?:\/\/(www\.)?github\.com\//i,
            ""
          )
          .replace(/\/+$/, ""),
      })),

      event_short_names: selectedEvents.map(
        (eventId) => EVENT_SHORT_NAMES[eventId]
      ),
    };

    try {
      /*
       * We are using FormData because the request now contains:
       *
       * 1. Registration data
       * 2. UTR ID
       * 3. Payment screenshot
       *
       * The backend will later upload the screenshot to Google Drive.
       */

      const formData = new FormData();

      formData.append(
        "registration",
        JSON.stringify(payload)
      );

      formData.append("utr_id", utrId.trim());

      if (paymentScreenshot) {
        formData.append(
          "payment_screenshot",
          paymentScreenshot
        );
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      let result: RegistrationResponse | null = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText) as RegistrationResponse;
        } catch {
          // A serverless crash may return HTML instead of the API's JSON shape.
        // Preserve the status-based message below rather than hiding the failure.
        }
      }

      if (!response.ok || !result?.success) {
        if (response.status === 429) {
          throw new Error(
            result?.error ||
              "Registration attempts are temporarily limited. Please wait a few minutes before trying again."
          );
        }

        if (response.status >= 500) {
          throw new Error(
            result?.error ||
              "Registration service is temporarily unavailable. Your payment has not been submitted; please try again in a few minutes."
          );
        }

        throw new Error(
          result?.error ||
            "Unable to complete registration."
        );
      }

      setRegistrationResult(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing registration."
      );
    } finally {
      submissionInFlightRef.current = false;
      setSubmitting(false);
    }
  };

  /* =========================
     SUCCESS SCREEN
  ========================= */

  if (registrationResult?.success) {
    return (
      <section className="registration-page">
        <div className="registration-grid"></div>

        <div className="registration-container">
          <motion.div
            className="registration-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="registration-success-code">
              REGISTRATION // CONFIRMED
            </div>

            <h1>
              WELCOME TO THE <span>ARENA</span>
            </h1>

            <p>
              Your team registration and payment details
              have been received successfully.
            </p>

            <div className="registration-id-box">
              <span>REGISTRATION ID</span>
              <strong>
                {registrationResult.registration_id}
              </strong>
            </div>

            <div className="registration-payment">
              <strong>PAYMENT</strong>
              <span>PAID</span>
            </div>

            <p className="registration-success-note">
              Your registration details and payment
              information have been recorded. A copy of
              your registration details will be sent to
              the registered email address.
            </p>

            <a
              href="/"
              className="registration-button"
            >
              RETURN TO HQ
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  /* =========================
     REGISTRATION FORM
  ========================= */

  return (
    <section className="registration-page">
      <div className="registration-grid"></div>

      <div className="registration-container">
        {/* Header */}

        <motion.div
          className="registration-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="registration-code">
            GAMECRAFT // 2026 // TEAM REGISTRATION
          </div>

          <h1>
            ENTER THE <span>ARENA</span>
          </h1>

          <p>
            Register your team for GAMECRAFT 2026.
            <br />
            Registration fee: ₹250 per team.
          </p>
          <div className="registration-deadline">
            <span className="registration-deadline-label">
              REGISTRATION DEADLINE
            </span>
            <span className="registration-deadline-date">
              20 OCTOBER 2026
            </span>
          </div>
        </motion.div>

        {/* Progress */}

        <div className="registration-progress">
          {[1, 2, 3, 4].map((number) => (
            <div
              key={number}
              className={`progress-step ${
                step >= number ? "active" : ""
              }`}
            >
              <span>0{number}</span>
              <div></div>
            </div>
          ))}
        </div>

        {/* Card */}

        <motion.div
          className="registration-card"
          key={step}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* =========================
              STEP 1
          ========================= */}

          {step === 1 && (
            <>
              <div className="form-section-label">
                SECTOR 01 // TEAM INTEL
              </div>

              <h2>TEAM DETAILS</h2>

              <label>
                TEAM NAME

                <input
                  value={teamName}
                  onChange={(event) =>
                    setTeamName(event.target.value)
                  }
                  placeholder="Enter your team name"
                  maxLength={100}
                />
              </label>

              <label>
                TEAM SIZE

                <div className="member-count-selector">
                  {[3, 4].map((count) => (
                    <button
                      type="button"
                      key={count}
                      className={
                        memberCount === count
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        changeMemberCount(
                          count as 3 | 4
                        )
                      }
                    >
                      {count} MEMBERS
                    </button>
                  ))}
                </div>
              </label>

              <label>
                STATE & CITY

                <input
                  value={stateCity}
                  onChange={(event) =>
                    setStateCity(event.target.value)
                  }
                  placeholder="e.g. Karnataka, Bengaluru"
                  maxLength={150}
                />
              </label>
            </>
          )}

          {/* =========================
              STEP 2
          ========================= */}

          {step === 2 && (
            <>
              <div className="form-section-label">
                SECTOR 02 // PLAYER INTEL
              </div>

              <h2>TEAM MEMBERS</h2>

              <p className="form-helper">
                Member 1 is automatically designated as
                the Team Lead.
              </p>

              <div className="members-list">
                {members.map((member, index) => (
                  <div
                    className="member-block"
                    key={index}
                  >
                    <div className="member-heading">
                      <span>
                        MEMBER 0{index + 1}
                      </span>

                      {index === 0 && (
                        <strong>TEAM LEAD</strong>
                      )}
                    </div>

                    <label>
                      FULL NAME

                      <input
                        value={member.name}
                        onChange={(event) =>
                          updateMember(
                            index,
                            "name",
                            event.target.value
                          )
                        }
                        placeholder="Full name"
                      />
                    </label>

                    <label>
                      PHONE

                      <input
                        value={member.phone}
                        onChange={(event) =>
                          updateMember(
                            index,
                            "phone",
                            event.target.value
                          )
                        }
                        placeholder="Phone number"
                        inputMode="tel"
                      />
                    </label>

                    <label>
                      EMAIL

                      <input
                        value={member.email}
                        onChange={(event) =>
                          updateMember(
                            index,
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="Email address"
                        type="email"
                      />
                    </label>

                    <label>
                      GITHUB USERNAME

                      <input
                        value={member.github_username}
                        onChange={(event) =>
                          updateMember(
                            index,
                            "github_username",
                            event.target.value
                          )
                        }
                        placeholder="github username or profile URL"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* =========================
              STEP 3
          ========================= */}

          {step === 3 && (
            <>
              <div className="form-section-label">
                SECTOR 03 // EVENT LOADOUT
              </div>

              <h2>SELECT YOUR EVENTS</h2>

              <p className="form-helper">
                GameCraft Challenge is compulsory. Select
                up to 2 additional competitive events.
              </p>

              <div className="event-selection">
                {events.map((event) => {
                  const selected =
                    selectedEvents.includes(event.id);

                  const isGamecraft =
                    event.id === GAMECRAFT_EVENT_ID;

                  const disabled =
                    !selected &&
                    !isGamecraft &&
                    competitiveEvents.length >= 2;

                  return (
                    <button
                      type="button"
                      key={event.id}
                      className={`event-option ${
                        selected ? "selected" : ""
                      } ${
                        disabled ? "disabled" : ""
                      } ${
                        isGamecraft ? "required" : ""
                      }`}
                      onClick={() =>
                        !disabled &&
                        toggleEvent(event.id)
                      }
                      style={
                        {
                          "--event-color":
                            event.color,
                        } as CSSProperties
                      }
                    >
                      <div className="event-option-top">
                        <span>{event.number}</span>

                        <span>
                          {isGamecraft
                            ? "COMPULSORY"
                            : selected
                              ? "SELECTED"
                              : "AVAILABLE"}
                        </span>
                      </div>

                      <div className="event-option-district">
                        {event.district}
                      </div>

                      <h3>{event.title}</h3>

                      <p>{event.description}</p>

                      <div className="event-option-footer">
                        {isGamecraft
                          ? "COMPULSORY 30-HOUR BUILD CHALLENGE"
                          : "COMPETITIVE EVENT"}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="event-counter">
                ADDITIONAL COMPETITIVE EVENTS:{" "}
                <strong>
                  {competitiveEvents.length}/2
                </strong>
              </div>
            </>
          )}

          {/* =========================
              STEP 4
          ========================= */}

          {step === 4 && (
            <>
              <div className="form-section-label">
                SECTOR 04 // FINAL CHECK
              </div>

              <h2>REVIEW REGISTRATION</h2>

              {/* Team Review */}

              <div className="review-section">
                <div className="review-row">
                  <span>TEAM</span>
                  <strong>{teamName}</strong>
                </div>

                <div className="review-row">
                  <span>TEAM SIZE</span>
                  <strong>
                    {memberCount} MEMBERS
                  </strong>
                </div>

                <div className="review-row">
                  <span>LOCATION</span>
                  <strong>{stateCity}</strong>
                </div>
              </div>

              {/* Members */}

              <div className="review-section">
                <div className="review-heading">
                  MEMBERS
                </div>

                {members.map((member, index) => (
                  <div
                    className="review-member"
                    key={index}
                  >
                    <span>
                      0{index + 1}
                      {index === 0
                        ? " // LEAD"
                        : ""}
                    </span>

                    <strong>{member.name}</strong>
                  </div>
                ))}
              </div>

              {/* Events */}

              <div className="review-section">
                <div className="review-heading">
                  SELECTED EVENTS
                </div>

                {selectedEvents.map((eventId) => {
                  const event = events.find(
                    (item) => item.id === eventId
                  );

                  return (
                    <div
                      className="review-member"
                      key={eventId}
                    >
                      <span>{event?.number}</span>
                      <strong>
                        {event?.title}
                      </strong>
                    </div>
                  );
                })}
              </div>

              {/* Fee */}

              <div className="registration-fee">
                <span>REGISTRATION FEE</span>
                <strong>₹250 / TEAM</strong>
              </div>

              {/* =========================
                  PAYMENT
              ========================= */}

              <div className="payment-section">
                <div className="form-section-label">
                  PAYMENT // ₹250 PER TEAM
                </div>

                <h2>COMPLETE PAYMENT</h2>

                <p className="form-helper">
                  Scan the QR code below using any UPI
                  app to complete your registration
                  payment.
                </p>

                {/* QR */}

                <div className="payment-qr-wrapper">
                  <img
                    src="/gamecraft-payment-qr.jpg"
                    alt="GAMECRAFT 2026 payment QR code"
                    className="payment-qr"
                  />
                </div>

                <p className="payment-instruction">
                  After completing the payment, enter
                  the UTR / transaction ID and upload
                  a screenshot of the successful
                  payment.
                </p>

                {/* UTR */}

                <label>
                  UTR / TRANSACTION ID

                  <input
                    type="text"
                    value={utrId}
                    onChange={(event) =>
                      setUtrId(event.target.value)
                    }
                    placeholder="Enter your UTR / transaction ID"
                    maxLength={100}
                    autoComplete="off"
                  />
                </label>

                {/* Screenshot */}

                <label>
                  PAYMENT SCREENSHOT

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0] ||
                        null;

                      setPaymentScreenshot(file);
                    }}
                  />
                </label>

                {paymentScreenshot && (
                  <div className="payment-file-name">
                    ✓ {paymentScreenshot.name}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Error */}

          {error && (
            <div className="registration-error">
              ERROR // {error}
            </div>
          )}

          {/* Actions */}

          <div className="registration-actions">
            {step > 1 && (
              <button
                type="button"
                className="secondary-button"
                onClick={previousStep}
                disabled={submitting}
              >
                ← BACK
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                className="primary-button"
                onClick={nextStep}
              >
                CONTINUE →
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={submitRegistration}
                disabled={submitting}
              >
                {submitting
                  ? "TRANSMITTING..."
                  : "SUBMIT REGISTRATION →"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Footer */}

        <div className="registration-footer">
          GAMECRAFT 2026 // DSATM // WHERE STRATEGY
          MEETS INNOVATION
        </div>
      </div>
    </section>
  );
};

export default Registration;
