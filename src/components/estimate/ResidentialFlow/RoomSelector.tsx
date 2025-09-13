"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCouch, FaBed, FaUtensils, FaBath, FaRedo, FaPlus, FaMinus,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaInfoCircle,
} from "react-icons/fa";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
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

// --- ADDED THIS CONSTANT FOR DEFAULTS ---
const DEFAULT_ROOM_DETAILS = {
    material: "BWP-Ply",
    finish: "BWP-Ply-Matte-Laminate",
    hardware: "Hettich",
    shape: "L-shaped",
};

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
    const roomTypes = [
        { id: "livingRoom", label: "Living Room", icon: <FaCouch />, key: "livingRoom" },
        { id: "dining", label: "Dining", icon: <FaUtensils />, key: "dining" },
        { id: "bedroom", label: "Bedroom", icon: <FaBed />, key: "bedroom" },
        { id: "kitchen", label: "Kitchen", icon: <FaUtensils />, key: "kitchen" },
        { id: "bathroom", label: "Bathroom", icon: <FaBath />, key: "bathroom" },
    ];

    const roomOptions = {
        material: [
            { value: "BWP-Ply", label: "BWP-Ply" },
            { value: "MDF", label: "MDF" },
            { value: "Plywood", label: "Plywood" },
            { value: "Particle Board", label: "Particle Board" },
        ],
        finish: [
            { value: "BWP-Ply-Matte-Laminate", label: "BWP-Ply-Matte-Laminate" },
            { value: "Glossy-Laminate", label: "Glossy Laminate" },
            { value: "Veneer", label: "Veneer" },
            { value: "Paint", label: "Paint" },
        ],
        hardware: [
            { value: "Hettich", label: "Hettich" },
            { value: "Blum", label: "Blum" },
            { value: "Hafele", label: "Hafele" },
            { value: "Ebco", label: "Ebco" },
        ],
        shape: [
            { value: "L-shaped", label: "L-shaped" },
            { value: "U-shaped", label: "U-shaped" },
            { value: "Straight", label: "Straight" },
            { value: "Island", label: "Island" },
        ],
    };

    const [openPanel, setOpenPanel] = useState<string | null>(null);
    const [roomDetails, setRoomDetails] = useState<any>({});
    const [savedRooms, setSavedRooms] = useState<{ [key: string]: boolean }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [accessoriesVisible, setAccessoriesVisible] = useState<{ [key: string]: boolean }>({});
    const [carouselIndex, setCarouselIndex] = useState<{ [key: string]: number }>({});

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

    // --- REPLACED THIS FUNCTION WITH THE CORRECTED LOGIC ---
    const handleDetailChange = (roomKey: string, key: string, value: any) => {
        const roomType = roomKey.split('_')[0];
    
        setRoomDetails((prev: any) => {
            const existingRoomDetails = prev[roomKey] || {};
    
            const newRoomDetails = {
                ...DEFAULT_ROOM_DETAILS,
                ...(roomType !== 'kitchen' && { shape: undefined }),
                ...existingRoomDetails,
                [key]: value,
            };
    
            return {
                ...prev,
                [roomKey]: newRoomDetails,
            };
        });
    
        if (key === "area" && value) {
            setErrors((prev) => ({ ...prev, [roomKey]: "" }));
        }
    };
    // --- END OF REPLACEMENT ---

    const getAccessoriesForRoom = (roomType: string, kidsRoom?: boolean) => {
        const baseAccessories = accessoryPrices[roomType] ? Object.keys(accessoryPrices[roomType]) : [];
        if (roomType === "bedroom" && kidsRoom) {
            const kidAccessories = accessoryPrices["kids"] ? Object.keys(accessoryPrices["kids"]) : [];
            return [...new Set([...baseAccessories, ...kidAccessories])];
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
                    accessories: { ...accessories, [acc]: newQuantity },
                },
            };
        });
    };

    const toggleAccessoriesVisibility = (roomKey: string) => {
        setAccessoriesVisible((prev) => ({ ...prev, [roomKey]: !prev[roomKey] }));
    };

    const handleCarouselNavigation = (roomType: string, direction: 'prev' | 'next') => {
        const roomCount = getRoomCount(roomType);
        setCarouselIndex((prev) => {
            const current = prev[roomType] || 0;
            const newIndex = direction === 'prev'
                ? (current === 0 ? roomCount - 1 : current - 1)
                : (current === roomCount - 1 ? 0 : current + 1);
            return { ...prev, [roomType]: newIndex };
        });
    };

    const handleSave = (roomKey: string) => {
        const areaValue = roomDetails[roomKey]?.area;
        if (!areaValue || parseFloat(areaValue) <= 0) {
            setErrors((prev) => ({ ...prev, [roomKey]: "A valid carpet area is required." }));
            return;
        }
        setSavedRooms((prev) => ({ ...prev, [roomKey]: true }));
        onRoomSelect(roomKey, roomDetails[roomKey]);
        setOpenPanel(null);
    };

    const handleCancel = (roomKey: string) => {
        setRoomDetails((prev: typeof roomDetails) => {
            const updated = { ...prev };
            delete updated[roomKey];
            return updated;
        });
        setSavedRooms((prev) => {
            const updated = { ...prev };
            delete updated[roomKey];
            return updated;
        });
        setOpenPanel(null);
    };

    const isRoomTypeSaved = (roomId: string) => {
        return Object.keys(savedRooms).some((key) => key.startsWith(roomId) && savedRooms[key]);
    };

    const getRoomCount = (roomType: string) => {
        return bhkType[roomType] || 0;
    };

    const renderRoomCard = (roomType: string, roomIndex: number) => {
        const roomKey = `${roomType}_${roomIndex + 1}`;
        const details = roomDetails[roomKey] || {};
        const isKidsRoom = details.kidsRoom || false;
        const accessories = getAccessoriesForRoom(roomType, isKidsRoom);
        const currentAccessories = details.accessories || {};

        return (
            <motion.div
                key={roomKey}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-lg w-full max-w-xl mx-auto"
            >
                <h4 className="font-bold text-xl mt-1 mb-4 text-[#00423D] capitalize text-center">
                    {roomType.replace(/([A-Z])/g, ' $1').trim()} {getRoomCount(roomType) > 1 ? ` ${roomIndex + 1}` : ""}
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area (sq.ft) *</label>
                        <input
                            type="number"
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                            value={details.area || ""}
                            onChange={(e) => handleDetailChange(roomKey, "area", e.target.value)}
                            placeholder="Enter carpet area"
                            min="1"
                        />
                        {errors[roomKey] && <p className="text-red-600 text-sm mt-1">{errors[roomKey]}</p>}
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">False Ceiling</span>
                            <div
                                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-all ${details.falseCeiling ? "bg-[#00423D]" : "bg-gray-300"}`}
                                onClick={() => handleDetailChange(roomKey, "falseCeiling", !details.falseCeiling)}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${details.falseCeiling ? "translate-x-6" : ""}`} />
                            </div>
                        </div>
                        {roomType === "bedroom" && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Kids Room</span>
                                <div
                                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-all ${isKidsRoom ? "bg-[#00423D]" : "bg-gray-300"}`}
                                    onClick={() => handleDetailChange(roomKey, "kidsRoom", !isKidsRoom)}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isKidsRoom ? "translate-x-6" : ""}`} />
                                </div>
                            </div>
                        )}
                        {roomType === "kitchen" && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Loft</span>
                                <div
                                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-all ${details.loft ? "bg-[#00423D]" : "bg-gray-300"}`}
                                    onClick={() => handleDetailChange(roomKey, "loft", !details.loft)}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${details.loft ? "translate-x-6" : ""}`} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <select
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                                value={details.material || ""}
                                onChange={(e) => handleDetailChange(roomKey, "material", e.target.value)}
                            >
                                {roomOptions.material.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Finish</label>
                            <select
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                                value={details.finish || ""}
                                onChange={(e) => handleDetailChange(roomKey, "finish", e.target.value)}
                            >
                                {roomOptions.finish.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hardware</label>
                            <select
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                                value={details.hardware || ""}
                                onChange={(e) => handleDetailChange(roomKey, "hardware", e.target.value)}
                            >
                                {roomOptions.hardware.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                        </div>
                        {roomType === "kitchen" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                                <select
                                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                                    value={details.shape || ""}
                                    onChange={(e) => handleDetailChange(roomKey, "shape", e.target.value)}
                                >
                                    {roomOptions.shape.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                                </select>
                            </div>
                        )}
                    </div>
                    {accessories.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 rounded-lg hover:bg-gray-100" onClick={() => toggleAccessoriesVisibility(roomKey)}>
                                <span className="text-sm font-medium text-gray-700">Accessories</span>
                                <FaPlus className={`text-[#00423D] transition-transform ${accessoriesVisible[roomKey] ? 'rotate-45' : ''}`} />
                            </div>
                            <AnimatePresence>
                                {accessoriesVisible[roomKey] && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                        {accessories.map((acc) => {
                                            const quantity = currentAccessories[acc] || 0;
                                            return (
                                                <div key={acc} className="flex items-center justify-between p-2 border rounded-lg bg-white">
                                                    <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{acc}</div></div>
                                                    <div className="flex items-center gap-2">
                                                        <button type="button" onClick={() => handleAccessoryQuantityChange(roomKey, acc, -1)} className="w-6 h-6 rounded-full bg-gray-200" disabled={quantity === 0}><FaMinus className="text-xs mx-auto" /></button>
                                                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                                        <button type="button" onClick={() => handleAccessoryQuantityChange(roomKey, acc, 1)} className="w-6 h-6 rounded-full bg-[#00423D] text-white"><FaPlus className="text-xs mx-auto" /></button>
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
                    <button type="button" onClick={() => handleCancel(roomKey)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="button" onClick={() => handleSave(roomKey)} className="px-4 py-2 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D]">Save Room</button>
                </div>
            </motion.div>
        );
    };

    const renderRoomCarousel = (roomType: string) => {
        const count = getRoomCount(roomType);
        if (count === 0) return null;
        const currentIndex = carouselIndex[roomType] || 0;
        if (count === 1) return renderRoomCard(roomType, 0);

        return (
            <div className="relative p-4">
                <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => handleCarouselNavigation(roomType, 'prev')} className="p-2 rounded-full bg-[#00423D] text-white hover:bg-[#00332D]"><FaChevronLeft /></button>
                    <span className="text-sm text-gray-600">Room {currentIndex + 1} of {count}</span>
                    <button type="button" onClick={() => handleCarouselNavigation(roomType, 'next')} className="p-2 rounded-full bg-[#00423D] text-white hover:bg-[#00332D]"><FaChevronRight /></button>
                </div>
                <div className="overflow-hidden">
                    <motion.div key={`${roomType}-${currentIndex}`} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}>
                        {renderRoomCard(roomType, currentIndex)}
                    </motion.div>
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: count }).map((_, index) => (
                        <button key={index} type="button" onClick={() => setCarouselIndex(prev => ({ ...prev, [roomType]: index }))} className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-[#00423D]' : 'bg-gray-300'}`} />
                    ))}
                </div>
            </div>
        );
    };

    const content = (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl bg-white/95 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#00423D]">Configure Your Rooms</h2>
                <button type="button" onClick={handleResetAll} className="text-sm text-red-600 flex items-center gap-2 hover:text-red-700"><FaRedo className="hidden md:flex" /> Reset All</button>
            </div>
            <motion.div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h3 className="font-semibold text-blue-800 mb-2">Room Configuration Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
                    {roomTypes.map((room) => {
                        const count = getRoomCount(room.id);
                        if (count === 0) return null;
                        return (<div key={room.id} className="flex items-center gap-1"><span className="text-blue-600">{room.icon}</span><span>{room.label}: {count}</span></div>);
                    })}
                </div>
            </motion.div>
            <motion.div className="space-y-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                {roomTypes.map((room) => {
                    const roomCount = getRoomCount(room.id);
                    if (roomCount === 0) return null;
                    return (
                        <motion.div key={room.id} className="border-2 border-gray-200 rounded-xl overflow-hidden" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <motion.div whileHover={{ scale: 1.01 }} className={`p-4 border-b-2 flex justify-between items-center cursor-pointer ${openPanel === room.id ? "border-[#00423D] bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`} onClick={() => handleTogglePanel(room.id)}>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl text-[#00423D]">{room.icon}</div>
                                    <div>
                                        <span className="font-medium text-lg">{room.label}</span>
                                        {roomCount > 1 && <span className="text-sm text-gray-500 ml-2">({roomCount} rooms)</span>}
                                        {isRoomTypeSaved(room.id) && <span className="text-xs text-green-600 ml-2 font-medium">✓ Configured</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.div animate={{ rotate: openPanel === room.id ? 180 : 0 }} className="text-gray-400"><FaChevronDown /></motion.div>
                                </div>
                            </motion.div>
                            <AnimatePresence>
                                {openPanel === room.id && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className="bg-gray-50">{renderRoomCarousel(room.id)}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </motion.div>
            {Object.keys(bhkType).length === 0 && (
                <motion.div className="text-center py-8 text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <p>No room configuration available. Please select a BHK type first.</p>
                </motion.div>
            )}
            {mode === "card" && (
                <motion.div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <div className="flex items-center gap-2 mb-3"><FaInfoCircle className="text-green-600" /><h3 className="font-semibold text-green-800">How to Configure Your Rooms</h3></div>
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

    return content;
};

export default RoomSelector;