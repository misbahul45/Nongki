<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { ProductPageData } from '$lib/constants/product';

	let { product }: { product: ProductPageData } = $props();
</script>

<section class="bg-background py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="max-w-3xl space-y-4">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					Yang bisa dilakukan modul ini.
				</h2>
				<p class="text-lg text-muted-foreground">
					Ringkasan kemampuan utama tanpa masuk terlalu teknis.
				</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each product.capabilities as capability, index (capability.title)}
				{@const Icon = capability.icon}
				<Reveal delay={index * 0.04}>
					<div
						class="shadow-3d-sm hover:shadow-3d-lg h-full rounded-3xl border-2 bg-card p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<div
							class="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
						>
							<Icon class="size-5" />
						</div>
						<h3 class="mt-5 font-heading text-xl font-bold">{capability.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
							{capability.description}
						</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
