export const productFlowConnector3x2Template = [
	{
		id: 'connector-1',
		fromIndex: 0,
		toIndex: 1,
		path: 'M 272 86 L 376 86',
		dot: { x: 272, y: 86 },
		head: { x: 376, y: 86, rotate: 0 },
		tone: 'secondary'
	},
	{
		id: 'connector-2',
		fromIndex: 1,
		toIndex: 2,
		path: 'M 622 86 L 726 86',
		dot: { x: 622, y: 86 },
		head: { x: 726, y: 86, rotate: 0 },
		tone: 'primary'
	},
	{
		id: 'connector-3',
		fromIndex: 2,
		toIndex: 3,
		path: 'M 864 232 L 864 328',
		dot: { x: 864, y: 232 },
		head: { x: 864, y: 328, rotate: 90 },
		tone: 'accent'
	},
	{
		id: 'connector-4',
		fromIndex: 3,
		toIndex: 4,
		path: 'M 726 474 L 622 474',
		dot: { x: 726, y: 474 },
		head: { x: 622, y: 474, rotate: 180 },
		tone: 'secondary'
	},
	{
		id: 'connector-5',
		fromIndex: 4,
		toIndex: 5,
		path: 'M 376 474 L 272 474',
		dot: { x: 376, y: 474 },
		head: { x: 272, y: 474, rotate: 180 },
		tone: 'primary'
	}
] as const;
