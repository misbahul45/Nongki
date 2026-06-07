<script lang="ts">
	import StickyVerticalStory from '$lib/components/home/sticky-story/StickyVerticalStory.svelte';
	import type { StickyVerticalStoryProps } from '$lib/components/home/sticky-story/sticky-story.types';

	let { eyebrow, title, description, cta, points, items }: StickyVerticalStoryProps = $props();
</script>

<StickyVerticalStory {eyebrow} {title} {description} {cta} {points} {items} />
