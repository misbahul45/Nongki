<script lang="ts">
	import { onMount } from 'svelte';
	import StickyStoryCard from './StickyStoryCard.svelte';
	import StickyStoryLeftPanel from './StickyStoryLeftPanel.svelte';
	import type { StickyVerticalStoryProps } from './sticky-story.types';
	import { isAtBottom, isAtTop } from './sticky-story.utils';

	let sectionEl = $state<HTMLElement>();
	let scrollPanelEl = $state<HTMLDivElement>();
	let isSectionReady = $state(false);

	let { eyebrow, title, description, cta, points = [], items }: StickyVerticalStoryProps = $props();

	onMount(() => {
		const section = sectionEl;

		if (!section) return;

		const mediaQuery = window.matchMedia('(min-width: 1024px)');

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!mediaQuery.matches) {
					isSectionReady = false;
					return;
				}

				// Scroll lock baru aktif ketika section hampir 1 layar penuh terlihat.
				isSectionReady = entry.intersectionRatio >= 0.92;
			},
			{
				threshold: [0, 0.5, 0.75, 0.9, 0.92, 1]
			}
		);

		observer.observe(section);

		const handleWheel = (event: WheelEvent) => {
			const panel = scrollPanelEl;

			if (!panel || !mediaQuery.matches || !isSectionReady) return;

			const delta = event.deltaY;
			const scrollingDown = delta > 0;
			const scrollingUp = delta < 0;

			const atTop = isAtTop(panel);
			const atBottom = isAtBottom(panel);

			const shouldLockPage =
				(scrollingDown && !atBottom) ||
				(scrollingUp && !atTop);

			if (shouldLockPage) {
				event.preventDefault();
				panel.scrollTop += delta;
			}
		};

		section.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			observer.disconnect();
			section.removeEventListener('wheel', handleWheel);
		};
	});
</script>

<section
	bind:this={sectionEl}
	id="cara-kerja"
	class="relative overflow-hidden bg-primary/5 py-20 lg:h-[calc(100svh-5.5rem)] lg:min-h-[640px] lg:py-0"
>
	<div class="mx-auto w-full max-w-7xl px-4 lg:hidden">
		<StickyStoryLeftPanel {eyebrow} {title} {description} {cta} {points} />

		<div class="mt-8 grid gap-5">
			{#each items as item, index (item.href)}
				<StickyStoryCard {item} {index} />
			{/each}
		</div>
	</div>

	<div class="mx-auto hidden h-full max-w-7xl grid-cols-[0.9fr_1.1fr] gap-10 px-4 lg:grid">
		<aside class="flex h-full flex-col justify-center">
			<StickyStoryLeftPanel {eyebrow} {title} {description} {cta} {points} />
		</aside>

		<div class="h-full overflow-hidden py-8">
			<div
				bind:this={scrollPanelEl}
				class="scrollbar-none h-full overflow-y-auto overscroll-contain pr-3"
			>
				<div class="space-y-6 pb-8">
					{#each items as item, index (item.href)}
						<StickyStoryCard {item} {index} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>