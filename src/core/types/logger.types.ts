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

/**
 * @type ColorKey
 * @description The color key for the logger.
 */
export type ColorKey =
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white";

/**
 * @interface LogData
 * @description The data for the logger.
 * @property {string} [message] - The message to log.
 * @property {any} [data] - The data to log.
 */
export interface LogData {
	message?: string;
	data?: any;
}

/**
 * @interface LoggerOptions
 * @description The options for the logger.
 * @property {boolean} [pretty] - Whether to pretty print the log.
 * @property {boolean} [json] - Whether to log in JSON format.
 * @property {boolean} [timestamps] - Whether to include timestamps in the log.
 * @property {string} [logLevel] - The log level.
 */
export interface LoggerOptions {
	pretty?: boolean;
	json?: boolean;
	timestamps?: boolean;
	logLevel?: string;
}
