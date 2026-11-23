export type Prize = {
  id: string;
  label: string;
  detail: string;
  code?: string;
  weight: number;
  tone: "leaf" | "moss" | "soil" | "gold" | "cream" | "berry";
  win: boolean;
};

export const PRIZES: Prize[] = [
  {
    id: "off10",
    label: "10% off",
    detail: "Sitewide on your next order over £25.",
    code: "SPIN10",
    weight: 18,
    tone: "leaf",
    win: true,
  },
  {
    id: "delivery",
    label: "Free delivery",
    detail: "Standard mainland UK delivery on orders £20+.",
    code: "FREESHIP",
    weight: 14,
    tone: "moss",
    win: true,
  },
  {
    id: "seeds",
    label: "Free seeds",
    detail: "Seasonal seed packet added with your next plant order.",
    code: "SEEDGIFT",
    weight: 12,
    tone: "gold",
    win: true,
  },
  {
    id: "miss",
    label: "Try again",
    detail: "No prize this spin — come back for the next campaign.",
    weight: 22,
    tone: "cream",
    win: false,
  },
  {
    id: "off15",
    label: "15% off",
    detail: "Bigger saving on hardy plants and patio favourites.",
    code: "SPIN15",
    weight: 8,
    tone: "berry",
    win: true,
  },
  {
    id: "fiver",
    label: "£5 off £30",
    detail: "Spend £30 or more and take £5 off at checkout.",
    code: "YG5OFF",
    weight: 14,
    tone: "soil",
    win: true,
  },
  {
    id: "club",
    label: "Club trial",
    detail: "30 days of YouGarden Club member pricing.",
    code: "CLUB30",
    weight: 8,
    tone: "leaf",
    win: true,
  },
  {
    id: "miss2",
    label: "Almost!",
    detail: "So close — spin again next time you visit.",
    weight: 4,
    tone: "cream",
    win: false,
  },
];

export const TONE_COLORS: Record<Prize["tone"], { fill: string; text: string }> = {
  leaf: { fill: "#2f6b3a", text: "#f4f7f0" },
  moss: { fill: "#5a8f4a", text: "#f4f7f0" },
  soil: { fill: "#6b4a32", text: "#f4f7f0" },
  gold: { fill: "#c4a035", text: "#1c2a1a" },
  cream: { fill: "#e8e2d4", text: "#1c2a1a" },
  berry: { fill: "#8a3d3d", text: "#f4f7f0" },
};

/** Weighted random prize index. */
export function pickPrizeIndex(prizes: Prize[] = PRIZES): number {
  const total = prizes.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < prizes.length; i++) {
    roll -= prizes[i].weight;
    if (roll <= 0) return i;
  }
  return prizes.length - 1;
}
