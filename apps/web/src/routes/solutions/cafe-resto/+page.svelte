<script lang="ts">
	import SolutionDetailPage from '$lib/components/solutions/SolutionDetailPage.svelte';
	import { solutionPages } from '$lib/constants/solutions';

	const solution = solutionPages['cafe-resto'];
</script>

<SolutionDetailPage {solution} />
