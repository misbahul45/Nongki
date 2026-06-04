<script lang="ts">
	import { onMount } from "svelte";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { heroAnimation, heroContent } from "$lib/constants/home/heroSection";

	let sectionEl: HTMLDivElement;
	let titleEl: HTMLHeadingElement;
	let descEl: HTMLParagraphElement;
	let ctaEl: HTMLDivElement;
	let imageWrapEl: HTMLDivElement;
	let imageEl: HTMLImageElement;

	onMount(() => {
		let ctx: { revert: () => void } | undefined;

		async function initAnimation() {
			const { default: gsap } = await import("gsap");

			ctx = gsap.context(() => {
				const tl = gsap.timeline(heroAnimation.timeline);

				tl.from(titleEl, heroAnimation.title)
					.from(descEl, heroAnimation.description, heroAnimation.offsets.description)
					.from(ctaEl, heroAnimation.cta, heroAnimation.offsets.cta)
					.from(imageWrapEl, heroAnimation.imageWrap, heroAnimation.offsets.imageWrap)
					.from(imageEl, heroAnimation.image, heroAnimation.offsets.image);

				gsap.to(imageWrapEl, heroAnimation.float);
			}, sectionEl);
		}

		initAnimation();

		return () => {
			ctx?.revert();
		};
	});
</script>

<div
	bind:this={sectionEl}
	class="mx-auto flex flex-col-reverse lg:grid w-full max-w-7xl items-center gap-10 px-4 lg:py-20 pb-8 pt-12 lg:grid-cols-2"
>
	<div class="space-y-6">
		<h1 bind:this={titleEl} class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
			{heroContent.title.before}
			<span class="text-primary"> {heroContent.title.highlight}</span>
			{heroContent.title.after}
		</h1>

		<p bind:this={descEl} class="max-w-xl text-medium leading-relaxed text-muted-foreground">
			{heroContent.description}
		</p>

		<div bind:this={ctaEl} class="flex flex-col gap-3 sm:flex-row">
			{#each heroContent.actions as action}
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

	<div class="relative">
		<div bind:this={imageWrapEl}>
			<Card class="overflow-hidden rounded-3xl border-2 shadow-3d-lg">
				<CardContent>
					<img
						bind:this={imageEl}
						src={heroContent.image.src}
						alt={heroContent.image.alt}
						class="h-auto w-full rounded-2xl object-cover"
						loading="eager"
						decoding="async"
					/>
				</CardContent>
			</Card>
		</div>
	</div>
</div>