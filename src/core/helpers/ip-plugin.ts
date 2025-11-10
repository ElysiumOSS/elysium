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

import { Elysia } from "elysia";

/**
 * List of headers to check for client IP address.
 * Priority order based on common proxy/CDN configurations.
 *
 * @see https://github.com/gaurishhs/elysia-ip
 */
const headersToCheck = [
	"x-forwarded-for", // de-facto standard header
	"x-real-ip", // Nginx proxy/FastCGI
	"x-client-ip", // Apache
	"cf-connecting-ip", // Cloudflare
	"fastly-client-ip", // Fastly
	"x-cluster-client-ip", // GCP
	"forwarded-for", // RFC 7239
	"forwarded", // RFC 7239
	"appengine-user-ip", // GCP
	"true-client-ip", // Akamai and Cloudflare
	"cf-pseudo-ipv4", // Cloudflare
	"fly-client-ip", // Fly.io
] as const;

/**
 * Extract IP address from request headers.
 *
 * @param headers - Request headers
 * @returns IP address string or null if not found
 */
function getIP(headers: Headers): string | null {
	// Check x-forwarded-for first (most common)
	const forwarded = headers.get("x-forwarded-for");
	if (forwarded) {
		// x-forwarded-for can contain multiple IPs, take the first one
		return forwarded.split(",")[0].trim();
	}

	// Check other headers in priority order
	for (const header of headersToCheck) {
		const value = headers.get(header);
		if (value) {
			return value.trim();
		}
	}

	return null;
}

/**
 * Elysia IP plugin - extracts client IP address from request.
 * Works with Bun runtime, Cloudflare, Vercel, and other platforms.
 *
 * For Bun runtime, uses server.requestIP() when available.
 * Falls back to checking standard proxy headers.
 *
 * @author Mike Odnis
 * @version 1.0.0
 * @see https://github.com/gaurishhs/elysia-ip
 * @returns {Elysia} Elysia plugin with IP decorator
 *
 * @example
 * ```ts
 * import { Elysia } from "elysia";
 * import { ip } from "./core/helpers/ip-plugin";
 *
 * new Elysia()
 *   .use(ip())
 *   .get("/", ({ ip }) => ({ ip }))
 *   .listen(3000);
 * ```
 */
export const ip = () =>
	new Elysia({ name: "elysia-ip" }).derive(
		{ as: "global" },
		({ server, request }): { ip: string } => {
			// Try Bun's server.requestIP first (Bun v1.0.4+)
			if (globalThis.Bun && server?.requestIP) {
				try {
					const socketAddress = server.requestIP(request);
					if (socketAddress?.address) {
						return { ip: socketAddress.address };
					}
				} catch (error) {
					// Fall through to header checking
					console.warn("Failed to get IP from server.requestIP:", error);
				}
			}

			// Fall back to header checking (works on all runtimes)
			const headerIP = getIP(request.headers);
			return { ip: headerIP || "unknown" };
		},
	);

