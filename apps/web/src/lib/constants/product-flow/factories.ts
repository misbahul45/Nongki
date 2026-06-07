import type {
	ProductFlowCanvasData,
	ProductFlowConnector,
	ProductFlowNode,
	ProductFlowNodeVariant,
	ProductFlowTone
} from '$lib/components/product/flow/product-flow.types';
import { productFlowConnector3x2Template } from './connectors';
import {
	productFlowLayout3x2,
	productFlowLayout3x2ClassByIndex,
	productFlowMinHeightClass,
	productFlowViewBox
} from './layouts';

export function createProductFlow3x2({
	title,
	description,
	nodes,
	labels = [],
	nodeVariant = 'compact'
}: {
	title?: string;
	description?: string;
	nodes: ProductFlowNode[];
	labels?: string[];
	nodeVariant?: ProductFlowNodeVariant;
}): ProductFlowCanvasData {
	const normalizedNodes = nodes.slice(0, 6);

	const layout = normalizedNodes.map((node, index) => ({
		id: node.id,
		className: productFlowLayout3x2ClassByIndex[index] ?? productFlowLayout3x2[0].className
	}));

	const connectors: ProductFlowConnector[] = productFlowConnector3x2Template
		.slice(0, Math.max(0, normalizedNodes.length - 1))
		.map((connector, index) => ({
			id: connector.id,
			from: normalizedNodes[connector.fromIndex]?.id ?? '',
			to: normalizedNodes[connector.toIndex]?.id ?? '',
			label: labels[index],
			tone: connector.tone as ProductFlowTone,
			path: connector.path,
			dot: connector.dot,
			head: connector.head
		}))
		.filter((connector) => connector.from && connector.to);

	return {
		title,
		description,
		viewBox: productFlowViewBox,
		minHeightClass: productFlowMinHeightClass,
		nodeVariant,
		nodes: normalizedNodes,
		layout,
		connectors
	};
}

export function createProductSimpleGridFlow({
	title,
	description,
	nodes,
	showStepNumber = true
}: {
	title?: string;
	description?: string;
	nodes: ProductFlowNode[];
	showStepNumber?: boolean;
}): ProductFlowCanvasData {
	return {
		title,
		description,
		display: 'simpleGrid',
		nodeVariant: 'titleOnly',
		showStepNumber,
		viewBox: '0 0 1000 420',
		minHeightClass: 'min-h-[420px]',
		nodes: nodes.slice(0, 6),
		layout: [],
		connectors: []
	};
}
