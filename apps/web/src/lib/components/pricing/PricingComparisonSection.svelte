<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import Reveal from '$lib/components/home/Reveal.svelte';
	import { pricingComparisonRows } from '$lib/constants/pricing';
	import { CheckCircle2 } from '@lucide/svelte';

	function valueLabel(value: boolean) {
		return value ? 'Tersedia' : 'Belum termasuk';
	}
</script>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<Reveal>
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Comparison</p>
				<h2 class="mt-3 font-heading text-3xl font-black md:text-5xl">
					Bandingkan akses tanpa angka harga final.
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Struktur ini memisahkan fitur dasar, pemakaian AI fleksibel, dan kebutuhan Pro.
				</p>
			</div>
		</Reveal>

		<Reveal delay={0.1} class="mt-10">
			<div class="shadow-3d-lg hidden overflow-hidden rounded-3xl border-2 bg-background lg:block">
				<Table.Root>
					<Table.Header class="bg-muted/40">
						<Table.Row>
							<Table.Head>Feature</Table.Head>
							<Table.Head>Starter</Table.Head>
							<Table.Head>Kredit AI</Table.Head>
							<Table.Head>Pro</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each pricingComparisonRows as row (row.feature)}
							<Table.Row>
								<Table.Cell class="font-bold">{row.feature}</Table.Cell>
								<Table.Cell>
									{#if row.starter}
										<CheckCircle2 class="size-5 text-primary" />
									{:else}
										<span class="text-muted-foreground">—</span>
									{/if}
								</Table.Cell>
								<Table.Cell>
									{#if row.credit}
										<CheckCircle2 class="size-5 text-primary" />
									{:else}
										<span class="text-muted-foreground">—</span>
									{/if}
								</Table.Cell>
								<Table.Cell>
									{#if row.pro}
										<CheckCircle2 class="size-5 text-primary" />
									{:else}
										<span class="text-muted-foreground">—</span>
									{/if}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<div class="grid gap-4 lg:hidden">
				{#each pricingComparisonRows as row (row.feature)}
					<div class="shadow-3d-sm rounded-3xl border-2 bg-background p-5">
						<h3 class="font-heading text-xl font-black">{row.feature}</h3>
						<div class="mt-4 grid gap-2 text-sm">
							<p><span class="font-bold">Starter:</span> {valueLabel(row.starter)}</p>
							<p><span class="font-bold">Kredit AI:</span> {valueLabel(row.credit)}</p>
							<p><span class="font-bold">Pro:</span> {valueLabel(row.pro)}</p>
						</div>
					</div>
				{/each}
			</div>
		</Reveal>
	</div>
</section>
