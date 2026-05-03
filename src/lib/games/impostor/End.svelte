<script lang="ts">
	import type { Player } from '$lib/state/party.svelte';
	import { gameData, reset } from '$lib/state/game.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const data = $derived(gameData.current as { type: "impostor"; impostors: Player[] });
</script>

<div class="flex flex-col gap-4 p-4">
	<span>
		{data.impostors.map((p) => p.name).join(', ')}
	</span>

	<Button onclick={reset}>Play Again</Button>
</div>