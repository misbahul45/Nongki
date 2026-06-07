import {
	Bot,
	Brain,
	CheckCircle2,
	ContactRound,
	Database,
	FileText,
	Inbox,
	Lightbulb,
	MessageCircle,
	RefreshCw,
	Send,
	ShieldCheck,
	Sparkles,
	Timer,
	UserCheck,
	Workflow
} from '@lucide/svelte';
import type { Component } from 'svelte';

export type FeatureSlug =
	| 'ai-reply'
	| 'automation-flow'
	| 'human-takeover'
	| 'inbox-crm'
	| 'knowledge-base'
	| 'reminder';

export type FeatureMockupType =
	| 'aiReply'
	| 'automation'
	| 'humanTakeover'
	| 'inbox'
	| 'knowledge'
	| 'reminder';

export type FeaturePageData = {
	slug: FeatureSlug;
	eyebrow: string;
	title: string;
	description: string;
	icon: Component;
	mockupType: FeatureMockupType;
	primaryCta: { label: string; href: string };
	secondaryCta: { label: string; href: string };
	problem: {
		title: string;
		description: string;
		items: { title: string; description: string }[];
	};
	howItWorks: {
		title: string;
		description: string;
		steps: { title: string; description: string }[];
	};
	capabilities: { title: string; description: string; icon: Component }[];
	useCases: { title: string; description: string }[];
	integrations: { title: string; description: string; href: string }[];
	related: FeatureSlug[];
};

const defaultPrimaryCta = { label: 'Mulai Gratis', href: '/auth/register' };

