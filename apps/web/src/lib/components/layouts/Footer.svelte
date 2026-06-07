<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import {
		footerBottomLinks,
		footerBrand,
		footerNavigationGroups,
		footerPills
	} from '$lib/constants/footer';

	const year = new Date().getFullYear();
</script>

<footer class="border-t bg-muted/40">
	<div class="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
		<div class="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
			<div>
				<a href="/" class="flex w-fit items-center gap-3" aria-label="Nongki home">
					<img src={logo} alt="Nongki logo" class="h-auto w-12" />

					<span class="font-heading text-xl font-bold text-primary">
						{footerBrand.name}
					</span>
				</a>

				<p class="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
					{footerBrand.description}
				</p>

				<div class="mt-4">
					<span
						class="inline-flex rounded-full border-2 bg-background px-4 py-2 text-xs font-bold shadow-3d-sm"
					>
						{footerBrand.tagline}
					</span>
				</div>

				<div class="mt-4 flex flex-wrap gap-2">
					{#each footerPills as pill (pill)}
						<span
							class="rounded-full border-2 bg-background px-3 py-1 text-xs font-bold text-muted-foreground shadow-3d-sm"
						>
							{pill}
						</span>
					{/each}
				</div>
			</div>

			{#each footerNavigationGroups as group (group.title)}
				<nav aria-label={group.title}>
					<h3 class="font-heading text-sm font-bold text-foreground">
						{group.title}
					</h3>

					<ul class="mt-4 grid gap-3">
						{#each group.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<div class="my-8 h-px w-full bg-border"></div>

		<div
			class="flex flex-col gap-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between"
		>
			<p>&copy; {year} Nongki. All rights reserved.</p>

			<div class="flex flex-wrap gap-4">
				{#each footerBottomLinks as link (link.href)}
					<a href={link.href} class="font-bold transition-colors hover:text-primary">
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>