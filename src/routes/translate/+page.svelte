<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';

	let { data } = $props();

	async function logout() {
		await fetch('/translate/logout', { method: 'POST' });
		window.location.href = '/translate/login';
	}

	function getProgressPercent(translated: number, total: number): number {
		if (total === 0) return 0;
		return Math.round((translated / total) * 100);
	}
</script>

<div class="p-6 max-w-4xl mx-auto">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Translator Dashboard</h1>
		<Button onclick={logout} variant="destructive">Logout</Button>
	</div>

	<div class="flex gap-4 mb-8">
		<a href="/translate/create-main">
			<Button>Create Main Pack (English)</Button>
		</a>
		<a href="/translate/create-child">
			<Button variant="outline">Create Child Pack</Button>
		</a>
	</div>

	{#if data.mainPacks.length === 0}
		<Card>
			<CardContent class="py-8 text-center">
				<p class="text-muted-foreground mb-4">No wordpacks yet. Create a main pack to get started.</p>
				<a href="/translate/create-main">
					<Button>Create Main Pack</Button>
				</a>
			</CardContent>
		</Card>
	{:else}
		<div class="space-y-6">
			{#each data.mainPacks as mainPack (mainPack.id)}
				<div class="border rounded-lg p-4">
					<div class="flex items-center justify-between mb-4">
						<a href="/translate/{mainPack.id}" class="hover:underline">
							<h2 class="text-xl font-semibold">{mainPack.name}</h2>
						</a>
						<span class="text-muted-foreground">{mainPack.wordCount || 0} words</span>
					</div>

					{#if mainPack.description}
						<p class="text-sm text-muted-foreground mb-4">{mainPack.description}</p>
					{/if}

					<div class="flex gap-2 mb-4">
						<form
							method="POST"
							action="?/addWord"
							use:enhance={({ formData }) => {
								formData.append('wordpackId', mainPack.id);
								return async ({ update }) => {
									await update();
								};
							}}
							class="flex gap-2 flex-1"
						>
							<Input name="word" placeholder="Add word..." required class="flex-1" />
							<Input name="hint" placeholder="Hint" required class="w-32" />
							<Button type="submit" size="sm">Add</Button>
						</form>
					</div>

					{#if mainPack.children && mainPack.children.length > 0}
						<div class="mt-4 pl-4 border-l-2 space-y-3">
							<h3 class="text-sm font-medium text-muted-foreground">Translations</h3>
							{#each mainPack.children as child (child.id)}
								{@const percent = getProgressPercent(child.wordCount || 0, child.mainWordCount || 0)}
								<a href="/translate/{child.id}" class="block">
									<div class="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80">
										<div>
											<span class="font-medium capitalize">{child.language}</span>
											<span class="text-muted-foreground"> - {child.name}</span>
										</div>
										<div class="flex items-center gap-2">
											<div class="w-24 h-2 bg-background rounded-full overflow-hidden">
												<div class="h-full bg-primary" style="width: {percent}%"></div>
											</div>
											<span class="text-sm text-muted-foreground w-20 text-right">
												{child.wordCount || 0}/{child.mainWordCount || 0} ({percent}%)
											</span>
										</div>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>