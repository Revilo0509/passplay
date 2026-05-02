<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { getPlayers } from '$lib/state/party.svelte';
	import type { ImpostorGame } from './impostor.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import { onMount, type Snippet } from 'svelte';

	interface props {
		game: ImpostorGame;
	}

	let { game }: props = $props();
	let players = $derived(getPlayers());

	let shownPlayers = $state<string[]>([]);
	let currentShow = $state<Snippet>();

	let selectedPlayer = $state<string | null>(null);
	let confirmDialogOpen = $state(false);
	let revealDialogOpen = $state(false);

	function openConfirm(name: string) {
		selectedPlayer = name;
		confirmDialogOpen = true;
	}

	function confirmShow() {
		if (!selectedPlayer) return;
		const isImpostor = game.impostors.some((i) => i.name === selectedPlayer);
		currentShow = isImpostor ? impostorSnippet : innocentSnippet;
		shownPlayers.push(selectedPlayer);
		confirmDialogOpen = false;
		setTimeout(() => (revealDialogOpen = true), 0);
	}

	onMount(async () => {
		try {
			const response = await (
				await fetch(
					`https://www.wordgamedb.com/api/v2/words?category=${game.selectedCategory}&limit=1`
				)
			).json();
			game.word = response.words[0].word;
			game.hint = response.words[0].hint;
		} catch (error) {
			console.error('Failed to fetch word:', error);
		}
	});
</script>

{#snippet impostorSnippet()}
	<span class="text-red-500">You are the impostor.</span>
	<span class="opacity-75">Hint: {game.hint}</span>
{/snippet}

{#snippet innocentSnippet()}
	<span>Word: {game.word}</span>
{/snippet}

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
				<AlertDialog.Action variant="destructive" onclick={game.endGame}>
					End game
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<AlertDialog.Root bind:open={confirmDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header class="text-xl">
				Are you sure you want to show {selectedPlayer}?
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={confirmShow}>Show</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<AlertDialog.Root bind:open={revealDialogOpen}>
		<AlertDialog.Content>
			{#if currentShow}
				{@render currentShow()}
			{/if}
			<AlertDialog.Footer>
				<AlertDialog.Cancel variant="default">Okay.</AlertDialog.Cancel>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<div class="flex flex-col gap-4">
		{#each players as player (player.name)}
			<button onclick={() => openConfirm(player.name)} class="w-full text-left">
				<Card.Root>
					<Card.Content>
						<span>{player.name}</span>
					</Card.Content>
				</Card.Root>
			</button>
		{/each}
	</div>
</div>
