<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { featurePreview } from '$lib/constants/home/landingPage';
	import FeaturePreviewCard from './FeaturePreviewCard.svelte';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';

	function layoutClass(layout: string | undefined) {
		if (layout === 'digest') return 'lg:col-span-7';
		if (layout === 'agent') return 'lg:col-span-5';
		if (layout === 'wide') return 'lg:col-span-6';
		return 'sm:col-span-6 lg:col-span-4';
	}
</script>

<SectionShell>
	<Reveal>
		<SectionTitle
			title={featurePreview.title}
			description={featurePreview.description}
			align="center"
		/>
	</Reveal>

	<div class="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-12">
		{#each featurePreview.items as item, index (item.href)}
			<Reveal delay={index * 0.05} class={layoutClass(item.layout)}>
				<FeaturePreviewCard
					title={item.title}
					description={item.description}
					href={item.href}
					icon={item.icon}
					visualType={item.visualType}
					featured={item.layout === 'digest'}
				/>
			</Reveal>
		{/each}
	</div>

	<div class="mt-12 text-center">
		<Button href={featurePreview.cta.href} variant="outline">{featurePreview.cta.label}</Button>
	</div>
</SectionShell>
