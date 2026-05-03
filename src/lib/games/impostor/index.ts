import Settings from './Settings.svelte';
import Game from './Game.svelte';
import End from './End.svelte';
import type { GameModule } from '../GameModule';

export class ImpostorGame implements GameModule {
	name = 'impostor';
	descriptionKey = 'impostor.description';
	minPlayers = 3;
	settings = Settings;
	game = Game;
	end = End;
}
