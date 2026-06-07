<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		y = 24,
		delay = 0,
		duration = 0.55,
		once = true,
		class: className,
		children
	}: {
		y?: number;
		delay?: number;
		duration?: number;
		once?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	let el = $state<HTMLDivElement>();
	let visible = $state(false);

	onMount(() => {
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry) return;

				if (entry.isIntersecting) {
					visible = true;
					if (once) observer.disconnect();
					return;
				}

				if (!once) visible = false;
			},
			{ threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
		);

		observer.observe(el);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class={cn(
		'transition-all ease-out motion-reduce:transform-none motion-reduce:opacity-100',
		visible ? 'translate-y-0 opacity-100' : 'opacity-0',
		className
	)}
	style:transform={visible ? undefined : `translateY(${y}px)`}
	style:transition-delay={`${delay}s`}
	style:transition-duration={`${duration}s`}
>
	{@render children()}
</div>
