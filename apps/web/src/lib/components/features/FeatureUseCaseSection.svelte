<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<section class="bg-muted/40 px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Use Case</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">Kapan fitur ini dipakai?</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Contoh momen operasional saat {feature.eyebrow} membantu owner atau admin mengambil action yang
					lebih jelas.
				</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-3">
			{#each feature.useCases as useCase, index (useCase.title)}
				<Reveal delay={index * 0.06}>
					<article class="shadow-3d-sm h-full rounded-3xl border-2 bg-background p-5">
						<div class="text-sm font-black text-primary">
							{String(index + 1).padStart(2, '0')}
						</div>
						<h3 class="mt-4 font-heading text-xl font-black">{useCase.title}</h3>
						<p class="mt-3 leading-relaxed text-muted-foreground">{useCase.description}</p>
					</article>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
