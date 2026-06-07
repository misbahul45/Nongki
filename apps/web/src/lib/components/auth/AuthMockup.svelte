<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	let { mode }: { mode: 'login' | 'register' } = $props();
</script>

<div class="shadow-3d-lg rounded-[2rem] border-2 bg-muted/40 p-4">
	<Card.Root class="shadow-3d rounded-3xl border-2 bg-background">
		<Card.Header>
			<div class="flex flex-wrap gap-2">
				{#if mode === 'register'}
					<Badge variant="outline" class="rounded-full border-2 bg-primary/5 font-bold">
						Demo workspace
					</Badge>
					<Badge variant="outline" class="rounded-full border-2 bg-secondary/20 font-bold">
						AI ready
					</Badge>
					<Badge variant="outline" class="rounded-full border-2 bg-accent/10 font-bold">
						QRIS next
					</Badge>
				{:else}
					<Badge variant="outline" class="rounded-full border-2 bg-primary/5 font-bold">
						Owner digest
					</Badge>
					<Badge variant="outline" class="rounded-full border-2 bg-secondary/20 font-bold">
						Hot lead
					</Badge>
					<Badge variant="outline" class="rounded-full border-2 bg-accent/10 font-bold">
						Follow-up
					</Badge>
				{/if}
			</div>

			<Card.Title>
				{mode === 'register' ? 'Workspace setup' : 'Dashboard preview'}
			</Card.Title>
			<Card.Description>
				{mode === 'register'
					? 'Akun demo menyiapkan workspace, onboarding, dan agent Ningki.'
					: 'Masuk ke dashboard untuk melihat chat, lead, order, dan digest.'}
			</Card.Description>
		</Card.Header>

		<Card.Content class="space-y-4">
			{#if mode === 'register'}
				<div class="rounded-2xl border-2 bg-muted/40 p-4">
					<p class="text-xs font-bold text-muted-foreground">Onboarding</p>
					<p class="mt-1 text-2xl font-bold">Ningki ready</p>
					<div class="mt-4">
						<div class="mb-2 flex justify-between text-xs font-bold">
							<span>Progress</span>
							<span>25%</span>
						</div>
						<Progress value={25} />
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-2">
					<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
						<p class="text-xs text-muted-foreground">Business</p>
						<p class="mt-1 font-heading text-xl font-bold">Coffee Shop</p>
					</div>
					<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
						<p class="text-xs text-muted-foreground">Agent</p>
						<p class="mt-1 font-heading text-xl font-bold">Ningki</p>
					</div>
				</div>

				<div class="shadow-3d-primary rounded-2xl border-2 border-primary bg-primary/5 p-4">
					<p class="text-sm font-bold text-primary">Next step</p>
					<p class="mt-1 text-sm text-muted-foreground">
						Hubungkan WhatsApp dan upload knowledge menu.
					</p>
				</div>
			{:else}
				<div class="grid gap-3 sm:grid-cols-3">
					<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
						<p class="text-xs text-muted-foreground">Chat</p>
						<p class="mt-1 text-2xl font-bold">12</p>
					</div>
					<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
						<p class="text-xs text-muted-foreground">Order</p>
						<p class="mt-1 text-2xl font-bold">3</p>
					</div>
					<div class="shadow-3d-sm rounded-2xl border-2 bg-background p-4">
						<p class="text-xs text-muted-foreground">Hot lead</p>
						<p class="mt-1 text-2xl font-bold">2</p>
					</div>
				</div>

				<div
					class="shadow-3d-primary rounded-2xl border-2 bg-[linear-gradient(135deg,var(--primary),var(--accent))] p-4 text-primary-foreground"
				>
					<p class="text-sm font-bold">Owner digest</p>
					<p class="mt-2 text-xl font-bold">Promo sore siap dibuat</p>
					<p class="mt-2 text-sm text-primary-foreground/85">
						9 customer tanya menu non-coffee hari ini.
					</p>
				</div>

				<div class="rounded-2xl border-2 bg-background p-4">
					<div class="flex items-center justify-between gap-3">
						<p class="text-sm font-bold">Follow-up queue</p>
						<Badge variant="outline" class="rounded-full border-2 bg-primary/5 text-xs font-bold">
							2 pending
						</Badge>
					</div>
					<p class="mt-1 text-sm text-muted-foreground">2 customer perlu dibalas sebelum malam.</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
