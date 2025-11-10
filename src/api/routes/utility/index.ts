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
import { healthRoute } from "../health";
import { infoRoute } from "../info";
import { rootRoute } from "../root";
import { versionRoute } from "../version";
import { statusRoute } from "./status";

/**
 * Utility routes aggregator
 * Combines all utility endpoints into a single route group
 */
export const utilityRoute = new Elysia()
	.use(rootRoute)
	.group("/status", (app) => app.use(statusRoute))
	.group("/version", (app) => app.use(versionRoute))
	.group("/info", (app) => app.use(infoRoute))
	.group("/health", (app) => app.use(healthRoute));

