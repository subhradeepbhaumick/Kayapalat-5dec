"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

// Simple window width hook
function useWindowWidth() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function AboutUsPage() {
  const width = useWindowWidth();
  const isMobile = width !== null && width < 768;

  return (
    <div className="bg-[#D2EBD0] text-gray-800">
      {/* Hero Section */}
      <section
        className="relative h-[600px] md:h-[700px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        <div className="text-center p-6">
          <h1
            className="text-5xl md:text-7xl text-white"
            style={{
              WebkitTextStroke: "2px black",
              fontFamily: "'Abril Fatface', cursive",
              fontWeight: "normal",
            }}
          >
            About Kayapalat
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mt-4 md:mt-6 max-w-3xl mx-auto">
            Crafting your perfect spaces, one idea at a time.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2
            className="text-4xl md:text-5xl mb-6"
            style={{
              WebkitTextStroke: "1px black",
              fontFamily: "'Abril Fatface', cursive",
              fontWeight: "normal",
            }}
          >
            Our Story
          </h2>
          <p className="text-lg leading-relaxed">
            Kayapalat was born out of a vision to simplify interior design for
            both homes and commercial spaces. We connect verified freelance
            designers with clients seeking personalized, transparent, and
            hassle-free services. From cozy bedrooms to sprawling offices, every
            project is handled with care and tailored precision.
          </p>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <Image
            src="/boss-photo.png"
            alt="Our Boss"
            width={500}
            height={500}
            className="rounded-3xl shadow-lg mx-auto"
          />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto py-12 md:py-16 px-6 flex flex-wrap gap-8 justify-center items-center text-center">
        {[
          { value: "10+", label: "Awards Gained" },
          { value: "350+", label: "Happy Customers" },
          { value: "10+", label: "Years of Experience" },
        ].map((item, idx) => (
          <div key={idx}>
            <h3
              className="text-4xl md:text-5xl text-[#00423D]"
              style={{
                WebkitTextStroke: "1px black",
                fontFamily: "'Abril Fatface', cursive",
                fontWeight: "normal",
              }}
            >
              {item.value}
            </h3>
            <p className="text-gray-700 text-lg">{item.label}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <motion.h2
          className="text-4xl md:text-5xl mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{
            WebkitTextStroke: "1px black",
            fontFamily: "'Abril Fatface', cursive",
            fontWeight: "normal",
          }}
        >
          How It Works
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <Image
            src={isMobile ? "/how-we-work-mobile.png" : "/how-we-work.png"}
            alt="How It Works"
            width={1200}
            height={800}
            className="rounded-2xl mx-auto"
          />
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <motion.h2
          className="text-4xl md:text-5xl mb-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{
            WebkitTextStroke: "1px black",
            fontFamily: "'Abril Fatface', cursive",
            fontWeight: "normal",
          }}
        >
          Why Choose Kayapalat?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 max-w-7xl mx-auto px-4">
          {[
            "Verified Designers",
            "Transparent Pricing",
            "Real-time Progress",
            "100+ Projects Done",
            "Dedicated Support",
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg p-6 rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Image
                src={`/feature-${index + 1}.png`}
                alt={feature}
                width={70}
                height={70}
                className="mx-auto mb-4"
              />
              <h4 className="text-lg font-bold text-[#00423D]">{feature}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 text-center flex flex-col items-center gap-8">
        <motion.h2
          className="text-4xl md:text-5xl leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{
            WebkitTextStroke: "1px black",
            fontFamily: "'Abril Fatface', cursive",
            fontWeight: "normal",
          }}
        >
          Transform Your Space, On Your Terms.
        </motion.h2>
        <p className="text-lg max-w-2xl text-gray-800">
          From quick design tips to complete home makeovers, we’ve got you
          covered.
        </p>
        <Link href="/estimate">
          <Button className="text-lg px-8 py-4 rounded-full bg-[#00423D] text-white font-bold hover:bg-[#063F3C] transition shadow-lg">
            Get Your Estimate
          </Button>
        </Link>
      </section>

      {/* Social Media Links */}
      <section className="py-14 flex flex-col items-center gap-4 text-center">
        <h3 className="text-lg">Follow Us:</h3>
        <div className="flex gap-6 text-3xl text-[#00423D]">
          <Link href="https://facebook.com/" target="_blank">
            <Facebook className="hover:scale-110 transition" />
          </Link>
          <Link href="https://instagram.com/" target="_blank">
            <Instagram className="hover:scale-110 transition" />
          </Link>
          <Link href="https://www.youtube.com/@kayapalat1622" target="_blank">
            <Youtube className="hover:scale-110 transition" />
          </Link>
          <Link href="https://linkedin.com/" target="_blank">
            <Linkedin className="hover:scale-110 transition" />
          </Link>
        </div>
      </section>
    </div>
  );
}
