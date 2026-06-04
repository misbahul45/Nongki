<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "min-h-6 gap-1 rounded-full border-2 border-transparent px-2.5 py-0.5 text-xs font-bold transition-all has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:size-3! focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:ring-[3px] [&>svg]:pointer-events-none",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground border-primary shadow-[0_2px_0_0_var(--shadow-3d-primary)] [a]:hover:brightness-105",
				secondary: "bg-secondary text-secondary-foreground border-secondary shadow-[0_2px_0_0_var(--shadow-3d-secondary)] [a]:hover:brightness-105",
				destructive: "bg-destructive text-white border-destructive shadow-[0_2px_0_0_var(--shadow-3d-destructive)] [a]:hover:brightness-105 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline: "border-border text-foreground shadow-[0_2px_0_0_var(--shadow-3d)] [a]:hover:bg-muted [a]:hover:text-muted-foreground",
				ghost: "border-transparent hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
				link: "border-transparent text-primary underline-offset-4 hover:underline",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
