<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { SolutionPageData } from '$lib/constants/solutions';

	let { solution }: { solution: SolutionPageData } = $props();
</script>

<section class="bg-background py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
				Lihat solution lainnya.
			</h2>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2">
			{#each solution.related as item, index (item.href)}
				<Reveal delay={index * 0.05}>
					<a
						href={item.href}
						class="shadow-3d-sm hover:shadow-3d-lg block h-full rounded-3xl border-2 bg-muted/40 p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<h3 class="font-heading text-2xl font-bold">{item.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
						<p class="mt-5 text-sm font-black text-primary">Buka solution -&gt;</p>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
