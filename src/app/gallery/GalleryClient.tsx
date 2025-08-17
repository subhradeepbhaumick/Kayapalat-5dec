// File: src/app/gallery/GalleryClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GalleryImage, Category } from '@/app/gallery/page';
import { GalleryCard } from '@/components/gallery/GalleryCard';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { FeaturedCarousel } from '@/components/gallery/FeaturedCarousel';
import { ICON_COMPONENTS } from '@/components/ICONS'; // Ensure this path is correct

interface GalleryClientProps {
  images: GalleryImage[];
  categories: Category[];
}

export function GalleryClient({ images: initialImages, categories }: GalleryClientProps) {
  // --- STATE LIFTED UP ---
  // This state now holds the single source of truth for all image data, including likes.
  const [galleryImages, setGalleryImages] = useState(initialImages);
  // This Set tracks which images have been liked in this session to prevent multiple clicks.
  const [likedImageIds, setLikedImageIds] = useState(new Set<number>());
  
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // --- CENTRALIZED LIKE HANDLER ---
  const handleLike = (imageId: number) => {
    // 1. If the image has already been liked in this session, do nothing.
    if (likedImageIds.has(imageId)) return;

    // 2. Add the ID to our set of liked images for this session.
    setLikedImageIds(prev => new Set(prev).add(imageId));

    // 3. Update the main image state (Optimistic Update).
    // The UI updates instantly without waiting for the server.
    setGalleryImages(prevImages => 
        prevImages.map(img => 
            img.id === imageId ? { ...img, likes: img.likes + 1 } : img
        )
    );
    
    // 4. Send the update to the server in the background.
    fetch('/api/gallery-likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: imageId }),
    }).catch(error => {
        console.error("Failed to record like:", error);
        // Optional: You could add logic here to revert the like if the API fails.
    });
  };

  // --- MEMOS NOW USE THE STATEFUL `galleryImages` ---
  const { featuredImages, regularImages } = useMemo(() => {
    const featured = galleryImages.filter(img => img.is_featured);
    const regular = galleryImages.filter(img => !img.is_featured);
    return { featuredImages: featured, regularImages: regular };
  }, [galleryImages]);

  const filteredRegularImages = useMemo(() => {
    if (activeCategory === 'all') return regularImages;
    return regularImages.filter(img => img.category_id === activeCategory);
  }, [activeCategory, regularImages]);

  const handleImageClick = (image: GalleryImage) => setSelectedImage(image);
  const closeLightbox = () => setSelectedImage(null);

  const allImagesForLightbox = useMemo(() => {
    if (!selectedImage) return [];
    return galleryImages.filter(img => img.category_id === selectedImage.category_id);
  }, [selectedImage, galleryImages]);

  return (
    <div className="bg-[#D2EBD0] min-h-screen py-12 px-4 md:px-8">
      
      {/* Pass the new props down to the Carousel */}
      <FeaturedCarousel 
        images={featuredImages} 
        onImageClick={handleImageClick}
        likedImageIds={likedImageIds}
        onLike={handleLike}
      />
      
      {/* Category Filters (No changes needed here) */}
      <div className="flex justify-center items-center gap-4 md:gap-8 my-16 flex-wrap">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 flex items-center gap-2 rounded-full text-sm md:text-base transition-all duration-300 ${activeCategory === 'all' ? 'bg-[#00423D] text-white shadow-lg' : 'bg-white/70 text-gray-700 hover:bg-white'}`}>
            All Designs
        </button>
        {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 flex items-center gap-2 rounded-full text-sm md:text-base transition-all duration-300 ${activeCategory === cat.id ? 'bg-[#00423D] text-white shadow-lg' : 'bg-white/70 text-gray-700 hover:bg-white'}`}>
                {ICON_COMPONENTS[cat.icon_name || 'Default']}
                <span>{cat.name}</span>
            </button>
        ))}
      </div>

      {/* Regular Images Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3  gap-4 space-y-4">
          <AnimatePresence>
            {filteredRegularImages.map((image, index) => (
              <motion.div key={image.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="break-inside-avoid">
                {/* Pass the new props down to the Card */}
                <GalleryCard 
                    image={image} 
                    onImageClick={handleImageClick}
                    isLiked={likedImageIds.has(image.id)}
                    onLike={handleLike}
                />
              </motion.div>
            ))}
          </AnimatePresence>
      </div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <GalleryLightbox
            initialImage={selectedImage}
            images={allImagesForLightbox}
            onClose={closeLightbox}
            likedImageIds={likedImageIds}
            onLike={handleLike}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
