<script lang="ts">
	import type { FeatureMockupType } from '$lib/constants/features';

	let { type }: { type: FeatureMockupType } = $props();

	const knowledgeChips = ['Menu', 'Promo', 'Jam buka'];
	const inboxItems = [
		{ name: 'Fira', status: 'Hot lead', text: 'Tanya paket ulang tahun' },
		{ name: 'Bima', status: 'Follow-up', text: 'Belum checkout QRIS' },
		{ name: 'Rani', status: 'Repeat', text: 'Tanya menu non-coffee' }
	];
	const docs = ['Menu Non-Coffee', 'Promo Sore', 'Policy Reservasi'];
	const reminderItems = ['Lost order', 'At-risk customer', 'Draft ready'];
</script>

<div class="shadow-3d-lg rounded-3xl border-2 bg-background p-5">
	{#if type === 'aiReply'}
		<div class="space-y-4">
			<div class="shadow-3d-sm max-w-[82%] rounded-2xl border-2 bg-muted/40 p-4">
				<p class="text-xs font-black text-muted-foreground uppercase">Customer</p>
				<p class="mt-2 font-bold">Kak menu non-coffee ada?</p>
			</div>

			<div
				class="shadow-3d-primary ml-auto max-w-[88%] rounded-2xl border-2 bg-primary p-4 text-primary-foreground"
			>
				<p class="text-xs font-black uppercase opacity-80">Ningki</p>
				<p class="mt-2 font-bold">
					Ada. Kamu bisa pilih matcha latte, chocolate, atau lychee tea. Mau saya kirim menu?
				</p>
			</div>

			<div class="flex flex-wrap gap-2">
				{#each knowledgeChips as chip (chip)}
					<span class="rounded-full border-2 bg-muted/40 px-3 py-1 text-xs font-black">
						{chip}
					</span>
				{/each}
			</div>

			<div class="shadow-3d-sm rounded-2xl border-2 bg-primary/5 p-4">
				<p class="text-sm font-black text-primary">Jawaban dari knowledge bisnis</p>
				<p class="mt-1 text-sm text-muted-foreground">
					Jika knowledge belum cukup, chat dialihkan ke admin.
				</p>
			</div>
		</div>
	{:else if type === 'inbox'}
		<div class="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
			<div class="space-y-3">
				{#each inboxItems as item (item.name)}
					<div class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 p-3">
						<div class="flex items-center justify-between gap-3">
							<p class="font-heading font-black">{item.name}</p>
							<span
								class="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-black text-primary"
							>
								{item.status}
							</span>
						</div>
						<p class="mt-2 text-sm text-muted-foreground">{item.text}</p>
					</div>
				{/each}
			</div>

			<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
				<p class="text-xs font-black tracking-[0.14em] text-primary uppercase">Customer Context</p>
				<h3 class="mt-3 font-heading text-2xl font-black">Fira</h3>
				<div class="mt-4 grid gap-3">
					<div class="rounded-xl border-2 bg-muted/40 p-3">
						<p class="text-sm font-bold">Lead score</p>
						<p class="text-2xl font-black text-primary">82</p>
					</div>
					<div class="rounded-xl border-2 bg-muted/40 p-3">
						<p class="text-sm font-bold">Next action</p>
						<p class="text-sm text-muted-foreground">Follow-up paket keluarga sore ini.</p>
					</div>
				</div>
			</div>
		</div>
	{:else if type === 'automation'}
		<div class="space-y-4">
			<div class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 p-4">
				<p class="text-xs font-black tracking-[0.14em] text-primary uppercase">Campaign Draft</p>
				<h3 class="mt-3 font-heading text-2xl font-black">Promo repeat customer</h3>
				<p class="mt-2 text-muted-foreground">
					Halo, menu favorit kamu lagi tersedia hari ini. Mau kami bantu siapkan order?
				</p>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
					<p class="text-sm font-black">Segment</p>
					<p class="mt-2 text-sm text-muted-foreground">Repeat customer at-risk</p>
				</div>
				<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
					<p class="text-sm font-black">Schedule</p>
					<p class="mt-2 text-sm text-muted-foreground">Hari ini 16.00</p>
				</div>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<button
					class="rounded-2xl border-2 bg-primary px-4 py-3 font-black text-primary-foreground"
				>
					Approve
				</button>
				<button class="rounded-2xl border-2 bg-background px-4 py-3 font-black">Edit</button>
			</div>
		</div>
	{:else if type === 'knowledge'}
		<div class="space-y-4">
			<div class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 px-4 py-3">
				<p class="text-sm font-bold text-muted-foreground">Cari knowledge...</p>
			</div>

			<div class="grid gap-3">
				{#each docs as doc (doc)}
					<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
						<p class="font-heading text-lg font-black">{doc}</p>
						<p class="mt-1 text-sm text-muted-foreground">Updated by owner</p>
					</div>
				{/each}
			</div>

			<div class="shadow-3d-primary rounded-2xl border-2 border-primary bg-primary/5 p-4">
				<p class="font-heading text-xl font-black text-primary">Knowledge Gap: 3 pertanyaan</p>
				<p class="mt-2 text-sm text-muted-foreground">Pertanyaan baru siap dilengkapi owner.</p>
			</div>
		</div>
	{:else if type === 'humanTakeover'}
		<div class="space-y-4">
			<div class="shadow-3d-primary rounded-2xl border-2 bg-primary p-4 text-primary-foreground">
				<p class="text-xs font-black uppercase opacity-80">Ningki</p>
				<p class="mt-2 font-bold">Saya hubungkan ke admin ya, supaya bisa dibantu lebih tepat.</p>
			</div>

			<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
				<div class="flex items-center justify-between gap-3">
					<h3 class="font-heading text-xl font-black">Admin needed</h3>
					<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
						Priority
					</span>
				</div>
				<p class="mt-3 text-muted-foreground">
					Customer komplain soal order kemarin dan butuh validasi manual.
				</p>
			</div>

			<div class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 p-4">
				<p class="text-sm font-black">Context summary</p>
				<p class="mt-2 text-sm text-muted-foreground">
					Order #1042, pembayaran paid, customer minta penggantian menu.
				</p>
			</div>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 p-4">
				<p class="text-xs font-black tracking-[0.14em] text-primary uppercase">Follow-up Queue</p>
				<h3 class="mt-3 font-heading text-2xl font-black">3 action hari ini</h3>
			</div>

			{#each reminderItems as item, index (item)}
				<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
					<div class="flex items-center gap-3">
						<div
							class="grid size-9 place-items-center rounded-xl bg-primary text-xs font-black text-primary-foreground"
						>
							{String(index + 1).padStart(2, '0')}
						</div>
						<div>
							<p class="font-heading font-black">{item}</p>
							<p class="text-sm text-muted-foreground">Draft follow-up siap direview.</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
