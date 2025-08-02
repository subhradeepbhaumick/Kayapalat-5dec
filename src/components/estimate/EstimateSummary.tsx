import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";

// New interfaces for clarity and type safety
interface ResidentialProjectDetails {
    location: string;
    timeline: string;
    selectedPackage: string;
    budget: string;
    roomDetails: { [key: string]: any };
}

interface CommercialProjectDetails {
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

interface ContactInfo {
    name: string;
    phone: string;
    email: string;
    address: string;
    additionalNotes?: string;
}

interface EstimateSummaryProps {
    isOpen: boolean;
    onClose: () => void;
    projectType: 'residential' | 'commercial';
    residentialDetails?: ResidentialProjectDetails;
    commercialDetails?: CommercialProjectDetails;
    contactInfo?: ContactInfo;
    totalEstimate: number; // Still passed, but not displayed for commercial
    breakdown: { [key: string]: number }; // Still passed, but not displayed for commercial
}

const projectTypeLabels: Record<string, string> = {
    office: "Office Space",
    retail: "Retail Store",
    restaurant: "Restaurant",
    hotel: "Hotel",
    education: "Educational Institution",
    healthcare: "Healthcare Facility",
    showroom: "Showrooms",
    sport: "Sports Facility",
    other: "Other",
    residential: "Residential",
    commercial: "Commercial",
};

const EstimateSummary: React.FC<EstimateSummaryProps> = ({
    isOpen,
    onClose,
    projectType,
    residentialDetails,
    commercialDetails,
    contactInfo,
    totalEstimate = 0, // Still receive, but conditionally use
    breakdown = {}, // Still receive, but conditionally use
}) => {
    useEffect(() => {
        console.log('EstimateSummary - Residential Details:', residentialDetails);
        console.log('EstimateSummary - Commercial Details:', commercialDetails);
        console.log('EstimateSummary - Contact Info:', contactInfo);
        console.log('EstimateSummary - Project Type:', projectType);
        console.log('EstimateSummary - Total Estimate:', totalEstimate);
        console.log('EstimateSummary - Breakdown:', breakdown);
    }, [residentialDetails, commercialDetails, contactInfo, projectType, totalEstimate, breakdown]);

    const formatCurrency = (amount: number) => {
        if (isNaN(amount)) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    const currentContactInfo = projectType === 'residential'
        ? (contactInfo || { name: '', phone: '', email: '', address: '', additionalNotes: '' })
        : {
            name: commercialDetails?.clientName || '',
            phone: commercialDetails?.phone || '',
            email: commercialDetails?.email || '',
            address: '',
            additionalNotes: commercialDetails?.additionalNotes || ''
        };

    const truncateText = (text: string | undefined, charLimit: number) => {
        if (!text) return '';
        return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* DialogOverlay handles the backdrop-blur and prevents clicks outside */}
            <DialogOverlay className="fixed inset-0 backdrop-blur z-40" />
            
            <DialogContent
                className="mt-8 fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full pointer-events-auto"
                onInteractOutside={e => e.preventDefault()} // Explicitly prevent interaction outside
            >
                <button
                    onClick={onClose}
                    // Adjusted top positioning for mobile (top-5 = 20px) and larger screens (sm:top-4 = 16px)
                    className="absolute top-5 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors z-10 sm:top-4"
                >
                    <FaTimes className="text-md" />
                </button>
                {/* The actual modal content wrapper, now with the desired styling */}
                <div className="relative bg-white/95 rounded-xl shadow-lg p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto min-h-[400px]">
                    <DialogHeader>
                        <div className="flex justify-between items-center mb-4">
                            <DialogTitle className="text-3xl font-bold text-[#00423D] flex items-center justify-center text-center">
                            <img src="/favicon.png" alt="KayaPalat Logo" className="h-12 mr-3" />
                             <img src="/kayapalat-logo.png" alt="KayaPalat Logo" className="h-6 mr-3" />
                                {/* {projectType === 'residential' ? 'Your Residential Interior Design Estimate' : 'Commercial Project Summary'} */}
                            </DialogTitle>
                            
                        </div>
                    </DialogHeader>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8 py-3"
                    >
                        {/* Success Message */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
                        >
                            <FaCheckCircle className="text-5xl text-[#00423D] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#00423D] mb-2">
                                {projectType === 'commercial' ? 'Project Submitted Successfully!' : 'Estimate Generated Successfully!'}
                            </h3>
                            {projectType === 'commercial' && (
                                <p className="text-gray-600 mt-2"><span className="font-bold text-[#00423D]">Team KayaPalat</span> will contact you within <span className="font-bold text-[#00423D]">48 hours</span></p>
                            )}
                        </motion.div>

                        {/* Total Estimate Display - Only for Residential */}
                        {projectType === 'residential' && (
                            <motion.div variants={itemVariants} className="text-center p-6 bg-[#00423D] text-white rounded-lg shadow-md">
                                <h3 className="text-2xl font-semibold mb-2">Your Estimated Cost</h3>
                                <p className="text-5xl font-bold">
                                    {formatCurrency(totalEstimate)}
                                </p>
                                {residentialDetails?.selectedPackage && (
                                    <p className="text-lg mt-2">
                                        Package: <span className="font-semibold capitalize">{residentialDetails.selectedPackage}</span>
                                    </p>
                                )}
                            </motion.div>
                        )}


                        {/* Project Details Section */}
                        <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-xl font-semibold text-[#00423D] mb-4">Project Details</h3>
                            {projectType === 'residential' && residentialDetails ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Location</p>
                                        <p className="font-medium">{residentialDetails.location || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Timeline</p>
                                        <p className="font-medium">{residentialDetails.timeline || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Selected Package</p>
                                        <p className="font-medium capitalize">{residentialDetails.selectedPackage || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Budget</p>
                                        <p className="font-medium">{residentialDetails.budget ? formatCurrency(parseFloat(residentialDetails.budget)) : 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                // Commercial details rendering or fallback
                                commercialDetails && Object.keys(commercialDetails).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">Project Type</p>
                                            <p className="font-medium">{projectTypeLabels[commercialDetails.projectType] || commercialDetails.projectType || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Project Name</p>
                                            <p className="font-medium">{commercialDetails.projectName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Location</p>
                                            <p className="font-medium">{commercialDetails.location || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Project Area</p>
                                            <p className="font-medium">{commercialDetails.projectArea ? `${commercialDetails.projectArea} sq.ft` : 'N/A'}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-gray-600">Project Details</p>
                                            <p className="font-medium break-words" title={commercialDetails.details}>
                                                {truncateText(commercialDetails.details, 100) || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Timeline</p>
                                            <p className="font-medium">{commercialDetails.timeline || 'N/A'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic text-center py-4">No commercial project details available.</div>
                                )
                            )}
                        </motion.div>

                        {/* Client Information Section */}
                        <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-xl font-semibold text-[#00423D] mb-4">Client Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Name</p>
                                    <p className="font-medium">{currentContactInfo.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Phone</p>
                                    <p className="font-medium">{currentContactInfo.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Email</p>
                                    <p className="font-medium">{currentContactInfo.email || 'N/A'}</p>
                                </div>
                                {projectType === 'residential' && currentContactInfo.address && (
                                    <div>
                                        <p className="text-gray-600">Address</p>
                                        <p className="font-medium">{truncateText(currentContactInfo.address, 50) || 'N/A'}</p>
                                    </div>
                                )}
                                {currentContactInfo.additionalNotes && (
                                    <div className="md:col-span-2">
                                        <p className="text-gray-600">Additional Notes</p>
                                        <p className="font-medium">{truncateText(currentContactInfo.additionalNotes, 100) || 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Residential Room Details Breakdown (if applicable) */}
                        {projectType === 'residential' && residentialDetails?.roomDetails && Object.keys(residentialDetails.roomDetails).length > 0 && (
                            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-xl font-semibold text-[#00423D] mb-4">Detailed Room Breakdown</h3>
                                <div className="space-y-4">
                                    {Object.entries(residentialDetails.roomDetails).map(([roomKey, details]) => (
                                        <div key={roomKey} className="border-b pb-3 last:border-b-0 last:pb-0">
                                            <h4 className="font-semibold text-lg text-gray-800 capitalize mb-2">
                                                {roomKey.replace(/_/g, ' ')} ({details.area} sq.ft)
                                            </h4>
                                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                {breakdown[`${roomKey}`] && (
                                                    <li>Base Cost: {formatCurrency(breakdown[`${roomKey}`])}</li>
                                                )}
                                                {details.falseCeiling && breakdown[`${roomKey}_falseCeiling`] && (
                                                    <li>False Ceiling: {formatCurrency(breakdown[`${roomKey}_falseCeiling`])}</li>
                                                )}
                                                {details.loft && breakdown[`${roomKey}_loft`] && (
                                                    <li>Loft: {formatCurrency(breakdown[`${roomKey}_loft`])}</li>
                                                )}
                                                {details.accessories && Object.entries(details.accessories).map(([accName, quantity]) => {
                                                    if (quantity > 0 && breakdown[`${roomKey}_${accName}`]) {
                                                        return (
                                                            <li key={accName}>
                                                                {accName} (x{quantity}): {formatCurrency(breakdown[`${roomKey}_${accName}`])}
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                                {/* Add other room-specific details like material, finish, hardware if needed */}
                                                {details.material && <li>Material: {details.material}</li>}
                                                {details.finish && <li>Finish: {details.finish}</li>}
                                                {details.hardware && <li>Hardware: {details.hardware}</li>}
                                                {details.shape && <li>Shape: {details.shape}</li>}
                                                {details.kidsRoom && <li>Kids Room: Yes</li>}
                                                {details.additionalNotes && <li>Notes: {truncateText(details.additionalNotes, 50)}</li>}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EstimateSummary;
