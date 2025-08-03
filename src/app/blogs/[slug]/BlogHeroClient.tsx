// File: src/app/blogs/[slug]/BlogHeroClient.tsx
'use client';

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Linkedin, ChevronDown } from "lucide-react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ImageSlider } from "@/components/ImageSlider";
import { CompanyStats } from "./CompanyStats";
import { ICON_COMPONENTS } from "@/components/ICONS"; // Assuming you have a central icons config

// --- INTERFACES ---
interface SliderData {
    id: number;
    before_image: string;
    after_image: string;
    category_id: number;
    status: 'published' | 'draft';
}
interface CategoryData {
    id: number;
    name: string;
    icon_name: string;
}
type GroupedData = { [key: number]: SliderData[] };

// --- CLIENT COMPONENT ---
export default function BlogHeroClient({ sliders, categories }: { sliders: SliderData[], categories: CategoryData[] }) {
    const imageData = useMemo(() => {
        return sliders.reduce((acc: GroupedData, slider) => {
            const categoryId = slider.category_id;
            if (!acc[categoryId]) acc[categoryId] = [];
            acc[categoryId].push(slider);
            return acc;
        }, {});
    }, [sliders]);

    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (categories.length > 0 && activeCategoryId === null) {
            const firstCategoryWithSliders = categories.find(cat => imageData[cat.id] && imageData[cat.id].length > 0);
            if (firstCategoryWithSliders) {
                setActiveCategoryId(firstCategoryWithSliders.id);
            }
        }
    }, [categories, activeCategoryId, imageData]);

    const FollowUsLinks = () => (
        <div className="flex flex-col items-center gap-4">
            <p className="font-semibold text-white tracking-widest uppercase text-sm">Follow Us</p>
            <div className="flex lg:flex-col gap-4">
                <Link href="#" className="text-white hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/20"><Facebook className="w-5 h-5" /></Link>
                <Link href="#" className="text-white hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/20"><Instagram className="w-5 h-5" /></Link>
                <Link href="#" className="text-white hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/20"><Youtube className="w-5 h-5" /></Link>
                <Link href="#" className="text-white hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/20"><Linkedin className="w-5 h-5" /></Link>
            </div>
        </div>
    );

    if (activeCategoryId === null || !imageData[activeCategoryId] || imageData[activeCategoryId].length === 0) {
        return (
            <section className="relative w-full py-16 bg-[#00423D] text-center">
                <h1 className="text-4xl md:text-6xl font-saira-stencil font-bold tracking-wider text-white">Design Insights</h1>
                <p className="text-lg text-gray-300 mt-2">Inspiration from Our Experts</p>
                <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center max-w-3xl mx-auto mt-8"><p className="text-gray-400">Slider content coming soon.</p></div>
            </section>
        );
    }

    const currentSlides = imageData[activeCategoryId];
    const handlePrev = () => setCurrentIndex((p) => (p > 0 ? p - 1 : currentSlides.length - 1));
    const handleNext = () => setCurrentIndex((p) => (p < currentSlides.length - 1 ? p + 1 : 0));
    const handleCategoryChange = (categoryId: number) => {
        setActiveCategoryId(categoryId);
        setCurrentIndex(0);
    };

    return (
        <section className="relative min-h-screen w-full py-16 bg-[#00423D] overflow-hidden">

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-white rounded-full opacity-8 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-20 w-28 h-28 bg-white rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>


            <div className="absolute inset-0 bg-repeat opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            <div className="relative z-10">
                <div className="text-center mb-5 px-6">
                    <h1 className="text-4xl md:text-6xl font-saira-stencil font-bold tracking-wider text-white" style={{ fontFamily: "'Abril Fatface', cursive" }} >Design Insights</h1>
                    <p className="text-lg text-gray-300 mt-5">Inspiration from Our Experts</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 ">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`flex items-center cursor-pointer gap-2 px-3 py-1.5 border rounded-full text-sm transition-colors duration-200 ${activeCategoryId === cat.id ? "border-2 border-white bg-white/20 text-white" : "border-gray-500 text-gray-300 hover:bg-white/10 hover:border-white"}`}
                        >
                            {ICON_COMPONENTS[cat.icon_name] || ICON_COMPONENTS.Default}
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-center px-6">
                    <div className="lg:col-span-1 hidden lg:flex justify-center"><FollowUsLinks /></div>
                    <div className="lg:col-span-3">
                        <div className="relative">
                            <div className="absolute  left-4 z-10 text-white  px-2 py-1 rounded text-xs font-semibold">Before</div>
                            <div className="absolute  right-4 z-10 text-white  px-2 py-1 rounded text-xs font-semibold">After</div>
                            <ImageSlider
                                beforeImage={currentSlides[currentIndex].before_image}
                                afterImage={currentSlides[currentIndex].after_image}
                            />
                            <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 hidden md:block">
                                <button onClick={handlePrev} className="bg-white/80 p-3 rounded-full shadow-md hover:scale-110 transition-transform hover:border-2 cursor-pointer"><FaArrowLeft className="text-[#00423D]" /></button>
                            </div>
                            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 hidden md:block ">
                                <button onClick={handleNext} className="bg-white/80 p-3 rounded-full shadow-md hover:scale-110 transition-transform hover:border-2 cursor-pointer "><FaArrowRight className="text-[#00423D]" /></button>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            {currentSlides.map((_, idx) => <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${idx === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white"}`} />)}
                        </div>
                    </div>
                    <div className="lg:col-span-1 hidden lg:flex  justify-center"><CompanyStats /></div>
                </div>

                <div className="lg:hidden mt-12"><CompanyStats /></div>
                <div className="lg:hidden mt-8 flex justify-center"><FollowUsLinks /></div>

                <motion.div
                    className="absolute  left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: [20, 0, 20] }} // Subtle bounce
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <span className="text-sm text-white font-medium">Scroll Down</span>
                    <ChevronDown className="w-4 h-4 text-white animate-bounce" />
                </motion.div>
            </div>
        </section>
    );
}