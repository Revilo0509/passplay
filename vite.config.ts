import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' }),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'PassPlay',
				short_name: 'passplay',
				display: 'standalone',
				start_url: '/',
				background_color: '#111',
				theme_color: '#111',
				icons: [
					{
						src: '/192x192.webp',
						sizes: '192x192',
						type: 'image/webp'
					},
					{
						src: '/512x512.webp',
						sizes: '512x512',
						type: 'image/webp'
					}
				]
			}
		})
	],
	server: {
		host: true
	}
});
