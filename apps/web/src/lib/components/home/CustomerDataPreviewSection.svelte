<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { customerDataPreview } from '$lib/constants/home/landingPage';
	import Reveal from './Reveal.svelte';
	import SectionShell from './SectionShell.svelte';
	import SectionTitle from './SectionTitle.svelte';
</script>

<SectionShell>
	<div class="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
		<Reveal>
			<Card
				class="shadow-3d-lg hover:shadow-3d-lg rounded-3xl border-2 transition-all duration-300"
			>
				<CardHeader>
					<CardTitle>Customer 360</CardTitle>
				</CardHeader>
				<CardContent class="space-y-5">
					<div class="flex items-center gap-4">
						<div
							class="grid size-16 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
						>
							F
						</div>
						<div>
							<h3 class="text-2xl font-bold">{customerDataPreview.profile.name}</h3>
							<p class="font-bold text-primary">{customerDataPreview.profile.status}</p>
						</div>
					</div>
					<div>
						<div class="mb-2 flex justify-between text-sm font-bold">
							<span>Lead score</span>
							<span>{customerDataPreview.profile.score}/100</span>
						</div>
						<Progress value={customerDataPreview.profile.score} />
					</div>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each customerDataPreview.profile.items as item (item[0])}
							<div class="rounded-2xl border-2 bg-muted/40 p-3">
								<p class="text-xs text-muted-foreground">{item[0]}</p>
								<p class="mt-1 font-bold">{item[1]}</p>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</Reveal>

		<Reveal delay={0.08}>
			<SectionTitle
				title={customerDataPreview.title}
				description={customerDataPreview.description}
			/>
			<div class="mt-6 flex flex-wrap gap-2">
				{#each customerDataPreview.metrics as metric (metric)}
					<span class="shadow-3d-sm rounded-2xl border-2 bg-background px-4 py-2 text-sm font-bold">
						{metric}
					</span>
				{/each}
			</div>
			<Button href={customerDataPreview.cta.href} class="mt-6">
				{customerDataPreview.cta.label}
			</Button>
		</Reveal>
	</div>
</SectionShell>
