// File: src/components/CompanyStats.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Star } from 'lucide-react';

// This is a small, reusable component for the number animation
const AnimatedCounter = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round((duration * 1000) / frameDuration);
          const step = end / totalFrames;

          const counter = () => {
            start += step;
            if (start < end) {
              setCount(Math.ceil(start));
              requestAnimationFrame(counter);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(counter);
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const ICON_COMPONENTS: { [key: string]: React.ReactNode } = {
  // Rooms
  Award: <Award className="w-5 h-5 md:w-6 md:h-6 text-[#D2EBD0] mr-1 md:mr-2" />,
  Users: <Users className="w-5 h-5 md:w-6 md:h-6 text-[#D2EBD0] mr-1 md:mr-2" />,
  Clock: <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#D2EBD0] mr-1 md:mr-2" />,
  Star: <Star className="w-5 h-5 md:w-6 md:h-6 text-[#D2EBD0] mr-1 md:mr-2" />,
}

// This is the main component you will import into your pages
export function CompanyStats() {
  const stats = [
    { icon: Award, value: 10, label: "Awards", suffix: "+" },
    { icon: Users, value: 350, label: "Happy Clients", suffix: "+" },
    { icon: Clock, value: 10, label: "Years Experience", suffix: "+" },
    { icon: Star, value: 4, label: "Rating", suffix: "" }
  ];

  return (
    <motion.div
      // UPDATED: Added lg:grid-cols-1 to switch to a single column on large screens
      className="grid grid-cols-2 m-5 md:grid-cols-4 lg:grid-cols-1 gap-4 md:gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center flex flex-col items-center justify-center gap-1 text-white">
          <div className="flex items-center justify-center mb-2">
            {ICON_COMPONENTS[stat.icon.name]}
            <span className="text-xl md:text-3xl font-bold">
              <AnimatedCounter end={stat.value} />
              {stat.suffix}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-200">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}