<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	let { data, form } = $props();
</script>

<div class="p-6 max-w-md mx-auto">
	<a href="/translate" class="text-muted-foreground hover:text-foreground mb-4 block">
		← Back to Dashboard
	</a>

	<Card>
		<CardHeader>
			<CardTitle>Create Child Wordpack</CardTitle>
			<p class="text-sm text-muted-foreground">Create a translation pack for a specific language.</p>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance class="space-y-4">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" placeholder="e.g., Spanish Translation" required />
				</div>
				<div class="grid gap-2">
					<Label for="language">Language Code</Label>
					<Input id="language" name="language" placeholder="e.g., es, fr, de" required />
				</div>
				<div class="grid gap-2">
					<Label for="parentId">Main Pack</Label>
					<select 
						id="parentId" 
						name="parentId" 
						class="border-input rounded-md border bg-background px-3 py-2"
						required
					>
						<option value="">Select main pack...</option>
						{#each data.mainPacks as pack (pack.id)}
							<option value={pack.id}>{pack.name}</option>
						{/each}
					</select>
				</div>
				<div class="grid gap-2">
					<Label for="description">Description (optional)</Label>
					<Input id="description" name="description" placeholder="e.g., Spanish translations" />
				</div>
				{#if form?.error}
					<p class="text-sm text-destructive">{form.error}</p>
				{/if}
				<Button type="submit" class="w-full">Create</Button>
			</form>
		</CardContent>
	</Card>
</div>