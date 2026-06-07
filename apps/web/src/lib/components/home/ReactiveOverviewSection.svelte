<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { reactiveOverview } from '$lib/constants/home/landingPage';
	import ReactiveFlowNode from './ReactiveFlowNode.svelte';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';

	let canvasEl = $state<HTMLDivElement>();
	let arrowSvgEl = $state<SVGSVGElement>();

	onMount(() => {
		let ctx: { revert: () => void } | undefined;
		let observer: IntersectionObserver | undefined;

		async function init() {
			await tick();

			if (!canvasEl || !arrowSvgEl) return;

			const canvas = canvasEl;
			const arrowSvg = arrowSvgEl;
			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const gsap = (await import('gsap')).default;

			const paths = Array.from(arrowSvg.querySelectorAll<SVGPathElement>('[data-flow-path]'));
			const heads = Array.from(arrowSvg.querySelectorAll<SVGPathElement>('[data-flow-head]'));
			const dots = Array.from(arrowSvg.querySelectorAll<SVGCircleElement>('[data-flow-dot]'));
			const nodes = Array.from(canvas.querySelectorAll<HTMLElement>('[data-flow-node]'));
			const labels = Array.from(canvas.querySelectorAll<HTMLElement>('[data-flow-label]'));

			paths.forEach((path) => {
				const length = path.getTotalLength();
				path.style.strokeDasharray = `${length}`;
				path.style.strokeDashoffset = `${length}`;
			});

			if (prefersReducedMotion) {
				paths.forEach((path) => {
					path.style.strokeDashoffset = '0';
				});

				gsap.set([...heads, ...dots, ...labels, ...nodes], {
					opacity: 1,
					y: 0,
					scale: 1
				});

				return;
			}

			gsap.set(dots, {
				opacity: 0,
				scale: 0.35,
				transformOrigin: 'center'
			});

			gsap.set(heads, {
				opacity: 0,
				scale: 0.4,
				transformOrigin: 'center'
			});

			gsap.set(labels, {
				opacity: 0,
				y: 6,
				scale: 0.96
			});

			gsap.set(nodes, {
				opacity: 0,
				y: 18,
				scale: 0.96
			});

			let hasPlayed = false;

			function play() {
				if (hasPlayed) return;
				hasPlayed = true;

				ctx = gsap.context(() => {
					const tl = gsap.timeline({
						defaults: {
							ease: 'power2.out'
						}
					});

					tl.to(nodes[0], {
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.35
					});

					paths.forEach((path, index) => {
						tl.to(
							dots[index],
							{
								opacity: 1,
								scale: 1,
								duration: 0.14
							},
							'-=0.02'
						)
							.to(
								path,
								{
									strokeDashoffset: 0,
									duration: index === 2 ? 0.7 : 0.56
								},
								'-=0.01'
							)
							.to(
								heads[index],
								{
									opacity: 1,
									scale: 1,
									duration: 0.16
								},
								'-=0.1'
							)
							.to(
								labels[index],
								{
									opacity: 1,
									y: 0,
									scale: 1,
									duration: 0.18
								},
								'-=0.22'
							)
							.to(
								nodes[index + 1],
								{
									opacity: 1,
									y: 0,
									scale: 1,
									duration: 0.34
								},
								'-=0.08'
							);
					});
				}, canvas);
			}

			observer = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting && entry.intersectionRatio >= 0.35) {
						play();
						observer?.disconnect();
					}
				},
				{
					threshold: [0, 0.25, 0.35, 0.5]
				}
			);

			observer.observe(canvas);
		}

		init();

		return () => {
			observer?.disconnect();
			ctx?.revert();
		};
	});
</script>

