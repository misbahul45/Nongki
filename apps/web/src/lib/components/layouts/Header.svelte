<script lang="ts">
	import {
		authNavigation,
		featureNavigation,
		productNavigation,
		siteConfig,
		solutionNavigation,
		workflowNavigation
	} from "$lib/constants/layout";
	import logo from "$lib/assets/logo.png"
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
	import type { HTMLAttributes } from "svelte/elements";

	import { useIsMobile } from "$lib/hooks/is-mobile";

	const isMobile = useIsMobile();

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
		icon?: any;
	};
</script>

{#snippet ListItem({
	title,
	content,
	href,
	icon: Icon,
	class: className,
	...restProps
}: ListItemProps)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					{href}
					class={cn(
						"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex gap-3 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
						className
					)}
					{...restProps}
				>
					{#if Icon}
						<div class="bg-muted text-muted-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md">
							<Icon class="size-4" />
						</div>
					{/if}

					<div class="space-y-1">
						<div class="text-sm leading-none font-medium">
							{title}
						</div>

						<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
							{content}
						</p>
					</div>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<header class="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
	<nav class="container mx-auto flex items-center justify-between px-4 py-3">
		<div class="flex items-center">
			<a href="/" aria-label="Home" data-sveltekit-preload-data class="flex items-center gap-2">
				<enhanced:img src={logo} alt="logo" class="w-12 h-auto" />
			</a>
			<p class="text-lg font-bold text-primary">Nongki</p>
		</div>
		<NavigationMenu.Root viewport={isMobile}>
			<NavigationMenu.List class="hidden flex-wrap lg:flex">
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/" class={navigationMenuTriggerStyle()}>
								Home
							</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Produk</NavigationMenu.Trigger>

					<NavigationMenu.Content>
						<ul class="grid gap-2 p-2 md:w-130 lg:w-170 lg:grid-cols-[0.8fr_1fr]">
							<li class="row-span-3">
								<NavigationMenu.Link
									class="from-muted/60 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-5 no-underline outline-hidden select-none focus:shadow-md"
								>
									{#snippet child({ props })}
										<a {...props} href="/product">
											<enhanced:img src={logo} alt="logo" class="w-56 h-auto" />
											<div class="mb-2 text-lg font-semibold">
												{siteConfig.agentName} AI Agent
											</div>

											<p class="text-muted-foreground text-sm leading-relaxed">
												AI WhatsApp CRM untuk membantu UMKM F&B membalas chat,
												mengelola pelanggan, membuat order, reservasi, dan pembayaran QRIS.
											</p>
										</a>
									{/snippet}
								</NavigationMenu.Link>
							</li>

							{#each productNavigation.slice(0, 3) as item (item.href)}
								{@render ListItem({
									href: item.href,
									title: item.title,
									content: item.description,
									icon: item.icon
								})}
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Solusi</NavigationMenu.Trigger>

					<NavigationMenu.Content>
						<ul class="grid w-105 gap-2 p-2">
							{#each solutionNavigation as item (item.href)}
								{@render ListItem({
									href: item.href,
									title: item.title,
									content: item.description,
									icon: item.icon
								})}
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Fitur</NavigationMenu.Trigger>

					<NavigationMenu.Content>
						<ul class="grid w-105 gap-2 p-2 sm:w-120 md:w-140 md:grid-cols-2">
							{#each featureNavigation as item (item.href)}
								{@render ListItem( {
									href: item.href,
									title: item.title,
									content: item.description,
									icon: item.icon
								})}
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Alur Sistem</NavigationMenu.Trigger>

					<NavigationMenu.Content>
						<ul class="grid w-105 gap-2 p-2 sm:w-120 md:w-140 md:grid-cols-2">
							{#each workflowNavigation as item (item.href)}
								{@render ListItem({
									href: item.href,
									title: item.title,
									content: item.description,
									icon: item.icon
								})}
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/pricing" class={navigationMenuTriggerStyle()}>
								Harga
							</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/docs" class={navigationMenuTriggerStyle()}>
								Docs
							</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<div class="flex items-center gap-2">
			<Button href={authNavigation.login.href} variant="outline" >
				{authNavigation.login.title}
			</Button>

			<Button href={authNavigation.register.href}>
				{authNavigation.register.title}
			</Button>
		</div>
	</nav>
</header>