<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import FeatureCapabilitySection from './FeatureCapabilitySection.svelte';
	import FeatureCtaSection from './FeatureCtaSection.svelte';
	import FeatureHero from './FeatureHero.svelte';
	import FeatureHowItWorksSection from './FeatureHowItWorksSection.svelte';
	import FeatureIntegrationSection from './FeatureIntegrationSection.svelte';
	import FeaturePreviewPanel from './FeaturePreviewPanel.svelte';
	import FeatureProblemSection from './FeatureProblemSection.svelte';
	import FeatureRelatedSection from './FeatureRelatedSection.svelte';
	import FeatureUseCaseSection from './FeatureUseCaseSection.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<svelte:head>
	<title>{feature.title} | Nongki</title>
	<meta name="description" content={feature.description} />
</svelte:head>

<FeatureHero {feature} />
<FeatureProblemSection {feature} />
<FeatureHowItWorksSection {feature} />
<FeaturePreviewPanel {feature} />
<FeatureCapabilitySection {feature} />
<FeatureUseCaseSection {feature} />
<FeatureIntegrationSection {feature} />
<FeatureRelatedSection {feature} />
<FeatureCtaSection {feature} />