<SectionShell variant="soft">
	<Reveal>
		<SectionTitle
			title={reactiveOverview.title}
			description={reactiveOverview.description}
			align="center"
		/>
	</Reveal>

	<Reveal delay={0.08}>
		<div
			bind:this={canvasEl}
			class="shadow-3d-lg relative mt-12 overflow-hidden rounded-3xl border-2 bg-background p-5 md:p-7"
		>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-60"
			></div>

			<div class="relative z-10">
				<div class="relative hidden min-h-[820px] lg:block">
					<svg
						bind:this={arrowSvgEl}
						class="pointer-events-none absolute inset-0 z-10 h-full w-full"
						viewBox="0 0 1000 820"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<path
							data-flow-path
							d="M 272 128 C 300 76, 348 76, 376 128"
							class="stroke-secondary"
							fill="none"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>

						<path
							data-flow-head
							d="M 0 -5 L 10 0 L 0 5 z"
							class="fill-secondary"
							transform="translate(376 128) rotate(62)"
						></path>

						<path
							data-flow-path
							d="M 622 128 C 650 76, 698 76, 726 128"
							class="stroke-primary"
							fill="none"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>

						<path
							data-flow-head
							d="M 0 -5 L 10 0 L 0 5 z"
							class="fill-primary"
							transform="translate(726 128) rotate(62)"
						></path>

						<path
							data-flow-path
							d="M 728 360 C 662 392, 662 448, 728 480"
							class="stroke-accent"
							fill="none"
							stroke-width="3.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>

						<path
							data-flow-head
							d="M 0 -5 L 10 0 L 0 5 z"
							class="fill-accent"
							transform="translate(728 480) rotate(28)"
						></path>

						<path
							data-flow-path
							d="M 728 692 C 698 744, 650 744, 622 692"
							class="stroke-secondary"
							fill="none"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>

						<path
							data-flow-head
							d="M 0 -5 L 10 0 L 0 5 z"
							class="fill-secondary"
							transform="translate(622 692) rotate(242)"
						></path>

						<path
							data-flow-path
							d="M 376 692 C 348 744, 300 744, 272 692"
							class="stroke-primary"
							fill="none"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>

						<path
							data-flow-head
							d="M 0 -5 L 10 0 L 0 5 z"
							class="fill-primary"
							transform="translate(272 692) rotate(242)"
						></path>

						<circle data-flow-dot cx="272" cy="128" r="4.5" class="fill-secondary"></circle>
						<circle data-flow-dot cx="622" cy="128" r="4.5" class="fill-primary"></circle>
						<circle data-flow-dot cx="728" cy="360" r="5" class="fill-accent"></circle>
						<circle data-flow-dot cx="728" cy="692" r="4.5" class="fill-secondary"></circle>
						<circle data-flow-dot cx="376" cy="692" r="4.5" class="fill-primary"></circle>
					</svg>

					<div
						data-flow-label
						class="shadow-3d-sm absolute top-[8%] left-[26%] z-20 rounded-full border-2 bg-background px-3 py-1 text-[11px] font-bold"
					>
						intent detected
					</div>

					<div
						data-flow-label
						class="shadow-3d-sm absolute top-[8%] left-[60%] z-20 rounded-full border-2 bg-background px-3 py-1 text-[11px] font-bold"
					>
						profile updated
					</div>

					<div
						data-flow-label
						class="shadow-3d-sm absolute top-[49%] right-[22%] z-20 rounded-full border-2 bg-background px-3 py-1 text-[11px] font-bold"
					>
						insight generated
					</div>

					<div
						data-flow-label
						class="shadow-3d-sm absolute bottom-[8%] left-[60%] z-20 rounded-full border-2 bg-background px-3 py-1 text-[11px] font-bold"
					>
						digest sent
					</div>

					<div
						data-flow-label
						class="shadow-3d-sm absolute bottom-[8%] left-[26%] z-20 rounded-full border-2 bg-background px-3 py-1 text-[11px] font-bold"
					>
						owner decides
					</div>

					<div data-flow-node class="absolute top-[16%] left-[2%] z-30 w-[24.5%]">
						<ReactiveFlowNode item={reactiveOverview.flow[0]} />
					</div>

					<div data-flow-node class="absolute top-[16%] left-[38%] z-30 w-[24.5%]">
						<ReactiveFlowNode item={reactiveOverview.flow[1]} />
					</div>

					<div data-flow-node class="absolute top-[16%] right-[2%] z-30 w-[24.5%]">
						<ReactiveFlowNode item={reactiveOverview.flow[2]} />
					</div>

					<div data-flow-node class="absolute right-[2%] bottom-[16%] z-30 w-[24.5%]">
						<ReactiveFlowNode item={reactiveOverview.flow[3]} />
					</div>

					<div data-flow-node class="absolute bottom-[16%] left-[38%] z-30 w-[24.5%]">
						<ReactiveFlowNode item={reactiveOverview.flow[4]} />
					</div>

					<div data-flow-node class="absolute bottom-[16%] left-[2%] z-30 w-[24.5%]">
						<ReactiveFlowNode item={reactiveOverview.flow[5]} />
					</div>
				</div>

				<div class="grid gap-4 lg:hidden">
					{#each reactiveOverview.flow as item, index (item.id)}
						<ReactiveFlowNode {item} compact />

						{#if index < reactiveOverview.flow.length - 1}
							<div class="flex justify-center">
								<div class="flex h-10 flex-col items-center">
									<div class="h-7 w-0.5 rounded-full bg-primary/50"></div>
									<div
										class="size-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-primary"
									></div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</Reveal>

	<Reveal delay={0.12}>
		<div class="mt-8 grid gap-2 md:grid-cols-3">
			{#each reactiveOverview.comparisons as item, index (item.title)}
				<Card
					class={index === 2
						? 'shadow-3d-primary rounded-3xl border-2 border-primary bg-primary/5'
						: 'shadow-3d-sm rounded-3xl border-2 bg-background'}
				>
					<CardContent class="p-4">
						<h3 class="font-bold">{item.title}</h3>
						<p class="mt-2 text-sm text-muted-foreground">{item.description}</p>
					</CardContent>
				</Card>
			{/each}
		</div>

		<div class="mt-6 text-center">
			<Button href={reactiveOverview.cta.href}>{reactiveOverview.cta.label}</Button>
		</div>
	</Reveal>
</SectionShell>