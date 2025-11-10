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

// https://docs.sentry.io/platforms/javascript/guides/astro/

import * as Sentry from "@sentry/astro";

const sentryDsn = import.meta.env.PUBLIC_SENTRY_DSN;
const environment = import.meta.env.MODE || "development";
const version = import.meta.env.PUBLIC_APP_VERSION || "0.0.1";

if (!sentryDsn) {
	console.warn(
		"Sentry DSN is missing. Please set the PUBLIC_SENTRY_DSN environment variable.",
	);
} else {
	// Initialize Sentry
	Sentry.init({
		dsn: sentryDsn,

		// Add optional integrations for additional features
		integrations: [
			Sentry.replayIntegration(),
			Sentry.browserTracingIntegration(),
		],

		// Enable logs to be sent to Sentry
		enableLogs: true,

		// Adjust the sample rate for traces based on environment
		tracesSampleRate: environment === "production" ? 0.1 : 1.0, // 10% in production, 100% in development

		// Adjust the sample rate for session replays based on environment
		replaysSessionSampleRate: environment === "production" ? 0.01 : 0.1, // 1% in production, 10% in development

		// Capture 100% of replay events when an error occurs
		replaysOnErrorSampleRate: 1.0,

		// Adds request headers and IP for users, for more info visit:
		// https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
		sendDefaultPii: true,

		// Additional Sentry configuration options
		environment: environment, // Set the environment
		release: `elysium@${version}`, // Link errors to a specific release
	});

	console.log(`Sentry initialized successfully in ${environment} mode.`);
}
