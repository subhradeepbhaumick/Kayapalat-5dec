"use client";

import Image from "next/image";
import { FaUser, FaPen, FaSearch, FaBars, FaArrowUp, FaWhatsapp,FaBalanceScale } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderText, setPlaceholderText] = useState("Search");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) { // Apply only for md and larger
        setShowButton(window.scrollY > 300);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth >= 550) {
        setPlaceholderText("Search for bedrooms, kitchens, dining...");
      } else {
        setPlaceholderText("Search");
      }
    };
    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  return (
    <section
      className="w-full  flex flex-col overflow-hidden justify-start bg-cover bg-center text-white relative sm:items-center lg:px-20 pt-3 px-4 sm:px-6"
      style={{ backgroundImage: "url('/hero-bg.png')", fontFamily: "'Abril Fatface', cursive" }}
    >
      {/* Search Bar */}
      <div className="mt-20 w-full flex justify-center items-center">
        <div className="relative max-w-2xl w-full border-2 border-[#295A47] flex items-center bg-[#ffffff7a] bg-opacity-50 rounded-lg shadow-lg overflow-hidden px-4">
          <button className="px-4 text-gray-600 cursor-pointer hover:text-black"><FaBars /></button>
          <input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-black focus:outline-none"
          />
          <button className="px-4 text-gray-600 cursor-pointer hover:text-black"><FaSearch /></button>
        </div>
      </div>

      {/* Heading Section */}
      <div className="mt-10 text-left max-w-3xl sm:ml-[15px]">
        <h1 className="text-5xl lg:text-8xl font-bold leading-tight">From Sketches to Real Life</h1>
        <p className="mt-4 text-lg ">Transform Your Space with the Perfect Designer</p>
        <p className="text-lg ">Browse, Connect, and Bring Your Vision to Life!</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/estimate">
            <button className="w-60 border-2 border-[#295A47] flex items-center justify-center px-6 py-3 rounded-lg text-lg hover:bg-[#295A47] cursor-pointer bg-[#295a476b] shadow-lg transition ease-in-out duration-300">
              <FaPen className="mr-2" /> Estimate Your Cost
            </button>
          </Link>
          {/* <Link href="/our-designers">
            <button className="w-60 bg-primary border-2 border-[#295A47] cursor-pointer flex items-center justify-center px-5 py-3 rounded-lg text-lg shadow-lg hover:bg-[#295A47] transition">
              <FaUser className="mr-2 text-2xl" /> Hire a Designer
            </button>
          </Link> */}
        </div>
      </div>

      {/* Home Loan Info */}
      <div className="mt-12 text-white text-center py-6 rounded-lg px-6 pb-25">
        <span className="text-lg ">Home Renovation Loans</span>
        <div className="mt-4 flex gap-4 justify-center items-center">
          <a href="https://www.sbi.co.in/web/personal-banking/loans/home-loans/loan-products" target="_blank" rel="noopener noreferrer">
            <Image
              src="/sbi-loan.png"
              alt="SBI Loan"
              width={90}
              height={90}
              className="inline-block cursor-pointer"
            />
          </a>
          <a href="https://www.hdfc.com/personal/home-loan" target="_blank" rel="noopener noreferrer">
            <Image
              src="/hdfc-loan.png"
              alt="HDFC Loan"
              width={60}
              height={60}
              className="inline-block cursor-pointer"
            />
          </a>
        </div>
      </div>


      {/* Scroll to Top Button */}
      <div className="fixed bottom-20 z-10 right-5 flex group">
        <button
          onClick={scrollToTop}
          className={`cursor-pointer p-4.5 rounded-full bg-[#295A47] text-white shadow-lg transition-opacity 
    ${showButton ? "opacity-100" : "hidden pointer-events-none"} hover:bg-[#1F4037] relative`}
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
        {/* Tooltip */}
        <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-gray-600 bg-[#ffffff7a] rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap border-2 ${showButton ? "" : "hidden pointer-events-none"}`}>
          Scroll To Top
        </span>
      </div>



      {/* Chat Support - AI Concept */}
      {/*
      <div className="fixed z-1 bottom-5 right-5">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#295A47] p-4 rounded-full shadow-lg hover:bg-[#1F4037] cursor-pointer transition">
          <IoChatbubbleEllipses className="text-white text-2xl" />
        </button>
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 bg-[#d7eae37a] text-black w-64 p-4 rounded-lg shadow-lg">
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute right-5 text-lg text-red-600 cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold">Chat with Kaya AI</h3>
            <p className="text-sm">How can we assist you today?</p>
          </div>
        )}
      </div>
      */}

      {/* WhatsApp Support */}
      <div className="fixed z-10 bottom-5 right-5">
        <a
          href="https://wa.me/916026026026?text=Hello%20Team%20KayaPalat%20!%20I%20need%20assistance."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#295A47] p-4 rounded-full shadow-lg hover:bg-[#1F4037] cursor-pointer transition flex items-center justify-center"
        >
          <FaWhatsapp className="text-white text-2xl" />
        </a>
      </div>




    </section>
  );
};

export default HeroSection;
