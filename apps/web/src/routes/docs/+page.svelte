<script lang="ts">
	import {
		BookOpen,
		Bot,
		CreditCard,
		LayoutDashboard,
		MessageCircle,
		Workflow
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	const docsItems = [
		{
			title: 'Getting Started',
			description:
				'Panduan membuat workspace, mengatur profil bisnis, dan memahami flow awal Nongki.',
			icon: BookOpen
		},
		{
			title: 'WhatsApp CRM',
			description:
				'Cara chat pelanggan masuk ke inbox, membentuk Customer 360, dan membantu follow-up.',
			icon: MessageCircle
		},
		{
			title: 'AI Agent & Knowledge Base',
			description:
				'Cara Ningki menjawab pertanyaan berdasarkan knowledge bisnis dan melakukan human handoff.',
			icon: Bot
		},
		{
			title: 'QRIS Payment',
			description: 'Cara order/reservasi terhubung ke AstraPay QRIS, webhook, dan status paid.',
			icon: CreditCard
		},
		{
			title: 'Owner Digest',
			description: 'Cara ringkasan harian dan rekomendasi action dikirim ke WhatsApp owner.',
			icon: LayoutDashboard
		},
		{
			title: 'API & Architecture',
			description:
				'Panduan teknis arsitektur backend, AI orchestration, messaging layer, dan integrasi payment.',
			icon: Workflow
		}
	];
</script>

<svelte:head>
	<title>Docs | Nongki</title>
	<meta
		name="description"
		content="Dokumentasi Nongki sedang disiapkan untuk WhatsApp CRM, AI Agent, Customer 360, QRIS Payment, dan Owner Digest."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-background px-4 py-16 md:py-28">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,var(--primary)_0%,transparent_34%),radial-gradient(circle_at_top_right,var(--secondary)_0%,transparent_30%)] opacity-10"
	></div>

	<div
		class="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
	>
		<div>
			<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Docs</p>

			<h1 class="mt-4 max-w-4xl font-heading text-4xl leading-tight font-black md:text-6xl">
				Dokumentasi Nongki sedang disiapkan.
			</h1>

			<p class="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
				Kami sedang menyusun panduan teknis dan workflow agar owner, developer, dan tim operasional
				bisa memahami cara kerja Nongki dari WhatsApp CRM, AI Agent, Customer 360, QRIS Payment,
				sampai Owner Digest.
			</p>

			<div class="mt-8 grid gap-3 sm:flex">
				<Button href="/" size="lg" class="w-full sm:w-auto">Kembali ke Home</Button>
				<Button href="/product" size="lg" variant="outline" class="w-full sm:w-auto">
					Lihat Produk
				</Button>
			</div>
		</div>

		<Card.Root class="shadow-3d-lg rounded-3xl border-2 bg-background">
			<Card.Header>
				<div
					class="shadow-3d-sm grid size-14 place-items-center rounded-2xl border-2 bg-primary text-primary-foreground"
				>
					<BookOpen class="size-7" />
				</div>

				<Card.Title class="font-heading text-3xl font-black">Still in development</Card.Title>

				<Card.Description class="text-base leading-relaxed">
					Dokumentasi sedang dibangun bertahap. Untuk sementara, kamu bisa mengeksplorasi halaman
					Product, Features, Solutions, dan Pricing.
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-5">
				<div>
					<div class="mb-2 flex items-center justify-between text-sm font-bold">
						<span>Docs readiness</span>
						<span class="text-primary">35%</span>
					</div>
					<Progress value={35} />
				</div>

				<div class="grid gap-3 sm:grid-cols-3">
					<div class="rounded-2xl border-2 bg-muted/40 p-4">
						<p class="text-xs font-bold text-muted-foreground">Status</p>
						<p class="mt-1 font-heading text-xl font-black">Drafting</p>
					</div>
					<div class="rounded-2xl border-2 bg-muted/40 p-4">
						<p class="text-xs font-bold text-muted-foreground">Focus</p>
						<p class="mt-1 font-heading text-xl font-black">MVP</p>
					</div>
					<div class="rounded-2xl border-2 bg-muted/40 p-4">
						<p class="text-xs font-bold text-muted-foreground">Next</p>
						<p class="mt-1 font-heading text-xl font-black">API Docs</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</section>

<section class="bg-muted/40 px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Coming Soon</p>
			<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">Panduan yang akan tersedia.</h2>
			<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
				Dokumentasi akan disusun dari kebutuhan owner sampai teknis integrasi sistem.
			</p>
		</div>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each docsItems as item (item.title)}
				{@const Icon = item.icon}

				<Card.Root
					class="shadow-3d-sm hover:shadow-3d-lg h-full rounded-3xl border-2 bg-background transition-all duration-300 hover:-translate-y-1"
				>
					<Card.Header>
						<div
							class="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
						>
							<Icon class="size-5" />
						</div>
						<Card.Title class="font-heading text-xl font-black">{item.title}</Card.Title>
						<Card.Description class="leading-relaxed">{item.description}</Card.Description>
					</Card.Header>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>

<section class="bg-primary px-4 py-16 text-primary-foreground md:py-24">
	<div class="mx-auto max-w-4xl text-center">
		<p class="text-sm font-black tracking-[0.18em] uppercase opacity-80">Nongki Docs</p>
		<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
			Sambil menunggu dokumentasi lengkap, coba alur produknya dulu.
		</h2>
		<p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed opacity-85">
			Mulai dari Product, Features, dan Solutions untuk memahami gambaran besar Nongki.
		</p>
		<div class="mt-8 grid gap-3 sm:flex sm:justify-center">
			<Button
				href="/product"
				size="lg"
				class="border-background bg-background text-primary hover:bg-background/90"
			>
				Lihat Produk
			</Button>
			<Button
				href="/features/ai-reply"
				size="lg"
				variant="outline"
				class="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
			>
				Lihat Fitur AI Reply
			</Button>
		</div>
	</div>
</section>
