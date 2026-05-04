<script lang="ts">
	import { mode, setMode } from 'mode-watcher';
	import * as Select from '$lib/components/ui/select';
	import { MoveUpRight } from 'lucide-svelte';

	let currentMode = $derived(mode.current ?? 'light');
	let value = $derived(currentMode);
</script>

<div class="flex w-dvw flex-col justify-between p-4">
	<div class="flex items-center gap-4">
		<span class="text-lg">Theme:</span>
		<Select.Root
			type="single"
			bind:value
			onValueChange={(v) => v && setMode(v as 'light' | 'dark')}
		>
			<Select.Trigger class="w-45">
				{value === 'dark' ? 'Dark' : 'Light'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="light">Light</Select.Item>
				<Select.Item value="dark">Dark</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
	<div class="flex justify-between text-sm opacity-75">
		<div>
			Copyright © <a href="https://revilo0509.net" class="underline">Revilo0509</a>
			{new Date().getFullYear()}
		</div>
		<div class="flex items-center text-right">
			<a href="https://github.com/Revilo0509/passplay" class="underline">Source Code</a>
			<MoveUpRight class="ml-1 h-4 w-auto" />
		</div>
	</div>
</div>
