import { useEffect, useRef, useState } from 'react';
import './Admin.css';

type Member = {
  member_number: number;
  name: string;
  phone: string;
  email: string;
  github_username: string;
  is_team_lead: boolean;
};

type Event = {
  name: string;
  short_name: string;
  is_gamecraft_challenge: boolean;
};

type Payment = {
  team_id?: string;
  amount: number;
  currency: string;
  status: string;
  utr_id: string | null;
  screenshot_drive_id: string | null;
  screenshot_drive_url: string | null;
  created_at?: string;
};

type Team = {
  team_id: string;
  registration_id: string;
  team_name: string;
  member_count: number;
  state_city: string;
  payment_status: string;
  created_at: string;
  members: Member[];
  events: Event[];
  payment: Payment | null;
};

const Admin = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] =
    useState<Team | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin authentication
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Prevent the initial auth check from overwriting
  // the authenticated state after a successful login.
  const loginInProgressRef = useRef(false);

  const loadTeams = async (
    options: {
      initialCheck?: boolean;
    } = {}
  ) => {
    const { initialCheck = false } = options;

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/admin/teams', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const text = await response.text();

      let data: {
        success?: boolean;
        error?: string;
        teams?: Team[];
      } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          console.error(
            'Teams API returned non-JSON response:',
            text
          );

          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }
      }

      // No valid admin session.
      //
      // Only the initial auth check is allowed to establish
      // the logged-out state. This prevents an older request
      // from racing with a successful login.
      if (response.status === 401) {
        if (
          initialCheck &&
          !loginInProgressRef.current
        ) {
          setAuthenticated(false);
        }

        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Unable to load teams.'
        );
      }

      setTeams(data.teams || []);
      setAuthenticated(true);
    } catch (err) {
      console.error('Load teams error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load teams.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial authentication check
   */
  useEffect(() => {
    loadTeams({
      initialCheck: true,
    });
  }, []);

  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setLoginError('');
    setError('');

    loginInProgressRef.current = true;

    try {
      const response = await fetch(
        '/api/admin/login',
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const text = await response.text();

      let data: {
        success?: boolean;
        error?: string;
      } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          console.error(
            'Login API returned non-JSON response:',
            text
          );

          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }
      }

      if (!response.ok || !data.success) {
        setLoginError(
          data.error || 'Invalid password.'
        );

        return;
      }

      /*
       * Login succeeded.
       *
       * The browser has received the admin_session
       * cookie from /api/admin/login.
       */
      setPassword('');
      setShowPassword(false);

      /*
       * Now verify the newly-created session by
       * loading the protected admin data.
       */
      await loadTeams({
        initialCheck: false,
      });
    } catch (err) {
      console.error('Login error:', err);

      setLoginError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the server.'
      );
    } finally {
      loginInProgressRef.current = false;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    setAuthenticated(false);
    setTeams([]);
    setSelectedTeam(null);
    setSearch('');
    setError('');
    setLoginError('');
    setPassword('');
    setShowPassword(false);
  };

  const filteredTeams = teams.filter((team) => {
    const query = search.toLowerCase();

    return (
      team.registration_id
        .toLowerCase()
        .includes(query) ||
      team.team_name
        .toLowerCase()
        .includes(query) ||
      team.state_city
        .toLowerCase()
        .includes(query) ||
      team.members.some(
        (member) =>
          member.email
            .toLowerCase()
            .includes(query) ||
          member.name
            .toLowerCase()
            .includes(query)
      )
    );
  });

  /*
   * Initial authentication check
   */
  if (loading && !authenticated) {
    return (
      <section className="admin-page">
        <div className="admin-container">
          <div className="admin-message">
            CHECKING ACCESS...
          </div>
        </div>
      </section>
    );
  }

  /*
   * Login screen
   */
  if (!authenticated) {
    return (
      <section className="admin-page">
        <div className="admin-container">

          <div className="admin-header">
            <div className="admin-code">
              GAMECRAFT // 2026 // RESTRICTED
            </div>

            <h1>
              ADMIN <span>ACCESS</span>
            </h1>

            <p>
              Registration management console
            </p>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleLogin}
          >
            <div className="admin-password-wrapper">
              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="ENTER ADMIN PASSWORD..."
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                    />
                    <line
                      x1="4"
                      y1="4"
                      x2="20"
                      y2="20"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                    />
                  </svg>
                )}
              </button>
            </div>

            {loginError && (
              <div className="admin-error">
                ERROR // {loginError}
              </div>
            )}

            <button type="submit">
              ACCESS DATABASE →
            </button>
          </form>

        </div>
      </section>
    );
  }

  /*
   * Admin dashboard
   */
  return (
    <section className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div className="admin-code">
            GAMECRAFT // 2026 // ADMIN
          </div>

          <h1>
            TEAM <span>DATABASE</span>
          </h1>

          <p>
            Registration management console
          </p>

          <button
            className="admin-logout"
            onClick={handleLogout}
            type="button"
          >
            LOGOUT
          </button>
        </div>

        <div className="admin-stats">
          <div>
            <span>TOTAL TEAMS</span>
            <strong>{teams.length}</strong>
          </div>

          <div>
            <span>PAID</span>
            <strong>
              {
                teams.filter(
                  (team) =>
                    team.payment_status ===
                    'PAID'
                ).length
              }
            </strong>
          </div>

          <div>
            <span>PENDING</span>
            <strong>
              {
                teams.filter(
                  (team) =>
                    team.payment_status ===
                    'PENDING'
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="admin-search">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search registration ID, team, location or email..."
          />
        </div>

        {loading && (
          <div className="admin-message">
            LOADING DATABASE...
          </div>
        )}

        {error && (
          <div className="admin-error">
            ERROR // {error}
          </div>
        )}

        {!loading &&
          !error &&
          !selectedTeam && (
            <div className="team-list">

              {filteredTeams.map((team) => (
                <button
                  key={team.team_id}
                  className="team-row"
                  onClick={() =>
                    setSelectedTeam(team)
                  }
                  type="button"
                >
                  <div>
                    <strong>
                      {team.team_name}
                    </strong>

                    <span>
                      {team.registration_id}
                    </span>
                  </div>

                  <div>
                    <span>
                      {team.member_count} MEMBERS
                    </span>

                    <span>
                      {team.state_city}
                    </span>
                  </div>

                  <div
                    className={`payment-status ${team.payment_status.toLowerCase()}`}
                  >
                    {team.payment_status}
                  </div>
                </button>
              ))}

              {filteredTeams.length === 0 && (
                <div className="admin-message">
                  NO TEAMS FOUND.
                </div>
              )}

            </div>
          )}

        {selectedTeam && (
          <div className="team-details">

            <button
              className="back-button"
              onClick={() =>
                setSelectedTeam(null)
              }
              type="button"
            >
              ← BACK TO TEAMS
            </button>

            <div className="team-title">

              <div>
                <div className="admin-code">
                  {selectedTeam.registration_id}
                </div>

                <h2>
                  {selectedTeam.team_name}
                </h2>

                <p>
                  {selectedTeam.state_city}
                </p>
              </div>

              <div
                className={`payment-status ${selectedTeam.payment_status.toLowerCase()}`}
              >
                {selectedTeam.payment_status}
              </div>

            </div>

            <div className="details-section">

              <h3>MEMBERS</h3>

              {selectedTeam.members.map(
                (member) => (
                  <div
                    className="member-card"
                    key={member.member_number}
                  >
                    <div className="member-number">
                      0{member.member_number}
                    </div>

                    <div className="member-info">

                      <strong>
                        {member.name}

                        {member.is_team_lead &&
                          ' // TEAM LEAD'}
                      </strong>

                      <span>
                        {member.email}
                      </span>

                      <span>
                        {member.phone}
                      </span>

                      <span>
                        GitHub:{' '}
                        {member.github_username}
                      </span>

                    </div>
                  </div>
                )
              )}

            </div>

            <div className="details-section">

              <h3>SELECTED EVENTS</h3>

              {selectedTeam.events.map(
                (event) => (
                  <div
                    className="event-row"
                    key={event.short_name}
                  >
                    <span>
                      {event.is_gamecraft_challenge
                        ? 'GAMECRAFT'
                        : 'COMPETITIVE'}
                    </span>

                    <strong>
                      {event.name}
                    </strong>
                  </div>
                )
              )}

            </div>

            <div className="details-section">

              <h3>PAYMENT</h3>

              <div className="payment-box">

                <span>AMOUNT</span>

                <strong>
                  ₹
                  {(
                    selectedTeam.payment
                      ?.amount || 0
                  ) / 100}
                </strong>

                <span>STATUS</span>

                <strong>
                  {selectedTeam.payment?.status ||
                    'NOT AVAILABLE'}
                </strong>

                <span>UTR / TXN ID</span>

                <strong>
                  {selectedTeam.payment?.utr_id ||
                    'NOT PROVIDED'}
                </strong>

                <span>PAYMENT PROOF</span>

                {selectedTeam.payment
                  ?.screenshot_drive_url ? (
                  <a
                    href={
                      selectedTeam.payment
                        .screenshot_drive_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-proof-link"
                  >
                    VIEW SCREENSHOT ↗
                  </a>
                ) : (
                  <strong>
                    NOT AVAILABLE
                  </strong>
                )}

              </div>

            </div>

            <div className="details-section">

              <h3>REGISTRATION</h3>

              <div className="registration-info">

                <span>
                  REGISTRATION ID
                </span>

                <strong>
                  {selectedTeam.registration_id}
                </strong>

                <span>
                  CREATED
                </span>

                <strong>
                  {new Date(
                    selectedTeam.created_at
                  ).toLocaleString('en-IN')}
                </strong>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};

export default Admin;