<script lang="ts">
	import type { StickyStoryVisualProps } from './sticky-story.types';
	import { getStoryVisualClass } from './sticky-story.utils';

	let { type }: StickyStoryVisualProps = $props();
</script>

<div class={getStoryVisualClass(type)}>
	{#if type === 'bot'}
		<div class="grid gap-3">
			<div class="flex flex-wrap gap-2">
				{#each ['Menu', 'Promo', 'Jam buka', 'Reservasi'] as chip (chip)}
					<span class="rounded-full border-2 bg-background px-3 py-1 text-xs font-bold">
						{chip}
					</span>
				{/each}
			</div>
			<div class="rounded-2xl border-2 bg-background p-3 text-sm font-bold">
				Jawaban mengikuti knowledge bisnis.
			</div>
		</div>
	{:else if type === 'profile'}
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<div
					class="grid size-14 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
				>
					F
				</div>
				<div>
					<p class="text-lg font-bold">Faisal</p>
					<p class="text-sm font-bold text-primary">Hot Lead</p>
				</div>
			</div>
			<div class="grid gap-2 sm:grid-cols-3">
				<div class="rounded-2xl border-2 bg-background p-3">
					<p class="text-xs text-muted-foreground">Lead score</p>
					<p class="text-xl font-bold">87</p>
				</div>
				<div class="rounded-2xl border-2 bg-background p-3 sm:col-span-2">
					<p class="text-xs text-muted-foreground">Interest</p>
					<p class="font-bold">Non-coffee</p>
				</div>
			</div>
		</div>
	{:else if type === 'payment'}
		<div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
			<div class="rounded-2xl border-2 bg-background p-4">
				<p class="text-xs text-muted-foreground">Order</p>
				<p class="mt-1 text-xl font-bold">Coffee Bundle</p>
				<p class="mt-3 text-sm font-bold text-primary">QRIS ready</p>
			</div>
			<div class="grid size-28 place-items-center rounded-2xl border-2 border-dashed bg-background">
				<span class="text-xs font-bold text-muted-foreground">QR</span>
			</div>
		</div>
	{:else if type === 'digest'}
		<div class="space-y-3">
			<div class="rounded-2xl border-2 bg-background p-4">
				<p class="text-sm font-bold">Ringkasan Hari Ini</p>
				<div class="mt-3 grid grid-cols-3 gap-2">
					<div
						class="rounded-xl bg-primary p-2 text-center text-xs font-bold text-primary-foreground"
					>
						12 chat
					</div>
					<div class="rounded-xl bg-secondary p-2 text-center text-xs font-bold">3 order</div>
					<div class="rounded-xl bg-background p-2 text-center text-xs font-bold">2 lead</div>
				</div>
			</div>
			<p class="rounded-2xl border-2 bg-background p-3 text-sm font-bold">
				Saran: buat promo sore.
			</p>
		</div>
	{:else if type === 'approval'}
		<div class="space-y-3">
			<div class="rounded-2xl border-2 bg-background p-4">
				<p class="text-xs text-muted-foreground">Campaign draft</p>
				<p class="mt-1 text-xl font-bold">Afternoon Coffee Bundle</p>
			</div>
			<div class="flex gap-2">
				<div
					class="flex-1 rounded-2xl border-2 border-primary bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
				>
					Approve
				</div>
				<div
					class="flex-1 rounded-2xl border-2 bg-background px-4 py-3 text-center text-sm font-bold"
				>
					Edit
				</div>
			</div>
		</div>
	{:else}
		<div class="grid gap-3">
			<div class="max-w-[78%] rounded-2xl border-2 bg-background p-3 text-sm font-bold">
				Kak menu non-coffee ada?
			</div>
			<div
				class="ml-auto max-w-[82%] rounded-2xl border-2 border-primary bg-primary p-3 text-sm font-bold text-primary-foreground"
			>
				Ada Kak, mau saya bantu pilihkan?
			</div>
		</div>
	{/if}
</div>
