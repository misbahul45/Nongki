<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";

	const title = 'Nongki — AI WhatsApp Assistant untuk Bisnis';
	const description =
		'Nongki membantu bisnis mengelola chat WhatsApp, customer, order, reservasi, reminder, dan human handoff dengan bantuan AI.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content="Nongki, AI WhatsApp, bisnis, UMKM, chatbot, CRM, order, reservasi" />
	<meta name="author" content="Nongki" />
	<meta name="robots" content="index, follow" />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Nongki" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />

	<link rel="canonical" href="#" />
</svelte:head>

<section>
	<div>
		<Button>
			Go to Sverdle
		</Button>
	</div>
</section>