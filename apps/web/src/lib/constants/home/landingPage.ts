import {
	Bot,
	CheckCircle2,
	CreditCard,
	FileText,
	Inbox,
	MessageCircle,
	QrCode,
	Sparkles,
	TrendingUp,
	UserCheck,
	Users,
	Workflow
} from '@lucide/svelte';

export type VisualType =
	| 'chat'
	| 'bot'
	| 'profile'
	| 'chart'
	| 'campaign'
	| 'knowledge'
	| 'payment'
	| 'digest'
	| 'approval'
	| 'order';

export const heroOverview = {
	eyebrow: 'WhatsApp CRM untuk UMKM F&B',
	title: {
		before: 'Ubah chat WhatsApp jadi',
		highlight: 'insight bisnis',
		after: ' dan action otomatis.'
	},
	description:
		'Ningki membantu coffee shop, kafe, dan resto membalas chat pelanggan, mencatat Customer 360, mendeteksi hot lead, menemukan lost order, dan mengirim ringkasan bisnis langsung ke WhatsApp owner.',
	actions: [
		{
			label: 'Coba Sekarang',
			href: '/auth/register',
			variant: 'primary'
		},
		{
			label: 'Lihat Cara Kerja',
			href: '#cara-kerja',
			variant: 'outline'
		}
	],
	productLink: {
		label: 'Lihat produk',
		href: '/product'
	},
	metrics: [
		{ label: 'Chat', value: '12' },
		{ label: 'Order', value: '3' },
		{ label: 'Hot lead', value: '2' }
	],
	floatingPills: ['Hot lead detected', 'QRIS ready', 'Customer 360 updated']
};

export const problemOverview = {
	eyebrow: 'Masalah yang sering terjadi',
	title: 'Chat ramai, tapi peluang bisnis sering lewat begitu saja.',
	description:
		'Banyak UMKM F&B sudah aktif di WhatsApp. Pelanggan bertanya menu, harga, promo, reservasi, dan komplain setiap hari. Masalahnya, setelah chat dibalas, data pentingnya sering tidak tercatat.',
	punchline:
		'Masalahnya bukan kurang chat. Masalahnya, chat belum berubah menjadi data dan action.',
	cta: {
		label: 'Lihat bagaimana Nongki bekerja',
		href: '#cara-kerja'
	},
	inbox: {
		title: 'Inbox WhatsApp Hari Ini',
		footer: '5 sinyal bisnis, belum jadi action.',
		items: [
			{ message: 'Kak menu non-coffee ada?', status: 'belum dianalisis' },
			{ message: 'Bisa reservasi jam 7?', status: 'belum masuk CRM' },
			{ message: 'Harga paket ulang tahun?', status: 'perlu follow-up' },
			{ message: 'Promo hari ini apa?', status: 'pertanyaan berulang' },
			{ message: 'Kak tadi belum checkout', status: 'lost order' }
		]
	},
	cards: [
		{
			title: 'Follow-up terlewat',
			description: 'Customer sudah tanya harga, tapi tidak ada reminder untuk menghubungi lagi.',
			icon: UserCheck
		},
		{
			title: 'Data pelanggan tercecer',
			description: 'Minat, riwayat chat, dan order tidak otomatis menjadi profil pelanggan.',
			icon: Users
		},
		{
			title: 'Pola produk tidak terbaca',
			description: 'Menu yang sering ditanya tidak terlihat sebagai insight bisnis.',
			icon: TrendingUp
		},
		{
			title: 'Owner tetap manual',
			description: 'Owner harus membaca chat satu per satu untuk tahu kondisi harian.',
			icon: Inbox
		}
	]
};

