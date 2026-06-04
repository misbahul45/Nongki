import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(
    {
    // Load .env from the monorepo root instead of apps/web.
    // Only PUBLIC_-prefixed vars are exposed to the client (SvelteKit $env/static/public).
    envDir: '../../',
    plugins: [tailwindcss(), sveltekit()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: ['web', 'localhost', '.localhost']  // tambahkan ini
    }
    }
);
