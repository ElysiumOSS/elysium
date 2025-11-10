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

import { bearer } from "@elysiajs/bearer";
import { generateKeyPairSync } from "crypto";
import { Elysia } from "elysia";
import jwt from "jsonwebtoken";

/**
 * The secret used for signing and verifying JWT tokens.
 * @type {string}
 */
const JWT_SECRET: string = process.env.JWT_SECRET || "dev_secret";

/**
 * Authentication route for registering a new user.
 * Generates an RSA key pair and returns a JWT and the private key.
 */
export const authRoute = new Elysia().post("/auth/register", () => {
	const { publicKey, privateKey } = generateKeyPairSync("rsa", {
		modulusLength: 2048,
	});

	const token = jwt.sign(
		{ pub: publicKey.export({ type: "pkcs1", format: "pem" }) },
		JWT_SECRET,
		{ algorithm: "HS256", expiresIn: 30 },
	);

	return {
		token,
		privateKey: privateKey.export({ type: "pkcs1", format: "pem" }),
	};
});

/**
 * Middleware to require JWT Bearer authentication.
 * Throws an error if the token is missing or invalid.
 */
export const requireAuth = new Elysia().use(bearer()).derive(({ bearer }) => {
	if (!bearer) throw new Error("Missing Bearer token");
	try {
		const payload = jwt.verify(bearer, JWT_SECRET) as { pub: string };
		return { publicKey: payload.pub };
	} catch {
		throw new Error("Invalid or expired token");
	}
});
