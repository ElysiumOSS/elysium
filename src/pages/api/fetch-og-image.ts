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
import { ogs, userAgent } from "@/lib/ogs";

export const GET: APIRoute = async ({ url }) => {
	const queryUrl = url.searchParams.get("url");

	if (!queryUrl) {
		return new Response(
			JSON.stringify({ error: "URL is required." }),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}

	try {
		const { result } = await ogs({
			url: queryUrl,
			fetchOptions: { headers: { "user-agent": userAgent } },
		});
		
		const imageUrl = result.ogImage?.[0]?.url || "https://placehold.co/48x48";
		
		return new Response(
			JSON.stringify({ imageUrl }),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (error) {
		console.error("Error fetching image link:", error);
		return new Response(
			JSON.stringify({ error: "Error fetching Open Graph image." }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
};
