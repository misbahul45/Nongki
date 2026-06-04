<script lang="ts">
  import { siteConfig } from "$lib/constants/header";

  const title = "Automation Flow";
</script>

<svelte:head>
  <title>{title} | {siteConfig.name}</title>
  <meta name="description" content="{title} page for {siteConfig.description}" />
</svelte:head>

<section class="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-center px-6 py-24">
  <div class="max-w-2xl space-y-5">
    <p class="text-sm font-medium text-primary">
      {siteConfig.name}
    </p>

    <h1 class="text-4xl font-bold tracking-tight md:text-6xl">
      {title}
    </h1>

    <p class="text-lg text-muted-foreground">
      Halaman ini sedang disiapkan untuk fitur {title} pada {siteConfig.description}.
    </p>
  </div>
</section>
