import { swagger } from "@elysiajs/swagger";
import { authRoute } from "@/api/routes/auth/index";
import { mediaRoutes } from "@/api/routes/media/index";
import { protectedRoute } from "@/api/routes/protected/index";
import { utilityRoute } from "@/api/routes/utility/index";
import { createElysiaApp } from "@/core/create-elysia-app";

const app = createElysiaApp({
	prefix: "/api/v1",
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
					url: "https://github.com/your-org/your-repo",
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

export const ALL = app.handle;
