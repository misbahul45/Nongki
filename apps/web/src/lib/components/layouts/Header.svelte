<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<header>
	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href={resolve('/about')}>About</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
				<a href={resolve('/sverdle')}>Sverdle</a>
			</li>
		</ul>
	</nav>
</header>
