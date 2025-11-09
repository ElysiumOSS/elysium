import { Elysia, t } from 'elysia';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { ogs, userAgent } from '@/lib/ogs';

export const mediaRoutes = new Elysia()
    .post('/upload-image', async ({ body, set }) => {
        const { image } = body;

        // 1. Validate MIME type
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        set.status = 400;
        return { error: 'Invalid file type. Only JPEG and PNG are allowed.' };
        }

        // 2. Validate file size (<= 5MB)
        if (image.size > 5 * 1024 * 1024) {
        set.status = 400;
        return { error: 'File size exceeds 5MB.' };
        }

        const imageBuffer = await image.arrayBuffer();
        const imageSharp = sharp(imageBuffer);
        const metadata = await imageSharp.metadata();

        // 3. Validate resolution (>= 1024x1024)
        if (!metadata.width || !metadata.height || metadata.width < 1024 || metadata.height < 1024) {
        set.status = 400;
        return { error: 'Image resolution must be at least 1024x1024 pixels.' };
        }

        // 4. Compress and store image
        const optimizedImageBuffer = await imageSharp.jpeg({ quality: 80 }).toBuffer();
        const filename = `${Date.now()}-${image.name.split('.')[0]}.jpg`;
        const imagePath = `./public/uploads/${filename}`;
        
        await writeFile(imagePath, new Uint8Array(optimizedImageBuffer));

        const imageUrl = `/uploads/${filename}`;
        return { imageUrl };
    }, {
        body: t.Object({
        image: t.File()
        }),
        detail: {
            summary: 'Upload an image',
            description: 'Upload, validate, and optimize an image.',
            tags: ['Media']
        }
    })
    .get('/fetch-og-image', async ({ query, set }) => {
        const { url } = query;

        if (!url) {
        set.status = 400;
        return { error: 'URL is required.' };
        }

        try {
        const { result } = await ogs({ url, fetchOptions: { headers: { 'user-agent': userAgent } } });
        const imageUrl = result.ogImage?.[0]?.url || 'https://placehold.co/48x48';
        return { imageUrl };
        } catch (error) {
        console.error('Error fetching image link:', error);
        set.status = 500;
        return { error: 'Error fetching Open Graph image.' };
        }
    }, {
        query: t.Object({
            url: t.String()
        }),
        detail: {
            summary: 'Fetch Open Graph image',
            description: 'Fetch the Open Graph image from a URL.',
            tags: ['Media']
        }
    });
