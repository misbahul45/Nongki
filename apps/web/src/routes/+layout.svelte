<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/layouts/Header.svelte';

	let { children } = $props();
</script>

<Header />
{@render children()}