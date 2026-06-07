<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { SolutionPageData } from '$lib/constants/solutions';

	let { solution }: { solution: SolutionPageData } = $props();
</script>

<section class="bg-primary/5 py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="max-w-3xl space-y-4">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					{solution.featureStack.title}
				</h2>
				<p class="text-lg text-muted-foreground">{solution.featureStack.description}</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each solution.featureStack.items as item, index (item.title)}
				{@const Icon = item.icon}
				<Reveal delay={index * 0.04}>
					<a
						href={item.href}
						class="shadow-3d-sm hover:shadow-3d-lg block h-full rounded-3xl border-2 bg-background p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<div
							class="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
						>
							<Icon class="size-5" />
						</div>
						<h3 class="mt-5 font-heading text-xl font-bold">{item.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
						<p class="mt-5 text-sm font-black text-primary">Lihat modul -&gt;</p>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
