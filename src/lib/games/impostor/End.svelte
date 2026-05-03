<script lang="ts">
	import type { Player } from '$lib/state/party.svelte';
	import { gameData, reset } from '$lib/state/game.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Center from '$lib/components/Center.svelte';
	import * as m from '$lib/paraglide/messages';

	const data = $derived(gameData.current as { type: 'impostor'; impostors: Player[] });
	const impostors = $derived(data.impostors.map((p) => p.name));

	const charDelay = 300;
	const impostorLabel = $derived(
		impostors.length > 1 ? m['impostor.end.impostors']() : m['impostor.end.impostor']()
	);
</script>

<Center>
	<span class="text-2xl font-extrabold text-red-500">
		{impostorLabel}
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

	<Button onclick={reset}>{m['impostor.end.playAgain']()}</Button>
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
