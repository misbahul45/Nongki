<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-footer"
	class={cn("rounded-b-2xl border-t-2 bg-muted/30 px-5 pt-4 pb-5 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pt-3 group-data-[size=sm]/card:pb-4 flex items-center", className)}
	{...restProps}
>
	{@render children?.()}
</div>
