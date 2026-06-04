<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none outline-none transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 rounded-xl border-2 bg-clip-padding text-xs font-bold tracking-wide focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-2 active:not-aria-[haspopup]:translate-y-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground border-primary shadow-[0_5px_0_0_var(--shadow-3d-primary)] hover:brightness-105 active:not-aria-[haspopup]:shadow-[0_1px_0_0_var(--shadow-3d-primary)]",
				outline: "border-border bg-background text-foreground shadow-[0_5px_0_0_var(--shadow-3d)] hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground active:not-aria-[haspopup]:shadow-[0_1px_0_0_var(--shadow-3d)]",
				secondary: "bg-secondary text-secondary-foreground border-secondary shadow-[0_5px_0_0_var(--shadow-3d-secondary)] hover:brightness-105 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground active:not-aria-[haspopup]:shadow-[0_1px_0_0_var(--shadow-3d-secondary)]",
				ghost: "border-transparent hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
				destructive: "bg-destructive text-white border-destructive shadow-[0_5px_0_0_var(--shadow-3d-destructive)] hover:brightness-105 focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/40 active:not-aria-[haspopup]:shadow-[0_1px_0_0_var(--shadow-3d-destructive)]",
				link: "border-transparent text-primary underline-offset-4 hover:underline active:not-aria-[haspopup]:translate-y-0",
			},
			size: {
				default: "h-11 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
				xs: "h-8 gap-1 rounded-lg px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-13 gap-2 px-6 text-base rounded-2xl has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
				icon: "size-11",
				"icon-xs": "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-9",
				"icon-lg": "size-13 rounded-2xl",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
