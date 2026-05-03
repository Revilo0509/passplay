<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import { getPlayerCount, players } from '$lib/state/party.svelte';
	import { gameType, start } from '$lib/state/game.svelte';
	import { fetchCategories } from '$lib/services/api';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';
	import Center from '$lib/components/Center.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';

	let maxPlayers = $derived(getPlayerCount());

	let impostorCount = $state(1);
	let selectedCategory = $state('All');
	let categoryList = $state<string[]>([]);
	let isLoading = $state(true);
	let currentLocale = $derived(getLocale());

	const allCategoryLabel = $derived(m['impostor.settings.all']());

	onMount(async () => {
		const categories = await fetchCategories(currentLocale);
		categoryList = [allCategoryLabel, ...categories];
		selectedCategory = allCategoryLabel;
		isLoading = false;
	});

	const triggerContent = $derived(
		categoryList.find((f: string) => f === selectedCategory) ?? allCategoryLabel
	);

	function handleStart() {
		const impostors: { name: string }[] = [];
		const allPlayers = [...players.current];
		for (let i = 0; i < impostorCount; i++) {
			const index = Math.floor(Math.random() * allPlayers.length);
			impostors.push(allPlayers.splice(index, 1)[0]);
		}

		const category = selectedCategory === allCategoryLabel ? undefined : selectedCategory;

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
			{m['impostor.settings.impostorCount']()}
			<NumberInput bind:value={impostorCount} min={1} max={maxPlayers} />
		</label>
		<label>
			{m['impostor.settings.category']()}
			<div class="pt-4">
				{#if isLoading}
					<Center>
						<p>{m['impostor.settings.loadingCategories']()}</p>
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

	<Button onclick={handleStart}>{m['impostor.settings.continue']()}</Button>
</div>
