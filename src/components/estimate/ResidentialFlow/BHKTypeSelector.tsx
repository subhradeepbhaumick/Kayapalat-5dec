"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface BHKTypeSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelect: (bhkType: string, customConfig?: CustomConfig) => void;
  selectedBHK: string;
  mode?: 'card' | 'modal';
}

interface CustomConfig {
  bedrooms: number;
  livingRooms: number;
  kitchens: number;
  bathrooms: number;
  dining: number;
}

const BHKTypeSelector: React.FC<BHKTypeSelectorProps> = ({
  isOpen = false,
  onClose = () => {},
  onSelect,
  selectedBHK,
  mode = 'modal',
}) => {
  const [customConfig, setCustomConfig] = useState<CustomConfig>({
    bedrooms: 1,
    livingRooms: 1,
    kitchens: 1,
    bathrooms: 1,
    dining: 1,
  });

  const bhkOptions = [
    { value: '1BHK', label: '1 BHK', rooms: ['1 Bedroom', '1 Living Room', '1 Kitchen', '1 Bathroom'] },
    { value: '2BHK', label: '2 BHK', rooms: ['2 Bedrooms', '1 Living Room', '1 Kitchen', '2 Bathrooms', '1 Dining'] },
    { value: '3BHK', label: '3 BHK', rooms: ['3 Bedrooms', '1 Living Room', '1 Kitchen', '2 Bathrooms', '1 Dining'] },
    { value: '4BHK', label: '4 BHK', rooms: ['4 Bedrooms', '1 Living Room', '1 Kitchen', '3 Bathrooms', '1 Dining'] },
    { value: '5BHK', label: '5 BHK', rooms: ['5 Bedrooms', '1 Living Room', '1 Kitchen', '3 Bathrooms', '1 Dining'] },
    { value: 'custom', label: 'Custom', rooms: [] },
  ];

  const handleCustomChange = (key: keyof CustomConfig, delta: number) => {
    const newConfig = {
      ...customConfig,
      [key]: Math.max(0, customConfig[key] + delta),
    };
    setCustomConfig(newConfig);
    
    // If custom is already selected, update the parent with new config
    if (selectedBHK === 'custom') {
      onSelect('custom', newConfig);
    }
  };

  const handleSelect = (value: string) => {
    if (value === 'custom') {
      // For custom selection, pass the current custom configuration
      onSelect(value, customConfig);
    } else {
      // For predefined BHK types, don't pass custom config
      onSelect(value);
    }
  };

const renderCustomInputs = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
    {(['bedrooms', 'livingRooms', 'kitchens', 'bathrooms', 'dining'] as (keyof CustomConfig)[]).map((key) => (
      <div key={key} className="flex flex-col items-center p-3 rounded-lg border">
        <span className="font-medium capitalize text-sm">
          {key === 'livingRooms' ? 'Living ' : key.replace(/([A-Z])/g, ' $1')}
        </span>
        <div className="flex items-center mt-2 space-x-2">
          <button
            type="button"
            onClick={() => handleCustomChange(key, -1)}
            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition duration-200"
            disabled={customConfig[key] <= 0}
          >
            -
          </button>
          <span className="text-base font-semibold min-w-[20px] text-center">{customConfig[key]}</span>
          <button
            type="button"
            onClick={() => handleCustomChange(key, 1)}
            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition duration-200"
          >
            +
          </button>
        </div>
      </div>
    ))}
  </div>
);

  const getCustomRoomsList = () => {
    const rooms = [];
    if (customConfig.bedrooms > 0) rooms.push(`${customConfig.bedrooms} Bedroom${customConfig.bedrooms > 1 ? 's' : ''}`);
    if (customConfig.livingRooms > 0) rooms.push(`${customConfig.livingRooms} Living Room${customConfig.livingRooms > 1 ? 's' : ''}`);
    if (customConfig.kitchens > 0) rooms.push(`${customConfig.kitchens} Kitchen${customConfig.kitchens > 1 ? 's' : ''}`);
    if (customConfig.bathrooms > 0) rooms.push(`${customConfig.bathrooms} Bathroom${customConfig.bathrooms > 1 ? 's' : ''}`);
    if (customConfig.dining > 0) rooms.push(`${customConfig.dining} Dining${customConfig.dining > 1 ? 's' : ''}`);
    return rooms;
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl bg-white/95 rounded-xl shadow-lg p-6 sm:p-8"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-[#00423D] text-left mb-4 sm:mb-6">Select BHK Type</h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {bhkOptions.map((option) => (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-4 sm:p-6 rounded-xl border-2 flex flex-col items-start shadow-sm transition-all duration-300 h-full text-left ${
              selectedBHK === option.value
                ? 'border-[#00423D] bg-gradient-to-r from-white via-[#A8EACF] to-[#8BE1C6]'
                : 'border-gray-200 bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100'
            }`}
          >
            {/* Checkmark */}
            <span
              className="absolute top-3 right-3 flex items-center justify-center h-5 w-5 rounded-full border-2 border-[#00423D] bg-white cursor-pointer"
            >
              <AnimatePresence>
                {selectedBHK === option.value && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="h-[80%] w-[80%] rounded-full bg-[#00423D]"
                  />
                )}
              </AnimatePresence>
            </span>

            <div className="flex items-center mb-2">
              <span className="font-semibold text-base sm:text-lg">{option.label}</span>
            </div>
            
            {option.value === 'custom' ? (
              <>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-3">
                  Customize your room configuration below.
                </p>
              </>
            ) : (
              <ul className="text-xs sm:text-sm text-gray-600 list-disc pl-4 sm:pl-5">
                {option.rooms.map((room, idx) => (
                  <li key={idx}>{room}</li>
                ))}
              </ul>
            )}
          </motion.button>
        ))}
      </motion.div>

      {selectedBHK === 'custom' && (
  <motion.div 
    className="mt-6"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
  >
    <h3 className="text-lg font-semibold text-[#00423D] mb-3">Customize Your Configuration</h3>
    {renderCustomInputs()}
    
    {/* Show current configuration summary */}
    {getCustomRoomsList().length > 0 && (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <h4 className="font-semibold text-[#00423D] mb-2">Your Configuration:</h4>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          {getCustomRoomsList().map((room, idx) => (
            <li key={idx}>{room}</li>
          ))}
        </ul>
      </div>
    )}
    
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm text-gray-700">
        <strong>Note:</strong> Kids' rooms will be considered under Bedrooms. 
      </p>
    </div>
  </motion.div>
)}

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-[#00423D] mb-1">What is a BHK?</h4>
        <p className="text-gray-700 text-xs sm:text-sm">
          BHK stands for Bedroom, Hall, and Kitchen. Select the configuration that matches your home.
          You can customize room details in the next step.
        </p>
      </div>
    </motion.div>
  );

  if (mode === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full overflow-y-auto max-h-[85vh] bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#00423D] text-center">
              Select BHK Type
            </DialogTitle>
          </DialogHeader>

          {content}

          <div className="flex justify-end mt-6 sm:mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium text-sm sm:text-base"
            >
              Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};

export default BHKTypeSelector;