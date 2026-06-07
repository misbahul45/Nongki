<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Cara Kerja</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					{feature.howItWorks.title}
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					{feature.howItWorks.description}
				</p>
			</div>
		</Reveal>

		<Reveal delay={0.1} class="mt-10">
			<div
				class="shadow-3d-lg relative overflow-hidden rounded-3xl border-2 bg-background p-5 md:p-7"
			>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-60"
				></div>

				<div class="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
					{#each feature.howItWorks.steps as step, index (step.title)}
						<article class="shadow-3d-sm rounded-3xl border-2 bg-background p-5">
							<div
								class="grid size-12 place-items-center rounded-2xl border-2 border-primary bg-primary text-sm font-black text-primary-foreground"
							>
								{String(index + 1).padStart(2, '0')}
							</div>
							<h3 class="mt-4 font-heading text-xl font-black">{step.title}</h3>
							<p class="mt-3 leading-relaxed text-muted-foreground">{step.description}</p>
						</article>
					{/each}
				</div>
			</div>
		</Reveal>
	</div>
</section>
