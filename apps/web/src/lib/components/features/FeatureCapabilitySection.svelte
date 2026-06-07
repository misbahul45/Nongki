<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="max-w-3xl">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Kemampuan</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					Yang bisa dilakukan fitur ini.
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Kemampuan utama yang membuat fitur ini berguna di percakapan WhatsApp bisnis.
				</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each feature.capabilities as capability, index (capability.title)}
				{@const Icon = capability.icon}
				<Reveal delay={index * 0.04}>
					<article
						class="shadow-3d-sm hover:shadow-3d-lg h-full rounded-3xl border-2 bg-background p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<div
							class="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
						>
							<Icon class="size-5" />
						</div>
						<h3 class="mt-5 font-heading text-xl font-black">{capability.title}</h3>
						<p class="mt-3 leading-relaxed text-muted-foreground">{capability.description}</p>
					</article>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
