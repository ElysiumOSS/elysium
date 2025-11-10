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

import { swagger } from "@elysiajs/swagger";
import { authRoute } from "@/api/routes/auth/index";
import { mediaRoutes } from "@/api/routes/media/index";
import { protectedRoute } from "@/api/routes/protected/index";
import { utilityRoute } from "@/api/routes/utility/index";
import { createElysiaApp } from "@/core/create-elysia-app";

const app = createElysiaApp({
	prefix: "",
	enableTelemetry: false, // Disable for Vercel compatibility
})
	.use(authRoute)
	.use(protectedRoute)
	.use(utilityRoute)
	.use(mediaRoutes)
	.use(
		swagger({
			path: "/swagger",
			documentation: {
				info: {
					title: "🦊 Elysia Advanced API",
					version: "1.0.0",
					description: `
Welcome to the **Elysia Advanced API**! 
This API demonstrates advanced features including authentication,
security, observability, and more.
- 🚀 **Fast** and modern API with [ElysiaJS](https://elysiajs.com)
- 🔒 Security best practices (Helmet, Rate Limiting, CORS)
- 📊 Observability (OpenTelemetry)
- 📝 Auto-generated OpenAPI docs
> **Contact:** [Your Name](mailto:example @example.com)  
> **Docs:** [API Docs](https://docs.your-api.com)
        `,
					termsOfService: "https://your-api.com/terms",
					contact: {
						name: "API Support",
						url: "https://your-api.com/support",
						email: "support @your-api.com",
					},
					license: {
						name: "MIT",
						url: "https://opensource.org/licenses/MIT",
					},
				},
				externalDocs: {
					description: "Find more info here",
					url: "https://github.com/ElysiumOSS/elysium",
				},
				tags: [
					{
						name: "Utility",
						description: "Endpoints for status, version, and root  API info.",
					},
					{
						name: "Health",
						description: "Health check endpoints for uptime  monitoring.",
					},
					{
						name: "Info",
						description: "General API information endpoints.",
					},
					{
						name: "Protected",
						description: "Endpoints that require authentication  (JWT Bearer).",
					},
					{
						name: "Media",
						description: "Endpoints for media handling.",
					},
				],
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
							description:
								"Enter your JWT Bearer token to access  protected endpoints.",
						},
					},
				},
			},
		}),
	);

// Export individual HTTP method handlers for Astro
export const GET = (context: { request: Request }) => app.handle(context.request);
export const POST = (context: { request: Request }) => app.handle(context.request);
export const PUT = (context: { request: Request }) => app.handle(context.request);
export const PATCH = (context: { request: Request }) => app.handle(context.request);
export const DELETE = (context: { request: Request }) => app.handle(context.request);
export const ALL = (context: { request: Request }) => app.handle(context.request);
