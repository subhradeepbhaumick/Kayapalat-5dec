'use client';

import React, { useState, useEffect } from 'react';
import { FaHome, FaBed, FaBath, FaUtensils, FaCouch, FaChild, FaLightbulb, FaCheck, FaTimes, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RoomDetails {
  size: string;
  accessories: string[];
  falseCeiling: boolean;
  additionalNotes: string;
}

interface RoomConfig {
  base: number;
  accessories: {
    [key: string]: number;
  };
  falseCeiling: number;
}

// Base costs for different room types (in INR)
const ROOM_COSTS: { [key: string]: RoomConfig } = {
  livingRoom: {
    base: 150000,
    accessories: {
      sofaSet: 50000,
      tvUnit: 30000,
      centerTable: 15000,
    },
    falseCeiling: 25000,
  },
  bedroom: {
    base: 120000,
    accessories: {
      bed: 40000,
      wardrobe: 35000,
      dressingTable: 25000,
    },
    falseCeiling: 20000,
  },
  kitchen: {
    base: 200000,
    accessories: {
      cabinets: 80000,
      countertop: 50000,
      appliances: 70000,
    },
    falseCeiling: 30000,
  },
  bathroom: {
    base: 80000,
    accessories: {
      vanity: 25000,
      shower: 20000,
      storage: 15000,
    },
    falseCeiling: 15000,
  },
  kidsRoom: {
    base: 100000,
    accessories: {
      bed: 35000,
      studyTable: 25000,
      storage: 20000,
    },
    falseCeiling: 20000,
  },
  falseCeiling: {
    base: 50000,
    accessories: {},
    falseCeiling: 0,
  },
};

const EstimateCost = () => {
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<keyof typeof formData.rooms | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [roomDetails, setRoomDetails] = useState<{ [key: string]: RoomDetails }>({});
  const [formData, setFormData] = useState({
    propertyType: '',
    bhkType: '',
    rooms: {
      livingRoom: false,
      bedroom: false,
      kitchen: false,
      bathroom: false,
      dining: false,
    },
    name: '',
    email: '',
    phone: '',
    address: '',
    budgetRange: '',
    timeline: '',
    additionalRequirements: '',
  });

  const [estimate, setEstimate] = useState<{
    amount: number;
    breakdown: {
      baseCost: number;
      areaMultiplier: number;
      propertyMultiplier: number;
      buffer: string;
      roomBreakdown: {
        [key: string]: number;
      };
    };
  } | null>(null);

  const steps = [
    { id: 1, title: 'BHK Type' },
    { id: 2, title: 'Room Selection' },
    { id: 3, title: 'Project Details' },
    { id: 4, title: 'Personal Info' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomToggle = (room: keyof typeof formData.rooms) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleRoomDetailsSubmit = (details: RoomDetails) => {
    if (selectedRoom) {
      setRoomDetails(prev => ({
        ...prev,
        [selectedRoom]: details
      }));
      setFormData(prev => ({
        ...prev,
        rooms: {
          ...prev.rooms,
          [selectedRoom]: true
        }
      }));
    }
    setShowRoomModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all personal information fields');
      return;
    }

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rooms: formData.rooms,
          roomDetails,
          propertyType: formData.propertyType,
          bhkType: formData.bhkType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEstimate({
          amount: data.estimate,
          breakdown: data.breakdown,
        });
      } else {
        alert('Failed to calculate estimate. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D2EBD0] to-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#00423D] mb-4">
            Get Your Project Estimate
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to receive a detailed cost estimate for your interior design project
          </p>
        </div>

        {/* Progress Steps with connecting lines */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {/* Base line that runs through all steps */}
            <div className="absolute left-6 right-6 top-6 h-1 bg-gray-200" />
            
            {/* Progress line that fills based on current step */}
            <div 
              className="absolute top-6 h-1 bg-[#00423D] transition-all duration-500 ease-in-out"
              style={{
                left: '24px',
                right: `${100 - (((currentStep - 1) / (steps.length - 1)) * 100)}%`,
              }}
            />
            
            {/* Steps */}
            {steps.map((step, index) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                {/* Circle with number or check */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    currentStep >= step.id
                      ? 'border-[#00423D] bg-[#00423D] text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? <FaCheck className="text-lg" /> : step.id}
                </div>

                {/* Step Title */}
                <span className={`mt-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-[#00423D]' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Initial Property Type Modal */}
        <Dialog open={showPropertyTypeModal} onOpenChange={setShowPropertyTypeModal}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-[#00423D] text-center">
                Select Property Type
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, propertyType: 'residential' }));
                  setShowPropertyTypeModal(false);
                }}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#00423D] hover:bg-[#F0F9F0] transition-all duration-300 flex flex-col items-center space-y-3"
              >
                <FaHome className="text-3xl text-[#00423D]" />
                <span className="font-medium">Residential</span>
              </button>
              <button
                onClick={() => alert('Coming soon!')}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#00423D] opacity-50 transition-all duration-300 flex flex-col items-center space-y-3"
              >
                <FaBuilding className="text-3xl text-[#00423D]" />
                <span className="font-medium">Commercial</span>
              </button>
              <button
                onClick={() => alert('Coming soon!')}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#00423D] opacity-50 transition-all duration-300 flex flex-col items-center space-y-3"
              >
                <FaBriefcase className="text-3xl text-[#00423D]" />
                <span className="font-medium">Office</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {estimate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-[#00423D] mb-4">Your Estimate</h2>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-[#00423D]">
                ₹{estimate?.amount?.toLocaleString() || '0'}
              </p>
              <p className="text-gray-600 mt-2">Total Estimated Cost</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#00423D] mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Cost:</span>
                    <span>₹{estimate?.breakdown?.baseCost?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area Multiplier:</span>
                    <span>{estimate?.breakdown?.areaMultiplier || '0'}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Property Type Multiplier:</span>
                    <span>{estimate?.breakdown?.propertyMultiplier || '0'}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contingency Buffer:</span>
                    <span>{estimate?.breakdown?.buffer || '0%'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#00423D] mb-4">Room-wise Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(estimate?.breakdown?.roomBreakdown || {}).map(([room, cost]) => (
                    <div key={room} className="flex justify-between">
                      <span className="capitalize">{room.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span>₹{Number(cost)?.toLocaleString() || '0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setEstimate(null)}
                className="bg-[#00423D] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#00332D] transition duration-300"
              >
                Calculate New Estimate
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
          >
            {/* Step 1: BHK Type */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-[#00423D] mb-2">Select your BHK type</h2>
                  <p className="text-gray-600">To know more about this, 
                    <button onClick={() => setShowInfoModal(true)} className="text-[#00423D] hover:underline ml-1">
                      click here
                    </button>
                  </p>
                </div>
                <div className="space-y-4">
                  {['1', '2', '3', '4', '5'].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          bhkType: bhk,
                          propertyType: 'residential'
                        }));
                      }}
                      className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all duration-300 ${
                        formData.bhkType === bhk
                          ? 'border-[#00423D] bg-[#F0F9F0]'
                          : 'border-gray-200 hover:border-[#00423D] hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg font-medium">{bhk} BHK</span>
                      {formData.bhkType === bhk && <FaCheck className="text-[#00423D]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Room Selection */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-[#00423D] mb-2">Select rooms to design</h2>
                  <p className="text-gray-600">To know more about this, 
                    <button onClick={() => setShowInfoModal(true)} className="text-[#00423D] hover:underline ml-1">
                      click here
                    </button>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.rooms).map(([room, isSelected]) => (
                    <div key={room} className="relative">
                      <button
                        type="button"
                        onClick={() => handleRoomToggle(room as keyof typeof formData.rooms)}
                        className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${
                          isSelected
                            ? 'border-[#00423D] bg-[#F0F9F0]'
                            : 'border-gray-200 hover:border-[#00423D] hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {room === 'livingRoom' && <FaCouch className="text-2xl text-[#00423D]" />}
                          {room === 'bedroom' && <FaBed className="text-2xl text-[#00423D]" />}
                          {room === 'kitchen' && <FaUtensils className="text-2xl text-[#00423D]" />}
                          {room === 'bathroom' && <FaBath className="text-2xl text-[#00423D]" />}
                          {room === 'dining' && <FaUtensils className="text-2xl text-[#00423D]" />}
                          <div className="text-left">
                            <span className="font-medium">{room.replace(/([A-Z])/g, ' $1').trim()}</span>
                            {roomDetails[room] && (
                              <p className="text-sm text-gray-500">Details Added</p>
                            )}
                          </div>
                        </div>
                        {isSelected && <FaCheck className="text-[#00423D]" />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Project Details */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-[#00423D]">Project Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Budget Range</label>
                    <select
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                      required
                    >
                      <option value="">Select Budget Range</option>
                      <option value="0-5">Under ₹5 Lakhs</option>
                      <option value="5-10">₹5-10 Lakhs</option>
                      <option value="10-20">₹10-20 Lakhs</option>
                      <option value="20+">Above ₹20 Lakhs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Project Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                      required
                    >
                      <option value="">Select Timeline</option>
                      <option value="1-2">1-2 Months</option>
                      <option value="2-4">2-4 Months</option>
                      <option value="4-6">4-6 Months</option>
                      <option value="6+">6+ Months</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Additional Requirements</label>
                  <textarea
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                    rows={4}
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Personal Information */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-[#00423D]">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300 font-medium"
                >
                  Back
                </button>
              )}
              <button
                type={currentStep === steps.length ? 'submit' : 'button'}
                onClick={currentStep === steps.length ? undefined : nextStep}
                className="ml-auto px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
              >
                {currentStep === steps.length ? 'Get My Estimate' : 'Next'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Room Details Modal */}
        <Dialog open={showRoomModal} onOpenChange={setShowRoomModal}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-[#00423D]">
                {selectedRoom ? selectedRoom.replace(/([A-Z])/g, ' $1').trim() : ''} Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Room Size (sq. ft.)</label>
                <input
                  type="number"
                  value={roomDetails[selectedRoom || '']?.size || ''}
                  onChange={(e) => {
                    if (selectedRoom) {
                      const newDetails = {
                        ...roomDetails[selectedRoom],
                        size: e.target.value
                      };
                      // Uncheck room if size is empty
                      if (!e.target.value) {
                        setFormData(prev => ({
                          ...prev,
                          rooms: {
                            ...prev.rooms,
                            [selectedRoom]: false
                          }
                        }));
                      }
                      setRoomDetails(prev => ({
                        ...prev,
                        [selectedRoom]: newDetails
                      }));
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent transition duration-300"
                  placeholder="Enter room size"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Required Accessories</label>
                <div className="grid grid-cols-2 gap-4">
                  {selectedRoom && getRoomAccessories(selectedRoom).map((accessory) => (
                    <label key={accessory} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#00423D] transition duration-300">
                      <input
                        type="checkbox"
                        checked={roomDetails[selectedRoom]?.accessories?.includes(accessory) || false}
                        onChange={(e) => {
                          if (selectedRoom) {
                            const currentAccessories = roomDetails[selectedRoom]?.accessories || [];
                            setRoomDetails(prev => ({
                              ...prev,
                              [selectedRoom]: {
                                ...prev[selectedRoom],
                                accessories: e.target.checked
                                  ? [...currentAccessories, accessory]
                                  : currentAccessories.filter(a => a !== accessory)
                              }
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-[#00423D] focus:ring-[#00423D]"
                      />
                      <span className="text-gray-700">{accessory.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Additional Notes</label>
                <textarea
                  value={roomDetails[selectedRoom || '']?.additionalNotes || ''}
                  onChange={(e) => {
                    if (selectedRoom) {
                      setRoomDetails(prev => ({
                        ...prev,
                        [selectedRoom]: {
                          ...prev[selectedRoom],
                          additionalNotes: e.target.value
                        }
                      }));
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D] focus:border-transparent transition duration-300"
                  rows={3}
                  placeholder="Any specific requirements for this room..."
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  if (selectedRoom) {
                    setFormData(prev => ({
                      ...prev,
                      rooms: {
                        ...prev.rooms,
                        [selectedRoom]: false
                      }
                    }));
                    setRoomDetails(prev => {
                      const newDetails = { ...prev };
                      delete newDetails[selectedRoom];
                      return newDetails;
                    });
                  }
                  setShowRoomModal(false);
                }}
                className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 font-medium"
              >
                Remove Room
              </button>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-6 py-3 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedRoom) {
                      if (!roomDetails[selectedRoom]?.size) {
                        alert('Please enter room size');
                        return;
                      }
                      setFormData(prev => ({
                        ...prev,
                        rooms: {
                          ...prev.rooms,
                          [selectedRoom]: true
                        }
                      }));
                      setShowRoomModal(false);
                    }
                  }}
                  className="px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
                >
                  Save Details
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Info Modal */}
        <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-[#00423D]">
                What's included
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium text-[#00423D]">Living room:</h3>
                <p className="text-gray-600">TV unit, false ceiling, shoe rack sofa, coffee table, wallpapers, curtains and pooja unit.</p>
              </div>
              <div>
                <h3 className="font-medium text-[#00423D]">Kitchen:</h3>
                <p className="text-gray-600">Modular kitchen, loft, countertop, appliances, tiling and utility.</p>
              </div>
              <div>
                <h3 className="font-medium text-[#00423D]">Bedroom:</h3>
                <p className="text-gray-600">2-door wardrobe, loft, false ceiling, tv unit, study unit, bed, side table, mattress and wooden flooring.</p>
              </div>
              <div>
                <h3 className="font-medium text-[#00423D]">Bathroom:</h3>
                <p className="text-gray-600">Vanity, tiling and shower cubicle</p>
              </div>
              <div>
                <h3 className="font-medium text-[#00423D]">Dining:</h3>
                <p className="text-gray-600">Crockery unit, dining table with chairs and false ceiling.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Helper function to get room accessories
const getRoomAccessories = (room: string) => {
  switch (room) {
    case 'livingRoom':
      return ['TV Unit', 'False Ceiling', 'Shoe Rack', 'Sofa', 'Coffee Table', 'Wallpapers', 'Curtains', 'Pooja Unit'];
    case 'kitchen':
      return ['Modular Kitchen', 'Loft', 'Countertop', 'Appliances', 'Tiling', 'Utility'];
    case 'bedroom':
      return ['2-Door Wardrobe', 'Loft', 'False Ceiling', 'TV Unit', 'Study Unit', 'Bed', 'Side Table', 'Mattress', 'Wooden Flooring'];
    case 'bathroom':
      return ['Vanity', 'Tiling', 'Shower Cubicle'];
    case 'dining':
      return ['Crockery Unit', 'Dining Table', 'Chairs', 'False Ceiling'];
    default:
      return [];
  }
};

export default EstimateCost;