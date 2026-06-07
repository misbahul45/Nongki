<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { pricingPlans } from '$lib/constants/pricing';
	import { CheckCircle2 } from '@lucide/svelte';
	import { cn } from '$lib/utils';
</script>

<section id="pricing-plans" class="bg-muted/40 px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Paket</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					Tiga cara memakai Nongki tanpa mengunci biaya terlalu awal.
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Starter untuk mulai, Kredit AI untuk pemakaian aktif, dan Pro untuk bisnis yang bertumbuh.
				</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 lg:grid-cols-3">
			{#each pricingPlans as plan, index (plan.id)}
				{@const Icon = plan.icon}
				<Reveal delay={index * 0.06}>
					<Card.Root
						class={cn(
							'shadow-3d-sm hover:shadow-3d-lg h-full rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1',
							plan.highlighted &&
								'shadow-3d-primary border-primary bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground'
						)}
					>
						<Card.Header>
							<div class="flex items-start justify-between gap-4">
								<div
									class={cn(
										'grid size-12 place-items-center rounded-2xl border-2',
										plan.highlighted
											? 'border-primary-foreground/25 bg-primary-foreground/15'
											: 'bg-primary text-primary-foreground'
									)}
								>
									<Icon class="size-5" />
								</div>

								{#if plan.highlighted}
									<Badge class="border-primary-foreground/25 bg-primary-foreground text-primary">
										Monetisasi utama
									</Badge>
								{/if}
							</div>
							<p
								class={cn(
									'mt-4 text-xs font-black tracking-[0.16em] uppercase',
									plan.highlighted ? 'text-primary-foreground/75' : 'text-primary'
								)}
							>
								{plan.eyebrow}
							</p>
							<Card.Title class="font-heading text-3xl font-black">{plan.name}</Card.Title>
							<div>
								<p class="font-heading text-4xl font-black">{plan.priceLabel}</p>
								<p
									class={cn(
										'mt-1 text-sm font-bold',
										plan.highlighted ? 'text-primary-foreground/75' : 'text-muted-foreground'
									)}
								>
									{plan.priceSubtext}
								</p>
							</div>
							<Card.Description
								class={cn('leading-relaxed', plan.highlighted && 'text-primary-foreground/80')}
							>
								{plan.description}
							</Card.Description>
						</Card.Header>

						<Card.Content class="flex h-full flex-col gap-6">
							<div
								class={cn(
									'rounded-2xl border-2 p-4 text-sm font-bold',
									plan.highlighted
										? 'border-primary-foreground/25 bg-primary-foreground/10'
										: 'bg-muted/40'
								)}
							>
								Best for: {plan.bestFor}
							</div>

							<div class="grid gap-3">
								{#each plan.features as feature (feature)}
									<div class="flex gap-3 text-sm font-bold">
										<CheckCircle2 class="mt-0.5 size-4 shrink-0" />
										<span>{feature}</span>
									</div>
								{/each}
							</div>

							{#if plan.limitations?.length}
								<div
									class={cn(
										'grid gap-2 rounded-2xl border-2 p-4 text-xs leading-relaxed',
										plan.highlighted
											? 'border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/75'
											: 'bg-background text-muted-foreground'
									)}
								>
									{#each plan.limitations as limitation (limitation)}
										<p>{limitation}</p>
									{/each}
								</div>
							{/if}

							<Button
								href={plan.cta.href}
								variant={plan.highlighted ? 'secondary' : 'outline'}
								class="mt-auto h-12 rounded-xl"
							>
								{plan.cta.label}
							</Button>
						</Card.Content>
					</Card.Root>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
