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

import type { APIRoute } from "astro";
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData();
		const image = formData.get("image") as File;

		if (!image) {
			return new Response(
				JSON.stringify({ error: "No image provided." }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// 1. Validate MIME type
		if (image.type !== "image/jpeg" && image.type !== "image/png") {
			return new Response(
				JSON.stringify({ error: "Invalid file type. Only JPEG and PNG are allowed." }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// 2. Validate file size (<= 5MB)
		if (image.size > 5 * 1024 * 1024) {
			return new Response(
				JSON.stringify({ error: "File size exceeds 5MB." }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const imageBuffer = await image.arrayBuffer();
		const imageSharp = sharp(imageBuffer);
		const metadata = await imageSharp.metadata();

		// 3. Validate resolution (>= 1024x1024)
		if (
			!metadata.width ||
			!metadata.height ||
			metadata.width < 1024 ||
			metadata.height < 1024
		) {
			return new Response(
				JSON.stringify({ error: "Image resolution must be at least 1024x1024 pixels." }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// 4. Compress and store image
		const optimizedImageBuffer = await imageSharp
			.jpeg({ quality: 80 })
			.toBuffer();
		const filename = `${Date.now()}-${image.name.split(".")[0]}.jpg`;
		const imagePath = `./public/uploads/${filename}`;

		await writeFile(imagePath, new Uint8Array(optimizedImageBuffer));

		const imageUrl = `/uploads/${filename}`;
		
		return new Response(
			JSON.stringify({ imageUrl }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Error uploading image:", error);
		return new Response(
			JSON.stringify({ error: "Error uploading image." }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
};
