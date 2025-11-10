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

import { record } from "@elysiajs/opentelemetry";
import { Elysia } from "elysia";
import { Stringify } from "@/core/helpers/general";

/**
 * API information route
 * Returns general information about the API
 */
export const infoRoute = new Elysia()
	.get(
		"/",
		() =>
			record("info.get", () => {
				return Stringify({
					message: `Information about the API`,
					status: 200,
					data: {
						contact: `example @example.com`,
						documentationUrl: "https://docs.your-api.com",
					},
				});
			}),
		{
			detail: {
				summary: "Get API info",
				description: "Returns information about the API",
				tags: ["Info"],
			},
		},
	)
	.head(
		"/",
		({ set }) =>
			record("info.head", () => {
				set.status = 200;
				return;
			}),
		{
			detail: {
				summary: "Info HEAD",
				description: "HEAD for info endpoint",
				tags: ["Info"],
			},
		},
	)
	.options(
		"/",
		() =>
			record("info.options", () => {
				return Stringify({
					message: "CORS preflight response",
					status: 204,
					allow: "GET,OPTIONS,HEAD",
				});
			}),
		{
			detail: {
				summary: "Info OPTIONS",
				description: "CORS preflight for info",
				tags: ["Info"],
			},
		},
	);
