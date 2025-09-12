// File: src/components/DesignIdeas.tsx
'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatePresence } from 'framer-motion';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
// *** FIX: Import the correct, app-wide GalleryImage type ***
import type { GalleryImage } from '@/app/gallery/page';

// *** FIX: The local, incomplete definition has been removed. ***

// This is your complete, self-contained component
export function DesignIdeas() {
  // --- All state is managed inside this component ---
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedImageIds, setLikedImageIds] = useState(new Set<number>());
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const heartButtonRef = useRef<HTMLButtonElement>(null);
  
  // --- Data Fetching ---
  useEffect(() => {
    const fetchAndSetImages = async () => {
      try {
        const res = await fetch('/api/gallery-images'); // Fetches all images
        if (!res.ok) {
          throw new Error('Failed to fetch images');
        }
        const data: GalleryImage[] = await res.json();
        setAllImages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSetImages();
  }, []); // The empty array [] means this runs only once when the component mounts

  // --- State Management and Handlers ---
  const handleLike = (imageId: number) => {
    if (likedImageIds.has(imageId)) return;

    setLikedImageIds(prev => new Set(prev).add(imageId));
    setAllImages(prevImages =>
      prevImages.map(img => (img.id === imageId ? { ...img, likes: img.likes + 1 } : img))
    );

    fetch('/api/gallery-likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: imageId }),
    }).catch(console.error);
  };

  const handleImageClick = (image: GalleryImage) => setSelectedImage(image);
  const closeLightbox = () => setSelectedImage(null);

  function formatLikes(num: number) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + ' K';
  }
  return num.toString();
}


  // --- Derived Data (Calculations based on state) ---
  const featuredImages = useMemo(() => allImages.filter(img => img.is_featured), [allImages]);
  const allImagesForLightbox = useMemo(() => {
    if (!selectedImage) return [];
    return allImages.filter(img => img.category_id === selectedImage.category_id);
  }, [selectedImage, allImages]);

  const availableCategories = useMemo(() => {
    const categories = new Map<string, boolean>();
    featuredImages.forEach(image => {
      if (!categories.has(image.category_name)) {
        categories.set(image.category_name, true);
      }
    });
    return Array.from(categories.keys());
  }, [featuredImages]);

  useEffect(() => {
    if (!selectedCategory && availableCategories.length > 0) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

  const imagesForCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return featuredImages.filter(img => img.category_name === selectedCategory);
  }, [selectedCategory, featuredImages]);


  // --- Logic for the Slider ---
  const handleNext = useCallback(() => {
    setCurrentSlide(prev => (prev === imagesForCategory.length - 1 ? 0 : prev + 1));
  }, [imagesForCategory.length]);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? imagesForCategory.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovering || imagesForCategory.length <= 1) return;
    const interval = setInterval(handleNext, 2000);
    return () => clearInterval(interval);
  }, [isHovering, imagesForCategory.length, handleNext]);

  const handleLikeClick = (e: React.MouseEvent, imageId: number) => {
    e.stopPropagation();
    if (likedImageIds.has(imageId)) {
        handleLike(imageId);
        return;
    }

    if (heartButtonRef.current) {
      const rect = heartButtonRef.current.getBoundingClientRect();
      const origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
      confetti({ particleCount: 100, spread: 70, origin, colors: ['#00423D', '#D2EBD0', '#F8FDF8', '#ff7aa2'] });
    }
    handleLike(imageId);
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading Design Ideas...</div>;
  }

  if (featuredImages.length === 0 || !selectedCategory) {
    return null;
  }
  
  const currentImage = imagesForCategory[currentSlide];
  if (!currentImage) return null;

  const isLiked = likedImageIds.has(currentImage.id);

  return (
    <>
      <div className="p-4 bg-[#D2EBD0] md:px-6 space-y-4">
        <h1
          className="text-4xl md:text-7xl text-center text-[#00423D]"
          style={{ fontFamily: "'Abril Fatface', cursive", WebkitTextStroke: "1px black" }}
        >
          Our Design Ideas
        </h1>

        <div className="flex gap-2 overflow-x-auto pb-2 pt-5 md:justify-center">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentSlide(0);
              }}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 cursor-pointer border-[#00423D] rounded-full text-sm font-semibold border transition-transform hover:scale-105 active:scale-95 duration-200 ${
                selectedCategory === category ? 'border-2' : 'text-[#00423D]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          className="relative md:px-6 max-w-3xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-md bg-white cursor-pointer"
            onClick={() => handleImageClick(currentImage)}
          >
            <Image
              src={currentImage.image_path}
              alt={currentImage.title}
              width={800}
              height={500}
              className="w-full h-80 md:h-100 object-cover"
              draggable="false"
              priority
            />

            <div className="p-4 flex items-start justify-between">
              <div>
                
                <div className="absolute italic pl-10 text-xs bottom-8.5 md:bottom-9">{currentImage.designer_designation || 'Designer | Architect'}</div>
                <div className="flex items-center gap-2">
                  <Image
                    src={currentImage.designer_dp_path || '/default-avatar.png'}
                    alt={currentImage.designer_name || 'Designer'}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <div className="text-md font-bold text-teal-800">{currentImage.designer_name || 'KayaPalat Team'}</div>
                </div>
                <p className="text-sm text-gray-600 mt-2 max-w-md pl-10">{currentImage.title}</p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <button ref={heartButtonRef} onClick={(e) => handleLikeClick(e, currentImage.id)}>
                  <Heart
                    className={`transition-all cursor-pointer ${
                      isLiked ? "fill-red-500 text-red-500" : "text-teal-500"
                    }`}
                  />
                </button>
                <div className="text-xs text-teal-700">{formatLikes(currentImage.likes)}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-0 md:-left-10 top-2/5 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:border-teal-800 hover:border-2 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 md:-right-10 top-2/5 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:border-teal-800 hover:border-2 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {imagesForCategory.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {imagesForCategory.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === currentSlide ? "bg-teal-700" : "bg-gray-400"}`}
              />
            ))}
          </div>
        )}
      </div>

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
    </>
  );
}