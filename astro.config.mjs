// @ts-check

import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	site: "https://elysium.example.com",
	integrations: [
		sitemap(),
		sentry({
			dsn: "YOUR_SENTRY_DSN_HERE",
			sourceMapsUploadOptions: {
				project: "your-sentry-project-name",
				authToken: "YOUR_SENTRY_AUTH_TOKEN_HERE",
			},
			tracesSampleRate: 1.0,
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,
		}),
	],
});
