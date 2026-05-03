<script lang="ts">
	import { mode, setMode } from 'mode-watcher';
	import * as Select from '$lib/components/ui/select';
	import * as m from '$lib/paraglide/messages';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';

	let currentMode = $derived(mode.current ?? 'light');
	let themeValue = $derived(currentMode);
	let languageValue = $derived(getLocale());

	function handleThemeChange(v: string) {
		if (v) setMode(v as 'light' | 'dark');
	}

	function handleLanguageChange(v: string) {
		if (v && (v === 'en' || v === 'sv')) {
			setLocale(v);
		}
	}

	onMount(() => {
		const stored = localStorage.getItem('PARAGLIDE_LOCALE');
		if (stored && (stored === 'en' || stored === 'sv')) {
			setLocale(stored);
		}
	});
</script>

<div class="space-y-6 p-4">
	<div class="flex items-center gap-4">
		<span class="text-lg">{m['settings.theme']()}</span>
		<Select.Root type="single" bind:value={themeValue} onValueChange={handleThemeChange}>
			<Select.Trigger class="w-45">
				{themeValue === 'dark' ? m['settings.theme.dark']() : m['settings.theme.light']()}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="light">{m['settings.theme.light']()}</Select.Item>
				<Select.Item value="dark">{m['settings.theme.dark']()}</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center gap-4">
		<span class="text-lg">{m['settings.language']()}</span>
		<Select.Root type="single" bind:value={languageValue} onValueChange={handleLanguageChange}>
			<Select.Trigger class="w-45">
				{languageValue === 'sv' ? m['settings.language.sv']() : m['settings.language.en']()}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="en">{m['settings.language.en']()}</Select.Item>
				<Select.Item value="sv">{m['settings.language.sv']()}</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>
