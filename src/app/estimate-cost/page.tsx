'use client';

import React, { useState } from 'react';
import { FaHome, FaBed, FaBath, FaUtensils, FaCouch, FaChild, FaLightbulb } from 'react-icons/fa';

const EstimateCost = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: 'residential',
    totalArea: '',
    rooms: {
      livingRoom: false,
      bedroom: false,
      kitchen: false,
      bathroom: false,
      kidsRoom: false,
      falseCeiling: false,
    },
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
    };
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomToggle = (room: keyof typeof formData.rooms) => {
    setFormData(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [room]: !prev.rooms[room]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rooms: formData.rooms,
          totalArea: Number(formData.totalArea),
          propertyType: formData.propertyType,
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

  return (
    <div className="min-h-screen bg-[#D2EBD0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#00423D] mb-4" style={{ WebkitTextStroke: '1px black' }}>
            Get Your Project Estimate
          </h1>
          <p className="text-lg text-gray-700">
            Fill out the form below to receive a detailed cost estimate for your interior design project
          </p>
        </div>

        {estimate ? (
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#00423D] mb-4">Your Estimate</h2>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-[#00423D]">
                ₹{estimate.amount.toLocaleString()}
              </p>
              <p className="text-gray-600 mt-2">Total Estimated Cost</p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-[#00423D] mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Cost:</span>
                  <span>₹{estimate.breakdown.baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Area Multiplier:</span>
                  <span>{estimate.breakdown.areaMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Type Multiplier:</span>
                  <span>{estimate.breakdown.propertyMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Contingency Buffer:</span>
                  <span>{estimate.breakdown.buffer}</span>
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
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#00423D] mb-4">Personal Information</h2>
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
            </div>

            {/* Property Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#00423D] mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Total Area (sq. ft.)</label>
                  <input
                    type="number"
                    name="totalArea"
                    value={formData.totalArea}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Room Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#00423D] mb-4">Select Rooms to Design</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoomToggle('livingRoom')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                    formData.rooms.livingRoom ? 'border-[#00423D] bg-[#E8F5E9]' : 'border-gray-300'
                  }`}
                >
                  <FaCouch className="text-2xl text-[#00423D] mb-2" />
                  <span>Living Room</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoomToggle('bedroom')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                    formData.rooms.bedroom ? 'border-[#00423D] bg-[#E8F5E9]' : 'border-gray-300'
                  }`}
                >
                  <FaBed className="text-2xl text-[#00423D] mb-2" />
                  <span>Bedroom</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoomToggle('kitchen')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                    formData.rooms.kitchen ? 'border-[#00423D] bg-[#E8F5E9]' : 'border-gray-300'
                  }`}
                >
                  <FaUtensils className="text-2xl text-[#00423D] mb-2" />
                  <span>Kitchen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoomToggle('bathroom')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                    formData.rooms.bathroom ? 'border-[#00423D] bg-[#E8F5E9]' : 'border-gray-300'
                  }`}
                >
                  <FaBath className="text-2xl text-[#00423D] mb-2" />
                  <span>Bathroom</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoomToggle('kidsRoom')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                    formData.rooms.kidsRoom ? 'border-[#00423D] bg-[#E8F5E9]' : 'border-gray-300'
                  }`}
                >
                  <FaChild className="text-2xl text-[#00423D] mb-2" />
                  <span>Kids Room</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoomToggle('falseCeiling')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                    formData.rooms.falseCeiling ? 'border-[#00423D] bg-[#E8F5E9]' : 'border-gray-300'
                  }`}
                >
                  <FaLightbulb className="text-2xl text-[#00423D] mb-2" />
                  <span>False Ceiling</span>
                </button>
              </div>
            </div>

            {/* Budget and Timeline */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#00423D] mb-4">Project Details</h2>
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
            </div>

            {/* Additional Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#00423D] mb-4">Additional Requirements</h2>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                rows={4}
                placeholder="Any specific requirements or preferences..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#00423D] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#00332D] transition duration-300"
              >
                Get Estimate
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EstimateCost;