export const productFlowAnimationConfig = {
	observerThreshold: [0, 0.25, 0.32, 0.5],
	playRatio: 0.32,
	node: {
		from: {
			opacity: 0,
			y: 18,
			scale: 0.96
		},
		to: {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.34
		},
		firstDuration: 0.35,
		stagger: 0.12
	},
	dot: {
		from: {
			opacity: 0,
			scale: 0.35,
			transformOrigin: 'center'
		},
		to: {
			opacity: 1,
			scale: 1,
			duration: 0.14
		}
	},
	head: {
		from: {
			opacity: 0,
			scale: 0.4,
			transformOrigin: 'center'
		},
		to: {
			opacity: 1,
			scale: 1,
			duration: 0.14
		}
	},
	label: {
		from: {
			opacity: 0,
			y: 6,
			scale: 0.96
		},
		to: {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.18
		}
	},
	path: {
		defaultDuration: 0.54,
		verticalDuration: 0.68
	},
	overlap: {
		dot: '-=0.02',
		path: '-=0.01',
		head: '-=0.1',
		label: '-=0.2',
		nextNode: '-=0.08'
	},
	ease: 'power2.out'
} as const;
