"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageSlider = ({ beforeImage, afterImage }: ImageSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(37);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    handleMove(event.clientX, rect);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      handleMove(touch.clientX, rect);
    }
  };

  const handleInteractionStart = () => setIsDragging(true);
  const handleInteractionEnd = () => setIsDragging(false);

  return (
    <div className="w-full relative pt-5" onMouseUp={handleInteractionEnd} onTouchEnd={handleInteractionEnd}>

      <div
        className="relative w-full max-w-[700px] aspect-[70/45] m-auto overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
      >
        <Image alt="Before" fill priority src={afterImage} className="object-cover" />

        <div
          className="absolute top-0 left-0 right-0 w-full max-w-[700px] aspect-[70/45] m-auto overflow-hidden select-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image alt="After" fill priority src={beforeImage} className="object-cover" />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `calc(${sliderPosition}% - 1px)` }}
        >
          <div className="bg-white absolute rounded-full h-3 w-3 -left-1 top-[calc(50%-5px)]" />
        </div>
      </div>
    </div>
  );
};
