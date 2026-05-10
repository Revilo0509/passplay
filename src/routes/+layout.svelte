<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import App from '$lib/components/App.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/Nav.svelte';
	import { initCache } from '$lib/services/wordCache';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initCache().catch(console.error);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<App>
	{#snippet footer()}
		<Nav />
	{/snippet}

	{@render children()}
</App>
