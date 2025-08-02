// File: src/app/blogs/[slug]/SocialShare.tsx
'use client';

import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

export default function SocialShare({ title }: { title: string }) {
  return (
    <div className="mt-8 flex justify-center items-center gap-4">
      <p className="text-[#b4ddc3] font-semibold">Follow Us:</p>
      <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"><FaFacebookF /></a>
      <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"><FaInstagram /></a>
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"><FaYoutube /></a>
      <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"><FaLinkedinIn /></a>
    </div>
  );
}