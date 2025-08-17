// File: src/components/gallery/GalleryCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GalleryImage } from '@/app/gallery/page';

// The props are updated to receive state from the parent
interface GalleryCardProps {
    image: GalleryImage;
    onImageClick: (image: GalleryImage) => void;
    isLiked: boolean; // Receives whether the image is liked
    onLike: (imageId: number) => void; // Receives the handler function from the parent
}

export function GalleryCard({ image, onImageClick, isLiked, onLike }: GalleryCardProps) {

    // The component no longer has its own state for likes.
    // It relies entirely on the props passed from GalleryClient.

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening lightbox
        // Call the centralized handler function from the parent
        onLike(image.id);
    };

    return (
        <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            whileHover={{ scale: 1.02 }}
        >
            {/* Image container is the trigger for the lightbox */}
            <div className="relative cursor-pointer" onClick={() => onImageClick(image)}>
                <Image
                    src={image.image_path}
                    alt={image.title}
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* Content layout */}
            <div className="p-4 flex flex-col gap-3 flex-grow">
                {/* Top row for DP, Name, and Likes */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image
                            src={image.designer_dp_path || "/user.png"}
                            alt={image.designer_name || 'Designer'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover bg-gray-200"
                        />
                        <div>
                            <p className="font-bold text-gray-800">{image.designer_name || "Team KayaPalat"}</p>
                            <p className="text-xs text-gray-500">{image.designer_designation || "Designer | Architect"}</p>
                        </div>
                    </div>

                    <div className="ml-25">
                        <button onClick={handleLikeClick} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0 pl-2">
                            {/* The heart icon's appearance is controlled by the `isLiked` prop */}
                            <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                            {/* The like count is read directly from the `image` prop */}
                            <span className="text-sm font-medium">{image.likes}</span>
                        </button>
                    </div>

                </div>
                {/* Middle row for the comment */}
                <div className=" flex flex-col">
                    <p className="text-sm text-neutral-500 ml-5 pl-5">
                        {image.designer_comment || "No comments as Team KayaPalat has not received any feedback yet. Feel free to be the first to leave a comment!"}
                    </p>

                </div>

                <div className="">
                    <Link href="/estimate" passHref>
                        <button
                            onClick={(e) => e.stopPropagation()} // Prevents the lightbox from opening
                            className="w-full bg-[#fd0909e5] text-white font-semibold py-2 px-4 rounded-3xl  border-2 border-[#00423D] transition-colors hover:cursor-pointer"
                        >
                            Get Quote
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
