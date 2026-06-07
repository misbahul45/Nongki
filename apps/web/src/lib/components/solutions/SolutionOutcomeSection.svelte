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
					{solution.outcomes.title}
				</h2>
				<p class="text-lg text-muted-foreground">{solution.outcomes.description}</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-3">
			{#each solution.outcomes.items as item, index (item.value)}
				<Reveal delay={index * 0.05}>
					<div
						class={`h-full rounded-3xl border-2 p-5 ${
							index === 0
								? 'shadow-3d-primary border-primary bg-primary/5'
								: 'shadow-3d-sm bg-background'
						}`}
					>
						<p class="font-heading text-3xl font-bold text-primary">{item.value}</p>
						<h3 class="mt-4 font-heading text-xl font-bold">{item.label}</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
