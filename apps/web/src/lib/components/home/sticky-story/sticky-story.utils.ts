import type { VisualType } from '$lib/constants/home/landingPage';
import { cn } from '$lib/utils';

export function getStoryCardClass(index: number) {
	const tone =
		index % 6 === 1
			? 'bg-secondary/10'
			: index % 6 === 3
				? 'bg-accent/10'
				: index % 6 === 5
					? 'bg-primary/10'
					: 'bg-background';
	const hover =
		index % 4 === 0
			? 'hover:-translate-y-1 hover:scale-[1.01]'
			: index % 4 === 1
				? 'hover:-translate-y-1 hover:shadow-[0_12px_0_0_var(--shadow-3d)]'
				: index % 4 === 2
					? 'hover:-translate-y-1 hover:border-primary/60'
					: 'hover:-translate-y-1 hover:-rotate-1';

	return cn(
		'shadow-3d-lg group flex min-h-[320px] transform-gpu flex-col rounded-3xl border-2 p-6 transition-all duration-300 xl:min-h-[360px]',
		tone,
		hover
	);
}

export function getStoryVisualClass(type?: VisualType) {
	return cn(
		'min-h-[150px] rounded-2xl border-2 p-4',
		type === 'chat' || type === 'digest'
			? 'bg-secondary/20'
			: type === 'bot' || type === 'approval'
				? 'bg-primary/10'
				: type === 'profile'
					? 'bg-accent/10'
					: 'bg-muted/60'
	);
}

export function isScrollableDown(panel: HTMLElement) {
	return Math.ceil(panel.scrollTop + panel.clientHeight) < panel.scrollHeight;
}

export function isScrollableUp(panel: HTMLElement) {
	return panel.scrollTop > 0;
}

export function isAtBottom(panel: HTMLElement) {
	return Math.ceil(panel.scrollTop + panel.clientHeight) >= panel.scrollHeight;
}

export function isAtTop(panel: HTMLElement) {
	return panel.scrollTop <= 0;
}
