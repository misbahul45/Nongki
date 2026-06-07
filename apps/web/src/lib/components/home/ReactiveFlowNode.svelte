<script lang="ts">
	import { Bot, CheckCircle2, ContactRound, Lightbulb, MessageCircle, Send } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import type { Component } from 'svelte';

	type ReactiveFlowItem = {
		id: string;
		title: string;
		subtitle: string;
		caption: string;
		status: string;
		tone?: 'primary' | 'secondary' | 'accent';
		metrics?: readonly string[];
	};

	let { item, compact = false }: { item: ReactiveFlowItem; compact?: boolean } = $props();

	const iconMap: Record<string, Component> = {
		chat: MessageCircle,
		reply: Bot,
		profile: ContactRound,
		insight: Lightbulb,
		digest: Send,
		approval: CheckCircle2
	};

	const Icon = $derived(iconMap[item.id] ?? MessageCircle);
	const tone = $derived(item.tone ?? 'primary');
	const iconClass = $derived(
		tone === 'secondary'
			? 'border-secondary bg-secondary text-secondary-foreground shadow-3d-secondary'
			: tone === 'accent'
				? 'border-accent bg-accent text-accent-foreground shadow-3d-accent'
				: 'border-primary bg-primary text-primary-foreground shadow-3d-primary'
	);
	const metricClass = $derived(
		tone === 'secondary'
			? 'bg-secondary/20 text-secondary-foreground'
			: tone === 'accent'
				? 'bg-accent/10 text-accent-foreground'
				: 'bg-primary/10 text-primary'
	);
</script>

<article
	class={cn(
		'shadow-3d-sm hover:shadow-3d-lg min-w-0 overflow-hidden rounded-3xl border-2 bg-background p-4 transition-all duration-300',
		compact ? 'min-h-0' : 'h-full min-h-[238px]'
	)}
>
	<div class="flex items-start justify-between gap-3">
		<div class={cn('grid size-11 shrink-0 place-items-center rounded-2xl border-2', iconClass)}>
			<Icon class="size-5" />
		</div>

		<span class="rounded-full border-2 bg-muted/40 px-3 py-1 text-xs font-bold">
			{item.status}
		</span>
	</div>

	<div class="mt-4">
		<h3 class="text-lg leading-tight font-bold">{item.title}</h3>
		<p class="mt-1 text-sm font-bold text-primary">{item.subtitle}</p>
		<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{item.caption}</p>
	</div>

	{#if item.metrics?.length}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each item.metrics as metric (metric)}
				<span
					class={cn('rounded-xl border-2 bg-background px-2 py-1 text-xs font-bold', metricClass)}
				>
					{metric}
				</span>
			{/each}
		</div>
	{/if}
</article>