export const reactiveOverview = {
	title: 'Bukan chatbot biasa. Nongki adalah Reactive CRM.',
	description:
		'Chatbot biasa berhenti di jawaban. CRM biasa menunggu input manual. Nongki menghubungkan keduanya: membalas chat, menangkap data, membaca pola, lalu menyarankan action.',
	flow: [
		{
			id: 'chat',
			title: 'Customer Chat',
			subtitle: 'WhatsApp masuk',
			caption: 'Pelanggan tanya menu, harga, promo, atau reservasi.',
			status: 'Input',
			tone: 'secondary',
			metrics: ['12 chat', '5 intent']
		},
		{
			id: 'reply',
			title: 'AI Reply',
			subtitle: 'Jawaban otomatis',
			caption: 'Ningki membalas sesuai knowledge base dan tone brand.',
			status: 'Response',
			tone: 'primary',
			metrics: ['FAQ', 'Order', 'Reservasi']
		},
		{
			id: 'profile',
			title: 'Customer 360',
			subtitle: 'Data terbentuk',
			caption: 'Minat, histori chat, dan status lead otomatis diperbarui.',
			status: 'Data',
			tone: 'accent',
			metrics: ['Lead 87', 'Interest']
		},
		{
			id: 'insight',
			title: 'Reactive Insight',
			subtitle: 'Pola terbaca',
			caption: 'Sistem menemukan hot lead, lost order, dan produk ramai ditanya.',
			status: 'Insight',
			tone: 'secondary',
			metrics: ['2 hot lead', '1 lost']
		},
		{
			id: 'digest',
			title: 'Owner Digest',
			subtitle: 'Ringkasan owner',
			caption: 'Ringkasan harian dikirim langsung ke WhatsApp owner.',
			status: 'Notify',
			tone: 'primary',
			metrics: ['Digest', 'Saran']
		},
		{
			id: 'approval',
			title: 'Owner Approval',
			subtitle: 'Action aman',
			caption: 'AI membuat draft, owner tetap memutuskan sebelum dikirim.',
			status: 'Action',
			tone: 'accent',
			metrics: ['Approve', 'Edit']
		}
	],
	comparisons: [
		{
			title: 'Chatbot biasa',
			description: 'Membalas pertanyaan, tapi tidak membangun database pelanggan.'
		},
		{
			title: 'CRM biasa',
			description: 'Menyimpan data, tapi sering butuh input manual dan jarang dibuka owner.'
		},
		{
			title: 'Ningki Reactive CRM',
			description:
				'Membalas, memahami, mencatat, memberi insight, lalu membantu owner mengambil action.'
		}
	],
	cta: {
		label: 'Pelajari konsep produk',
		href: '/product/whatsapp-crm'
	}
} as const;

export const stickyStorySection = {
	eyebrow: 'Cara kerja',
	title: 'Dari satu chat, Nongki membangun satu loop bisnis.',
	description:
		'Setiap pesan pelanggan bisa menjadi balasan, data pelanggan, insight, dan rekomendasi action. Landing page ini hanya menampilkan gambaran besarnya. Detail teknis tiap alur tersedia di halaman workflow.',
	cta: {
		label: 'Lihat workflow lengkap',
		href: '/workflow/customer-chat'
	},
	points: [
		'Chat dipahami AI',
		'Customer 360 diperbarui',
		'Insight dikirim ke owner',
		'Action menunggu approval'
	],
	items: [
		{
			title: 'Customer mulai dari WhatsApp',
			description:
				'Pelanggan bertanya menu, promo, order, reservasi, atau komplain dari kanal yang sudah mereka pakai.',
			href: '/workflow/customer-chat',
			linkLabel: 'Detail customer chat',
			visualType: 'chat' as VisualType
		},
		{
			title: 'Ningki membalas sesuai knowledge bisnis',
			description:
				'AI menjawab dengan tone brand dan knowledge base UMKM, bukan jawaban template generik.',
			href: '/features/ai-reply',
			linkLabel: 'Detail AI reply',
			visualType: 'bot' as VisualType
		},
		{
			title: 'Data masuk ke Customer 360',
			description: 'Minat pelanggan, histori chat, order, dan status lead diperbarui otomatis.',
			href: '/product/customer-360',
			linkLabel: 'Detail Customer 360',
			visualType: 'profile' as VisualType
		},
		{
			title: 'Order dan QRIS bisa dibuat',
			description:
				'Jika pelanggan lanjut order atau reservasi, sistem dapat membuat record dan menghubungkannya dengan pembayaran QRIS.',
			href: '/product/qris-payment',
			linkLabel: 'Detail QRIS payment',
			visualType: 'payment' as VisualType
		},
		{
			title: 'Owner menerima digest',
			description:
				'Ringkasan harian dikirim ke WhatsApp owner agar tidak harus terus membuka dashboard.',
			href: '/product/dashboard',
			linkLabel: 'Detail owner dashboard',
			visualType: 'digest' as VisualType
		},
		{
			title: 'Action tetap butuh approval',
			description:
				'Follow-up dan campaign bisa dibuat AI, tetapi pengiriman tetap menunggu keputusan owner.',
			href: '/features/automation-flow',
			linkLabel: 'Detail automation flow',
			visualType: 'approval' as VisualType
		}
	]
};

