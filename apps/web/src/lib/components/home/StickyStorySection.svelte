<script lang="ts">
	import { stickyStorySection } from '$lib/constants/home/landingPage';
	import StickyVerticalStory from '$lib/components/home/sticky-story/StickyVerticalStory.svelte';
</script>

<StickyVerticalStory
	eyebrow={stickyStorySection.eyebrow}
	title={stickyStorySection.title}
	description={stickyStorySection.description}
	cta={stickyStorySection.cta}
	points={stickyStorySection.points}
	items={stickyStorySection.items}
/>
