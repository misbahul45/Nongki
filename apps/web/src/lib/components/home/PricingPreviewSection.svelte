<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { pricingPreview } from '$lib/constants/home/landingPage';
	import { cn } from '$lib/utils';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';

	function hoverClass(index: number, highlighted?: boolean) {
		if (highlighted) {
			return 'transform-gpu border-primary hover:scale-[1.015]';
		}

		return index === 0
			? 'transform-gpu hover:shadow-3d-lg'
			: 'transform-gpu hover:border-primary/60 hover:shadow-3d-lg';
	}
</script>

<SectionShell variant="muted">
	<Reveal>
		<SectionTitle
			title={pricingPreview.title}
			description={pricingPreview.description}
			align="center"
		/>
	</Reveal>

	<div class="mt-10 grid gap-5 lg:grid-cols-3">
		{#each pricingPreview.items as item, index (item.title)}
			<Reveal delay={index * 0.06}>
				<Card
					class={cn(
						'shadow-3d-lg h-full rounded-3xl border-2 transition-all duration-300',
						hoverClass(index, item.highlight),
						item.highlight &&
							'bg-primary text-primary-foreground shadow-[0_8px_0_0_var(--shadow-3d-primary)]'
					)}
				>
					<CardHeader>
						<div class="flex items-start justify-between gap-3">
							<div>
								<p
									class={cn(
										'text-sm font-bold',
										item.highlight ? 'text-primary-foreground/75' : 'text-primary'
									)}
								>
									{item.label}
								</p>
								<CardTitle class="mt-2 text-2xl">{item.title}</CardTitle>
							</div>
							{#if item.badge}
								<span
									class="rounded-full border-2 border-primary-foreground/30 bg-primary-foreground px-3 py-1 text-xs font-bold text-primary"
								>
									{item.badge}
								</span>
							{/if}
						</div>
					</CardHeader>
					<CardContent class="flex h-full flex-col gap-6">
						<p
							class={cn(
								'text-sm leading-relaxed',
								item.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
							)}
						>
							{item.description}
						</p>
						<div class="grid gap-3">
							{#each item.features as feature (feature)}
								<div
									class={cn(
										'rounded-2xl border-2 p-3 text-sm font-bold',
										item.highlight
											? 'border-primary-foreground/25 bg-primary-foreground/10'
											: 'bg-background'
									)}
								>
									{feature}
								</div>
							{/each}
						</div>
						<Button
							href={item.href}
							variant={item.highlight ? 'secondary' : 'outline'}
							class="mt-auto"
						>
							{item.cta}
						</Button>
					</CardContent>
				</Card>
			</Reveal>
		{/each}
	</div>

	<div class="mt-8 text-center">
		<a href={pricingPreview.detail.href} class="font-bold text-primary">
			{pricingPreview.detail.label} →
		</a>
	</div>
</SectionShell>
