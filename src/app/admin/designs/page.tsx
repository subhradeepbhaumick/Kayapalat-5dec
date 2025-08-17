// File: src/app/admin/designs/page.tsx
'use client';

import { useState } from 'react';

import { SliderTable } from '@/components/SliderTable';
import { PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DesignAdminPage() {
  // NEW: State to control table visibility
  const [isTableVisible, setIsTableVisible] = useState(false);

  return (
    <div className="p-8 min-h-screen bg-[#D2EBD0]">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Designs</h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* NEW: Big clickable button to toggle the table */}
        <div
          onClick={() => setIsTableVisible(prev => !prev)}
          className="cursor-pointer bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl ring-2 ring-transparent hover:ring-green-500"
        >
          <div className="text-green-600 mb-4">
            <PenTool size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Our Creations
          </h2>
          <p className="text-sm text-gray-500 mt-2">Click to manage Image Sliders across the platform</p>
        </div>
        

        {/* You can add another button for "Our Ideas" here */}
      </div>

      {/* NEW: Conditionally render the table with an animation */}
      <AnimatePresence>
        {isTableVisible && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SliderTable />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}