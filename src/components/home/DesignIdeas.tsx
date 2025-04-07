"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import {
  FaCouch,
  FaBed,
  FaUtensils,
  FaBath,
  FaLaptopHouse,
} from "react-icons/fa";

// Category list
const categories: (keyof typeof designData)[] = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Workspace"];

// Icon map
const categoryIcons = {
  "Living Room": <FaCouch className="text-[#00423D]" />,
  Bedroom: <FaBed className="text-[#00423D]" />,
  Kitchen: <FaUtensils className="text-[#00423D]" />,
  Bathroom: <FaBath className="text-[#00423D]" />,
  Workspace: <FaLaptopHouse className="text-[#00423D]" />,
};

const designData = {
  "Living Room": [
    {
      url: "https://plus.unsplash.com/premium_photo-1706140675031-1e0548986ad1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGl2aW5ncm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      designer: "Aarav Mehta",
      avatar: "https://i.pravatar.cc/40?img=1",
      description: "A cozy yet luxurious living room that brings warmth and elegance.",
      likes: 68
    },
    {
      url: "https://plus.unsplash.com/premium_photo-1676968002767-1f6a09891350?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      designer: "Naina Kapoor",
      avatar: "https://i.pravatar.cc/40?img=2",
      description: "Modern sofa setup with an inviting atmosphere for guests.",
      likes: 57
    }
  ],
  Bedroom: [
    {
      url: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJlZHJvb218ZW58MHx8MHx8fDA%3D",
      designer: "Ishaan Roy",
      avatar: "https://i.pravatar.cc/40?img=3",
      description: "Minimalist design offering tranquility and peace.",
      likes: 88
    },
    {
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlZHJvb218ZW58MHx8MHx8fDA%3D",
      designer: "Meera Sharma",
      avatar: "https://i.pravatar.cc/40?img=4",
      description: "A cozy nook with ambient lighting perfect for reading.",
      likes: 112
    }
  ],
  Kitchen: [
    {
      url: "https://plus.unsplash.com/premium_photo-1687697861242-03e99059e833?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      designer: "Kabir Anand",
      avatar: "https://i.pravatar.cc/40?img=5",
      description: "Sleek modular kitchen design for the modern chef.",
      likes: 73
    },
    {
      url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D",
      designer: "Sanya Bhatia",
      avatar: "https://i.pravatar.cc/40?img=6",
      description: "A compact yet stylish kitchen setup for the perfect home.",
      likes: 62
    }
  ],
  Bathroom: [
    {
      url: "https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmF0aHJvb218ZW58MHx8MHx8fDA%3D",
      designer: "Rohit Khanna",
      avatar: "https://i.pravatar.cc/40?img=7",
      description: "Spacious bathroom with clean aesthetics and modern utils.",
      likes: 55
    }
  ],
  Workspace: [
    {
      url: "https://images.unsplash.com/photo-1669723009423-6c1b3d11dd92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdvcmtzcGFjZSUyMGhvbWV8ZW58MHx8MHx8fDA%3D",
      designer: "Diya Verma",
      avatar: "https://i.pravatar.cc/40?img=8",
      description: "Productivity meets style in this home-office design.",
      likes: 98
    },
    {
      url: "https://images.unsplash.com/photo-1629317337201-2e7189bbdfac?q=80&w=2188&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      designer: "Ayaan Joshi",
      avatar: "https://i.pravatar.cc/40?img=9",
      description: "Clean desk setup for focused work hours and less distractions.",
      likes: 110
    }
  ]
};

export default function DesignIdeas() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof designData>("Living Room");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likedImages, setLikedImages] = useState<Record<string, boolean>>({});

  const images = designData[selectedCategory];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleLike = (url: string) => {
    setLikedImages((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images]);

  return (
    <div className="p-4 bg-[#D2EBD0] md:px-6 space-y-4">
      <h1
        className="text-4xl md:text-7xl text-center text-[#00423D]"
        style={{ fontFamily: "'Abril Fatface', cursive", WebkitTextStroke: "1px black" }}
      >
        Our Designs
      </h1>

      {/* Category Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-5 md:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentSlide(0);
            }}
            className={clsx(
              "flex items-center gap-2 whitespace-nowrap px-4 py-2 cursor-pointer border-[#00423D] rounded-full text-sm font-semibold border transition-transform hover:scale-105 active:scale-95 duration-200",
              selectedCategory === category ? "border-2" : "text-[#00423D]"
            )}
          >
            {categoryIcons[category]} {category}
          </button>
        ))}
      </div>

      {/* Slider Card */}
      <div className="relative md:px-6 max-w-3xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-md bg-white">
          <Image
            src={images[currentSlide].url}
            alt="Design Preview"
            width={800}
            height={500}
            className="w-full h-80 md:h-100 object-cover"
            draggable="false"
          />

          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="absolute italic pl-10 text-xs bottom-14 md:bottom-9">Designer | Architect </div>
              <div className="flex items-center gap-2">
                <Image src={images[currentSlide].avatar} alt="Designer" width={32} height={32} className="rounded-full" />
                <div className="text-md font-bold text-teal-800">{images[currentSlide].designer}</div>
              </div>
              <p className="text-sm text-gray-600 mt-2 max-w-md pl-10">{images[currentSlide].description}</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button onClick={() => toggleLike(images[currentSlide].url)}>
                <Heart
                  className={clsx(
                    "transition-all cursor-pointer",
                    likedImages[images[currentSlide].url] ? "fill-red-500 text-red-500" : "text-teal-500"
                  )}
                />
              </button>
              <div className="text-xs text-teal-700">
                {likedImages[images[currentSlide].url] ? images[currentSlide].likes + 1 : images[currentSlide].likes}
              </div>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 md:-left-10 top-2/5 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow  hover:border-teal-800 hover:border-2 cursor-pointer"
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

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1 mt-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={clsx("w-2 h-2 rounded-full", i === currentSlide ? "bg-teal-700" : "bg-gray-400")}
          />
        ))}
      </div>
    </div>
  );
}
