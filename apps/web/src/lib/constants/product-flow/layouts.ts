import type { ProductFlowLayoutNode } from '$lib/components/product/flow/product-flow.types';

export const productFlowViewBox = '0 0 1000 560';

export const productFlowMinHeightClass = 'min-h-[560px]';

export const productFlowLayout3x2 = [
	{
		id: 'node-1',
		className: 'top-[7%] left-[2%] w-[24%]'
	},
	{
		id: 'node-2',
		className: 'top-[7%] left-[38%] w-[24%]'
	},
	{
		id: 'node-3',
		className: 'top-[7%] right-[2%] w-[24%]'
	},
	{
		id: 'node-4',
		className: 'right-[2%] bottom-[7%] w-[24%]'
	},
	{
		id: 'node-5',
		className: 'bottom-[7%] left-[38%] w-[24%]'
	},
	{
		id: 'node-6',
		className: 'bottom-[7%] left-[2%] w-[24%]'
	}
] as const satisfies readonly ProductFlowLayoutNode[];

export const productFlowLayout3x2ClassByIndex = productFlowLayout3x2.map((item) => item.className);
