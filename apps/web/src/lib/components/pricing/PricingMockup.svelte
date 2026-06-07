<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import * as Card from '$lib/components/ui/card';
	import { pricingCreditSignals } from '$lib/constants/pricing';
	import { QrCode } from '@lucide/svelte';
</script>

<div class="shadow-3d-lg rounded-[2rem] border-2 bg-muted/40 p-4">
	<Card.Root class="shadow-3d overflow-hidden rounded-3xl border-2 bg-background">
		<Card.Header
			class="bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-primary-foreground"
		>
			<p class="text-sm font-black opacity-80">Kredit AI</p>
			<Card.Title class="font-heading text-4xl font-black">320 credits</Card.Title>
			<Card.Description class="text-primary-foreground/80">
				Balance demo untuk AI reply, insight, digest, dan campaign draft.
			</Card.Description>
		</Card.Header>

		<Card.Content class="space-y-5 p-5">
			<div>
				<div class="mb-2 flex items-center justify-between text-sm font-bold">
					<span>Pemakaian bulan ini</span>
					<span class="text-primary">64%</span>
				</div>
				<Progress value={64} />
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				{#each pricingCreditSignals as signal (signal.label)}
					{@const Icon = signal.icon}
					<div class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 p-4">
						<div class="flex items-center justify-between gap-3">
							<p class="text-sm font-bold text-muted-foreground">{signal.label}</p>
							<Icon class="size-4 text-primary" />
						</div>
						<p class="mt-2 font-heading text-2xl font-black">{signal.value}</p>
					</div>
				{/each}
			</div>

			<div
				class="shadow-3d-sm grid gap-4 rounded-2xl border-2 bg-primary/5 p-4 sm:grid-cols-[auto_1fr] sm:items-center"
			>
				<div class="grid size-24 place-items-center rounded-2xl border-2 bg-background">
					<QrCode class="size-12 text-primary" />
				</div>
				<div>
					<p class="font-heading text-xl font-black">Top-up via AstraPay QRIS</p>
					<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
						Owner memilih nominal kredit, bayar QRIS, lalu webhook mengaktifkan kredit.
					</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
