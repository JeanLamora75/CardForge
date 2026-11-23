import type { GameStatistics } from "../ports/local-storage.ts";
import { victoryRate } from "./catalog-navigation.ts";
import { getNewGameChoice, confirmNewGame } from "./new-game-choice.ts";
import type { GameEngine } from "../core/game-engine.ts";
import type { LocalGameStorage } from "../ports/local-storage.ts";
import type { PersistentGameSession, PersistentSessionOptions } from "./persistent-game-session.ts";

export interface GameSummary {
  gameId: "clear-the-dungeon" | "gridcannon";
  outcome: "win" | "loss";
  title: string;
  explanation: string;
  details: readonly string[];
  score: number | null;
  scoreLabel: string | null;
}

export function makeGrimDelveSummary(state: {
  outcome: "in-progress" | "win" | "loss" | "abandoned";
  defeated: readonly string[];
  damages: readonly unknown[];
  handNumber: number;
  drawPile: readonly unknown[];
  endReason?: string | null;
  victoryScore?: number | null;
}): GameSummary | null {
  if (state.outcome !== "win" && state.outcome !== "loss") return null;
  return {
    gameId: "clear-the-dungeon", outcome: state.outcome,
    title: state.outcome === "win" ? "Victoire · Le donjon est libéré" : "Défaite · L'expédition s'achève",
    explanation: state.outcome === "win" ? "Les douze monstres ont été vaincus." :
      state.endReason === "damage" ? "Sept dégâts subis ont mis fin à la partie." :
      "La pioche est épuisée avant la victoire.",
    details: [`Monstres vaincus : ${state.defeated.length} / 12`,
      `Dégâts : ${state.damages.length} / 7`, `Mains jouées : ${state.handNumber}`],
    score: state.outcome === "win" ? state.victoryScore ?? null : null,
    scoreLabel: state.outcome === "win" && state.victoryScore != null
      ? "Score officiel · cartes restantes dans la pioche" : null,
  };
}

export function makeThunderfighterSummary(state: {
  outcome: "in-progress" | "win" | "loss" | "abandoned";
  defeatedFigures?: readonly string[];
  specialReserve: readonly string[];
  spentSpecials: readonly string[];
  drawPile: readonly string[];
  lossReason?: "armor" | "stalemate" | null;
  victoryScore?: number | null;
}): GameSummary | null {
  if (state.outcome !== "win" && state.outcome !== "loss") return null;
  return {
    gameId: "gridcannon", outcome: state.outcome,
    title: state.outcome === "win" ? "Victoire · La flotte triomphe" : "Défaite · Fin de mission",
    explanation: state.outcome === "win" ? "Les douze figures adverses ont été neutralisées." :
      state.lossReason === "armor" ? "Une armure a atteint le seuil de résistance infranchissable." :
      "Aucune continuation légale ne permet de terminer la mission.",
    details: [`Adversaires neutralisés : ${state.defeatedFigures?.length ?? 0} / 12`,
      `Actions spéciales utilisées : ${state.spentSpecials.length} / 6`,
      `Pioche : ${state.drawPile.length} carte(s)`],
    score: state.outcome === "win" ? state.victoryScore ?? null : null,
    scoreLabel: state.outcome === "win" && state.victoryScore != null
      ? "Score officiel · As et Jokers non utilisés" : null,
  };
}

export function presentGameStatistics(statistics: GameStatistics | null) {
  return {
    played: statistics?.played ?? 0,
    won: statistics?.won ?? 0,
    lost: statistics?.lost ?? 0,
    abandoned: statistics?.abandoned ?? 0,
    victoryRate: victoryRate(statistics),
  };
}

/** Replay is only permitted over a previously finished session; an active save is never abandoned silently. */
export async function replayFinishedGame<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  storage: LocalGameStorage,
  options: PersistentSessionOptions,
  setup: Setup,
  sessionId: string,
): Promise<PersistentGameSession<State, Action>> {
  const saved = await storage.readGame<{ outcome?: string }>(options.gameId);
  if (!saved || (saved.state.outcome !== "win" && saved.state.outcome !== "loss"))
    throw new Error("Impossible de rejouer : la sauvegarde n'est pas terminée.");
  const choice = await getNewGameChoice(storage, options.gameId);
  if (choice.kind !== "confirmation-required" || choice.existingSessionId !== saved.sessionId)
    throw new Error("La sauvegarde a changé. Rechargez le plateau.");
  const created = await confirmNewGame(engine, storage, {
    ...options, sessionId,
  }, setup, choice, true);
  if (!created) throw new Error("La nouvelle partie n'a pas été créée.");
  return created;
}
