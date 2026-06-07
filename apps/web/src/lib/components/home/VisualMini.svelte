<script lang="ts">
	import {
		BarChart3,
		Check,
		Database,
		FileText,
		MessageCircle,
		QrCode,
		Send
	} from '@lucide/svelte';
	import type { VisualType } from '$lib/constants/home/landingPage';

	let { type = 'chat', compact = false }: { type?: VisualType; compact?: boolean } = $props();
</script>

<div class="relative overflow-hidden rounded-2xl border-2 border-border bg-muted/40 p-3">
	{#if type === 'chat'}
		<div class="grid gap-2">
			<div class="mr-10 rounded-2xl border-2 bg-background p-2 text-xs">
				Kak menu non-coffee ada?
			</div>
			<div
				class="ml-8 rounded-2xl border-2 border-primary bg-primary p-2 text-xs text-primary-foreground"
			>
				Ada Kak. Matcha, Chocolate, Lychee Tea.
			</div>
		</div>
	{:else if type === 'profile'}
		<div class="flex items-center gap-3">
			<div class="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
				F
			</div>
			<div class="min-w-0 flex-1">
				<div class="h-3 w-24 rounded-full bg-foreground/20"></div>
				<div class="mt-2 h-2 w-32 rounded-full bg-foreground/10"></div>
			</div>
		</div>
		<div class="mt-4 grid gap-2">
			<div class="h-2 rounded-full bg-secondary"></div>
			<div class="h-2 w-2/3 rounded-full bg-primary"></div>
		</div>
	{:else if type === 'chart'}
		<div class="flex h-28 items-end gap-2">
			{#each [45, 70, 52, 88, 63] as height, i (i)}
				<div class="flex-1 rounded-t-xl bg-primary" style:height={`${height}%`}></div>
			{/each}
		</div>
	{:else if type === 'campaign'}
		<div class="space-y-2">
			<div class="rounded-xl border-2 bg-background p-3 text-xs font-bold">
				Afternoon Coffee Bundle
			</div>
			<div class="flex gap-2">
				<div
					class="flex-1 rounded-xl border-2 border-primary bg-primary px-3 py-2 text-center text-xs font-bold text-primary-foreground"
				>
					Approve
				</div>
				<div
					class="flex-1 rounded-xl border-2 bg-background px-3 py-2 text-center text-xs font-bold"
				>
					Edit
				</div>
			</div>
		</div>
	{:else if type === 'knowledge'}
		<div class="grid gap-2">
			<div class="flex items-center gap-2 rounded-xl border-2 bg-background p-2">
				<FileText class="size-4 text-primary" />
				<span class="text-xs font-bold">Menu.pdf</span>
			</div>
			<div class="flex items-center gap-2 rounded-xl border-2 bg-background p-2">
				<Database class="size-4 text-primary" />
				<span class="text-xs font-bold">FAQ tersimpan</span>
			</div>
		</div>
	{:else if type === 'payment'}
		<div class="grid grid-cols-[1fr_auto] gap-3">
			<div class="space-y-2">
				<div class="h-3 w-24 rounded-full bg-foreground/20"></div>
				<div class="h-2 w-16 rounded-full bg-foreground/10"></div>
				<div
					class="inline-flex items-center gap-1 rounded-full bg-secondary/30 px-2 py-1 text-xs font-bold"
				>
					<Check class="size-3" /> Paid
				</div>
			</div>
			<div class="grid size-20 place-items-center rounded-xl border-2 bg-background">
				<QrCode class="size-10 text-primary" />
			</div>
		</div>
	{:else if type === 'digest'}
		<div class="space-y-2 text-xs">
			<div class="rounded-xl border-2 bg-background p-2 font-bold">Ringkasan Hari Ini</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="rounded-xl bg-primary p-2 text-center font-bold text-primary-foreground">
					12 chat
				</div>
				<div class="rounded-xl bg-secondary p-2 text-center font-bold">3 order</div>
				<div class="rounded-xl bg-background p-2 text-center font-bold">2 lead</div>
			</div>
		</div>
	{:else}
		<div class="flex items-center justify-between gap-3">
			<MessageCircle class="size-8 text-primary" />
			<Send class="size-8 text-secondary-foreground" />
			<BarChart3 class="size-8 text-accent" />
		</div>
	{/if}
</div>
