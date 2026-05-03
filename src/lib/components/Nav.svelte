<script lang="ts">
	import { Gamepad2, PartyPopper, Settings } from 'lucide-svelte';
	import { resolve } from '$app/paths';

	const links = [
		{
			name: 'Games',
			to: '/games',
			icon: Gamepad2
		},
		{
			name: 'Party',
			to: '/party',
			icon: PartyPopper
		},
		{
			name: 'Settings',
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
