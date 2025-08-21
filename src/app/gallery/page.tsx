// File: src/app/gallery/page.tsx
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

interface SEOData {
  meta_title: string;
  meta_description: string;
  content?: string;
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

// --- DYNAMIC METADATA ---
export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seo/gallery`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        title: 'Design Gallery | KayaPalat',
        description: 'A collection of stunning interior designs.',
      };
    }

    const seoData: SEOData = await res.json();

    return {
      title: seoData.meta_title,
      description: seoData.meta_description,
    };
  } catch (error) {
    console.error("SEO data fetch error:", error);
    return {
      title: 'Design Gallery | KayaPalat',
      description: 'A collection of stunning interior designs.',
    };
  }
}

// --- SEO Block Data Fetch ---

// --- MAIN PAGE COMPONENT ---
export default async function GalleryPage() {
  const { images, categories } = await getGalleryData();

  return (
    <main>

      <GalleryClient images={images} categories={categories} />
      
      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </main>
  );
}
