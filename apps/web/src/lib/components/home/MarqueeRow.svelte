<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		items,
		direction = 'left',
		speed = 'normal',
		class: className
	}: {
		items: string[];
		direction?: 'left' | 'right';
		speed?: 'slow' | 'normal';
		class?: string;
	} = $props();

	const doubled = $derived([...items, ...items]);
</script>

<div class={cn('overflow-hidden', className)}>
	<div
		class={cn(
			'flex w-max gap-3',
			direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right',
			speed === 'slow' && '[animation-duration:36s]'
		)}
	>
		{#each doubled as item, index (`${item}-${index}`)}
			<div class="shadow-3d-sm rounded-2xl border-2 bg-background px-4 py-2 text-sm font-bold">
				{item}
			</div>
		{/each}
	</div>
</div>
