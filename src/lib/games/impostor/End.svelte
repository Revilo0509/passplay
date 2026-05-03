<script lang="ts">
	import { gameData, reset, type ImpostorGameData } from '$lib/state/game.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Center from '$lib/components/Center.svelte';

	const data = $derived(gameData.current as ImpostorGameData);
	const impostors = $derived(data.impostors.map((p) => p.name));

	const charDelay = 300;
</script>

<Center>
	<span class="text-2xl font-extrabold text-red-500">
		{#if impostors.length > 1}
			The impostors were
		{:else}
			The impostor was
		{/if}
	</span>

	<div class="m-8 space-y-4">
		{#each impostors as impostor (impostor)}
			<div class="text-4xl font-extrabold text-red-500">
				{#each impostor.split('') as char, i (i)}
					<span
						class="char-reveal inline-block opacity-0"
						style="animation-delay: {i * charDelay}ms"
					>
						{char}
					</span>
				{/each}
			</div>
		{/each}
	</div>

	<Button onclick={reset}>Play Again</Button>
</Center>

<style>
	.char-reveal {
		animation: fadeIn 0.2s ease-in forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
