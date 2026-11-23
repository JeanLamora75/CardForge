import type { GameEntry, GameId } from '../catalog.ts';
import type { GameStatistics, LocalGameStorage } from '../ports/local-storage.ts';
import { stableResultId } from '../ports/local-storage.ts';

export type GameSessionIndicator = 'active' | 'finished' | 'none';
export type CatalogGameProgress = Readonly<{
  indicator: GameSessionIndicator;
  statistics: GameStatistics | null;
}>;

export const EMPTY_PROGRESS: CatalogGameProgress = Object.freeze({ indicator: 'none', statistics: null });

/** Browsing a game must remain strictly read-only, including after errors or reloads. */
export async function readCatalogGameProgress(
  storage: Pick<LocalGameStorage, 'readGame' | 'readResult' | 'readStatistics'>,
  gameId: GameId,
): Promise<CatalogGameProgress> {
  const [save, statistics] = await Promise.all([
    storage.readGame(gameId),
    storage.readStatistics(gameId),
  ]);
  if (!save) return { indicator: 'none', statistics: statistics ?? null };
  if (save.gameId !== gameId || !save.sessionId) throw new Error('Inconsistent saved game metadata');
  const terminal = await storage.readResult(stableResultId(gameId, save.sessionId));
  if (terminal && (terminal.gameId !== gameId || terminal.sessionId !== save.sessionId)) {
    throw new Error('Inconsistent saved game result');
  }
  const state = save.state;
  const savedOutcome = typeof state === 'object' && state !== null && 'outcome' in state
    ? state.outcome : undefined;
  if (savedOutcome !== 'in-progress' && savedOutcome !== 'win' && savedOutcome !== 'loss') {
    throw new Error('Inconsistent saved game outcome');
  }
  return {
    indicator: terminal || savedOutcome !== 'in-progress' ? 'finished' : 'active',
    statistics: statistics ?? null,
  };
}

export function availableGameActions(game: Pick<GameEntry, 'status' | 'playableRoute'>,
  progress: CatalogGameProgress,
): Readonly<{ play: boolean; resume: boolean; newGame: boolean }> {
  const playable = game.status === 'available' &&
    !!game.playableRoute && game.playableRoute.startsWith('/') && !game.playableRoute.startsWith('//');
  return {
    play: playable,
    resume: playable && progress.indicator === 'active',
    newGame: playable,
  };
}

export function victoryRate(statistics: GameStatistics | null): string {
  if (!statistics) return '—';
  const completed = statistics.won + statistics.lost;
  return completed > 0 ? `${Math.round(100 * statistics.won / completed)} %` : '—';
}
