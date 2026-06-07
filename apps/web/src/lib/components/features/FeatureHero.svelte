<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import { Button } from '$lib/components/ui/button';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import FeatureMockup from './FeatureMockup.svelte';

	let { feature }: { feature: FeaturePageData } = $props();

	const proofPills = ['WhatsApp-first', 'Owner approve', 'CRM otomatis'];
</script>

<section class="bg-background px-4 py-16 md:py-28">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
		<Reveal>
			<div>
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">
					{feature.eyebrow}
				</p>

				<h1 class="mt-4 max-w-4xl font-heading text-4xl leading-tight font-black md:text-6xl">
					{feature.title}
				</h1>

				<p class="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
					{feature.description}
				</p>

				<div class="mt-8 grid gap-3 sm:flex">
					<Button href={feature.primaryCta.href} size="lg" class="w-full sm:w-auto">
						{feature.primaryCta.label}
					</Button>

					<Button
						href={feature.secondaryCta.href}
						size="lg"
						variant="outline"
						class="w-full sm:w-auto"
					>
						{feature.secondaryCta.label}
					</Button>
				</div>

				<div class="mt-6 flex flex-wrap gap-3">
					{#each proofPills as pill (pill)}
						<span class="rounded-full border-2 bg-primary/5 px-4 py-2 text-sm font-bold">
							{pill}
						</span>
					{/each}
				</div>
			</div>
		</Reveal>

		<Reveal delay={0.12}>
			<div class="shadow-3d-lg rounded-[2rem] border-2 bg-muted/40 p-4">
				<FeatureMockup type={feature.mockupType} />
			</div>
		</Reveal>
	</div>
</section>
