<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		label,
		value,
		class: className,
		children
	}: {
		label?: string;
		value?: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div
	class={cn(
		'shadow-3d-sm inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-3 py-2 text-xs font-bold',
		className
	)}
>
	{#if children}
		{@render children()}
	{:else}
		{#if label}
			<span class="text-muted-foreground">{label}</span>
		{/if}
		{#if value}
			<span>{value}</span>
		{/if}
	{/if}
</div>
