import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL;

export default defineConfig({
  output: 'static',
  site,
  vite: { plugins: [tailwindcss()] },
});
