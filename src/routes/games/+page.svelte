<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import { games } from '$lib/games';
	import { User } from 'lucide-svelte';
	import { getPlayerCount } from '$lib/state/party.svelte';

	async function handlePlay(game: (typeof games)[number]) {
		await goto(resolve(`/games/${game.name}`));
	}
</script>

<div class="flex w-full flex-col gap-8 p-8">
	{#each games as game (game.name)}
		<Card.Root class="w-[calc(100dvw---spacing(16))] max-w-none">
			<Card.Content class="flex flex-col">
				<div class="flex items-center justify-between">
					{game.name}
					<div class="flex items-center">
						<div class="flex p-4">
							<User />
							{game.minPlayers}
						</div>
						<button
							onclick={() => handlePlay(game)}
							class={buttonVariants({ variant: 'default' })}
							disabled={getPlayerCount() < game.minPlayers}
						>
							Play
						</button>
					</div>
				</div>
				<span class="mt-2 opacity-75">
					{game.description}
				</span>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
