<script lang="ts">
	import type { SolutionMockupType } from '$lib/constants/solutions';

	let { type }: { type: SolutionMockupType } = $props();
</script>

<div class="shadow-3d-lg w-full overflow-hidden rounded-[2rem] border-2 bg-background p-5">
	{#if type === 'coffee'}
		<div class="space-y-4">
			<div class="flex items-center justify-between border-b-2 pb-4">
				<div>
					<p class="font-heading text-xl font-bold">Coffee Shop Inbox</p>
					<p class="text-sm text-muted-foreground">Menu, promo, repeat customer</p>
				</div>
				<span class="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
					>Live</span
				>
			</div>

			<div class="rounded-3xl border-2 bg-muted/40 p-4">
				<p class="text-xs font-bold text-muted-foreground">Customer</p>
				<p class="mt-2 font-bold">Kak menu non-coffee ada?</p>
			</div>
			<div class="ml-8 rounded-3xl border-2 border-primary bg-primary p-4 text-primary-foreground">
				<p class="text-xs font-bold text-primary-foreground/80">Ningki</p>
				<p class="mt-2 font-bold">Ada. Kamu bisa coba matcha latte atau chocolate series.</p>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<div class="rounded-2xl border-2 bg-primary/5 p-4">
					<p class="text-xs font-bold text-muted-foreground">Interest</p>
					<p class="mt-2 font-heading text-lg font-bold">Non-coffee</p>
				</div>
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs font-bold text-muted-foreground">Action</p>
					<p class="mt-2 font-heading text-lg font-bold">Follow-up ready</p>
				</div>
			</div>
		</div>
	{:else if type === 'cafeResto'}
		<div class="grid gap-4 md:grid-cols-[1fr_0.9fr]">
			<div class="space-y-4">
				<div class="rounded-3xl border-2 bg-primary/5 p-4">
					<p class="font-heading text-xl font-bold">Reservasi Rani</p>
					<p class="mt-1 text-sm text-muted-foreground">Sabtu, 19.00 WIB</p>
					<div class="mt-4 grid grid-cols-3 gap-2">
						<span class="rounded-xl border-2 bg-background p-2 text-center text-xs font-bold"
							>12 Jun</span
						>
						<span class="rounded-xl border-2 bg-background p-2 text-center text-xs font-bold"
							>19.00</span
						>
						<span class="rounded-xl border-2 bg-background p-2 text-center text-xs font-bold"
							>6 pax</span
						>
					</div>
				</div>
				<div class="rounded-3xl border-2 bg-muted/40 p-4">
					<p class="text-xs font-bold text-muted-foreground">Order status</p>
					<p class="mt-2 font-heading text-lg font-bold">Confirmed</p>
				</div>
			</div>
			<div class="rounded-3xl border-2 bg-background p-4 text-center">
				<div
					class="mx-auto grid aspect-square max-w-36 grid-cols-5 gap-1 rounded-2xl border-2 bg-muted/40 p-3"
				>
					{#each Array(25) as _, index (index)}
						<span
							class={`rounded-sm ${index % 3 === 0 || index % 7 === 0 ? 'bg-foreground' : 'bg-background'}`}
						></span>
					{/each}
				</div>
				<p class="mt-4 rounded-full bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
					Owner notified
				</p>
			</div>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="rounded-3xl border-2 bg-muted/40 p-4">
				<p class="text-xs font-bold text-muted-foreground">Product inquiry</p>
				<p class="mt-2 font-bold">Brownies hampers masih ada untuk Jumat?</p>
			</div>
			<div class="grid gap-3 sm:grid-cols-3">
				<div class="rounded-2xl border-2 bg-primary/5 p-4">
					<p class="text-xs text-muted-foreground">Repeat</p>
					<p class="mt-2 font-heading text-xl font-bold">12</p>
				</div>
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs text-muted-foreground">Seasonal</p>
					<p class="mt-2 font-heading text-xl font-bold">Hampers</p>
				</div>
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs text-muted-foreground">Paid</p>
					<p class="mt-2 font-heading text-xl font-bold">QRIS</p>
				</div>
			</div>
			<div class="rounded-3xl border-2 bg-background p-4">
				<p class="text-xs font-bold text-muted-foreground">Campaign draft</p>
				<p class="mt-2 font-bold">Kirim reminder pre-order hampers ke customer repeat.</p>
			</div>
		</div>
	{/if}
</div>
