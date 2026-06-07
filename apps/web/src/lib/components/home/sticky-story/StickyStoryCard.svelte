<script lang="ts">
	import StickyStoryVisual from './StickyStoryVisual.svelte';
	import type { StickyStoryCardProps } from './sticky-story.types';
	import { getStoryCardClass } from './sticky-story.utils';

	let { item, index }: StickyStoryCardProps = $props();
</script>

<a href={item.href} class={getStoryCardClass(index)}>
	<div class="flex items-start justify-between gap-4">
		<div
			class="shadow-3d-sm grid size-11 place-items-center rounded-full border-2 bg-background text-sm font-bold"
		>
			{index + 1}
		</div>

		<p class="text-sm font-bold text-primary">
			{item.linkLabel ?? 'Pelajari detail'} →
		</p>
	</div>

	<div class="mt-6">
		<StickyStoryVisual type={item.visualType} />
	</div>

	<div class="mt-6">
		<h3 class="text-2xl font-bold tracking-tight">{item.title}</h3>
		<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
			{item.description}
		</p>
	</div>
</a>
