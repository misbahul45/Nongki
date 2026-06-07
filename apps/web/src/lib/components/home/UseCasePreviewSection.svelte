<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { useCasePreview } from '$lib/constants/home/landingPage';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';

	const marqueeItems = [...useCasePreview.marqueeItems, ...useCasePreview.marqueeItems];
</script>

<SectionShell variant="soft">
	<Reveal>
		<SectionTitle
			title={useCasePreview.title}
			description={useCasePreview.description}
			align="center"
		/>
	</Reveal>

	<div class="mt-10 overflow-hidden">
		<div class="animate-marquee-left flex w-max gap-3">
			{#each marqueeItems as item, index (`${item}-${index}`)}
				<span
					class="rounded-full border-2 bg-background px-4 py-2 text-sm font-bold shadow-[0_3px_0_0_var(--shadow-3d)]"
				>
					{item}
				</span>
			{/each}
		</div>
	</div>

	<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each useCasePreview.items as item, index (item.href)}
			<Reveal delay={index * 0.06}>
				<a href={item.href} class="group block h-full">
					<Card
						class="group-hover:shadow-3d-lg h-full overflow-hidden rounded-3xl border-2 transition-all duration-300 group-hover:-translate-y-1"
					>
						<CardContent class="p-4">
							<div
								class="relative flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed bg-muted text-center text-sm font-bold text-muted-foreground"
							>
								{item.placeholder}
								<div
									class="absolute -bottom-6 left-4 flex size-12 items-center justify-center rounded-2xl border-2 bg-background text-2xl shadow-[0_4px_0_0_var(--shadow-3d)]"
								>
									{item.emoji}
								</div>
							</div>
							<div class="pt-10">
								<h3 class="text-lg font-bold">{item.title}</h3>
								<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
								<p class="mt-4 text-sm font-bold text-primary">Lihat solusi →</p>
							</div>
						</CardContent>
					</Card>
				</a>
			</Reveal>
		{/each}
	</div>
</SectionShell>
