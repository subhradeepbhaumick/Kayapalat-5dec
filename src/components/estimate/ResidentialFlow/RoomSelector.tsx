"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCouch,
  FaBed,
  FaUtensils,
  FaBath,
  FaRedo,
  FaCheck,
  FaPlus,
  FaMinus,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaInfoCircle, 
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RoomSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onRoomSelect: (roomId: string, details: any) => void;
  selectedRooms: { [key: string]: boolean };
  bhkType: { [key: string]: number };
  accessoryPrices: { [key: string]: { [key: string]: number } };
  featurePrices: { [key: string]: number };
  mode?: "card" | "modal";
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  isOpen = false,
  onClose = () => {},
  onRoomSelect,
  selectedRooms,
  bhkType,
  accessoryPrices,
  featurePrices,
  mode = "modal",
}) => {
  // Room type configuration with icons and labels
  const roomTypes = [
    { id: "livingRoom", label: "Living Room", icon: <FaCouch />, key: "livingRoom" },
    { id: "dining", label: "Dining", icon: <FaUtensils />, key: "dining" },
    { id: "bedroom", label: "Bedroom", icon: <FaBed />, key: "bedroom" },
    { id: "kitchen", label: "Kitchen", icon: <FaUtensils />, key: "kitchen" },
    { id: "bathroom", label: "Bathroom", icon: <FaBath />, key: "bathroom" },
  ];

  // Mock data for room options (you can replace this with your actual data)
  const roomOptions = {
    material: [
      { value: "BWP-Ply", label: "BWP-Ply", price: 0 },
      { value: "MDF", label: "MDF", price: 500 },
      { value: "Plywood", label: "Plywood", price: 800 },
      { value: "Particle Board", label: "Particle Board", price: 300 },
    ],
    finish: [
      { value: "BWP-Ply-Matte-Laminate", label: "BWP-Ply-Matte-Laminate", price: 0 },
      { value: "Glossy-Laminate", label: "Glossy Laminate", price: 1000 },
      { value: "Veneer", label: "Veneer", price: 1500 },
      { value: "Paint", label: "Paint", price: 800 },
    ],
    hardware: [
      { value: "Hettich", label: "Hettich", price: 0 },
      { value: "Blum", label: "Blum", price: 2000 },
      { value: "Hafele", label: "Hafele", price: 1500 },
      { value: "Ebco", label: "Ebco", price: 1200 },
    ],
    shape: [
      { value: "L-shaped", label: "L-shaped", price: 0 },
      { value: "U-shaped", label: "U-shaped", price: 1000 },
      { value: "Straight", label: "Straight", price: 500 },
      { value: "Island", label: "Island", price: 2000 },
    ],
  };

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [roomDetails, setRoomDetails] = useState<any>({});
  const [savedRooms, setSavedRooms] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [accessoriesVisible, setAccessoriesVisible] = useState<{ [key: string]: boolean }>({});
  const [carouselIndex, setCarouselIndex] = useState<{ [key: string]: number }>({});

  // Debug log to see what bhkType contains
  useEffect(() => {
    console.log('RoomSelector bhkType:', bhkType);
  }, [bhkType]);

  const handleResetAll = () => {
    setOpenPanel(null);
    setRoomDetails({});
    setSavedRooms({});
    setErrors({});
    setAccessoriesVisible({});
    setCarouselIndex({});
  };

  const handleTogglePanel = (roomId: string) => {
    setOpenPanel((prev) => (prev === roomId ? null : roomId));
  };

  const handleDetailChange = (roomKey: string, key: string, value: any) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      [roomKey]: {
        ...prev[roomKey],
        [key]: value,
      },
    }));

    if (key === "area" && value) {
      setErrors((prev) => ({ ...prev, [roomKey]: "" }));
    }
  };

  const getAccessoriesForRoom = (roomType: string, kidsRoom?: boolean) => {
    const baseAccessories = accessoryPrices[roomType]
      ? Object.keys(accessoryPrices[roomType])
      : [];

    if (roomType === "bedroom" && kidsRoom) {
      const kidAccessories = accessoryPrices["kids"]
        ? Object.keys(accessoryPrices["kids"])
        : [];
      return [...baseAccessories, ...kidAccessories];
    }

    return baseAccessories;
  };

  const handleAccessoryQuantityChange = (roomKey: string, acc: string, change: number) => {
    setRoomDetails((prev: Record<string, any>) => {
      const accessories = prev[roomKey]?.accessories || {};
      const currentQuantity = accessories[acc] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      return {
        ...prev,
        [roomKey]: {
          ...prev[roomKey],
          accessories: {
            ...accessories,
            [acc]: newQuantity,
          },
        },
      };
    });
  };

  const toggleAccessoriesVisibility = (roomKey: string) => {
    setAccessoriesVisible((prev) => ({
      ...prev,
      [roomKey]: !prev[roomKey],
    }));
  };

  const handleCarouselNavigation = (roomType: string, direction: 'prev' | 'next') => {
    const roomCount = getRoomCount(roomType);
    setCarouselIndex((prev) => {
      const current = prev[roomType] || 0;
      let newIndex;
      if (direction === 'prev') {
        newIndex = current === 0 ? roomCount - 1 : current - 1;
      } else {
        newIndex = current === roomCount - 1 ? 0 : current + 1;
      }
      return { ...prev, [roomType]: newIndex };
    });
  };

  const handleSave = (roomKey: string) => {
    const areaValue = roomDetails[roomKey]?.area;
    if (!areaValue) {
      setErrors((prev) => ({
        ...prev,
        [roomKey]: "Carpet area is required.",
      }));
      return;
    }
    
    // Mark this room as saved
    setSavedRooms((prev) => ({
      ...prev,
      [roomKey]: true,
    }));
    
    onRoomSelect(roomKey, roomDetails[roomKey]);
    setOpenPanel(null);
  };

  const handleCancel = (roomKey: string) => {
    setRoomDetails((prev: typeof roomDetails) => {
      const updated = { ...prev };
      delete updated[roomKey];
      return updated;
    });
    
    // Remove from saved rooms if it was saved
    setSavedRooms((prev) => {
      const updated = { ...prev };
      delete updated[roomKey];
      return updated;
    });
    
    setOpenPanel(null);
  };

  const isRoomTypeSaved = (roomId: string) => {
    return Object.keys(savedRooms).some((key) => 
      key.startsWith(roomId) && savedRooms[key]
    );
  };

  // Get room count, handling both predefined BHK and custom configurations
  const getRoomCount = (roomType: string) => {
    // Handle different key mappings for custom configurations
    let count = 0;
    
    switch (roomType) {
      case 'livingRoom':
        count = bhkType['livingRoom'] || bhkType['livingRooms'] || 0;
        break;
      case 'bedroom':
        count = bhkType['bedroom'] || bhkType['bedrooms'] || 0;
        break;
      case 'kitchen':
        count = bhkType['kitchen'] || bhkType['kitchens'] || 0;
        break;
      case 'bathroom':
        count = bhkType['bathroom'] || bhkType['bathrooms'] || 0;
        break;
      case 'dining':
        count = bhkType['dining'] || 0;
        break;
      default:
        count = bhkType[roomType] || 0;
    }
    
    console.log(`Room count for ${roomType}:`, count);
    return count;
  };

  const renderRoomCard = (roomType: string, roomIndex: number) => {
    const roomKey = `${roomType}_${roomIndex + 1}`;
    const isKidsRoom = roomDetails[roomKey]?.kidsRoom || false;
    const accessories = getAccessoriesForRoom(roomType, isKidsRoom);
    const currentAccessories = roomDetails[roomKey]?.accessories || {};

    return (
      <motion.div
        key={roomKey}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg min-h-[600px] w-full max-w-md mx-auto"
      >
        <h4 className="font-bold text-xl mb-4 text-[#00423D] capitalize text-center">
          {roomType === 'livingRoom' ? 'Living Room' : roomType.replace(/([A-Z])/g, ' $1').trim()} {getRoomCount(roomType) > 1 ? ` ${roomIndex + 1}` : ""}
        </h4>

        <div className="space-y-4">
          {/* Carpet Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carpet Area (sq.ft) *
            </label>
            <input
              type="number"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent"
              value={roomDetails[roomKey]?.area || ""}
              onChange={(e) =>
                handleDetailChange(roomKey, "area", e.target.value)
              }
              placeholder="Enter carpet area"
              min="1"
            />
            {errors[roomKey] && (
              <p className="text-red-600 text-sm mt-1">{errors[roomKey]}</p>
            )}
          </div>

          {/* Toggle Features */}
          <div className="space-y-3">
            {/* False Ceiling Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">False Ceiling</span>
              <div className="flex items-center gap-2">
                {featurePrices['falseCeiling'] && (
                  <span className="text-xs text-gray-500">
                    (+₹{featurePrices['falseCeiling'].toLocaleString('en-IN')})
                  </span>
                )}
                <div
                  className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition duration-200 ${
                    roomDetails[roomKey]?.falseCeiling
                      ? "bg-[#00423D]"
                      : "bg-gray-300"
                  }`}
                  onClick={() =>
                    handleDetailChange(
                      roomKey,
                      "falseCeiling",
                      !roomDetails[roomKey]?.falseCeiling
                    )
                  }
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition duration-200 ${
                      roomDetails[roomKey]?.falseCeiling ? "translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Kids Room toggle - only for bedrooms */}
            {roomType === "bedroom" && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Kids Room</span>
                <div
                  className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition duration-200 ${
                    isKidsRoom ? "bg-[#00423D]" : "bg-gray-300"
                  }`}
                  onClick={() =>
                    handleDetailChange(roomKey, "kidsRoom", !isKidsRoom)
                  }
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition duration-200 ${
                      isKidsRoom ? "translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Loft toggle - only for Kitchen */}
            {roomType === "kitchen" && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Loft</span>
                <div className="flex items-center gap-2">
                  {featurePrices['loft'] && (
                    <span className="text-xs text-gray-500">
                      (+₹{featurePrices['loft'].toLocaleString('en-IN')})
                    </span>
                  )}
                  <div
                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition duration-200 ${
                      roomDetails[roomKey]?.loft ? "bg-[#00423D]" : "bg-gray-300"
                    }`}
                    onClick={() =>
                      handleDetailChange(
                        roomKey,
                        "loft",
                        !roomDetails[roomKey]?.loft
                      )
                    }
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transition duration-200 ${
                        roomDetails[roomKey]?.loft ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Room Options Dropdowns */}
          <div className="space-y-3">
            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent"
                value={roomDetails[roomKey]?.material || "BWP-Ply"}
                onChange={(e) =>
                  handleDetailChange(roomKey, "material", e.target.value)
                }
              >
                {roomOptions.material.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.price > 0 && `(+₹${option.price.toLocaleString('en-IN')})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Finish */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Finish
              </label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent"
                value={roomDetails[roomKey]?.finish || "BWP-Zy-Matte-Laminate"}
                onChange={(e) =>
                  handleDetailChange(roomKey, "finish", e.target.value)
                }
              >
                {roomOptions.finish.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.price > 0 && `(+₹${option.price.toLocaleString('en-IN')})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Hardware */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hardware
              </label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent"
                value={roomDetails[roomKey]?.hardware || "Hettich"}
                onChange={(e) =>
                  handleDetailChange(roomKey, "hardware", e.target.value)
                }
              >
                {roomOptions.hardware.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.price > 0 && `(+₹${option.price.toLocaleString('en-IN')})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Shape */}
            {roomType === "kitchen" && (<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shape
              </label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent"
                value={roomDetails[roomKey]?.shape || "L-shaped"}
                onChange={(e) =>
                  handleDetailChange(roomKey, "shape", e.target.value)
                }
              >
                {roomOptions.shape.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.price > 0 && `(+₹${option.price.toLocaleString('en-IN')})`}
                  </option>
                ))}
              </select>
            </div>
            )}
          </div>

          {/* Accessories */}
          {accessories.length > 0 && (
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                onClick={() => toggleAccessoriesVisibility(roomKey)}
              >
                <span className="text-sm font-medium text-gray-700">
                  Accessories {isKidsRoom && roomType === 'bedroom' && '(Including Kids options)'}
                </span>
                <div className="flex items-center gap-2">
                  <FaPlus className={`text-[#00423D] transition-transform duration-200 ${
                    accessoriesVisible[roomKey] ? 'rotate-45' : ''
                  }`} />
                </div>
              </div>

              <AnimatePresence>
                {accessoriesVisible[roomKey] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 space-y-2 max-h-40 overflow-y-auto"
                  >
                    {accessories.map((acc) => {
                      const price = accessoryPrices[roomType]?.[acc] || 
                                   (isKidsRoom ? accessoryPrices['kids']?.[acc] : 0) || 0;
                      const quantity = currentAccessories[acc] || 0;
                      
                      return (
                        <div
                          key={acc}
                          className="flex items-center justify-between p-2 border rounded-lg bg-white"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{acc}</div>
                            {price > 0 && (
                              <div className="text-xs text-gray-500">
                                ₹{price.toLocaleString('en-IN')} each
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAccessoryQuantityChange(roomKey, acc, -1)}
                              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition duration-200"
                              disabled={quantity === 0}
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAccessoryQuantityChange(roomKey, acc, 1)}
                              className="w-6 h-6 rounded-full bg-[#00423D] hover:bg-[#00332D] text-white flex items-center justify-center transition duration-200"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={() => handleCancel(roomKey)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(roomKey)}
            className="px-4 py-2 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-200"
          >
            Save Room
          </button>
        </div>
      </motion.div>
    );
  };

  const renderRoomCarousel = (roomType: string) => {
    const count = getRoomCount(roomType);
    
    // Don't render if this room type is not included in the BHK configuration
    if (count === 0) return null;

    const currentIndex = carouselIndex[roomType] || 0;
    
    if (count === 1) {
      return renderRoomCard(roomType, 0);
    }

    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => handleCarouselNavigation(roomType, 'prev')}
            className="p-2 rounded-full bg-[#00423D] text-white hover:bg-[#00332D] transition duration-200"
          >
            <FaChevronLeft />
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-600">
              Room {currentIndex + 1} of {count}
            </span>
          </div>
          
          <button
            onClick={() => handleCarouselNavigation(roomType, 'next')}
            className="p-2 rounded-full bg-[#00423D] text-white hover:bg-[#00332D] transition duration-200"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="overflow-hidden">
          <motion.div
            key={`${roomType}-${currentIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderRoomCard(roomType, currentIndex)}
          </motion.div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCarouselIndex(prev => ({ ...prev, [roomType]: index }))}
              className={`w-2 h-2 rounded-full transition duration-200 ${
                index === currentIndex ? 'bg-[#00423D]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl bg-white/95 rounded-xl shadow-lg p-6 sm:p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#00423D]">Configure Your Rooms</h2>
        <button
          type="button"
          onClick={handleResetAll}
          className=" text-sm text-red-600 flex items-center gap-2 hover:text-red-700 transition duration-200"
        >
          <FaRedo className="hidden md:flex" /> Reset All
        </button>
      </div>

      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-blue-800 mb-2">Room Configuration Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
          {roomTypes.map((room) => {
            const count = getRoomCount(room.id);
            if (count === 0) return null;
            return (
              <div key={room.id} className="flex items-center gap-1">
                <span className="text-blue-600">{room.icon}</span>
                <span>{room.label}: {count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="space-y-6"
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
        {roomTypes.map((room) => {
          // Only show room types that are included in the BHK configuration
          const roomCount = getRoomCount(room.id);
          if (roomCount === 0) return null;

          return (
            <motion.div 
              key={room.id} 
              className="border-2 border-gray-200 rounded-xl overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-t-xl border-b-2 flex justify-between items-center cursor-pointer transition duration-200 ${
                  openPanel === room.id
                    ? "border-[#00423D] bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                onClick={() => handleTogglePanel(room.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl text-[#00423D]">{room.icon}</div>
                  <div>
                    <span className="font-medium text-lg">{room.label}</span>
                    {roomCount > 1 && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({roomCount} rooms)
                      </span>
                    )}
                    {isRoomTypeSaved(room.id) && (
                      <span className="text-xs text-green-600 ml-2 font-medium">
                        ✓ Configured
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: openPanel === room.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                  >
                    <FaChevronDown />
                  </motion.div>
                </div>
              </motion.div>

              <AnimatePresence>
                {openPanel === room.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gray-50">
                      {renderRoomCarousel(room.id)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {Object.keys(bhkType).length === 0 && (
        <motion.div 
          className="text-center py-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>No room configuration available. Please select a BHK type first.</p>
        </motion.div>
      )}  

{/* Help section for card mode */}
{mode === "card" && (
          <motion.div 
            className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FaInfoCircle className="text-green-600" />
              <h3 className="font-semibold text-green-800">How to Configure Your Rooms</h3>
            </div>
            <div className="text-sm text-green-700 space-y-2">
              <p>• Click on any room type to expand and configure individual rooms</p>
              <p>• Enter the carpet area for each room (required)</p>
              <p>• Use toggles to add features like false ceiling, loft, or mark as kids room</p>
              <p>• Select materials, finishes, hardware, and shapes from dropdown menus</p>
              <p>• Click "Accessories" to add optional items to each room</p>
              <p>• Use navigation arrows for multiple rooms of the same type</p>
              <p>• Save each room configuration before moving to the next</p>
            </div>
          </motion.div>
        )}
      </motion.div>
  );
  // Modal mode rendering
  if (mode === "modal") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Your Rooms</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Card mode rendering
  return content;
};

export default RoomSelector;