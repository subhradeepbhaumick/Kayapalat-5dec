// File: src/app/gallery/page.tsx
import { GalleryClient } from "./GalleryClient";

// --- INTERFACES
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

// A new interface for our Category objects, which now include an icon.
export interface Category {
  id: number;
  name: string;
  icon_name: string | null;
}

interface SEOData {
  meta_title: string;
  meta_description: string;
}

// --- DATA FETCHING ---
// This function is updated to fetch all the new data and derive categories from the images.
async function getGalleryData(): Promise<{ images: GalleryImage[], categories: Category[] }> {
  try {
    // We only need to call the gallery-images endpoint now, as it contains all the data.
    const imagesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images`, { 
      cache: 'no-store' 
    });

    if (!imagesRes.ok) {
      throw new Error('Failed to fetch gallery data');
    }

    const images: GalleryImage[] = await imagesRes.json();
    
    // --- Derive unique categories from the fetched images ---
    // This is more efficient than a separate API call.
    const categoryMap = new Map<number, Category>();
    images.forEach(img => {
      // If we haven't seen this category ID before, add it to our map.
      if (!categoryMap.has(img.category_id)) {
        categoryMap.set(img.category_id, {
          id: img.category_id,
          name: img.category_name,
          icon_name: img.icon_name,
        });
      }
    });
    // Convert the map of unique categories into an array.
    const categories = Array.from(categoryMap.values());

    return { images, categories };

  } catch (error) {
    console.error("Gallery data fetch error:", error);
    // Return empty arrays on error to prevent the page from crashing.
    return { images: [], categories: [] }; 
  }
}

// --- DYNAMIC METADATA (No changes needed here) ---
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


// --- MAIN PAGE COMPONENT ---
export default async function GalleryPage() {
  // Fetch the redesigned data structure.
  const { images, categories } = await getGalleryData();

  return (
    <main>
      {/* Hero Section (No changes needed here) */}
      <section className="bg-[#00423D] text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-saira-stencil font-bold tracking-wider">
          Our Design Gallery
        </h1>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          Explore a curated collection of our finest interior designs and find your inspiration.
        </p>
      </section>

      {/* Pass the full images and categories arrays to the client component */}
      <GalleryClient images={images} categories={categories} />
    </main>
  );
}