export const featurePages: Record<FeatureSlug, FeaturePageData> = {
	'ai-reply': {
		slug: 'ai-reply',
		eyebrow: 'AI Reply',
		title: 'Balasan AI yang cepat, tetap sesuai knowledge bisnis.',
		description:
			'Ningki membantu menjawab pertanyaan pelanggan tentang menu, harga, promo, jam buka, order, dan reservasi dengan tone brand yang lebih konsisten.',
		icon: Bot,
		mockupType: 'aiReply',
		primaryCta: defaultPrimaryCta,
		secondaryCta: { label: 'Lihat Produk Terkait', href: '/product/ai-agent' },
		problem: {
			title: 'Pertanyaan yang sama tidak harus selalu dijawab manual.',
			description:
				'AI Reply menjaga response cepat untuk pertanyaan sederhana, sambil tetap tahu kapan harus berhenti.',
			items: [
				{
					title: 'FAQ berulang',
					description: 'Menu dan harga sering ditanyakan berkali-kali setiap hari.'
				},
				{
					title: 'Jawaban tidak konsisten',
					description: 'Admin berbeda bisa memberi tone dan detail yang berbeda.'
				},
				{
					title: 'Customer menunggu',
					description: 'Pertanyaan sederhana bisa membuat customer terlalu lama menunggu.'
				},
				{
					title: 'Butuh batas aman',
					description: 'AI perlu tahu kapan harus menyerahkan chat ke admin.'
				}
			]
		},
		howItWorks: {
			title: 'Cara AI Reply bekerja di dalam chat.',
			description:
				'Ningki membaca intent, mencari knowledge, lalu menjawab atau melakukan handoff.',
			steps: [
				{ title: 'Pesan masuk', description: 'Customer mengirim pertanyaan lewat WhatsApp.' },
				{ title: 'Intent dibaca', description: 'Sistem memahami maksud utama percakapan.' },
				{
					title: 'Knowledge dicari',
					description: 'Jawaban diambil dari informasi bisnis yang tersedia.'
				},
				{
					title: 'Reply disusun',
					description: 'Balasan mengikuti tone brand dan konteks customer.'
				},
				{
					title: 'Handoff jika ragu',
					description: 'Chat dialihkan ke admin saat perlu keputusan manusia.'
				}
			]
		},
		capabilities: [
			{
				title: 'Intent Detection',
				description: 'Membaca maksud customer dari chat yang tidak selalu rapi.',
				icon: Brain
			},
			{
				title: 'Knowledge-based Reply',
				description: 'Jawaban bersumber dari menu, promo, policy, dan FAQ bisnis.',
				icon: Database
			},
			{
				title: 'Tone Brand',
				description: 'Balasan dibuat lebih konsisten dengan gaya komunikasi brand.',
				icon: Sparkles
			},
			{
				title: 'Safety Check',
				description: 'AI berhenti saat confidence rendah atau topik perlu admin.',
				icon: ShieldCheck
			},
			{
				title: 'Human Handoff',
				description: 'Admin bisa mengambil alih chat dengan konteks yang sudah diringkas.',
				icon: UserCheck
			},
			{
				title: 'Conversation Summary',
				description: 'Ringkasan percakapan membantu admin lanjut tanpa membaca semua chat.',
				icon: FileText
			}
		],
		useCases: [
			{
				title: 'Customer tanya menu dan promo',
				description: 'Ningki menjawab cepat dari knowledge bisnis yang sudah disiapkan owner.'
			},
			{
				title: 'Customer ingin order',
				description: 'AI membantu mengumpulkan konteks sebelum masuk ke flow order atau admin.'
			},
			{
				title: 'AI tidak yakin',
				description: 'Chat berhenti di AI dan dilanjutkan admin agar jawaban tetap aman.'
			}
		],
		integrations: [
			{
				title: 'AI Agent',
				description: 'Modul utama yang menjalankan balasan AI dan tool bisnis.',
				href: '/product/ai-agent'
			},
			{
				title: 'Knowledge Base',
				description: 'Sumber jawaban agar AI tidak menjawab asal.',
				href: '/features/knowledge-base'
			},
			{
				title: 'Human Takeover',
				description: 'Fallback aman saat chat butuh admin manusia.',
				href: '/features/human-takeover'
			},
			{
				title: 'WhatsApp CRM',
				description: 'Semua percakapan tersimpan sebagai histori customer.',
				href: '/product/whatsapp-crm'
			}
		],
		related: ['knowledge-base', 'human-takeover', 'inbox-crm']
	},
	'inbox-crm': {
		slug: 'inbox-crm',
		eyebrow: 'Inbox CRM',
		title: 'Inbox WhatsApp yang langsung menyimpan konteks customer.',
		description:
			'Setiap chat pelanggan masuk ke inbox bisnis, terhubung dengan profil customer, status lead, histori order, dan action berikutnya.',
		icon: Inbox,
		mockupType: 'inbox',
		primaryCta: defaultPrimaryCta,
		secondaryCta: { label: 'Lihat Produk Terkait', href: '/product/whatsapp-crm' },
		problem: {
			title: 'Chat bisnis tidak boleh cuma menjadi daftar pesan.',
			description:
				'Inbox CRM membuat chat lebih mudah diprioritaskan, dicari, dan ditindaklanjuti.',
			items: [
				{ title: 'Chat tenggelam', description: 'Pesan penting bisa tertutup chat baru.' },
				{ title: 'Konteks hilang', description: 'Admin tidak langsung tahu histori customer.' },
				{
					title: 'Status lead kabur',
					description: 'Customer hot dan cold terlihat sama di inbox biasa.'
				},
				{
					title: 'Follow-up sulit dilacak',
					description: 'Admin lupa siapa yang harus dibalas ulang.'
				}
			]
		},
		howItWorks: {
			title: 'Dari chat masuk menjadi thread CRM.',
			description: 'Percakapan disimpan, profil diperbarui, lalu masuk ke queue action.',
			steps: [
				{ title: 'Chat masuk', description: 'Pesan customer diterima di inbox bisnis.' },
				{ title: 'Thread dibuat', description: 'Percakapan disusun sebagai conversation.' },
				{ title: 'Profil diperbarui', description: 'Customer 360 menangkap konteks baru.' },
				{ title: 'Lead ditandai', description: 'Status dan prioritas bisa dibaca admin.' },
				{ title: 'Follow-up jalan', description: 'Admin atau AI melanjutkan percakapan.' }
			]
		},
		capabilities: [
			{
				title: 'Conversation Thread',
				description: 'Chat tersusun per customer dan topik.',
				icon: MessageCircle
			},
			{
				title: 'Customer Context',
				description: 'Profil customer tampil di dekat percakapan.',
				icon: ContactRound
			},
			{
				title: 'Lead Status',
				description: 'Tandai customer baru, hot lead, atau perlu follow-up.',
				icon: Lightbulb
			},
			{
				title: 'Follow-up Queue',
				description: 'Daftar percakapan yang perlu dikejar ulang.',
				icon: Timer
			},
			{
				title: 'Admin Assignment',
				description: 'Percakapan bisa diarahkan ke admin yang tepat.',
				icon: UserCheck
			},
			{
				title: 'Searchable History',
				description: 'Histori chat lebih mudah dicari dan dibaca.',
				icon: FileText
			}
		],
		useCases: [
			{
				title: 'Banyak chat masuk bersamaan',
				description: 'Inbox membantu admin memilih customer yang perlu respon lebih dulu.'
			},
			{
				title: 'Customer lama kembali chat',
				description: 'Admin langsung melihat histori dan status customer sebelumnya.'
			},
			{
				title: 'Lead perlu dikejar',
				description: 'Follow-up queue menjaga peluang tidak ikut tenggelam.'
			}
		],
		integrations: [
			{
				title: 'WhatsApp CRM',
				description: 'Basis pengelolaan conversation dan histori.',
				href: '/product/whatsapp-crm'
			},
			{
				title: 'Customer 360',
				description: 'Profil customer diperbarui dari setiap chat.',
				href: '/product/customer-360'
			},
			{
				title: 'Reminder',
				description: 'Chat yang belum selesai masuk queue follow-up.',
				href: '/features/reminder'
			},
			{
				title: 'Dashboard',
				description: 'Ringkasan inbox berubah menjadi insight owner.',
				href: '/product/dashboard'
			}
		],
		related: ['reminder', 'human-takeover', 'ai-reply']
	},
	'automation-flow': {
		slug: 'automation-flow',
		eyebrow: 'Automation Flow',
		title: 'Action otomatis yang tetap menunggu approval owner.',
		description:
			'Nongki membantu membuat draft follow-up, campaign, atau reminder dari insight bisnis, tetapi tidak mengirim massal tanpa persetujuan owner.',
		icon: Workflow,
		mockupType: 'automation',
		primaryCta: defaultPrimaryCta,
		secondaryCta: { label: 'Lihat Produk Terkait', href: '/product/dashboard' },
		problem: {
			title: 'AI boleh menyarankan, owner tetap memutuskan.',
			description:
				'Automation Flow menjaga action tetap berbasis data dan tetap dalam kontrol owner.',
			items: [
				{
					title: 'Campaign tanpa data',
					description: 'Promo sering dibuat dari feeling, bukan sinyal customer.'
				},
				{
					title: 'Follow-up terlupa',
					description: 'Action manual mudah lewat saat operasional ramai.'
				},
				{
					title: 'Owner butuh kontrol',
					description: 'Pesan keluar perlu direview sebelum dikirim.'
				},
				{ title: 'Anti spam', description: 'Action harus terasa relevan, bukan broadcast asal.' }
			]
		},
		howItWorks: {
			title: 'Dari insight menjadi action yang direview.',
			description: 'Sistem menyiapkan draft, owner memutuskan, lalu action baru dikirim.',
			steps: [
				{ title: 'Insight muncul', description: 'Sinyal datang dari chat dan data customer.' },
				{
					title: 'Action disarankan',
					description: 'Sistem memilih follow-up, reminder, atau campaign.'
				},
				{ title: 'Draft dibuat', description: 'AI menyiapkan pesan yang bisa diedit owner.' },
				{ title: 'Owner review', description: 'Owner mengecek isi, segment, dan timing.' },
				{ title: 'Action dikirim', description: 'Pesan berjalan setelah approval.' }
			]
		},
		capabilities: [
			{
				title: 'Campaign Draft',
				description: 'AI menyiapkan draft pesan berbasis insight.',
				icon: Send
			},
			{
				title: 'Segment Selection',
				description: 'Target bisa dipilih dari sinyal Customer 360.',
				icon: ContactRound
			},
			{
				title: 'Approval Gate',
				description: 'Action tidak berjalan tanpa persetujuan owner.',
				icon: CheckCircle2
			},
			{
				title: 'Schedule Action',
				description: 'Action bisa disiapkan untuk waktu yang tepat.',
				icon: Timer
			},
			{
				title: 'Compliance Check',
				description: 'Pesan dijaga agar tidak terasa asal broadcast.',
				icon: ShieldCheck
			},
			{
				title: 'Action History',
				description: 'Riwayat action tetap tersimpan untuk evaluasi.',
				icon: RefreshCw
			}
		],
		useCases: [
			{
				title: 'Customer pasif perlu diaktifkan',
				description: 'Sistem menyarankan campaign ringan untuk segmen yang mulai diam.'
			},
			{
				title: 'Produk sering ditanya',
				description: 'Insight produk populer bisa menjadi draft promo yang owner review.'
			},
			{
				title: 'Lost order perlu follow-up',
				description: 'Customer yang berhenti sebelum checkout masuk draft reminder.'
			}
		],
		integrations: [
			{
				title: 'Dashboard',
				description: 'Insight owner menjadi sumber rekomendasi action.',
				href: '/product/dashboard'
			},
			{
				title: 'Customer 360',
				description: 'Segment dan sinyal customer menjadi target action.',
				href: '/product/customer-360'
			},
			{
				title: 'Reminder',
				description: 'Follow-up berjalan sebagai queue yang bisa direview.',
				href: '/features/reminder'
			},
			{
				title: 'AI Reply',
				description: 'Draft pesan tetap mengikuti tone brand.',
				href: '/features/ai-reply'
			}
		],
		related: ['reminder', 'ai-reply', 'knowledge-base']
	},
	'knowledge-base': {
		slug: 'knowledge-base',
		eyebrow: 'Knowledge Base',
		title: 'Tempat bisnis mengajari Ningki tentang menu, promo, dan aturan layanan.',
		description:
			'Knowledge Base menyimpan informasi bisnis agar AI tidak menjawab asal. Pertanyaan yang gagal dijawab bisa masuk sebagai knowledge gap untuk dilengkapi owner.',
		icon: FileText,
		mockupType: 'knowledge',
		primaryCta: defaultPrimaryCta,
		secondaryCta: { label: 'Lihat Produk Terkait', href: '/features/ai-reply' },
		problem: {
			title: 'AI yang bagus harus punya sumber jawaban yang jelas.',
			description: 'Knowledge Base menjaga jawaban tetap sinkron dengan informasi bisnis terbaru.',
			items: [
				{ title: 'Menu berubah', description: 'Harga, stok, dan varian bisa berubah cepat.' },
				{
					title: 'Promo perlu sinkron',
					description: 'Jam buka dan promo harus selalu up to date.'
				},
				{
					title: 'AI butuh batas',
					description: 'AI tidak boleh menjawab hal yang belum diketahui.'
				},
				{ title: 'Gap perlu dicatat', description: 'Pertanyaan gagal menjadi bahan update owner.' }
			]
		},
		howItWorks: {
			title: 'Knowledge menjadi sumber jawaban Ningki.',
			description: 'Owner mengisi knowledge, AI menggunakannya, gap dicatat untuk perbaikan.',
			steps: [
				{
					title: 'Owner menambah knowledge',
					description: 'Menu, promo, policy, dan FAQ disimpan.'
				},
				{ title: 'Chat masuk', description: 'Customer bertanya lewat WhatsApp.' },
				{ title: 'AI mencari jawaban', description: 'Knowledge menjadi sumber utama response.' },
				{ title: 'Jawaban dikirim', description: 'AI menjawab jika confidence cukup.' },
				{ title: 'Gap dicatat', description: 'Pertanyaan yang gagal masuk daftar perbaikan.' }
			]
		},
		capabilities: [
			{
				title: 'Menu Knowledge',
				description: 'Simpan menu, harga, varian, dan catatan produk.',
				icon: FileText
			},
			{
				title: 'Promo & Policy',
				description: 'Informasi promo dan aturan layanan tetap sinkron.',
				icon: Sparkles
			},
			{
				title: 'RAG-ready Content',
				description: 'Knowledge disusun agar siap dipakai AI reply.',
				icon: Database
			},
			{
				title: 'Knowledge Gap',
				description: 'Pertanyaan gagal ditandai untuk dilengkapi owner.',
				icon: Lightbulb
			},
			{
				title: 'Update History',
				description: 'Perubahan informasi bisnis tetap punya jejak.',
				icon: RefreshCw
			},
			{
				title: 'Safe Boundary',
				description: 'AI diarahkan tidak menjawab di luar sumber.',
				icon: ShieldCheck
			}
		],
		useCases: [
			{
				title: 'Promo berubah setiap minggu',
				description: 'Owner memperbarui knowledge agar AI menjawab promo terbaru.'
			},
			{
				title: 'Customer tanya policy',
				description: 'Ningki menjawab dari aturan yang sudah disetujui bisnis.'
			},
			{
				title: 'Pertanyaan baru muncul',
				description: 'Knowledge gap membantu owner tahu apa yang perlu ditambahkan.'
			}
		],
		integrations: [
			{
				title: 'AI Reply',
				description: 'Knowledge menjadi sumber utama balasan AI.',
				href: '/features/ai-reply'
			},
			{
				title: 'AI Agent',
				description: 'Agent memakai knowledge untuk menjalankan percakapan.',
				href: '/product/ai-agent'
			},
			{
				title: 'Human Takeover',
				description: 'Chat dialihkan jika knowledge belum cukup.',
				href: '/features/human-takeover'
			},
			{
				title: 'Dashboard',
				description: 'Gap dan pertanyaan populer bisa masuk insight.',
				href: '/product/dashboard'
			}
		],
		related: ['ai-reply', 'human-takeover', 'automation-flow']
	},
	'human-takeover': {
		slug: 'human-takeover',
		eyebrow: 'Human Takeover',
		title: 'Admin bisa mengambil alih chat saat AI perlu bantuan manusia.',
		description:
			'Saat percakapan butuh keputusan, komplain, atau validasi, Ningki menyerahkan chat ke admin dengan konteks yang sudah diringkas.',
		icon: UserCheck,
		mockupType: 'humanTakeover',
		primaryCta: defaultPrimaryCta,
		secondaryCta: { label: 'Lihat Produk Terkait', href: '/product/whatsapp-crm' },
		problem: {
			title: 'Tidak semua chat harus dijawab AI.',
			description: 'Human Takeover membuat AI tetap membantu tanpa mengambil keputusan yang salah.',
			items: [
				{
					title: 'Komplain butuh empati',
					description: 'Beberapa percakapan perlu sentuhan manusia.'
				},
				{ title: 'Order perlu validasi', description: 'Detail khusus kadang harus dicek admin.' },
				{ title: 'AI perlu batas aman', description: 'Saat tidak yakin, AI harus berhenti.' },
				{
					title: 'Admin butuh konteks',
					description: 'Ringkasan membantu admin lanjut dengan cepat.'
				}
			]
		},
		howItWorks: {
			title: 'Dari AI ke admin tanpa kehilangan konteks.',
			description: 'Handoff menjaga percakapan tetap rapi dan tetap tercatat di CRM.',
			steps: [
				{
					title: 'Chat sensitif terdeteksi',
					description: 'AI mengenali komplain, ragu, atau validasi khusus.'
				},
				{ title: 'Chat ditandai', description: 'Percakapan masuk prioritas butuh admin.' },
				{ title: 'Konteks diringkas', description: 'Admin melihat ringkasan sebelum membalas.' },
				{ title: 'Admin ambil alih', description: 'Balasan berikutnya dikirim oleh manusia.' },
				{ title: 'Histori tersimpan', description: 'Semua aktivitas tetap masuk ke CRM.' }
			]
		},
		capabilities: [
			{
				title: 'Handoff Trigger',
				description: 'AI tahu kapan harus berhenti menjawab.',
				icon: ShieldCheck
			},
			{
				title: 'Admin Alert',
				description: 'Admin diberi tanda saat chat perlu bantuan.',
				icon: UserCheck
			},
			{
				title: 'Conversation Summary',
				description: 'Konteks percakapan diringkas sebelum takeover.',
				icon: FileText
			},
			{
				title: 'Priority Tag',
				description: 'Chat sensitif bisa diprioritaskan di inbox.',
				icon: Lightbulb
			},
			{
				title: 'Safe Stop',
				description: 'AI tidak memaksakan jawaban saat knowledge tidak cukup.',
				icon: CheckCircle2
			},
			{
				title: 'Customer Timeline',
				description: 'Handoff tetap tercatat di histori customer.',
				icon: ContactRound
			}
		],
		useCases: [
			{
				title: 'Customer komplain',
				description: 'AI berhenti, membuat summary, lalu admin membalas dengan empati.'
			},
			{
				title: 'Reservasi khusus',
				description: 'Admin mengambil alih saat ada permintaan yang perlu validasi manual.'
			},
			{
				title: 'Knowledge belum lengkap',
				description: 'AI tidak menebak jawaban dan mengalihkan chat ke manusia.'
			}
		],
		integrations: [
			{
				title: 'WhatsApp CRM',
				description: 'Takeover terjadi di inbox percakapan.',
				href: '/product/whatsapp-crm'
			},
			{
				title: 'AI Reply',
				description: 'AI Reply menjadi trigger awal handoff.',
				href: '/features/ai-reply'
			},
			{
				title: 'Customer 360',
				description: 'Histori takeover masuk profil customer.',
				href: '/product/customer-360'
			},
			{
				title: 'Inbox CRM',
				description: 'Admin melanjutkan chat dari inbox yang sama.',
				href: '/features/inbox-crm'
			}
		],
		related: ['ai-reply', 'inbox-crm', 'knowledge-base']
	},
	reminder: {
		slug: 'reminder',
		eyebrow: 'Reminder',
		title: 'Follow-up customer yang tidak lagi bergantung pada ingatan admin.',
		description:
			'Nongki membantu menandai customer yang perlu dibalas, order yang belum lanjut, dan pelanggan yang mulai pasif agar owner punya action yang jelas.',
		icon: Timer,
		mockupType: 'reminder',
		primaryCta: defaultPrimaryCta,
		secondaryCta: { label: 'Lihat Produk Terkait', href: '/product/customer-360' },
		problem: {
			title: 'Peluang sering hilang bukan karena tidak tertarik, tapi karena tidak di-follow-up.',
			description: 'Reminder mengubah sinyal chat menjadi queue action yang bisa dikerjakan admin.',
			items: [
				{ title: 'Customer menghilang', description: 'Customer tanya harga lalu tidak lanjut.' },
				{
					title: 'Repeat mulai pasif',
					description: 'Pelanggan lama berhenti order tanpa terdeteksi.'
				},
				{
					title: 'Admin lupa mengejar',
					description: 'Chat yang perlu follow-up tertumpuk operasional.'
				},
				{
					title: 'Owner tidak tahu prioritas',
					description: 'Siapa yang harus dihubungi ulang tidak terlihat.'
				}
			]
		},
		howItWorks: {
			title: 'Dari sinyal chat menjadi follow-up queue.',
			description: 'Nongki menandai peluang, menyiapkan draft, lalu menunggu approval.',
			steps: [
				{ title: 'Sinyal dibaca', description: 'Chat, order, dan histori customer dianalisis.' },
				{ title: 'Status dibuat', description: 'Customer masuk status perlu follow-up.' },
				{ title: 'Queue disusun', description: 'Admin melihat daftar yang harus dikejar.' },
				{ title: 'Draft disiapkan', description: 'AI membuat pesan awal sesuai konteks.' },
				{ title: 'Approve lalu kirim', description: 'Owner atau admin memutuskan action.' }
			]
		},
		capabilities: [
			{
				title: 'Lost Order Reminder',
				description: 'Tandai customer yang berhenti sebelum checkout.',
				icon: Lightbulb
			},
			{
				title: 'At-risk Alert',
				description: 'Customer repeat yang mulai pasif terlihat lebih awal.',
				icon: Timer
			},
			{ title: 'Follow-up Queue', description: 'Daftar action harian untuk admin.', icon: Inbox },
			{
				title: 'Draft Message',
				description: 'AI menyiapkan pesan follow-up yang bisa diedit.',
				icon: Send
			},
			{
				title: 'Owner Approval',
				description: 'Pesan keluar setelah owner atau admin approve.',
				icon: CheckCircle2
			},
			{
				title: 'Action Tracking',
				description: 'Riwayat follow-up tetap tersimpan.',
				icon: RefreshCw
			}
		],
		useCases: [
			{
				title: 'Customer tanya harga lalu hilang',
				description: 'Reminder menjaga calon order masuk queue follow-up.'
			},
			{
				title: 'Repeat customer mulai pasif',
				description: 'Owner mendapat sinyal sebelum pelanggan benar-benar hilang.'
			},
			{
				title: 'Admin punya daftar harian',
				description: 'Follow-up tidak lagi bergantung pada ingatan manual.'
			}
		],
		integrations: [
			{
				title: 'Customer 360',
				description: 'Sinyal reminder datang dari profil customer.',
				href: '/product/customer-360'
			},
			{
				title: 'Dashboard',
				description: 'Owner melihat queue dan hasil follow-up.',
				href: '/product/dashboard'
			},
			{
				title: 'Automation Flow',
				description: 'Draft action masuk approval owner.',
				href: '/features/automation-flow'
			},
			{
				title: 'WhatsApp CRM',
				description: 'Follow-up dikirim dari konteks chat.',
				href: '/product/whatsapp-crm'
			}
		],
		related: ['automation-flow', 'inbox-crm', 'ai-reply']
	}
};
