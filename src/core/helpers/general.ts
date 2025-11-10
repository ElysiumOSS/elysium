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
 * Returns the base URL for the application.
 * @returns {string} The base URL.
 */
export const getURL = (): string => {
	// In a real application, this would be dynamically determined based on environment
	return "http://localhost:4321";
};

/**
 * Stringifies an object with 2-space indentation.
 * @param {object} o - The object to stringify.
 * @returns {string} The pretty-printed JSON string.
 */
export const Stringify = (o: object): string => JSON.stringify(o, null, 2);
