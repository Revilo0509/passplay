export type Player = {
	name: string;
};

const players = $state(new Map<string, Player>());

export function addPlayer(player: Player) {
	players.set(player.name, player);
}

export function getPlayers() {
	return Array.from(players.values());
}

export function removePlayer(name: string) {
	players.delete(name);
}
