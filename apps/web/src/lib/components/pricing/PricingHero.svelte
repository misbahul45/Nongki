<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { pricingHero, pricingProofs } from '$lib/constants/pricing';
	import PricingMockup from './PricingMockup.svelte';
</script>

<section class="relative overflow-hidden bg-background px-4 py-16 md:py-28">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_top_left,var(--primary)_0%,transparent_34%),radial-gradient(circle_at_top_right,var(--secondary)_0%,transparent_32%)] opacity-15"
	></div>

	<div
		class="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
	>
		<Reveal>
			<div>
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">
					{pricingHero.eyebrow}
				</p>
				<h1 class="mt-4 max-w-4xl font-heading text-4xl leading-tight font-black md:text-6xl">
					{pricingHero.title}
				</h1>
				<p class="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
					{pricingHero.description}
				</p>

				<div class="mt-8 grid gap-3 sm:flex">
					<Button href="/auth/register" size="lg" class="w-full sm:w-auto">Mulai Gratis</Button>
					<Button href="#pricing-plans" size="lg" variant="outline" class="w-full sm:w-auto">
						Lihat Paket
					</Button>
				</div>

				<div class="mt-6 flex flex-wrap gap-3">
					{#each pricingProofs as proof (proof.label)}
						{@const Icon = proof.icon}
						<span
							class="shadow-3d-sm inline-flex items-center gap-2 rounded-2xl border-2 bg-background px-4 py-2 text-sm font-bold"
						>
							<Icon class="size-4 text-primary" />
							{proof.label}
						</span>
					{/each}
				</div>
			</div>
		</Reveal>

		<Reveal delay={0.1}>
			<PricingMockup />
		</Reveal>
	</div>
</section>
