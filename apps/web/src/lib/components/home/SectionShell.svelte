<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		id,
		variant = 'default',
		class: className,
		innerClass,
		children
	}: {
		id?: string;
		variant?: 'default' | 'muted' | 'soft' | 'primary' | 'dark';
		class?: string;
		innerClass?: string;
		children: Snippet;
	} = $props();

	const variantClass = $derived(
		variant === 'muted'
			? 'bg-muted/40 text-foreground'
			: variant === 'soft'
				? 'bg-primary/5 text-foreground'
				: variant === 'primary'
					? 'bg-primary text-primary-foreground'
					: variant === 'dark'
						? 'bg-foreground text-background'
						: 'bg-background text-foreground'
	);
</script>

<section {id} class={cn('relative overflow-hidden py-20 md:py-28', variantClass, className)}>
	<div class={cn('mx-auto w-full max-w-7xl px-4', innerClass)}>
		{@render children()}
	</div>
</section>
