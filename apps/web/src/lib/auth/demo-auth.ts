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
	| { ok: true; user: DemoAuthUser; message: string }
	| { ok: false; message: string };

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
		return { ok: false, message: 'Demo auth hanya berjalan di browser.' };
	}

	if (!payload.name.trim()) {
		return { ok: false, message: 'Nama owner wajib diisi.' };
	}

	if (!payload.email.includes('@')) {
		return { ok: false, message: 'Email belum valid.' };
	}

	if (payload.password.length < 6) {
		return { ok: false, message: 'Password minimal 6 karakter.' };
	}

	if (!payload.businessName.trim()) {
		return { ok: false, message: 'Nama bisnis wajib diisi.' };
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

	return { ok: true, user, message: 'Akun demo berhasil dibuat.' };
}

export async function loginDemoUser(payload: LoginPayload): Promise<DemoAuthResult> {
	if (!browser) {
		return { ok: false, message: 'Demo auth hanya berjalan di browser.' };
	}

	const user = getDemoAuthUser();

	if (!user) {
		return { ok: false, message: 'Belum ada akun demo. Silakan daftar dulu.' };
	}

	if (user.email !== payload.email.trim().toLowerCase()) {
		return { ok: false, message: 'Email tidak cocok dengan akun demo.' };
	}

	if (payload.password.length < 6) {
		return { ok: false, message: 'Password minimal 6 karakter.' };
	}

	return { ok: true, user, message: 'Login demo berhasil.' };
}

export function logoutDemoUser() {
	if (!browser) return;
	localStorage.removeItem(demoAuthStorageKey);
}
