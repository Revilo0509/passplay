<script lang="ts">
	import SnippetGuard from './SnippetGuard.svelte';
	import type { Snippet } from 'svelte';

	interface props {
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	}

	const { header, children, footer }: props = $props();
</script>

<div class="flex min-h-dvh w-screen flex-col">
	<SnippetGuard snippet={header} class="shrink-0" />
	<SnippetGuard snippet={children} class="flex flex-1 overflow-auto" />
	<SnippetGuard snippet={footer} class="shrink-0" />
</div>
