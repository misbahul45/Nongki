import {
	Bot,
	CalendarCheck,
	CheckCircle2,
	ContactRound,
	CreditCard,
	Database,
	FileText,
	LayoutDashboard,
	MessageCircle,
	Send,
	ShieldCheck,
	Sparkles
} from '@lucide/svelte';
import type { ProductFlowCanvasData } from '$lib/components/product/flow/product-flow.types';
import { createProductFlow3x2, createProductSimpleGridFlow } from '$lib/constants/product-flow';
import type { Component } from 'svelte';

export type ProductSlug =
	| 'whatsapp-crm'
	| 'ai-agent'
	| 'customer-360'
	| 'order-reservation'
	| 'qris-payment'
	| 'dashboard';

export type ProductMockupType =
	| 'agent'
	| 'chat'
	| 'profile'
	| 'payment'
	| 'dashboard'
	| 'reservation';

export type ProductPageData = {
	slug: ProductSlug;
	eyebrow: string;
	title: string;
	description: string;
	icon: Component;
	primaryCta: {
		label: string;
		href: string;
	};
	secondaryCta: {
		label: string;
		href: string;
	};
	problem: {
		title: string;
		description: string;
		items: string[];
	};
	capabilities: {
		title: string;
		description: string;
		icon: Component;
	}[];
	workflow: {
		title: string;
		description: string;
		steps: {
			title: string;
			description: string;
		}[];
	};
	preview: {
		title: string;
		description: string;
		type: ProductMockupType;
	};
	benefits: {
		title: string;
		description: string;
	}[];
	integration: {
		title: string;
		description: string;
		items: string[];
	};
	related: ProductSlug[];
};

const defaultCta = {
	primaryCta: {
		label: 'Mulai Gratis',
		href: '/auth/register'
	},
	secondaryCta: {
		label: 'Lihat Docs',
		href: '/docs'
	}
};

