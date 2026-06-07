<script lang="ts">
	import ProductFlowNode from './ProductFlowNode.svelte';
	import type {
		ProductFlowNode as ProductFlowNodeData,
		ProductFlowNodeVariant
	} from './product-flow.types';

	let {
		nodes,
		variant = 'compact',
		showStepNumber = false
	}: {
		nodes: ProductFlowNodeData[];
		variant?: ProductFlowNodeVariant;
		showStepNumber?: boolean;
	} = $props();
</script>

<div class="grid gap-4 lg:hidden">
	{#each nodes as item, index (item.id)}
		<ProductFlowNode {item} compact {variant} {showStepNumber} stepNumber={index + 1} />

		{#if index < nodes.length - 1}
			<div class="flex justify-center">
				<div class="flex h-10 flex-col items-center">
					<div class="h-7 w-0.5 rounded-full bg-primary/50"></div>
					<div
						class="size-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-primary"
					></div>
				</div>
			</div>
		{/if}
	{/each}
</div>
