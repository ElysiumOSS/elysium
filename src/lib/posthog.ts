/**
 * Copyright 2025 Elysium OSS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import posthog from "posthog-js";

/**
 * Initializes PostHog analytics tracking.
 * This function should be called once when the app is loaded.
 *
 * Note: This file is now deprecated in favor of src/components/posthog.astro
 * which uses the web snippet for better performance and compatibility.
 * Keep this file for backwards compatibility or if you prefer the JS SDK approach.
 */
function initializePostHog(): void {
	if (typeof window !== "undefined") {
		const posthogKey: string | undefined = import.meta.env.PUBLIC_POSTHOG_KEY;
		const posthogHost: string | undefined = import.meta.env.PUBLIC_POSTHOG_HOST;
		const environment = import.meta.env.MODE || "development";

		if (!posthogKey) {
			console.warn(
				"PostHog API key is missing. Please set PUBLIC_POSTHOG_KEY environment variable.",
			);
			return;
		}

		if (posthogKey) {
			posthog.init(posthogKey, {
				api_host: posthogHost || "https://us.i.posthog.com",
				defaults: "2025-05-24",
				person_profiles: "identified_only", // Only create profiles for identified users

				// Enable session recording
				session_recording: {
					recordCrossOriginIframes: false, // Privacy: don't record iframes
				},

				// Capture pageviews automatically
				capture_pageview: true,
				capture_pageleave: true,

				/**
				 * Enable debug mode in development to see what's going on.
				 * @param {import('posthog-js').PostHog} posthog - The PostHog instance.
				 */
				loaded: (posthog: import("posthog-js").PostHog): void => {
					if (environment === "development") {
						posthog.debug();
						console.log("PostHog initialized in development mode");
					} else {
						console.log("PostHog initialized successfully");
					}
				},
			});
		}
	}
}

initializePostHog();

export { posthog };
