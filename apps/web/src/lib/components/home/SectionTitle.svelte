<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		eyebrow,
		title,
		description,
		align = 'left',
		inverted = false,
		compact = false,
		class: className
	}: {
		eyebrow?: string;
		title: string;
		description?: string;
		align?: 'left' | 'center';
		inverted?: boolean;
		compact?: boolean;
		class?: string;
	} = $props();
</script>

<div class={cn(align === 'center' && 'mx-auto text-center', className)}>
	{#if eyebrow}
		<p
			class={cn(
				'text-xs font-bold tracking-[0.2em] uppercase',
				inverted ? 'text-primary-foreground/70' : 'text-primary'
			)}
		>
			{eyebrow}
		</p>
	{/if}

	<h2
		class={cn(
			'mt-3 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl',
			!compact && 'lg:text-5xl'
		)}
	>
		{title}
	</h2>

	{#if description}
		<p
			class={cn(
				'mt-4 max-w-2xl text-base leading-relaxed md:text-lg',
				align === 'center' && 'mx-auto',
				inverted ? 'text-primary-foreground/80' : 'text-muted-foreground'
			)}
		>
			{description}
		</p>
	{/if}
</div>
