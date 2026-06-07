<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import type { ProductPageData } from '$lib/constants/product';

	let { product }: { product: ProductPageData } = $props();
</script>

<section class="bg-primary py-16 text-primary-foreground md:py-28">
	<div class="mx-auto w-full max-w-5xl px-4 text-center">
		<Reveal>
			<div class="space-y-6">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					Siap mencoba {product.title}
				</h2>
				<p class="mx-auto max-w-2xl text-lg text-primary-foreground/85">
					Mulai hubungkan WhatsApp bisnismu dan lihat bagaimana chat berubah menjadi data, insight,
					dan action.
				</p>
				<div class="flex flex-col justify-center gap-3 sm:flex-row">
					<a
						href="/auth/register"
						class="inline-flex h-12 items-center justify-center rounded-xl border-2 border-background bg-background px-6 font-bold text-primary shadow-[0_5px_0_0_var(--shadow-3d-primary)] transition-all active:translate-y-1"
					>
						Mulai Gratis
					</a>
					<a
						href="/docs"
						class="inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary-foreground/70 px-6 font-bold text-primary-foreground shadow-[0_5px_0_0_var(--shadow-3d-primary)] transition-all active:translate-y-1"
					>
						Lihat Docs
					</a>
				</div>
			</div>
		</Reveal>
	</div>
</section>
