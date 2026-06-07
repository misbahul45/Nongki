import type { ProductFlowCanvasData, ProductFlowTone } from './product-flow.types';

export function iconToneClass(tone: ProductFlowTone = 'primary') {
	if (tone === 'secondary') return 'bg-secondary text-secondary-foreground';
	if (tone === 'accent') return 'bg-accent text-accent-foreground';
	if (tone === 'muted') return 'bg-muted text-foreground';
	return 'bg-primary text-primary-foreground';
}

export function metricToneClass(tone: ProductFlowTone = 'primary') {
	if (tone === 'secondary') return 'bg-secondary/20 text-foreground';
	if (tone === 'accent') return 'bg-accent/10 text-accent';
	if (tone === 'muted') return 'bg-muted/60 text-foreground';
	return 'bg-primary/10 text-primary';
}

export function strokeToneClass(tone: ProductFlowTone = 'primary') {
	if (tone === 'secondary') return 'stroke-secondary';
	if (tone === 'accent') return 'stroke-accent';
	if (tone === 'muted') return 'stroke-muted-foreground';
	return 'stroke-primary';
}

export function fillToneClass(tone: ProductFlowTone = 'primary') {
	if (tone === 'secondary') return 'fill-secondary';
	if (tone === 'accent') return 'fill-accent';
	if (tone === 'muted') return 'fill-muted-foreground';
	return 'fill-primary';
}

export function flowLabelStyle(flow: ProductFlowCanvasData, x: number, y: number) {
	const [, , width = '1000', height = '760'] = flow.viewBox.split(' ');
	const left = (x / Number(width)) * 100;
	const top = (y / Number(height)) * 100;

	return `left:${left}%;top:${top}%;`;
}
