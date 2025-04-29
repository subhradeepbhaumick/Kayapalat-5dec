'use client';

import React from 'react';
import { FaSearch, FaDownload, FaTimes } from 'react-icons/fa';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface Estimation {
  id: string;
  name: string;
  email: string;
  contact: string;
  propertyType: string;
  date: string;
  priceRange: {
    low: number;
    high: number;
  };
  details: {
    rooms: {
      livingRoom: boolean;
      bedroom: boolean;
      kitchen: boolean;
      bathroom: boolean;
      kidsRoom: boolean;
      falseCeiling: boolean;
    };
    additionalRequirements: string;
    timeline: string;
  };
}

export default function EstimationsPage() {
  const [selectedEstimation, setSelectedEstimation] = React.useState<Estimation | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  // Temporary mock data - replace with actual data fetching
  const estimations: Estimation[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      contact: '+91 9876543210',
      propertyType: 'Residential',
      date: '2024-02-20',
      priceRange: {
        low: 500000,
        high: 700000
      },
      details: {
        rooms: {
          livingRoom: true,
          bedroom: true,
          kitchen: true,
          bathroom: true,
          kidsRoom: false,
          falseCeiling: true
        },
        additionalRequirements: 'Modern design with minimal furniture',
        timeline: '2-4 months'
      }
    },
    // Add more mock data as needed
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getRoomsList = (rooms: Estimation['details']['rooms']) => {
    return Object.entries(rooms)
      .filter(([_, selected]) => selected)
      .map(([room]) => room.replace(/([A-Z])/g, ' $1').trim())
      .join(', ');
  };

  const filteredEstimations = estimations.filter(estimation => {
    const matchesSearch = 
      estimation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimation.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimation.propertyType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      estimation.propertyType.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    // TODO: Implement CSV export
    console.log('Exporting to CSV...');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#00423D]" style={{ WebkitTextStroke: '1px black' }}>
            Manage Estimates
          </h1>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-[#00423D] text-white px-4 py-2 rounded-lg hover:bg-[#00332D] transition duration-300"
          >
            <FaDownload />
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search estimates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D]"
            >
              <option value="all">All Properties</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range (₹)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overview
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEstimations.length > 0 ? (
                  filteredEstimations.map((estimation) => (
                    <tr key={estimation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{estimation.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{estimation.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{estimation.contact}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{estimation.propertyType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(estimation.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(estimation.priceRange.low)} - {formatPrice(estimation.priceRange.high)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedEstimation(estimation)}
                          className="hover:bg-[#D7E7D0] hover:text-[#295A47] cursor-pointer"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No estimates found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedEstimation} onOpenChange={() => setSelectedEstimation(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#295A47]">Estimation Details</DialogTitle>
          </DialogHeader>
          {selectedEstimation && (
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Client Details</h4>
                  <p className="mt-1"><span className="font-medium">Name:</span> {selectedEstimation.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedEstimation.email}</p>
                  <p><span className="font-medium">Contact:</span> {selectedEstimation.contact}</p>
                  <p><span className="font-medium">Property Type:</span> {selectedEstimation.propertyType}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Project Details</h4>
                  <p className="mt-1"><span className="font-medium">Timeline:</span> {selectedEstimation.details.timeline}</p>
                  <p><span className="font-medium">Price Range:</span> {formatPrice(selectedEstimation.priceRange.low)} - {formatPrice(selectedEstimation.priceRange.high)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-500">Selected Rooms</h4>
                <p className="mt-1">{getRoomsList(selectedEstimation.details.rooms)}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-500">Additional Requirements</h4>
                <p className="mt-1">{selectedEstimation.details.additionalRequirements || 'None specified'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}