import type { Component } from 'svelte';

export enum GameStage {
	Settings,
	Ingame,
	Ending
}

export interface GameModule {
	name: string;
	minPlayers: number;
	stage: GameStage;
	settings: Component;
	game: Component;
	end: Component;

	StartGame(): void;
	nextTurn(): void;
}
