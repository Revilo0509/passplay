<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index';
	import { TextAlignJustify } from 'lucide-svelte';
	import { buttonVariants } from './ui/button';
	import { resolve } from '$app/paths';

	const links = [
		{
			name: 'Games',
			to: '/games'
		},
		{
			name: 'Settings',
			to: '/settings'
		}
	] as const;

	let open = $state(false);
	function closeDrawer() {
		open = !open;
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger>
		<TextAlignJustify class="m-2 h-auto w-8" />
	</Drawer.Trigger>

	<Drawer.Content>
		<div class="flex flex-col p-4">
			{#each links as link (link.name)}
				<a
					href={resolve(link.to)}
					aria-label="settings link"
					onclick={closeDrawer}
					class="m-1 text-xl text-foreground underline decoration-transparent transition hover:decoration-primary"
				>
					{link.name}
				</a>
			{/each}
		</div>

		<Drawer.Footer>
			<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Close</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
