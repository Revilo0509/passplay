import { PersistedState } from 'runed';

export type Player = {
	name: string;
};

export const players = new PersistedState<Player[]>('players', []);
export const currentPlayerIndex = new PersistedState<number>('currentPlayerIndex', 0);

/**
 * Adds a player to the players list if the name is unique.
 *
 * @param {Player} player - The player object to add.
 * @returns {boolean} Returns false if the player was added, true if a player with the same name already exists.
 */
export function addPlayer(player: Player): boolean {
	if (players.current.some((p) => p.name === player.name)) return true;
	players.current = [...players.current, player];
	return false;
}

export function removePlayer(name: string) {
	players.current = players.current.filter((p) => p.name !== name);
	if (currentPlayerIndex.current >= players.current.length) {
		currentPlayerIndex.current = 0;
	}
}

export function getPlayerCount() {
	return players.current.length;
}

export function clearPlayers() {
	players.current = [];
}

export function getRandomPlayer() {
	if (players.current.length === 0) return undefined;
	const index = Math.floor(Math.random() * players.current.length);
	return players.current[index];
}

export function setCurrentPlayerIndex(index: number) {
	const safeIndex =
		((index % players.current.length) + players.current.length) % players.current.length;
	currentPlayerIndex.current = safeIndex;
}

export function getCurrentPlayer() {
	return players.current.length === 0 ? undefined : players.current[currentPlayerIndex.current];
}

export function nextPlayer() {
	if (players.current.length === 0) return;
	currentPlayerIndex.current = (currentPlayerIndex.current + 1) % players.current.length;
}
