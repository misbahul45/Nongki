<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { ProductPageData } from '$lib/constants/product';

	let { product }: { product: ProductPageData } = $props();
</script>

<section class="bg-muted/40 py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<h2 class="max-w-3xl font-heading text-3xl leading-tight font-bold md:text-5xl">
				Dampaknya untuk owner.
			</h2>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each product.benefits as benefit, index (benefit.title)}
				<Reveal delay={index * 0.04}>
					<div
						class={`h-full rounded-3xl border-2 p-5 ${
							index === 0
								? 'shadow-3d-primary border-primary bg-primary/5'
								: 'shadow-3d-sm bg-background'
						}`}
					>
						<h3 class="font-heading text-xl font-bold">{benefit.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
