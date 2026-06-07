<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { createProductSimpleGridFlow } from '$lib/constants/product-flow';
	import type { SolutionPageData } from '$lib/constants/solutions';
	import ProductFlowCanvas from '$lib/components/product/flow/ProductFlowCanvas.svelte';

	let { solution }: { solution: SolutionPageData } = $props();

	const workflowFlow = $derived(
		createProductSimpleGridFlow({
			showStepNumber: true,
			nodes: solution.workflow.steps.map((step, index) => ({
				id: `workflow-${index + 1}`,
				title: step.title,
				description: step.description,
				tone:
					index % 3 === 1
						? ('secondary' as const)
						: index % 3 === 2
							? ('accent' as const)
							: ('primary' as const)
			}))
		})
	);
</script>

<section class="bg-background py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="mx-auto max-w-3xl space-y-4 text-center">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					{solution.workflow.title}
				</h2>
				<p class="text-lg text-muted-foreground">{solution.workflow.description}</p>
			</div>
		</Reveal>

		<Reveal delay={0.08}>
			<div class="mt-10">
				<ProductFlowCanvas flow={workflowFlow} animated />
			</div>
		</Reveal>
	</div>
</section>
