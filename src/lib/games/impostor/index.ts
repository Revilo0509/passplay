import Settings from './Settings.svelte';
import Game from './Game.svelte';
import End from './End.svelte';
import type { GameModule } from '../GameModule';

export class ImpostorGame implements GameModule {
	name = 'impostor';
	description =
		"Everybody gets a word, execpt for the imposter. Which gets a hint. The goal is to communicate to everybody else that you know the word without revealing it to the imposter. At the end of the discussion everybody votes on who you think the imposter is. If the imposter ins't voted out the impostor wins.";
	minPlayers = 3;
	settings = Settings;
	game = Game;
	end = End;
}
