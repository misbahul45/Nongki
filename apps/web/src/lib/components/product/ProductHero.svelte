<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { ProductPageData } from '$lib/constants/product';
	import ProductMockup from './ProductMockup.svelte';

	let { product }: { product: ProductPageData } = $props();

	const proofPills = ['WhatsApp-ready', 'Data-driven', 'Owner-friendly'];
</script>

<section class="bg-background py-16 md:py-28">
	<div
		class="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
	>
		<Reveal>
			<div class="space-y-7">
				<div class="space-y-4">
					<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">
						{product.eyebrow}
					</p>
					<h1
						class="max-w-4xl font-heading text-4xl leading-tight font-bold text-balance md:text-6xl"
					>
						{product.title}
					</h1>
					<p class="max-w-2xl text-lg leading-relaxed text-muted-foreground">
						{product.description}
					</p>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row">
					<a
						href={product.primaryCta.href}
						class="shadow-3d-primary inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-primary px-6 font-bold text-primary-foreground transition-all active:translate-y-1 sm:w-auto"
					>
						{product.primaryCta.label}
					</a>
					<a
						href={product.secondaryCta.href}
						class="shadow-3d inline-flex h-12 items-center justify-center rounded-xl border-2 bg-background px-6 font-bold transition-all active:translate-y-1 sm:w-auto"
					>
						{product.secondaryCta.label}
					</a>
				</div>

				<div class="flex flex-wrap gap-3">
					{#each proofPills as pill (pill)}
						<span class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 px-4 py-2 text-sm font-bold">
							{pill}
						</span>
					{/each}
				</div>
			</div>
		</Reveal>

		<Reveal delay={0.08}>
			<div class="shadow-3d-lg rounded-[2rem] border-2 bg-muted/40 p-4">
				<ProductMockup type={product.preview.type} />
			</div>
		</Reveal>
	</div>
</section>
