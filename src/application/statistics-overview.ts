import type { GameStatistics } from "../ports/local-storage.ts";
import { victoryRate } from "./catalog-navigation.ts";

export function statisticsOverview(statistics: GameStatistics | null) {
  const won = statistics?.won ?? 0;
  const lost = statistics?.lost ?? 0;
  const abandoned = statistics?.abandoned ?? 0;
  const completed = won + lost;
  const total = completed + abandoned;
  return {
    won, lost, abandoned, completed, total,
    rate: completed ? won / completed : null,
    rateLabel: victoryRate(statistics),
    shares: [won, lost, abandoned].map(value => total ? value / total : 0),
  };
}
