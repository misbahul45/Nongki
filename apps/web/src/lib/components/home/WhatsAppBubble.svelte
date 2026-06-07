<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		variant = 'incoming',
		time,
		children
	}: {
		variant?: 'incoming' | 'outgoing' | 'system' | 'alert' | 'success';
		time?: string;
		children: Snippet;
	} = $props();

	const variantClass = $derived(
		variant === 'outgoing'
			? 'ml-auto bg-primary text-primary-foreground border-primary shadow-[0_3px_0_0_var(--shadow-3d-primary)]'
			: variant === 'system'
				? 'mx-auto bg-muted text-muted-foreground border-border shadow-none'
				: variant === 'alert'
					? 'bg-destructive/10 text-destructive border-destructive/30'
					: variant === 'success'
						? 'bg-secondary/20 text-foreground border-secondary/50'
						: 'bg-background text-foreground border-border shadow-[0_3px_0_0_var(--shadow-3d)]'
	);
</script>

<div class={cn('max-w-[86%] rounded-2xl border-2 px-3 py-2 text-xs leading-relaxed', variantClass)}>
	<div>{@render children()}</div>
	{#if time}
		<div class="mt-1 text-right text-[10px] opacity-60">{time}</div>
	{/if}
</div>
