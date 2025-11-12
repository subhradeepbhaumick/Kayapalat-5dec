'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

const BusinessInsightsTab = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">
          Business Insights
        </h1>
        <p className="text-gray-600 text-lg">
          Analyze your business performance and trends.
        </p>
      </div>
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Insights Section</h3>
        <p className="text-gray-500">Business analytics features coming soon.</p>
      </div>
    </>
  );
};

export default BusinessInsightsTab;
