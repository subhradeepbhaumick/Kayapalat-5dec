// File: src/app/components/gallery/GalleryLightbox.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import type { GalleryImage } from '@/app/gallery/page';

// --- NEW PROPS FOR LIKES ---
// The component now receives its state from the parent (GalleryClient)
interface GalleryLightboxProps {
  initialImage: GalleryImage;
  images: GalleryImage[];
  onClose: () => void;
  likedImageIds: Set<number>; // A set of IDs the user has liked
  onLike: (imageId: number) => void; // The function to call when liking
}

export function GalleryLightbox({ initialImage, images, onClose, likedImageIds, onLike }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(() => 
    images.findIndex(img => img.id === initialImage.id)
  );

  // --- FIX: Disable body scroll when lightbox is open ---
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    // Re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const currentImage = images[currentIndex];

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Call the centralized handler from the parent
    onLike(currentImage.id);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goToPrevious, goToNext, onClose]);

  const transition: Transition = { duration: 0.3, ease: 'easeInOut' };

  if (!currentImage) return null;
  
  // Determine if the current image is liked based on the prop
  const isLiked = likedImageIds.has(currentImage.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-500 flex items-center justify-center p-4"
    >
      <div className="w-full h-full max-w-7xl max-h-[90vh] flex gap-4">
        {/* Left Side: Image Viewer */}
        <div className="flex-[3] bg-transparent rounded-lg flex items-center justify-center relative overflow-hidden">
            <AnimatePresence initial={false}>
                <motion.div key={currentIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition} className="w-full h-full">
                    <Image src={currentImage.image_path} alt={currentImage.title} fill style={{ objectFit: 'contain' }} className="p-4" />
                </motion.div>
            </AnimatePresence>
            <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#00423D] text-white p-2 rounded-full hover:bg-opacity-80 transition-all"><ChevronLeft size={24} /></button>
            <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#00423D] text-white p-2 rounded-full hover:bg-opacity-80 transition-all"><ChevronRight size={24} /></button>
            <button onClick={handleLikeClick} className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 hover:text-red-500 py-2 px-3 rounded-lg transition-colors">
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                <span className="font-semibold">{currentImage.likes}</span>
            </button>
        </div>

        {/* --- FIX: Right Side Layout and Scrolling --- */}
        <div className="flex-1 bg-white rounded-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                <h3 className="font-bold text-lg text-gray-900">{currentImage.title}</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20}/></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 flex flex-col justify-between">
                {/* Top content group */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Image src={currentImage.designer_dp_path || "/user.png"} alt={currentImage.designer_name || 'Designer'} width={48} height={48} className="rounded-full object-cover bg-gray-200" />
                        <div>
                            <p className="font-bold text-gray-800">{currentImage.designer_name || "Team KayaPalat"}</p>
                            <p className="text-sm text-gray-500">{currentImage.designer_designation || "Designer | Architect"}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">{currentImage.designer_comment || "No comments available for this design."}</p>
                    <Link href="/estimate" passHref>
                        <button className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-center">Get a Free Quote</button>
                    </Link>
                </div>

                {/* Bottom content group */}
                <div className="">
                    <h4 className="font-semibold mb-3 text-gray-800">Related Designs</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {images.filter(img => img.id !== currentImage.id).map((img) => (
                            <div key={img.id} onClick={() => setCurrentIndex(images.findIndex(i => i.id === img.id))} className="relative aspect-square rounded-md overflow-hidden cursor-pointer group">
                                <Image src={img.image_path} alt={img.title} fill style={{objectFit: 'cover'}} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
