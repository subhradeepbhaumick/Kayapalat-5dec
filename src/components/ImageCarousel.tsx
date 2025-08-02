"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
    images: string[];
    aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
    interval?: number; // in milliseconds, default to 3000 (3 seconds)
    className?: string; // for additional styling on the container
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
    images,
    aspectRatio = "9/16", // Default aspect ratio
    interval = 3000,
    className,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return; // No need to scroll if only one or no image

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [images, interval]);

    // Variants for Framer Motion animation
    const carouselVariants = {
        enter: { opacity: 0, x: 100 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
    };

    return (
        <div className={`relative overflow-hidden rounded-xl shadow-lg w-full ${className}`}
             style={{ aspectRatio: aspectRatio }}> {/* Apply aspect ratio here */}
            <AnimatePresence initial={false} mode="wait">
                <motion.img
                    key={currentIndex} // Key is crucial for AnimatePresence to detect changes
                    src={images[currentIndex]}
                    alt={`Carousel image ${currentIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover" // Cover the container
                    variants={carouselVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    onError={(e) => {
                        // Fallback for broken images
                        e.currentTarget.src = `https://placehold.co/400x300/CCCCCC/333333?text=Image+Error`;
                    }}
                />
            </AnimatePresence>
            {/* Optional: Add navigation dots */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex ? 'bg-white scale-125' : 'bg-gray-400 opacity-70'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;
