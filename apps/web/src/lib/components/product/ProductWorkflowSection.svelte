<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { productWorkflowFlows, type ProductPageData } from '$lib/constants/product';
	import ProductFlowCanvas from './flow/ProductFlowCanvas.svelte';

	let { product }: { product: ProductPageData } = $props();

	const canvasFlow = $derived(productWorkflowFlows[product.slug]);
</script>

<section class="bg-primary/5 py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="mx-auto max-w-3xl space-y-4 text-center">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					{canvasFlow?.title ?? product.workflow.title}
				</h2>
				<p class="text-lg text-muted-foreground">
					{canvasFlow?.description ?? product.workflow.description}
				</p>
			</div>
		</Reveal>

		<Reveal delay={0.08}>
			<div class="mt-10">
				{#if canvasFlow}
					<ProductFlowCanvas flow={canvasFlow} animated />
				{/if}
			</div>
		</Reveal>
	</div>
</section>
