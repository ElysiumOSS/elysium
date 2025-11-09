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
});

export type Project = S.Schema.Type<typeof Project>;
