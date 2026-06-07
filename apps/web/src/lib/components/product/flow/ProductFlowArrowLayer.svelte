<script lang="ts">
	import { fillToneClass, strokeToneClass } from './product-flow.utils';
	import type { ProductFlowCanvasData } from './product-flow.types';

	let {
		flow,
		arrowSvgEl = $bindable()
	}: {
		flow: ProductFlowCanvasData;
		arrowSvgEl?: SVGSVGElement;
	} = $props();
</script>

<svg
	bind:this={arrowSvgEl}
	class="pointer-events-none absolute inset-0 z-10 h-full w-full"
	viewBox={flow.viewBox}
	preserveAspectRatio="none"
	aria-hidden="true"
>
	{#each flow.connectors as connector (connector.id)}
		<path
			data-flow-path
			d={connector.path}
			class={strokeToneClass(connector.tone)}
			fill="none"
			stroke-width={connector.tone === 'accent' ? '3.5' : '3'}
			stroke-linecap="round"
			stroke-linejoin="round"
		></path>

		<path
			data-flow-head
			d="M 0 -5 L 10 0 L 0 5 z"
			class={fillToneClass(connector.tone)}
			transform={`translate(${connector.head.x} ${connector.head.y}) rotate(${connector.head.rotate})`}
		></path>

		<circle
			data-flow-dot
			cx={connector.dot.x}
			cy={connector.dot.y}
			r={connector.tone === 'accent' ? '5' : '4.5'}
			class={fillToneClass(connector.tone)}
		></circle>
	{/each}
</svg>
