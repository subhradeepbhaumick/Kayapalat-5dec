// File: src/app/blogs/[slug]/ScrollToTopButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 bg-[#00423D] text-white p-4 rounded-full shadow-lg hover:bg-[#00261a] transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
};