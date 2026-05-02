<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import { getPlayerCount } from '$lib/state/party.svelte';
	import { onMount } from 'svelte';
	import type { ImpostorGame } from './impostor.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	interface props {
		game: ImpostorGame;
	}

	let { game }: props = $props();
	let maxPlayers = $derived(getPlayerCount());

	onMount(async () => {
		try {
			const response = (await fetch('https://www.wordgamedb.com/api/v2/categories')).json();
			game.categories = await response;
		} catch (error) {
			console.error('Failed to fetch categories:', error);
		}
	});

	const triggerContent = $derived(
		game.categories.find((f) => f === game.selectedCategory) ?? 'Select a category'
	);
</script>

<div class="flex flex-col gap-4 p-4">
	<div>
		<label>
			Number of Impostors:
			<NumberInput bind:value={game.impostorCount} min={1} max={maxPlayers} />
		</label>
		<label>
			Category:
			<div class="pt-4">
				<Select.Root type="single" bind:value={game.selectedCategory}>
					<Select.Trigger class="w-full">{triggerContent}</Select.Trigger>
					<Select.Content>
						{#each game.categories as category (category)}
							<Select.Item value={category} label={category}>
								{category}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</label>
	</div>
</div>
