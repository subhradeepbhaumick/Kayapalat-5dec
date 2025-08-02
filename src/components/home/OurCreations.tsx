// File: src/components/OurCreations.tsx

import { OurCreationsClient } from './OurCreationsClient';

// --- INTERFACES ---
interface SliderData {
  id: number;
  before_image: string;
  after_image: string;
  testimonial_name: string;
  designation: string;
  rating: number;
  comment: string;
  testimonial_dp: string;
  category_id: number;
  category_name: string;
  page: string;
  status: 'published' | 'draft';
}
interface CategoryData {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
}

// --- SERVER-SIDE DATA FETCHING ---
async function getSliders(page: string): Promise<SliderData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image-slider?page=${page}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function getSliderCategories(): Promise<CategoryData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slider-categories`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

// --- SERVER COMPONENT ---
const OurCreations = async ({ page }: { page: string }) => {
  const [allSliders, allCategories] = await Promise.all([
    getSliders(page),
    getSliderCategories()
  ]);

  // --- UPDATED FILTERING LOGIC ---

  // 1. First, get only the sliders that are published.
  const publishedSliders = allSliders.filter(s => s.status === 'published');

  // 2. Find which category IDs are actually used by these published sliders.
  const usedCategoryIds = new Set(publishedSliders.map(s => s.category_id));

  // 3. Only keep the categories that are being used.
  const filteredCategories = allCategories.filter(c => usedCategoryIds.has(c.id));

  // If there's nothing to show after filtering, don't render the component.
  if (publishedSliders.length === 0 || filteredCategories.length === 0) {
    return null;
  }

  // Pass the pre-filtered data to the client component.
  return <OurCreationsClient sliders={publishedSliders} categories={filteredCategories} />;
};

export default OurCreations;