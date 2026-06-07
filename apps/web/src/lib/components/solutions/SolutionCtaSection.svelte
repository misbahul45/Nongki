<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { SolutionPageData } from '$lib/constants/solutions';

	let { solution }: { solution: SolutionPageData } = $props();
</script>

<section class="bg-primary py-16 text-primary-foreground md:py-28">
	<div class="mx-auto w-full max-w-5xl px-4 text-center">
		<Reveal>
			<div class="space-y-6">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					Mulai ubah chat pelanggan menjadi data dan action.
				</h2>
				<p class="mx-auto max-w-2xl text-lg text-primary-foreground/85">
					Hubungkan workflow WhatsApp bisnismu, biarkan Ningki membantu membalas, mencatat customer,
					dan memberi rekomendasi action.
				</p>
				<div class="flex flex-col justify-center gap-3 sm:flex-row">
					<a
						href={solution.primaryCta.href}
						class="inline-flex h-12 items-center justify-center rounded-xl border-2 border-background bg-background px-6 font-bold text-primary shadow-[0_5px_0_0_var(--shadow-3d-primary)] transition-all hover:-translate-y-0.5 active:translate-y-1"
					>
						{solution.primaryCta.label}
					</a>
					<a
						href="/product"
						class="inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary-foreground/50 bg-primary-foreground/10 px-6 font-bold text-primary-foreground shadow-[0_5px_0_0_var(--shadow-3d-primary)] transition-all hover:-translate-y-0.5 active:translate-y-1"
					>
						Lihat Produk
					</a>
				</div>
			</div>
		</Reveal>
	</div>
</section>
