// File: src/components/gallery/FeaturedCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import type { GalleryImage } from '@/app/gallery/page';

// --- PROPS UPDATED FOR CENTRALIZED STATE ---
interface FeaturedCarouselProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  likedImageIds: Set<number>; // Receives the set of liked image IDs
  onLike: (imageId: number) => void; // Receives the handler function
}

export function FeaturedCarousel({ images, onImageClick, likedImageIds, onLike }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const transition: Transition = { duration: 0.4, ease: 'easeInOut' };

  const slideVariants = {
    hidden: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    visible: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const currentImage = images[currentIndex];
  
  // --- LOCAL STATE REMOVED ---
  // The component no longer manages its own 'likes' or 'isLiked' state.

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Call the centralized handler from the parent component
    onLike(currentImage.id);
  };

  // The useEffect for resetting local state is no longer needed and has been removed.

  if (!images || images.length === 0) {
    return null; 
  }

  // Determine if the current image is liked based on the prop
  const isLiked = currentImage ? likedImageIds.has(currentImage.id) : false;

  return (
    <div className="w-full max-w-5xl mx-auto mb-16">
      <h2 className="text-4xl font-bold text-center text-[#00423D] mb-8">Featured Designs</h2>
      <div className="relative h-[60vh] rounded-2xl shadow-2xl overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => onImageClick(currentImage)}
          >
            <Image
              src={currentImage.image_path}
              alt={currentImage.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"><ChevronLeft size={24} /></button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"><ChevronRight size={24} /></button>

        {/* Bottom Info Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Image
                        src={currentImage.designer_dp_path || '/user.png'}
                        alt={currentImage.designer_name || 'Designer'}
                        width={48}
                        height={48}
                        className="rounded-full object-cover bg-gray-200"
                    />
                    <div>
                        <p className="font-bold text-gray-900">{currentImage.designer_name || 'Team KayaPalat'}</p>
                        <p className="text-sm text-gray-600">{currentImage.designer_comment}</p>
                    </div>
                </div>
                <button onClick={handleLikeClick} className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors flex-shrink-0 pl-4">
                    {/* UI now driven by props */}
                    <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                    <span className="text-lg font-bold">{currentImage.likes}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
