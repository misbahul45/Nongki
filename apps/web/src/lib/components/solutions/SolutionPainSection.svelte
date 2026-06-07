<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { SolutionPageData } from '$lib/constants/solutions';

	let { solution }: { solution: SolutionPageData } = $props();
</script>

<section class="bg-muted/40 py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="max-w-3xl space-y-4">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					{solution.pains.title}
				</h2>
				<p class="text-lg text-muted-foreground">{solution.pains.description}</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each solution.pains.items as item, index (item.title)}
				<Reveal delay={index * 0.04}>
					<div
						class="shadow-3d-sm hover:shadow-3d-lg h-full rounded-3xl border-2 bg-background p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<p class="text-sm font-black text-primary">{String(index + 1).padStart(2, '0')}</p>
						<h3 class="mt-4 font-heading text-xl font-bold">{item.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
