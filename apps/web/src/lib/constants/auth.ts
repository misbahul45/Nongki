export const authCopy = {
	register: {
		eyebrow: 'Mulai dengan Nongki',
		title: 'Buat workspace WhatsApp CRM pertamamu.',
		description:
			'Daftarkan bisnis F&B kamu, siapkan Ningki, lalu mulai ubah chat pelanggan menjadi data dan action.',
		submitLabel: 'Buat Akun Demo',
		footerText: 'Sudah punya akun?',
		footerLinkLabel: 'Masuk',
		footerHref: '/auth/login',
		highlights: [
			'Workspace bisnis otomatis dibuat',
			'Onboarding siap dilanjutkan',
			'Ningki default agent disiapkan'
		]
	},
	login: {
		eyebrow: 'Masuk ke Nongki',
		title: 'Lanjutkan mengelola chat pelangganmu.',
		description:
			'Masuk ke dashboard untuk melihat inbox WhatsApp CRM, Customer 360, order, pembayaran, dan owner digest.',
		submitLabel: 'Masuk Demo',
		footerText: 'Belum punya akun?',
		footerLinkLabel: 'Daftar',
		footerHref: '/auth/register',
		highlights: ['Inbox CRM', 'Customer 360', 'Order & QRIS', 'Owner dashboard']
	}
};

export const demoAuthStorageKey = 'nongki_demo_auth_user';

export type DemoAuthUser = {
	id: string;
	name: string;
	email: string;
	businessName: string;
	businessType: string;
	createdAt: string;
};

export const businessTypeOptions = [
	{ value: 'coffee_shop', label: 'Coffee Shop' },
	{ value: 'cafe_resto', label: 'Cafe / Resto' },
	{ value: 'bakery_dessert', label: 'Bakery / Dessert' },
	{ value: 'cloud_kitchen', label: 'Cloud Kitchen' },
	{ value: 'other_fnb', label: 'UMKM F&B Lainnya' }
];
