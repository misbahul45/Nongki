export const landingAnimation = {
	hero: {
		timeline: {
			defaults: {
				duration: 0.8,
				ease: 'back.out(1.35)'
			}
		},
		title: {
			y: 40,
			opacity: 0
		},
		description: {
			y: 28,
			opacity: 0
		},
		cta: {
			y: 24,
			opacity: 0
		},
		mockup: {
			x: 70,
			y: 30,
			opacity: 0,
			scale: 0.9
		},
		float: {
			y: -12,
			duration: 2.8,
			ease: 'sine.inOut',
			repeat: -1,
			yoyo: true
		},
		offsets: {
			description: '-=0.55',
			cta: '-=0.5',
			mockup: '-=0.8'
		}
	},
	revealDefault: {
		y: 24,
		duration: 0.55,
		delay: 0
	},
	revealStagger: {
		y: 24,
		duration: 0.55,
		stepDelay: 0.08
	},
	floatSoft: 'animate-float-soft',
	floatMedium: 'animate-float-medium',
	scrollCarousel: {
		heightClass: 'min-h-[220vh]',
		topClass: 'top-28'
	},
	stickyHorizontal: {
		cardWidth: 460,
		gap: 24
	},
	pulseSoft: 'animate-pulse-soft'
} as const;
