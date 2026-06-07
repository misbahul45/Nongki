<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	let {
		eyebrow,
		title,
		description,
		highlights = [],
		children
	}: {
		eyebrow: string;
		title: string;
		description: string;
		highlights?: string[];
		mode?: 'login' | 'register';
		children: Snippet;
	} = $props();
</script>

<section
	class="relative flex min-h-[calc(100svh-5.5rem)] items-center justify-center overflow-hidden bg-background px-4 py-10"
>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,var(--primary)_0%,transparent_34%),radial-gradient(circle_at_top_right,var(--secondary)_0%,transparent_30%)] opacity-10"
	></div>

	<div
		aria-hidden="true"
		class="pointer-events-none absolute bottom-0 left-1/2 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_64%)] opacity-[0.07]"
	></div>

	<Card.Root
		class="shadow-3d-lg relative z-10 w-full max-w-lg rounded-3xl border-2 bg-background/95"
	>
		<Card.Header class="space-y-4 text-center">
			<div>
				<p class="text-xs font-black tracking-[0.18em] text-primary uppercase">
					{eyebrow}
				</p>

				<Card.Title class="mt-3 font-heading text-3xl leading-tight font-bold md:text-4xl">
					{title}
				</Card.Title>

				<Card.Description class="mx-auto mt-3 max-w-md text-sm leading-relaxed md:text-base">
					{description}
				</Card.Description>
			</div>

			{#if highlights.length}
				<div class="flex flex-wrap justify-center gap-2">
					{#each highlights.slice(0, 3) as item (item)}
						<Badge
							variant="outline"
							class="rounded-full border-2 bg-primary/5 px-3 py-1.5 text-xs font-bold text-foreground"
						>
							{item}
						</Badge>
					{/each}
				</div>
			{/if}
		</Card.Header>

		<Card.Content>
			{@render children()}
		</Card.Content>
	</Card.Root>
</section>
