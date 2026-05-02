import { persisted } from 'svelte-persisted-store';

export type Player = {
	name: string;
};

let players = $state<Player[]>([]);
let currentIndex = $state<number>(0);

const persistedPlayers = persisted<Player[]>('players', []);
const persistedIndex = persisted<number>('currentPlayerIndex', 0);

persistedPlayers.subscribe((value) => {
	players = value;
});

persistedIndex.subscribe((value) => {
	currentIndex = value;
});

function savePlayers() {
	persistedPlayers.set(players);
}

function saveIndex() {
	persistedIndex.set(currentIndex);
}

export function addPlayer(player: Player) {
	if (players.some((p) => p.name === player.name)) return;
	players = [...players, player];
	savePlayers();
}

export function removePlayer(name: string) {
	players = players.filter((p) => p.name !== name);
	if (currentIndex >= players.length) {
		currentIndex = 0;
	}
	savePlayers();
	saveIndex();
}

export function getPlayers() {
	return players;
}

export function getPlayerCount() {
	return players.length;
}

export function clearPlayers() {
	players = [];
	savePlayers();
}

export function getRandomPlayer() {
	if (players.length === 0) return undefined;
	const index = Math.floor(Math.random() * players.length);
	return players[index];
}

export function setCurrentPlayerIndex(index: number) {
	const safeIndex = ((index % players.length) + players.length) % players.length;
	currentIndex = safeIndex;
	saveIndex();
}

export function getCurrentPlayer() {
	return players.length === 0 ? undefined : players[currentIndex];
}

export function nextPlayer() {
	if (players.length === 0) return;
	currentIndex = (currentIndex + 1) % players.length;
	saveIndex();
}
