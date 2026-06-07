<script lang="ts">
	import { featurePages, type FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();

	const relatedFeatures = $derived(
		feature.related.map((slug) => featurePages[slug]).filter(Boolean)
	);
</script>

{#if relatedFeatures.length}
	<section class="bg-primary/5 px-4 py-16 md:py-24">
		<div class="mx-auto max-w-7xl">
			<Reveal>
				<div class="max-w-3xl">
					<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Fitur Terkait</p>
					<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
						Lanjutkan ke fitur yang sering dipakai bersama.
					</h2>
				</div>
			</Reveal>

			<div class="mt-10 grid gap-5 md:grid-cols-3">
				{#each relatedFeatures as related, index (related.slug)}
					{@const Icon = related.icon}
					<Reveal delay={index * 0.05}>
						<a
							href={`/features/${related.slug}`}
							class="shadow-3d-sm hover:shadow-3d-lg block h-full rounded-3xl border-2 bg-background p-5 transition-all duration-300 hover:-translate-y-1"
						>
							<div
								class="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
							>
								<Icon class="size-5" />
							</div>
							<h3 class="mt-5 font-heading text-xl font-black">{related.eyebrow}</h3>
							<p class="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">
								{related.description}
							</p>
						</a>
					</Reveal>
				{/each}
			</div>
		</div>
	</section>
{/if}
