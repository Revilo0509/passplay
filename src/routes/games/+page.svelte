<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import { games } from '$lib/games';
	import { User } from 'lucide-svelte';

	async function handlePlay(game: (typeof games)[number]) {
		await goto(resolve(`/games/${game.name}`));
	}
</script>

<div class="flex w-full flex-col gap-8 p-8">
	{#each games as gameItem (gameItem.name)}
		<Card.Root class="w-[calc(100dvw---spacing(16))] max-w-none">
			<Card.Content class="flex flex-col">
				<div class="flex items-center justify-between">
					{gameItem.name}
					<div class="flex items-center">
						<div class="flex p-4">
							<User />
							{gameItem.minPlayers}
						</div>
						<button
							onclick={() => handlePlay(gameItem)}
							class={buttonVariants({ variant: 'default' })}
						>
							Play
						</button>
					</div>
				</div>
				<span class="mt-2 opacity-75">
					{gameItem.description}
				</span>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
