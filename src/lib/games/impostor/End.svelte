<script lang="ts">
	import type { ImpostorGame } from './impostor.svelte';

	interface props {
		game: ImpostorGame;
	}

	let { game }: props = $props();
</script>

<span>
	{game.impostors.map((p) => p.name).join(', ')}
</span>
