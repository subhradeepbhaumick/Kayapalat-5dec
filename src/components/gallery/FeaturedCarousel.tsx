'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Transition, PanInfo, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import type { GalleryImage } from '@/app/gallery/page';
import { getCategoryColor } from '@/lib/colours';
import confetti from 'canvas-confetti';

interface FeaturedCarouselProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  likedImageIds: Set<number>;
  onLike: (imageId: number) => void;
}

export function FeaturedCarousel({ images, onImageClick, likedImageIds, onLike }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const transition: Transition = { duration: 0.5, ease: 'easeInOut' };

  const slideVariants = {
    hidden: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.8 }),
    visible: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0.8 }),
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50) prevSlide();
    else if (info.offset.x < -50) nextSlide();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.querySelector('.featured-carousel:hover') === null) {
        nextSlide();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const isLiked = likedImageIds.has(currentImage.id);
  const categoryColor = getCategoryColor(currentImage.category_name);

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLiked) return;
    onLike(currentImage.id);

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: {
        x: (rect.left + rect.right) / 2 / window.innerWidth,
        y: (rect.top + rect.bottom) / 2 / window.innerHeight,
      },
      colors: ['#ef4444', '#f87171', '#fca5a5'],
      scalar: 1.2,
    });
  };

  return (
    <div ref={carouselRef} className="w-full h-[70vh] md:h-[90vh] mb-10 relative overflow-hidden group featured-carousel">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          className="absolute inset-0 w-full h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          {/* onTap used instead of onClick to avoid drag conflicts */}
          <motion.div
            style={{ y }}
            className="relative w-full h-full cursor-pointer"
            onTap={() => onImageClick(currentImage)}
          >
            <Image
              src={currentImage.image_path}
              alt={currentImage.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      <button
        onClick={e => { e.stopPropagation(); prevSlide(); }}
        aria-label="Previous slide"
        className="absolute z-10 left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); nextSlide(); }}
        aria-label="Next slide"
        className="absolute z-10 right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 text-xs font-bold rounded-md ${categoryColor.bg} ${categoryColor.text}`}>
          {currentImage.category_name}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
        <div className="flex justify-between items-end">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{currentImage.title}</h2>
            <div className="flex items-center gap-3 mt-2">
              <Image
                src={currentImage.designer_dp_path || '/user.png'}
                alt={currentImage.designer_name || ''}
                width={32}
                height={32}
                className="rounded-full object-cover border-2 border-white/50"
              />
              <div>
                <p className="font-semibold text-sm drop-shadow-md">{currentImage.designer_name || 'Team KayaPalat'}</p>
                <p className="text-xs text-white/80 drop-shadow-md">{currentImage.designer_designation || 'Designer'}</p>
              </div>
            </div>
          </div>

          <button onClick={handleLikeClick} aria-label="Like this design" className="flex-shrink-0">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'bg-red-500/80' : 'bg-white/20 hover:bg-white/30'}`}>
              <Heart className={`w-7 h-7 transition-transform ${isLiked ? 'text-white fill-white scale-110' : 'text-white'}`} />
            </div>
            <p className="text-center font-bold mt-1 text-sm">{currentImage.likes}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
