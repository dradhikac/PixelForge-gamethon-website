export interface Event {
  id: string;
  number: string;
  district: string;
  title: string;
  concepts: string[];
  format: string;
  description: string;
  color: string;
}

export const events: Event[] = [
  {
    id: "prisoners-dilemma",
    number: "01",
    district: "STRATEGY DISTRICT",
    title: "Prisoner's Dilemma Arena",
    concepts: ["Dominant Strategies", "Nash Equilibrium"],
    format: "Round-robin iterated Prisoner's Dilemma tournament",
    description: "Play repeated cooperate-or-betray rounds against every team. Total points decide the leaderboard.",
    color: "#FF006E"
  },
  {
    id: "auction-championship",
    number: "02",
    district: "MARKET DISTRICT",
    title: "Live Auction Championship",
    concepts: ["Vickrey Auctions", "VCG", "Truthful Bidding"],
    format: "Sealed-bid tournaments across First Price, Second Price, and VCG mechanisms",
    description: "Bid fake currency across three auction formats and prove you are the smartest bidder in the market district.",
    color: "#00D9FF"
  },
  {
    id: "mechanism-design",
    number: "03",
    district: "MECHANISM LAB",
    title: "Mechanism Design Hackathon",
    concepts: ["Incentive Compatibility", "Revelation Principle"],
    format: "Design who-gets-what and who-pays rules for a surprise problem",
    description: "Given a surprise problem, design an incentive-compatible mechanism and pitch it live.",
    color: "#00FF85"
  },
  {
    id: "voting-governance",
    number: "04",
    district: "GOVERNANCE SECTOR",
    title: "Voting & Governance Challenge",
    concepts: ["Social Choice Theory", "Arrow's Impossibility Theorem"],
    format: "Design and test a voting/aggregation rule against sample preferences",
    description: "Design your own voting system, then explain where it breaks fairness.",
    color: "#FFD600"
  },
  {
    id: "bot-arena",
    number: "05",
    district: "BOT ARENA",
    title: "Multi-Agent Bot Arena",
    concepts: ["No-Regret Dynamics", "Multi-Agent RL", "Price of Anarchy"],
    format: "Pre-coded bots compete in a repeated resource-sharing game",
    description: "Submit a bot that auto-competes against other teams in a resource-sharing arena.",
    color: "#FF6B00"
  },
  {
    id: "gamecraft-challenge",
    number: "06",
    district: "PIXEL FORGE HQ",
    title: "Pixel Forge Challenge",
    concepts: ["Applied Game Theory", "Strategic Design", "Playable Systems"],
    format: "BUILD → SUBMIT → DEMO",
    description: "Build a playable game with a real strategy concept in 30 hours, then demo it.",
    color: "#9D4EDD"
  }
];
