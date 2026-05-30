<script lang="ts">
	import Header from '$lib/components/layouts/Header.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />
	<main>{@render children()}</main>

	<footer>

	</footer>
</div>
