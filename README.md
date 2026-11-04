# GAMECRAFT 2026

Where Strategy Meets Innovation

Official participant-facing website for GAMECRAFT 2026, a 2-day inter-college Game Design and Game Theory Fest organized by the Department of Computer Science and Engineering - Data Science at Dayananda Sagar Academy of Technology and Management (DSATM).

## Event Snapshot

- Date: 29-30 October 2026
- Venue: Dayananda Sagar Academy of Technology and Management (DSATM)
- Duration: 2 days
- Registration fee: ₹250 per team
- Prize note: Exciting cash prizes
- Flagship event: 30-hour GameCraft Challenge
- Build window: 10:30 AM on Day 1 to 4:30 PM on Day 2

## About The Site

This React/Vite site presents the event as a public microsite with:

- Hero section with countdown, venue, fee, and prize details
- Event arena cards for all six core challenges
- 30-hour GameCraft Challenge overview
- Interactive 2-day schedule
- Accordion-style rulebook preview
- Embedded Google Form registration section
- Footer with organizer, contact, map, and social links

## Core Challenges

1. Prisoner's Dilemma Arena
2. Live Auction Championship
3. Mechanism Design Hackathon
4. Voting & Governance Challenge
5. Multi-Agent Bot Arena
6. GameCraft Challenge

## Tech Stack

- React 19
- TypeScript
- Vite
- Framer Motion
- Custom CSS
- Oxlint

## Quick Start

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Vite usually serves the site at `http://localhost:5173`. If that port is already in use, Vite will choose the next available port.

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    About.tsx
    Challenge.tsx
    CTA.tsx
    Events.tsx
    Footer.tsx
    Hero.tsx
    Navbar.tsx
    Rules.tsx
    Schedule.tsx
  config/
    eventConfig.ts
  data/
    events.ts
    rules.ts
    schedule.ts
  App.tsx
  main.tsx
  index.css
public/
  gamecraftlogo.png
  gamecraft-icon.png
  favicon.svg
```

## Main Configuration

Most organizer-facing values live in `src/config/eventConfig.ts`.

Update these before launch:

```ts
export const eventConfig = {
  date: "29-30 October 2026",
  dateShort: "29-30 October",
  venueMapUrl: "https://maps.app.goo.gl/RxmXw5MAN5uajCseA",
  googleFormUrl: "https://docs.google.com/forms/d/e/.../viewform",
  registrationFee: "₹250 per team",
  prizeSummary: "Exciting cash prizes",
  eventStartTime: "2026-10-30T08:30:00+05:30",
  challengeDeadline: "2026-10-31T16:30:00+05:30",
  contact: {
    name: "[Organizing Committee Contact Name]",
    email: "[Email]",
    phone: "[Phone]",
    address: "Kanakapura Main Rd, UDAYAPURA, Badamanavarathekaval, Karnataka 560082"
  },
  social: {
    instagram: "#",
    linkedin: "#",
    twitter: "#",
    discord: "#"
  },
  rulebookUrl: "https://drive.google.com/file/d/1_y-wIWICa1YqTvirF4cQymMMjopLl2fv/view?usp=sharing"
};
```

## Updating Content

Event cards:

```text
src/data/events.ts
```

Use this file to edit event titles, concepts, formats, descriptions, districts, and accent colors.

Schedule:

```text
src/data/schedule.ts
```

Use this file to change Day 1 or Day 2 timings and session names.

Rules:

```text
src/data/rules.ts
```

Use this file to edit rule categories and individual rulebook items.

Main event settings:

```text
src/config/eventConfig.ts
```

Use this file for registration, dates, fees, prizes, venue, map, contact, social, and rulebook links.

## Current Day 1 Schedule

The current schedule follows the brochure:

- 08:30 - 09:00: Registration & Team Check-in
- 09:00 - 09:15: Welcome Address
- 09:15 - 10:00: Inaugural Keynote
- 10:00 - 10:30: GameCraft Challenge - Briefing & Kickoff
- 10:30 - 12:00: Prisoner's Dilemma Arena
- 12:00 - 13:00: Lunch Break
- 13:00 - 15:00: Live Auction Championship
- 15:00 - 15:15: Tea Break
- 15:15 - 17:15: Mechanism Design Hackathon
- 17:15 - 18:00: Panel: Game Theory in Industry
- 18:00 onwards: Overnight Networking + Overnight Build

## Current Day 2 Schedule

The current schedule follows the brochure:

- 08:15 - 09:00: Breakfast
- 09:00 - 10:00: Voting & Governance Challenge
- 10:00 - 11:30: Multi-Agent Bot Arena
- 11:30 - 11:45: Short Break
- 13:30 - 14:15: Lunch Break
- 14:15 - 16:30: GameCraft Challenge - Final Build Time
- 16:30 - 17:00: Submission Upload & Setup Buffer
- 17:00 - 18:30: Demo Expo
- 18:30 - 19:00: Judges' Deliberation
- 19:00 - 20:00: Awards Ceremony & Closing

## Pre-Launch Checklist

- Registration Google Form URL is correct and public
- Google Form includes payment instructions and payment confirmation fields
- Contact name, email, and phone are replaced
- Social links are replaced or hidden
- Rulebook link opens correctly: https://drive.google.com/file/d/1_y-wIWICa1YqTvirF4cQymMMjopLl2fv/view?usp=sharing
- Venue map opens correctly
- Event schedule matches the latest brochure
- Website is checked on desktop and mobile
- `npm run build` passes
- `npm run lint` has no new warnings

## Content Source

The current event details are aligned with `Gamecraft Brochure Final.pdf`, including the two-day schedule, six core challenges, registration fee, cash-prize note, team-size guidance, and GameCraft Challenge build window.

## Notes

- This site does not include a backend, authentication, database, or payment gateway.
- Registration is handled through an embedded Google Form.
- Payment handling should be configured inside the Google Form.
- Placeholder organizer contact and social links should be replaced before launch.

---

Design the Game. Master the Strategy.
