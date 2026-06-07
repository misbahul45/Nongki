Betul. Jangan build form dari scratch. Prompt auth-nya harus diarahkan supaya **pakai component UI existing**: `button`, `input`, `field`, `label`, `card`, `select/native-select` kalau ada, bukan bikin wrapper input custom sendiri. Di codebase juga sudah ada komponen UI seperti `button`, `input`, `field`, `label`, `card`, dan lain-lain di `src/lib/components/ui/*`, jadi auth UI harus memanfaatkan itu. 

Pakai prompt revisi ini:

```txt
Kamu adalah senior SvelteKit 5 engineer.

Tugas kamu membangun UI Auth Register dan Login untuk Nongki App.

PENTING:
Jangan build form component dari scratch.
Gunakan reusable component UI yang sudah ada di codebase:
- src/lib/components/ui/button
- src/lib/components/ui/input
- src/lib/components/ui/field
- src/lib/components/ui/label
- src/lib/components/ui/card
- src/lib/components/ui/native-select jika perlu select
- src/lib/components/ui/separator jika perlu pembatas

Jangan buat AuthInput custom kalau isinya hanya wrapper input biasa.
Gunakan langsung komponen UI bawaan project agar style konsisten.

Route existing:
- src/routes/auth/register/+page.svelte
- src/routes/auth/register/+page.ts
- src/routes/auth/login/+page.svelte
- src/routes/auth/login/+page.ts

Target:
1. Bangun UI register dan login dummy.
2. Register dummy simpan user ke localStorage.
3. Login dummy validasi dari localStorage.
4. Setelah sukses redirect ke /dashboard.
5. Tetap siapkan arsitektur API best practice SvelteKit.
6. Jangan akses database langsung dari frontend.
7. Nanti production harus lewat SvelteKit server action yang call services/api.
8. Style harus mengikuti Nongki existing:
   rounded-3xl, border-2, shadow-3d, bg-background, bg-muted/40, bg-primary.

==================================================
A. FILE YANG DIBUAT
==================================================

Buat constants:

src/lib/constants/auth.ts

Buat helper dummy:

src/lib/auth/demo-auth.ts

Buat component auth layout saja:

src/lib/components/auth/AuthShell.svelte
src/lib/components/auth/AuthMockup.svelte

JANGAN buat:
src/lib/components/auth/AuthInput.svelte
src/lib/components/auth/AuthSubmitButton.svelte

Karena input dan button wajib pakai UI existing.

==================================================
B. AUTH CONSTANTS
==================================================

Buat:

src/lib/constants/auth.ts

Isi:

export const authCopy = {
	register: {
		eyebrow: 'Mulai dengan Nongki',
		title: 'Buat workspace WhatsApp CRM pertamamu.',
		description:
			'Daftarkan bisnis F&B kamu, siapkan Ningki, lalu mulai ubah chat pelanggan menjadi data dan action.',
		submitLabel: 'Buat Akun Demo',
		footerText: 'Sudah punya akun?',
		footerLinkLabel: 'Masuk',
		footerHref: '/auth/login',
		highlights: [
			'Workspace bisnis otomatis dibuat',
			'Onboarding siap dilanjutkan',
			'Ningki default agent disiapkan'
		]
	},
	login: {
		eyebrow: 'Masuk ke Nongki',
		title: 'Lanjutkan mengelola chat pelangganmu.',
		description:
			'Masuk ke dashboard untuk melihat inbox WhatsApp CRM, Customer 360, order, pembayaran, dan owner digest.',
		submitLabel: 'Masuk Demo',
		footerText: 'Belum punya akun?',
		footerLinkLabel: 'Daftar',
		footerHref: '/auth/register',
		highlights: ['Inbox CRM', 'Customer 360', 'Order & QRIS', 'Owner dashboard']
	}
};

export const demoAuthStorageKey = 'nongki_demo_auth_user';

export type DemoAuthUser = {
	id: string;
	name: string;
	email: string;
	businessName: string;
	businessType: string;
	createdAt: string;
};

export const businessTypeOptions = [
	{
		value: 'coffee_shop',
		label: 'Coffee Shop'
	},
	{
		value: 'cafe_resto',
		label: 'Cafe / Resto'
	},
	{
		value: 'bakery_dessert',
		label: 'Bakery / Dessert'
	},
	{
		value: 'cloud_kitchen',
		label: 'Cloud Kitchen'
	},
	{
		value: 'other_fnb',
		label: 'UMKM F&B Lainnya'
	}
];

==================================================
C. DUMMY AUTH HELPER
==================================================

Buat:

src/lib/auth/demo-auth.ts

Isi:

import { browser } from '$app/environment';
import { demoAuthStorageKey, type DemoAuthUser } from '$lib/constants/auth';

export type RegisterPayload = {
	name: string;
	email: string;
	password: string;
	businessName: string;
	businessType: string;
};

export type LoginPayload = {
	email: string;
	password: string;
};

export type DemoAuthResult =
	| {
			ok: true;
			user: DemoAuthUser;
			message: string;
	  }
	| {
			ok: false;
			message: string;
	  };

export function getDemoAuthUser() {
	if (!browser) return null;

	const raw = localStorage.getItem(demoAuthStorageKey);

	if (!raw) return null;

	try {
		return JSON.parse(raw) as DemoAuthUser;
	} catch {
		localStorage.removeItem(demoAuthStorageKey);
		return null;
	}
}

export async function registerDemoUser(payload: RegisterPayload): Promise<DemoAuthResult> {
	if (!browser) {
		return {
			ok: false,
			message: 'Demo auth hanya berjalan di browser.'
		};
	}

	if (!payload.name.trim()) {
		return {
			ok: false,
			message: 'Nama owner wajib diisi.'
		};
	}

	if (!payload.email.includes('@')) {
		return {
			ok: false,
			message: 'Email belum valid.'
		};
	}

	if (payload.password.length < 6) {
		return {
			ok: false,
			message: 'Password minimal 6 karakter.'
		};
	}

	if (!payload.businessName.trim()) {
		return {
			ok: false,
			message: 'Nama bisnis wajib diisi.'
		};
	}

	const user: DemoAuthUser = {
		id: crypto.randomUUID(),
		name: payload.name.trim(),
		email: payload.email.trim().toLowerCase(),
		businessName: payload.businessName.trim(),
		businessType: payload.businessType,
		createdAt: new Date().toISOString()
	};

	localStorage.setItem(demoAuthStorageKey, JSON.stringify(user));

	return {
		ok: true,
		user,
		message: 'Akun demo berhasil dibuat.'
	};
}

export async function loginDemoUser(payload: LoginPayload): Promise<DemoAuthResult> {
	if (!browser) {
		return {
			ok: false,
			message: 'Demo auth hanya berjalan di browser.'
		};
	}

	const user = getDemoAuthUser();

	if (!user) {
		return {
			ok: false,
			message: 'Belum ada akun demo. Silakan daftar dulu.'
		};
	}

	if (user.email !== payload.email.trim().toLowerCase()) {
		return {
			ok: false,
			message: 'Email tidak cocok dengan akun demo.'
		};
	}

	if (payload.password.length < 6) {
		return {
			ok: false,
			message: 'Password minimal 6 karakter.'
		};
	}

	return {
		ok: true,
		user,
		message: 'Login demo berhasil.'
	};
}

export function logoutDemoUser() {
	if (!browser) return;
	localStorage.removeItem(demoAuthStorageKey);
}

==================================================
D. AuthShell.svelte
==================================================

Buat:

src/lib/components/auth/AuthShell.svelte

Gunakan shadcn Card dari UI.

Isi:

<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import AuthMockup from './AuthMockup.svelte';

	let {
		eyebrow,
		title,
		description,
		highlights = [],
		mode,
		children
	}: {
		eyebrow: string;
		title: string;
		description: string;
		highlights?: string[];
		mode: 'login' | 'register';
		children: Snippet;
	} = $props();
</script>

<section class="bg-background py-12 md:py-20">
	<div
		class="mx-auto grid min-h-[calc(100vh-9rem)] w-full max-w-7xl gap-10 px-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
	>
		<div class="order-2 lg:order-1">
			<Card.Root class="shadow-3d-lg rounded-3xl border-2">
				<Card.Header>
					<p class="text-xs font-black tracking-[0.18em] text-primary uppercase">
						{eyebrow}
					</p>
					<Card.Title class="font-heading text-4xl leading-tight font-bold md:text-5xl">
						{title}
					</Card.Title>
					<Card.Description class="text-base leading-relaxed">
						{description}
					</Card.Description>
				</Card.Header>

				<Card.Content>
					<div class="grid gap-2">
						{#each highlights as item (item)}
							<div
								class="shadow-3d-sm rounded-2xl border-2 bg-muted/40 px-4 py-3 text-sm font-bold"
							>
								{item}
							</div>
						{/each}
					</div>

					<div class="mt-8">
						{@render children()}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="order-1 lg:order-2">
			<AuthMockup {mode} />
		</div>
	</div>
</section>

==================================================
E. AuthMockup.svelte
==================================================

Buat:

src/lib/components/auth/AuthMockup.svelte

Isi:

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	let { mode }: { mode: 'login' | 'register' } = $props();
</script>

<div class="shadow-3d-lg rounded-[2rem] border-2 bg-muted/40 p-4">
	<Card.Root class="rounded-3xl border-2 bg-background shadow-3d">
		<Card.Header>
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

				<div class="rounded-2xl border-2 border-primary bg-primary/5 p-4">
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

				<div class="rounded-2xl border-2 bg-primary p-4 text-primary-foreground shadow-3d-primary">
					<p class="text-sm font-bold">Owner digest</p>
					<p class="mt-2 text-xl font-bold">Promo sore siap dibuat</p>
					<p class="mt-2 text-sm text-primary-foreground/80">
						9 customer tanya menu non-coffee hari ini.
					</p>
				</div>

				<div class="rounded-2xl border-2 bg-background p-4">
					<p class="text-sm font-bold">Follow-up queue</p>
					<p class="mt-1 text-sm text-muted-foreground">
						2 customer perlu dibalas sebelum malam.
					</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

==================================================
F. REGISTER PAGE — WAJIB PAKAI UI INPUT BUTTON FIELD
==================================================

Update:

src/routes/auth/register/+page.svelte

Gunakan:
- Button dari $lib/components/ui/button
- Input dari $lib/components/ui/input
- Field components dari $lib/components/ui/field
- Label jika dibutuhkan
- Card sudah ada di AuthShell

Contoh implementasi:

<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { authCopy, businessTypeOptions } from '$lib/constants/auth';
	import { registerDemoUser } from '$lib/auth/demo-auth';

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
	title={authCopy.register.title}
	description={authCopy.register.description}
	highlights={authCopy.register.highlights}
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
				<Field.Description>
					Untuk demo, password hanya divalidasi panjangnya dan tidak disimpan.
				</Field.Description>
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
				<select
					id="businessType"
					name="businessType"
					bind:value={form.businessType}
					class="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
				>
					{#each businessTypeOptions as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</Field.Field>
		</Field.Group>

		{#if error}
			<div class="rounded-2xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-bold text-destructive">
				{error}
			</div>
		{/if}

		{#if message}
			<div class="rounded-2xl border-2 border-primary bg-primary/10 px-4 py-3 text-sm font-bold text-primary">
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

Catatan:
Kalau ada NativeSelect component di project dan export-nya jelas, gunakan NativeSelect.
Kalau belum jelas, select native dengan class yang mengikuti input masih boleh.
Namun Input dan Button tetap wajib dari UI component.

==================================================
G. LOGIN PAGE — WAJIB PAKAI UI INPUT BUTTON FIELD
==================================================

Update:

src/routes/auth/login/+page.svelte

Gunakan:
- Button
- Input
- Field

Isi:

<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { authCopy } from '$lib/constants/auth';
	import { getDemoAuthUser, loginDemoUser } from '$lib/auth/demo-auth';

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
	title={authCopy.login.title}
	description={authCopy.login.description}
	highlights={authCopy.login.highlights}
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
			<div class="rounded-2xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-bold text-destructive">
				{error}
			</div>
		{/if}

		{#if message}
			<div class="rounded-2xl border-2 border-primary bg-primary/10 px-4 py-3 text-sm font-bold text-primary">
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

		<p class="text-center text-sm text-muted-foreground">
			{authCopy.login.footerText}
			<a href={authCopy.login.footerHref} class="font-bold text-primary">
				{authCopy.login.footerLinkLabel}
			</a>
		</p>
	</form>
</AuthShell>

==================================================
H. PAGE TS
==================================================

Update:

src/routes/auth/register/+page.ts

export const prerender = false;

Update:

src/routes/auth/login/+page.ts

export const prerender = false;

==================================================
I. BEST PRACTICE API NANTI
==================================================

Untuk sekarang:
- localStorage hanya untuk demo UI.
- password tidak disimpan.
- redirect dummy ke dashboard.

Untuk production:
- Jangan simpan token di localStorage.
- Jangan akses database dari frontend.
- Buat +page.server.ts actions.
- Form submit ke server action.
- Server action call services/api.
- services/api yang insert users, businesses, business_members, onboarding, agent_settings.
- Session pakai httpOnly cookie.
- refresh_tokens dikelola backend.

Tambahkan komentar singkat di route:
"TODO: replace demo localStorage auth with SvelteKit server actions calling services/api."

==================================================
J. ACCEPTANCE CRITERIA
==================================================

Selesai jika:
1. Tidak ada AuthInput custom.
2. Tidak ada AuthSubmitButton custom.
3. Register form memakai Input dari src/lib/components/ui/input.
4. Login form memakai Input dari src/lib/components/ui/input.
5. Submit memakai Button dari src/lib/components/ui/button.
6. Layout memakai Card dari src/lib/components/ui/card.
7. Field structure memakai src/lib/components/ui/field.
8. Register dummy simpan user ke localStorage.
9. Login dummy validasi user localStorage.
10. Sukses redirect ke /dashboard.
11. Auth page responsive.
12. Style konsisten dengan Nongki.
13. Tidak ada direct DB access.
14. pnpm build lolos.
```

Intinya: **yang boleh custom hanya layout auth dan mockup**, sedangkan form control harus tetap pakai component UI existing.
