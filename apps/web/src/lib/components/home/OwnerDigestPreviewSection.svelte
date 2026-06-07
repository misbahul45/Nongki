<script lang="ts">
	import { onMount } from 'svelte';
	import { ownerDigestPreview } from '$lib/constants/home/landingPage';
	import MockPhone from './MockPhone.svelte';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';

	let phoneWrapEl = $state<HTMLDivElement>();
	let phoneTransform = $state('perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)');

	onMount(() => {
		const currentEl = phoneWrapEl;
		if (!currentEl) return;

		const el: HTMLDivElement = currentEl;
		const mediaQuery = window.matchMedia('(min-width: 1024px)');
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

		function handlePointerMove(event: PointerEvent) {
			if (!mediaQuery.matches || reducedMotion.matches) return;

			const rect = el.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			const rotateY = ((x - centerX) / centerX) * 7;
			const rotateX = -((y - centerY) / centerY) * 7;

			phoneTransform = `perspective(1200px) rotateX(${rotateX.toFixed(
				2
			)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
		}

		function handlePointerLeave() {
			phoneTransform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
		}

		el.addEventListener('pointermove', handlePointerMove);
		el.addEventListener('pointerleave', handlePointerLeave);

		return () => {
			el.removeEventListener('pointermove', handlePointerMove);
			el.removeEventListener('pointerleave', handlePointerLeave);
		};
	});
</script>

<SectionShell variant="primary" class="relative overflow-hidden">
	<div class="relative z-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
		<Reveal>
			<SectionTitle
				eyebrow={ownerDigestPreview.eyebrow}
				title={ownerDigestPreview.title}
				description={ownerDigestPreview.description}
				inverted
			/>

			<div class="mt-7 grid gap-4 sm:grid-cols-2">
				{#each ownerDigestPreview.benefits as benefit (benefit)}
					<div
						class="rounded-3xl border-2 border-primary-foreground/25 bg-primary-foreground/10 p-4 font-bold shadow-[0_5px_0_0_rgba(255,255,255,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary-foreground/15"
					>
						{benefit}
					</div>
				{/each}
			</div>

			<a
				href={ownerDigestPreview.cta.href}
				class="shadow-3d mt-7 inline-flex h-12 items-center justify-center rounded-xl border-2 border-background bg-background px-6 text-sm font-bold text-primary transition-all hover:scale-[1.01] active:translate-y-1"
			>
				{ownerDigestPreview.cta.label}
			</a>
		</Reveal>

		<Reveal
			delay={0.08}
			class="relative flex min-h-[560px] items-center justify-center md:min-h-[620px]"
		>
			<div
				aria-hidden="true"
				class="absolute right-8 bottom-8 left-8 z-0 hidden h-28 rounded-[2rem] lg:block"
			></div>

			<div class="animate-float-soft absolute top-10 -left-2 z-30 hidden md:block">
				<div
					class="shadow-3d rounded-2xl border-2 bg-background px-4 py-3 text-sm font-bold text-foreground"
				>
					{ownerDigestPreview.pills[0]}
				</div>
			</div>

			<!-- floating card kanan -->
			<div class="absolute -right-2 bottom-28 z-30 hidden md:block">
				<div
					class="shadow-3d-secondary rounded-2xl border-2 bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground"
				>
					{ownerDigestPreview.pills[1]}
				</div>
			</div>

			<div
				bind:this={phoneWrapEl}
				class="relative z-20 mx-auto max-w-md transform-gpu transition-transform duration-200 ease-out will-change-transform"
				style:transform={phoneTransform}
			>
				<div
					class="rounded-[2.5rem] p-3 shadow-[0_18px_0_0_rgba(0,0,0,0.24)]"
				>
					<MockPhone
						title="Ningki Digest"
						subtitle="ringkasan owner"
						class="mx-auto text-foreground shadow-[0_14px_0_0_rgba(0,0,0,0.22)]"
					>
						<div
							class="ml-auto max-w-[88%] rounded-3xl border-2 border-primary bg-primary p-5 text-xs leading-relaxed text-primary-foreground shadow-[0_4px_0_0_var(--shadow-3d-primary)]"
						>
							<strong>Ringkasan Hari Ini</strong><br /><br />
							• 12 chat masuk, 3 jadi order<br />
							• 2 hot lead perlu follow-up<br />
							• 1 customer repeat mulai tidak aktif<br />
							• 9 orang tanya menu non-coffee<br /><br />
							Saran: Buat promo Afternoon Coffee Bundle.<br /><br />
							Balas 1 untuk buat follow-up draft.
						</div>

						<div
							class="max-w-[72%] rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-bold text-foreground shadow-[0_3px_0_0_var(--shadow-3d)]"
						>
							1
						</div>

						<div
							class="max-w-[88%] rounded-3xl border-2 border-secondary/50 bg-secondary/20 px-4 py-3 text-xs leading-relaxed font-bold text-foreground"
						>
							Siap. Draft follow-up dibuat dan menunggu approval.
						</div>
					</MockPhone>
				</div>
			</div>

			<!-- floating card bawah -->
			<div class="absolute bottom-8 left-12 z-30 hidden md:block">
				<div
					class="shadow-3d rounded-2xl border-2 bg-background px-4 py-3 text-sm font-bold text-primary"
				>
					Balas 1 untuk draft
				</div>
			</div>
		</Reveal>
	</div>
</SectionShell>
