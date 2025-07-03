"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaBuilding, FaTimes } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay
} from "@/components/ui/dialog";

interface ProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'residential' | 'commercial') => void;
}

const ProjectTypeModal: React.FC<ProjectTypeModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 backdrop-blur" />
      <DialogContent
        className="max-w-2xl bg-white/95"
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold text-[#00423D]">
              Select Project Type
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('residential')}
            className="group p-8 rounded-xl border-2 border-gray-200 hover:border-[#00423D] hover:bg-[#F0F9F0] transition-all duration-300 flex flex-col items-center space-y-4"
          >
            <div className="p-4 bg-[#00423D]/10 rounded-full group-hover:bg-[#00423D]/20 transition-colors">
              <FaHome className="text-4xl text-[#00423D]" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#00423D] mb-2">Residential</h3>
              <p className="text-gray-600">Perfect for homes, apartments, and villas</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('commercial')}
            className="group p-8 rounded-xl border-2 border-gray-200 hover:border-[#00423D] hover:bg-[#F0F9F0] transition-all duration-300 flex flex-col items-center space-y-4"
          >
            <div className="p-4 bg-[#00423D]/10 rounded-full group-hover:bg-[#00423D]/20 transition-colors">
              <FaBuilding className="text-4xl text-[#00423D]" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#00423D] mb-2">Commercial</h3>
              <p className="text-gray-600">Ideal for offices, retail spaces, and restaurants</p>
            </div>
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectTypeModal; 