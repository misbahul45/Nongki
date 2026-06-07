<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { ProductPageData } from '$lib/constants/product';
	import ProductMockup from './ProductMockup.svelte';

	let { product }: { product: ProductPageData } = $props();

	const details = ['Realtime context', 'Readable status', 'Action-ready'];
</script>

<section class="bg-background py-16 md:py-28">
	<div
		class="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
	>
		<Reveal>
			<ProductMockup type={product.preview.type} />
		</Reveal>

		<Reveal delay={0.08}>
			<div class="space-y-6">
				<div class="space-y-4">
					<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Preview</p>
					<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
						{product.preview.title}
					</h2>
					<p class="text-lg text-muted-foreground">{product.preview.description}</p>
				</div>

				<div class="grid gap-3 sm:grid-cols-3">
					{#each details as detail (detail)}
						<div class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 px-4 py-3 text-sm font-bold">
							{detail}
						</div>
					{/each}
				</div>
			</div>
		</Reveal>
	</div>
</section>
