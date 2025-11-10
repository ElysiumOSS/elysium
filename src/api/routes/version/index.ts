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
const version: string = await import("../../../../package.json")
	.then((pkg) => pkg.version)
	.catch(() => "N/A");

/**
 * Version information route
 * Returns the current API version
 */
export const versionRoute = new Elysia()
	.get(
		"/",
		async () =>
			record("version.get", async () => {
				const appVersion = version;
				return Stringify({
					version: appVersion,
					status: 200,
				});
			}),
		{
			detail: {
				summary: "Get API version",
				description: "Returns the current API version",
				tags: ["Info"],
			},
		},
	)
	.head(
		"/",
		({ set }) =>
			record("version.head", () => {
				set.status = 200;
				return;
			}),
		{
			detail: {
				summary: "Version HEAD",
				description: "HEAD for version endpoint",
				tags: ["Info"],
			},
		},
	)
	.options(
		"/",
		() =>
			record("version.options", () => {
				return Stringify({
					message: "CORS preflight response",
					status: 204,
					allow: "GET,OPTIONS,HEAD",
				});
			}),
		{
			detail: {
				summary: "Version OPTIONS",
				description: "CORS preflight for version",
				tags: ["Info"],
			},
		},
	);
