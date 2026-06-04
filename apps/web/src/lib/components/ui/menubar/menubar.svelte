<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.RootProps = $props();
</script>

<MenubarPrimitive.Root
	bind:ref
	data-slot="menubar"
	class={cn("h-11 gap-1 rounded-2xl border-2 p-1.5 shadow-[0_3px_0_0_var(--shadow-3d)] flex items-center", className)}
	{...restProps}
/>
