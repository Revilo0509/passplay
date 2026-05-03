<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import { getPlayerCount, players } from '$lib/state/party.svelte';
	import { gameType, start } from '$lib/state/game.svelte';
	import { fetchCategories } from '$lib/services/api';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';
	import Center from '$lib/components/Center.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let maxPlayers = $derived(getPlayerCount());

	let impostorCount = $state(1);
	let selectedCategory = $state('All');
	let categoryList = $state<string[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		const categories = await fetchCategories();
		categoryList = ['All', ...categories];
		isLoading = false;
	});

	const triggerContent = $derived(
		categoryList.find((f: string) => f === selectedCategory) ?? 'All'
	);

	function handleStart() {
		const impostors: { name: string }[] = [];
		const allPlayers = [...players.current];
		for (let i = 0; i < impostorCount; i++) {
			const index = Math.floor(Math.random() * allPlayers.length);
			impostors.push(allPlayers.splice(index, 1)[0]);
		}

		const category = selectedCategory === 'All' ? undefined : selectedCategory;

		start({
			type: 'impostor',
			impostorCount,
			selectedCategory: category,
			impostors
		});
		gameType.current = 'impostor';
	}
</script>

<div class="flex flex-1 flex-col justify-between gap-4 p-4">
	<div>
		<label>
			Number of Impostors:
			<NumberInput bind:value={impostorCount} min={1} max={maxPlayers} />
		</label>
		<label>
			Category:
			<div class="pt-4">
				{#if isLoading}
					<Center>
						<p>Loading categories...</p>
					</Center>
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

	<Button onclick={handleStart}>Continue</Button>
</div>
