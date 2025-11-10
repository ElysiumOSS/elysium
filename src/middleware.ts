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

import { defineMiddleware } from "astro:middleware";

/**
 * Astro middleware to set security headers
 * These headers should be set via HTTP, not meta tags
 */
export const onRequest = defineMiddleware(async (_, next) => {
	const response = await next();

	// Set security headers via HTTP
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set(
		"Permissions-Policy",
		"geolocation=(), microphone=(), camera=()",
	);

	// Set CSP header via HTTP (more secure than meta tag)
	response.headers.set(
		"Content-Security-Policy",
		"default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' blob: https://us.i.posthog.com https://us-assets.i.posthog.com https://app.posthog.com; " +
			"style-src 'self' 'unsafe-inline'; " +
			"img-src 'self' data: blob: https: http:; " +
			"font-src 'self' data:; " +
			"connect-src 'self' https://us.i.posthog.com https://app.posthog.com https://*.ingest.us.sentry.io https://*.ingest.sentry.io; " +
			"worker-src 'self' blob:; " +
			"child-src blob:;",
	);

	return response;
});
