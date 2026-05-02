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

<div class="flex min-h-dvh w-full flex-col">
	<SnippetGuard snippet={header} class="shrink-0" />

	<div class="relative flex w-full flex-1 overflow-y-auto">
		<SnippetGuard snippet={children} />
	</div>

	<SnippetGuard snippet={footer} class="shrink-0" />
</div>