export const productPages: Record<ProductSlug, ProductPageData> = {
	'whatsapp-crm': {
		...defaultCta,
		slug: 'whatsapp-crm',
		eyebrow: 'WhatsApp CRM',
		title: 'WhatsApp CRM untuk bisnis F&B yang hidup dari chat.',
		description:
			'Kelola chat pelanggan, status lead, histori percakapan, dan follow-up dalam satu sistem yang terhubung langsung dengan WhatsApp.',
		icon: MessageCircle,
		problem: {
			title: 'Chat pelanggan ramai, tapi tidak berubah jadi sistem.',
			description:
				'Banyak peluang bisnis dimulai dari chat, tetapi sering hilang karena tidak ada status, histori, dan follow-up yang rapi.',
			items: [
				'Chat penting tenggelam di antara percakapan harian.',
				'Owner sulit tahu pelanggan mana yang paling potensial.',
				'Riwayat percakapan tidak tersusun sebagai data pelanggan.',
				'Follow-up sering terlambat karena tidak ada reminder yang jelas.'
			]
		},
		capabilities: [
			{
				title: 'Inbox CRM',
				description: 'Semua chat pelanggan masuk ke inbox bisnis yang lebih mudah dipantau.',
				icon: MessageCircle
			},
			{
				title: 'Customer Timeline',
				description: 'Lihat perjalanan pelanggan dari chat pertama sampai follow-up terakhir.',
				icon: ContactRound
			},
			{
				title: 'Lead Status',
				description: 'Tandai customer sebagai new lead, hot lead, follow-up, atau selesai.',
				icon: CheckCircle2
			},
			{
				title: 'Human Takeover',
				description:
					'Admin bisa mengambil alih percakapan saat chat membutuhkan keputusan manusia.',
				icon: Send
			},
			{
				title: 'Follow-up Reminder',
				description: 'Peluang penting tidak hilang karena sistem membantu mengingatkan tim.',
				icon: CalendarCheck
			},
			{
				title: 'Conversation Summary',
				description: 'Ringkasan chat membuat admin cepat paham konteks tanpa membaca dari awal.',
				icon: FileText
			}
		],
		workflow: {
			title: 'Dari chat masuk menjadi lead yang bisa ditindaklanjuti.',
			description:
				'Setiap percakapan diproses sebagai data operasional, bukan hanya pesan yang lewat di WhatsApp.',
			steps: [
				{
					title: 'Customer chat masuk',
					description: 'Pesan WhatsApp diterima di inbox bisnis.'
				},
				{
					title: 'Conversation dibuat otomatis',
					description: 'Sistem membuat thread dan menyimpan konteks percakapan.'
				},
				{
					title: 'Customer profile diperbarui',
					description: 'Riwayat dan minat pelanggan ikut masuk ke profil.'
				},
				{
					title: 'Status lead ditandai',
					description: 'Tim tahu customer mana yang perlu diprioritaskan.'
				},
				{
					title: 'Follow-up dilakukan',
					description: 'Admin atau AI melanjutkan percakapan dengan konteks yang lengkap.'
				}
			]
		},
		preview: {
			title: 'Inbox yang rapi untuk percakapan bisnis.',
			description:
				'Pantau chat aktif, status lead, ringkasan percakapan, dan follow-up dalam satu tampilan yang mudah discan.',
			type: 'chat'
		},
		benefits: [
			{
				title: 'Lead lebih terlihat',
				description: 'Customer potensial tidak lagi tenggelam di tengah chat harian.'
			},
			{
				title: 'Tim lebih seragam',
				description: 'Admin bekerja dengan histori dan status pelanggan yang sama.'
			},
			{
				title: 'Follow-up konsisten',
				description: 'Peluang yang perlu dibalas muncul sebagai action yang jelas.'
			},
			{
				title: 'Owner punya konteks',
				description: 'Percakapan berubah menjadi data yang membantu keputusan bisnis.'
			}
		],
		integration: {
			title: 'Terhubung dengan modul Nongki lainnya.',
			description:
				'WhatsApp CRM menjadi pusat percakapan yang mengalir ke AI Agent, Customer 360, reminder, dan dashboard owner.',
			items: ['WhatsApp Inbox', 'AI Agent', 'Customer 360', 'Reminder', 'Owner Dashboard']
		},
		related: ['ai-agent', 'customer-360', 'dashboard']
	},

	'ai-agent': {
		...defaultCta,
		slug: 'ai-agent',
		eyebrow: 'AI Agent',
		title: 'AI Agent yang paham bisnis F&B kamu.',
		description:
			'Ningki membalas chat pelanggan berdasarkan knowledge bisnis, membantu order atau reservasi, dan tahu kapan harus menyerahkan chat ke admin.',
		icon: Bot,
		problem: {
			title: 'Admin tidak harus menjawab pertanyaan yang sama setiap hari.',
			description:
				'Pertanyaan rutin bisa dijawab cepat oleh AI, sementara chat yang sensitif tetap aman karena bisa dialihkan ke admin.',
			items: [
				'Menu, harga, promo, dan jam buka sering ditanyakan berulang.',
				'Jawaban antar admin bisa berbeda dan membingungkan customer.',
				'Customer sering menunggu lama untuk pertanyaan sederhana.',
				'Pertanyaan yang gagal dijawab tidak pernah menjadi bahan perbaikan.'
			]
		},
		capabilities: [
			{
				title: 'FAQ Answering',
				description: 'Jawab pertanyaan umum berdasarkan knowledge bisnis yang sudah disiapkan.',
				icon: FileText
			},
			{
				title: 'Menu Recommendation',
				description: 'Bantu pelanggan memilih menu yang cocok dari konteks percakapan.',
				icon: Sparkles
			},
			{
				title: 'Order Assist',
				description: 'Kumpulkan detail pesanan dari chat sebelum masuk ke proses order.',
				icon: CheckCircle2
			},
			{
				title: 'Reservation Assist',
				description: 'Bantu pelanggan memberi tanggal, jam, jumlah orang, dan catatan reservasi.',
				icon: CalendarCheck
			},
			{
				title: 'Human Handoff',
				description: 'Serahkan percakapan ke admin saat AI perlu validasi manusia.',
				icon: Send
			},
			{
				title: 'Knowledge Gap Detection',
				description: 'Catat pertanyaan yang belum bisa dijawab agar knowledge base makin lengkap.',
				icon: Database
			}
		],
		workflow: {
			title: 'Balasan otomatis yang tetap tahu batas.',
			description:
				'AI tidak asal menjawab. Ningki membaca intent, mencari knowledge yang relevan, lalu melakukan handoff jika konteks perlu manusia.',
			steps: [
				{
					title: 'Pesan masuk',
					description: 'Customer menghubungi bisnis lewat WhatsApp.'
				},
				{
					title: 'Intent dibaca',
					description: 'Ningki memahami kebutuhan utama pelanggan.'
				},
				{
					title: 'Knowledge base dicari',
					description: 'Sistem mencari informasi bisnis yang paling relevan.'
				},
				{
					title: 'Jawaban dibuat',
					description: 'Balasan mengikuti tone brand dan konteks percakapan.'
				},
				{
					title: 'Handoff bila ragu',
					description: 'Chat dialihkan ke admin saat AI tidak cukup yakin.'
				}
			]
		},
		preview: {
			title: 'AI reply dengan knowledge bisnis yang jelas.',
			description:
				'Lihat balasan AI, konteks jawaban, dan knowledge chips yang membantu admin memahami dasar respons.',
			type: 'agent'
		},
		benefits: [
			{
				title: 'Response lebih cepat',
				description: 'Customer tidak perlu menunggu admin untuk pertanyaan rutin.'
			},
			{
				title: 'Jawaban konsisten',
				description: 'Informasi menu, jam buka, dan promo mengikuti knowledge yang sama.'
			},
			{
				title: 'Admin lebih fokus',
				description: 'Tim bisa menangani percakapan yang butuh keputusan manusia.'
			},
			{
				title: 'Knowledge membaik',
				description: 'Pertanyaan gagal menjadi bahan untuk melengkapi knowledge bisnis.'
			}
		],
		integration: {
			title: 'AI yang menyambung ke workflow bisnis.',
			description:
				'Ningki tidak berhenti di balasan. AI terhubung ke CRM, Customer 360, order, reservasi, dan human handoff.',
			items: [
				'WhatsApp CRM',
				'Knowledge Base',
				'Customer 360',
				'Order & Reservation',
				'Human Handoff'
			]
		},
		related: ['whatsapp-crm', 'customer-360', 'order-reservation']
	},

	'customer-360': {
		...defaultCta,
		slug: 'customer-360',
		eyebrow: 'Customer 360',
		title: 'Setiap chat otomatis menjadi profil pelanggan.',
		description:
			'Nongki membantu owner melihat siapa pelangganmu, apa minatnya, kapan terakhir berinteraksi, dan action apa yang paling tepat dilakukan.',
		icon: ContactRound,
		problem: {
			title: 'Data pelanggan sering hilang di dalam chat.',
			description:
				'Customer 360 menyatukan identitas, histori, minat, lead score, dan action berikutnya dari percakapan WhatsApp.',
			items: [
				'Owner tidak tahu customer mana yang paling hot.',
				'Minat produk tidak tercatat sebagai data.',
				'Riwayat chat sulit dilacak saat customer kembali.',
				'Follow-up sering dilakukan tanpa konteks yang cukup.'
			]
		},
		capabilities: [
			{
				title: 'Customer Identity',
				description: 'Kenali pelanggan dari nomor WhatsApp dan histori interaksinya.',
				icon: ContactRound
			},
			{
				title: 'Interaction History',
				description: 'Simpan chat, order, reservasi, dan aktivitas penting dalam satu profil.',
				icon: MessageCircle
			},
			{
				title: 'Lead Score',
				description: 'Bantu tim memprioritaskan customer dengan potensi transaksi lebih tinggi.',
				icon: Sparkles
			},
			{
				title: 'Favorite Product',
				description: 'Catat menu atau layanan yang paling sering diminati customer.',
				icon: CheckCircle2
			},
			{
				title: 'Segment Basic',
				description: 'Kelompokkan customer untuk follow-up yang lebih relevan.',
				icon: Database
			},
			{
				title: 'Next Best Action',
				description: 'Tampilkan saran langkah berikutnya untuk admin atau owner.',
				icon: Send
			}
		],
		workflow: {
			title: 'Profil customer terbentuk otomatis dari percakapan.',
			description:
				'Setiap chat membawa sinyal baru yang memperkaya profil pelanggan dan membantu menentukan action berikutnya.',
			steps: [
				{
					title: 'Chat diterima',
					description: 'Customer menghubungi bisnis lewat WhatsApp.'
				},
				{
					title: 'Nomor dikenali',
					description: 'Sistem mencocokkan nomor dengan profil yang sudah ada.'
				},
				{
					title: 'Profil diperbarui',
					description: 'Data baru masuk ke profil pelanggan.'
				},
				{
					title: 'Minat ditandai',
					description: 'Produk, status lead, dan kebutuhan ikut dicatat.'
				},
				{
					title: 'Action disarankan',
					description: 'Sistem membantu menentukan langkah terbaik berikutnya.'
				}
			]
		},
		preview: {
			title: 'Profil pelanggan yang bisa langsung dipakai.',
			description:
				'Owner dan admin melihat lead score, minat produk, histori terakhir, dan next best action tanpa membaca semua chat ulang.',
			type: 'profile'
		},
		benefits: [
			{
				title: 'Customer lebih dikenal',
				description: 'Tim tidak mulai dari nol setiap kali pelanggan kembali chat.'
			},
			{
				title: 'Prioritas lebih jelas',
				description: 'Hot lead bisa dibedakan dari percakapan biasa.'
			},
			{
				title: 'Follow-up relevan',
				description: 'Action dibuat berdasarkan histori dan minat pelanggan.'
			},
			{
				title: 'Insight makin kaya',
				description: 'Dashboard mendapat data customer yang lebih bermakna.'
			}
		],
		integration: {
			title: 'Data pelanggan mengalir ke seluruh sistem.',
			description:
				'Customer 360 tersambung dengan WhatsApp CRM, AI Agent, order history, reservation history, dan dashboard owner.',
			items: ['WhatsApp CRM', 'AI Agent', 'Order History', 'Reservation History', 'Owner Dashboard']
		},
		related: ['whatsapp-crm', 'ai-agent', 'dashboard']
	},

	'order-reservation': {
		...defaultCta,
		slug: 'order-reservation',
		eyebrow: 'Order & Reservation',
		title: 'Order dan reservasi dari WhatsApp jadi lebih rapi.',
		description:
			'Nongki menangkap niat order atau reservasi dari chat, membantu mengonfirmasi detail, lalu menyimpan statusnya di sistem.',
		icon: CalendarCheck,
		problem: {
			title: 'Order dan reservasi sering tercecer di percakapan.',
			description:
				'Nongki membantu mengubah niat pelanggan yang masih berupa chat menjadi draft order atau reservasi yang siap dikonfirmasi.',
			items: [
				'Detail pesanan sering tidak lengkap.',
				'Reservasi perlu dicek ulang secara manual.',
				'Admin harus bolak-balik menanyakan informasi dasar.',
				'Status order sulit dipantau oleh owner dan tim.'
			]
		},
		capabilities: [
			{
				title: 'Intent Order Detection',
				description: 'Kenali chat yang mengarah ke order, booking, atau reservasi.',
				icon: Sparkles
			},
			{
				title: 'Reservation Assist',
				description: 'Kumpulkan tanggal, jam, jumlah tamu, dan catatan reservasi.',
				icon: CalendarCheck
			},
			{
				title: 'Draft Order',
				description: 'Susun pesanan sementara sebelum customer atau admin mengonfirmasi.',
				icon: FileText
			},
			{
				title: 'Confirmation Flow',
				description: 'Bantu customer mengecek ulang detail terakhir sebelum diproses.',
				icon: CheckCircle2
			},
			{
				title: 'Status Tracking',
				description: 'Pantau status order atau reservasi dari dashboard.',
				icon: LayoutDashboard
			},
			{
				title: 'Admin Approval',
				description: 'Admin tetap bisa menyetujui atau mengedit sebelum final.',
				icon: ShieldCheck
			}
		],
		workflow: {
			title: 'Dari intent di chat menjadi draft yang siap diproses.',
			description:
				'Detail penting dikumpulkan bertahap agar admin tidak perlu merapikan order atau reservasi dari nol.',
			steps: [
				{
					title: 'Customer meminta order',
					description: 'Chat berisi niat order atau reservasi.'
				},
				{
					title: 'AI membaca kebutuhan',
					description: 'Sistem memahami tipe request pelanggan.'
				},
				{
					title: 'Detail dikumpulkan',
					description: 'Tanggal, jam, menu, pax, dan catatan dilengkapi.'
				},
				{
					title: 'Draft dibuat',
					description: 'Order atau reservasi masuk sebagai draft.'
				},
				{
					title: 'Konfirmasi',
					description: 'Admin atau customer mengonfirmasi detail akhir.'
				}
			]
		},
		preview: {
			title: 'Draft reservasi yang jelas statusnya.',
			description:
				'Detail tanggal, jam, jumlah tamu, catatan, dan status bisa dipantau dalam satu card yang mudah dibaca.',
			type: 'reservation'
		},
		benefits: [
			{
				title: 'Detail lebih lengkap',
				description: 'Informasi penting terkumpul sebelum diproses admin.'
			},
			{
				title: 'Lebih sedikit tanya ulang',
				description: 'Flow membantu customer melengkapi kebutuhan dengan lebih cepat.'
			},
			{
				title: 'Status transparan',
				description: 'Owner dan admin tahu order mana yang masih draft atau sudah confirmed.'
			},
			{
				title: 'Siap ke payment',
				description: 'Order terkonfirmasi bisa langsung dilanjutkan ke pembayaran QRIS.'
			}
		],
		integration: {
			title: 'Order tersambung dari chat sampai pembayaran.',
			description:
				'Flow order dan reservasi mengalir dari WhatsApp ke Customer 360, QRIS Payment, dan dashboard owner.',
			items: ['WhatsApp CRM', 'AI Agent', 'Customer 360', 'QRIS Payment', 'Dashboard']
		},
		related: ['ai-agent', 'qris-payment', 'dashboard']
	},

	'qris-payment': {
		...defaultCta,
		slug: 'qris-payment',
		eyebrow: 'QRIS Payment',
		title: 'Pembayaran QRIS langsung dari alur chat.',
		description:
			'Setelah order dikonfirmasi, Nongki membantu membuat pembayaran QRIS, memantau status, dan memberi notifikasi saat pembayaran berhasil.',
		icon: CreditCard,
		problem: {
			title: 'Pembayaran manual membuat order mudah tertunda.',
			description:
				'Nongki membantu owner memantau pembayaran dengan flow yang tervalidasi, rapi, dan terhubung ke status order.',
			items: [
				'Customer harus dikirim instruksi pembayaran secara manual.',
				'Admin perlu mengecek pembayaran satu per satu.',
				'Status order tidak langsung berubah setelah customer membayar.',
				'Webhook yang tidak aman berisiko memproses transaksi dua kali.'
			]
		},
		capabilities: [
			{
				title: 'QRIS Generation',
				description: 'Buat pembayaran QRIS setelah order berhasil dikonfirmasi.',
				icon: CreditCard
			},
			{
				title: 'Waiting Payment Status',
				description: 'Tandai order yang masih menunggu pembayaran customer.',
				icon: CalendarCheck
			},
			{
				title: 'Webhook Validation',
				description: 'Validasi notifikasi pembayaran sebelum status order berubah.',
				icon: ShieldCheck
			},
			{
				title: 'Paid Notification',
				description: 'Beri tahu owner atau admin saat pembayaran berhasil.',
				icon: Send
			},
			{
				title: 'Payment Timeline',
				description: 'Simpan riwayat status pembayaran agar mudah dilacak.',
				icon: FileText
			},
			{
				title: 'Idempotency Safety',
				description: 'Bantu mencegah transaksi yang sama diproses lebih dari sekali.',
				icon: CheckCircle2
			}
		],
		workflow: {
			title: 'Pembayaran dipantau dari QRIS sampai paid.',
			description:
				'Status order mengikuti pembayaran yang sudah tervalidasi agar proses tim lebih aman dan jelas.',
			steps: [
				{
					title: 'Order dikonfirmasi',
					description: 'Customer dan admin menyetujui detail order.'
				},
				{
					title: 'QRIS dibuat',
					description: 'Sistem membuat instruksi pembayaran.'
				},
				{
					title: 'Customer membayar',
					description: 'Pelanggan menyelesaikan pembayaran QRIS.'
				},
				{
					title: 'Webhook validasi',
					description: 'Notifikasi pembayaran diverifikasi oleh sistem.'
				},
				{
					title: 'Status paid',
					description: 'Order berubah menjadi paid dan tim mendapat notifikasi.'
				}
			]
		},
		preview: {
			title: 'Status pembayaran yang mudah dipantau.',
			description:
				'Lihat ringkasan order, QR placeholder, status waiting atau paid, dan timeline pembayaran dalam satu tampilan.',
			type: 'payment'
		},
		benefits: [
			{
				title: 'Pembayaran lebih jelas',
				description: 'Customer mendapat flow bayar yang langsung terkait dengan order.'
			},
			{
				title: 'Cek manual berkurang',
				description: 'Admin tidak perlu terus mencocokkan pembayaran satu per satu.'
			},
			{
				title: 'Status cepat berubah',
				description: 'Order bisa lanjut setelah pembayaran benar-benar tervalidasi.'
			},
			{
				title: 'Flow lebih aman',
				description: 'Webhook tervalidasi dan idempotent safety membantu mengurangi risiko.'
			}
		],
		integration: {
			title: 'Payment masuk ke alur order Nongki.',
			description:
				'QRIS menjadi bagian dari proses order, webhook, notifikasi owner, dan dashboard.',
			items: [
				'Order & Reservation',
				'AstraPay QRIS',
				'Payment Webhook',
				'Owner Notification',
				'Dashboard'
			]
		},
		related: ['order-reservation', 'whatsapp-crm', 'dashboard']
	},

	dashboard: {
		...defaultCta,
		slug: 'dashboard',
		eyebrow: 'Dashboard Owner',
		title: 'Dashboard owner untuk melihat insight tanpa tenggelam di chat.',
		description:
			'Lihat ringkasan bisnis, hot lead, lost order, produk yang ramai ditanya, dan draft action dari satu dashboard.',
		icon: LayoutDashboard,
		problem: {
			title: 'Owner butuh ringkasan, bukan tumpukan chat.',
			description:
				'Dashboard merangkum sinyal penting dari percakapan agar owner bisa mengambil keputusan lebih cepat.',
			items: [
				'Chat terlalu banyak untuk dibaca satu per satu.',
				'Customer potensial sulit diprioritaskan.',
				'Produk yang sering ditanya tidak dianalisis.',
				'Action bisnis sering terlambat karena insight tidak muncul.'
			]
		},
		capabilities: [
			{
				title: 'Daily Overview',
				description: 'Ringkasan performa chat dan aktivitas bisnis harian.',
				icon: LayoutDashboard
			},
			{
				title: 'Hot Lead Insight',
				description: 'Tampilkan customer yang perlu dikejar lebih dulu.',
				icon: Sparkles
			},
			{
				title: 'Lost Order Detection',
				description: 'Kenali peluang order yang berhenti di tengah jalan.',
				icon: FileText
			},
			{
				title: 'Product Asked Insight',
				description: 'Lihat menu atau layanan yang paling sering ditanyakan.',
				icon: Database
			},
			{
				title: 'Campaign Draft',
				description: 'Buat draft follow-up atau promo dari insight yang muncul.',
				icon: Send
			},
			{
				title: 'Owner Digest',
				description: 'Ringkasan siap baca untuk owner tanpa membuka banyak halaman.',
				icon: CheckCircle2
			}
		],
		workflow: {
			title: 'Insight bisnis dibuat dari data percakapan.',
			description:
				'Nongki mengubah pola chat menjadi ringkasan yang mudah dipahami dan action yang bisa dieksekusi.',
			steps: [
				{
					title: 'Data chat dikumpulkan',
					description: 'Percakapan dan status pelanggan disatukan.'
				},
				{
					title: 'Pola dianalisis',
					description: 'Sistem membaca sinyal dari customer, order, dan aktivitas chat.'
				},
				{
					title: 'Insight dibuat',
					description: 'Ringkasan peluang, risiko, dan tren mulai muncul.'
				},
				{
					title: 'Owner menerima digest',
					description: 'Owner mendapat overview yang siap dibaca.'
				},
				{
					title: 'Draft action direview',
					description: 'Action bisa dicek sebelum dijalankan.'
				}
			]
		},
		preview: {
			title: 'Overview bisnis yang cepat discan.',
			description:
				'Pantau hot lead, produk yang sering ditanya, lost order, dan digest tanpa membaca semua chat.',
			type: 'dashboard'
		},
		benefits: [
			{
				title: 'Keputusan lebih cepat',
				description: 'Owner langsung melihat sinyal penting dari operasional chat.'
			},
			{
				title: 'Lead tidak terlewat',
				description: 'Customer prioritas muncul dalam daftar yang lebih jelas.'
			},
			{
				title: 'Tren produk terlihat',
				description: 'Pertanyaan customer menjadi bahan strategi menu atau promo.'
			},
			{
				title: 'Action lebih terarah',
				description: 'Draft campaign dan digest membantu follow-up harian.'
			}
		],
		integration: {
			title: 'Dashboard menarik insight dari modul utama.',
			description:
				'Ringkasan owner disusun dari CRM, profil customer, AI Agent, owner digest, dan campaign approval.',
			items: ['WhatsApp CRM', 'Customer 360', 'AI Agent', 'Owner Digest', 'Campaign Approval']
		},
		related: ['whatsapp-crm', 'customer-360', 'ai-agent']
	}
};

