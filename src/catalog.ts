export type GameId = "clear-the-dungeon" | "gridcannon" | "card-capture" | "loot-the-loop" | "regicide";
export type GameEntry = {
  id: GameId;
  title: string;
  setting: string;
  description: string;
  icon: string;
  accent: string;
  status: "planned" | "in-design";
};

export const games: readonly GameEntry[] = [
  { id: "clear-the-dungeon", title: "Clear the Dungeon", setting: "Dark Fantasy", description: "Quatre colonnes de créatures, des héros et des choix tactiques.", icon: "⚔️", accent: "ember", status: "in-design" },
  { id: "gridcannon", title: "Gridcannon", setting: "Guerre spatiale", description: "Un affrontement spatial de placement et de calcul.", icon: "🚀", accent: "cosmos", status: "planned" },
  { id: "card-capture", title: "Card Capture", setting: "Cyberpunk", description: "Capturez des adversaires pour développer votre arsenal.", icon: "⚡", accent: "neon", status: "planned" },
  { id: "loot-the-loop", title: "Loot the Loop", setting: "Égypte ancienne", description: "Explorez un temple, découvrez ses pièges et ses trésors.", icon: "🏺", accent: "sand", status: "planned" },
  { id: "regicide", title: "Regicide", setting: "Fantasy héroïque", description: "Projet envisagé, sous réserve des droits nécessaires.", icon: "👑", accent: "royal", status: "planned" }
];
