<script lang="ts">
	import ProductFlowCanvas from '$lib/components/product/flow/ProductFlowCanvas.svelte';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { createProductSimpleGridFlow } from '$lib/constants/product-flow';
	import { pricingAstraPay } from '$lib/constants/pricing';
	import { QrCode } from '@lucide/svelte';

	const astraPayFlow = createProductSimpleGridFlow({
		nodeVariant: 'numbered',
		showStepNumber: true,
		nodes: pricingAstraPay.steps.map((step, index) => ({
			id: `topup-${index + 1}`,
			title: step,
			description:
				index === 3
					? 'Payment webhook harus idempotent di implementasi backend.'
					: 'Langkah dibuat familiar untuk owner UMKM F&B.',
			tone: index % 3 === 1 ? 'secondary' : index % 3 === 2 ? 'accent' : 'primary'
		}))
	});
</script>

<section class="bg-primary/5 px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="mx-auto max-w-3xl text-center">
				<div
					class="shadow-3d-primary mx-auto grid size-14 place-items-center rounded-2xl border-2 bg-primary text-primary-foreground"
				>
					<QrCode class="size-7" />
				</div>
				<h2 class="mt-5 font-heading text-3xl font-black md:text-5xl">
					{pricingAstraPay.title}
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					{pricingAstraPay.description}
				</p>
			</div>
		</Reveal>

		<Reveal delay={0.1} class="mt-10">
			<ProductFlowCanvas flow={astraPayFlow} animated />
		</Reveal>
	</div>
</section>
