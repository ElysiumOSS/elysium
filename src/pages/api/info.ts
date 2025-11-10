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

export const GET: APIRoute = () => {
	return new Response(
		JSON.stringify({
			message: "Information about the API",
			status: 200,
			data: {
				contact: "example @example.com",
				documentationUrl: "https://docs.your-api.com",
			},
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
};

export const HEAD: APIRoute = () => {
	return new Response(null, {
		status: 200,
	});
};

export const OPTIONS: APIRoute = () => {
	return new Response(
		JSON.stringify({
			message: "CORS preflight response",
			status: 204,
			allow: "GET,OPTIONS,HEAD",
		}),
		{
			status: 204,
			headers: {
				"Content-Type": "application/json",
				"Allow": "GET,OPTIONS,HEAD",
			},
		}
	);
};
