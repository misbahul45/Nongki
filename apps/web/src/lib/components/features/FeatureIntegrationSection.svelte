<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import Reveal from '$lib/components/home/Reveal.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="max-w-3xl">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Integrasi</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					Tersambung ke modul Nongki lain.
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Fitur ini bekerja paling baik saat terhubung dengan data chat, profil customer, dan action
					owner.
				</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each feature.integrations as integration, index (integration.href)}
				<Reveal delay={index * 0.05}>
					<a
						href={integration.href}
						class="shadow-3d-sm hover:shadow-3d-lg block h-full rounded-3xl border-2 bg-muted/40 p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<h3 class="font-heading text-xl font-black">{integration.title}</h3>
						<p class="mt-3 leading-relaxed text-muted-foreground">{integration.description}</p>
						<span class="mt-5 inline-block font-bold text-primary">Lihat detail →</span>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
