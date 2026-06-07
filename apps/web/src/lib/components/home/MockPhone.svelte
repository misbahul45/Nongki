<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		title = 'WhatsApp',
		subtitle = 'online',
		class: className,
		children
	}: {
		title?: string;
		subtitle?: string;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div
	class={cn(
		'rounded-[2rem] border-2 border-border bg-background p-3 shadow-[0_8px_0_0_var(--shadow-3d)]',
		className
	)}
>
	<div class="mx-auto mb-3 h-1.5 w-16 rounded-full bg-foreground/15"></div>
	<div class="overflow-hidden rounded-[1.45rem] border-2 border-border bg-muted/40">
		<div class="flex items-center gap-3 border-b-2 bg-background px-4 py-3">
			<div
				class="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
			>
				N
			</div>
			<div>
				<p class="text-sm leading-none font-bold">{title}</p>
				<p class="mt-1 text-xs text-muted-foreground">{subtitle}</p>
			</div>
		</div>
		<div class="grid min-h-80 gap-2 p-3">
			{@render children()}
		</div>
	</div>
</div>
