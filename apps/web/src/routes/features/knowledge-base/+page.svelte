<script lang="ts">
	import FeatureDetailPage from '$lib/components/features/FeatureDetailPage.svelte';
	import { featurePages } from '$lib/constants/features';

	const feature = featurePages['knowledge-base'];
</script>

<FeatureDetailPage {feature} />
