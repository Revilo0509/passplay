<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import { games } from '$lib/games';
	import { User } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
	import type { GameModule } from '$lib/games/GameModule';

	type MessageFunc = () => string;
	const messages = m as unknown as Record<string, MessageFunc>;

	function getGameTitle(game: GameModule): string {
		const key = `${game.name}.name`;
		return messages[key]?.() ?? game.name;
	}

	function getGameDescription(game: GameModule): string {
		if (game.descriptionKey) {
			return messages[game.descriptionKey]?.() ?? game.description ?? '';
		}
		return game.description ?? '';
	}

	async function handlePlay(game: (typeof games)[number]) {
		await goto(resolve(`/games/${game.name}`));
	}
</script>

<div class="flex w-full flex-col gap-8 p-8">
	{#each games as gameItem (gameItem.name)}
		<Card.Root class="w-[calc(100dvw---spacing(16))] max-w-none">
			<Card.Content class="flex flex-col">
				<div class="flex items-center justify-between">
					{getGameTitle(gameItem)}
					<div class="flex items-center">
						<div class="flex p-4">
							<User />
							{m['games.minPlayers']({ count: gameItem.minPlayers })}
						</div>
						<button
							onclick={() => handlePlay(gameItem)}
							class={buttonVariants({ variant: 'default' })}
						>
							{m['games.play']()}
						</button>
					</div>
				</div>
				<span class="mt-2 opacity-75">
					{getGameDescription(gameItem)}
				</span>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
