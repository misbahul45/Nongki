<script lang="ts">
	import { finalCta } from '$lib/constants/home/landingPage';
	import MetricPill from './MetricPill.svelte';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
</script>

<SectionShell variant="primary" class="py-16 md:py-24">
	<Reveal>
		<div
			class="relative mx-auto max-w-4xl rounded-3xl border-2 border-primary-foreground/20 bg-background p-8 text-center text-foreground shadow-[0_10px_0_0_var(--shadow-3d-primary)] transition-all duration-300 hover:scale-[1.01] md:p-12"
		>
			<div class="animate-float-soft absolute top-8 -left-4 hidden lg:block">
				<MetricPill value={finalCta.pills[0]} />
			</div>
			<div class="animate-float-medium absolute top-16 -right-4 hidden lg:block">
				<MetricPill value={finalCta.pills[1]} />
			</div>
			<div class="animate-float-soft absolute -bottom-4 left-20 hidden lg:block">
				<MetricPill value={finalCta.pills[2]} />
			</div>
			<h2 class="text-3xl font-bold tracking-tight md:text-5xl">{finalCta.title}</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
				{finalCta.description}
			</p>
			<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
				{#each finalCta.actions as action (action.href)}
					<a
						href={action.href}
						class={action.variant === 'primary'
							? 'shadow-3d-primary inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-primary px-6 font-bold text-primary-foreground transition-all active:translate-y-1'
							: 'shadow-3d inline-flex h-12 items-center justify-center rounded-xl border-2 bg-background px-6 font-bold transition-all active:translate-y-1'}
					>
						{action.label}
					</a>
				{/each}
			</div>
		</div>
	</Reveal>
</SectionShell>
