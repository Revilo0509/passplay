<script lang="ts">
	import type { Snippet } from 'svelte';
	import Input from './ui/input/input.svelte';
	import type { Props } from './ui/input/input.svelte';
	import { Minus, Plus } from 'lucide-svelte';
	import SnippetGuard from './SnippetGuard.svelte';
	import Button from './ui/button/button.svelte';

	type WrapperProps = Props & {
		children?: Snippet;
		min?: number;
		max?: number;
		value: number | undefined;
	};

	let { children, value = $bindable(), min = 0, max = 100, ...rest }: WrapperProps = $props();

	function dec() {
		if (value !== undefined && value > min) {
			value--;
		}
	}

	function inc() {
		if (value !== undefined && value < max) {
			value++;
		}
	}
</script>

<div class="flex flex-row items-center">
	<Button variant="outline" onclick={dec}><Minus /></Button>
	<Input type="number" class="m-4" {...rest} bind:value />
	<Button variant="outline" onclick={inc}><Plus /></Button>
</div>

<SnippetGuard snippet={children} />
