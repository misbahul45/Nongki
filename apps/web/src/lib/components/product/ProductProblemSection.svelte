<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { ProductPageData } from '$lib/constants/product';

	let { product }: { product: ProductPageData } = $props();
</script>

<section class="bg-muted/40 py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="max-w-3xl space-y-4">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">
					Masalah yang dibereskan
				</p>
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					{product.problem.title}
				</h2>
				<p class="text-lg text-muted-foreground">{product.problem.description}</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#each product.problem.items as item, index (item)}
				<Reveal delay={index * 0.04}>
					<div class="shadow-3d-sm h-full rounded-3xl border-2 bg-background p-5">
						<p class="text-sm font-black text-primary">0{index + 1}</p>
						<p class="mt-4 text-base font-bold">{item}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
