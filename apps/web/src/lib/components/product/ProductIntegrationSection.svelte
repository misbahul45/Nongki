<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { createProductSimpleGridFlow } from '$lib/constants/product-flow';
	import type { ProductPageData } from '$lib/constants/product';
	import ProductFlowCanvas from './flow/ProductFlowCanvas.svelte';

	let { product }: { product: ProductPageData } = $props();

	const integrationFlow = $derived(
		product.integration.items.length >= 5
			? createProductSimpleGridFlow({
					showStepNumber: true,
					nodes: [
						...product.integration.items.map((item, index) => ({
							id: `module-${index + 1}`,
							title: item,
							tone:
								index % 3 === 1
									? ('secondary' as const)
									: index % 3 === 2
										? ('accent' as const)
										: ('primary' as const)
						})),
						...(product.integration.items.length === 5
							? [
									{
										id: 'module-output',
										title: 'Owner Action',
										tone: 'secondary' as const
									}
								]
							: [])
					]
				})
			: undefined
	);
</script>

<section class="bg-background py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="max-w-3xl space-y-4">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					{product.integration.title}
				</h2>
				<p class="text-lg text-muted-foreground">{product.integration.description}</p>
			</div>
		</Reveal>

		<Reveal delay={0.08}>
			<div class="mt-10">
				{#if integrationFlow}
					<ProductFlowCanvas flow={integrationFlow} animated />
				{:else}
					<div
						class="shadow-3d-lg relative overflow-hidden rounded-3xl border-2 bg-background p-5 md:p-7"
					>
						<div
							aria-hidden="true"
							class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-50"
						></div>

						<div class="relative z-10 hidden items-stretch gap-3 lg:flex">
							{#each product.integration.items as item, index (item)}
								<div
									class={`shadow-3d-sm flex min-h-24 min-w-0 flex-1 flex-col justify-center rounded-2xl border-2 px-4 py-3 ${
										index === 0 ? 'border-primary bg-primary/5' : 'bg-background'
									}`}
								>
									<p class="text-[11px] font-black tracking-[0.14em] text-primary uppercase">
										{index === 0 ? 'Current flow' : `Module ${index + 1}`}
									</p>
									<p class="mt-2 font-heading text-lg leading-tight font-bold">{item}</p>
								</div>

								{#if index < product.integration.items.length - 1}
									<div class="grid shrink-0 place-items-center text-2xl font-black text-primary">
										-&gt;
									</div>
								{/if}
							{/each}
						</div>

						<div class="relative z-10 grid gap-3 lg:hidden">
							{#each product.integration.items as item, index (item)}
								<div
									class={`shadow-3d-sm rounded-2xl border-2 px-4 py-3 ${
										index === 0 ? 'border-primary bg-primary/5' : 'bg-background'
									}`}
								>
									<p class="text-[11px] font-black tracking-[0.14em] text-primary uppercase">
										{index === 0 ? 'Current flow' : `Module ${index + 1}`}
									</p>
									<p class="mt-2 font-heading text-lg leading-tight font-bold">{item}</p>
								</div>

								{#if index < product.integration.items.length - 1}
									<div class="text-center text-2xl font-black text-primary">↓</div>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</Reveal>
	</div>
</section>
