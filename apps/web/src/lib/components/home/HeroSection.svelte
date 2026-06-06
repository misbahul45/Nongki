<script lang="ts">
	import { onMount, tick } from "svelte";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { heroAnimation, heroContent } from "$lib/constants/home/heroSection";

	let sectionEl = $state<HTMLDivElement>();
	let titleEl = $state<HTMLHeadingElement>();
	let descEl = $state<HTMLParagraphElement>();
	let ctaEl = $state<HTMLDivElement>();
	let imageWrapEl = $state<HTMLDivElement>();
	let imageEl = $state<HTMLImageElement>();

	let imageLoaded = $state(false);
	let imageError = $state(false);

	let gsap: typeof import("gsap").default | undefined;

	onMount(() => {
		let ctx: { revert: () => void } | undefined;

		async function initAnimation() {
			await tick();

			if (!sectionEl || !titleEl || !descEl || !ctaEl || !imageWrapEl) return;

			const section = sectionEl;
			const title = titleEl;
			const desc = descEl;
			const cta = ctaEl;
			const imageWrap = imageWrapEl;

			gsap = (await import("gsap")).default;

			if (!gsap) return;

			ctx = gsap.context(() => {
				const tl = gsap?.timeline(heroAnimation.timeline);

				if (!tl) return;

				tl.from(title, heroAnimation.title)
					.from(desc, heroAnimation.description, heroAnimation.offsets.description)
					.from(cta, heroAnimation.cta, heroAnimation.offsets.cta)
					.from(imageWrap, heroAnimation.imageWrap, heroAnimation.offsets.imageWrap);

				gsap?.to(imageWrap, heroAnimation.float);
			}, section);
		}

		initAnimation();

		return () => {
			ctx?.revert();
		};
	});

	const handleImageLoad = async () => {
		imageLoaded = true;

		await tick();

		if (!imageEl) return;

		const image = imageEl;

		if (!gsap) {
			gsap = (await import("gsap")).default;
		}

		gsap.fromTo(
			image,
			{
				opacity: 0,
				scale: 1.06
			},
			{
				opacity: 1,
				scale: 1,
				duration: 0.7,
				ease: "power3.out"
			}
		);
	};

	const handleImageError = () => {
		imageError = true;
	};
</script>

<div
	bind:this={sectionEl}
	class="mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-10 px-4 pb-8 pt-12 lg:grid lg:grid-cols-2 lg:py-20"
>
	<div class="space-y-6">
		<h1
			bind:this={titleEl}
			class="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
		>
			{heroContent.title.before}
			<span class="text-primary"> {heroContent.title.highlight}</span>
			{heroContent.title.after}
		</h1>

		<p
			bind:this={descEl}
			class="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
		>
			{heroContent.description}
		</p>

		<div bind:this={ctaEl} class="flex flex-col gap-3 sm:flex-row">
			{#each heroContent.actions as action (action.href)}
				<a
					href={action.href}
					class={action.variant === "primary"
						? "inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-primary px-6 font-bold text-primary-foreground shadow-3d-primary transition-all active:translate-y-1"
						: "inline-flex h-12 items-center justify-center rounded-xl border-2 bg-background px-6 font-bold shadow-3d transition-all active:translate-y-1"}
				>
					{action.label}
				</a>
			{/each}
		</div>
	</div>

	<div class="relative w-full">
		<div bind:this={imageWrapEl}>
			<Card class="overflow-hidden rounded-3xl border-2 shadow-3d-lg">
				<CardContent class="relative min-h-65 sm:min-h-90">
					{#if !imageLoaded && !imageError}
						<div class="absolute inset-3 animate-pulse rounded-2xl bg-muted"></div>
					{/if}

					{#if imageError}
						<div
							class="flex min-h-65 items-center justify-center rounded-2xl bg-muted p-8 text-center sm:min-h-90"
						>
							<div>
								<p class="text-lg font-bold">Image gagal dimuat</p>
								<p class="mt-2 text-sm text-muted-foreground">
									Cek URL gambar atau pindahkan image ke folder static.
								</p>
							</div>
						</div>
					{:else}
						<img
							bind:this={imageEl}
							src={heroContent.image.src}
							alt={heroContent.image.alt}
							class="h-auto w-full rounded-2xl object-cover"
							class:opacity-0={!imageLoaded}
							loading="eager"
							decoding="async"
							fetchpriority="high"
							onload={handleImageLoad}
							onerror={handleImageError}
						/>
					{/if}
				</CardContent>
			</Card>
		</div>
	</div>
</div>