import { games, type GameId } from '../catalog.ts';

export type GameSection = 'detail' | 'rules' | 'statistics';
export type CatalogRoute =
  | Readonly<{ page: 'catalog' }>
  | Readonly<{ page: 'settings' }>
  | Readonly<{ page: 'game'; gameId: GameId; section: GameSection }>;

export const HOME: CatalogRoute = { page: 'catalog' };

export function parseCatalogRoute(hash: string): CatalogRoute {
  const fragments = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!fragments.length) return HOME;
  if (fragments.length === 1 && fragments[0] === 'settings') return { page: 'settings' };
  if (fragments[0] !== 'game' || fragments.length < 2 || fragments.length > 3) return HOME;
  const game = games.find(entry => entry.id === fragments[1]);
  const section = fragments[2] ?? 'detail';
  if (!game || !['detail','rules','statistics'].includes(section)) return HOME;
  return { page: 'game', gameId: game.id, section: section as GameSection };
}

export function routeHash(route: CatalogRoute): string {
  if (route.page === 'catalog') return '';
  if (route.page === 'settings') return '#settings';
  return `#game/${route.gameId}${route.section === 'detail' ? '' : `/${route.section}`}`;
}

export function backRoute(route: CatalogRoute): CatalogRoute {
  if (route.page === 'game' && route.section !== 'detail')
    return { page: 'game', gameId: route.gameId, section: 'detail' };
  return HOME;
}
