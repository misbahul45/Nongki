<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { SolutionPageData } from '$lib/constants/solutions';

	let { solution }: { solution: SolutionPageData } = $props();
</script>

<section class="bg-background py-16 md:py-28">
	<div class="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr]">
		<Reveal>
			<div class="space-y-4 lg:sticky lg:top-28">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					{solution.scenarios.title}
				</h2>
				<p class="text-lg text-muted-foreground">{solution.scenarios.description}</p>
			</div>
		</Reveal>

		<div class="grid gap-5">
			{#each solution.scenarios.items as item, index (item.title)}
				<Reveal delay={index * 0.05}>
					<div class="shadow-3d-sm rounded-3xl border-2 bg-muted/40 p-5">
						<h3 class="font-heading text-2xl font-bold">{item.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
						<div class="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
							{#each item.steps as step, stepIndex (step)}
								<span
									class="shadow-3d-sm rounded-2xl border-2 bg-background px-4 py-2 text-sm font-bold"
								>
									{step}
								</span>
								{#if stepIndex < item.steps.length - 1}
									<span class="hidden font-black text-primary sm:inline">-&gt;</span>
									<span class="text-center font-black text-primary sm:hidden">↓</span>
								{/if}
							{/each}
						</div>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
