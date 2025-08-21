'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GalleryImage } from '@/app/gallery/page';
import confetti from 'canvas-confetti';

interface GalleryCardProps {
  image: GalleryImage;
  onImageClick: (image: GalleryImage) => void;
  isLiked: boolean;
  onLike: (imageId: number) => void;
}

function formatLikes(num: number) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function GalleryCard({ image, onImageClick, isLiked, onLike }: GalleryCardProps) {
  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLiked) return;
    onLike(image.id);

    // Heart burst confetti animation
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
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={() => onImageClick(image)}
      layout
    >
      <div className="relative overflow-hidden">
        <Image
          src={image.image_path}
          alt={image.title}
          width={500}
          height={500}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8DtXNJsAAAAASUVORK5CYII="
          priority={false}
        />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-grow">
        <h2 className="text-lg font-semibold text-gray-800">{image.title}</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src={image.designer_dp_path || "/user.png"}
              alt={image.designer_name || 'Designer'}
              width={32}
              height={32}
              className="rounded-full object-cover bg-gray-200"
              priority={false}
            />
            <div>
              <p className="font-bold text-sm text-gray-800">{image.designer_name || "Team KayaPalat"}</p>
              <p className="text-xs text-gray-500">{image.designer_designation || "Designer"}</p>
            </div>
          </div>
          <button
            onClick={handleLikeClick}
            aria-label="Like this design"
            className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0 pl-2 scale-90 opacity-80 group-hover:scale-100 group-hover:opacity-100"
          >
            <Heart className={`w-5 h-5 text-red-400 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            <span className="text-sm font-medium text-red-500 ">{formatLikes(image.likes)}</span>
          </button>
        </div>

        <div className="flex-grow" />

        <div className="pt-2 group-hover:opacity-100 transition-opacity duration-300">
          <Link href="/estimate" passHref>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 hover:scale-95 transition-transform duration-300"
            >
              Get Quote
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
