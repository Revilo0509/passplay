<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	const { children, ...rest }: props = $props();
</script>

<div class={cn('flex flex-1 flex-col items-center justify-center', rest.class)} {...rest}>
	{@render children()}
</div>
