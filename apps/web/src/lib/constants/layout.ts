import {
	Bot,
	Building2,
	ChartNoAxesCombined,
	CreditCard,
	FileText,
	Handshake,
	Home,
	Inbox,
	MessageCircle,
	PhoneCall,
	QrCode,
	Settings,
	ShoppingBag,
	Sparkles,
	Users,
	Workflow
} from "@lucide/svelte";

export const siteConfig = {
	name: "Nongki",
	agentName: "Ningki",
	description: "AI-Powered WhatsApp CRM untuk UMKM F&B",
	url: "/"
};

export const mainNavigation = [
	{
		title: "Home",
		href: "/",
		description: "Ringkasan solusi Nongki untuk UMKM F&B.",
		icon: Home
	},
	{
		title: "Produk",
		href: "/product",
		description: "AI WhatsApp CRM dengan Ningki sebagai agent bisnis.",
		icon: Bot
	},
	{
		title: "Harga",
		href: "/pricing",
		description: "Paket harga untuk coffee shop, kafe, dan resto.",
		icon: CreditCard
	},
	{
		title: "Docs",
		href: "/docs",
		description: "Dokumentasi penggunaan dan integrasi Nongki.",
		icon: FileText
	}
];

export const productNavigation = [
	{
		title: "Ningki AI Agent",
		href: "/product/ai-agent",
		description: "AI assistant yang membalas chat, memahami pelanggan, dan menjalankan tool bisnis.",
		icon: Sparkles
	},
	{
		title: "WhatsApp CRM",
		href: "/product/whatsapp-crm",
		description: "Kelola customer, conversation, message history, dan human takeover.",
		icon: MessageCircle
	},
	{
		title: "Customer 360",
		href: "/product/customer-360",
		description: "Lihat profil pelanggan, lead status, total order, dan total reservasi.",
		icon: Users
	},
	{
		title: "Order & Reservation",
		href: "/product/order-reservation",
		description: "Buat order dan reservasi langsung dari percakapan WhatsApp.",
		icon: ShoppingBag
	},
	{
		title: "QRIS Payment",
		href: "/product/qris-payment",
		description: "Generate QRIS, cek pembayaran, dan update status otomatis via webhook.",
		icon: QrCode
	},
	{
		title: "Business Dashboard",
		href: "/product/dashboard",
		description: "Dashboard owner untuk melihat chat, order, reservasi, payment, dan notifikasi.",
		icon: ChartNoAxesCombined
	}
];

export const solutionNavigation = [
	{
		title: "Coffee Shop",
		href: "/solutions/coffee-shop",
		description: "Balas chat menu, promo, order, dan reservasi secara otomatis.",
		icon: Building2
	},
	{
		title: "Cafe & Resto",
		href: "/solutions/cafe-resto",
		description: "Kelola reservasi, customer request, komplain, dan follow-up pembayaran.",
		icon: PhoneCall
	},
	{
		title: "UMKM F&B",
		href: "/solutions/umkm-fnb",
		description: "CRM ringan untuk bisnis kecil tanpa input data manual yang ribet.",
		icon: Handshake
	}
];

export const featureNavigation = [
	{
		title: "AI Reply",
		href: "/features/ai-reply",
		description: "Ningki membalas customer berdasarkan knowledge bisnis.",
		icon: Bot
	},
	{
		title: "Knowledge Base",
		href: "/features/knowledge-base",
		description: "Upload menu, FAQ, promo, SOP, dan dokumen bisnis.",
		icon: FileText
	},
	{
		title: "Inbox CRM",
		href: "/features/inbox-crm",
		description: "Simpan semua chat sebagai conversation dan message history.",
		icon: Inbox
	},
	{
		title: "Human Takeover",
		href: "/features/human-takeover",
		description: "AI berhenti membalas saat customer perlu admin manusia.",
		icon: Users
	},
	{
		title: "Reminder",
		href: "/features/reminder",
		description: "Follow-up pembayaran, reservasi, dan tugas admin.",
		icon: Settings
	},
	{
		title: "Automation Flow",
		href: "/features/automation-flow",
		description: "WhatsApp → AI → CRM → Order → QRIS → Notification.",
		icon: Workflow
	}
];

export const workflowNavigation = [
	{
		title: "Onboarding Owner",
		href: "/workflow/onboarding",
		description: "Owner daftar, membuat workspace bisnis, dan mengisi setup awal.",
		icon: Building2
	},
	{
		title: "Connect WhatsApp",
		href: "/workflow/connect-whatsapp",
		description: "Owner scan QR dan mengaktifkan bot WhatsApp.",
		icon: QrCode
	},
	{
		title: "Upload Knowledge",
		href: "/workflow/upload-knowledge",
		description: "Menu, FAQ, promo, dan dokumen bisnis diproses untuk AI.",
		icon: FileText
	},
	{
		title: "Customer Chat",
		href: "/workflow/customer-chat",
		description: "Pesan pelanggan masuk, disimpan, lalu diteruskan ke Ningki.",
		icon: MessageCircle
	},
	{
		title: "Order / Reservation",
		href: "/workflow/order-reservation",
		description: "AI membantu membuat order atau reservasi dari chat.",
		icon: ShoppingBag
	},
	{
		title: "QRIS & Webhook",
		href: "/workflow/qris-webhook",
		description: "Pembayaran QRIS diproses otomatis sampai owner menerima notifikasi.",
		icon: CreditCard
	}
];

export const authNavigation = {
	login: {
		title: "Masuk",
		href: "/auth/login"
	},
	register: {
		title: "Mulai Gratis",
		href: "/auth/register"
	}
};