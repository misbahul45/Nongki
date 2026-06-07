<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import FeatureMockup from './FeatureMockup.svelte';

	let { feature }: { feature: FeaturePageData } = $props();

	const labels = ['Input', 'Decision', 'Output'];
	const highlights = $derived(feature.capabilities.slice(0, 3));
</script>

<section class="bg-primary/5 px-4 py-16 md:py-24">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
		<Reveal>
			<div class="shadow-3d-lg rounded-[2rem] border-2 bg-muted/40 p-4">
				<FeatureMockup type={feature.mockupType} />
			</div>
		</Reveal>

		<Reveal delay={0.1}>
			<div>
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Preview</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					Fitur kecil, tapi terasa di workflow harian.
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Panel ini menggambarkan bagaimana {feature.eyebrow} menerima konteks, mengambil keputusan aman,
					lalu menghasilkan action yang bisa dilanjutkan admin atau owner.
				</p>

				<div class="mt-8 grid gap-4">
					{#each highlights as item, index (item.title)}
						<article class="shadow-3d-sm rounded-3xl border-2 bg-background p-5">
							<p class="text-xs font-black tracking-[0.16em] text-primary uppercase">
								{labels[index] ?? 'Step'}
							</p>
							<h3 class="mt-2 font-heading text-xl font-black">{item.title}</h3>
							<p class="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
						</article>
					{/each}
				</div>
			</div>
		</Reveal>
	</div>
</section>
