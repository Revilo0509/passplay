<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	let { data, form } = $props();

	let currentIndex = $state(0);
	let translation = $state('');
	
	function getProgressPercent(): number {
		if (data.totalCount === 0) return 0;
		return Math.round((data.translatedCount / data.totalCount) * 100);
	}

	function handleNext() {
		if (currentIndex < data.words.length - 1) {
			currentIndex++;
			translation = '';
		}
	}

	function handleSkip() {
		if (currentIndex < data.words.length - 1) {
			currentIndex++;
		}
	}
</script>

<div class="p-4 max-w-2xl mx-auto">
	<div class="mb-6 flex items-center justify-between">
		<a href="/translate" class="text-muted-foreground hover:text-foreground">
			← Back to Dashboard
		</a>
		<a href="/translate/logout" class="text-sm text-muted-foreground hover:text-foreground">
			Logout
		</a>
	</div>

	{#if data.isMainPack}
		<h1 class="text-2xl font-bold mb-4">Main Pack - Add Words</h1>
		<p class="text-muted-foreground">This is a main English pack. Use the dashboard to add words.</p>
	{:else if data.words.length === 0}
		<Card>
			<CardHeader>
				<CardTitle>All Done!</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-muted-foreground">
					You've translated all {data.totalCount} words. Great job!
				</p>
				<a href="/translate">
					<Button class="mt-4">Back to Dashboard</Button>
				</a>
			</CardContent>
		</Card>
	{:else}
		{@const currentWord = data.words[currentIndex]}
		
		<div class="mb-4">
			<div class="flex justify-between text-sm text-muted-foreground mb-2">
				<span>Progress</span>
				<span>{data.translatedCount + currentIndex + 1} of {data.totalCount} ({getProgressPercent()}%)</span>
			</div>
			<div class="h-2 bg-muted rounded-full overflow-hidden">
				<div 
					class="h-full bg-primary transition-all"
					style="width: {getProgressPercent()}%"
				></div>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle class="text-3xl font-bold text-center">{currentWord.word}</CardTitle>
				<p class="text-center text-muted-foreground">{currentWord.hint}</p>
			</CardHeader>
			<CardContent>
				<form
					method="POST"
					action="?/saveTranslation"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							handleNext();
						};
					}}
				>
					<input type="hidden" name="wordId" value={currentWord.id} />
					<div class="grid gap-4">
						<div class="grid gap-2">
							<Label for="value">Translation ({data.childLanguage})</Label>
							<Input 
								id="value" 
								name="value" 
								bind:value={translation}
								placeholder="Type translation..."
								autofocus
								required
							/>
						</div>
						<div class="flex gap-2">
							<Button type="submit" class="flex-1">Next</Button>
							<Button type="button" variant="outline" onclick={handleSkip} class="flex-1">Skip</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	{/if}
</div>