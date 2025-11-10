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

import * as S from "@effect/schema/Schema";

/**
 * Represents a project.
 */
export const Project = S.Struct({
	/**
	 * The unique identifier for the project.
	 */
	id: S.String,
	/**
	 * The title of the project.
	 */
	title: S.String,
	/**
	 * A brief description of the project.
	 */
	description: S.String,
	/**
	 * A list of tags associated with the project.
	 */
	tags: S.Array(S.String),
	/**
	 * The URL to the project.
	 */
	link: S.String,
	/**
	 * The URL of the project's image.
	 */
	imageUrl: S.optional(S.String),
	/**
	 * The year the project was created.
	 */
	year: S.optional(S.String),
	/**
	 * The logo/icon for the project.
	 */
	logo: S.optional(S.String),
});

export type Project = S.Schema.Type<typeof Project>;
