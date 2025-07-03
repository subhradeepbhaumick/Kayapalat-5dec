"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaCheck, FaTimes } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Accessory {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface RoomDetails {
  size: string;
  accessories: Accessory[];
  falseCeiling: boolean;
  loft: boolean;
  additionalNotes: string;
}

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: RoomDetails) => void;
  roomType: string;
  roomNumber?: number;
  totalRooms?: number;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  roomType,
  roomNumber = 1,
  totalRooms = 1,
}) => {
  const [details, setDetails] = useState<RoomDetails>({
    size: '',
    accessories: [],
    falseCeiling: false,
    loft: false,
    additionalNotes: '',
  });

  const getAccessories = (type: string): Accessory[] => {
    const baseAccessories = {
      livingRoom: [
        { id: 'tvUnit', name: 'TV Unit', quantity: 0, price: 30000 },
        { id: 'sofaSet', name: 'Sofa Set', quantity: 0, price: 50000 },
        { id: 'centerTable', name: 'Center Table', quantity: 0, price: 15000 },
        { id: 'shoeRack', name: 'Shoe Rack', quantity: 0, price: 10000 },
        { id: 'poojaUnit', name: 'Pooja Unit', quantity: 0, price: 20000 },
      ],
      bedroom: [
        { id: 'wardrobe', name: 'Wardrobe', quantity: 0, price: 35000 },
        { id: 'bed', name: 'Bed', quantity: 0, price: 40000 },
        { id: 'studyTable', name: 'Study Table', quantity: 0, price: 25000 },
        { id: 'sideTable', name: 'Side Table', quantity: 0, price: 8000 },
        { id: 'tvUnit', name: 'TV Unit', quantity: 0, price: 20000 },
      ],
      kitchen: [
        { id: 'cabinets', name: 'Cabinets', quantity: 0, price: 80000 },
        { id: 'countertop', name: 'Countertop', quantity: 0, price: 50000 },
        { id: 'appliances', name: 'Appliances', quantity: 0, price: 70000 },
        { id: 'sink', name: 'Sink', quantity: 0, price: 15000 },
        { id: 'storage', name: 'Storage Units', quantity: 0, price: 25000 },
      ],
      bathroom: [
        { id: 'vanity', name: 'Vanity Unit', quantity: 0, price: 25000 },
        { id: 'shower', name: 'Shower Cubicle', quantity: 0, price: 20000 },
        { id: 'storage', name: 'Storage', quantity: 0, price: 15000 },
        { id: 'mirror', name: 'Mirror', quantity: 0, price: 8000 },
      ],
      kidsRoom: [
        { id: 'bed', name: 'Bed', quantity: 0, price: 35000 },
        { id: 'studyTable', name: 'Study Table', quantity: 0, price: 25000 },
        { id: 'storage', name: 'Toy Storage', quantity: 0, price: 20000 },
        { id: 'playArea', name: 'Play Area', quantity: 0, price: 30000 },
      ],
    };

    return baseAccessories[type as keyof typeof baseAccessories] || [];
  };

  const handleQuantityChange = (accessoryId: string, change: number) => {
    setDetails(prev => ({
      ...prev,
      accessories: prev.accessories.map(acc =>
        acc.id === accessoryId
          ? { ...acc, quantity: Math.max(0, acc.quantity + change) }
          : acc
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(details);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full overflow-y-auto max-h-[80vh] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#00423D] text-center">
            {roomType} {totalRooms > 1 ? `#${roomNumber}` : ''} Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Room Size (sq. ft.)</label>
              <input
                type="number"
                value={details.size}
                onChange={(e) => setDetails(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent transition duration-300"
                placeholder="Enter room size"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Additional Notes</label>
              <textarea
                value={details.additionalNotes}
                onChange={(e) => setDetails(prev => ({ ...prev, additionalNotes: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent transition duration-300"
                rows={3}
                placeholder="Any specific requirements for this room..."
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Required Accessories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getAccessories(roomType).map((accessory) => (
                <label key={accessory.name} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#00423D] transition duration-300 shadow-sm">
                  <input
                    type="checkbox"
                    checked={details.accessories?.some(a => a.name === accessory.name) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDetails(prev => ({
                          ...prev,
                          accessories: [...prev.accessories, accessory],
                        }));
                      } else {
                        setDetails(prev => ({
                          ...prev,
                          accessories: prev.accessories.filter(a => a.name !== accessory.name),
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#00423D] focus:ring-[#00423D]"
                  />
                  <span className="text-gray-700">{accessory.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={details.falseCeiling}
                onChange={(e) => setDetails(prev => ({ ...prev, falseCeiling: e.target.checked }))}
                className="rounded border-gray-300 text-[#00423D] focus:ring-[#00423D]"
              />
              <span className="text-gray-700">False Ceiling</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={details.loft}
                onChange={(e) => setDetails(prev => ({ ...prev, loft: e.target.checked }))}
                className="rounded border-gray-300 text-[#00423D] focus:ring-[#00423D]"
              />
              <span className="text-gray-700">Loft</span>
            </div>
          </div>
          <div className="flex justify-between pt-4 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
            >
              Save Details
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal; 