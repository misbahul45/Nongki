<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { productPages, type ProductPageData } from '$lib/constants/product';

	let { product }: { product: ProductPageData } = $props();

	const relatedProducts = $derived(product.related.slice(0, 3).map((slug) => productPages[slug]));
</script>

<section class="bg-primary/5 py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
				Lanjutkan ke modul terkait.
			</h2>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-3">
			{#each relatedProducts as related, index (related.slug)}
				{@const Icon = related.icon}
				<Reveal delay={index * 0.04}>
					<a
						href={`/product/${related.slug}`}
						class="shadow-3d-sm hover:shadow-3d-lg block h-full rounded-3xl border-2 bg-background p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<div
							class="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
						>
							<Icon class="size-5" />
						</div>
						<h3 class="mt-5 font-heading text-xl font-bold">{related.eyebrow}</h3>
						<p class="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
							{related.description}
						</p>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
