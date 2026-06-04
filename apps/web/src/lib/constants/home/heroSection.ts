export const heroContent = {
	badge: "AI WhatsApp CRM untuk UMKM F&B",
	title: {
		before: "Ubah chat WhatsApp jadi",
		highlight: "insight bisnis",
		after: "dan action otomatis."
	},
	description:
		"Nongki membantu coffee shop, kafe, dan resto membalas chat pelanggan, mencatat Customer 360, mendeteksi hot lead, dan mengirim ringkasan bisnis langsung ke WhatsApp owner.",
	actions: [
		{
			label: "Coba Sekarang",
			href: "/auth/register",
			variant: "primary"
		},
		{
			label: "Lihat Cara Kerja",
			href: "/docs",
			variant: "outline"
		}
	],
	image: {
		src: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwPERL1en8lrL1yefINMjDQOmu4YAt6kWFiZo5",
		alt: "Ningki Reactive CRM hero illustration"
	}
};

export const heroAnimation = {
	timeline: {
		defaults: {
			duration: 0.8,
			ease: "back.out(1.35)"
		}
	},

	title: {
		y: 40,
		opacity: 0
	},

	description: {
		y: 28,
		opacity: 0
	},

	cta: {
		y: 24,
		opacity: 0
	},

	imageWrap: {
		x: 70,
		y: 30,
		opacity: 0,
		scale: 0.9,
		rotate: 4
	},

	image: {
		scale: 1.08,
		opacity: 0
	},

	float: {
		y: -12,
		rotate: 1.5,
		duration: 2.8,
		ease: "sine.inOut",
		repeat: -1,
		yoyo: true
	},

	offsets: {
		description: "-=0.55",
		cta: "-=0.5",
		imageWrap: "-=0.8",
		image: "-=0.5"
	}
} as const;