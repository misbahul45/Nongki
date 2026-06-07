<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<section class="bg-muted/40 px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="max-w-3xl">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Masalah</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					{feature.problem.title}
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					{feature.problem.description}
				</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each feature.problem.items as item, index (item.title)}
				<Reveal delay={index * 0.05}>
					<article
						class="shadow-3d-sm hover:shadow-3d-lg h-full rounded-3xl border-2 bg-background p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<div
							class="grid size-11 place-items-center rounded-2xl border-2 border-primary bg-primary text-sm font-black text-primary-foreground"
						>
							{String(index + 1).padStart(2, '0')}
						</div>
						<h3 class="mt-5 font-heading text-xl font-black">{item.title}</h3>
						<p class="mt-3 leading-relaxed text-muted-foreground">{item.description}</p>
					</article>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
