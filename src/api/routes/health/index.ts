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
import { record } from "@/core/helpers/telemetry";
import { Elysia } from "elysia";

/**
 * Health check route
 * Provides a simple endpoint to verify API availability
 */
export const healthRoute = new Elysia()
	.get(
		"/",
		async () =>
			record("health.get", () => {
				return Stringify({ message: "ok", status: 200 });
			}),
		{
			detail: {
				summary: "Health check",
				description: "Returns ok if the API is healthy",
				tags: ["Health"],
			},
		},
	)
	.head(
		"/",
		({ set }) =>
			record("health.head", () => {
				set.status = 200;
				return;
			}),
		{
			detail: {
				summary: "Health HEAD",
				description: "HEAD for health endpoint",
				tags: ["Health"],
			},
		},
	)
	.options(
		"/",
		() =>
			record("health.options", () => {
				return Stringify({
					message: "CORS preflight response",
					status: 204,
					allow: "GET,OPTIONS,HEAD",
				});
			}),
		{
			detail: {
				summary: "Health OPTIONS",
				description: "CORS preflight for health",
				tags: ["Health"],
			},
		},
	);
