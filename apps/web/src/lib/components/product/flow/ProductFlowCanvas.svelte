<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { productFlowAnimationConfig } from '$lib/constants/product-flow';
	import ProductFlowArrowLayer from './ProductFlowArrowLayer.svelte';
	import ProductFlowNode from './ProductFlowNode.svelte';
	import ProductMobileFlow from './ProductMobileFlow.svelte';
	import { flowLabelStyle } from './product-flow.utils';
	import type { ProductFlowCanvasData } from './product-flow.types';

	let { flow, animated = false }: { flow: ProductFlowCanvasData; animated?: boolean } = $props();

	let canvasEl = $state<HTMLDivElement>();
	let arrowSvgEl = $state<SVGSVGElement>();

	const nodeById = $derived(new Map(flow.nodes.map((node) => [node.id, node])));
	const isSimpleGrid = $derived(flow.display === 'simpleGrid');
	const simpleGridNodes = $derived(flow.nodes);
	const stepNumberById = $derived(new Map(flow.nodes.map((node, index) => [node.id, index + 1])));

	const wrapperClass = $derived(
		isSimpleGrid
			? 'shadow-3d-lg relative overflow-hidden rounded-3xl border-2 bg-background p-5 md:p-6'
			: 'shadow-3d-lg relative overflow-hidden rounded-3xl border-2 bg-background p-5 md:p-8'
	);

	const animation = productFlowAnimationConfig;

	onMount(() => {
		if (!animated) return;

		let ctx: { revert: () => void } | undefined;
		let observer: IntersectionObserver | undefined;

		async function init() {
			await tick();

			if (!canvasEl || (!isSimpleGrid && !arrowSvgEl)) return;

			const canvas = canvasEl;
			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const gsap = (await import('gsap')).default;

			const paths = arrowSvgEl
				? Array.from(arrowSvgEl.querySelectorAll<SVGPathElement>('[data-flow-path]'))
				: [];

			const heads = arrowSvgEl
				? Array.from(arrowSvgEl.querySelectorAll<SVGPathElement>('[data-flow-head]'))
				: [];

			const dots = arrowSvgEl
				? Array.from(arrowSvgEl.querySelectorAll<SVGCircleElement>('[data-flow-dot]'))
				: [];

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

			gsap.set(dots, animation.dot.from);
			gsap.set(heads, animation.head.from);
			gsap.set(labels, animation.label.from);
			gsap.set(nodes, animation.node.from);

			let hasPlayed = false;

			function play() {
				if (hasPlayed) return;
				hasPlayed = true;

				ctx = gsap.context(() => {
					const tl = gsap.timeline({
						defaults: {
							ease: animation.ease
						}
					});

					if (isSimpleGrid) {
						tl.to(nodes, {
							...animation.node.to,
							stagger: animation.node.stagger
						});

						return;
					}

					if (nodes[0]) {
						tl.to(nodes[0], {
							...animation.node.to,
							duration: animation.node.firstDuration
						});
					}

					paths.forEach((path, index) => {
						const dot = dots[index];
						const head = heads[index];
						const label = labels[index];
						const nextNode = nodes[index + 1];

						if (dot) {
							tl.to(
								dot,
								{
									...animation.dot.to
								},
								animation.overlap.dot
							);
						}

						tl.to(
							path,
							{
								strokeDashoffset: 0,
								duration:
									index === 2 ? animation.path.verticalDuration : animation.path.defaultDuration
							},
							animation.overlap.path
						);

						if (head) {
							tl.to(
								head,
								{
									...animation.head.to
								},
								animation.overlap.head
							);
						}

						if (label) {
							tl.to(
								label,
								{
									...animation.label.to
								},
								animation.overlap.label
							);
						}

						if (nextNode) {
							tl.to(
								nextNode,
								{
									...animation.node.to
								},
								animation.overlap.nextNode
							);
						}
					});
				}, canvas);
			}

			observer = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting && entry.intersectionRatio >= animation.playRatio) {
						play();
						observer?.disconnect();
					}
				},
				{
					threshold: [...animation.observerThreshold]
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

<div class={wrapperClass}>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-60"
	></div>

	<div class="relative z-10">
		{#if isSimpleGrid}
			<div bind:this={canvasEl} class="relative hidden lg:block">
				<div class="grid grid-cols-3 gap-x-8 gap-y-6">
					{#each simpleGridNodes as item (item.id)}
						<div data-flow-node>
							<ProductFlowNode
								{item}
								variant={flow.nodeVariant ?? 'titleOnly'}
								showStepNumber={flow.showStepNumber ?? true}
								stepNumber={stepNumberById.get(item.id)}
							/>
						</div>
					{/each}
				</div>
			</div>

			<ProductMobileFlow
				nodes={flow.nodes}
				variant={flow.nodeVariant ?? 'titleOnly'}
				showStepNumber={flow.showStepNumber ?? true}
			/>
		{:else}
			<div bind:this={canvasEl} class={`relative hidden ${flow.minHeightClass} lg:block`}>
				<ProductFlowArrowLayer {flow} bind:arrowSvgEl />

				{#each flow.connectors as connector (connector.id)}
					{#if connector.label}
						<div
							data-flow-label
							class="shadow-3d-sm absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background px-3 py-1 text-sm font-bold"
							style={flowLabelStyle(
								flow,
								(connector.dot.x + connector.head.x) / 2,
								(connector.dot.y + connector.head.y) / 2
							)}
						>
							{connector.label}
						</div>
					{/if}
				{/each}

				{#each flow.layout as layoutNode (layoutNode.id)}
					{@const item = nodeById.get(layoutNode.id)}

					{#if item}
						<div data-flow-node class={`absolute z-30 ${layoutNode.className}`}>
							<ProductFlowNode {item} variant={flow.nodeVariant ?? 'normal'} />
						</div>
					{/if}
				{/each}
			</div>

			<ProductMobileFlow
				nodes={flow.nodes}
				variant={flow.nodeVariant ?? 'compact'}
				showStepNumber={flow.showStepNumber ?? false}
			/>
		{/if}
	</div>
</div>
