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

import { requireAuth } from "@/api/routes/auth/index";
import { Stringify } from "@/core/helpers/general";
import { record } from "@/core/helpers/telemetry";
import { Elysia } from "elysia";

export const protectedRoute = new Elysia()
	.use(requireAuth)
	.get(
		"/example",
		(context) => {
			if (!(context as any).publicKey) {
				context.set.status = 401;
				return { error: "Unauthorized" };
			}
			return record("protected.example.get", () => {
				return Stringify({
					message: "You have access!",
					yourPublicKey: (context as any).publicKey,
				});
			});
		},
		{
			detail: {
				summary: "Protected Example",
				description: "An example endpoint that requires authentication",
				tags: ["Protected"],
			},
		},
	)
	.head(
		"/example",
		({ set }) =>
			record("protected.example.head", () => {
				set.status = 200;
				return;
			}),
		{
			detail: {
				summary: "Protected Example HEAD",
				description: "HEAD for protected example endpoint",
				tags: ["Protected"],
			},
		},
	)
	.options(
		"/example",
		() =>
			record("protected.example.options", () => {
				return Stringify({
					message: "CORS preflight response",
					status: 204,
					allow: "GET,OPTIONS,HEAD",
				});
			}),
		{
			detail: {
				summary: "Protected Example OPTIONS",
				description: "CORS preflight for protected example",
				tags: ["Protected"],
			},
		},
	);
