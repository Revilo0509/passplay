<script lang="ts">
	import { page } from '$app/state';
	import { games } from '$lib/games';
	import { GameStage } from '$lib/games/GameModule';
	import { stage } from '$lib/state/game.svelte';
	import { error } from '@sveltejs/kit';

	const gameName = page.params.game as keyof typeof games;
	const game = games.find((g) => g.name === gameName);

	if (!game) {
		throw error(404, 'Game Not Found');
	}

	const currentStage = $derived(stage.current);
	const Settings = game.settings;
	const Game = game.game;
	const End = game.end;
</script>

<div class="flex flex-1 flex-col">
	{#if currentStage == GameStage.Settings}
		<Settings />
	{:else if currentStage == GameStage.Ingame}
		<Game />
	{:else if currentStage == GameStage.Ending}
		<End />
	{:else}
		How did you get here?? It shouldn't be possible.
	{/if}
</div>
