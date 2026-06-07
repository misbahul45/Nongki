<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { revenuePreview } from '$lib/constants/home/landingPage';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';

	function cardHoverClass(index: number) {
		return index === 0
			? 'group-hover:-translate-y-1 group-hover:border-destructive/60'
			: 'group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:shadow-3d-lg';
	}
</script>

<SectionShell variant="muted">
	<Reveal>
		<SectionTitle
			title={revenuePreview.title}
			description={revenuePreview.description}
			align="center"
		/>
	</Reveal>

	<div class="mt-10 grid gap-5 lg:grid-cols-2">
		{#each revenuePreview.cards as card, index (card.href)}
			{@const Icon = card.icon}
			<Reveal delay={index * 0.08}>
				<a href={card.href} class="group block h-full">
					<Card
						class={`shadow-3d-lg h-full rounded-3xl border-2 transition-all duration-300 ${cardHoverClass(index)}`}
					>
						<CardContent class="space-y-6 p-6">
							<div
								class="shadow-3d-sm grid size-12 place-items-center rounded-2xl border-2 bg-background text-primary"
							>
								<Icon class="size-6" />
							</div>
							<div>
								<h3 class="text-2xl font-bold">{card.title}</h3>
								<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
							</div>
							<div class="grid gap-3">
								{#each card.steps as step, stepIndex (step)}
									<div class="flex items-center gap-3 rounded-2xl border-2 bg-muted/40 p-3">
										<div
											class="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
										>
											{stepIndex + 1}
										</div>
										<p class="font-bold">{step}</p>
									</div>
								{/each}
							</div>
							<p class="font-bold text-primary">Pelajari detail →</p>
						</CardContent>
					</Card>
				</a>
			</Reveal>
		{/each}
	</div>

	<Reveal delay={0.12}>
		<div class="mx-auto mt-8 max-w-3xl text-center">
			<p class="text-sm font-bold text-muted-foreground">{revenuePreview.note}</p>
			<Button href={revenuePreview.cta.href} variant="outline" class="mt-5">
				{revenuePreview.cta.label}
			</Button>
		</div>
	</Reveal>
</SectionShell>
