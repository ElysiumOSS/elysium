/**
 * Copyright 2025 Mike Odnis
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

import { onRequestError as sentryOnRequestError } from '@/core/constants';
import { logger, Stringify } from '@/core/utils';
import { ensureBaseError, isBaseError } from '@/core/error';

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
export const onRequestError = sentryOnRequestError;

/**
 * Default error handler for API routes.
 * @constant
 * @public
 * @author Mike Odnis
 * @version 1.0.0
 * @see https://github.com/WomB0ComB0/portfolio
 * @description
 * Can be imported and used by individual API routes for consistent error formatting and logging.
 * @param {{ code: string, error: Error | unknown, set: any }} context - Error handling context.
 * @returns {any} JSON serialization of the error payload.
 * @throws Error If context.error is thrown further.
 * @example
 * ```ts
 * app.onError(defaultErrorHandler);
 * ```
 */
export const defaultErrorHandler =
  (({ code, error, set }: { code: string; error: Error | unknown; set: any }) => {
    logger.error('API error handler', error, { code });
    set.status = code === 'NOT_FOUND' ? 404 : 500;
    return Stringify({
      error: error instanceof Error ? Stringify({ error }) : Stringify({ error }),
      status: set.status,
    });
  });