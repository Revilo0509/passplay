<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<div class="p-6 max-w-md mx-auto">
	<a href="/translate" class="text-muted-foreground hover:text-foreground mb-4 block">
		← Back to Dashboard
	</a>

	<Card>
		<CardHeader>
			<CardTitle>Create Main Wordpack</CardTitle>
			<p class="text-sm text-muted-foreground">Create an English wordpack with words to translate.</p>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance class="space-y-4">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" placeholder="e.g., Common Words" required />
				</div>
				<div class="grid gap-2">
					<Label for="description">Description (optional)</Label>
					<Input id="description" name="description" placeholder="e.g., Everyday vocabulary" />
				</div>
				<Button type="submit" class="w-full">Create</Button>
			</form>
		</CardContent>
	</Card>
</div>