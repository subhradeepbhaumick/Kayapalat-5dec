import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BHKInfoProps {
  isOpen: boolean;
  onClose: () => void;
  bhkType: string;
}

const BHKInfo: React.FC<BHKInfoProps> = ({ isOpen, onClose, bhkType }) => {
  const getBHKDetails = (type: string) => {
    const details: { [key: string]: string[] } = {
      '1bhk': ['1 Bedroom', '1 Living Room', '1 Kitchen', '1 Bathroom'],
      '2bhk': ['2 Bedrooms', '1 Living Room', '1 Kitchen', '2 Bathrooms'],
      '3bhk': ['3 Bedrooms', '1 Living Room', '1 Kitchen', '2 Bathrooms'],
      '4bhk': ['4 Bedrooms', '1 Living Room', '1 Kitchen', '3 Bathrooms'],
      '5bhk': ['5 Bedrooms', '1 Living Room', '1 Kitchen', '3 Bathrooms'],
    };
    return details[type] || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#00423D] text-center">
            {bhkType.toUpperCase()} Details
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-4">
            {getBHKDetails(bhkType.toLowerCase()).map((detail, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#00423D] rounded-full" />
                <span className="text-gray-700">{detail}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BHKInfo; 