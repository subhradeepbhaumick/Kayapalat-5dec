import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define the interfaces for props
interface ResidentialProjectDetails {
    location: string;
    timeline: string;
    selectedPackage: string;
    budget: string;
    roomDetails: { [key: string]: any };
    bhkConfiguration: { [key: string]: number };
}

interface ContactInfo {
    name: string;
    phone: string;
    email: string;
    address: string;
    additionalNotes?: string;
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

interface EstimateSummaryProps {
    isOpen: boolean;
    onClose: () => void;
    onStartOver: () => void;
    projectType: 'residential' | 'commercial';
    residentialDetails?: ResidentialProjectDetails;
    commercialDetails?: CommercialProjectDetails;
    contactInfo?: ContactInfo;
    totalEstimate: number;
    breakdown: { [key: string]: number };
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
    onStartOver,
    projectType,
    residentialDetails,
    commercialDetails,
    contactInfo,
    totalEstimate = 0,
    breakdown = {},
}) => {

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
            transition: { staggerChildren: 0.1 },
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
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none z-101 ">
                <div className="relative bg-white/95 rounded-xl shadow-lg p-8 w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-[#00423D]">
                            Your Estimate
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            type="button"
                            className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors z-10"
                        >
                            <FaTimes />
                        </button>
                    </DialogHeader>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8 py-3"
                    >
                        <motion.div variants={itemVariants} className="text-center p-4 bg-green-50 rounded-lg">
                            <FaCheckCircle className="text-5xl text-[#00423D] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#00423D]">
                                {projectType === 'commercial' ? 'Project Submitted Successfully!' : 'Estimate Generated Successfully!'}
                            </h3>
                            {projectType === 'commercial' && (
                                <p className="text-gray-600 mt-2"><span className="font-bold text-[#00423D]">Team KayaPalat</span> will contact you within <span className="font-bold text-[#00423D]">48 hours</span></p>
                            )}
                        </motion.div>
                        {/* Estimated Cost Section */}
                        {projectType === 'residential' && residentialDetails?.selectedPackage && (
                            <motion.div variants={itemVariants} className="text-center p-6 bg-[#00423D] text-white rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2">Your Estimated Cost</h3>
                                <p className="text-5xl font-bold">{formatCurrency(totalEstimate)}</p>
                                {/* {residentialDetails?.selectedPackage && (
                                <p className="text-lg mt-2">
                                    Package: <span className="font-semibold capitalize">{residentialDetails.selectedPackage}</span>
                                </p>
                            )} */}
                            </motion.div>
                        )}

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

                        {/* --- REWRITTEN DETAILED ROOM BREAKDOWN SECTION --- */}
                        {projectType === 'residential' && residentialDetails?.roomDetails && (
                            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-xl font-semibold text-[#00423D] mb-4">Detailed Room Breakdown</h3>
                                <div className="space-y-6">
                                    {Object.entries(residentialDetails.roomDetails).map(([roomKey, details]) => {
                                        if (!details || !details.area) return null;

                                        return (
                                            <div key={roomKey} className="border-b pb-4 last:border-b-0 last:pb-0">
                                                <h4 className="font-semibold text-lg capitalize mb-2">
                                                    {(() => {
                                                        // Extracts the base room type, e.g., "livingRoom" from "livingRoom_1"
                                                        const roomType = roomKey.split('_')[0];

                                                        // Formats the name for display, e.g., "livingRoom" -> "Living Room"
                                                        const displayName = roomType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                                                        // Get the total count for this room type
                                                        const count = residentialDetails?.bhkConfiguration?.[roomType] || 0;

                                                        // If the count is 1, just show the name. Otherwise, show the full key.
                                                        if (count > 1) {
                                                            return `${roomKey.replace(/_/g, ' ')} (${details.area} Sq.Ft)`;
                                                        } else {
                                                            return `${displayName} (${details.area} Sq.Ft)`;
                                                        }
                                                    })()}
                                                </h4>
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">

                                                    {/* Base Cost: Uses the correct key */}
                                                    {breakdown[`${roomKey}_Base Cost`] > 0 &&
                                                        <li>Base Cost: <span className="font-medium">{formatCurrency(breakdown[`${roomKey}_Base Cost`])}</span></li>}
                                                    {details.kidsRoom && <li>Kids Room: Yes</li>}



                                                    {/* Features: Uses correct, case-sensitive keys */}
                                                    {details.falseCeiling && breakdown[`${roomKey}_False Ceiling`] &&
                                                        <li>False Ceiling: <span className="font-medium">{formatCurrency(breakdown[`${roomKey}_False Ceiling`])}</span></li>}
                                                    {details.loft && breakdown[`${roomKey}_Loft`] &&
                                                        <li>Loft: <span className="font-medium">{formatCurrency(breakdown[`${roomKey}_Loft`])}</span></li>}

                                                    {/* Options: Displays the selection AND its price */}
                                                    {details.material && <div className="mt-2 font-semibold">Material:</div>}
                                                    {details.material &&
                                                        <li>{details.material}: <span className="font-medium">{formatCurrency(breakdown[`${roomKey}_Material: ${details.material}`])}</span></li>}
                                                    {details.finish && <div className="mt-2 font-semibold">Finish:</div>}
                                                    {details.finish &&
                                                        <li>{details.finish}: <span className="font-medium">{formatCurrency(breakdown[`${roomKey}_Finish: ${details.finish}`])}</span></li>}
                                                    {details.hardware && <div className="mt-2 font-semibold">Hardware:</div>}
                                                    {details.hardware &&
                                                        <li>{details.hardware}: <span className="font-medium">{formatCurrency(breakdown[`${roomKey}_Hardware: ${details.hardware}`])}</span></li>}
                                                    {details.shape && <div className="mt-2 font-semibold">Shape:</div>}
                                                    {details.shape &&
                                                        <li>{details.shape}: <span className="font-medium">{formatCurrency(breakdown[`${roomKey}_Shape: ${details.shape}`])}</span></li>}
                                                    {/* Accessories: Displays price for each */}
                                                    {details.accessories && Object.keys(details.accessories).length > 0 && <div className="mt-2 font-semibold">Accessories:</div>}
                                                    {Object.entries(details.accessories || {}).map(([accName, quantity]) => {
                                                        const cost = breakdown[`${roomKey}_${accName}`];
                                                        return quantity > 0 && cost ? <li key={accName}>{accName} (x{quantity}): <span className="font-medium">{formatCurrency(cost)}</span></li> : null
                                                    })}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                        {/* --- END OF REWRITTEN SECTION --- */}

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Back to Estimate
                            </button>
                            <button
                                type="button"
                                onClick={onStartOver}
                                className="w-full sm:w-auto px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition"
                            >
                                Start New Estimate
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EstimateSummary;