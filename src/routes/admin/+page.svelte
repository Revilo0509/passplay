<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

	let { data } = $props();

	async function logout() {
		await fetch('/admin/logout', { method: 'POST' });
		window.location.href = '/admin/login';
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold">Admin Dashboard</h1>
	<p class="text-muted-foreground">Welcome, {data.user?.role}</p>

	<Button onclick={logout} variant="destructive" class="mt-4">Logout</Button>

	<div class="mt-8">
		<h2 class="mb-4 text-xl font-semibold">Login History</h2>
		{#if data.logins.length > 0}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Timestamp</TableHead>
						<TableHead>IP</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.logins as login (login.timestamp)}
						<TableRow>
							<TableCell>{formatDate(login.timestamp)}</TableCell>
							<TableCell>{login.ip}</TableCell>
							<TableCell class="capitalize">{login.type}</TableCell>
							<TableCell>
								<span class={login.success ? 'text-green-600' : 'text-red-600'}>
									{login.success ? 'Success' : 'Failed'}
								</span>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		{:else}
			<p class="text-muted-foreground">No login history</p>
		{/if}
	</div>
</div>
