<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<section class="bg-primary px-4 py-16 text-primary-foreground md:py-24">
	<Reveal>
		<div class="mx-auto max-w-4xl text-center">
			<p class="text-sm font-black tracking-[0.18em] uppercase opacity-80">{feature.eyebrow}</p>
			<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
				Mulai gunakan fitur ini dalam workflow WhatsApp bisnismu.
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed opacity-85">
				Hubungkan chat pelanggan, data customer, dan action owner dalam satu sistem yang lebih rapi.
			</p>
			<div class="mt-8 grid gap-3 sm:flex sm:justify-center">
				<Button
					href="/auth/register"
					size="lg"
					class="border-background bg-background text-primary hover:bg-background/90"
				>
					Mulai Gratis
				</Button>
				<Button
					href="/product"
					size="lg"
					variant="outline"
					class="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
				>
					Lihat Semua Produk
				</Button>
			</div>
		</div>
	</Reveal>
</section>
