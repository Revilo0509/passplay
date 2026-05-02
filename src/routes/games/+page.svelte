<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';

	const games = [
		{
			name: 'Impostor',
			description:
				"Everybody gets a word, execpt for the imposter. Which gets a hint. The goal is to communicate to everybody else that you know the word without revealing it to the imposter. At the end of the discussion everybody votes on who you think the imposter is. If the imposter ins't voted out the impostor wins.",
			to: '/games/impostor'
		}
	] as const;
</script>

<div class="flex w-full flex-col gap-8 p-8">
	{#each games as game (game.name)}
		<Card.Root class="w-[calc(100dvw---spacing(16))] max-w-none">
			<Card.Content class="flex flex-col">
				<div class="flex items-center justify-between">
					{game.name}
					<a href={resolve(game.to)} class={buttonVariants({ variant: 'default' })}>Play</a>
				</div>
				<span class="mt-2 opacity-75">
					{game.description}
				</span>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
