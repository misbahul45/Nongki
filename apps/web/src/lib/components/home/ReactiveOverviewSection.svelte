<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { reactiveOverview } from '$lib/constants/home/landingPage';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';
</script>

<SectionShell>
	<Reveal>
		<SectionTitle
			title={reactiveOverview.title}
			description={reactiveOverview.description}
			align="center"
		/>
	</Reveal>

	<div class="mt-10 grid gap-5 lg:grid-cols-3">
		{#each reactiveOverview.cards as card, index (card.title)}
			{@const Icon = card.icon}
			<Reveal delay={index * 0.08}>
				<Card
					class={card.highlight
						? 'h-full rounded-3xl border-2 bg-primary text-primary-foreground shadow-[0_8px_0_0_var(--shadow-3d-primary)]'
						: 'shadow-3d-lg h-full rounded-3xl border-2'}
				>
					<CardContent class="space-y-5 p-6">
						<div
							class={card.highlight
								? 'grid size-12 place-items-center rounded-2xl bg-primary-foreground text-primary'
								: 'shadow-3d-sm grid size-12 place-items-center rounded-2xl border-2 bg-background text-primary'}
						>
							<Icon class="size-6" />
						</div>
						<h3 class="text-2xl font-bold">{card.title}</h3>
						<p class={card.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
							{card.description}
						</p>
					</CardContent>
				</Card>
			</Reveal>
		{/each}
	</div>

	<Reveal delay={0.12}>
		<div class="shadow-3d mx-auto mt-10 max-w-4xl rounded-3xl border-2 bg-muted/40 p-4">
			<div class="flex flex-wrap items-center justify-center gap-2">
				{#each reactiveOverview.loop as item, index (item)}
					<span class="rounded-2xl border-2 bg-background px-4 py-2 text-sm font-bold">{item}</span>
					{#if index < reactiveOverview.loop.length - 1}
						<span class="text-primary">→</span>
					{/if}
				{/each}
			</div>
			<p class="mt-4 text-center text-sm font-bold text-muted-foreground">
				{reactiveOverview.note}
			</p>
		</div>
		<div class="mt-6 text-center">
			<Button href={reactiveOverview.cta.href}>{reactiveOverview.cta.label}</Button>
		</div>
	</Reveal>
</SectionShell>
