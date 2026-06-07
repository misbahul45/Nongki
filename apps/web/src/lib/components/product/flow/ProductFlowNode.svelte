<script lang="ts">
	import { iconToneClass, metricToneClass } from './product-flow.utils';
	import type { ProductFlowNode, ProductFlowNodeVariant } from './product-flow.types';

	let {
		item,
		compact = false,
		variant,
		stepNumber,
		showStepNumber = false
	}: {
		item: ProductFlowNode;
		compact?: boolean;
		variant?: ProductFlowNodeVariant;
		stepNumber?: number;
		showStepNumber?: boolean;
	} = $props();

	const tone = $derived(item.tone ?? 'primary');
	const Icon = $derived(item.icon);
	const currentVariant = $derived(variant ?? (compact ? 'compact' : 'normal'));
	const isTitleOnly = $derived(currentVariant === 'titleOnly');
	const isCompact = $derived(currentVariant === 'compact' || compact || isTitleOnly);
</script>

<div
	class={`shadow-3d-sm hover:shadow-3d-lg rounded-3xl border-2 bg-background transition-all duration-300 hover:-translate-y-1 ${
		isTitleOnly
			? 'flex min-h-[132px] flex-col items-center justify-center p-5 text-center'
			: isCompact
				? 'p-4'
				: 'p-5'
	}`}
>
	{#if isTitleOnly}
		{#if showStepNumber}
			<div
				class="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-primary bg-primary text-sm font-black text-primary-foreground shadow-[0_4px_0_0_var(--shadow-3d-primary)]"
			>
				{String(stepNumber ?? 1).padStart(2, '0')}
			</div>
		{:else}
			<div class={`grid size-12 shrink-0 place-items-center rounded-2xl ${iconToneClass(tone)}`}>
				{#if Icon}
					<Icon class="size-5" />
				{:else}
					<span class="text-sm font-black">{item.title.slice(0, 1)}</span>
				{/if}
			</div>
		{/if}
		<h3 class="mt-4 font-heading text-xl leading-tight font-bold">
			{item.title}
		</h3>
	{:else}
		<div class="flex items-start gap-3">
			<div
				class={`grid shrink-0 place-items-center rounded-2xl ${isCompact ? 'size-10' : 'size-11'} ${iconToneClass(tone)}`}
			>
				{#if Icon}
					<Icon class={isCompact ? 'size-4' : 'size-5'} />
				{:else}
					<span class="text-sm font-black">{item.title.slice(0, 1)}</span>
				{/if}
			</div>

			<div class="min-w-0 flex-1">
				{#if item.eyebrow}
					<p
						class="mb-2 inline-flex rounded-full border-2 bg-muted/40 px-2.5 py-1 text-[11px] font-black text-muted-foreground"
					>
						{item.eyebrow}
					</p>
				{/if}
				<h3 class={`font-heading leading-tight font-bold ${isCompact ? 'text-base' : 'text-xl'}`}>
					{item.title}
				</h3>
			</div>
		</div>

		{#if item.description}
			<p class={`mt-3 leading-relaxed text-muted-foreground ${isCompact ? 'text-sm' : 'text-sm'}`}>
				{item.description}
			</p>
		{/if}

		{#if item.metrics?.length}
			<div class="mt-4 flex flex-wrap gap-2">
				{#each item.metrics as metric (metric)}
					<span class={`rounded-full px-2.5 py-1 text-[11px] font-black ${metricToneClass(tone)}`}>
						{metric}
					</span>
				{/each}
			</div>
		{/if}
	{/if}
</div>
