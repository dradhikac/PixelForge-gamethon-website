export interface ScheduleEvent {
  time: string;
  title: string;
  description?: string;
  category: 'check-in' | 'ceremony' | 'keynote' | 'briefing' | 'game' | 'break' | 'build' | 'expo' | 'judging';
  badge: string;
  accent?: 'gold' | 'magenta' | 'cyan' | 'orange' | 'purple' | 'slate';
  isMilestone?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  dateLabel: string;
  dayTitle: string;
  subtitle: string;
  events: ScheduleEvent[];
}

export const championshipSchedule: DayItinerary[] = [
  {
    dayNumber: 1,
    dateLabel: "NOVEMBER 19, 2026",
    dayTitle: "DAY 01 – NOVEMBER 19",
    subtitle: "GAME THEORY CHALLENGES & DEVELOPMENT KICKOFF",
    events: [
      {
        time: "08:30 – 09:15",
        title: "REGISTRATION & TEAM CHECK-IN",
        category: "check-in",
        badge: "CHECK-IN",
        accent: "slate"
      },
      {
        time: "09:15 – 09:30",
        title: "WELCOME ADDRESS",
        category: "ceremony",
        badge: "WELCOME",
        accent: "purple"
      },
      {
        time: "09:30 – 10:00",
        title: "INAUGURAL KEYNOTE",
        category: "keynote",
        badge: "KEYNOTE",
        accent: "purple"
      },
      {
        time: "10:00 – 10:30",
        title: "PIXELFORGE BRIEFING & KICKOFF",
        category: "briefing",
        badge: "KICKOFF",
        accent: "gold",
        isMilestone: true
      },
      {
        time: "10:30 – 11:30",
        title: "TRUST FALL (GAME)",
        description: "Trust and betrayal arena. Face other teams in repeated rounds.",
        category: "game",
        badge: "ARENA 01",
        accent: "magenta",
        isMilestone: true
      },
      {
        time: "11:30 – 12:30",
        title: "SILENT AUCTION (GAME)",
        description: "Auctions and truthful bidding. Place secret bids for build-boosting prizes.",
        category: "game",
        badge: "ARENA 02",
        accent: "cyan",
        isMilestone: true
      },
      {
        time: "12:30 – 13:30",
        title: "LUNCH BREAK",
        category: "break",
        badge: "REFUEL",
        accent: "slate"
      },
      {
        time: "13:30 – 14:30",
        title: "POOL PARTY (GAME)",
        description: "Win-win cooperation. Every team secretly contributes to a shared multiplier pot.",
        category: "game",
        badge: "ARENA 03",
        accent: "gold",
        isMilestone: true
      },
      {
        time: "14:30 – 15:15",
        title: "TEA BREAK",
        category: "break",
        badge: "BREAK",
        accent: "slate"
      },
      {
        time: "15:15 – 18:00",
        title: "DEVELOPMENT PHASE – I (TEAM BUILD & INITIAL DEVELOPMENT)",
        description: "Core game mechanics implementation, architecture design, and sprint sprint initialization.",
        category: "build",
        badge: "SPRINT I",
        accent: "purple",
        isMilestone: true
      },
      {
        time: "18:00 – 18:30",
        title: "OVERNIGHT BUILD (CONTINUOUS DEVELOPMENT)",
        description: "30-Hour Build Challenge continues overnight. Secure lab access and mentorship support.",
        category: "build",
        badge: "OVERNIGHT",
        accent: "orange",
        isMilestone: true
      }
    ]
  },
  {
    dayNumber: 2,
    dateLabel: "NOVEMBER 20, 2026",
    dayTitle: "DAY 02 – NOVEMBER 20",
    subtitle: "CONTINUOUS DEVELOPMENT & FINAL EVALUATION",
    events: [
      {
        time: "08:15 – 09:00",
        title: "BREAKFAST",
        category: "break",
        badge: "REFUEL",
        accent: "slate"
      },
      {
        time: "09:00 – 11:00",
        title: "DEVELOPMENT PHASE – II (CONTINUOUS BUILD)",
        description: "Asset polish, gameplay tuning, balancing, and cross-platform verification.",
        category: "build",
        badge: "SPRINT II",
        accent: "purple",
        isMilestone: true
      },
      {
        time: "11:00 – 11:15",
        title: "SHORT BREAK",
        category: "break",
        badge: "BREAK",
        accent: "slate"
      },
      {
        time: "11:15 – 13:00",
        title: "FINAL BUILD & SUBMISSION (UPLOAD & SETUP BUFFER)",
        description: "Final code freeze. Playable build and 1-page mechanism note submission upload.",
        category: "build",
        badge: "DEADLINE",
        accent: "orange",
        isMilestone: true
      },
      {
        time: "13:00 – 14:00",
        title: "LUNCH BREAK",
        category: "break",
        badge: "REFUEL",
        accent: "slate"
      },
      {
        time: "14:00 – 15:00",
        title: "DEMO EXPO",
        description: "Live 3-minute interactive pitch and gameplay defense before jury and faculty.",
        category: "expo",
        badge: "DEMO EXPO",
        accent: "cyan",
        isMilestone: true
      },
      {
        time: "15:00 – 15:30",
        title: "JUDGES’ DELIBERATION",
        description: "Evaluation committee tallies scores across Strategic Fidelity, Polish, and Fun.",
        category: "judging",
        badge: "JURY REVIEW",
        accent: "purple"
      },
      {
        time: "15:30 – 16:30",
        title: "AWARDS CEREMONY & CLOSING",
        description: "Announcement of Grand Champions, Arena Winners, and Certificate Distribution.",
        category: "ceremony",
        badge: "GRAND FINALE",
        accent: "gold",
        isMilestone: true
      }
    ]
  }
];
