import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import path from 'path';
import { writeFile, unlink, stat, mkdir } from 'fs/promises';

// ✅ CORS setup
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// --- HELPER FUNCTION TO ENSURE DIRECTORY EXISTS ---
async function ensureDirExists(directoryPath: string) {
    try {
        await stat(directoryPath);
    } catch (e: any) {
        if (e.code === 'ENOENT') {
            await mkdir(directoryPath, { recursive: true });
        } else {
            throw e;
        }
    }
}

// GET: Get a single review by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return corsResponse({ error: 'Invalid review ID' }, 400);
        }

        const reviews = await db.query(
            'SELECT id, name, message, rating, profileImage, reviewImages, createdAt FROM client_reviews WHERE id = ?',
            [id]
        );

        if (reviews.length === 0) {
            return corsResponse({ error: 'Review not found' }, 404);
        }

        const review = reviews[0] as any;
        const parsedReviewImages = (() => {
            try {
                if (!review.reviewImages) return [];
                const parsed = typeof review.reviewImages === "string"
                    ? JSON.parse(review.reviewImages)
                    : review.reviewImages;
                // Backward compatibility: if array of strings, convert to {type: "image", url}
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
                    return parsed.map((url: string) => ({ type: "image", url }));
                }
                return parsed;
            } catch {
                return [];
            }
        })();
        return corsResponse({
            ...review,
            reviewImages: parsedReviewImages
        });
    } catch (error) {
        console.error('[CLIENT_REVIEWS_GET_BY_ID]', error);
        return corsResponse({ error: 'Internal Server Error' }, 500);
    }
}

// PUT: Update an existing review
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return corsResponse({ error: 'Invalid review ID' }, 400);
        }

        // Get existing review
        const existingReviews = await db.query(
            'SELECT profileImage, reviewImages FROM client_reviews WHERE id = ?',
            [id]
        );

        if (existingReviews.length === 0) {
            return corsResponse({ error: 'Review not found' }, 404);
        }

        const existingReview = existingReviews[0] as { profileImage: string | null; reviewImages: string | null };

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const message = formData.get('message') as string;
        const ratingStr = formData.get('rating') as string;
        const profileFile = formData.get('profileImage') as File | null;
        const reviewFiles = formData.getAll('reviewImages') as File[];
        const videoUrlsStr = formData.get('videoUrls') as string | null;

        // Validate required fields
        if (!name || !message || !ratingStr) {
            return corsResponse({ error: 'Name, message, and rating are required' }, 400);
        }

        const rating = parseInt(ratingStr);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return corsResponse({ error: 'Rating must be a number between 1 and 5' }, 400);
        }

        let profileImageUrl = existingReview.profileImage;
        if (profileFile) {
            // Delete old profile image if it exists
            if (existingReview.profileImage) {
                try {
                    await unlink(path.join(process.cwd(), 'public', existingReview.profileImage));
                } catch (error) {
                    console.log('Old profile image file not found or already deleted');
                }
            }
            // Upload new profile image
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'client-reviews');
            await ensureDirExists(uploadsDir);
            const filename = `${Date.now()}-profile-${profileFile.name.replace(/\s/g, '_')}`;
            profileImageUrl = `/uploads/client-reviews/${filename}`;
            await writeFile(path.join(uploadsDir, filename), Buffer.from(await profileFile.arrayBuffer()));
        }

        // Parse existing reviewImages for backward compatibility
        const existingReviewImages: { type: "image" | "video"; url: string }[] = (() => {
            try {
                if (!existingReview.reviewImages) return [];
                const parsed = typeof existingReview.reviewImages === "string"
                    ? JSON.parse(existingReview.reviewImages)
                    : existingReview.reviewImages;
                // Backward compatibility: if array of strings, convert to {type: "image", url}
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
                    return parsed.map((url: string) => ({ type: "image", url }));
                }
                return parsed;
            } catch {
                return [];
            }
        })();

        const newReviewImages: { type: "image" | "video"; url: string }[] = [];

        // Handle uploaded image files (replace existing images)
        if (reviewFiles.length > 0) {
            // Delete old image files
            for (const item of existingReviewImages) {
                if (item.type === "image") {
                    try {
                        await unlink(path.join(process.cwd(), 'public', item.url));
                    } catch (error) {
                        console.log('Old review image file not found or already deleted');
                    }
                }
            }
            // Upload new review images
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'client-reviews');
            await ensureDirExists(uploadsDir);
            for (const file of reviewFiles) {
                const filename = `${Date.now()}-review-${file.name.replace(/\s/g, '_')}`;
                const url = `/uploads/client-reviews/${filename}`;
                newReviewImages.push({ type: "image", url });
                await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
            }
        } else {
            // If no new images, keep existing images
            newReviewImages.push(...existingReviewImages.filter(item => item.type === "image"));
        }

        // Handle video URLs (replace existing videos)
        if (videoUrlsStr) {
            try {
                const videoUrls: string[] = JSON.parse(videoUrlsStr);
                for (const url of videoUrls) {
                    if (typeof url === "string" && url.trim()) {
                        newReviewImages.push({ type: "video", url: url.trim() });
                    }
                }
            } catch (error) {
                return corsResponse({ error: "Invalid videoUrls format" }, 400);
            }
        } else {
            // If no new videos, keep existing videos
            newReviewImages.push(...existingReviewImages.filter(item => item.type === "video"));
        }

        const updateQuery = `
            UPDATE client_reviews SET name = ?, message = ?, rating = ?, profileImage = ?, reviewImages = ?
            WHERE id = ?
        `;
        const updateParams = [name, message, rating, profileImageUrl, JSON.stringify(newReviewImages), id];
        await db.query(updateQuery, updateParams);

        return corsResponse({ message: 'Review updated successfully' });
    } catch (error: any) {
        console.error('[CLIENT_REVIEWS_PUT]', error);
        return corsResponse({ error: error.message || 'Internal Server Error' }, 500);
    }
}

