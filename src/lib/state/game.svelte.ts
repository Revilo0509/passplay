import { PersistedState } from 'runed';
import { GameStage } from '$lib/games/GameModule';
import type { Player } from './party.svelte';

export interface ImpostorGameData {
	type: 'impostor';
	impostorCount: number;
	selectedCategory: string;
	impostors: Player[];
	impostorsKnowEachOther: boolean;
	showHintToImpostor: boolean;
	showCategoryToImpostor: boolean;
}

export type GameData =
	| ImpostorGameData
	| { type: string; [key: string]: unknown };

export const stage = new PersistedState<GameStage>('game-stage', GameStage.Settings);

export const gameData = new PersistedState<GameData>('game-data', { type: '' });

export function start(data: GameData) {
	gameData.current = data;
	stage.current = GameStage.Ingame;
}

export function end() {
	stage.current = GameStage.Ending;
}

export function reset() {
	stage.current = GameStage.Settings;
	gameData.current = { type: '' };
}