export const productIndex = {
	eyebrow: 'Produk Nongki',
	title: 'Produk Nongki untuk mengubah WhatsApp jadi sistem bisnis.',
	description:
		'Pilih modul yang dibutuhkan bisnismu: AI Agent, WhatsApp CRM, Customer 360, order/reservasi, QRIS payment, dan dashboard owner.',
	products: [
		'whatsapp-crm',
		'ai-agent',
		'customer-360',
		'order-reservation',
		'qris-payment',
		'dashboard'
	] satisfies ProductSlug[]
};

export const productWorkflowFlows: Partial<Record<ProductSlug, ProductFlowCanvasData>> = {
	'whatsapp-crm': createProductFlow3x2({
		title: 'Dari chat masuk menjadi lead yang bisa ditindaklanjuti.',
		description:
			'Setiap chat tidak berhenti sebagai pesan. Nongki mengubahnya menjadi konteks customer, status lead, dan peluang follow-up yang bisa langsung dikerjakan.',
		nodeVariant: 'compact',
		labels: ['thread', 'profile', 'status', 'follow', 'insight'],
		nodes: [
			{
				id: 'whatsapp-chat',
				title: 'Customer Chat',
				description: 'Pesan pelanggan masuk dan langsung ditangkap sebagai percakapan bisnis.',
				eyebrow: 'Chat',
				icon: MessageCircle,
				tone: 'primary'
			},
			{
				id: 'conversation',
				title: 'Conversation',
				description: 'Thread dibuat agar admin selalu punya konteks sebelum membalas.',
				eyebrow: 'Thread',
				icon: FileText,
				tone: 'secondary'
			},
			{
				id: 'customer-profile',
				title: 'Customer Profile',
				description: 'Histori, minat, dan aktivitas pelanggan ikut memperkaya profil.',
				eyebrow: 'Data',
				icon: ContactRound,
				tone: 'primary'
			},
			{
				id: 'lead-status',
				title: 'Lead Status',
				description: 'Prospek diberi status agar tim tahu mana yang paling perlu dikejar.',
				eyebrow: 'CRM',
				icon: CheckCircle2,
				tone: 'accent'
			},
			{
				id: 'follow-up',
				title: 'Follow-up',
				description: 'Admin atau AI melanjutkan chat dengan konteks yang sudah lengkap.',
				eyebrow: 'Action',
				icon: Send,
				tone: 'secondary'
			},
			{
				id: 'owner-insight',
				title: 'Owner Insight',
				description: 'Owner melihat peluang penting tanpa harus membaca semua chat satu per satu.',
				eyebrow: 'Insight',
				icon: LayoutDashboard,
				tone: 'primary'
			}
		]
	}),

	'ai-agent': createProductFlow3x2({
		title: 'Balasan otomatis yang tetap tahu batas.',
		description:
			'Ningki tidak asal membalas. AI membaca intent, mencari jawaban dari knowledge bisnis, lalu menyerahkan chat ke admin saat konteks perlu keputusan manusia.',
		nodeVariant: 'compact',
		labels: ['intent', 'search', 'reply', 'check', 'handoff'],
		nodes: [
			{
				id: 'incoming-chat',
				title: 'Incoming Chat',
				description: 'Customer bertanya lewat WhatsApp dengan bahasa sehari-hari.',
				eyebrow: 'Chat',
				icon: MessageCircle,
				tone: 'primary'
			},
			{
				id: 'intent-reading',
				title: 'Intent Reading',
				description:
					'AI memahami apakah customer ingin tanya menu, order, reservasi, atau komplain.',
				eyebrow: 'AI',
				icon: Sparkles,
				tone: 'secondary'
			},
			{
				id: 'knowledge-search',
				title: 'Knowledge Search',
				description: 'Informasi bisnis yang paling relevan dicari sebelum jawaban dibuat.',
				eyebrow: 'Knowledge',
				icon: Database,
				tone: 'primary'
			},
			{
				id: 'ai-reply',
				title: 'AI Reply',
				description: 'Balasan dibuat sesuai tone brand, bukan template generik.',
				eyebrow: 'Reply',
				icon: Bot,
				tone: 'accent'
			},
			{
				id: 'safety-check',
				title: 'Safety Check',
				description: 'Jika jawaban kurang yakin, AI tidak memaksa menjawab.',
				eyebrow: 'Guard',
				icon: ShieldCheck,
				tone: 'secondary'
			},
			{
				id: 'human-handoff',
				title: 'Human Handoff',
				description: 'Admin mengambil alih dengan konteks lengkap dari percakapan sebelumnya.',
				eyebrow: 'Admin',
				icon: Send,
				tone: 'primary'
			}
		]
	}),

	'customer-360': createProductFlow3x2({
		title: 'Profil customer terbentuk otomatis dari percakapan.',
		description:
			'Setiap chat membawa sinyal baru. Nongki menyusunnya menjadi identitas, minat, lead score, segment, dan saran action berikutnya.',
		nodeVariant: 'compact',
		labels: ['identify', 'interest', 'score', 'segment', 'action'],
		nodes: [
			{
				id: 'chat-signal',
				title: 'Chat Signal',
				description: 'Pertanyaan dan respons customer dibaca sebagai sinyal kebutuhan.',
				eyebrow: 'Signal',
				icon: MessageCircle,
				tone: 'primary'
			},
			{
				id: 'customer-identity',
				title: 'Customer Identity',
				description: 'Nomor WhatsApp dicocokkan dengan profil agar histori tidak terputus.',
				eyebrow: 'Identity',
				icon: ContactRound,
				tone: 'secondary'
			},
			{
				id: 'interest-update',
				title: 'Interest Update',
				description: 'Menu, promo, atau layanan yang diminati ikut tercatat.',
				eyebrow: 'Interest',
				icon: Sparkles,
				tone: 'primary'
			},
			{
				id: 'lead-score',
				title: 'Lead Score',
				description: 'Customer yang paling potensial dibuat lebih mudah diprioritaskan.',
				eyebrow: 'Score',
				icon: CheckCircle2,
				tone: 'accent'
			},
			{
				id: 'segment',
				title: 'Segment',
				description: 'Customer dikelompokkan agar follow-up terasa lebih relevan.',
				eyebrow: 'Group',
				icon: Database,
				tone: 'secondary'
			},
			{
				id: 'next-action',
				title: 'Next Action',
				description: 'Sistem memberi saran langkah berikutnya yang bisa langsung dikerjakan.',
				eyebrow: 'Action',
				icon: Send,
				tone: 'primary'
			}
		]
	}),

	'order-reservation': createProductFlow3x2({
		title: 'Dari niat customer sampai order/reservasi tercatat.',
		description:
			'Percakapan yang awalnya bebas diarahkan menjadi detail order atau reservasi yang rapi, siap dikonfirmasi, dan mudah dipantau.',
		nodeVariant: 'compact',
		labels: ['intent', 'detail', 'draft', 'confirm', 'saved'],
		nodes: [
			{
				id: 'customer-request',
				title: 'Customer Request',
				description: 'Customer mulai dari chat sederhana: ingin pesan, booking, atau tanya slot.',
				eyebrow: 'Chat',
				icon: MessageCircle,
				tone: 'primary',
				metrics: ['Request']
			},
			{
				id: 'intent-detected',
				title: 'Intent Detected',
				description: 'Ningki membedakan apakah chat mengarah ke order atau reservasi.',
				eyebrow: 'AI',
				icon: Sparkles,
				tone: 'secondary',
				metrics: ['Order', 'Reservasi']
			},
			{
				id: 'detail-collected',
				title: 'Detail Collected',
				description: 'Tanggal, jam, jumlah orang, menu, dan catatan dikumpulkan bertahap.',
				eyebrow: 'Detail',
				icon: CalendarCheck,
				tone: 'primary',
				metrics: ['Tanggal', 'Pax']
			},
			{
				id: 'draft-created',
				title: 'Draft Created',
				description: 'Sistem menyusun draft agar admin tidak perlu merapikan dari nol.',
				eyebrow: 'Draft',
				icon: FileText,
				tone: 'accent',
				metrics: ['Draft']
			},
			{
				id: 'confirmation',
				title: 'Confirmation',
				description: 'Customer atau admin mengecek detail akhir sebelum diproses.',
				eyebrow: 'Review',
				icon: CheckCircle2,
				tone: 'secondary',
				metrics: ['Confirmed']
			},
			{
				id: 'status-updated',
				title: 'Status Updated',
				description: 'Status tersimpan di dashboard sebagai order atau reservasi yang jelas.',
				eyebrow: 'Output',
				icon: LayoutDashboard,
				tone: 'primary',
				metrics: ['Dashboard']
			}
		]
	}),

	'qris-payment': createProductFlow3x2({
		title: 'Dari order dikonfirmasi sampai status paid.',
		description:
			'Pembayaran tidak lagi tercecer di chat. QRIS dibuat dari order, status dipantau, dan notifikasi masuk setelah transaksi tervalidasi.',
		nodeVariant: 'compact',
		labels: ['create', 'pay', 'validate', 'update', 'notify'],
		nodes: [
			{
				id: 'order-confirmed',
				title: 'Order Confirmed',
				description: 'Detail order sudah disetujui dan siap masuk proses pembayaran.',
				eyebrow: 'Order',
				icon: CheckCircle2,
				tone: 'primary',
				metrics: ['Ready']
			},
			{
				id: 'generate-qris',
				title: 'Generate QRIS',
				description: 'Sistem membuat QRIS yang terhubung langsung dengan order.',
				eyebrow: 'Payment',
				icon: CreditCard,
				tone: 'secondary',
				metrics: ['QRIS']
			},
			{
				id: 'customer-pays',
				title: 'Customer Pays',
				description: 'Customer membayar dari aplikasi pembayaran yang mereka pakai.',
				eyebrow: 'Customer',
				icon: Send,
				tone: 'primary',
				metrics: ['Paid attempt']
			},
			{
				id: 'webhook-validated',
				title: 'Webhook Validated',
				description: 'Webhook memvalidasi transaksi agar status tidak berubah sembarangan.',
				eyebrow: 'Secure',
				icon: ShieldCheck,
				tone: 'accent',
				metrics: ['Validated']
			},
			{
				id: 'status-paid',
				title: 'Status Paid',
				description: 'Order otomatis ditandai paid setelah pembayaran benar-benar valid.',
				eyebrow: 'Status',
				icon: CheckCircle2,
				tone: 'secondary',
				metrics: ['Paid']
			},
			{
				id: 'owner-notified',
				title: 'Owner Notified',
				description: 'Owner dan admin langsung tahu bahwa pembayaran sudah berhasil.',
				eyebrow: 'Notify',
				icon: LayoutDashboard,
				tone: 'primary',
				metrics: ['Owner']
			}
		]
	}),

	dashboard: createProductFlow3x2({
		title: 'Dari chat harian menjadi insight owner.',
		description:
			'Data chat yang biasanya berantakan dibaca sebagai sinyal bisnis, diringkas menjadi insight, lalu diubah menjadi action yang bisa direview owner.',
		nodeVariant: 'compact',
		labels: ['signal', 'pattern', 'digest', 'draft', 'approve'],
		nodes: [
			{
				id: 'chat-data',
				title: 'Chat Data',
				description: 'Percakapan pelanggan dikumpulkan dari aktivitas harian.',
				eyebrow: 'Input',
				icon: MessageCircle,
				tone: 'primary',
				metrics: ['Chats']
			},
			{
				id: 'customer-signal',
				title: 'Customer Signal',
				description: 'Minat, lead, repeat customer, dan aktivitas pelanggan dibaca.',
				eyebrow: 'Signal',
				icon: ContactRound,
				tone: 'secondary',
				metrics: ['Lead', 'Interest']
			},
			{
				id: 'insight-engine',
				title: 'Insight Engine',
				description: 'Sistem menemukan pola yang sulit dilihat dari chat satu per satu.',
				eyebrow: 'Analyze',
				icon: Sparkles,
				tone: 'primary',
				metrics: ['Pattern']
			},
			{
				id: 'owner-digest',
				title: 'Owner Digest',
				description: 'Ringkasan penting dikemas agar owner cepat paham kondisi bisnis.',
				eyebrow: 'Digest',
				icon: FileText,
				tone: 'accent',
				metrics: ['Daily']
			},
			{
				id: 'campaign-draft',
				title: 'Campaign Draft',
				description: 'AI membantu membuat draft follow-up atau promo dari insight.',
				eyebrow: 'Draft',
				icon: Send,
				tone: 'secondary',
				metrics: ['Action']
			},
			{
				id: 'approval',
				title: 'Approval',
				description: 'Owner tetap memegang keputusan sebelum action dikirim.',
				eyebrow: 'Decision',
				icon: ShieldCheck,
				tone: 'primary',
				metrics: ['Approve']
			}
		]
	})
};

export const productIndexFlow: ProductFlowCanvasData = createProductSimpleGridFlow({
	showStepNumber: true,
	nodes: [
		{
			id: 'whatsapp-crm',
			title: 'WhatsApp CRM',
			tone: 'primary'
		},
		{
			id: 'ai-agent',
			title: 'AI Agent',
			tone: 'secondary'
		},
		{
			id: 'customer-360',
			title: 'Customer 360',
			tone: 'accent'
		},
		{
			id: 'qris-payment',
			title: 'QRIS Payment',
			tone: 'primary'
		},
		{
			id: 'dashboard',
			title: 'Dashboard',
			tone: 'secondary'
		},
		{
			id: 'owner-action',
			title: 'Owner Action',
			tone: 'accent'
		}
	]
});
