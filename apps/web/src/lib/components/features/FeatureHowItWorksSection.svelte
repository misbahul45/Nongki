<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import ProductFlowCanvas from '$lib/components/product/flow/ProductFlowCanvas.svelte';
	import { createProductSimpleGridFlow } from '$lib/constants/product-flow';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();

	const workflowFlow = $derived(
		createProductSimpleGridFlow({
			nodeVariant: 'numbered',
			showStepNumber: true,
			nodes: feature.howItWorks.steps.map((step, index) => ({
				id: `step-${index + 1}`,
				title: step.title,
				description: step.description,
				tone: index % 3 === 1 ? 'secondary' : index % 3 === 2 ? 'accent' : 'primary'
			}))
		})
	);
</script>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Cara Kerja</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					{feature.howItWorks.title}
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					{feature.howItWorks.description}
				</p>
			</div>
		</Reveal>

		<Reveal delay={0.1} class="mt-10">
			<ProductFlowCanvas flow={workflowFlow} animated />
		</Reveal>
	</div>
</section>
