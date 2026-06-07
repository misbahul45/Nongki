<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import { registerDemoUser } from '$lib/auth/demo-auth';
	import { authCopy, businessTypeOptions } from '$lib/constants/auth';

	let form = $state({
		name: '',
		email: '',
		password: '',
		businessName: '',
		businessType: 'coffee_shop'
	});

	let loading = $state(false);
	let error = $state('');
	let message = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		error = '';
		message = '';
		loading = true;

		// TODO: replace demo localStorage auth with SvelteKit server actions calling services/api.
		const result = await registerDemoUser(form);

		loading = false;

		if (!result.ok) {
			error = result.message;
			return;
		}

		message = result.message;
		await goto('/dashboard');
	}
</script>

<AuthShell
	eyebrow={authCopy.register.eyebrow}
	title="Buat akun Nongki"
	description="Daftarkan bisnis F&B kamu dan mulai siapkan workspace demo."
	highlights={['Demo workspace', 'Ningki ready', 'CRM otomatis']}
	mode="register"
>
	<form class="space-y-5" onsubmit={handleSubmit}>
		<Field.Group>
			<Field.Field>
				<Field.Label for="name">Nama owner</Field.Label>
				<Input
					id="name"
					name="name"
					placeholder="Misbahul Muttaqin"
					bind:value={form.name}
					required
				/>
			</Field.Field>

			<Field.Field>
				<Field.Label for="email">Email</Field.Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="owner@nongki.app"
					bind:value={form.email}
					required
				/>
			</Field.Field>

			<Field.Field>
				<Field.Label for="password">Password</Field.Label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Minimal 6 karakter"
					bind:value={form.password}
					required
				/>
			</Field.Field>

			<Field.Field>
				<Field.Label for="businessName">Nama bisnis</Field.Label>
				<Input
					id="businessName"
					name="businessName"
					placeholder="Nongki Coffee"
					bind:value={form.businessName}
					required
				/>
			</Field.Field>

			<Field.Field>
				<Field.Label for="businessType">Tipe bisnis</Field.Label>
				<NativeSelect.Root id="businessType" name="businessType" bind:value={form.businessType}>
					{#each businessTypeOptions as option (option.value)}
						<NativeSelect.Option value={option.value}>{option.label}</NativeSelect.Option>
					{/each}
				</NativeSelect.Root>
				<Field.Description>
					Demo mode: akun tersimpan di browser ini dan password tidak disimpan.
				</Field.Description>
			</Field.Field>
		</Field.Group>

		{#if error}
			<div
				class="rounded-2xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-bold text-destructive"
			>
				{error}
			</div>
		{/if}

		{#if message}
			<div
				class="rounded-2xl border-2 border-primary bg-primary/10 px-4 py-3 text-sm font-bold text-primary"
			>
				{message}
			</div>
		{/if}

		<Button type="submit" class="shadow-3d-primary h-12 w-full rounded-xl" disabled={loading}>
			{loading ? 'Membuat akun...' : authCopy.register.submitLabel}
		</Button>

		<p class="text-center text-sm text-muted-foreground">
			{authCopy.register.footerText}
			<a href={authCopy.register.footerHref} class="font-bold text-primary">
				{authCopy.register.footerLinkLabel}
			</a>
		</p>
	</form>
</AuthShell>
