// File: src/components/OurCreationsClient.tsx
'use client';

import React, { useState, useMemo, useEffect } from "react";
import { ImageSlider } from "@/components/ImageSlider";
import { FaCouch, FaBed, FaArrowLeft, FaArrowRight, FaStar, FaLightbulb, FaHardHat } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { ICON_COMPONENTS } from "../ICONS"; // Assuming you have a central icons config

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
  // CORRECTED: status type should be a string literal
  status: 'published' | 'draft';
}
interface CategoryData {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
}
type GroupedData = { [key: number]: SliderData[] };

export function OurCreationsClient({ sliders, categories }: { sliders: SliderData[], categories: CategoryData[] }) {
  const imageData = useMemo(() => {
    // UPDATED: Filter for 'published' status first
    const publishedSliders = sliders.filter(slider => slider.status === 'published');

    return publishedSliders.reduce((acc: GroupedData, slider) => {
      const categoryId = slider.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(slider);
      return acc;
    }, {});
  }, [sliders]);
  
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  if (activeCategoryId === null || !imageData[activeCategoryId]) {
    return null; // Don't show the component if there are no published items to display
  }

  const currentSlides = imageData[activeCategoryId];
  const testimonial = currentSlides[currentIndex];

  const handlePrev = () => setCurrentIndex((p) => (p > 0 ? p - 1 : currentSlides.length - 1));
  const handleNext = () => setCurrentIndex((p) => (p < currentSlides.length - 1 ? p + 1 : 0));
  const handleCategoryChange = (categoryId: number) => {
    setActiveCategoryId(categoryId);
    setCurrentIndex(0);
  };

  return (
    <section className="bg-[#D2EBD0] py-12 px-6 text-[#00423D] text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-7xl text-[#00423D]" style={{ fontFamily: "'Abril Fatface', cursive", WebkitTextStroke: "1px black"}}>Our Creations</h2>
        <p className="mt-4 text-md md:text-2xl text-black">Explore Real Client Transformations</p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center cursor-pointer gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 border rounded-full text-xs md:text-lg transition-transform hover:scale-105 active:scale-95 duration-200 ${activeCategoryId === cat.id ? "border-3 border-teal-800" : "bg-transparent text-[#00423D]"}`}
            >
              {ICON_COMPONENTS[cat.icon_name] || ICON_COMPONENTS.Default}
              <span className={`${activeCategoryId === cat.id ? "inline" : "hidden"} md:inline-block`}>{cat.name}</span>
            </button>
          ))}
          <Link href="/gallery" className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-[#00423D] rounded-full text-xs md:text-lg hover:scale-105 duration-200">
            <span className="text-lg md:text-xl">＋</span>
            <span className="inline-block">Explore More</span>
          </Link>
        </div>

        <div className="relative w-full max-w-[700px] mx-auto mt-6">
          <div className="relative">
            <div className="absolute  text-[#00423D] px-2 rounded text-sm">Before</div>
            <div className="absolute right-0  text-[#00423D] px-2 rounded text-sm">After</div>
            <ImageSlider
              beforeImage={currentSlides[currentIndex].before_image}
              afterImage={currentSlides[currentIndex].after_image}
            />
            <div className="absolute -left-15 top-1/2 transform -translate-y-1/2 hidden md:block">
              <button onClick={handlePrev} className="bg-white/80 p-3 rounded-full cursor-pointer hover:border-2 shadow-md"><FaArrowLeft className="text-[#00423D]" /></button>
            </div>
            <div className="absolute -right-15 top-1/2 transform -translate-y-1/2 hidden md:block">
              <button onClick={handleNext} className="bg-white/80 p-3 rounded-full cursor-pointer hover:border-2 shadow-md"><FaArrowRight className="text-[#00423D]" /></button>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {currentSlides.map((_, idx) => <span key={idx} className={`h-2 w-2 rounded-full ${idx === currentIndex ? "bg-[#00423D]" : "bg-gray-400"}`} />)}
          </div>
          <div className="md:hidden flex justify-end gap-2 mt-4">
            <button onClick={handlePrev} className="bg-white/80 p-2 rounded-full shadow-md"><FaArrowLeft className="text-[#00423D]" /></button>
            <button onClick={handleNext} className="bg-white/80 p-2 rounded-full shadow-md"><FaArrowRight className="text-[#00423D]" /></button>
          </div>
        </div>

        <div className="mt-8 text-black text-left max-w-xl mx-auto flex items-start gap-4">
          <div className="min-w-[50px] min-h-[50px]">
            <Image src={testimonial.testimonial_dp} alt={testimonial.testimonial_name} width={50} height={50} className="rounded-full object-cover" />
          </div>
          <div>
            <p className="text-base font-medium">{testimonial.testimonial_name}</p>
            <div className="flex items-center gap-4">
              <p className="text-sm italic mt-1">{testimonial.designation}</p>
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-xs" />)}
              </div>
            </div>
            <blockquote className="text-gray-700 mt-2 text-md md:text-xl">“ {testimonial.comment} ”</blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};