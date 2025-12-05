"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProjectTypeModal from '@/components/estimate/ProjectTypeModal';
import CommercialForm from '@/components/estimate/CommercialForm';
import BHKTypeSelector from '@/components/estimate/ResidentialFlow/BHKTypeSelector';
import RoomSelector from '@/components/estimate/ResidentialFlow/RoomSelector';
import ProjectDetailsForm from '@/components/estimate/ResidentialFlow/ProjectDetailsForm';
import ContactInfoModal from '@/components/estimate/ResidentialFlow/ContactInfoModal';
import EstimateSummary from '@/components/estimate/EstimateSummary';
import ImageCarousel from '@/components/ImageCarousel'; // Import the new ImageCarousel component

// Types for database pricing - ensure these match your actual API responses
interface RoomPrice {
    id: number;
    room_type: string;
    base_price: string;
    created_at: string;
    updated_at: string;
}

interface AccessoryPrice {
    id: number;
    accessory_name: string;
    room_type: string;
    price: string;
    created_at: string;
    updated_at: string;
}

interface FeaturePrice {
    id: number;
    feature_name: string;
    price: string;
    applicable_rooms: string; // JSON string of room types
    created_at: string;
    updated_at: string;
}

interface PackageMultiplier {
    id: number;
    package_name: string;
    multiplier: string;
    created_at: string;
    updated_at: string;
}

interface CustomConfig {
    bedrooms: number;
    livingRooms: number;
    kitchens: number;
    bathrooms: number;
    dining: number;
}