export const featurePreview = {
	title: 'Fitur inti yang saling terhubung.',
	description:
		'Setiap fitur Nongki dibuat untuk satu alur yang sama: chat masuk, data terbentuk, insight muncul, lalu owner mengambil action.',
	cta: {
		label: 'Lihat semua fitur',
		href: '/features/ai-reply'
	},
	items: [
		{
			title: 'Owner WhatsApp Digest',
			description: 'Ringkasan harian dikirim langsung ke WhatsApp owner.',
			href: '/product/dashboard',
			icon: MessageCircle,
			visualType: 'digest' as VisualType,
			layout: 'digest'
		},
		{
			title: 'WhatsApp AI Agent',
			description: 'Balas FAQ, bantu order/reservasi, dan alihkan ke human saat perlu.',
			href: '/product/ai-agent',
			icon: Sparkles,
			visualType: 'chat' as VisualType,
			layout: 'agent'
		},
		{
			title: 'Customer 360',
			description: 'Profil pelanggan terbentuk otomatis dari chat dan transaksi.',
			href: '/product/customer-360',
			icon: Users,
			visualType: 'profile' as VisualType,
			layout: 'small'
		},
		{
			title: 'Reactive Insight',
			description:
				'Lihat sinyal bisnis seperti produk ramai ditanya, hot lead, dan customer at-risk.',
			href: '/features/inbox-crm',
			icon: TrendingUp,
			visualType: 'chart' as VisualType,
			layout: 'small'
		},
		{
			title: 'Campaign Draft',
			description: 'AI menyiapkan draft follow-up atau campaign berdasarkan insight.',
			href: '/features/automation-flow',
			icon: Workflow,
			visualType: 'campaign' as VisualType,
			layout: 'small'
		},
		{
			title: 'Knowledge Gap',
			description: 'Pertanyaan yang belum bisa dijawab disimpan agar knowledge base makin lengkap.',
			href: '/features/knowledge-base',
			icon: FileText,
			visualType: 'knowledge' as VisualType,
			layout: 'wide'
		},
		{
			title: 'Order & QRIS Flow',
			description: 'Order dari chat bisa diteruskan ke pembayaran QRIS dan status paid.',
			href: '/product/qris-payment',
			icon: QrCode,
			visualType: 'payment' as VisualType,
			layout: 'wide'
		}
	]
};

export const ownerDigestPreview = {
	eyebrow: 'Owner WhatsApp Digest',
	title: 'Owner tidak perlu buka dashboard setiap saat.',
	description:
		'Ningki bisa mengirim ringkasan harian langsung ke WhatsApp owner: chat masuk, hot lead, customer at-risk, produk yang ramai ditanya, dan rekomendasi action.',
	cta: {
		label: 'Lihat dashboard owner',
		href: '/product/dashboard'
	},
	benefits: [
		'Tetap update dari WhatsApp',
		'Hot lead langsung terlihat',
		'Rekomendasi action lebih cepat',
		'Owner tetap approve sebelum dikirim'
	],
	pills: ['2 hot lead', 'Digest ready', 'Reply “1” to draft']
};

export const customerDataPreview = {
	title: 'Setiap chat mulai membentuk data pelanggan.',
	description:
		'Nongki membantu owner melihat siapa pelanggan yang aktif, apa yang diminati, kapan terakhir interaksi, dan action apa yang sebaiknya dilakukan.',
	cta: {
		label: 'Pelajari Customer 360',
		href: '/product/customer-360'
	},
	profile: {
		name: 'Faisal',
		status: 'Hot Lead',
		score: 87,
		items: [
			['Last interaction', '2 jam lalu'],
			['Interest', 'Non-coffee menu'],
			['Order history', '3 transaksi'],
			['Segment', 'Potential repeat'],
			['Next action', 'Follow-up promo sore']
		]
	},
	metrics: ['Last interaction', 'Favorite product', 'Lead score', 'Segment', 'Next action']
};

