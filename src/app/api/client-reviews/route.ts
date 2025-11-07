import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initializeDatabase } from "@/lib/initDB";
import path from "path";
import { writeFile, mkdir, stat } from "fs/promises";

// ✅ CORS setup
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// --- HELPER FUNCTION TO ENSURE DIRECTORY EXISTS ---
async function ensureDirExists(directoryPath: string) {
  try {
    await stat(directoryPath);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(directoryPath, { recursive: true });
    } else {
      throw e;
    }
  }
}

export async function OPTIONS() {
  return corsResponse({ message: "CORS preflight successful" }, 200);
}

// ✅ GET all reviews
export async function GET() {
  try {
    await initializeDatabase();
    const reviews = await db.query(
      `SELECT id, name, rating, message, profileImage, reviewImages, createdAt
       FROM client_reviews
       ORDER BY createdAt DESC`
    );

    const parsedReviews = reviews.map((review: any) => ({
      ...review,
      reviewImages: (() => {
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
      })(),
    }));

    return corsResponse(parsedReviews, 200);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return corsResponse({ error: error.message }, 500);
  }
}

// ✅ POST new review (separate function)
export async function POST(req: Request) {
  try {
    await initializeDatabase();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const ratingStr = formData.get("rating") as string;
    const message = formData.get("message") as string;
    const profileFile = formData.get("profileImage") as File | null;
    const reviewFiles = formData.getAll("reviewImages") as File[];
    const videoUrlsStr = formData.get("videoUrls") as string | null;

    if (!name || !ratingStr || !message) {
      return corsResponse({ error: "Name, rating, and message are required" }, 400);
    }

    const rating = parseInt(ratingStr);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return corsResponse({ error: "Rating must be between 1 and 5" }, 400);
    }

    let profileImageUrl = null;
    if (profileFile) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "client-reviews");
      await ensureDirExists(uploadsDir);
      const filename = `${Date.now()}-profile-${profileFile.name.replace(/\s/g, "_")}`;
      profileImageUrl = `/uploads/client-reviews/${filename}`;
      await writeFile(path.join(uploadsDir, filename), Buffer.from(await profileFile.arrayBuffer()));
    }

    const reviewImages: { type: "image" | "video"; url: string }[] = [];

    // Handle uploaded image files
    if (reviewFiles.length > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "client-reviews");
      await ensureDirExists(uploadsDir);
      for (const file of reviewFiles) {
        const filename = `${Date.now()}-review-${file.name.replace(/\s/g, "_")}`;
        const url = `/uploads/client-reviews/${filename}`;
        reviewImages.push({ type: "image", url });
        await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
      }
    }

    // Handle video URLs
    if (videoUrlsStr) {
      try {
        const videoUrls: string[] = JSON.parse(videoUrlsStr);
        for (const url of videoUrls) {
          if (typeof url === "string" && url.trim()) {
            reviewImages.push({ type: "video", url: url.trim() });
          }
        }
      } catch (error) {
        return corsResponse({ error: "Invalid videoUrls format" }, 400);
      }
    }

    await db.query(
      `INSERT INTO client_reviews (name, rating, message, profileImage, reviewImages, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, rating, message, profileImageUrl, JSON.stringify(reviewImages)]
    );

    return corsResponse({ success: true, message: "Review added successfully" }, 201);
  } catch (error: any) {
    console.error("Error inserting review:", error);
    return corsResponse({ error: error.message }, 500);
  }
}
