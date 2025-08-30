// File: src/components/gallery/PromoCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Star } from 'lucide-react';

export interface PromoCardProps {
  id: number;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  design: 'primary' | 'secondary' | 'tertiary';
}

export function PromoCard({ title, description, link, linkLabel, design }: PromoCardProps) {
  const designs = {
    primary: {
      bg: 'bg-gradient-to-br from-[#00423D] to-[#002c28]',
      icon: <MessageSquare className="w-12 h-12 text-white/80" />,
      textColor: 'text-white',
      buttonClass: 'bg-white text-[#00423D] hover:bg-gray-200 cursor-pointer',
    },
    secondary: {
      bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
      icon: <Star className="w-12 h-12 text-rose-400" />,
      textColor: 'text-gray-800',
      buttonClass: 'bg-rose-500 text-white hover:bg-rose-600 cursor-pointer border-1 border-[#00423D]',
    },
    tertiary: {
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
      icon: <ArrowRight className="w-12 h-12 text-amber-500" />,
      textColor: 'text-amber-900',
      buttonClass: 'bg-amber-400 text-amber-900 hover:bg-amber-500 cursor-pointer border-1 border-[#00423D]',
    },
  };

  const currentDesign = designs[design];

  return (
    <motion.div
      className={`rounded-xl shadow-lg overflow-hidden border-1 border-[#00423D] flex flex-col p-8 h-full ${currentDesign.bg}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-shrink-0 mb-4">{currentDesign.icon}</div>
      <div className="flex-grow">
        <h3 className={`text-2xl font-bold ${currentDesign.textColor}`}>{title}</h3>
        <p className={`mt-2 ${currentDesign.textColor}/80`}>{description}</p>
      </div>
      <div className="mt-6">
        <Link href={link} passHref>
          <button className={`w-full font-semibold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105 ${currentDesign.buttonClass}`}>
            {linkLabel}
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
