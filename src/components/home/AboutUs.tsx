"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

const AboutUs = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState<"above" | "below">("below");
  const applyNowRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const createRipple = (e: any) => {
    const circle = document.createElement("span");
    const button = e.currentTarget;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        applyNowRef.current &&
        !applyNowRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const toggleModal = () => {
    if (applyNowRef.current) {
      const rect = applyNowRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setModalPosition(spaceBelow < 180 && spaceAbove > 180 ? "above" : "below");
    }
    setShowModal((prev) => !prev);
  };

  return (
    <section
      className="bg-[#D2EBD0] py-12 px-10 md:px-12"
      style={{ fontFamily: "'Abril Fatface', cursive" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left Side */}
        <div className="lg:w-1/2">
          <h2 className="text-5xl md:text-6xl text-[#00423D] mb-6 text-center" style={{ WebkitTextStroke: "1px black" }}>
            About Us
          </h2>
          <p className="text-md tracking-wide text-gray-700 mb-4">
            At Kayapalat, we are dedicated to transforming your spaces into personalized sanctuaries that reflect your unique style and needs.
          </p>
          <blockquote className="text-xl font-semibold text-[#00423D] mb-4">
            “ Our mission is to make high-quality interior design accessible and affordable for everyone ”
          </blockquote>
          <p className="text-gray-700 mb-6">
            At Kayapalat, we believe that great design has the power to enhance your life. Let us help you create a space that you'll love to live in.
          </p>
          <div className="flex justify-center md:justify-self-start">
            <a href="/contact-us">
              <button
                className="bg-teal-900 text-white px-8 py-3 rounded-lg cursor-pointer shadow hover:bg-teal-800 transition relative overflow-hidden"
                onClick={(e) => {
                  createRipple(e);
                }}
              >
                Contact Us
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center items-center mt-8 space-x-6 text-center">
            <div>
              <h3 className="text-2xl text-[#00423D]" style={{ WebkitTextStroke: "1px black" }}>10 +</h3>
              <p className="text-gray-600">Awards Gained</p>
            </div>
            <div className="border-l-2 border-gray-400 h-10"></div>
            <div>
              <h3 className="text-2xl text-[#00423D]" style={{ WebkitTextStroke: "1px black" }}>350 +</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="border-l-2 border-gray-400 h-10"></div>
            <div>
              <h3 className="text-2xl text-[#00423D]" style={{ WebkitTextStroke: "1px black" }}>10 +</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-6">
            <h3 className="text-lg font-[var(--l-sans)]">Follow Us:</h3>
            <div className="flex gap-6 mt-3 text-2xl">
              <Link href="https://facebook.com/" target="_blank"><Facebook className="hover:text-[#00423D] transition" /></Link>
              <Link href="https://instagram.com/" target="_blank"><Instagram className="hover:text-[#00423D] transition" /></Link>
              <Link href="https://www.youtube.com/@kayapalat1622" target="_blank"><Youtube className="hover:text-[#00423D] transition" /></Link>
              <Link href="https://linkedin.com/" target="_blank"><Linkedin className="hover:text-[#00423D] transition" /></Link>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/2 relative">
          <h2 className="text-4xl md:text-6xl text-[#00423D] mb-6 text-center" style={{ WebkitTextStroke: "1px black" }}>
            Choose Your Fit
          </h2>
          <p className="text-gray-800 mb-4">
            <span className="font-bold text-xl md:text-2xl text-[#00423D]">Kayapalat</span> works on the basis of three flexible
            service models. Choose the level of involvement that suits you best:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
            <li>
              <span className="font-semibold text-[#00423D]">Design-Only Service –</span> We create detailed layouts and stunning 3D designs while you handle execution.
            </li>
            <li>
              <span className="font-semibold text-[#00423D]">Design & Project Management –</span> We oversee execution while you provide the materials.
            </li>
            <li>
              <span className="font-semibold text-[#00423D]">Turnkey Interior Design Services –</span> From concept to completion, we manage everything for a stress-free experience.
            </li>
          </ul>

          {/* Apply Now Button */}
          <div className="mt-8 flex justify-center relative">
            <button
              ref={applyNowRef}
              className="relative cursor-pointer overflow-hidden px-8 py-3 rounded-full border-2 border-teal-900 text-teal-900 font-semibold hover:border-teal-800 transition duration-300 group"
              onClick={(e) => {
                createRipple(e);
                toggleModal();
              }}
            >
              <span className="relative z-10">Apply Now</span>
              <span className="absolute inset-0  opacity-0 group-hover:opacity-100 transition duration-300 ease-out"></span>
            </button>

            {/* Modal */}
            {showModal && (
              <div
                ref={modalRef}
                className={`absolute ${
                  modalPosition === "above" ? "bottom-full mb-3" : "top-full mt-3"
                } left-1/2 transform -translate-x-1/2 w-max bg-white shadow-xl rounded-xl p-6 z-20`}
              >
                <Link
                  href="/service/design-only"
                  className="block text-[#00423D] hover:scale-105 transition transform cursor-pointer no-underline mb-2"
                  onClick={() => setShowModal(false)}
                >
                  Design-Only Service
                </Link>
                <Link
                  href="/service/design-project-management"
                  className="block text-[#00423D] hover:scale-105 transition transform cursor-pointer no-underline mb-2"
                  onClick={() => setShowModal(false)}
                >
                  Design & Project Management
                </Link>
                <Link
                  href="/service/turnkey"
                  className="block text-[#00423D] hover:scale-105 transition transform cursor-pointer no-underline"
                  onClick={() => setShowModal(false)}
                >
                  Turnkey Interior Design Services
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
