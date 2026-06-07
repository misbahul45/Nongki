<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { heroOverview } from '$lib/constants/home/landingPage';
	import { landingAnimation } from '$lib/constants/home/landingAnimation';
	import MockPhone from './MockPhone.svelte';
	import WhatsAppBubble from './WhatsAppBubble.svelte';
	import MetricPill from './MetricPill.svelte';
	import GradientDecor from './GradientDecor.svelte';

	const heroAnimation = landingAnimation.hero;

	let sectionEl = $state<HTMLDivElement>();
	let titleEl = $state<HTMLHeadingElement>();
	let descEl = $state<HTMLParagraphElement>();
	let ctaEl = $state<HTMLDivElement>();
	let mockupEl = $state<HTMLDivElement>();

	let gsap: typeof import('gsap').default | undefined;

	onMount(() => {
		let ctx: { revert: () => void } | undefined;

		async function initAnimation() {
			await tick();

			if (!sectionEl || !titleEl || !descEl || !ctaEl || !mockupEl) return;

			const section = sectionEl;
			const title = titleEl;
			const desc = descEl;
			const cta = ctaEl;
			const mockup = mockupEl;

			gsap = (await import('gsap')).default;

			if (!gsap) return;

			ctx = gsap.context(() => {
				const tl = gsap?.timeline(heroAnimation.timeline);

				if (!tl) return;

				tl.from(title, heroAnimation.title)
					.from(desc, heroAnimation.description, heroAnimation.offsets.description)
					.from(cta, heroAnimation.cta, heroAnimation.offsets.cta)
					.from(mockup, heroAnimation.mockup, heroAnimation.offsets.mockup);

				gsap?.to(mockup, heroAnimation.float);
			}, section);
		}

		initAnimation();

		return () => {
			ctx?.revert();
		};
	});

	const ownerMetrics = heroOverview.metrics;
</script>

<section
	class="relative isolate overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-primary/10"
>
	<GradientDecor variant="hero" />
	<div
		bind:this={sectionEl}
		class="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pt-12 pb-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-20"
	>
		<div class="space-y-6">
			<p class="text-xs font-bold tracking-[0.2em] text-primary uppercase">
				{heroOverview.eyebrow}
			</p>

			<h1
				bind:this={titleEl}
				class="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
			>
				{heroOverview.title.before}
				<span class="text-primary"> {heroOverview.title.highlight}</span>
				{heroOverview.title.after}
			</h1>

			<p
				bind:this={descEl}
				class="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
			>
				{heroOverview.description}
			</p>

			<div bind:this={ctaEl} class="flex flex-col gap-3 sm:flex-row">
				{#each heroOverview.actions as action (action.href)}
					<a
						href={action.href}
						class={action.variant === 'primary'
							? 'shadow-3d-primary inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-primary px-6 font-bold text-primary-foreground transition-all active:translate-y-1'
							: 'shadow-3d inline-flex h-12 items-center justify-center rounded-xl border-2 bg-background px-6 font-bold transition-all active:translate-y-1'}
					>
						{action.label}
					</a>
				{/each}
				<a
					href={heroOverview.productLink.href}
					class="inline-flex h-12 items-center justify-center px-2 text-sm font-bold text-primary"
				>
					{heroOverview.productLink.label} →
				</a>
			</div>
		</div>

		<div class="relative w-full" bind:this={mockupEl}>
			<div class="animate-float-soft absolute top-10 -left-3 z-10 hidden md:block">
				<MetricPill value={heroOverview.floatingPills[0]} />
			</div>
			<div class="animate-float-medium absolute -right-2 bottom-20 z-10 hidden md:block">
				<MetricPill value={heroOverview.floatingPills[1]} />
			</div>
			<div class="animate-float-soft absolute -bottom-3 left-20 z-10 hidden lg:block">
				<MetricPill value={heroOverview.floatingPills[2]} />
			</div>

			<Card class="shadow-3d-lg overflow-hidden rounded-3xl border-2">
				<CardContent class="grid gap-4 p-4 md:grid-cols-[0.9fr_1.1fr]">
					<MockPhone title="Ningki" subtitle="AI WhatsApp CRM" class="md:translate-y-4">
						<WhatsAppBubble>Kak menu non-coffee ada?</WhatsAppBubble>
						<WhatsAppBubble variant="outgoing">
							Ada Kak. Hari ini ada Matcha Latte, Chocolate, dan Lychee Tea. Mau saya bantu
							pilihkan?
						</WhatsAppBubble>
						<WhatsAppBubble variant="system">Customer 360 updated</WhatsAppBubble>
						<WhatsAppBubble variant="success">Hot lead score naik ke 87</WhatsAppBubble>
					</MockPhone>

					<div class="grid gap-4">
						<Card class="shadow-3d rounded-3xl border-2">
							<CardHeader>
								<CardTitle>Customer 360</CardTitle>
							</CardHeader>
							<CardContent class="space-y-4">
								<div class="flex items-center gap-3">
									<div
										class="grid size-12 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
									>
										F
									</div>
									<div>
										<p class="font-bold">Faisal</p>
										<p class="text-xs text-muted-foreground">Interest: Non-coffee</p>
									</div>
								</div>
								<div>
									<div class="mb-2 flex justify-between text-xs font-bold">
										<span>Lead score</span>
										<span>87/100</span>
									</div>
									<Progress value={87} />
								</div>
								<div class="grid grid-cols-2 gap-2">
									{#each ownerMetrics as metric (metric.label)}
										<div class="rounded-2xl border-2 bg-muted/40 p-3">
											<p class="text-xs text-muted-foreground">{metric.label}</p>
											<p class="text-xl font-bold">{metric.value}</p>
										</div>
									{/each}
								</div>
							</CardContent>
						</Card>

						<Card
							class="rounded-3xl border-2 bg-primary text-primary-foreground shadow-[0_8px_0_0_var(--shadow-3d-primary)]"
						>
							<CardContent class="space-y-3 p-4">
								<p class="text-sm font-bold">Owner digest mini</p>
								<p class="text-2xl font-bold">Hari ini: 12 chat, 3 order, 2 hot lead</p>
								<p class="text-sm text-primary-foreground/75">
									Saran: buat follow-up promo sore untuk customer non-coffee.
								</p>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</section>
