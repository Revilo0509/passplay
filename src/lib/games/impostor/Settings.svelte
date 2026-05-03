<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import { getPlayerCount, players } from '$lib/state/party.svelte';
	import { gameType, start } from '$lib/state/game.svelte';
	import { fetchCategories } from '$lib/services/api';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';

	let maxPlayers = $derived(getPlayerCount());

	let impostorCount = $state(1);
	let selectedCategory = $state('');
	let categoryList = $state<string[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		categoryList = await fetchCategories();
		isLoading = false;
	});

	const triggerContent = $derived(
		categoryList.find((f: string) => f === selectedCategory) ?? 'Select a category'
	);

	function handleStart() {
		const impostors: { name: string }[] = [];
		const allPlayers = [...players.current];
		for (let i = 0; i < impostorCount; i++) {
			const index = Math.floor(Math.random() * allPlayers.length);
			impostors.push(allPlayers.splice(index, 1)[0]);
		}

		start({
			type: 'impostor',
			impostorCount,
			selectedCategory,
			impostors
		});
		gameType.current = 'impostor';
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<div>
		<label>
			Number of Impostors:
			<NumberInput bind:value={impostorCount} min={1} max={maxPlayers} />
		</label>
		<label>
			Category:
			<div class="pt-4">
				{#if isLoading}
					<p>Loading categories...</p>
				{:else}
					<Select.Root type="single" bind:value={selectedCategory}>
						<Select.Trigger class="w-full">{triggerContent}</Select.Trigger>
						<Select.Content>
							{#each categoryList as category (category)}
								<Select.Item value={category} label={category}>
									{category}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/if}
			</div>
		</label>
	</div>

	<button class="mt-auto" disabled={!selectedCategory || maxPlayers < 3} onclick={handleStart}>
		Continue
	</button>
</div>
