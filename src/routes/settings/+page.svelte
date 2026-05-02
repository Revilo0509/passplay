<script lang="ts">
	import { mode, setMode } from 'mode-watcher';
	import * as Select from '$lib/components/ui/select';

	let currentMode = $derived(mode.current ?? 'light');
	let value = $derived(currentMode);
</script>

<div class="p-4">
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
</div>
