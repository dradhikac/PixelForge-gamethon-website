# ⚔️ PIXEL FORGE 2026

> **Where Strategy Meets Innovation // Design the Game. Master the Strategy.**

Official participant-facing web application and tournament portal for **PIXEL FORGE 2026**, a 2-day inter-college Game Design and Game Theory Championship organized by the **Department of Computer Science and Engineering - Data Science** at **Dayananda Sagar Academy of Technology and Management (DSATM)**, Bengaluru.

---

## 📌 Event Snapshot

| Metric | Details |
| :--- | :--- |
| **Dates** | November 19–20, 2026 |
| **Venue** | Dayananda Sagar Academy of Technology and Management (DSATM), Bengaluru |
| **Duration** | 2 Days (including overnight continuous development) |
| **Team Size** | 3–4 Members per squad (Cross-college teams permitted) |
| **Registration Fee** | ₹250 per team |
| **Prize Pool** | Exciting cash prizes, trophies, and merit certificates |
| **Flagship Track** | 30-Hour GameCraft Challenge (Continuous Build Sprint) |
| **Support Email** | [pixelforgesupport2026@gmail.com](mailto:pixelforgesupport2026@gmail.com) |

---

## 🎮 Core Competition Tracks

### 1. Flagship 30-Hour Build Challenge
An intensive, 30-hour overnight game development sprint. Teams architect, prototype, and polish a complete strategic game that brings game-theoretic mechanisms (Nash equilibria, incentives, resource trades, imperfect information) to life.
- **Evaluation Criteria**: Strategic Depth, Playability, Emergent Strategy, and Polish.
- **Deliverables**: Playable build (web, executable, or prototype), 1-page mechanism note, and a 3-minute pitch at the Demo Expo.

### 2. The Three Live Arenas
High-intensity, 1-hour strategic rounds played throughout Day 1:
1. **Trust Fall** (*Trust & Betrayal*): Face off in iterated social dilemmas against rival squads. Choose between mutual cooperation and lucrative defection.
2. **Silent Auction** (*Strategic Bidding*): Sealed-bid auctions using virtual tokens to acquire game-altering perks without falling victim to the winner's curse.
3. **Pool Party** (*Public Goods & Multiplier Pools*): Secret contribution rounds into a shared multiplier fund. Maximize team payoff while guarding against free-riders.

---

## ⚡ Key Features of the Platform

- **Royal Voxel / Cyberpunk Aesthetic**: High-energy pixel/blacksmith visual theme with responsive animations powered by Framer Motion.
- **Live Countdown Timer**: Real-time ticker counting down to tournament kickoff.
- **Championship Schedule**: Dynamic Day 1 & Day 2 itinerary browser with category badges, milestone highlights, and phase breakdowns.
- **Rules of Engagement**: Accordion-based rulebook covering all 8 protocol categories with zero external dependencies.
- **Interactive Registration Portal (`/registration`)**: Multi-step team onboarding with member verification, college selection, and payment confirmation.
- **Staff Admin Dashboard (`/admin`)**: Secure verification dashboard for coordinators to review team statuses and submissions.
- **In-App Brochure Viewer (`/brochure`)**: Integrated reader for the official event brochure.
- **Theme Switcher**: Instant toggle between dark royal gaming theme and high-contrast light theme.
- **Automated Communication APIs**: Serverless endpoints for registration confirmation, status updates, and countdown notifications.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Motion & Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: Vanilla CSS with custom properties (Voxel/Cyberpunk design system)
- **Code Quality**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

### Backend & Integrations
- **Serverless Compute**: Vercel Serverless Functions (`/api/*`)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Storage buckets)
- **Google Cloud APIs**: Gmail API (Automated transactional emails) & Google Drive API (Payment receipt verification)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20.19+ or v22.12+ recommended
- **npm** (bundled with Node)

### Installation
Clone the repository and install project dependencies:
```bash
git clone https://github.com/dradhikac/PixelForge-gamethon-website.git
cd PixelForge-gamethon-website
npm install
```

### Development Server
Start Vite's local dev server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### Production Build
Type-check with TypeScript and compile optimized bundles:
```bash
npm run build
```

To preview the production bundle locally:
```bash
npm run preview
```

### Linting
Run Oxlint across the codebase:
```bash
npm run lint
```

---

## 📁 Project Structure