export const revenuePreview = {
	title: 'Peluang yang hampir hilang bisa terlihat lebih cepat.',
	description:
		'Saat customer sudah menunjukkan niat beli tetapi tidak lanjut, Nongki dapat menandainya sebagai lost opportunity dan menyiapkan draft follow-up. Jika order lanjut, flow bisa diteruskan ke pembayaran QRIS.',
	note: 'Landing page hanya menampilkan gambaran flow. Detail teknis webhook dan payment ada di halaman workflow.',
	cta: {
		label: 'Lihat workflow QRIS',
		href: '/workflow/qris-webhook'
	},
	cards: [
		{
			title: 'Lost order detector',
			description: 'Customer tanya harga, tapi belum checkout? Sistem memberi sinyal follow-up.',
			href: '/features/reminder',
			steps: ['Tanya harga', 'Tidak checkout', 'Follow-up draft', 'Owner approve'],
			icon: TrendingUp
		},
		{
			title: 'Order & QRIS flow',
			description:
				'Order atau reservasi dapat dibuat dari chat dan dihubungkan dengan pembayaran QRIS.',
			href: '/product/qris-payment',
			steps: ['Order summary', 'QRIS dibuat', 'Webhook paid', 'Owner notified'],
			icon: QrCode
		}
	]
};

export const useCasePreview = {
	title: 'Dibuat untuk bisnis F&B yang hidup dari chat WhatsApp.',
	description:
		'Nongki cocok untuk bisnis yang menerima pertanyaan menu, reservasi, order, promo, dan komplain lewat WhatsApp setiap hari.',
	marqueeItems: ['Coffee Shop', 'Kafe', 'Resto', 'Bakery', 'Dessert', 'Cloud Kitchen', 'UMKM F&B'],
	items: [
		{
			title: 'Coffee Shop',
			emoji: '☕',
			description:
				'Pertanyaan menu, promo harian, customer repeat, dan follow-up pelanggan yang belum checkout.',
			href: '/solutions/coffee-shop',
			placeholder: 'Coffee shop visual'
		},
		{
			title: 'Kafe',
			emoji: '🪑',
			description: 'Reservasi, event kecil, promo komunitas, dan pertanyaan jam buka.',
			href: '/solutions/cafe-resto',
			placeholder: 'Kafe visual'
		},
		{
			title: 'Resto',
			emoji: '🍽️',
			description: 'Order, komplain, paket keluarga, dan campaign customer loyal.',
			href: '/solutions/cafe-resto',
			placeholder: 'Resto visual'
		},
		{
			title: 'Bakery / Dessert',
			emoji: '🧁',
			description: 'Repeat order, produk seasonal, reminder pelanggan.',
			href: '/solutions/umkm-fnb',
			placeholder: 'Bakery visual'
		}
	]
};

export const demoPreview = {
	title: 'Satu demo, satu loop yang langsung kelihatan nilainya.',
	description:
		'Demo Nongki bisa memperlihatkan satu alur sederhana: pelanggan chat, AI menjawab, order dibuat, QRIS diterbitkan, pembayaran tervalidasi, Customer 360 update, owner menerima ringkasan.',
	cta: {
		label: 'Lihat alur lengkap',
		href: '/workflow/customer-chat'
	},
	secondaryCta: {
		label: 'Lihat QRIS flow',
		href: '/workflow/qris-webhook'
	},
	video: {
		enabled: true,
		title: 'Demo Nongki',
		embedUrl: 'https://www.youtube.com/embed/OwlXbUYDf0w',
		placeholderTitle: 'Video demo akan ditampilkan di sini',
		placeholderDescription: 'Customer chat → AI reply → QRIS → Customer 360 → Owner digest'
	},
	steps: [
		{ title: 'Customer tanya menu', icon: MessageCircle },
		{ title: 'AI membalas', icon: Bot },
		{ title: 'Order/reservasi dibuat', icon: CheckCircle2 },
		{ title: 'QRIS diterbitkan', icon: QrCode },
		{ title: 'Payment paid', icon: CreditCard },
		{ title: 'Customer 360 update', icon: Users },
		{ title: 'Owner menerima digest/action', icon: Sparkles }
	]
};

