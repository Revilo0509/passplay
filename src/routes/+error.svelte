<script lang="ts">
	import { page } from '$app/state';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import Center from '$lib/components/Center.svelte';
</script>

<Center>
	<h1 class="m-4 text-2xl font-extrabold">{page.status}: {page.error?.message}</h1>
	<a class={buttonVariants({ variant: 'outline' })} href={resolve('/')}>Go Home</a>
</Center>
