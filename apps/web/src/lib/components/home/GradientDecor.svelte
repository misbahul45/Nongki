<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		variant = 'hero',
		class: className
	}: {
		variant?: 'hero' | 'none';
		class?: string;
	} = $props();

	const baseClass = 'pointer-events-none absolute inset-0 -z-10 overflow-hidden';
</script>

{#if variant !== 'none'}
	<div aria-hidden="true" class={cn(baseClass, className)}>
		<div class="absolute top-8 -left-28 size-80 rounded-full bg-secondary/20 blur-3xl"></div>
		<div class="absolute top-20 -right-28 size-96 rounded-full bg-primary/15 blur-3xl"></div>
		<div class="absolute bottom-0 left-1/3 size-72 rounded-full bg-accent/10 blur-3xl"></div>
	</div>
{/if}
