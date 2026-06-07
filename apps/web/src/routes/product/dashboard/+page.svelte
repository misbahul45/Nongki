<script lang="ts">
	import ProductDetailPage from '$lib/components/product/ProductDetailPage.svelte';
	import { productPages } from '$lib/constants/product';

	const product = productPages['dashboard'];
</script>

<ProductDetailPage {product} />
