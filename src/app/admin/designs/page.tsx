// File: src/app/admin/designs/page.tsx
'use client';

import { SliderTable } from '@/components/SliderTable';

export default function DesignAdminPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Sliders & Testimonials</h1>
      <div className="grid grid-cols-1 gap-8">
        {/* You can add another table for "Our Ideas" here later */}
        <SliderTable />
      </div>
    </div>
  );
}