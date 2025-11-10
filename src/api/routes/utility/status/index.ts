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
 * The current application version, loaded from package.json.
 * @type {string}
 */
const version: string = await import("../../../../../package.json")
	.then((pkg) => pkg.version)
	.catch(() => "N/A");

/**
 * Application status route
 * Returns uptime, memory usage, version, and environment information
 */
export const statusRoute = new Elysia()
	.get(
		"/",
		async () =>
			record("status.get", async () => {
				const uptime = process.uptime();
				const memoryUsage = process.memoryUsage();
				const appVersion = version;
				return Stringify({
					message: "Application status",
					status: 200,
					data: {
						uptime: `${uptime.toFixed(2)} seconds`,
						memory: {
							rss: `${(memoryUsage.rss / 1_024 / 1_024).toFixed(2)} MB`,
							heapTotal: `${(memoryUsage.heapTotal / 1_024 / 1_024).toFixed(2)} MB`,
							heapUsed: `${(memoryUsage.heapUsed / 1_024 / 1_024).toFixed(2)} MB`,
							external: `${(memoryUsage.external / 1_024 / 1_024).toFixed(2)} MB`,
						},
						version: appVersion,
						environment: process.env.NODE_ENV || "development",
					},
				});
			}),
		{
			detail: {
				summary: "Get application status",
				description: "Returns uptime, memory usage, version, and environment",
				tags: ["Utility"],
			},
		},
	)
	.head(
		"/",
		({ set }) =>
			record("status.head", () => {
				set.status = 200;
				return;
			}),
		{
			detail: {
				summary: "Status HEAD",
				description: "HEAD for status endpoint",
				tags: ["Utility"],
			},
		},
	)
	.options(
		"/",
		() =>
			record("status.options", () => {
				return Stringify({
					message: "CORS preflight response",
					status: 204,
					allow: "GET,OPTIONS,HEAD",
				});
			}),
		{
			detail: {
				summary: "Status OPTIONS",
				description: "CORS preflight for status",
				tags: ["Utility"],
			},
		},
	);
