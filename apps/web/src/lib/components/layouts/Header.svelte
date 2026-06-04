<script lang="ts">
	import { onMount, tick } from "svelte";
	import {
		authNavigation,
		featureNavigation,
		productNavigation,
		siteConfig,
		solutionNavigation,
		workflowNavigation
	} from "$lib/constants/header";
	import { headerAnimation } from "$lib/constants/header";
	import logo from "$lib/assets/logo.png";
	import { Button } from "$lib/components/ui/button/index.js";
	import DesktopNavigation from "$lib/components/layouts/header/DesktopNavigation.svelte";
	import UserMenu from "$lib/components/layouts/header/UserMenu.svelte";
	import { cn } from "$lib/utils.js";
	import { Menu, X } from "@lucide/svelte";

	let isMobileMenuOpen = $state(false);
	let isLogin = $state(false);

	let mobileMenuEl = $state<HTMLDivElement>();
	let mobileMenuInnerEl = $state<HTMLDivElement>();

	let gsap = $state<typeof import("gsap").default>();

	const mobileGroups = [
		{
			title: "Produk",
			items: productNavigation
		},
		{
			title: "Solusi",
			items: solutionNavigation
		},
		{
			title: "Fitur",
			items: featureNavigation
		},
		{
			title: "Alur Sistem",
			items: workflowNavigation
		}
	];

	onMount(async () => {
		gsap = (await import("gsap")).default;
	});

	const animateMobileMenuOpen = async () => {
		await tick();

		if (!gsap || !mobileMenuEl || !mobileMenuInnerEl) return;

		const menu = mobileMenuEl;
		const inner = mobileMenuInnerEl;

		gsap.fromTo(
			menu,
			{ ...headerAnimation.mobileMenu.open.from },
			{ ...headerAnimation.mobileMenu.open.to }
		);

		gsap.fromTo(
			inner.children,
			{ ...headerAnimation.mobileMenuItems.from },
			{ ...headerAnimation.mobileMenuItems.to }
		);
	};

	const openMobileMenu = async () => {
		isMobileMenuOpen = true;
		await animateMobileMenuOpen();
	};

	const closeMobileMenu = () => {
		if (!gsap || !mobileMenuEl) {
			isMobileMenuOpen = false;
			return;
		}

		const menu = mobileMenuEl;

		gsap.to(menu, {
			...headerAnimation.mobileMenu.close,
			onComplete: () => {
				isMobileMenuOpen = false;
			}
		});
	};

	const toggleMobileMenu = () => {
		if (isMobileMenuOpen) {
			closeMobileMenu();
			return;
		}

		openMobileMenu();
	};
</script>

<header
	class={cn(
		"sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300",
		isMobileMenuOpen ? "min-h-screen bg-background" : "bg-background/80"
	)}
>
	<nav class="container mx-auto flex items-center justify-between px-4 py-3">
		<a href="/" aria-label="Home" data-sveltekit-preload-data class="flex items-center gap-2">
			<img src={logo} alt="logo" class="h-auto w-12" />

			<span class="text-lg font-bold text-primary">
				{siteConfig.name}
			</span>
		</a>

		<DesktopNavigation />

		<div class="hidden items-center gap-2 lg:flex">
			{#if isLogin}
				<UserMenu />
			{:else}
				<Button href={authNavigation.login.href} variant="outline">
					{authNavigation.login.title}
				</Button>

				<Button href={authNavigation.register.href}>
					{authNavigation.register.title}
				</Button>
			{/if}
		</div>

		<Button
			type="button"
			variant="outline"
			size="icon"
			class="lg:hidden"
			aria-label="Toggle menu"
			aria-expanded={isMobileMenuOpen}
			onclick={toggleMobileMenu}
		>
			{#if isMobileMenuOpen}
				<X class="size-5" />
			{:else}
				<Menu class="size-5" />
			{/if}
		</Button>
	</nav>

	{#if isMobileMenuOpen}
		<div bind:this={mobileMenuEl} class="overflow-hidden border-t bg-background shadow-sm lg:hidden">
			<div
				bind:this={mobileMenuInnerEl}
				class="container mx-auto max-h-[calc(100vh-73px)] overflow-y-auto px-4 py-4"
			>
				<div class="grid gap-2">
					<a
						href="/"
						class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
						onclick={closeMobileMenu}
					>
						Home
					</a>

					{#each mobileGroups as group (group.title)}
						<details class="group rounded-lg border bg-card/60">
							<summary class="cursor-pointer list-none px-3 py-3 text-sm font-semibold">
								<div class="flex items-center justify-between">
									<span>{group.title}</span>
									<span class="text-muted-foreground transition-transform group-open:rotate-180">
										⌄
									</span>
								</div>
							</summary>

							<div class="grid gap-1 border-t p-2">
								{#each group.items as item (item.href)}
									{@const Icon = item.icon}

									<a
										href={item.href}
										class="flex gap-3 rounded-md p-3 hover:bg-accent"
										onclick={closeMobileMenu}
									>
										<div
											class="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
										>
											<Icon class="size-4" />
										</div>

										<div class="space-y-1">
											<div class="text-sm font-medium">
												{item.title}
											</div>

											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												{item.description}
											</p>
										</div>
									</a>
								{/each}
							</div>
						</details>
					{/each}

					<a
						href="/pricing"
						class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
						onclick={closeMobileMenu}
					>
						Harga
					</a>

					<a
						href="/docs"
						class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
						onclick={closeMobileMenu}
					>
						Docs
					</a>
				</div>

				<div class="mt-4 grid gap-2 border-t pt-4">
					{#if isLogin}
						<Button href="/dashboard" variant="outline" onclick={closeMobileMenu}>
							Dashboard
						</Button>

						<Button href="/settings" variant="outline" onclick={closeMobileMenu}>
							Settings
						</Button>

						<Button href="/auth/logout" variant="destructive" onclick={closeMobileMenu}>
							Logout
						</Button>
					{:else}
						<Button href={authNavigation.login.href} variant="outline" onclick={closeMobileMenu}>
							{authNavigation.login.title}
						</Button>

						<Button href={authNavigation.register.href} onclick={closeMobileMenu}>
							{authNavigation.register.title}
						</Button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</header>