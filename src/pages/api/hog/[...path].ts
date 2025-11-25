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
 * limitations under the License. *
 */

import type { APIRoute } from "astro";

const PH_HOST = import.meta.env.PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const PH_ASSET_HOST = PH_HOST.replace(".i.posthog.com", "-assets.i.posthog.com");

export const ALL: APIRoute = async ({ request, params }) => {
	const path = params.path || "";
	const isAsset = path.startsWith("static/");

	const upstreamHost = isAsset ? PH_ASSET_HOST : PH_HOST;
	const upstreamUrl = new URL(path, upstreamHost);

	// Append search parameters from the original request
	const requestUrl = new URL(request.url);
	upstreamUrl.search = requestUrl.search;

	try {
		const body = (request.method === "POST" || request.method === "PUT") ? await request.arrayBuffer() : undefined;

		const response = await fetch(upstreamUrl.toString(), {
			method: request.method,
			headers: request.headers,
			body: body,
			redirect: "manual",
		});

		// Create a new response with the fetched data, so we can modify headers
		const newResponse = new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});

		// Remove content-encoding and content-length headers to avoid decoding errors
		newResponse.headers.delete("content-encoding");
		newResponse.headers.delete("content-length");

		// Set CORS headers to allow cross-origin requests
		newResponse.headers.set("Access-Control-Allow-Origin", "*");
		newResponse.headers.set(
			"Access-Control-Allow-Methods",
			"GET, POST, OPTIONS",
		);
		newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

		return newResponse;
	} catch (error) {
		console.error("Error proxying PostHog request:", error);
		return new Response("Error proxying PostHog request", { status: 500 });
	}
};
