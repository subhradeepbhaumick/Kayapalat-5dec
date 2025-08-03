// File: src/app/blogs/[slug]/BlogHeroSection.tsx

import BlogHeroClient from "./BlogHeroClient";

// --- INTERFACES ---
interface SliderData {
  id: number;
  before_image: string;
  after_image: string;
  category_id: number;
  status: 'published' | 'draft';
}
interface CategoryData {
  id: number;
  name: string;
  icon_name: string;
}

// --- SERVER-SIDE DATA FETCHING ---
async function getBlogPageSliders(): Promise<SliderData[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image-slider?page=blogs`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch blog page sliders:", error);
        return [];
    }
}

async function getSliderCategories(): Promise<CategoryData[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slider-categories`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch slider categories:", error);
        return [];
    }
}

export async function BlogHeroSection() {
  const [sliders, allCategories] = await Promise.all([
      getBlogPageSliders(),
      getSliderCategories()
  ]);

  // Filter out categories that don't have any published sliders
  const publishedSliders = sliders.filter(s => s.status === 'published');
  const usedCategoryIds = new Set(publishedSliders.map(s => s.category_id));
  const filteredCategories = allCategories.filter(c => usedCategoryIds.has(c.id));

  return <BlogHeroClient sliders={publishedSliders} categories={filteredCategories} />;
}