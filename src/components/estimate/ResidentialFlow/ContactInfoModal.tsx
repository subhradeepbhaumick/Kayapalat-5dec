"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactInfoModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit: (data: ContactInfo) => void;
  mode?: 'card' | 'modal';
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  additionalNotes: string;
}

const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  isOpen = false,
  onClose = () => {},
  onSubmit,
  mode = 'modal',
}) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    additionalNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contactInfo);
  };

  const handleCardSubmit = () => {
    onSubmit(contactInfo);
  };

  const content = (
    <div className="w-full max-w-2xl bg-white/95 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-[#00423D] text-left mb-6">Contact Information</h2>
      {mode === 'card' ? (
        <div className="space-y-6 py-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={contactInfo.name}
                onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Additional Notes */}
          <div>
            <label className="block text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={contactInfo.additionalNotes}
              onChange={(e) => setContactInfo(prev => ({ ...prev, additionalNotes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
              placeholder="Any additional information you'd like to share..."
            />
          </div>
          {/* Info Box */}
          <div className="p-4 bg-[#F0F9F0] rounded-lg">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-[#00423D] mt-1" />
              <div>
                <h4 className="font-medium text-[#00423D] mb-1">Privacy Notice</h4>
                <p className="text-sm text-gray-600">
                  Your contact information will be used solely for project communication and
                  estimation purposes. We respect your privacy and will never share your
                  information with third parties.
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300 font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleCardSubmit}
              className="px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
            >
              Get Estimate
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={contactInfo.name}
                onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
                required
              />
            </div>
          </div>
          {/* Additional Notes */}
          <div>
            <label className="block text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={contactInfo.additionalNotes}
              onChange={(e) => setContactInfo(prev => ({ ...prev, additionalNotes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
              placeholder="Any additional information you'd like to share..."
            />
          </div>
          {/* Info Box */}
          <div className="p-4 bg-[#F0F9F0] rounded-lg">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-[#00423D] mt-1" />
              <div>
                <h4 className="font-medium text-[#00423D] mb-1">Privacy Notice</h4>
                <p className="text-sm text-gray-600">
                  Your contact information will be used solely for project communication and
                  estimation purposes. We respect your privacy and will never share your
                  information with third parties.
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300 font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
            >
              Get Estimate
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (mode === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#00423D] text-center">
              Contact Information
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }
  // Card mode
  return content;
};

export default ContactInfoModal; 