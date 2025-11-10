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

export interface SecurityConfig {
	csp?: {
		defaultSrc?: string[];
		scriptSrc?: string[];
		styleSrc?: string[];
		imgSrc?: string[];
		useNonce?: boolean;
	};
	hsts?: {
		maxAge?: number;
		includeSubDomains?: boolean;
		preload?: boolean;
	};
	frameOptions?: "DENY" | "SAMEORIGIN";
	referrerPolicy?: string;
	permissionsPolicy?: Record<string, string[]>;
}

/**
 * Simple security headers middleware for Elysia.
 * Replaces elysiajs-helmet for better Vercel compatibility.
 *
 * @param config - Security configuration
 * @returns Elysia plugin
 */
export const securityHeaders = (config: SecurityConfig = {}) =>
	new Elysia({ name: "security-headers" }).onAfterHandle(({ set }) => {
		// Content Security Policy
		if (config.csp) {
			const directives: string[] = [];
			if (config.csp.defaultSrc)
				directives.push(`default-src ${config.csp.defaultSrc.join(" ")}`);
			if (config.csp.scriptSrc)
				directives.push(`script-src ${config.csp.scriptSrc.join(" ")}`);
			if (config.csp.styleSrc)
				directives.push(`style-src ${config.csp.styleSrc.join(" ")}`);
			if (config.csp.imgSrc)
				directives.push(`img-src ${config.csp.imgSrc.join(" ")}`);

			set.headers["Content-Security-Policy"] = directives.join("; ");
		}

		// HSTS
		if (config.hsts) {
			const parts: string[] = [`max-age=${config.hsts.maxAge ?? 31536000}`];
			if (config.hsts.includeSubDomains) parts.push("includeSubDomains");
			if (config.hsts.preload) parts.push("preload");
			set.headers["Strict-Transport-Security"] = parts.join("; ");
		}

		// X-Frame-Options
		if (config.frameOptions) {
			set.headers["X-Frame-Options"] = config.frameOptions;
		}

		// Referrer Policy
		if (config.referrerPolicy) {
			set.headers["Referrer-Policy"] = config.referrerPolicy;
		}

		// Permissions Policy
		if (config.permissionsPolicy) {
			const policies = Object.entries(config.permissionsPolicy)
				.map(([key, values]) => `${key}=(${values.join(" ")})`)
				.join(", ");
			set.headers["Permissions-Policy"] = policies;
		}

		// Additional security headers
		set.headers["X-Content-Type-Options"] = "nosniff";
		set.headers["X-DNS-Prefetch-Control"] = "off";
		set.headers["X-Download-Options"] = "noopen";
		set.headers["X-Permitted-Cross-Domain-Policies"] = "none";
	});
