<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Reveal from '$lib/components/home/Reveal.svelte';
</script>

<section class="relative overflow-hidden bg-primary px-4 py-16 text-primary-foreground md:py-24">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_32%)]"
	></div>
	<Reveal>
		<div class="relative z-10 mx-auto max-w-4xl text-center">
			<p class="text-sm font-black tracking-[0.18em] uppercase opacity-80">Pricing Nongki</p>
			<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
				Mulai dari gratis, tambah kredit saat bisnis mulai aktif.
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed opacity-85">
				Nongki dibuat agar UMKM bisa mencoba dulu, lalu membayar sesuai pemakaian AI dan kebutuhan
				operasional.
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
					Lihat Produk
				</Button>
			</div>
		</div>
	</Reveal>
</section>
