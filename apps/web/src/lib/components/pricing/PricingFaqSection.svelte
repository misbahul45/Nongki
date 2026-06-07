<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { pricingFaqs } from '$lib/constants/pricing';
</script>

<section class="bg-muted/40 px-4 py-16 md:py-24">
	<div class="mx-auto max-w-4xl">
		<Reveal>
			<div class="text-center">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">FAQ</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					Pertanyaan soal model harga.
				</h2>
			</div>
		</Reveal>

		<Reveal delay={0.1} class="mt-10">
			<Accordion.Root type="single" class="grid gap-4">
				{#each pricingFaqs as faq (faq.question)}
					<Accordion.Item
						value={faq.question}
						class="shadow-3d-sm rounded-3xl border-2 bg-background px-5"
					>
						<Accordion.Trigger class="text-left font-heading text-lg font-black">
							{faq.question}
						</Accordion.Trigger>
						<Accordion.Content class="leading-relaxed text-muted-foreground">
							{faq.answer}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Reveal>
	</div>
</section>
