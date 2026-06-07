<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { problemOverview } from '$lib/constants/home/landingPage';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';
</script>

<SectionShell variant="muted">
	<div class="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
		<Reveal>
			<SectionTitle
				eyebrow={problemOverview.eyebrow}
				title={problemOverview.title}
				description={problemOverview.description}
			/>
			<p class="shadow-3d mt-6 rounded-3xl border-2 bg-background p-5 text-lg font-bold">
				{problemOverview.punchline}
			</p>
			<Button href={problemOverview.cta.href} variant="outline" class="mt-6">
				{problemOverview.cta.label}
			</Button>
		</Reveal>

		<Reveal delay={0.08}>
			<Card class="shadow-3d-lg rounded-3xl border-2">
				<CardHeader>
					<CardTitle>{problemOverview.inbox.title}</CardTitle>
				</CardHeader>
				<CardContent class="space-y-3">
					{#each problemOverview.inbox.items as item (item.message)}
						<div
							class="flex items-center justify-between gap-3 rounded-2xl border-2 bg-background p-3"
						>
							<p class="min-w-0 text-sm font-bold">{item.message}</p>
							<span
								class="shrink-0 rounded-full bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground"
							>
								{item.status}
							</span>
						</div>
					{/each}
					<div
						class="rounded-2xl border-2 border-destructive/25 bg-destructive/10 p-3 text-sm font-bold text-destructive"
					>
						{problemOverview.inbox.footer}
					</div>
				</CardContent>
			</Card>
		</Reveal>
	</div>

	<div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each problemOverview.cards as card, index (card.title)}
			{@const Icon = card.icon}
			<Reveal delay={index * 0.06}>
				<Card class="shadow-3d h-full rounded-3xl border-2">
					<CardContent class="space-y-4 p-5">
						<div
							class="shadow-3d-sm grid size-11 place-items-center rounded-2xl border-2 bg-background text-primary"
						>
							<Icon class="size-5" />
						</div>
						<h3 class="text-lg font-bold">{card.title}</h3>
						<p class="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
					</CardContent>
				</Card>
			</Reveal>
		{/each}
	</div>
</SectionShell>
