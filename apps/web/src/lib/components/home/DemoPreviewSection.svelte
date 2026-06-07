<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { demoPreview } from '$lib/constants/home/landingPage';
	import { Play } from '@lucide/svelte';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';
</script>

<SectionShell>
	<div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
		<Reveal>
			<SectionTitle title={demoPreview.title} description={demoPreview.description} />

			<div class="mt-8 grid gap-3">
				{#each demoPreview.steps as step, index (step.title)}
					{@const Icon = step.icon}
					<div class="shadow-3d-sm rounded-2xl border-2 bg-card p-3">
						<div class="flex items-center gap-3">
							<div
								class="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"
							>
								<Icon class="size-4" />
							</div>
							<p class="flex-1 text-sm leading-snug font-bold">{step.title}</p>
							<span class="text-xs font-bold text-muted-foreground">0{index + 1}</span>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-8 flex flex-col gap-3 sm:flex-row">
				<Button href={demoPreview.cta.href}>{demoPreview.cta.label}</Button>
				<Button href={demoPreview.secondaryCta.href} variant="outline">
					{demoPreview.secondaryCta.label}
				</Button>
			</div>
		</Reveal>

		<Reveal delay={0.08}>
			<Card
				class="shadow-3d-lg overflow-hidden rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.005]"
			>
				<CardContent class="p-0">
					<div class="flex items-center gap-2 border-b-2 bg-muted/40 px-4 py-3">
						<span class="size-3 rounded-full bg-destructive"></span>
						<span class="size-3 rounded-full bg-secondary"></span>
						<span class="size-3 rounded-full bg-primary"></span>
						<p class="ml-2 text-xs font-bold text-muted-foreground">{demoPreview.video.title}</p>
					</div>
					<div class="aspect-video bg-muted">
						{#if demoPreview.video.enabled}
							<iframe
								src={demoPreview.video.embedUrl}
								title={demoPreview.video.title}
								class="h-full w-full"
								loading="lazy"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
							></iframe>
						{:else}
							<div
								class="grid h-full place-items-center border-2 border-dashed border-border bg-muted/60 p-6 text-center"
							>
								<div>
									<div
										class="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_0_0_var(--shadow-3d-primary)]"
									>
										<Play class="size-7 fill-current" />
									</div>
									<h3 class="mt-5 text-2xl font-bold">{demoPreview.video.placeholderTitle}</h3>
									<p class="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
										{demoPreview.video.placeholderDescription}
									</p>
								</div>
							</div>
						{/if}
					</div>
					<p class="border-t-2 bg-background px-4 py-3 text-xs font-bold text-muted-foreground">
						Area ini disiapkan untuk video demo. Jika embed dimatikan, layout tetap aman.
					</p>
				</CardContent>
			</Card>
		</Reveal>
	</div>
</SectionShell>
