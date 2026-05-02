<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="p-4">
	{#if data.wordpack}
		<h1 class="text-2xl font-bold">{data.wordpack.name}</h1>
		<p class="text-muted-foreground">
			{data.wordpack.language} / {data.wordpack.category}
		</p>

		{#if data.wordpack.description}
			<p class="mt-2">{data.wordpack.description}</p>
		{/if}

		<div class="mt-4">
			<h2 class="text-xl font-semibold">Words ({data.wordpack.words.length})</h2>

			{#if data.wordpack.words.length === 0}
				<p class="text-muted-foreground">No words in this category.</p>
			{:else}
				<ul class="mt-2 space-y-2">
					{#each data.wordpack.words as word (word.id)}
						<li class="rounded border p-3">
							<div class="font-medium">{word.word}</div>
							{#if word.hint}
								<div class="text-sm text-muted-foreground">Hint: {word.hint}</div>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else}
		<h1 class="text-2xl font-bold">Wordpack Not Found</h1>
		<p class="text-muted-foreground">
			No wordpack found for language "{$page.params.language}" and category
			"{$page.params.category}".
		</p>
	{/if}
</div>