```text
PixelForge-Gamethon-Website/
├── api/                          # Vercel serverless backend endpoints
│   ├── auth/google/              # Google OAuth handling
│   ├── countdown-email.ts        # Automated countdown reminder cron
│   ├── event-date-change-email.ts# Date change notification service
│   └── register.ts               # Team registration handler & storage
├── public/                       # Static public assets, icons, brochures
│   ├── assets/pixelforge/        # Arena cards, prizes, characters & art
│   ├── gamecraft-brochure.pdf    # Official event brochure PDF
│   └── favicon.svg
├── src/
│   ├── components/               # UI components
│   │   ├── About.tsx             # About section & themes overview
│   │   ├── Admin.tsx             # Staff verification portal
│   │   ├── Brochure.tsx          # PDF brochure embed viewer
│   │   ├── Challenge.tsx         # 30-Hour Build Sprint overview
│   │   ├── CTA.tsx               # Final registration call-to-action
│   │   ├── Events.tsx            # The Three Arenas showcase
│   │   ├── FAQ.tsx               # Frequently Asked Questions accordion
│   │   ├── Footer.tsx            # Footer with coordinators, venue & links
│   │   ├── Hero.tsx              # Hero banner with countdown & stats
│   │   ├── Navbar.tsx            # Fixed navigation bar with mobile drawer
│   │   ├── Prizes.tsx            # Prizes & recognition section
│   │   ├── Registration.tsx      # Multi-step registration form
│   │   ├── Rules.tsx             # Rules of Engagement accordion
│   │   ├── Schedule.tsx          # 2-Day interactive chronology
│   │   └── Themes.tsx            # Game themes & mechanism cards
│   ├── config/
│   │   └── eventConfig.ts        # Central event configuration & contact details
│   ├── data/
│   │   ├── events.ts             # Arena & event descriptions
│   │   ├── faq.ts                # FAQ question/answer dataset
│   │   ├── rules.ts              # 8 Official competition rule sections
│   │   └── schedule.ts           # Day 1 & Day 2 itinerary schedules
│   ├── App.tsx                   # Main router and shell layout
│   ├── main.tsx                  # Application bootstrap entrypoint
│   └── index.css                 # Global variables & typography
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Configuration & Customization

The primary event settings reside in [`src/config/eventConfig.ts`](file:///d:/PixelForge-Gamethon-Website/src/config/eventConfig.ts):

```typescript
export const eventConfig = {
  name: "PIXEL FORGE",
  year: "2026",
  tagline: "Where Strategy Meets Innovation // Design the Game. Master the Strategy.",
  organizer: "Department of Computer Science and Engineering - Data Science",
  institute: "Dayananda Sagar Academy of Technology and Management (DSATM)",
  date: "29-30 October 2026",
  registrationFee: "₹250 per team",
  prizeSummary: "Exciting cash prizes",
  contact: {
    faculty: [
      {
        name: "Chaitanya M",
        email: "chaitanya-csds@dsatm.edu.in",
        phone: "9392379564"
      }
    ],
    students: [
      { name: "Rahul", phone: "7207251164" },
      { name: "Kayva Vudarla", phone: "9741408290" }
    ],
    address: "Kanakapura Main Rd, UDAYAPURA, Badamanavarathekaval, Karnataka 560082"
  }
};
```

---

## 🗓️ Championship Itinerary

### Day 01 — Game Theory Challenges & Sprint Kickoff
- **08:30 – 09:15**: Registration & Team Check-in
- **09:15 – 09:30**: Welcome Address
- **09:30 – 10:00**: Inaugural Keynote
- **10:00 – 10:30**: PixelForge Briefing & Kickoff
- **10:30 – 11:30**: **Arena 01 — TRUST FALL**
- **11:30 – 12:30**: **Arena 02 — SILENT AUCTION**
- **12:30 – 13:30**: Lunch Break
- **13:30 – 14:30**: **Arena 03 — POOL PARTY**
- **14:30 – 15:15**: Tea Break
- **15:15 – 18:00**: Development Phase I (Core architecture & prototyping)
- **18:00 onwards**: Overnight Build Sprint (Continuous development)

### Day 02 — Continuous Development & Final Evaluation
- **08:15 – 09:00**: Breakfast & Status Check
- **09:00 – 11:00**: Development Phase II (Balancing, polish & testing)
- **11:00 – 11:15**: Short Break
- **11:15 – 13:00**: Final Build Freeze & Code Submission
- **13:00 – 14:00**: Lunch Break
- **14:00 – 15:00**: **Demo Expo (Live 3-minute jury defense)**
- **15:00 – 15:30**: Judges' Deliberation
- **15:30 – 16:30**: Awards Ceremony & Grand Finale

---

## 📜 Rules of Engagement

The competition is governed by eight official protocol sections in [`src/data/rules.ts`](file:///d:/PixelForge-Gamethon-Website/src/data/rules.ts):
1. **Eligibility & Registration**: Enrollment criteria and ID requirements.
2. **Team Composition**: 3–4 members, cross-college eligibility, and designated team lead.
3. **General Code of Conduct**: Professional behavior, anti-harassment, and venue policies.
4. **GameCraft Challenge (30-Hour Build)**: Build window, originality guidelines, and asset pack allowances.
5. **Demo Expo**: Booth allocation, pitching slots, and sponsor interaction.
6. **Judging & Scoring**: Transparent rubric across strategic fidelity, innovation, playability, and polish.
7. **Disqualification Criteria**: Zero tolerance for plagiarism, unauthorized collusion, or code of conduct violations.
8. **Prizes & Certificate**: Verification, cash awards, and certificate distribution.

---

## 👥 Event Coordinators

- **Faculty Coordinator**:
  - **Chaitanya M** | [chaitanya-csds@dsatm.edu.in](mailto:chaitanya-csds@dsatm.edu.in) | 📞 +91 9392379564
- **Student Coordinators**:
  - **Rahul** | 📞 +91 7207251164
  - **Kayva Vudarla** | 📞 +91 9741408290
- **Official Tournament Email**: [pixelforgesupport2026@gmail.com](mailto:pixelforgesupport2026@gmail.com)

---

## 📄 License & Attribution

Designed and developed for **PIXEL FORGE 2026** by the Department of Computer Science and Engineering - Data Science, Dayananda Sagar Academy of Technology and Management. All rights reserved.
