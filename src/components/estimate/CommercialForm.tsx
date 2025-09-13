"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

interface CommercialFormProps {
  onSubmit: (data: CommercialFormData) => void;
}

export interface CommercialFormData {
  projectType: string;
  projectName: string;
  location: string;
  details: string;
  timeline: string;
  clientName: string;
  phone: string;
  email: string;
  additionalNotes: string;
  projectArea: string;
}

const CommercialForm: React.FC<CommercialFormProps> = ({ onSubmit }) => {

  const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

  const [formData, setFormData] = useState<CommercialFormData>({
    projectType: '',
    projectName: '',
    location: '',
    details: '',
    timeline: '',
    clientName: '',
    phone: '',
    email: '',
    additionalNotes: '',
    projectArea: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.form
     onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-semibold text-[#00423D] mb-6">Commercial Project Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Type */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Project Type</label>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
              required
            >
              <option value="">Select Project Type</option>
              <option value="office">Office Space</option>
              <option value="retail">Retail Store</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="education">Educational Institution</option>
              <option value="healthcare">Healthcare Facility</option>
              <option value="showroom">Showrooms</option>
              <option value="sport">Sports Facility</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Project Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
            placeholder="Enter project name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Project Area (sq.ft)</label>
          <input
            type="number"
            name="projectArea"
            value={formData.projectArea}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
            placeholder="Enter total project area in sq.ft"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 mb-2">Location</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
              required
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Project Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
            required
          />
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-gray-700 mb-2">Timeline</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
              required
            >
              <option value="">Select Timeline</option>
              <option value="1-3 Months">1-3 Months</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="6-12 Months">6-12 Months</option>
              <option value="12+ Months">12+ Months</option>
            </select>
          </div>
        </div>

        {/* Client Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-[#00423D] mb-4">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Additional Notes</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-8 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
        >
          Submit Project
        </motion.button>
      </div>
    </motion.form>
  );
};

export default CommercialForm; 