<script lang="ts">
	import type { ProductPageData } from '$lib/constants/product';
	import ProductBenefitSection from './ProductBenefitSection.svelte';
	import ProductCapabilityGrid from './ProductCapabilityGrid.svelte';
	import ProductCtaSection from './ProductCtaSection.svelte';
	import ProductHero from './ProductHero.svelte';
	import ProductIntegrationSection from './ProductIntegrationSection.svelte';
	import ProductPreviewSection from './ProductPreviewSection.svelte';
	import ProductProblemSection from './ProductProblemSection.svelte';
	import ProductWorkflowSection from './ProductWorkflowSection.svelte';
	import RelatedProductsSection from './RelatedProductsSection.svelte';

	let { product }: { product: ProductPageData } = $props();
</script>

<ProductHero {product} />
<ProductProblemSection {product} />
<ProductCapabilityGrid {product} />
<ProductWorkflowSection {product} />
<ProductPreviewSection {product} />
<ProductBenefitSection {product} />
<ProductIntegrationSection {product} />
<RelatedProductsSection {product} />
<ProductCtaSection {product} />
