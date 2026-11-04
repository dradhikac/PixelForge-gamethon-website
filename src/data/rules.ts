export interface RuleCategory {
  id: string;
  title: string;
  rules: string[];
}

export const rulesData: RuleCategory[] = [
  {
    id: "eligibility",
    title: "Eligibility & Registration",
    rules: [
      "Open to students currently enrolled in any recognized undergraduate/postgraduate program.",
      "Valid college ID card is mandatory for entry and must be carried at all times during the event.",
      "Registration closes at a pre-announced date; on-spot registration (if available) is subject to seat availability and a late fee.",
      "GameCraft Challenge is the core build event; all registered teams participate in the 30-hour build and the three scheduled Arena activities: Trust Fall, Silent Auction, and Pool Party."
    ]
  },
  {
    id: "team",
    title: "Team Composition",
    rules: [
      "Team size: 3–4 members per team, unless otherwise specified for an individual event.",
      "Cross-college teams are allowed unless a specific event states otherwise.",
      "Each team must designate one Team Lead as the single point of contact for all communication and submissions.",
      "Substituting team members after registration closes is not permitted except in a documented emergency, subject to organizer approval."
    ]
  },
  {
    id: "conduct",
    title: "General Code of Conduct",
    rules: [
      "Participants must treat organizers, judges, volunteers, sponsors, and fellow participants with respect at all times.",
      "Any form of harassment, discrimination, or disruptive behavior will result in immediate disqualification of the individual/team, without refund.",
      "Participants are responsible for their own belongings; organizers are not liable for loss or damage.",
      "Consumption of alcohol, tobacco, or any prohibited substances on campus/venue premises is strictly forbidden and will result in immediate removal from the event.",
      "The decision of the organizing committee and judging panel is final and binding in all matters."
    ]
  },
  {
    id: "gamecraft-challenge",
    title: "GameCraft Challenge (30-Hour Build)",
    rules: [
      "Teams must build their game entirely within the 30-hour window (10:30 AM Day 1 to 4:30 PM Day 2); any commits, edits, or physical prototyping after the deadline will not be considered.",
      "Use of pre-existing open-source libraries, engines (Unity, Godot, etc.), or asset packs is allowed, but the core strategic mechanic must be built during the event — pre-built games or mechanics brought from outside are grounds for disqualification.",
      "Teams must submit: the playable build (link or physical prototype), the one-page design note, and be ready for the 3-minute Demo Expo pitch.",
      "Plagiarism or use of another team's mechanic/assets without credit will result in disqualification.",
      "Judges reserve the right to ask teams to explain or modify their build live to verify originality.",
      "Intellectual property of the submitted game remains with the team; however, teams grant organizers and sponsors the right to showcase/photograph/publicize the game for event promotion."
    ]
  },
  {
    id: "demo",
    title: "Demo Expo",
    rules: [
      "Each team gets a fixed time slot (approx. 5–7 minutes including Q&A) to present to judges and sponsors.",
      "Booths/tables will be allotted by draw; teams may not occupy another team's assigned space.",
      "Sponsors visiting booths for recruitment conversations do so independently of the judging process — recruitment interest does not influence competition scores."
    ]
  },
  {
    id: "judging",
    title: "Judging & Scoring",
    rules: [
      "Each competition track has its own judging panel comprising faculty experts and industry evaluators.",
      "Scoring criteria for the GameCraft Challenge (Strategic Depth, Playability, Emergent Strategy, and Polish) and the three Arena activities (Trust Fall, Silent Auction, and Pool Party) will be shared prior to each session.",
      "Judges' scores are final; no re-evaluation requests will be entertained after results are announced, except in case of a verifiable clerical error."
    ]
  },
  {
    id: "disqualification",
    title: "Disqualification Criteria",
    rules: [
      "Plagiarism, unauthorized collusion, or match-fixing across any Arena games (Trust Fall, Silent Auction, Pool Party) or the GameCraft Challenge.",
      "Use of prohibited external resources or pre-built solutions where original work is required.",
      "Violation of the code of conduct.",
      "Missing submission deadlines without prior organizer approval.",
      "Providing false information during registration (e.g., ineligible participant, fake college ID)."
    ]
  },
  {
    id: "prizes",
    title: "Prizes & Certificate",
    rules: [
      "Winners and top performers across the GameCraft Challenge and the three Arena games (Trust Fall, Silent Auction, and Pool Party) will receive exciting cash prizes as announced by the organizers.",
      "All participants who complete their respective events will receive an official participation certificate; winners receive merit certificates.",
      "Prize disbursement (cash/vouchers) will be processed within a stated timeframe post-event, subject to submission of necessary documentation (bank details, ID proof) by winning teams."
    ]
  }
];
