<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import App from '$lib/components/App.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import OptionsDrawer from '$lib/components/OptionsDrawer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<App>
	{#snippet header()}
		<Nav>
			{#snippet right()}
				<OptionsDrawer />
			{/snippet}
		</Nav>
	{/snippet}

	{@render children()}
</App>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
