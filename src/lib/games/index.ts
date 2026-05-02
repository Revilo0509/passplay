import { createImpostorGame } from './impostor/impostor.svelte';

export const games = {
	impostor: createImpostorGame
} as const;
