// @ts-check

import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "server",

	adapter: vercel(),

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
