import Settings from './Settings.svelte';
import { getRandomPlayer, type Player } from '$lib/state/party.svelte';
import Game from './Game.svelte';
import End from './End.svelte';
import { GameStage } from '../GameModule';

export function createImpostorGame() {
	const state = $state({
		stage: GameStage.Settings,
		impostorCount: 1,
		impostors: [] as Player[],

		categories: [] as string[],
		selectedCategory: '',

		word: 'Woah, restart the game!',
		hint: 'Woah, restart the game!'
	});

	const StartGame = () => {
		state.impostors = [];
		for (let i = 0; i < state.impostorCount; i++) {
			const impostor = getRandomPlayer();
			if (impostor) state.impostors.push(impostor);
		}
		state.stage = GameStage.Ingame;
	};

	const endGame = () => {
		state.stage = GameStage.Ending;
	};

	return {
		name: 'Impostor',
		minPlayers: 3,
		get stage() {
			return state.stage;
		},
		set stage(value) {
			state.stage = value;
		},
		get impostorCount() {
			return state.impostorCount;
		},
		set impostorCount(value) {
			state.impostorCount = value;
		},
		get impostors() {
			return state.impostors;
		},
		get categories() {
			return state.categories;
		},
		set categories(value) {
			state.categories = value;
		},
		get word() {
			return state.word;
		},
		set word(value) {
			state.word = value;
		},
		get hint() {
			return state.hint;
		},
		set hint(value) {
			state.hint = value;
		},
		get selectedCategory() {
			return state.selectedCategory;
		},
		set selectedCategory(value) {
			state.selectedCategory = value;
		},
		settings: Settings,
		game: Game,
		end: End,
		StartGame,
		endGame
	};
}

export type ImpostorGame = ReturnType<typeof createImpostorGame>;
