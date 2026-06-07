<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { pricingCreditPacks, pricingTrustNotes } from '$lib/constants/pricing';
</script>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
		<Reveal>
			<div>
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Kredit AI</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					Kredit AI dipakai saat Nongki bekerja lebih aktif.
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Owner tidak dipaksa langganan mahal. Kredit dipakai hanya ketika fitur AI dipakai di atas
					kuota gratis: balasan tambahan, reactive insight, campaign draft, dan owner digest.
				</p>

				<div class="mt-8 grid gap-4">
					{#each pricingTrustNotes as note (note.title)}
						{@const Icon = note.icon}
						<div class="shadow-3d-sm rounded-3xl border-2 bg-muted/40 p-5">
							<div class="flex gap-4">
								<div
									class="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"
								>
									<Icon class="size-5" />
								</div>
								<div>
									<h3 class="font-heading text-xl font-black">{note.title}</h3>
									<p class="mt-2 leading-relaxed text-muted-foreground">{note.description}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</Reveal>

		<div class="grid gap-5 md:grid-cols-2">
			{#each pricingCreditPacks as pack, index (pack.name)}
				<Reveal delay={index * 0.05}>
					<Card.Root class="shadow-3d-sm h-full rounded-3xl border-2 bg-muted/40">
						<Card.Header>
							<p class="text-xs font-black tracking-[0.14em] text-primary uppercase">
								{pack.label}
							</p>
							<Card.Title class="font-heading text-2xl font-black">{pack.name}</Card.Title>
							<Card.Description class="leading-relaxed">{pack.description}</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex flex-wrap gap-2">
								{#each pack.usage as usage (usage)}
									<span class="rounded-full border-2 bg-background px-3 py-1 text-xs font-black">
										{usage}
									</span>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
