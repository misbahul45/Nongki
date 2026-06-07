// src/lib/constants/footer.ts

export const footerBrand = {
	name: 'Nongki',
	description:
		'AI WhatsApp CRM untuk membantu UMKM F&B mengubah chat pelanggan menjadi data, insight, dan action.',
	tagline: 'Chat → Data → Insight → Action'
};

export const footerCta = {
	title: 'Siap membuat WhatsApp bisnismu bekerja lebih pintar?',
	description:
		'Mulai dari auto-reply, Customer 360, owner digest, sampai campaign approval.',
	primaryAction: {
		label: 'Mulai Gratis',
		href: '/auth/register'
	},
	secondaryAction: {
		label: 'Lihat Demo',
		href: '#cara-kerja'
	}
};

export const footerNavigationGroups = [
	{
		title: 'Produk',
		links: [
			{ label: 'WhatsApp CRM', href: '/product/whatsapp-crm' },
			{ label: 'AI Agent', href: '/product/ai-agent' },
			{ label: 'Customer 360', href: '/product/customer-360' },
			{ label: 'QRIS Payment', href: '/product/qris-payment' },
			{ label: 'Dashboard Owner', href: '/product/dashboard' }
		]
	},
	{
		title: 'Fitur',
		links: [
			{ label: 'AI Reply', href: '/features/ai-reply' },
			{ label: 'Inbox CRM', href: '/features/inbox-crm' },
			{ label: 'Automation Flow', href: '/features/automation-flow' },
			{ label: 'Knowledge Base', href: '/features/knowledge-base' },
			{ label: 'Human Takeover', href: '/features/human-takeover' }
		]
	},
	{
		title: 'Workflow',
		links: [
			{ label: 'Customer Chat', href: '/workflow/customer-chat' },
			{ label: 'Order Reservation', href: '/workflow/order-reservation' },
			{ label: 'QRIS Webhook', href: '/workflow/qris-webhook' },
			{ label: 'Connect WhatsApp', href: '/workflow/connect-whatsapp' },
			{ label: 'Upload Knowledge', href: '/workflow/upload-knowledge' }
		]
	},
	{
		title: 'Solusi',
		links: [
			{ label: 'Coffee Shop', href: '/solutions/coffee-shop' },
			{ label: 'Cafe & Resto', href: '/solutions/cafe-resto' },
			{ label: 'UMKM F&B', href: '/solutions/umkm-fnb' },
			{ label: 'Harga', href: '/pricing' },
			{ label: 'Docs', href: '/docs' }
		]
	}
];

export const footerBottomLinks = [
	{ label: 'Docs', href: '/docs' },
	{ label: 'Harga', href: '/pricing' },
	{ label: 'Masuk', href: '/auth/login' }
];

export const footerPills = ['WhatsApp-first', 'F&B CRM', 'Owner Digest'];