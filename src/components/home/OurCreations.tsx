"use client";

import React, { useState } from "react";
import { ImageSlider } from "../ImageSlider";
import { FaCouch, FaBed, FaHardHat, FaArrowLeft, FaArrowRight, FaStar, FaLightbulb } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const imageData = {
  livingRoom: [
    {
      before:
        "https://images.unsplash.com/photo-1523435324848-a7a613898152?auto=format&fit=crop&w=1769&q=80",
      after:
        "https://images.unsplash.com/photo-1598875791852-8bb153e713f0?auto=format&fit=crop&w=2010&q=80",
      testimonial: {
        name: "Mr. Dhiman Majumder",
        designation: "Home Owner",
        rating: 5,
        comment:
          "My dream home came to life with KayaPalat. Every detail was perfectly executed!!!",
        avatar: "https://i.pravatar.cc/50?img=",
      },
    },
    {
      before:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1598875791852-8bb153e713f0?auto=format&fit=crop&w=2010&q=80",
      testimonial: {
        name: "Ananya Singh",
        designation: "Interior Enthusiast",
        rating: 4,
        comment: "The makeover was amazing! Subtle, stylish, and cozy. Just how I wanted.",
        avatar: "https://i.pravatar.cc/50?img=2",
      },
    },
  ],
  bedroom: [
    {
      before:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1598875791852-8bb153e713f0?auto=format&fit=crop&w=2010&q=80",
      testimonial: {
        name: "Rahul Mehta",
        designation: "Working Professional",
        rating: 5,
        comment: "A calm and peaceful bedroom, just what I needed.",
        avatar: "https://i.pravatar.cc/50?img=7",
      },
    },
  ],
  falseCeiling: [
    {
      before:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1598875791852-8bb153e713f0?auto=format&fit=crop&w=2010&q=80",
      testimonial: {
        name: "Sneha Kapoor",
        designation: "Architect",
        rating: 4,
        comment: "Their ceiling work really added depth to our room design.",
        avatar: "https://i.pravatar.cc/50?img=5",
      },
    },
  ],
};

const iconMap = {
  livingRoom: <FaCouch className="w-4 h-4 md:w-6 md:h-6" />,
  bedroom: <FaBed className="w-4 h-4 md:w-6 md:h-6" />,
  falseCeiling: <FaLightbulb className="w-4 h-4 md:w-6 md:h-6" />,
};

const OurCreations = () => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof imageData>("livingRoom");
  const [currentIndex, setCurrentIndex] = useState(0);
  const categories = Object.keys(imageData) as Array<keyof typeof imageData>;
  const currentSlides = imageData[activeCategory];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : currentSlides.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < currentSlides.length - 1 ? prev + 1 : 0));
  };

  const handleCategoryChange = (category: keyof typeof imageData) => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  const testimonial = currentSlides[currentIndex].testimonial;

  return (
    <section
      className="bg-[#D2EBD0] py-12 px-6 text-[#00423D] text-center"
      style={{  fontFamily: "'Abril Fatface', cursive" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-7xl text-[#00423D] font-abril"style={{ WebkitTextStroke: "1px black"}}>Our Creations</h2>
        <p className="mt-4 text-md md:text-2xl text-black">Explore Real Client Transformations</p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center cursor-pointer gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 border rounded-full text-xs md:text-lg transition-transform hover:scale-105 active:scale-95 duration-200
                ${activeCategory === cat ? "border-3 border-teal-800 " : "bg-transparent text-[#00423D]"}`}
            >
              {iconMap[cat]}
              <span className={`${activeCategory === cat ? "inline" : "hidden"} md:inline-block`}>
                {cat.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              </span>
            </button>
          ))}

          <Link
            href="/gallery"
            className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-[#00423D] rounded-full text-xs md:text-lg hover:scale-105 duration-200"
          >
            <span className="text-lg md:text-xl">＋</span>
            <span className="inline-block md:inline-block">Explore More</span>
          </Link>

        </div>

        <div className="relative w-full max-w-[700px] mx-auto mt-6">
          <div className="relative">
            <div className="absolute  top-10 text-[#00423D] px-2  rounded text-sm ">Before</div>
            <div className="absolute right-0 top-10 text-[#00423D] px-2 rounded text-sm ">After</div>
            <ImageSlider
              beforeImage={currentSlides[currentIndex].before}
              afterImage={currentSlides[currentIndex].after}
            />
            <div className="absolute -left-15 top-1/2 transform -translate-y-1/2 hidden md:block">
              <button onClick={handlePrev} className="bg-white/80 p-3 rounded-full hover:border-2 cursor-pointer shadow-md">
                <FaArrowLeft className="text-[#00423D]" />
              </button>
            </div>
            <div className="absolute -right-15 top-1/2 transform -translate-y-1/2 hidden md:block">
              <button onClick={handleNext} className="bg-white/80 p-3 rounded-full cursor-pointer hover:border-2  shadow-md">
                <FaArrowRight className="text-[#00423D]" />
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {currentSlides.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full ${idx === currentIndex ? "bg-[#00423D]" : "bg-gray-400"}`}
              />
            ))}
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="md:hidden flex justify-end gap-2 mt-4">
            <button onClick={handlePrev} className="bg-white/80 p-2 rounded-full shadow-md">
              <FaArrowLeft className="text-[#00423D]" />
            </button>
            <button onClick={handleNext} className="bg-white/80 p-2 rounded-full shadow-md">
              <FaArrowRight className="text-[#00423D]" />
            </button>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-8 text-black text-left max-w-xl mx-auto flex items-start gap-4">
          <div className="min-w-[50px] min-h-[50px]">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={50}
            height={50} 
            className="rounded-full object-cover"
          />
          </div>
          <div>
          <p className="text-base font-medium">{testimonial.name}</p>
            <div className="flex items-center gap-4">
            <p className="text-sm italic mt-1">{testimonial.designation}</p>
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xs" />
                ))}
              </div>
            </div>
            <blockquote className="text-gray-700 mt-2 text-md md:text-xl">
            “ {testimonial.comment} ”
            </blockquote>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurCreations;