// DELETE: Delete a review by ID and remove its images
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return corsResponse({ error: 'Invalid review ID' }, 400);
        }

        // Get review data to find image paths
        const reviews = await db.query(
            'SELECT profileImage, reviewImages FROM client_reviews WHERE id = ?',
            [id]
        );

        if (reviews.length === 0) {
            return corsResponse({ error: 'Review not found' }, 404);
        }

        const review = reviews[0] as { profileImage: string | null; reviewImages: string | null };

        // Delete profile image file if it exists
        if (review.profileImage) {
            try {
                await unlink(path.join(process.cwd(), 'public', review.profileImage));
            } catch (error) {
                console.log('Profile image file not found or already deleted');
            }
        }

        // Delete review images if they exist (only image files, not videos)
        if (review.reviewImages) {
            const reviewImages: { type: "image" | "video"; url: string }[] = (() => {
                try {
                    const parsed = typeof review.reviewImages === "string"
                        ? JSON.parse(review.reviewImages)
                        : review.reviewImages;
                    // Backward compatibility: if array of strings, convert to {type: "image", url}
                    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
                        return parsed.map((url: string) => ({ type: "image", url }));
                    }
                    return parsed;
                } catch {
                    return [];
                }
            })();
            for (const item of reviewImages) {
                if (item.type === "image") {
                    try {
                        await unlink(path.join(process.cwd(), 'public', item.url));
                    } catch (error) {
                        console.log('Review image file not found or already deleted');
                    }
                }
            }
        }

        // Delete review from database
        await db.query('DELETE FROM client_reviews WHERE id = ?', [id]);

        return corsResponse({ message: 'Review deleted successfully' });
    } catch (error: any) {
        console.error('[CLIENT_REVIEWS_DELETE]', error);
        return corsResponse({ error: error.message || 'Internal Server Error' }, 500);
    }
}
