<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	let { form, data } = $props();
</script>

<div class="absolute inset-0 flex items-center justify-center p-4">
	<Card class="w-full max-w-sm">
		<CardHeader>
			<CardTitle>Admin Login</CardTitle>
			<CardDescription>Enter your admin password</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="password">Password</Label>
						<Input
							id="password"
							type="password"
							name="password"
							placeholder="Enter password"
							value={form?.password ?? ''}
							required
						/>
						{#if form?.errors?.password}
							<p class="text-sm text-destructive">{form.errors.password[0]}</p>
						{/if}
						{#if data?.attemptsLeft !== undefined && data.attemptsLeft < 5}
							<p class="text-sm text-muted-foreground">{data.attemptsLeft} attempts remaining</p>
						{/if}
					</div>
					<Button type="submit">Login</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
