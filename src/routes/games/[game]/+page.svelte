<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { games } from '$lib/games';
	import { GameStage } from '$lib/games/GameModule';
	import { error } from '@sveltejs/kit';

	const gameName = page.params.game as keyof typeof games;

	if (!games[gameName]) {
		throw error(404, 'Game Not Found');
	}

	const module = games[gameName]();

	const stage = $derived(module.stage);
	const Settings = module.settings;
	const Game = module.game;
	const End = module.end;
</script>

<div class="flex flex-1 flex-col">
	{#if stage == GameStage.Settings}
		<Settings game={module} />
		<Button class="m-4 mt-auto" onclick={module.StartGame}>Continue</Button>
	{:else if stage == GameStage.Ingame}
		<Game game={module} />
	{:else if stage == GameStage.Ending}
		<End game={module} />
	{:else}
		How did you get here?? I't shouldn't be possible.
	{/if}
</div>
