import type { VisualType } from '$lib/constants/home/landingPage';

export type StickyStoryItem = {
	title: string;
	description: string;
	href: string;
	linkLabel?: string;
	visualType?: VisualType;
};

export type StickyStoryCta = {
	label: string;
	href: string;
};

export type StickyVerticalStoryProps = {
	eyebrow?: string;
	title: string;
	description: string;
	cta?: StickyStoryCta;
	points?: readonly string[];
	items: readonly StickyStoryItem[];
};

export type StickyStoryVisualProps = {
	type?: VisualType;
};

export type StickyStoryCardProps = {
	item: StickyStoryItem;
	index: number;
};
