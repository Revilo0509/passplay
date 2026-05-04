<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { players, type Player } from '$lib/state/party.svelte';
	import { gameData, end, type ImpostorGameData } from '$lib/state/game.svelte';
	import { fetchWord } from '$lib/services/api';
	import * as Card from '$lib/components/ui/card/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import { onMount } from 'svelte';
	import Center from '$lib/components/Center.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { Check } from 'lucide-svelte';

	const playerList = $derived(players.current);
	const data = $derived(gameData.current as ImpostorGameData);

	let currentWord = $state<{ word: string; hint: string } | null>(null);
	let isLoading = $state(true);

	onMount(async () => {
		currentWord = await fetchWord(data.selectedCategory);
		isLoading = false;
	});

	let selectedPlayer = $state<Player>({ name: '' });
	let confirmDialogOpen = $state(false);
	let revealDialogOpen = $state(false);
	let shownPlayers = new SvelteSet<string>();

	function openConfirm(player: Player) {
		selectedPlayer = player;
		confirmDialogOpen = true;
	}

	let currentReveal = $state<'word' | 'hint'>('word');

	function confirmShow() {
		if (!selectedPlayer) return;

		const isImpostor = data.impostors.some((i: Player) => i.name === selectedPlayer.name);
		currentReveal = isImpostor ? 'hint' : 'word';

		shownPlayers.add(selectedPlayer.name);

		confirmDialogOpen = false;
		setTimeout(() => (revealDialogOpen = true), 0);
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
			End Game
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header class="text-xl">
				Are you sure you want to end the game?
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Continue Playing</AlertDialog.Cancel>
				<AlertDialog.Action variant="destructive" onclick={end}>End game</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<AlertDialog.Root bind:open={confirmDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header class="text-xl">
				Are you sure you want to show {selectedPlayer.name}?
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={confirmShow}>Show</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<AlertDialog.Root bind:open={revealDialogOpen}>
		<AlertDialog.Content>
			{#if currentReveal === 'word'}
				<span>Word: {currentWord?.word}</span>
			{:else}
				<span class="text-red-500">You are the impostor.</span>
				{#if data.showHintToImpostor}
					<span class="opacity-75">Hint: {currentWord?.hint}</span>
				{/if}
				{#if data.impostorCount > 1 && data.impostorsKnowEachOther}
					<span class="opacity-75">Impostors: {data.impostors.map((i) => i.name).join(', ')}</span>
				{/if}
				{#if data.showCategoryToImpostor}
					<span class="opacity-75">Category: {data.selectedCategory ?? 'All'}</span>
				{/if}
			{/if}
			<AlertDialog.Footer>
				<AlertDialog.Cancel variant="default">Okay.</AlertDialog.Cancel>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	{#if isLoading}
		<Center>
			<p>Loading...</p>
		</Center>
	{:else}
		<div class="relative flex flex-1">
			<div class="absolute overflow-auto">
				{#each playerList as player (player.name)}
					<button onclick={() => openConfirm(player)} class="w-full text-left disabled:opacity-50">
						<Card.Root class="mb-4">
							<Card.Content class="flex items-center justify-between">
								<span class="h-6">{player.name}</span>
								{#if shownPlayers.has(player.name)}
									<Check />
								{/if}
							</Card.Content>
						</Card.Root>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
