<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { faqPreview } from '$lib/constants/home/landingPage';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';
</script>

<SectionShell>
	<div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
		<Reveal>
			<SectionTitle title={faqPreview.title} description={faqPreview.description} />
			<Button href={faqPreview.cta.href} variant="outline" class="mt-6">
				{faqPreview.cta.label}
			</Button>
		</Reveal>

		<Reveal delay={0.08}>
			<Accordion.Root type="single">
				{#each faqPreview.items as item (item.question)}
					<Accordion.Item value={item.question}>
						<Accordion.Trigger>{item.question}</Accordion.Trigger>
						<Accordion.Content>{item.answer}</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Reveal>
	</div>
</SectionShell>
