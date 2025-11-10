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

import { Stringify } from "@/core/helpers/general";
import { record } from "@elysiajs/opentelemetry";
import { Elysia } from "elysia";

/**
 * Root API route
 * Returns a welcome message
 */
export const rootRoute = new Elysia()
	.get(
		"/",
		() =>
			record("root.get", () => {
				return Stringify({
					message: `Welcome to the API. Don't be naughty >:(`,
					status: 200,
				});
			}),
		{
			detail: {
				summary: "Root endpoint",
				description: "Welcome message for the API",
				tags: ["Utility"],
			},
		},
	)
	.head(
		"/",
		({ set }) =>
			record("root.head", () => {
				set.status = 200;
				return;
			}),
		{
			detail: {
				summary: "Root HEAD",
				description: "HEAD for root endpoint",
				tags: ["Utility"],
			},
		},
	)
	.options(
		"/",
		() =>
			record("root.options", () => {
				return Stringify({
					message: "CORS preflight response",
					status: 204,
					allow: "GET,OPTIONS,HEAD",
				});
			}),
		{
			detail: {
				summary: "Root OPTIONS",
				description: "CORS preflight for root",
				tags: ["Utility"],
			},
		},
	);
