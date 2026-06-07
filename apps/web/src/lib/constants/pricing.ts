import {
	Bot,
	CheckCircle2,
	CreditCard,
	LayoutDashboard,
	MessageCircle,
	QrCode,
	ShieldCheck,
	Sparkles,
	Store,
	Users,
	Wallet
} from '@lucide/svelte';
import type { Component } from 'svelte';

export type PricingPlanId = 'starter' | 'credit' | 'pro';

export type PricingPlan = {
	id: PricingPlanId;
	name: string;
	eyebrow: string;
	priceLabel: string;
	priceSubtext: string;
	description: string;
	highlighted?: boolean;
	cta: {
		label: string;
		href: string;
		variant: 'primary' | 'outline';
	};
	bestFor: string;
	features: string[];
	limitations?: string[];
	icon: Component;
};

export type PricingCreditPack = {
	name: string;
	label: string;
	description: string;
	usage: string[];
};

export const pricingHero = {
	eyebrow: 'Harga Nongki',
	title: 'Mulai gratis, lalu bayar sesuai pemakaian AI.',
	description:
		'Nongki dirancang untuk UMKM F&B yang sensitif terhadap biaya: coba CRM dasar secara gratis, tambah kredit AI saat bisnis mulai aktif, dan upgrade ke Pro saat butuh multi-outlet.'
};

export const pricingPlans: PricingPlan[] = [
	{
		id: 'starter',
		name: 'Starter',
		eyebrow: 'Free',
		priceLabel: 'Gratis',
		priceSubtext: 'Untuk mencoba loop dasar Nongki',
		description:
			'Paket pintu masuk untuk coffee shop atau UMKM F&B kecil yang ingin mencoba WhatsApp CRM tanpa biaya awal.',
		icon: Store,
		cta: { label: 'Mulai Gratis', href: '/auth/register', variant: 'outline' },
		bestFor: 'UMKM F&B satu outlet yang baru mulai merapikan chat pelanggan.',
		features: [
			'1 nomor WhatsApp bisnis',
			'CRM dasar dari chat pelanggan',
			'Customer 360 dasar',
			'AI reply terbatas per bulan',
			'Knowledge base dasar',
			'Dashboard ringkas'
		],
		limitations: [
			'Kuota AI terbatas',
			'Belum untuk multi-outlet',
			'Insight dan campaign lanjutan memakai kredit AI'
		]
	},
	{
		id: 'credit',
		name: 'Kredit AI',
		eyebrow: 'Pay-as-you-go',
		priceLabel: 'Bayar sesuai pemakaian',
		priceSubtext: 'Top-up lewat AstraPay QRIS',
		description:
			'Model utama Nongki. Owner membeli kredit sesuai kebutuhan, lalu kredit digunakan untuk fitur AI yang lebih aktif.',
		icon: Wallet,
		highlighted: true,
		cta: { label: 'Top-up Kredit Demo', href: '/auth/register', variant: 'primary' },
		bestFor: 'Bisnis yang chat-nya mulai ramai dan ingin memakai AI secara fleksibel.',
		features: [
			'AI reply di atas kuota gratis',
			'Reactive insight',
			'Owner WhatsApp digest',
			'Campaign draft',
			'Follow-up draft',
			'Knowledge-gap processing',
			'Top-up kredit via AstraPay QRIS'
		],
		limitations: [
			'Biaya mengikuti intensitas pemakaian AI',
			'Nominal paket kredit final ditentukan setelah pilot'
		]
	},
	{
		id: 'pro',
		name: 'Pro',
		eyebrow: 'Langganan Opsional',
		priceLabel: 'Coming soon',
		priceSubtext: 'Untuk multi-outlet dan kebutuhan lanjutan',
		description:
			'Paket opsional untuk bisnis yang sudah lebih besar, memiliki beberapa outlet, atau membutuhkan kontrol dan kuota yang lebih besar.',
		icon: LayoutDashboard,
		cta: { label: 'Diskusi Pro', href: '/auth/register', variant: 'outline' },
		bestFor: 'UMKM F&B bertumbuh, multi-cabang, atau bisnis yang butuh advanced analytics.',
		features: [
			'Kuota AI lebih besar',
			'Multi-outlet',
			'Advanced dashboard',
			'Segmentasi dan RFM lebih lengkap',
			'Priority support',
			'Integrasi tambahan'
		],
		limitations: [
			'Detail harga final ditentukan setelah riset pricing',
			'Tidak menjadi fokus utama MVP'
		]
	}
];

