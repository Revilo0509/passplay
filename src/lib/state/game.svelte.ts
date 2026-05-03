import { PersistedState } from "runed";
import { GameStage } from "$lib/games/GameModule";
import type { Player } from "./party.svelte";

export type GameData =
	| { type: "impostor"; impostorCount: number; selectedCategory: string; impostors: Player[] }
	| { type: string; [key: string]: unknown };

export const stage = new PersistedState<GameStage>("game-stage", GameStage.Settings);

export const gameType = new PersistedState<string>("game-type", "");

export const gameData = new PersistedState<GameData>("game-data", { type: "" });

export function start(data: GameData) {
	gameData.current = data;
	stage.current = GameStage.Ingame;
}

export function end() {
	stage.current = GameStage.Ending;
}

export function reset() {
	stage.current = GameStage.Settings;
	gameData.current = { type: "" };
	gameType.current = "";
}