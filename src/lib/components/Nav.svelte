<script lang="ts">
	import { Gamepad2, PartyPopper, Settings } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';

	const links = [
		{
			name: m['nav.games'](),
			to: '/games',
			icon: Gamepad2
		},
		{
			name: m['nav.party'](),
			to: '/party',
			icon: PartyPopper
		},
		{
			name: m['nav.settings'](),
			to: '/settings',
			icon: Settings
		}
	] as const;
</script>

<div class="w-full outline">
	<ul class="flex justify-evenly">
		{#each links as link (link.name)}
			<li><a href={resolve(link.to)}><link.icon class="m-4 h-8 w-auto" /></a></li>
		{/each}
	</ul>
</div>
