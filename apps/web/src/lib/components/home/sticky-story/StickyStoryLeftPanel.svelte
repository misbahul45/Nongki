<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import SectionTitle from '$lib/components/home/SectionTitle.svelte';
	import type { StickyStoryCta } from './sticky-story.types';

	let {
		eyebrow,
		title,
		description,
		cta,
		points = []
	}: {
		eyebrow?: string;
		title: string;
		description: string;
		cta?: StickyStoryCta;
		points?: readonly string[];
	} = $props();
</script>

<div class="max-w-xl">
	<SectionTitle {eyebrow} {title} {description} />

	{#if points.length}
		<div class="mt-6 grid gap-2">
			{#each points as point (point)}
				<div class="shadow-3d-sm rounded-2xl border-2 bg-background px-4 py-3 text-sm font-bold">
					{point}
				</div>
			{/each}
		</div>
	{/if}

	{#if cta}
		<Button href={cta.href} class="mt-6">{cta.label}</Button>
	{/if}
</div>
