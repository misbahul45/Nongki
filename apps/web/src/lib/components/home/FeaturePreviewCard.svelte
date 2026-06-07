\<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import VisualMini from './VisualMini.svelte';
	import type { Component } from 'svelte';
	import type { VisualType } from '$lib/constants/home/landingPage';

	let {
		title,
		description,
		href,
		icon: Icon,
		visualType = 'chat',
		featured = false,
		class: className
	}: {
		title: string;
		description: string;
		href: string;
		icon?: Component;
		visualType?: VisualType;
		featured?: boolean;
		class?: string;
	} = $props();
</script>

<a {href} class={cn('group block h-full', className)}>
	<Card
		class={cn(
			'h-full overflow-hidden rounded-3xl border-2 bg-background transition-all duration-300 group-hover:-translate-y-1',
			'shadow-3d-lg group-hover:shadow-[0_12px_0_0_var(--shadow-3d)]',
			featured &&
				'border-primary bg-primary/5 shadow-[0_8px_0_0_var(--shadow-3d-primary)] group-hover:scale-[1.01] group-hover:shadow-[0_12px_0_0_var(--shadow-3d-primary)]'
		)}
	>
		<CardHeader class="pb-3">
			<div class="flex items-start gap-3">
				{#if Icon}
					<div
						class={cn(
							'grid size-11 shrink-0 place-items-center rounded-2xl border-2 bg-muted text-primary shadow-3d-sm transition-transform duration-300 group-hover:scale-105',
							featured && 'border-primary bg-primary text-primary-foreground shadow-3d-primary'
						)}
					>
						<Icon class="size-5" />
					</div>
				{/if}

				<div class="min-w-0">
					{#if featured}
						<p class="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
							Fitur unggulan
						</p>
					{/if}

					<CardTitle class="leading-tight">
						{title}
					</CardTitle>
				</div>
			</div>
		</CardHeader>

		<CardContent class="space-y-4">
			<div
				class={cn(
					'rounded-2xl border-2 bg-muted/50 p-3',
					featured && 'border-primary/30 bg-background'
				)}
			>
				<VisualMini type={visualType} />
			</div>

			<p class="text-sm leading-relaxed text-muted-foreground">
				{description}
			</p>

			<div
				class={cn(
					'inline-flex items-center rounded-full border-2 px-3 py-1.5 text-sm font-bold transition-all duration-300',
					'bg-background text-primary shadow-3d-sm group-hover:border-primary',
					featured && 'border-primary bg-primary text-primary-foreground shadow-3d-primary'
				)}
			>
				Pelajari detail →
			</div>
		</CardContent>
	</Card>
</a>