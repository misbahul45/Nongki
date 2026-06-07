<script lang="ts">
	import type { ProductMockupType } from '$lib/constants/product';

	let { type }: { type: ProductMockupType } = $props();
</script>

<div class="shadow-3d-lg w-full overflow-hidden rounded-[2rem] border-2 bg-background p-5">
	{#if type === 'agent'}
		<div class="space-y-4">
			<div class="flex items-center justify-between border-b-2 pb-4">
				<div>
					<p class="font-heading text-xl font-bold">Ningki AI</p>
					<p class="text-sm text-muted-foreground">Confidence 92%</p>
				</div>
				<span class="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
					>Live</span
				>
			</div>
			<div class="rounded-3xl border-2 bg-muted/40 p-4">
				<p class="text-xs font-bold text-muted-foreground">Customer</p>
				<p class="mt-2 font-bold">Ada menu rice bowl yang cocok buat makan siang?</p>
			</div>
			<div class="ml-8 rounded-3xl border-2 border-primary bg-primary p-4 text-primary-foreground">
				<p class="text-xs font-bold text-primary-foreground/80">AI Reply</p>
				<p class="mt-2 font-bold">
					Ada. Untuk makan siang, Chicken Sambal Matah paling sering dipilih.
				</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<span class="rounded-full border-2 bg-background px-3 py-1 text-xs font-bold">Menu</span>
				<span class="rounded-full border-2 bg-background px-3 py-1 text-xs font-bold">Harga</span>
				<span class="rounded-full border-2 bg-background px-3 py-1 text-xs font-bold"
					>Rekomendasi</span
				>
			</div>
		</div>
	{:else if type === 'chat'}
		<div class="grid min-h-[360px] gap-4 md:grid-cols-[0.82fr_1.18fr]">
			<div class="space-y-3">
				{#each ['Fina', 'Raka', 'Dewi'] as name, index (name)}
					<div
						class={`rounded-2xl border-2 p-3 ${index === 0 ? 'border-primary bg-primary/5' : 'bg-muted/40'}`}
					>
						<div class="flex items-center justify-between gap-3">
							<p class="font-bold">{name}</p>
							<span class="text-xs font-bold text-primary">{index === 0 ? 'Hot' : 'New'}</span>
						</div>
						<p class="mt-1 truncate text-xs text-muted-foreground">Mau tanya paket reservasi...</p>
					</div>
				{/each}
			</div>
			<div class="rounded-3xl border-2 bg-muted/40 p-4">
				<div class="flex items-center justify-between border-b-2 pb-3">
					<div>
						<p class="font-heading text-lg font-bold">Fina</p>
						<p class="text-xs text-muted-foreground">Lead status: Hot</p>
					</div>
					<span class="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
						>Follow-up</span
					>
				</div>
				<div class="mt-4 space-y-3">
					<div class="max-w-[82%] rounded-2xl border-2 bg-background p-3 text-sm font-bold">
						Ada meja untuk 6 orang?
					</div>
					<div
						class="ml-auto max-w-[82%] rounded-2xl border-2 border-primary bg-primary p-3 text-sm font-bold text-primary-foreground"
					>
						Ada. Mau saya bantu cek jamnya?
					</div>
					<div class="rounded-2xl border-2 bg-background p-3 text-xs text-muted-foreground">
						Summary: tertarik reservasi grup, perlu follow-up hari ini.
					</div>
				</div>
			</div>
		</div>
	{:else if type === 'profile'}
		<div class="space-y-4">
			<div class="flex items-center gap-4 rounded-3xl border-2 bg-primary/5 p-4">
				<div
					class="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-2xl font-black text-primary-foreground"
				>
					F
				</div>
				<div>
					<p class="font-heading text-xl font-bold">Fina Rahma</p>
					<p class="text-sm text-muted-foreground">Last interaction: 12 menit lalu</p>
				</div>
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs font-bold text-muted-foreground">Lead score</p>
					<p class="mt-2 font-heading text-3xl font-bold text-primary">86</p>
				</div>
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs font-bold text-muted-foreground">Favorite product</p>
					<p class="mt-2 font-bold">Rice Bowl</p>
				</div>
			</div>
			<div class="rounded-3xl border-2 bg-background p-4">
				<p class="text-xs font-bold text-muted-foreground">Next best action</p>
				<p class="mt-2 font-bold">Kirim promo lunch bundle sebelum jam 11.00.</p>
			</div>
		</div>
	{:else if type === 'payment'}
		<div class="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
			<div class="space-y-3 rounded-3xl border-2 bg-muted/40 p-4">
				<p class="font-heading text-xl font-bold">Order #NGK-1082</p>
				<div class="flex justify-between border-b-2 pb-2 text-sm">
					<span>Chicken bowl x2</span><b>Rp78k</b>
				</div>
				<div class="flex justify-between border-b-2 pb-2 text-sm">
					<span>Iced tea x2</span><b>Rp24k</b>
				</div>
				<div class="flex justify-between text-base font-black">
					<span>Total</span><span>Rp102k</span>
				</div>
			</div>
			<div class="rounded-3xl border-2 bg-background p-4 text-center">
				<div
					class="mx-auto grid aspect-square max-w-44 grid-cols-5 gap-1 rounded-2xl border-2 bg-muted/40 p-3"
				>
					{#each Array(25) as _, index (index)}
						<span
							class={`rounded-sm ${index % 3 === 0 || index % 7 === 0 ? 'bg-foreground' : 'bg-background'}`}
						></span>
					{/each}
				</div>
				<p class="mt-4 rounded-full bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
					Waiting payment
				</p>
			</div>
		</div>
	{:else if type === 'dashboard'}
		<div class="space-y-4">
			<div class="grid gap-3 sm:grid-cols-3">
				{#each [{ label: 'Hot lead', value: '18' }, { label: 'Lost order', value: '5' }, { label: 'Asked menu', value: '42' }] as stat (stat.label)}
					<div class="rounded-2xl border-2 bg-muted/40 p-4">
						<p class="text-xs font-bold text-muted-foreground">{stat.label}</p>
						<p class="mt-2 font-heading text-3xl font-bold">{stat.value}</p>
					</div>
				{/each}
			</div>
			<div class="rounded-3xl border-2 bg-primary/5 p-4">
				<p class="font-heading text-xl font-bold">Owner Digest</p>
				<p class="mt-2 text-sm text-muted-foreground">
					Lunch bundle sering ditanya. Ada 7 lead yang belum dibalas lebih dari 1 jam.
				</p>
			</div>
			<div class="space-y-2">
				{#each ['Follow-up Fina untuk reservasi', 'Review promo weekday', 'Cek menu paling sering ditanya'] as insight (insight)}
					<div class="rounded-2xl border-2 bg-background px-4 py-3 text-sm font-bold">
						{insight}
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="rounded-3xl border-2 bg-primary/5 p-4">
				<p class="font-heading text-xl font-bold">Reservasi Fina</p>
				<p class="text-sm text-muted-foreground">Sabtu, 19.00 WIB</p>
			</div>
			<div class="grid gap-3 sm:grid-cols-3">
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs text-muted-foreground">Date</p>
					<b>12 Jun</b>
				</div>
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs text-muted-foreground">Time</p>
					<b>19.00</b>
				</div>
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs text-muted-foreground">Pax</p>
					<b>6 orang</b>
				</div>
			</div>
			<div class="rounded-3xl border-2 bg-background p-4">
				<p class="text-xs font-bold text-muted-foreground">Confirmation</p>
				<p class="mt-2 font-bold">Meja indoor, dekat jendela, status confirmed.</p>
			</div>
			<p
				class="rounded-full bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
			>
				Confirmed
			</p>
		</div>
	{/if}
</div>
