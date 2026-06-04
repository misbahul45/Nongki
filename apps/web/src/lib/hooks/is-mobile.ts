import { browser } from "$app/environment";

export const useIsMobile = () => {
	if (!browser) return false;

	return window.matchMedia("(max-width: 768px)").matches;
};