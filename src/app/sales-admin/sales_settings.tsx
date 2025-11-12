'use client';

import React from 'react';
import { Settings } from 'lucide-react';

const SettingsTab = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">
          Settings
        </h1>
        <p className="text-gray-600 text-lg">
          Look into Your settings
        </p>
      </div>
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Insights Section</h3>
        <p className="text-gray-500">Business analytics features coming soon.</p>
      </div>
    </>
  );
};

export default SettingsTab;
