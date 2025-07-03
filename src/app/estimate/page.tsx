"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProjectTypeModal from '@/components/estimate/ProjectTypeModal';
import CommercialForm from '@/components/estimate/CommercialForm';
import BHKTypeSelector from '@/components/estimate/ResidentialFlow/BHKTypeSelector';
import RoomSelector from '@/components/estimate/ResidentialFlow/RoomSelector';
import RoomDetailsModal from '@/components/estimate/ResidentialFlow/RoomDetailsModal';
import ProjectDetailsForm from '@/components/estimate/ResidentialFlow/ProjectDetailsForm';
import ContactInfoModal from '@/components/estimate/ResidentialFlow/ContactInfoModal';
import EstimateSummary from '@/components/estimate/EstimateSummary';

// Types for database pricing
interface RoomPrice {
  id: number;
  room_type: string;
  base_price: number;
  created_at: string;
  updated_at: string;
}

interface AccessoryPrice {
  id: number;
  accessory_name: string;
  room_type: string;
  price: number;
  created_at: string;
  updated_at: string;
}

interface FeaturePrice {
  id: number;
  feature_name: string;
  price: number;
  applicable_rooms: string; // JSON string of room types
  created_at: string;
  updated_at: string;
}

interface PackageMultiplier {
  id: number;
  package_name: string;
  multiplier: number;
  created_at: string;
  updated_at: string;
}

interface CustomConfig {
  bedrooms: number;
  livingRooms: number;
  kitchens: number;
  bathrooms: number;
}

// BHK configurations - defines how many rooms of each type
const BHK_CONFIGURATIONS = {
  '1BHK': {
    livingRoom: 1,
    bedroom: 1,
    kitchen: 1,
    bathroom: 1,
    dining: 0,
  },
  '2BHK': {
    livingRoom: 1,
    bedroom: 2,
    kitchen: 1,
    bathroom: 2,
    dining: 1,
  },
  '3BHK': {
    livingRoom: 1,
    bedroom: 3,
    kitchen: 1,
    bathroom: 2,
    dining: 1,
  },
  '4BHK': {
    livingRoom: 1,
    bedroom: 4,
    kitchen: 1,
    bathroom: 3,
    dining: 1,
  },
  '5BHK': {
    livingRoom: 1,
    bedroom: 5,
    kitchen: 1,
    bathroom: 3,
    dining: 1,
  },
};

const RES_STEPS = [
  'BHK Type',
  'Room Design',
  'Project Details',
  'Client Info',
  'Estimate',
];

const EstimatePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | null>(null);
  const [showProjectTypeModal, setShowProjectTypeModal] = useState(true);
  const [showBHKSelector, setShowBHKSelector] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showEstimateSummary, setShowEstimateSummary] = useState(false);

  // State for residential flow
  const [selectedBHK, setSelectedBHK] = useState('');
  const [customBHKConfig, setCustomBHKConfig] = useState<CustomConfig | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: boolean }>({});
  
  // Updated room details structure to handle individual room instances
  const [roomDetails, setRoomDetails] = useState<{ [key: string]: any }>({});
  
  const [projectDetails, setProjectDetails] = useState({
    location: '',
    timeline: '',
    selectedPackage: 'essential',
    budget: '',
  });
  const [contactInfo, setContactInfo] = useState<any>(null);

  // State for commercial flow
  const [commercialFormData, setCommercialFormData] = useState<any>(null);

  const [resStep, setResStep] = useState(0); // 0-indexed for residential steps
  const [selectedPackage, setSelectedPackage] = useState('essential');

  // Database pricing state
  const [roomPrices, setRoomPrices] = useState<{ [key: string]: number }>({});
  const [accessoryPrices, setAccessoryPrices] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [featurePrices, setFeaturePrices] = useState<{ [key: string]: number }>({});
  const [packageMultipliers, setPackageMultipliers] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pricing data from database
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        
        // Fetch all pricing data in parallel
        const [roomRes, accessoryRes, featureRes, packageRes] = await Promise.all([
          fetch('/api/pricing/rooms'),
          fetch('/api/pricing/accessories'),
          fetch('/api/pricing/features'),
          fetch('/api/pricing/packages'),
        ]);

        if (!roomRes.ok || !accessoryRes.ok || !featureRes.ok || !packageRes.ok) {
          throw new Error('Failed to fetch pricing data');
        }

        const roomData: RoomPrice[] = await roomRes.json();
        const accessoryData: AccessoryPrice[] = await accessoryRes.json();
        const featureData: FeaturePrice[] = await featureRes.json();
        const packageData: PackageMultiplier[] = await packageRes.json();

        // Process room prices
        const roomPriceMap: { [key: string]: number } = {};
        roomData.forEach(room => {
          roomPriceMap[room.room_type] = room.base_price;
        });
        setRoomPrices(roomPriceMap);

        // Process accessory prices grouped by room type
        const accessoryPriceMap: { [key: string]: { [key: string]: number } } = {};
        accessoryData.forEach(accessory => {
          if (!accessoryPriceMap[accessory.room_type]) {
            accessoryPriceMap[accessory.room_type] = {};
          }
          accessoryPriceMap[accessory.room_type][accessory.accessory_name] = accessory.price;
        });
        setAccessoryPrices(accessoryPriceMap);

        // Process feature prices
        const featurePriceMap: { [key: string]: number } = {};
        featureData.forEach(feature => {
          featurePriceMap[feature.feature_name] = feature.price;
        });
        setFeaturePrices(featurePriceMap);

        // Process package multipliers
        const packageMap: { [key: string]: number } = {};
        packageData.forEach(pkg => {
          packageMap[pkg.package_name] = pkg.multiplier;
        });
        setPackageMultipliers(packageMap);

      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError('Failed to load pricing data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // Get BHK configuration based on selected BHK type
  const getBHKConfiguration = () => {
    if (!selectedBHK) {
      console.log('No selectedBHK, returning empty config');
      return {};
    }
    
    // Handle custom configuration
    if (selectedBHK === 'custom' && customBHKConfig) {
      const customConfig = {
        livingRoom: customBHKConfig.livingRooms,
        bedroom: customBHKConfig.bedrooms,
        kitchen: customBHKConfig.kitchens,
        bathroom: customBHKConfig.bathrooms,
        dining: customBHKConfig.dining,
      };
      console.log('Custom BHK configuration:', customConfig);
      return customConfig;
    }
    
    const config = BHK_CONFIGURATIONS[selectedBHK as keyof typeof BHK_CONFIGURATIONS];
    console.log(`getBHKConfiguration for ${selectedBHK}:`, config);
    return config || {};
  };

  // Handle room selection from RoomSelector
  const handleRoomSelect = (roomKey: string, details: any) => {
    console.log('Room selected:', roomKey, details);
    setRoomDetails(prev => ({
      ...prev,
      [roomKey]: details
    }));
  };

  const calculateTotalEstimate = () => {
    if (projectType === 'residential') {
      let total = 0;
      const breakdown: { [key: string]: number } = {};

      // Calculate costs for each individual room
      Object.entries(roomDetails).forEach(([roomKey, details]) => {
        if (details && details.area) {
          // Extract room type from roomKey (e.g., "bedroom_1" -> "bedroom")
          const roomType = roomKey.split('_')[0];
          const basePrice = roomPrices[roomType] || 0;
          
          breakdown[roomKey] = basePrice;
          total += basePrice;

          // Add accessories costs
          if (details.accessories && details.accessories.length > 0) {
            details.accessories.forEach((acc: string) => {
              const accessoryPrice = accessoryPrices[roomType]?.[acc] || 0;
              breakdown[`${roomKey}_${acc}`] = accessoryPrice;
              total += accessoryPrice;
            });
          }

          // Add feature costs
          if (details.falseCeiling) {
            const falseCeilingPrice = featurePrices['falseCeiling'] || 0;
            breakdown[`${roomKey}_falseCeiling`] = falseCeilingPrice;
            total += falseCeilingPrice;
          }
          if (details.loft) {
            const loftPrice = featurePrices['loft'] || 0;
            breakdown[`${roomKey}_loft`] = loftPrice;
            total += loftPrice;
          }
        }
      });

      // Apply package multiplier
      const packageMultiplier = packageMultipliers[selectedPackage] || 1;
      total *= packageMultiplier;

      return { total, breakdown };
    } else {
      // Commercial project calculation (simplified for now)
      const basePrice = 500000; // This should also come from database
      const areaMultiplier = commercialFormData?.carpetArea ? Math.ceil(commercialFormData.carpetArea / 1000) : 1;
      const total = basePrice * areaMultiplier;
      
      return {
        total,
        breakdown: {
          basePrice,
          areaMultiplier,
        },
      };
    }
  };

  const handleProjectTypeSelect = (type: 'residential' | 'commercial') => {
    setProjectType(type);
    setShowProjectTypeModal(false);
    if (type === 'residential') {
      setResStep(0);
    }
  };

// Update the BHK selection handler to properly store custom config:
const handleBHKSelect = (bhkType: string, customConfig?: CustomConfig) => {
  console.log('BHK selected:', bhkType, 'Custom config:', customConfig);
  setSelectedBHK(bhkType);
  if (customConfig) {
    setCustomBHKConfig(customConfig);
  } else {
    setCustomBHKConfig(null);
  }
  // Don't immediately show room selector here if using stepper
  if (mode === 'modal') {
    setShowBHKSelector(false);
    setShowRoomSelector(true);
  }
};
  const handleRoomDetailsSave = (details: any) => {
    setRoomDetails(prev => ({
      ...prev,
      [details.roomType]: details,
    }));
    setShowRoomDetails(false);
  };

  const handleProjectDetailsSubmit = (details: any) => {
    setProjectDetails(details);
    setShowProjectDetails(false);
    setShowContactInfo(true);
  };

  const handleContactInfoSubmit = (info: any) => {
    setContactInfo(info);
    setShowContactInfo(false);
    
    // Calculate estimate and show summary
    const { total } = calculateTotalEstimate();
    setShowEstimateSummary(true);
  };

  const handleCommercialFormSubmit = (data: any) => {
    setCommercialFormData(data);
    const { total } = calculateTotalEstimate();
    setShowEstimateSummary(true);
  };

  const handleViewBreakdown = () => {
    // Redirect to login page
    router.push('/login?redirect=/dashboard/estimate-breakdown');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Implementation of handleSubmit function
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#D2EBD0] to-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00423D] mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading pricing data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#D2EBD0] to-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug log for current BHK configuration
  console.log('Current selectedBHK:', selectedBHK);
  console.log('Current customBHKConfig:', customBHKConfig);
  console.log('Current BHK config:', getBHKConfiguration());

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D2EBD0] to-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#00423D] mb-4">
            Get Your Project Estimate
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to receive a detailed cost estimate for your interior design project
          </p>
        </div>

        {/* Stepper Timeline for Residential */}
        {projectType === 'residential' && (
          <div className="flex justify-center mb-12">
            {RES_STEPS.map((step, idx) => (
              <React.Fragment key={step}>
                <button
                  type="button"
                  className={`flex flex-col items-center focus:outline-none ${resStep === idx ? 'font-bold text-[#00423D]' : 'text-gray-400'}`}
                  disabled={idx > resStep}
                  onClick={() => {
                    if (idx < resStep) setResStep(idx);
                  }}
                  style={{ background: 'none', border: 'none', cursor: idx <= resStep ? 'pointer' : 'not-allowed' }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${resStep >= idx ? 'border-[#00423D] bg-[#00423D] text-white' : 'border-gray-300 bg-white text-gray-400'}`}>{idx + 1}</div>
                  <span className="mt-2 text-xs">{step}</span>
                </button>
                {idx < RES_STEPS.length - 1 && <div className="w-8 h-1 bg-gray-200 mx-2" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Residential Flow Stepper Cards */}
        {projectType === 'residential' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
          >
            {/* Step 1: BHK Type */}
            {resStep === 0 && (
  <div className="flex w-full">
    <div className="w-1/2 flex flex-col justify-center">
      <BHKTypeSelector
        mode="card"
        onSelect={(bhk, customConfig) => {
          console.log('BHK type selected in step 0:', bhk, 'Custom config:', customConfig);
          setSelectedBHK(bhk);
          if (customConfig) {
            setCustomBHKConfig(customConfig);
          } else {
            setCustomBHKConfig(null);
          }
        }}
        selectedBHK={selectedBHK}
      />
      <div className="flex mt-8">
        <button
          type="button"
          className="ml-auto px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
          onClick={() => {
            if (!selectedBHK) {
              alert('Please select a BHK type.');
              return;
            }
            // Validate custom configuration if custom is selected
            if (selectedBHK === 'custom' && customBHKConfig) {
              const totalRooms = customBHKConfig.bedrooms + customBHKConfig.livingRooms + 
                               customBHKConfig.kitchens + customBHKConfig.bathrooms + 
                               customBHKConfig.dining;
              if (totalRooms === 0) {
                alert('Please configure at least one room in your custom setup.');
                return;
              }
            }
            console.log('Moving to step 1 with selectedBHK:', selectedBHK, 'customConfig:', customBHKConfig);
            setResStep(1);
          }}
        >
          Next
        </button>
      </div>
    </div>
    <div className="w-1/2 flex items-center justify-center">
      {/* Placeholder for future media */}
    </div>
  </div>
)}

// In Step 2 (Room Selection), make sure the RoomSelector gets the correct configuration:
{resStep === 1 && (
  <div className="flex w-full flex-row-reverse">
    <div className="w-1/2 flex flex-col justify-center">
      <RoomSelector
        mode="card"
        onRoomSelect={handleRoomSelect}
        selectedRooms={selectedRooms}
        bhkType={getBHKConfiguration()} // This will now include custom config
        accessoryPrices={accessoryPrices}
        featurePrices={featurePrices}
      />
      <div className="flex mt-8">
        <button
          type="button"
          className="px-6 py-3 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300 font-medium"
          onClick={() => setResStep(0)}
        >
          Back
        </button>
        <button
          type="button"
          className="ml-auto px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
          onClick={() => {
            const hasSelectedRooms = Object.keys(roomDetails).some(key => 
              roomDetails[key] && roomDetails[key].area
            );
            if (!hasSelectedRooms) {
              alert('Please configure at least one room.');
              return;
            }
            setResStep(2);
          }}
        >
          Next
        </button>
      </div>
    </div>
    <div className="w-1/2 flex items-center justify-center">
      {/* Placeholder for future media */}
    </div>
  </div>
)}
            
            {/* Step 3: Project Details */}
            {resStep === 2 && (
              <div className="flex w-full">
                <div className="w-1/2 flex flex-col justify-center">
                  <ProjectDetailsForm
                    mode="card"
                    details={projectDetails}
                    setDetails={setProjectDetails}
                  />
                  <div className="flex mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300 font-medium"
                      onClick={() => setResStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="ml-auto px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
                      onClick={() => {
                        if (!projectDetails.timeline || !projectDetails.budget) {
                          alert('Please fill in all required fields.');
                          return;
                        }
                        setSelectedPackage(projectDetails.selectedPackage);
                        setResStep(3);
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="w-1/2 flex items-center justify-center">
                  {/* Placeholder for future media */}
                </div>
              </div>
            )}
            
            {/* Step 4: Personal Info */}
            {resStep === 3 && (
              <div className="flex w-full flex-row-reverse">
                <div className="w-1/2 flex flex-col justify-center">
                  <ContactInfoModal
                    mode="card"
                    onSubmit={(info) => {
                      if (!info.name || !info.email || !info.phone || !info.address) {
                        alert('Please fill in all required fields.');
                        return;
                      }
                      setContactInfo(info);
                      setResStep(4);
                    }}
                  />
                  <div className="flex mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 border-2 border-[#00423D] text-[#00423D] rounded-lg hover:bg-[#00423D] hover:text-white transition duration-300 font-medium"
                      onClick={() => setResStep(2)}
                    >
                      Back
                    </button>
                  </div>
                </div>
                <div className="w-1/2 flex items-center justify-center">
                  {/* Placeholder for future media */}
                </div>
              </div>
            )}
            
            {/* Step 5: Estimate (centered) */}
            {resStep === 4 && (
              <div className="flex w-full justify-center items-center">
                <div className="flex-1 flex justify-end items-center">
                  {/* Left package toggle */}
                  {selectedPackage !== 'essential' && (
                    <div className="p-4 m-2 border rounded-lg cursor-pointer" onClick={() => setSelectedPackage('essential')}>
                      Essential
                    </div>
                  )}
                  {selectedPackage !== 'comfort' && (
                    <div className="p-4 m-2 border rounded-lg cursor-pointer" onClick={() => setSelectedPackage('comfort')}>
                      Comfort
                    </div>
                  )}
                  {selectedPackage !== 'luxury' && (
                    <div className="p-4 m-2 border rounded-lg cursor-pointer" onClick={() => setSelectedPackage('luxury')}>
                      Luxury
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#00423D] mb-4">Your Estimate</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ₹{calculateTotalEstimate().total.toLocaleString('en-IN')}
                    </div>
                    <p className="text-gray-600 mb-6">
                      Package: <span className="font-semibold capitalize">{selectedPackage}</span>
                    </p>
                    <button
                      type="button"
                      className="px-8 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
                      onClick={() => setShowEstimateSummary(true)}
                    >
                      View Detailed Summary
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex justify-start items-center">
                  {/* Right package toggle */}
                </div>
              </div>
            )}
          </motion.form>
        )}

        {/* Commercial Flow (untouched) */}
        {projectType === 'commercial' && !showProjectTypeModal && (
          <CommercialForm onSubmit={handleCommercialFormSubmit} />
        )}

        {/* Project Type Modal (untouched) */}
        <ProjectTypeModal
          isOpen={showProjectTypeModal}
          onClose={() => setShowProjectTypeModal(false)}
          onSelect={handleProjectTypeSelect}
        />

        {/* Estimate Summary */}
        <EstimateSummary
          isOpen={showEstimateSummary}
          onClose={() => setShowEstimateSummary(false)}
          projectType={projectType || 'residential'}
          projectDetails={projectType === 'residential' ? { ...projectDetails, roomDetails } : commercialFormData}
          contactInfo={contactInfo}
          totalEstimate={calculateTotalEstimate().total}
          breakdown={calculateTotalEstimate().breakdown}
        />

        {/* Login-gated Breakdown Button */}
        {showEstimateSummary && (
          <div className="relative mt-8">
            <div className="absolute inset-0 bg-gradient-to-t rounded-lg" />
            <div className="relative p-8 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewBreakdown}
                className="px-8 py-4 bg-white text-[#00423D] rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
              >
                View Full Cost Breakdown
              </motion.button>
              <p className="mt-4 text-white/80">
                Sign in to view detailed cost breakdown and save your estimate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimatePage;