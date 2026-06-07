<script lang="ts">
	import SolutionDetailPage from '$lib/components/solutions/SolutionDetailPage.svelte';
	import { solutionPages } from '$lib/constants/solutions';

	const solution = solutionPages['coffee-shop'];
</script>

<SolutionDetailPage {solution} />
