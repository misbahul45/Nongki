<script lang="ts">
	import type { SolutionPageData } from '$lib/constants/solutions';
	import SolutionCtaSection from './SolutionCtaSection.svelte';
	import SolutionFeatureStack from './SolutionFeatureStack.svelte';
	import SolutionHero from './SolutionHero.svelte';
	import SolutionOutcomeSection from './SolutionOutcomeSection.svelte';
	import SolutionPainSection from './SolutionPainSection.svelte';
	import SolutionRelatedSection from './SolutionRelatedSection.svelte';
	import SolutionScenarioSection from './SolutionScenarioSection.svelte';
	import SolutionWorkflowSection from './SolutionWorkflowSection.svelte';

	let { solution }: { solution: SolutionPageData } = $props();
</script>

<SolutionHero {solution} />
<SolutionPainSection {solution} />
<SolutionWorkflowSection {solution} />
<SolutionFeatureStack {solution} />
<SolutionScenarioSection {solution} />
<SolutionOutcomeSection {solution} />
<SolutionRelatedSection {solution} />
<SolutionCtaSection {solution} />
