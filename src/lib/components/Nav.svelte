<script lang="ts">
	import { Gamepad2, PartyPopper, Settings } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

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
			<li
				class={cn(
					page.route.id == link.to ? 'bg-accent' : '',
					'm-2 rounded-[50%] transition duration-300'
				)}
			>
				<a href={resolve(link.to)}><link.icon class="m-4 h-8 w-auto" /></a>
			</li>
		{/each}
	</ul>
</div>
