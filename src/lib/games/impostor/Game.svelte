<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { players, type Player } from '$lib/state/party.svelte';
	import { gameData, end } from '$lib/state/game.svelte';
	import { fetchWord } from '$lib/services/api';
	import * as Card from '$lib/components/ui/card/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import { onMount } from 'svelte';
	import Center from '$lib/components/Center.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { Check } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';

	const playerList = $derived(players.current);
	const data = $derived(
		gameData.current as { type: 'impostor'; selectedCategory?: string; impostors: Player[] }
	);

	let currentWord = $state<{ word: string; hint: string } | null>(null);
	let isLoading = $state(true);
	let currentLocale = $derived(getLocale());

	onMount(async () => {
		currentWord = await fetchWord(data.selectedCategory, currentLocale);
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

		const isImpostor = data.impostors.some((i) => i.name === selectedPlayer.name);
		currentReveal = isImpostor ? 'hint' : 'word';

		shownPlayers.add(selectedPlayer.name);

		confirmDialogOpen = false;
		setTimeout(() => (revealDialogOpen = true), 0);
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
			{m['impostor.game.endGame']()}
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header class="text-xl">
				{m['impostor.game.endGameConfirm']()}
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{m['impostor.game.continuePlaying']()}</AlertDialog.Cancel>
				<AlertDialog.Action variant="destructive" onclick={end}
					>{m['impostor.game.endGame']()}</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<AlertDialog.Root bind:open={confirmDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header class="text-xl">
				{m['impostor.game.showPlayer']({ player: selectedPlayer.name })}
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{m['party.cancel']()}</AlertDialog.Cancel>
				<AlertDialog.Action onclick={confirmShow}>{m['impostor.game.show']()}</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<AlertDialog.Root bind:open={revealDialogOpen}>
		<AlertDialog.Content>
			{#if currentReveal === 'word'}
				<span>{m['impostor.game.word']()} {currentWord?.word}</span>
			{:else}
				<span class="text-red-500">{m['impostor.game.youAreImpostor']()}</span>
				<span class="opacity-75">{m['impostor.game.hint']()} {currentWord?.hint}</span>
			{/if}
			<AlertDialog.Footer>
				<AlertDialog.Cancel variant="default">{m['impostor.game.okay']()}</AlertDialog.Cancel>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	{#if isLoading}
		<Center>
			<p>{m['impostor.game.loading']()}</p>
		</Center>
	{:else}
		<div class="flex flex-col gap-4">
			{#each playerList as player (player.name)}
				<button onclick={() => openConfirm(player)} class="w-full text-left disabled:opacity-50">
					<Card.Root>
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
	{/if}
</div>
