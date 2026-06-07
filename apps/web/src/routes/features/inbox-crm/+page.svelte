<script lang="ts">
	import FeatureDetailPage from '$lib/components/features/FeatureDetailPage.svelte';
	import { featurePages } from '$lib/constants/features';

	const feature = featurePages['inbox-crm'];
</script>

<FeatureDetailPage {feature} />
