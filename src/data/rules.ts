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
      "GameCraft Challenge is compulsory for every team; each team may additionally register for a maximum of two other competitive events to avoid schedule clashes."
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
    id: "logistics",
    title: "General Logistics",
    rules: [
      "Participants must carry their own laptops, chargers, and any hardware required for their event; organizers will provide power outlets and Wi-Fi but do not guarantee backup equipment.",
      "For the overnight GameCraft Challenge build window, only registered GameCraft teams are permitted to remain on venue premises overnight; a security desk and attendance log will be maintained.",
      "Outside food may be restricted in certain zones; meal breaks and refreshments are provided as per the schedule.",
      "Any change to the schedule due to unforeseen circumstances will be communicated via the official event channel (WhatsApp/Discord/email) and displayed at the help desk."
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
    id: "prisoners-dilemma",
    title: "Prisoner's Dilemma Arena",
    rules: [
      "Format: round-robin, each team plays every other team once; points accumulated across all matches determine ranking.",
      "Communication or side-agreements between competing teams during a live match are not allowed (no explicit collusion) — the point of the event is to observe strategic behavior, not negotiated outcomes.",
      "Any team caught deliberately throwing a match to benefit another team (match-fixing) will be disqualified from the event entirely."
    ]
  },
  {
    id: "auction",
    title: "Live Auction Championship",
    rules: [
      "All teams are allotted equal virtual currency at the start; no real money is used at any point.",
      "Bidding is sealed-bid unless the round is explicitly announced as open/ascending.",
      "Collusion between teams to fix bids or split winnings is prohibited and will result in disqualification of all colluding teams.",
      "Once a bid is submitted, it is final and cannot be withdrawn or amended for that round."
    ]
  },
  {
    id: "mechanism-design",
    title: "Mechanism Design Hackathon",
    rules: [
      "The problem statement will be revealed only at the start of the session; no advance preparation on the specific problem is permitted.",
      "Teams must design a mechanism (allocation rule + payment rule) and present it within the allotted time; incomplete submissions will be judged on progress shown.",
      "Use of AI coding/writing assistants is permitted for implementation, but the mechanism design/logic must be the team's own reasoning, explainable live to judges."
    ]
  },
  {
    id: "voting",
    title: "Voting & Governance Challenge",
    rules: [
      "Each team designs one voting/aggregation rule and tests it against a provided sample dataset of preferences.",
      "Teams must explicitly state which of Arrow's axioms (if any) their designed rule violates — this is a required part of scoring, not optional.",
      "Rules that are mathematically identical to a rule presented by another team will both be judged, but originality of design will factor into scoring."
    ]
  },
  {
    id: "bot-arena",
    title: "Multi-Agent Bot Arena",
    rules: [
      "Bots must be submitted in the specified language/framework by the stated pre-deadline (before the tournament slot).",
      "Bots may not make external network calls, access the internet, or communicate with other teams' bots outside the defined game interface.",
      "Each bot must complete its move within the specified time limit per turn; exceeding the time limit results in a forfeited/default move for that turn.",
      "Any attempt to exploit a bug in the arena's engine (rather than out-strategizing opponents) will be disqualified upon detection."
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
      "Each event has its own judging panel comprising a mix of faculty and sponsor representatives (where applicable).",
      "Scoring criteria for each event (e.g., the GameCraft Challenge's Strategic Fidelity / Playability / Emergent Strategy / Polish weightage) will be shared with participants before the event begins.",
      "Judges' scores are final; no re-evaluation requests will be entertained after results are announced, except in case of a verifiable clerical error."
    ]
  },
  {
    id: "disqualification",
    title: "Disqualification Criteria",
    rules: [
      "Plagiarism, collusion, or match-fixing",
      "Use of prohibited external resources or pre-built solutions where original work is required",
      "Violation of the code of conduct",
      "Missing submission deadlines without prior organizer approval",
      "Providing false information during registration (e.g., ineligible participant, fake college ID)"
    ]
  },
  {
    id: "prizes",
    title: "Prizes & Certificates",
    rules: [
      "Winners and runners-up in each event will receive exciting cash prizes as announced by the organizers.",
      "All participants who complete their respective event will receive a participation certificate; winners receive merit certificates.",
      "Prize disbursement (cash/vouchers) will be processed within a stated timeframe post-event, subject to submission of necessary documentation (bank details, ID proof) by winning teams."
    ]
  }
];
