<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { getDemoAuthUser, loginDemoUser } from '$lib/auth/demo-auth';
	import { authCopy } from '$lib/constants/auth';

	let form = $state({
		email: '',
		password: ''
	});

	let loading = $state(false);
	let error = $state('');
	let message = $state('');

	function useLastDemoAccount() {
		const user = getDemoAuthUser();

		if (!user) {
			error = 'Belum ada akun demo tersimpan. Silakan daftar dulu.';
			return;
		}

		form.email = user.email;
		error = '';
		message = 'Email akun demo terakhir sudah diisi.';
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		error = '';
		message = '';
		loading = true;

		// TODO: replace demo localStorage auth with SvelteKit server actions calling services/api.
		const result = await loginDemoUser(form);

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
	eyebrow={authCopy.login.eyebrow}
	title="Masuk ke Nongki"
	description="Lanjutkan mengelola chat, customer, order, dan digest dari dashboard."
	highlights={['Inbox CRM', 'Customer 360', 'Owner digest']}
	mode="login"
>
	<form class="space-y-5" onsubmit={handleSubmit}>
		<Field.Group>
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
			{loading ? 'Masuk...' : authCopy.login.submitLabel}
		</Button>

		<Button
			type="button"
			variant="outline"
			class="shadow-3d h-12 w-full rounded-xl"
			onclick={useLastDemoAccount}
		>
			Gunakan akun demo terakhir
		</Button>

		<p class="text-center text-xs text-muted-foreground">
			Demo mode: akun tersimpan di browser ini.
		</p>

		<p class="text-center text-sm text-muted-foreground">
			{authCopy.login.footerText}
			<a href={authCopy.login.footerHref} class="font-bold text-primary">
				{authCopy.login.footerLinkLabel}
			</a>
		</p>
	</form>
</AuthShell>
