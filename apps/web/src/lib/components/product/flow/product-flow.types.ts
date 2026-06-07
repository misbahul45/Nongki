import type { Component } from 'svelte';

export type ProductFlowTone = 'primary' | 'secondary' | 'accent' | 'muted';
export type ProductFlowDisplay = 'canvas' | 'simpleGrid';
export type ProductFlowNodeVariant = 'normal' | 'compact' | 'titleOnly';

export type ProductFlowNode = {
	id: string;
	title: string;
	description?: string;
	eyebrow?: string;
	icon?: Component;
	tone?: ProductFlowTone;
	metrics?: string[];
};

export type ProductFlowConnector = {
	id: string;
	from: string;
	to: string;
	label?: string;
	tone?: ProductFlowTone;
	path: string;
	head: {
		x: number;
		y: number;
		rotate: number;
	};
	dot: {
		x: number;
		y: number;
	};
};

export type ProductFlowLayoutNode = {
	id: string;
	className: string;
};

export type ProductFlowCanvasData = {
	title?: string;
	description?: string;
	viewBox: string;
	minHeightClass: string;
	display?: ProductFlowDisplay;
	nodeVariant?: ProductFlowNodeVariant;
	showStepNumber?: boolean;
	nodes: ProductFlowNode[];
	layout: ProductFlowLayoutNode[];
	connectors: ProductFlowConnector[];
};
