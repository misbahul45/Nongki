<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ownerDigestPreview } from '$lib/constants/home/landingPage';
	import MetricPill from './MetricPill.svelte';
	import MockPhone from './MockPhone.svelte';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';
	import WhatsAppBubble from './WhatsAppBubble.svelte';
</script>

<SectionShell variant="primary">
	<div class="grid gap-10 lg:grid-cols-2 lg:items-center">
		<Reveal>
			<SectionTitle
				eyebrow={ownerDigestPreview.eyebrow}
				title={ownerDigestPreview.title}
				description={ownerDigestPreview.description}
				inverted
			/>
			<div class="mt-6 grid gap-3 sm:grid-cols-2">
				{#each ownerDigestPreview.benefits as benefit (benefit)}
					<div
						class="rounded-2xl border-2 border-primary-foreground/25 bg-primary-foreground/10 p-3 text-sm font-bold"
					>
						{benefit}
					</div>
				{/each}
			</div>
			<Button href={ownerDigestPreview.cta.href} variant="secondary" class="mt-6">
				{ownerDigestPreview.cta.label}
			</Button>
		</Reveal>

		<Reveal delay={0.08} class="relative">
			<div class="animate-float-soft absolute top-12 -left-2 z-10 hidden md:block">
				<MetricPill value={ownerDigestPreview.pills[0]} />
			</div>
			<div class="animate-float-medium absolute -right-1 bottom-20 z-10 hidden md:block">
				<MetricPill value={ownerDigestPreview.pills[1]} />
			</div>
			<MockPhone
				title="Ningki Digest"
				subtitle="ringkasan owner"
				class="mx-auto max-w-sm text-foreground"
			>
				<WhatsAppBubble variant="outgoing">
					<strong>Ringkasan Hari Ini</strong><br /><br />
					• 12 chat masuk, 3 jadi order<br />
					• 2 hot lead perlu follow-up<br />
					• 1 customer repeat mulai tidak aktif<br />
					• 9 orang tanya menu non-coffee<br /><br />
					Saran: Buat promo Afternoon Coffee Bundle.<br /><br />
					Balas 1 untuk buat follow-up draft.
				</WhatsAppBubble>
				<WhatsAppBubble>1</WhatsAppBubble>
				<WhatsAppBubble variant="success">
					Siap. Draft follow-up dibuat dan menunggu approval.
				</WhatsAppBubble>
			</MockPhone>
		</Reveal>
	</div>
</SectionShell>