// BHK configurations - defines how many rooms of each type
const BHK_CONFIGURATIONS = {
    '1BHK': {
        livingRoom: 1,
        bedroom: 1,
        kitchen: 1,
        bathroom: 1,
        dining: 1,
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

// Sample images for the carousel (replace with your actual images)
const BHK_SELECTION_IMAGES = [
    "/estimate_slider/IMG-20250907-WA0003.jpg",
    "/estimate_slider/IMG-20250907-WA0004.jpg",
    "/estimate_slider/IMG-20250907-WA0005.jpg",
    "/estimate_slider/IMG-20250907-WA0006.jpg",
    "/estimate_slider/IMG-20250907-WA0007.jpg",
    "/estimate_slider/IMG-20250907-WA0008.jpg",
    "/estimate_slider/IMG-20250907-WA0009.jpg",
    "/estimate_slider/IMG-20250907-WA0010.jpg",
    "/estimate_slider/IMG-20250907-WA0011.jpg",
    "/estimate_slider/IMG-20250907-WA0012.jpg",
    "/estimate_slider/IMG-20250907-WA0013.jpg",
    "/estimate_slider/IMG-20250907-WA0014.jpg",
    "/estimate_slider/IMG-20250907-WA0015.jpg",
    "/estimate_slider/IMG-20250907-WA0016.jpg"
];

const ROOM_DESIGN_IMAGES = [
    "/estimate_slider/IMG-20250907-WA0003.jpg",
    "/estimate_slider/IMG-20250907-WA0004.jpg",
    "/estimate_slider/IMG-20250907-WA0005.jpg",
    "/estimate_slider/IMG-20250907-WA0006.jpg",
    "/estimate_slider/IMG-20250907-WA0007.jpg",
    "/estimate_slider/IMG-20250907-WA0008.jpg",
    "/estimate_slider/IMG-20250907-WA0009.jpg",
    "/estimate_slider/IMG-20250907-WA0010.jpg",
    "/estimate_slider/IMG-20250907-WA0011.jpg",
    "/estimate_slider/IMG-20250907-WA0012.jpg",
    "/estimate_slider/IMG-20250907-WA0013.jpg",
    "/estimate_slider/IMG-20250907-WA0014.jpg",
    "/estimate_slider/IMG-20250907-WA0015.jpg",
    "/estimate_slider/IMG-20250907-WA0016.jpg"
];

const PROJECT_DETAILS_IMAGES = [
    "/estimate_slider/IMG-20250907-WA0003.jpg",
    "/estimate_slider/IMG-20250907-WA0004.jpg",
    "/estimate_slider/IMG-20250907-WA0005.jpg",
    "/estimate_slider/IMG-20250907-WA0006.jpg",
    "/estimate_slider/IMG-20250907-WA0007.jpg",
    "/estimate_slider/IMG-20250907-WA0008.jpg",
    "/estimate_slider/IMG-20250907-WA0009.jpg",
    "/estimate_slider/IMG-20250907-WA0010.jpg",
    "/estimate_slider/IMG-20250907-WA0011.jpg",
    "/estimate_slider/IMG-20250907-WA0012.jpg",
    "/estimate_slider/IMG-20250907-WA0013.jpg",
    "/estimate_slider/IMG-20250907-WA0014.jpg",
    "/estimate_slider/IMG-20250907-WA0015.jpg",
    "/estimate_slider/IMG-20250907-WA0016.jpg"
];

const CONTACT_INFO_IMAGES = [
    "/estimate_slider/IMG-20250907-WA0003.jpg",
    "/estimate_slider/IMG-20250907-WA0004.jpg",
    "/estimate_slider/IMG-20250907-WA0005.jpg",
    "/estimate_slider/IMG-20250907-WA0006.jpg",
    "/estimate_slider/IMG-20250907-WA0007.jpg",
    "/estimate_slider/IMG-20250907-WA0008.jpg",
    "/estimate_slider/IMG-20250907-WA0009.jpg",
    "/estimate_slider/IMG-20250907-WA0010.jpg",
    "/estimate_slider/IMG-20250907-WA0011.jpg",
    "/estimate_slider/IMG-20250907-WA0012.jpg",
    "/estimate_slider/IMG-20250907-WA0013.jpg",
    "/estimate_slider/IMG-20250907-WA0014.jpg",
    "/estimate_slider/IMG-20250907-WA0015.jpg",
    "/estimate_slider/IMG-20250907-WA0016.jpg"
];




const CartPage = () => {
    const router = useRouter();
    const [projectType, setProjectType] = useState<'residential' | 'commercial' | null>(null);
    const [showProjectTypeModal, setShowProjectTypeModal] = useState(true);
    const [showEstimateSummary, setShowEstimateSummary] = useState(false);

    // State for residential flow
    const [resStep, setResStep] = useState(0);
    const [selectedBHK, setSelectedBHK] = useState('');
    const [customBHKConfig, setCustomBHKConfig] = useState<CustomConfig | null>(null);
    const [roomDetails, setRoomDetails] = useState<{ [key: string]: any }>({});
    const [projectDetails, setProjectDetails] = useState({
        location: '',
        timeline: '',
        selectedPackage: 'essential',
        budget: '',
    });
    const [contactInfo, setContactInfo] = useState<any>(null);


    const handleKeyDown = (event: React.KeyboardEvent) => {
        // Check if the key pressed was "Enter" and the source is not a textarea
        if (
            event.key === 'Enter' &&
            (event.target as HTMLElement).tagName !== 'TEXTAREA'
        ) {
            // Prevent the default form submission (which causes the reload)
            event.preventDefault();
        }
    };

    // State for commercial flow
    const [commercialFormData, setCommercialFormData] = useState<any>({});

    const [selectedPackage, setSelectedPackage] = useState('essential');

    // Database pricing state
    const [roomPrices, setRoomPrices] = useState<{ [key: string]: number }>({});
    const [accessoryPrices, setAccessoryPrices] = useState<{ [key: string]: { [key: string]: number } }>({});
    const [featurePrices, setFeaturePrices] = useState<{ [key: string]: number }>({});
    const [packageMultipliers, setPackageMultipliers] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'error' | 'info', text: string } | null>(null);

    // Ref for CommercialForm to call its reset method
    const commercialFormRef = useRef<any>(null);


    // Fetch pricing data from database
    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                setLoading(true);

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

                const roomPriceMap: { [key: string]: number } = {};
                roomData.forEach(room => {
                    roomPriceMap[room.room_type] = parseFloat(room.base_price);
                });
                setRoomPrices(roomPriceMap);

                const accessoryPriceMap: { [key: string]: { [key: string]: number } } = {};
                accessoryData.forEach(accessory => {
                    if (!accessoryPriceMap[accessory.room_type]) {
                        accessoryPriceMap[accessory.room_type] = {};
                    }
                    accessoryPriceMap[accessory.room_type][accessory.accessory_name] = parseFloat(accessory.price);
                });
                setAccessoryPrices(accessoryPriceMap);

                const featurePriceMap: { [key: string]: number } = {};
                featureData.forEach(feature => {
                    // This parseFloat is essential to prevent calculation errors
                    featurePriceMap[feature.feature_name] = parseFloat(feature.price);
                });
                setFeaturePrices(featurePriceMap);

                const packageMap: { [key: string]: number } = {};
                packageData.forEach(pkg => {
                    packageMap[pkg.package_name] = parseFloat(pkg.multiplier);
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

    const getBHKConfiguration = () => {
        if (!selectedBHK) {
            return {};
        }
        if (selectedBHK === 'custom' && customBHKConfig) {
            const customConfigMapped = {
                livingRoom: customBHKConfig.livingRooms,
                bedroom: customBHKConfig.bedrooms,
                kitchen: customBHKConfig.kitchens,
                bathroom: customBHKConfig.bathrooms,
                dining: customBHKConfig.dining,
            };
            return customConfigMapped;
        }
        const config = BHK_CONFIGURATIONS[selectedBHK as keyof typeof BHK_CONFIGURATIONS];
        return config || {};
    };

    const handleRoomSelect = (roomKey: string, details: any) => {
        setRoomDetails(prev => ({
            ...prev,
            [roomKey]: details
        }));
    };

    // In EstimatePage.tsx

    const calculateTotalEstimate = () => {
        let total = 0;
        const breakdown: { [key: string]: number } = {};

        if (projectType !== 'residential') {
            return { total: 0, breakdown: {} };
        }

        Object.entries(roomDetails).forEach(([roomKey, details]) => {
            // This check is critical to prevent non-numeric area values from causing NaN
            if (details && details.area && !isNaN(parseFloat(details.area))) {
                const area = parseFloat(details.area);
                const roomType = roomKey.split('_')[0];

                // 1. Base Cost
                // const basePrice = roomPrices[roomType] || 0;
                // if (basePrice > 0) {

                //     breakdown[`${roomKey}_Base Cost`] = basePrice * area;
                //     total += basePrice * area;
                // }

                // 2. Per Square Foot Features (False Ceiling, Loft)
                if (details.falseCeiling) {
                    // SAFEGUARD: Use || 0 to prevent NaN if price is missing from the database.
                    // CRITICAL: Use the correct lowercase key 'falseCeiling' from your database.
                    const pricePerSqFt = featurePrices['falseCeiling'] || 0;
                    const cost = pricePerSqFt * area;
                    breakdown[`${roomKey}_False Ceiling`] = cost;
                    total += cost;
                }
                if (details.loft) {
                    // SAFEGUARD & CRITICAL: Applying same fixes for 'loft'.
                    const pricePerSqFt = featurePrices['loft'] || 0;
                    const cost = pricePerSqFt * area * 0.25; // Assuming loft covers 25% of the room area
                    breakdown[`${roomKey}_Loft`] = cost;
                    total += cost;
                }

                // 3. Flat Rate Additive Costs (Material, Finish, Hardware, Shape)
                // const options = ['material', 'finish', 'hardware', 'shape'];
                const options = ['shape'];
                options.forEach(option => {
                    if (details[option]) {
                        const featureName = `${option.charAt(0).toUpperCase() + option.slice(1)}: ${details[option]}`;
                        // SAFEGUARD: Use || 0 to prevent NaN if a price lookup fails.
                        let addonarea = area;
                        if(featureName == "Shape: L-shaped"){
                            addonarea = area * 1.5;
                        }
                        else if(featureName == "Shape: U-shaped"){
                            addonarea = area * 2;
                        }
                        else if(featureName == "Shape: Parallel"){
                            addonarea = area * 1.75;
                        }
                        else{
                            addonarea = area;
                        }

                        const price = featurePrices[featureName] * addonarea || 0;

                        breakdown[`${roomKey}_${featureName}`] = price;
                        total += price;
                    }
                });

                // 4. Accessories
                if (details.accessories) {
                    Object.entries(details.accessories).forEach(([accName, quantity]) => {
                        if (typeof quantity === 'number' && quantity > 0) {
                            const price = accessoryPrices[roomType]?.[accName] || 0;
                            const accCost = price * quantity;
                            if (accCost > 0) {
                                breakdown[`${roomKey}_${accName}`] = accCost;
                                total += accCost;
                            }
                        }
                    });
                }
            }
        });

        // 5. Apply Package Multiplier
        const packageMultiplier = packageMultipliers[selectedPackage] || 1;
        total *= packageMultiplier;

        Object.keys(breakdown).forEach(key => {
            breakdown[key] *= packageMultiplier;
        });

        // Final safety check to ensure we never return NaN
        return { total: isNaN(total) ? 0 : total, breakdown };
    };

    const handleProjectTypeSelect = (type: 'residential' | 'commercial') => {
        setProjectType(type);
        setShowProjectTypeModal(false);
        if (type === 'residential') {
            setResStep(0);
        }
    };

    const handleBHKSelect = (bhkType: string, customConfig?: CustomConfig) => {
        setSelectedBHK(bhkType);
        if (customConfig) {
            setCustomBHKConfig(customConfig);
        } else {
            setCustomBHKConfig(null);
        }
    };

    const handleProjectDetailsSubmit = (details: any) => {
        setProjectDetails(details);
        setSelectedPackage(details.selectedPackage);
        setResStep(3);
    };

    const handleContactInfoSubmit = (info: any) => {
        setContactInfo(info);
        setResStep(4);
    };

    const handleCommercialFormSubmit = (data: any) => {
        setCommercialFormData(data);
        setShowEstimateSummary(true);
    };

    // Function to handle closing of the summary modal and resetting forms
    const handleSummaryModalClose = () => {
        setShowEstimateSummary(false); // Only closes the modal
    };


    const handleResetAndStartOver = () => {
        setShowEstimateSummary(false); // Close the modal first

        // Reset all residential-related states
        setSelectedBHK('');
        setCustomBHKConfig(null);
        setRoomDetails({});
        setProjectDetails({
            location: '',
            timeline: '',
            selectedPackage: 'essential',
            budget: '',
        });
        setContactInfo(null);
        setResStep(0); // Go back to the first step
        setProjectType(null);
        setShowProjectTypeModal(true); // Show the project type selection again
    };

    const handleViewBreakdown = () => {
        router.push('/login?redirect=/dashboard/estimate-breakdown');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    };

    const showMessage = (type: 'error' | 'info', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

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

    // Define background classes based on resStep
    const getFormBackgroundClass = () => {
        switch (resStep) {
            case 0: // BHK Type - More distinct green
                return 'bg-gradient-to-br from-lime-100 via-green-100 to-emerald-200';
            case 1: // Room Design - More distinct blue
                return 'bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200';
            case 2: // Project Details - Warm yellow/orange
                return 'bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100';
            case 3: // Client Info - Cool purple/pink
                return 'bg-gradient-to-br from-fuchsia-100 via-pink-100 to-rose-200';
            case 4: // Estimate Summary - A neutral or final gradient
                return 'bg-gradient-to-br from-gray-100 to-gray-200';
            default:
                return 'bg-white'; // Default white
        }
    };

    // Define SVG patterns for each step
    const getSvgPattern = (step: number) => {
        let patternId = '';
        let patternColor = '';
        let circleRadius = 0.75;
        let rectSize = 5;
        let circleOpacity = 0.5;
        let rectOpacity = 0.3;
        let strokeWidth = 0.2;

        switch (step) {
            case 0: // BHK Type - Greenish dots and squares
                patternId = 'bhkPattern';
                patternColor = '#00423D'; // Dark green for pattern
                circleRadius = 1.5;
                rectSize = 12;
                circleOpacity = 0.6;
                rectOpacity = 0.4;
                strokeWidth = 0.7;
                break;
            case 1: // Room Design - Bluish lines
                patternId = 'roomPattern';
                patternColor = '#3B82F6'; // Blue for pattern
                // For a line pattern, you might use different SVG elements or a different pattern definition
                // For simplicity, I'll modify the existing circle/rect pattern
                circleRadius = 0.8;
                rectSize = 8;
                circleOpacity = 0.4;
                rectOpacity = 0.6;
                strokeWidth = 1;
                break;
            case 2: // Project Details - Orangish subtle circles
                patternId = 'projectPattern';
                patternColor = '#F59E0B'; // Orange for pattern
                circleRadius = 2;
                rectSize = 15;
                circleOpacity = 0.7;
                rectOpacity = 0.2;
                strokeWidth = 0.3;
                break;
            case 3: // Client Info - Purplish abstract shapes
                patternId = 'contactPattern';
                patternColor = '#8B5CF6'; // Purple for pattern
                circleRadius = 1.2;
                rectSize = 10;
                circleOpacity = 0.5;
                rectOpacity = 0.5;
                strokeWidth = 0.8;
                break;
            default:
                return null; // No pattern for other steps or if projectType is not residential
        }

        return (
            <div className=" hidden absolute inset-0 opacity-10 -z-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r={circleRadius} fill="currentColor" opacity={circleOpacity} />
                            <rect x="5" y="5" width={rectSize} height={rectSize} fill="none" stroke="currentColor" strokeWidth={strokeWidth} opacity={rectOpacity} />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#${patternId})`} style={{ color: patternColor }} />
                </svg>
            </div>
        );
    };

    const { total: calculatedTotalEstimate, breakdown: calculatedBreakdown } = calculateTotalEstimate();

    console.log('Calculated Estimate:', calculatedTotalEstimate, calculatedBreakdown);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#D2EBD0] to-white py-24 px-1 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#00423D] mb-4">
                        Get Your Project Estimate
                    </h1>
                    <p className="text-lg text-gray-600">
                        Fill out the form below to receive a detailed cost estimate for your interior design project
                    </p>
                </div>

                {/* Custom Message Box */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

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
                        onKeyDown={handleKeyDown}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        // Dynamically apply background class based on resStep, and add border/shadow for pop-out effect
                        className={`relative backdrop-blur-sm rounded-xl border-2 border-gray-200 shadow-xl p-2 transition-all duration-500 ease-in-out ${getFormBackgroundClass()}`}
                    >
                        {/* Render the SVG pattern for the current step */}
                        {getSvgPattern(resStep)}

                        {/* Step 1: BHK Type */}
                        {resStep === 0 && (
                            <div className="flex flex-col-reverse lg:flex-row w-full gap-8">
                                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                    <BHKTypeSelector
                                        mode="card"
                                        onSelect={handleBHKSelect}
                                        selectedBHK={selectedBHK}
                                    />
                                    <div className="flex mt-8">
                                        <button
                                            type="button"
                                            className="ml-auto px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
                                            onClick={() => {
                                                if (!selectedBHK) {
                                                    showMessage('error', 'Please select a BHK type.');
                                                    return;
                                                }
                                                if (selectedBHK === 'custom' && customBHKConfig) {
                                                    const totalRooms = customBHKConfig.bedrooms + customBHKConfig.livingRooms +
                                                        customBHKConfig.kitchens + customBHKConfig.bathrooms +
                                                        customBHKConfig.dining;
                                                    if (totalRooms === 0) {
                                                        showMessage('error', 'Please configure at least one room in your custom setup.');
                                                        return;
                                                    }
                                                }
                                                setResStep(1);
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 lg:flex-none lg:max-w-[500px] flex-col items-center justify-center mb-8 lg:mb-0">
                                    <h2 className=' text-2xl md:text-5xl text-[#00423D] text-center stroke-text mb-5' style={{ fontFamily: "'Abril Fatface', cursive" }} >Real Images</h2>
                                    <ImageCarousel images={BHK_SELECTION_IMAGES} aspectRatio="4/3" />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Room Selection */}
                        {resStep === 1 && (
                            <div className="flex flex-col-reverse lg:flex-row-reverse w-full gap-8">
                                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                    <RoomSelector
                                        mode="card"
                                        onRoomSelect={handleRoomSelect}
                                        selectedRooms={{}}
                                        bhkType={getBHKConfiguration()}
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
                                                const hasConfiguredRooms = Object.keys(roomDetails).some(key =>
                                                    roomDetails[key] && roomDetails[key].area && parseFloat(roomDetails[key].area) > 0
                                                );
                                                if (!hasConfiguredRooms) {
                                                    showMessage('error', 'Please configure at least one room with a valid area.');
                                                    return;
                                                }
                                                setResStep(2);
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 lg:flex-none lg:max-w-[500px] flex-col items-center justify-center mb-8 lg:mb-0">
                                    <h2 className=' text-2xl md:text-5xl text-[#00423D] text-center stroke-text mb-5' style={{ fontFamily: "'Abril Fatface', cursive" }} >Real Images</h2>
                                    <ImageCarousel images={BHK_SELECTION_IMAGES} aspectRatio="4/3" />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Project Details */}
                        {resStep === 2 && (
                            <div className="flex flex-col-reverse lg:flex-row w-full gap-8">
                                <div className="w-full lg:w-1/2 flex flex-col justify-center">
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
                                                if (!projectDetails.timeline || !projectDetails.budget || parseFloat(projectDetails.budget) <= 0) {
                                                    showMessage('error', 'Please fill in all required project details including a valid budget.');
                                                    return;
                                                }
                                                handleProjectDetailsSubmit(projectDetails);
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 lg:flex-none lg:max-w-[500px] flex-col items-center justify-center mb-8 lg:mb-0">
                                    <h2 className=' text-2xl md:text-5xl text-[#00423D] text-center stroke-text mb-5' style={{ fontFamily: "'Abril Fatface', cursive" }} >Real Images</h2>
                                    <ImageCarousel images={BHK_SELECTION_IMAGES} aspectRatio="4/3" />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Personal Info */}
                        {resStep === 3 && (
                            <div className="flex flex-col-reverse lg:flex-row-reverse w-full gap-8">
                                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                    <ContactInfoModal
                                        mode="card"
                                        onSubmit={(info) => {
                                            if (!info.name || !info.email || !info.phone) {
                                                showMessage('error', 'Please fill in all required contact information fields.');
                                                return;
                                            }
                                            handleContactInfoSubmit(info);
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
                                <div className="w-full lg:w-1/2 lg:flex-none lg:max-w-[500px] flex-col items-center justify-center mb-8 lg:mb-0">
                                    <h2 className=' text-2xl md:text-5xl text-[#00423D] text-center stroke-text mb-5' style={{ fontFamily: "'Abril Fatface', cursive" }} >Real Images</h2>
                                    <ImageCarousel images={BHK_SELECTION_IMAGES} aspectRatio="4/3" />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Estimate (centered) */}
                        {resStep === 4 && (
                            <div className="flex w-full justify-center items-center flex-col">
                                <div className="flex items-center justify-center mb-6">
                                    {['essential', 'comfort', 'luxury'].map((pkgName) => (
                                        <button
                                            key={pkgName}
                                            type="button"
                                            onClick={() => setSelectedPackage(pkgName)}
                                            className={`
                                                p-3 m-2 rounded-lg font-medium transition duration-300
                                                ${selectedPackage === pkgName
                                                    ? 'bg-[#00423D] text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }
                                            `}
                                        >
                                            {pkgName.charAt(0).toUpperCase() + pkgName.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-[#00423D] mb-4">Your Estimate</h3>
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        ₹{calculatedTotalEstimate.toLocaleString('en-IN')}
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
                        )}
                    </motion.form>
                )}

                {/* Commercial Flow */}
                {projectType === 'commercial' && !showProjectTypeModal && (
                    <CommercialForm
                        ref={commercialFormRef}
                        onSubmit={handleCommercialFormSubmit}
                    />
                )}

                {/* Project Type Modal */}
                <ProjectTypeModal
                    isOpen={showProjectTypeModal}
                    onClose={() => setShowProjectTypeModal(false)}
                    onSelect={handleProjectTypeSelect}
                />

                {/* Estimate Summary Modal */}
                <EstimateSummary
                    isOpen={showEstimateSummary}
                    onClose={handleSummaryModalClose}
                    onStartOver={handleResetAndStartOver}
                    projectType={projectType || 'residential'}
                    residentialDetails={projectType === 'residential' ? { ...projectDetails, roomDetails, selectedPackage, bhkConfiguration: getBHKConfiguration() } : undefined}
                    commercialDetails={projectType === 'commercial' ? commercialFormData : undefined}
                    contactInfo={contactInfo}
                    totalEstimate={calculatedTotalEstimate}
                    breakdown={calculatedBreakdown}
                />

                {/* Login-gated Breakdown Button - only show if estimate summary is open (or has been viewed) and project is residential */}
                {showEstimateSummary && projectType === 'residential' && (
                    <div className="relative mt-8">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00423D]/80 to-transparent rounded-lg" />
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

export default CartPage;
