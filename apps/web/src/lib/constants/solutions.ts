import {
	Bot,
	CalendarCheck,
	CheckCircle2,
	Coffee,
	ContactRound,
	CreditCard,
	LayoutDashboard,
	MessageCircle,
	Send,
	Sparkles,
	Store,
	TrendingUp,
	Users,
	Utensils
} from '@lucide/svelte';
import type { Component } from 'svelte';

export type SolutionSlug = 'coffee-shop' | 'cafe-resto' | 'umkm-fnb';
export type SolutionMockupType = 'coffee' | 'cafeResto' | 'umkm';

export type SolutionPageData = {
	slug: SolutionSlug;
	eyebrow: string;
	title: string;
	description: string;
	icon: Component;
	mockupType: SolutionMockupType;
	primaryCta: { label: string; href: string };
	secondaryCta: { label: string; href: string };
	pains: {
		title: string;
		description: string;
		items: { title: string; description: string }[];
	};
	workflow: {
		title: string;
		description: string;
		steps: { title: string; description: string }[];
	};
	featureStack: {
		title: string;
		description: string;
		items: { title: string; description: string; href: string; icon: Component }[];
	};
	scenarios: {
		title: string;
		description: string;
		items: { title: string; description: string; steps: string[] }[];
	};
	outcomes: {
		title: string;
		description: string;
		items: { value: string; label: string; description: string }[];
	};
	related: { title: string; description: string; href: string }[];
};

const defaultCta = {
	primaryCta: { label: 'Mulai Gratis', href: '/auth/register' },
	secondaryCta: { label: 'Lihat Produk', href: '/product' }
};

export const solutionPages: Record<SolutionSlug, SolutionPageData> = {
	'coffee-shop': {
		...defaultCta,
		slug: 'coffee-shop',
		eyebrow: 'Solution for Coffee Shop',
		title: 'Bantu coffee shop membalas chat, follow-up customer, dan membaca pola menu.',
		description:
			'Nongki membantu coffee shop yang menerima pertanyaan menu, promo harian, jam buka, repeat order, dan customer yang hampir checkout tapi menghilang.',
		icon: Coffee,
		mockupType: 'coffee',
		pains: {
			title: 'Chat coffee shop ramai, tapi banyak peluang hilang.',
			description:
				'Nongki membantu owner melihat sinyal dari chat harian tanpa harus membaca percakapan satu per satu.',
			items: [
				{
					title: 'Pertanyaan menu berulang',
					description: 'Menu, harga, jam buka, dan promo sering ditanyakan setiap hari.'
				},
				{
					title: 'Customer hilang sebelum checkout',
					description: 'Customer tanya promo atau harga, lalu tidak lanjut order.'
				},
				{
					title: 'Pola menu sulit dibaca',
					description: 'Owner tidak tahu menu apa yang paling sering ditanyakan.'
				},
				{
					title: 'Repeat customer mulai pasif',
					description: 'Pelanggan lama berhenti order tanpa terdeteksi lebih awal.'
				}
			]
		},
		workflow: {
			title: 'Dari chat menu sampai follow-up customer.',
			description:
				'Chat WhatsApp berubah menjadi profil customer, sinyal lost order, dan draft action untuk owner.',
			steps: [
				{ title: 'Customer tanya menu/promo', description: 'Pertanyaan masuk dari WhatsApp.' },
				{ title: 'Ningki membalas', description: 'Jawaban mengikuti knowledge coffee shop.' },
				{ title: 'Minat tercatat', description: 'Interest masuk ke Customer 360.' },
				{
					title: 'Lost opportunity ditandai',
					description: 'Customer yang hilang sebelum checkout terlihat.'
				},
				{
					title: 'Owner menerima digest',
					description: 'Insight dan rekomendasi action diringkas.'
				},
				{ title: 'Owner approve action', description: 'Follow-up atau promo tetap direview owner.' }
			]
		},
		featureStack: {
			title: 'Modul yang paling sering dipakai coffee shop.',
			description: 'Fokusnya menjawab cepat, membaca minat customer, dan menjaga repeat order.',
			items: [
				{
					title: 'AI Agent',
					description: 'Balas FAQ menu, promo, dan jam buka.',
					href: '/product/ai-agent',
					icon: Bot
				},
				{
					title: 'Customer 360',
					description: 'Minat dan histori customer tersusun dari chat.',
					href: '/product/customer-360',
					icon: ContactRound
				},
				{
					title: 'Lost Order Reminder',
					description: 'Tandai customer yang tertarik tapi belum checkout.',
					href: '/features/reminder',
					icon: CalendarCheck
				},
				{
					title: 'Owner Dashboard',
					description: 'Lihat menu yang sering ditanya dan customer prioritas.',
					href: '/product/dashboard',
					icon: LayoutDashboard
				},
				{
					title: 'QRIS Payment',
					description: 'Bantu pembayaran order saat customer siap checkout.',
					href: '/product/qris-payment',
					icon: CreditCard
				}
			]
		},
		scenarios: {
			title: 'Skenario harian coffee shop.',
			description: 'Nongki bekerja dari chat yang memang sudah terjadi setiap hari.',
			items: [
				{
					title: 'Customer tanya menu non-coffee',
					description: 'Pertanyaan menu jadi sinyal produk yang sedang dicari.',
					steps: ['Customer chat', 'AI reply', 'Interest tercatat', 'Owner lihat insight']
				},
				{
					title: 'Customer tanya harga lalu hilang',
					description: 'Peluang yang berhenti di tengah jalan tidak ikut tenggelam.',
					steps: ['Tanya harga', 'Belum checkout', 'Lost order detected', 'Owner approve']
				},
				{
					title: 'Repeat customer mulai pasif',
					description: 'Owner bisa menindaklanjuti customer lama sebelum benar-benar hilang.',
					steps: ['Histori dibaca', 'Customer at-risk', 'Digest owner', 'Campaign draft']
				}
			]
		},
		outcomes: {
			title: 'Hasil yang terasa untuk owner.',
			description: 'Bukan klaim angka, tapi workflow yang lebih mudah dipantau.',
			items: [
				{
					value: 'Lebih cepat',
					label: 'FAQ terjawab',
					description: 'Menu dan jam buka bisa dijawab otomatis.'
				},
				{
					value: 'Lebih rapi',
					label: 'Customer repeat tercatat',
					description: 'Profil customer terbentuk dari chat.'
				},
				{
					value: 'Lebih terlihat',
					label: 'Menu populer muncul',
					description: 'Lost order dan produk yang sering ditanya masuk dashboard.'
				}
			]
		},
		related: [
			{
				title: 'Cafe & Resto',
				description: 'Untuk reservasi, order, komplain, dan pelanggan loyal.',
				href: '/solutions/cafe-resto'
			},
			{
				title: 'UMKM F&B',
				description: 'Untuk bakery, dessert, cloud kitchen, dan repeat order.',
				href: '/solutions/umkm-fnb'
			}
		]
	},
	'cafe-resto': {
		...defaultCta,
		slug: 'cafe-resto',
		eyebrow: 'Solution for Cafe & Resto',
		title: 'Kelola reservasi, order, komplain, dan campaign loyal customer dari WhatsApp.',
		description:
			'Nongki cocok untuk kafe dan resto yang banyak menerima reservasi, pertanyaan jam buka, order, komplain, paket keluarga, dan campaign pelanggan loyal.',
		icon: Utensils,
		mockupType: 'cafeResto',
		pains: {
			title: 'Resto butuh response cepat dan alur order yang tidak tercecer.',
			description:
				'Nongki membantu merapikan intent pelanggan, draft order, histori, dan action owner.',
			items: [
				{
					title: 'Reservasi perlu tanya ulang',
					description: 'Tanggal, jam, dan jumlah orang sering belum lengkap.'
				},
				{
					title: 'Order tercecer di chat',
					description: 'Detail order bisa tertumpuk percakapan lain.'
				},
				{
					title: 'Komplain tidak terdokumentasi',
					description: 'Masukan pelanggan sulit dilacak sebagai histori.'
				},
				{
					title: 'Customer loyal sulit terlihat',
					description: 'Owner perlu tahu pelanggan aktif dan yang mulai pasif.'
				}
			]
		},
		workflow: {
			title: 'Dari reservasi masuk sampai customer tercatat.',
			description:
				'Detail pelanggan dikumpulkan bertahap, lalu tersimpan sebagai histori yang bisa ditindaklanjuti.',
			steps: [
				{ title: 'Customer chat', description: 'Reservasi, order, atau komplain masuk.' },
				{ title: 'Intent dibaca', description: 'Ningki mengumpulkan detail yang dibutuhkan.' },
				{ title: 'Draft dibuat', description: 'Order atau reservasi siap direview admin.' },
				{ title: 'QRIS diterbitkan', description: 'Pembayaran bisa dibuat jika perlu.' },
				{
					title: 'Histori diperbarui',
					description: 'Customer 360 menyimpan status dan aktivitas.'
				},
				{
					title: 'Owner menerima ringkasan',
					description: 'Insight dan rekomendasi action masuk ke dashboard.'
				}
			]
		},
		featureStack: {
			title: 'Modul untuk operasional kafe dan resto.',
			description: 'Fokusnya merapikan reservasi, order, pembayaran, dan customer loyal.',
			items: [
				{
					title: 'Order & Reservation',
					description: 'Buat draft order dan reservasi dari chat.',
					href: '/product/order-reservation',
					icon: CalendarCheck
				},
				{
					title: 'QRIS Payment',
					description: 'Hubungkan order dengan pembayaran QRIS.',
					href: '/product/qris-payment',
					icon: CreditCard
				},
				{
					title: 'WhatsApp CRM',
					description: 'Percakapan pelanggan masuk ke inbox yang rapi.',
					href: '/product/whatsapp-crm',
					icon: MessageCircle
				},
				{
					title: 'Customer 360',
					description: 'Histori order, reservasi, dan komplain tersimpan.',
					href: '/product/customer-360',
					icon: ContactRound
				},
				{
					title: 'Human Takeover',
					description: 'Admin mengambil alih percakapan sensitif.',
					href: '/features/human-takeover',
					icon: Users
				}
			]
		},
		scenarios: {
			title: 'Skenario harian cafe dan resto.',
			description: 'Workflow tetap humanis, owner dan admin masih bisa approve.',
			items: [
				{
					title: 'Reservasi meja',
					description: 'Detail booking dikumpulkan sebelum admin proses.',
					steps: ['Tanya slot', 'Kumpulkan tanggal/jam/pax', 'Draft reservasi', 'Admin approve']
				},
				{
					title: 'Order keluarga',
					description: 'Order dari chat bisa lanjut ke payment yang tervalidasi.',
					steps: ['Customer order', 'Total dibuat', 'QRIS dikirim', 'Owner notified']
				},
				{
					title: 'Komplain pelanggan',
					description: 'Percakapan penting tidak hilang sebagai chat biasa.',
					steps: ['Komplain masuk', 'Chat ditandai', 'Human takeover', 'Histori tersimpan']
				}
			]
		},
		outcomes: {
			title: 'Operasional lebih mudah dipantau.',
			description: 'Owner mendapat ringkasan, admin tetap punya kendali.',
			items: [
				{
					value: 'Reservasi rapi',
					label: 'Detail booking lengkap',
					description: 'Admin tidak perlu mulai dari nol.'
				},
				{
					value: 'Payment jelas',
					label: 'Order bisa lanjut QRIS',
					description: 'Status paid membantu proses berikutnya.'
				},
				{
					value: 'Customer loyal terlihat',
					label: 'Histori tersusun',
					description: 'Engagement dan order masuk ke Customer 360.'
				}
			]
		},
		related: [
			{
				title: 'Coffee Shop',
				description: 'Untuk menu, promo harian, dan repeat customer.',
				href: '/solutions/coffee-shop'
			},
			{
				title: 'UMKM F&B',
				description: 'Untuk bisnis F&B kecil yang jualan lewat chat.',
				href: '/solutions/umkm-fnb'
			}
		]
	},
	'umkm-fnb': {
		...defaultCta,
		slug: 'umkm-fnb',
		eyebrow: 'Solution for UMKM F&B',
		title: 'Satu sistem WhatsApp CRM untuk bakery, dessert, cloud kitchen, dan F&B kecil.',
		description:
			'Nongki membantu UMKM F&B yang menjual lewat chat: repeat order, produk seasonal, reminder pelanggan, promo harian, dan pembayaran QRIS.',
		icon: Store,
		mockupType: 'umkm',
		pains: {
			title: 'UMKM F&B butuh sistem ringan, bukan CRM yang rumit.',
			description:
				'Nongki membuat data customer terbentuk dari chat, tanpa input manual yang membebani owner.',
			items: [
				{
					title: 'Owner sibuk operasional',
					description: 'Tidak sempat input CRM manual setelah melayani order.'
				},
				{
					title: 'Repeat order lupa di-follow-up',
					description: 'Pelanggan lama sering lewat tanpa reminder.'
				},
				{
					title: 'Produk seasonal tidak terbaca',
					description: 'Pertanyaan pelanggan belum menjadi insight produk.'
				},
				{ title: 'Payment belum rapi', description: 'Pembayaran dan status order belum terhubung.' }
			]
		},
		workflow: {
			title: 'Dari chat harian menjadi data dan action.',
			description:
				'Nongki membantu UMKM F&B mengubah percakapan menjadi follow-up, order, payment, dan digest owner.',
			steps: [
				{
					title: 'Customer tanya produk',
					description: 'Pertanyaan promo atau menu masuk dari WhatsApp.'
				},
				{ title: 'Minat dicatat', description: 'Ningki menjawab dan menyimpan interest customer.' },
				{ title: 'Order dibuat', description: 'Jika lanjut, detail order dikumpulkan.' },
				{ title: 'QRIS diterbitkan', description: 'Payment bisa dibuat dan dipantau.' },
				{ title: 'Dashboard diperbarui', description: 'Customer 360 dan insight ikut berubah.' },
				{ title: 'Owner menerima action', description: 'Rekomendasi follow-up siap direview.' }
			]
		},
		featureStack: {
			title: 'Modul ringan untuk UMKM F&B.',
			description: 'Mulai dari chat, profil customer, campaign draft, sampai pembayaran.',
			items: [
				{
					title: 'WhatsApp CRM',
					description: 'Rapikan percakapan penjualan harian.',
					href: '/product/whatsapp-crm',
					icon: MessageCircle
				},
				{
					title: 'AI Agent',
					description: 'Bantu jawab pertanyaan produk dan promo.',
					href: '/product/ai-agent',
					icon: Bot
				},
				{
					title: 'Customer 360',
					description: 'Repeat customer tercatat otomatis.',
					href: '/product/customer-360',
					icon: ContactRound
				},
				{
					title: 'Campaign Draft',
					description: 'Draft promo dan reminder bisa direview owner.',
					href: '/features/automation-flow',
					icon: Send
				},
				{
					title: 'QRIS Payment',
					description: 'Order chat bisa lanjut ke payment.',
					href: '/product/qris-payment',
					icon: CreditCard
				}
			]
		},
		scenarios: {
			title: 'Skenario untuk bakery, dessert, dan cloud kitchen.',
			description: 'Cocok untuk bisnis yang transaksi utamanya terjadi lewat chat.',
			items: [
				{
					title: 'Bakery repeat order',
					description: 'Customer lama bisa diingatkan tanpa input manual.',
					steps: ['Pernah beli', 'Histori dibaca', 'Reminder follow-up', 'Owner approve']
				},
				{
					title: 'Dessert seasonal promo',
					description: 'Produk seasonal yang ramai ditanya bisa jadi draft campaign.',
					steps: ['Banyak tanya', 'Insight muncul', 'Draft promo', 'Owner approve']
				},
				{
					title: 'Cloud kitchen order',
					description: 'Order dari chat terhubung ke payment dan dashboard.',
					steps: ['Order chat', 'Detail dikumpulkan', 'QRIS dibuat', 'Dashboard update']
				}
			]
		},
		outcomes: {
			title: 'Sistem lebih ringan untuk owner.',
			description: 'Nongki membantu owner jualan tanpa memaksa tim belajar CRM rumit.',
			items: [
				{
					value: 'Lebih ringan',
					label: 'CRM dari chat',
					description: 'Data customer terbentuk tanpa input manual.'
				},
				{
					value: 'Lebih siap jualan',
					label: 'Promo dan repeat order',
					description: 'Follow-up bisa ditindaklanjuti.'
				},
				{
					value: 'Lebih terukur',
					label: 'Pola chat dan payment',
					description: 'Owner melihat sinyal order dan pembayaran.'
				}
			]
		},
		related: [
			{
				title: 'Coffee Shop',
				description: 'Untuk menu, promo, dan pelanggan repeat.',
				href: '/solutions/coffee-shop'
			},
			{
				title: 'Cafe & Resto',
				description: 'Untuk reservasi, order, komplain, dan QRIS.',
				href: '/solutions/cafe-resto'
			}
		]
	}
};
