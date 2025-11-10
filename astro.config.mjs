// @ts-check

import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	output: "server",

	adapter: node({
		mode: "standalone",
	}),

	site: "https://elysium.tools",

	integrations: [
		sitemap(),
		icon({
			iconDir: "src/icons",
			include: {
				mdi: ["*"], // Include all Material Design Icons
			},
		}),
		sentry({
			project: "elysium",
			org: "womb0comb0",
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