export const pricingPreview = {
	title: 'Mulai gratis, lalu bayar sesuai pemakaian AI.',
	description:
		'Nongki memakai model hybrid: Starter gratis untuk mencoba CRM dasar, kredit AI untuk fitur berbasis AI, dan Pro untuk bisnis yang butuh multi-outlet.',
	detail: {
		label: 'Lihat detail harga',
		href: '/pricing'
	},
	items: [
		{
			title: 'Starter',
			label: 'Free',
			description: 'Untuk bisnis kecil yang ingin mencoba CRM dasar tanpa biaya awal.',
			features: [
				'Gratis',
				'CRM dasar',
				'Customer 360 dasar',
				'AI reply terbatas',
				'1 nomor WhatsApp'
			],
			cta: 'Mulai Gratis',
			href: '/auth/register'
		},
		{
			title: 'Kredit AI',
			label: 'Pay-as-you-go',
			description: 'Untuk fitur AI yang lebih aktif dengan biaya yang tetap dikontrol owner.',
			features: [
				'Bayar sesuai pemakaian',
				'AI reply tambahan',
				'Reactive insight',
				'Owner digest',
				'Campaign draft',
				'Top-up via AstraPay QRIS'
			],
			cta: 'Lihat Kredit AI',
			href: '/pricing',
			highlight: true,
			badge: 'Monetisasi utama'
		},
		{
			title: 'Pro',
			label: 'Opsional',
			description: 'Untuk multi-outlet, kuota lebih besar, dan fitur operasional lanjutan.',
			features: [
				'Coming soon',
				'Multi-outlet',
				'Kuota lebih besar',
				'Advanced analytics',
				'Priority support'
			],
			cta: 'Diskusi Pro',
			href: '/auth/register'
		}
	]
};

export const faqPreview = {
	title: 'Pertanyaan umum.',
	description: 'Jawaban singkat sebelum kamu melihat detail produk.',
	cta: {
		label: 'Baca docs',
		href: '/docs'
	},
	items: [
		{
			question: 'Apakah Ningki menggantikan admin?',
			answer:
				'Tidak. Ningki membantu menjawab pertanyaan berulang dan mencatat data. Admin atau owner tetap bisa mengambil alih kapan saja.'
		},
		{
			question: 'Apakah campaign dikirim otomatis?',
			answer:
				'Tidak. AI boleh menyarankan dan membuat draft, tetapi owner tetap harus approve sebelum campaign dikirim.'
		},
		{
			question: 'Apakah harus punya data pelanggan dulu?',
			answer:
				'Tidak. Data pelanggan mulai terbentuk dari chat, order, dan interaksi setelah bisnis memakai Nongki.'
		},
		{
			question: 'Apakah cocok untuk selain F&B?',
			answer:
				'Fokus awal Nongki adalah UMKM F&B. Namun konsep chat-to-CRM bisa dikembangkan ke kategori lain setelah validasi.'
		},
		{
			question: 'Apakah pembayaran bisa dari chat?',
			answer:
				'Pada flow MVP, order atau reservasi dari chat bisa diteruskan ke pembayaran QRIS, lalu statusnya diperbarui melalui webhook.'
		}
	]
};

export const finalCta = {
	title: 'Saatnya WhatsApp bisnismu bekerja lebih pintar.',
	description:
		'Ubah percakapan pelanggan menjadi data, insight, dan action yang bisa langsung dijalankan.',
	actions: [
		{ label: 'Mulai Sekarang', href: '/auth/register', variant: 'primary' },
		{ label: 'Lihat Demo', href: '#cara-kerja', variant: 'outline' }
	],
	pills: ['Hot lead', 'Customer 360', 'Digest ready', 'QRIS paid', 'Campaign draft']
};
