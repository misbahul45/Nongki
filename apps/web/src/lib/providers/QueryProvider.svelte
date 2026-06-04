<script lang="ts">
	import { browser } from "$app/environment";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

	let { children } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

{#if browser}
	<QueryClientProvider client={queryClient}>
		{@render children()}
	</QueryClientProvider>
{:else}
	{@render children()}
{/if}