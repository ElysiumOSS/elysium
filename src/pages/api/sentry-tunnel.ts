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

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const envelope = await request.text();
		const [header] = envelope.split("\n");
		const { dsn } = JSON.parse(header);

		if (!dsn) {
			return new Response("No DSN found in Sentry envelope header", {
				status: 400,
			});
		}

		const { host, pathname } = new URL(dsn);
		const projectId = pathname.substring(1);
		const upstreamUrl = `https://${host}/api/${projectId}/envelope/`;

		const response = await fetch(upstreamUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-sentry-envelope",
			},
			body: envelope,
		});

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});
	} catch (error) {
		console.error("Error tunneling Sentry request:", error);
		return new Response("Error tunneling Sentry request", { status: 500 });
	}
};
