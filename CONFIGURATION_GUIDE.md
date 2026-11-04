# Configuration Guide for Organizers

This guide explains where to update GAMECRAFT 2026 website content without digging through every component.

## Main Configuration File

Most public event settings live in:

```text
src/config/eventConfig.ts
```

Current key values:

```ts
export const eventConfig = {
  date: "29-30 October 2026",
  dateShort: "29-30 October",
  duration: "2 Days",
  buildDuration: "30 Hours",
  registrationFee: "₹250 per team",
  prizeSummary: "Exciting cash prizes",
  eventStartTime: "2026-10-30T08:30:00+05:30",
  challengeDeadline: "2026-10-31T16:30:00+05:30",
  rulebookUrl: "https://drive.google.com/file/d/1_y-wIWICa1YqTvirF4cQymMMjopLl2fv/view?usp=sharing"
};
```

## Registration Form

The registration form URL is configured here:

```ts
googleFormUrl: "https://docs.google.com/forms/d/e/FORM_ID/viewform",
```

Use the public Google Forms `viewform` URL. The website embeds the form directly.

The site does not include a payment gateway. Put the payment QR code, payment instructions, and payment confirmation upload field inside the Google Form.

## Rulebook Link

Use this same rulebook link everywhere:

```text
https://drive.google.com/file/d/1_y-wIWICa1YqTvirF4cQymMMjopLl2fv/view?usp=sharing
```

It is currently configured in:

```text
src/config/eventConfig.ts
```

The Rules page reads from `eventConfig.rulebookUrl`, so updating that one value updates the visible "View Full Rulebook PDF" button.

## Contact Information

Replace the placeholder contact fields before launch:

```ts
contact: {
  name: "[Organizing Committee Contact Name]",
  email: "[Email]",
  phone: "[Phone]",
  address: "Kanakapura Main Rd, UDAYAPURA, Badamanavarathekaval, Karnataka 560082"
},
```

## Social Links

Replace placeholder social links or hide them in the footer:

```ts
social: {
  instagram: "#",
  linkedin: "#",
  twitter: "#",
  discord: "#"
},
```

Use complete URLs, including `https://`.

## Schedule Source

The website schedule is stored in:

```text
src/data/schedule.ts
```

Keep this file aligned with the brochure and rulebook.

## Current Day 1 Schedule

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

## Updating Event Cards

Event details are stored in:

```text
src/data/events.ts
```

Edit this file for event names, districts, concepts, formats, descriptions, and colors.

## Updating Rules Preview

The on-page rules accordion is stored in:

```text
src/data/rules.ts
```

The full rulebook button comes from:

```text
src/config/eventConfig.ts
```

## After Making Changes

Run:

```bash
npm run build
npm run lint
```

Then check the website in a browser:

```bash
npm run dev
```

## Pre-Launch Checklist

- Registration Google Form URL is correct and public
- Google Form includes payment instructions and payment confirmation fields
- Contact name, email, and phone are replaced
- Social links are replaced or hidden
- Event date is correct: 29-30 October 2026
- Day 1 and Day 2 schedules match the brochure and rulebook
- Rulebook link opens correctly
- Venue map opens correctly
- Website is tested on desktop and mobile
- `npm run build` passes
- `npm run lint` has no new warnings

## Do Not Edit Unless Needed

Avoid editing these unless you are changing site behavior or layout:

- `package.json`
- `vite.config.ts`
- `tsconfig*.json`
- Component CSS files
- React component files in `src/components/`

Design the Game. Master the Strategy.
