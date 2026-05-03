import type { Component } from 'svelte';

export enum GameStage {
	Settings,
	Ingame,
	Ending
}

export interface GameModule {
	name: string;
	description: string;
	minPlayers: number;
	settings: Component;
	game: Component;
	end: Component;
}
