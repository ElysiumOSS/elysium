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

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import * as Sentry from "@sentry/node";

/**
 * Check if running on Vercel
 */
export const IS_VERCEL = !!process.env.VERCEL;

/**
 * Content Security Policy permissions for Helmet.
 * Used to configure allowed sources for various content types.
 * @type {object}
 */
export const permission = {
	SELF: "'self'",
	UNSAFE_INLINE: "'unsafe-inline'",
	HTTPS: "https:",
	DATA: "data:",
	NONE: "'none'",
	BLOB: "blob:",
} as const;

/**
 * OpenTelemetry resource for Jaeger tracing.
 * Sets the service name for trace identification.
 * @type {import(' @opentelemetry/resources').Resource}
 */
export const otelResource = resourceFromAttributes({
	[ATTR_SERVICE_NAME]: "elysium.elysia-api",
});

/**
 * OTLP trace exporter for sending traces to Jaeger.
 * Only configured for local development.
 * @type {OTLPTraceExporter | undefined}
 */
export const otlpExporter = !IS_VERCEL
	? new OTLPTraceExporter({
			url: "http://localhost:4318/v1/traces",
			keepAlive: true,
		})
	: undefined;

/**
 * Batch span processor for OpenTelemetry.
 * Handles batching and exporting of trace spans.
 * Only configured for local development.
 * @type {BatchSpanProcessor | undefined}
 */
export const batchSpanProcessor = otlpExporter
	? new BatchSpanProcessor(otlpExporter, {
			maxExportBatchSize: 512,
			scheduledDelayMillis: 5_000,
			exportTimeoutMillis: 30_000,
			maxQueueSize: 2_048,
		})
	: undefined;

/**
 * The current application version, loaded from package.json.
 * @type {string}
 */
export const version: string = "1.0.0"; // Placeholder, will be replaced by actual version from package.json

/**
 * Error handler function that captures and reports request errors to Sentry.
 * Direct export of Sentry's captureRequestError function for use in error boundaries
 * or request handlers.
 *
 * @const onRequestError
 * @type {typeof Sentry.captureException}
 *
 * @example
 * ```ts
 * try {
 *   await handleRequest(req);
 * } catch (error) {
 *   onRequestError(error);
 * }
 * ```
 *
 * @remarks
 * - Automatically captures request context and error details
 * - Integrates with Sentry's error tracking system
 * - Preserves error stack traces and metadata
 * - Should be used for handling request-specific errors
 */
export const onRequestError = Sentry.captureException;
