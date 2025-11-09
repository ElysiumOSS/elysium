import posthog from "posthog-js";

/**
 * Initializes PostHog analytics tracking.
 * This function should be called once when the app is loaded.
 */
function initializePostHog(): void {
	if (typeof window !== "undefined") {
		const posthogKey: string | undefined = import.meta.env.PUBLIC_POSTHOG_KEY;
		const posthogHost: string | undefined = import.meta.env.PUBLIC_POSTHOG_HOST;

		if (posthogKey) {
			posthog.init(posthogKey, {
				api_host: posthogHost || "https://app.posthog.com",
				/**
				 * Enable debug mode in development to see what's going on.
				 * @param {import('posthog-js').PostHog} posthog - The PostHog instance.
				 */
				loaded: (posthog: import("posthog-js").PostHog): void => {
					if (import.meta.env.MODE === "development") {
						posthog.debug();
					}
				},
			});
		}
	}
}

initializePostHog();