export const pricingCreditPacks: PricingCreditPack[] = [
	{
		name: 'AI Reply',
		label: 'Balasan pelanggan',
		description: 'Kredit dipakai saat Ningki menjawab pertanyaan pelanggan di atas kuota gratis.',
		usage: ['FAQ menu', 'promo', 'jam buka', 'order/reservasi']
	},
	{
		name: 'Reactive Insight',
		label: 'Insight bisnis',
		description:
			'Kredit dipakai untuk membaca pola chat, produk sering ditanya, customer pasif, dan lost order.',
		usage: ['hot lead', 'lost order', 'customer at-risk']
	},
	{
		name: 'Campaign Draft',
		label: 'Draft action',
		description:
			'Kredit dipakai ketika AI membuat draft follow-up atau campaign yang tetap menunggu approval owner.',
		usage: ['follow-up', 'campaign', 'owner approval']
	},
	{
		name: 'Owner Digest',
		label: 'Ringkasan owner',
		description: 'Kredit mendukung ringkasan bisnis harian yang dikirim ke WhatsApp owner.',
		usage: ['daily digest', 'action recommendation']
	}
];

export const pricingComparisonRows = [
	{ feature: 'WhatsApp CRM dasar', starter: true, credit: true, pro: true },
	{ feature: 'Customer 360 dasar', starter: true, credit: true, pro: true },
	{ feature: 'AI reply terbatas', starter: true, credit: true, pro: true },
	{ feature: 'AI reply tambahan', starter: false, credit: true, pro: true },
	{ feature: 'Reactive insight', starter: false, credit: true, pro: true },
	{ feature: 'Owner WhatsApp digest', starter: false, credit: true, pro: true },
	{ feature: 'Campaign draft + approval', starter: false, credit: true, pro: true },
	{ feature: 'Multi-outlet', starter: false, credit: false, pro: true },
	{ feature: 'Advanced analytics', starter: false, credit: false, pro: true }
];

export const pricingFaqs = [
	{
		question: 'Apakah Nongki benar-benar gratis untuk mulai?',
		answer:
			'Ya. Starter dibuat sebagai pintu masuk agar UMKM bisa mencoba CRM dasar, Customer 360, dan AI reply terbatas sebelum memakai kredit AI.'
	},
	{
		question: 'Kenapa model utamanya kredit AI?',
		answer:
			'Karena kebutuhan AI tiap bisnis berbeda. Dengan kredit, owner bisa mengontrol biaya sesuai intensitas chat dan fitur AI yang dipakai.'
	},
	{
		question: 'Kredit AI dipakai untuk apa saja?',
		answer:
			'Kredit dipakai untuk AI reply tambahan, reactive insight, campaign draft, owner WhatsApp digest, dan proses AI lain di luar kuota gratis.'
	},
	{
		question: 'Apakah top-up kredit memakai AstraPay QRIS?',
		answer:
			'Ya. Dalam rancangan monetisasi, top-up kredit AI dilakukan lewat AstraPay QRIS agar transaksi tercatat dan tetap familiar untuk UMKM.'
	},
	{
		question: 'Apakah ada paket bulanan?',
		answer:
			'Ada Pro sebagai langganan opsional untuk bisnis yang lebih besar atau multi-outlet. Detail harga final ditentukan setelah pilot dan riset pricing.'
	}
];

export const pricingAstraPay = {
	title: 'Top-up kredit AI lewat AstraPay QRIS.',
	description:
		'Setiap top-up kredit AI dan pembayaran order/reservasi pelanggan menjadi alur QRIS berulang. Ini membuat AstraPay tidak hanya muncul di akhir checkout, tetapi ikut menjadi bagian dari workflow harian UMKM.',
	steps: [
		'Owner memilih nominal kredit',
		'Nongki membuat QRIS AstraPay',
		'Owner membayar lewat QRIS',
		'Webhook memvalidasi pembayaran',
		'Kredit AI aktif dan siap dipakai'
	]
};

export const pricingProofs = [
	{ label: 'Gratis untuk mulai', icon: CheckCircle2 },
	{ label: 'Kredit AI fleksibel', icon: Sparkles },
	{ label: 'Top-up via AstraPay QRIS', icon: QrCode }
];

export const pricingCreditSignals = [
	{ label: 'AI Reply', value: '120', icon: Bot },
	{ label: 'Insight', value: '60', icon: MessageCircle },
	{ label: 'Digest', value: '40', icon: Users },
	{ label: 'Campaign Draft', value: '30', icon: CreditCard }
];

export const pricingTrustNotes = [
	{
		title: 'Kontrol biaya',
		description: 'Owner menentukan kapan top-up dan fitur AI apa yang dipakai.',
		icon: ShieldCheck
	},
	{
		title: 'Tanpa angka final palsu',
		description: 'Nominal paket kredit dan Pro akan dikunci setelah pilot.',
		icon: CheckCircle2
	}
];
