import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBed, FaTv, FaChair, FaDoorOpen, FaWindowMaximize } from 'react-icons/fa';
import { MdOutlineTableBar } from 'react-icons/md';
import { GiKitchenScale, GiWashingMachine } from 'react-icons/gi';
import { BsLightbulb } from 'react-icons/bs';

interface RoomDetails {
  size: string;
  accessories: string[];
  falseCeiling: boolean;
  isKidsRoom?: boolean;
}

interface RoomDetailsFormProps {
  roomType: string;
  totalRooms: number;
  onComplete: (details: { [key: string]: RoomDetails }) => void;
  onClose: () => void;
}

const RoomDetailsForm: React.FC<RoomDetailsFormProps> = ({
  roomType,
  totalRooms,
  onComplete,
  onClose,
}) => {
  const [currentRoom, setCurrentRoom] = useState(1);
  const [roomDetails, setRoomDetails] = useState<{ [key: string]: RoomDetails }>({});
  const [isKidsRoom, setIsKidsRoom] = useState(false);

  const getAccessories = (type: string, isKids: boolean = false) => {
    const baseAccessories = {
      bedroom: [
        { id: 'bed', label: 'Bed', icon: FaBed },
        { id: 'wardrobe', label: 'Wardrobe', icon: FaDoorOpen },
        { id: 'tv', label: 'TV Unit', icon: FaTv },
        { id: 'study', label: 'Study Table', icon: MdOutlineTableBar },
        { id: 'lighting', label: 'Lighting', icon: BsLightbulb },
      ],
      livingRoom: [
        { id: 'sofa', label: 'Sofa Set', icon: FaChair },
        { id: 'tv', label: 'TV Unit', icon: FaTv },
        { id: 'centerTable', label: 'Center Table', icon: MdOutlineTableBar },
        { id: 'lighting', label: 'Lighting', icon: BsLightbulb },
      ],
      kitchen: [
        { id: 'cabinets', label: 'Cabinets', icon: FaDoorOpen },
        { id: 'countertop', label: 'Countertop', icon: MdOutlineTableBar },
        { id: 'appliances', label: 'Appliances', icon: GiKitchenScale },
        { id: 'washing', label: 'Washing Area', icon: GiWashingMachine },
      ],
      dining: [
        { id: 'table', label: 'Dining Table', icon: MdOutlineTableBar },
        { id: 'chairs', label: 'Chairs', icon: FaChair },
        { id: 'storage', label: 'Storage Unit', icon: FaDoorOpen },
        { id: 'lighting', label: 'Lighting', icon: BsLightbulb },
      ],
    };

    const kidsAccessories = [
      { id: 'playArea', label: 'Play Area', icon: FaChair },
      { id: 'storage', label: 'Toy Storage', icon: FaDoorOpen },
      { id: 'study', label: 'Study Corner', icon: MdOutlineTableBar },
    ];

    return isKids ? [...baseAccessories[type as keyof typeof baseAccessories], ...kidsAccessories] : baseAccessories[type as keyof typeof baseAccessories];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const details: RoomDetails = {
      size: formData.get('size') as string,
      accessories: formData.getAll('accessories') as string[],
      falseCeiling: formData.get('falseCeiling') === 'true',
      isKidsRoom: isKidsRoom,
    };

    setRoomDetails(prev => ({
      ...prev,
      [`${roomType}${currentRoom}`]: details,
    }));

    if (currentRoom < totalRooms) {
      setCurrentRoom(prev => prev + 1);
    } else {
      onComplete(roomDetails);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-[#00423D] mb-4">
          {roomType} {currentRoom} Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Room Size (sq.ft)</label>
            <input
              type="number"
              name="size"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
            />
          </div>

          {roomType === 'bedroom' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="kidsRoom"
                checked={isKidsRoom}
                onChange={(e) => setIsKidsRoom(e.target.checked)}
                className="rounded border-gray-300 text-[#00423D] focus:ring-[#00423D]"
              />
              <label htmlFor="kidsRoom" className="text-gray-700">Kids Room</label>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Accessories</label>
            <div className="grid grid-cols-2 gap-3">
              {getAccessories(roomType, isKidsRoom).map((accessory) => (
                <label
                  key={accessory.id}
                  className="flex items-center space-x-2 p-2 border rounded-lg hover:border-[#00423D] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="accessories"
                    value={accessory.id}
                    className="rounded border-gray-300 text-[#00423D] focus:ring-[#00423D]"
                  />
                  <accessory.icon className="text-[#00423D]" />
                  <span className="text-gray-700">{accessory.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="falseCeiling"
                value="true"
                className="rounded border-gray-300 text-[#00423D] focus:ring-[#00423D]"
              />
              <span className="text-gray-700">Include False Ceiling</span>
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300"
            >
              {currentRoom < totalRooms ? 'Next Room' : 'Complete'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RoomDetailsForm; 