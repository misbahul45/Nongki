<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDown';

	let {
		ref = $bindable(null),
		class: className,
		value,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.YearSelectProps> = $props();
</script>

<span
	class={cn(
		"has-focus:border-primary border-input has-focus:ring-primary/20 relative flex rounded-xl border-2 bg-background shadow-[0_2px_0_0_var(--shadow-3d)] has-focus:ring-2",
		className
	)}
>
	<CalendarPrimitive.YearSelect
		bind:ref
		class="dark:bg-popover dark:text-popover-foreground absolute inset-0 opacity-0"
		{...restProps}
	>
		{#snippet child({ props, yearItems, selectedYearItem })}
			<select {...props} {value}>
				{#each yearItems as yearItem (yearItem.value)}
					<option
						value={yearItem.value}
						selected={value !== undefined
							? yearItem.value === value
							: yearItem.value === selectedYearItem.value}
					>
						{yearItem.label}
					</option>
				{/each}
			</select>
			<span
				class="[&>svg]:text-muted-foreground flex h-(--cell-size) items-center gap-1 rounded-xl ps-3 pe-2 text-sm font-bold select-none [&>svg]:size-3.5"
				aria-hidden="true"
			>
				{yearItems.find((item) => item.value === value)?.label || selectedYearItem.label}
				<CaretDownIcon class={cn("size-4", className)} />
			</span>
		{/snippet}
	</CalendarPrimitive.YearSelect>
</span>
