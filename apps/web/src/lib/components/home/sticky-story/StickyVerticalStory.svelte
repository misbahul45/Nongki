<script lang="ts">
	import { onMount } from 'svelte';
	import StickyStoryCard from './StickyStoryCard.svelte';
	import StickyStoryLeftPanel from './StickyStoryLeftPanel.svelte';
	import type { StickyVerticalStoryProps } from './sticky-story.types';
	import { isAtBottom, isAtTop } from './sticky-story.utils';

	let sectionEl = $state<HTMLElement>();
	let scrollPanelEl = $state<HTMLDivElement>();
	let isSectionReady = $state(false);
	let progress = $state(0);
	let activeIndex = $state(0);

	let { eyebrow, title, description, cta, points = [], items }: StickyVerticalStoryProps = $props();

	function updateProgress(panel: HTMLDivElement) {
		const maxScroll = panel.scrollHeight - panel.clientHeight;

		if (maxScroll <= 0) {
			progress = 1;
			activeIndex = 0;
			return;
		}

		progress = Math.min(1, Math.max(0, panel.scrollTop / maxScroll));
		activeIndex = Math.min(items.length - 1, Math.round(progress * (items.length - 1)));
	}

	onMount(() => {
		const section = sectionEl;
		const panel = scrollPanelEl;

		if (!section) return;

		const mediaQuery = window.matchMedia('(min-width: 1024px)');

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!mediaQuery.matches) {
					isSectionReady = false;
					return;
				}

				isSectionReady = entry.intersectionRatio >= 0.9;
			},
			{
				threshold: [0, 0.5, 0.75, 0.85, 0.9, 0.95, 1]
			}
		);

		observer.observe(section);

		function handleWheel(event: WheelEvent) {
			const currentPanel = scrollPanelEl;

			if (!currentPanel || !mediaQuery.matches || !isSectionReady) return;

			const delta = event.deltaY;
			const scrollingDown = delta > 0;
			const scrollingUp = delta < 0;
			const atTop = isAtTop(currentPanel);
			const atBottom = isAtBottom(currentPanel);
			const shouldLockPage = (scrollingDown && !atBottom) || (scrollingUp && !atTop);

			if (shouldLockPage) {
				event.preventDefault();
				currentPanel.scrollTop += delta;
				updateProgress(currentPanel);
			}
		}

		function handleScroll() {
			const currentPanel = scrollPanelEl;
			if (!currentPanel) return;
			updateProgress(currentPanel);
		}

		section.addEventListener('wheel', handleWheel, { passive: false });
		panel?.addEventListener('scroll', handleScroll, { passive: true });

		if (panel) updateProgress(panel);

		return () => {
			observer.disconnect();
			section.removeEventListener('wheel', handleWheel);
			panel?.removeEventListener('scroll', handleScroll);
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

	<div class="mx-auto hidden h-full max-w-7xl grid-cols-[0.88fr_1.12fr] gap-12 px-4 lg:grid">
		<aside class="flex h-full flex-col justify-center">
			<StickyStoryLeftPanel {eyebrow} {title} {description} {cta} {points} />
		</aside>

		<div class="relative h-full overflow-hidden py-8">
			<div class="pointer-events-none absolute top-8 right-0 bottom-8 z-20 w-1 rounded-full bg-background/70">
				<div
					class="w-full rounded-full bg-primary transition-all duration-200"
					style={`height: ${Math.max(8, progress * 100)}%`}
				></div>
			</div>

			<div class="pointer-events-none absolute top-8 right-5 z-20 flex flex-col gap-2">
				{#each items as item, index (item.href)}
					<div
						class={`size-2 rounded-full border transition-all duration-200 ${
							activeIndex === index
								? 'shadow-border-primary bg-primary'
								: 'border-border bg-background'
						}`}
					></div>
				{/each}
			</div>

			<div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-primary/5"></div>
			<div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-primary/5"></div>

			<div
				bind:this={scrollPanelEl}
				class="scrollbar-none h-full overflow-y-auto overscroll-contain pr-4"
			>
				<div class="space-y-6 pb-8">
					{#each items as item, index (item.href)}
						<div class={activeIndex === index ? 'opacity-100' : 'opacity-90'}>
							<StickyStoryCard {item} {index} />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>