<script lang="ts">
	import type { Snippet } from 'svelte';
	import SnippetGuard from './SnippetGuard.svelte';

	interface props {
		left?: Snippet;
		center?: Snippet;
		right?: Snippet;
	}

	const { left, center, right }: props = $props();
</script>

<div class="relative flex w-screen">
	<div class="flex flex-1 justify-start">
		<SnippetGuard snippet={left} />
	</div>
	<div class="flex flex-1 justify-center">
		<SnippetGuard snippet={center} />
	</div>
	<div class="flex flex-1 justify-end">
		<SnippetGuard snippet={right} />
	</div>
</div>
