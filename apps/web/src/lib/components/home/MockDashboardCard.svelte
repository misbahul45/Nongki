<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		title,
		metrics = [],
		class: className,
		children
	}: {
		title: string;
		metrics?: { label: string; value: string }[];
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<Card class={cn('shadow-3d-lg rounded-3xl border-2', className)}>
	<CardHeader>
		<CardTitle>{title}</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		{#if metrics.length}
			<div class="grid grid-cols-2 gap-2">
				{#each metrics as metric (metric.label)}
					<div class="rounded-2xl border-2 bg-background p-3">
						<p class="text-xs text-muted-foreground">{metric.label}</p>
						<p class="mt-1 text-lg font-bold">{metric.value}</p>
					</div>
				{/each}
			</div>
		{/if}
		{@render children?.()}
	</CardContent>
</Card>
