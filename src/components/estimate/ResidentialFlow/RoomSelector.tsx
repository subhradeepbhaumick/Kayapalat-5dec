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

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [roomDetails, setRoomDetails] = useState<any>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Debug log to see what bhkType contains
  useEffect(() => {
    console.log('RoomSelector bhkType:', bhkType);
  }, [bhkType]);

  const handleResetAll = () => {
    setOpenPanel(null);
    setRoomDetails({});
    setErrors({});
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

  const handleAccessoryToggle = (roomKey: string, acc: string) => {
    setRoomDetails((prev: Record<string, any>) => {
      const selected = prev[roomKey]?.accessories || [];
      const updated = selected.includes(acc)
        ? selected.filter((a: string) => a !== acc)
        : [...selected, acc];
      return {
        ...prev,
        [roomKey]: { ...prev[roomKey], accessories: updated },
      };
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
    onRoomSelect(roomKey, roomDetails[roomKey]);
    setOpenPanel(null);
  };

  const handleCancel = (roomKey: string) => {
    setRoomDetails((prev) => {
      const updated = { ...prev };
      delete updated[roomKey];
      return updated;
    });
    setOpenPanel(null);
  };

  const isRoomTypeSaved = (roomId: string) => {
    return Object.keys(roomDetails).some(
      (key) =>
        key.startsWith(roomId) && roomDetails[key]?.area && !errors[key]
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

  const renderRoomForms = (roomType: string) => {
    const count = getRoomCount(roomType);
    
    // Don't render if this room type is not included in the BHK configuration
    if (count === 0) return null;
    
    const forms = [];

    for (let i = 1; i <= count; i++) {
      const roomKey = `${roomType}_${i}`;
      const isKidsRoom = roomDetails[roomKey]?.kidsRoom || false;
      const accessories = getAccessoriesForRoom(roomType, isKidsRoom);

      forms.push(
        <motion.div
          key={roomKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border rounded-lg bg-gray-50 mb-5"
        >
          <h4 className="font-semibold mb-3 text-[#00423D] capitalize">
            {roomType === 'livingRoom' ? 'Living Room' : roomType.replace(/([A-Z])/g, ' $1').trim()} {count > 1 ? i : ""}
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carpet Area (sq.ft) *
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent"
                value={roomDetails[roomKey]?.area || ""}
                onChange={(e) =>
                  handleDetailChange(roomKey, "area", e.target.value)
                }
                placeholder="Enter carpet area in square feet"
                min="1"
              />
              {errors[roomKey] && (
                <p className="text-red-600 text-sm mt-1">{errors[roomKey]}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {/* False Ceiling Toggle */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition duration-200 ${
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
                      roomDetails[roomKey]?.falseCeiling ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <span className="text-sm">False Ceiling</span>
                {featurePrices['falseCeiling'] && (
                  <span className="text-xs text-gray-500">
                    (+₹{featurePrices['falseCeiling'].toLocaleString('en-IN')})
                  </span>
                )}
              </div>

              {/* Kids Room toggle - only for bedrooms */}
              {roomType === "bedroom" && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition duration-200 ${
                      isKidsRoom ? "bg-[#00423D]" : "bg-gray-300"
                    }`}
                    onClick={() =>
                      handleDetailChange(roomKey, "kidsRoom", !isKidsRoom)
                    }
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transition duration-200 ${
                        isKidsRoom ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                  <span className="text-sm">Kids Room</span>
                </div>
              )}

              {/* Loft toggle - only for Kitchen */}
              {roomType === "kitchen" && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition duration-200 ${
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
                        roomDetails[roomKey]?.loft ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                  <span className="text-sm">Loft</span>
                  {featurePrices['loft'] && (
                    <span className="text-xs text-gray-500">
                      (+₹{featurePrices['loft'].toLocaleString('en-IN')})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Accessories */}
            {accessories.length > 0 && (
              <div>
                <div className="font-medium text-gray-700 mb-2">
                  Accessories {isKidsRoom && roomType === 'bedroom' && '(Including Kids-specific options)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {accessories.map((acc) => {
                    const price = accessoryPrices[roomType]?.[acc] || 
                                 (isKidsRoom ? accessoryPrices['kids']?.[acc] : 0) || 0;
                    return (
                      <label
                        key={acc}
                        className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={
                            roomDetails[roomKey]?.accessories?.includes(acc) ||
                            false
                          }
                          onChange={() => handleAccessoryToggle(roomKey, acc)}
                          className="rounded text-[#00423D] focus:ring-[#00423D]"
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">{acc}</span>
                          {price > 0 && (
                            <span className="text-xs text-gray-500">
                              +₹{price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-5 pt-4 border-t">
            <button
              type="button"
              onClick={() => handleCancel(roomKey)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(roomKey)}
              className="px-4 py-2 bg-[#00423D] text-white rounded hover:bg-[#00332D] transition duration-200"
            >
              Save Room
            </button>
          </div>
        </motion.div>
      );
    }

    return forms;
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl bg-white/95 rounded-xl shadow-lg p-6 sm:p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#00423D]">Configure Your Rooms</h2>
        <button
          type="button"
          onClick={handleResetAll}
          className="text-sm text-red-600 flex items-center gap-2 hover:text-red-700 transition duration-200"
        >
          <FaRedo /> Reset All
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
        className="space-y-4"
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
              className="border rounded-lg overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-lg border-2 flex justify-between items-center cursor-pointer transition duration-200 ${
                  openPanel === room.id
                    ? "border-[#00423D] bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                onClick={() => handleTogglePanel(room.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl text-[#00423D]">{room.icon}</div>
                  <div>
                    <span className="font-medium">{room.label}</span>
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
                  {isRoomTypeSaved(room.id) && (
                    <FaCheck className="text-green-600 text-lg" />
                  )}
                  <motion.div
                    animate={{ rotate: openPanel === room.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                  >
                    ▼
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
                    <div className="p-4 bg-gray-50 border-t">
                      {renderRoomForms(room.id)}
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
          <h4 className="font-semibold text-[#00423D] mb-2">How to Configure Rooms</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Click on each room type to expand and configure</li>
            <li>• Enter carpet area for each room (required)</li>
            <li>• Toggle features like false ceiling or loft as needed</li>
            <li>• Select accessories to customize your room</li>
            <li>• Save each room configuration before moving to the next</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );

  if (mode === "modal") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl w-full overflow-y-auto max-h-[95vh] bg-white/95 backdrop-blur-sm rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#00423D] text-center">
              Room Configuration
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};

export default RoomSelector;