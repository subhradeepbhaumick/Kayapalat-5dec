import { headers } from 'next/headers';
import Head from 'next/head';
import { GalleryClient } from "./GalleryClient";
import { ScrollToTopButton } from '@/app/blogs/[slug]/ScrollToTopButton';

// --- INTERFACES ---
export interface GalleryImage {
  id: number;
  title: string;
  image_path: string;
  is_featured: boolean;
  likes: number;
  designer_name: string | null;
  designer_designation: string | null;
  designer_dp_path: string | null;
  designer_comment: string | null;
  category_id: number;
  category_name: string;
  icon_name: string | null;
}

export interface Category {
  id: number;
  name: string;
  icon_name: string | null;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}


// --- DATA FETCHING ---
async function getGalleryData(): Promise<{ images: GalleryImage[]; categories: Category[] }> {
  try {
    const imagesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images`, {
      cache: 'no-store',
    });

    if (!imagesRes.ok) {
      throw new Error('Failed to fetch gallery data');
    }

    const images: GalleryImage[] = await imagesRes.json();

    // Derive unique categories from images
    const categoryMap = new Map<number, Category>();
    images.forEach(img => {
      if (!categoryMap.has(img.category_id)) {
        categoryMap.set(img.category_id, {
          id: img.category_id,
          name: img.category_name,
          icon_name: img.icon_name,
        });
      }
    });

    const categories = Array.from(categoryMap.values());

    return { images, categories };
  } catch (error) {
    console.error("Gallery data fetch error:", error);
    return { images: [], categories: [] };
  }
}

// --- Helper: Get “image” query param from request headers on server
async function getImageSlugFromSearchParams(): Promise<string | null> {
  try {
    const headersList = await headers();  // await the Promise here
    const referer = headersList.get('referer') || '';
    if (!referer) return null;
    const url = new URL(referer);
    return url.searchParams.get('image');
  } catch {
    return null;
  }
}

// --- MAIN PAGE COMPONENT ---
export default async function GalleryPage() {
  const { images, categories } = await getGalleryData();
  const slug = await getImageSlugFromSearchParams();

  // Find image from slug
  const currentImage = slug ? images.find(img => slugify(img.title) === slug) : null;

  return (
    <>
      <Head>
        <title>{currentImage ? currentImage.title : "Design Gallery | KayaPalat"}</title>
        <meta name="description" content={currentImage ? (currentImage.designer_comment || 'Interior design') : 'A collection of stunning interior designs.'} />

        {currentImage && (
          <>
            {/* Open Graph / Facebook */}
            <meta property="og:title" content={currentImage.title} />
            <meta property="og:image" content={currentImage.image_path} />
            <meta property="og:description" content={currentImage.designer_comment || 'Interior design'} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/gallery?image=${slug}`} />

            {/* Twitter */}
            <meta name="twitter:title" content={currentImage.title} />
            <meta name="twitter:image" content={currentImage.image_path} />
            <meta name="twitter:description" content={currentImage.designer_comment || 'Interior design'} />
          </>
        )}
      </Head>

      <main>
        <GalleryClient images={images} categories={categories} />
        <ScrollToTopButton />
      </main>
    </>
  );
}
