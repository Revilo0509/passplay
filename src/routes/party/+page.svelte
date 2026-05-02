<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { addPlayer, clearPlayers, getPlayers, removePlayer } from '$lib/state/party.svelte';
	import { PlusIcon } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index';
	import * as Dialog from '$lib/components/ui/dialog/index';

	let newPlayerName = $state('');
	let isClearDialogOpen = $state(false);

	const players = $derived(getPlayers());

	function submit() {
		if (!newPlayerName.trim()) return;

		addPlayer({ name: newPlayerName });
		newPlayerName = '';
	}

	function clear() {
		isClearDialogOpen = false;
		clearPlayers();
	}
</script>

<div class="flex flex-1 flex-col items-center justify-center">
	<div class="relative w-dvw flex-1">
		<div class="absolute inset-0 overflow-auto p-8">
			{#each players as player (player.name)}
				<Card.Root class="mb-4">
					<Card.Content class="flex items-center justify-between">
						{player.name}

						<Button variant="destructive" onclick={() => removePlayer(player.name)}>Remove</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div
			class="absolute right-0 bottom-0 left-0 flex gap-2 rounded-t-2xl bg-background p-4 outline"
		>
			<Input type="text" bind:value={newPlayerName} />
			<Button onclick={submit}>
				<PlusIcon />
			</Button>

			<Dialog.Root bind:open={isClearDialogOpen}>
				<Dialog.Trigger><Button>Clear</Button></Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header class="text-xl font-extrabold">Are You Sure?</Dialog.Header>
					<div class="flex justify-end gap-4">
						<Button variant="destructive" onclick={clear}>Yes</Button>
						<Dialog.Close>Cancel</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
</div>
