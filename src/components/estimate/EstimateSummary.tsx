import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";

interface ProjectDetails {
  location?: string;
  timeline?: string;
  package?: string;
  projectName?: string;
  details?: string;
  projectArea?: string;
  clientName?: string;
  phone?: string;
  email?: string;
  address?: string;
  projectType?: 'residential' | 'commercial';
}

interface ContactInfo {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface EstimateSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  projectType: 'residential' | 'commercial';
  projectDetails?: ProjectDetails;
  contactInfo?: ContactInfo;
  totalEstimate: number;
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
  projectDetails = {
    location: '',
    timeline: '',
    package: '',
    projectName: '',
    details: '',
    projectArea: '',
    clientName: '',
    phone: '',
    email: '',
    address: '',
  },
  contactInfo = {
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  totalEstimate = 0,
}) => {
  useEffect(() => {
    console.log('Project Details:', projectDetails);
    console.log('Contact Info:', contactInfo);
    console.log('Project Type:', projectType);
    console.log('Total Estimate:', totalEstimate);
  }, [projectDetails, contactInfo, projectType, totalEstimate]);

  const formatCurrency = (amount: number) => {
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

  const clientName = contactInfo?.name || projectDetails?.clientName || '';
  const clientPhone = contactInfo?.phone || projectDetails?.phone || '';
  const clientEmail = contactInfo?.email || projectDetails?.email || '';
  const clientAddress = contactInfo?.address || projectDetails?.address || '';

  const truncateText = (text: string, charLimit: number) => {
    if (!text) return '';
    return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 backdrop-blur" />
      <DialogContent
        className="max-w-5xl w-full overflow-y-auto max-h-[90vh] bg-white/95"
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[#00423D] text-center">
            <img src="/kayapalat-logo.png" alt="KayaPalat Logo" className="h-6  justify-start" />
            {projectType === 'residential' ? 'Your Residential Interior Design Estimate' : ''}
          </DialogTitle>
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
            className="text-center p-6 bg-green-50 rounded-lg border border-green-200"
          >
            <FaCheckCircle className="text-5xl text-[#00423D] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#00423D] mb-2">
              {projectType === 'commercial' ? 'Project Submitted Successfully!' : 'Estimate Generated Successfully!'}
            </h3>
            {projectType === 'commercial' && (
              <p className="text-gray-600 mt-2"><span className="font-bold text-[#00423D]">Team KayaPalat</span> will contact you within <span className="font-bold text-[#00423D]">48 hours</span></p>
            )}
          </motion.div>

          {/* Commercial Layout */}
          {projectType === 'commercial' && (
            <motion.div className="flex flex-col gap-8 mt-8">
              {/* Project Overview & Project Details in one row */}
              <div className="grid grid-cols-2 gap-8">
                {/* Project Overview */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-xl font-semibold text-[#00423D] mb-4">Project Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Project Type</p>
                      <p className="font-medium">
                        {projectTypeLabels[projectDetails?.projectType || projectType] || (projectDetails?.projectType || projectType)}
                      </p>
                    </div>
                    {projectDetails?.location && (
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium">{projectDetails.location}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Timeline</p>
                      <p className="font-medium">{projectDetails?.timeline || '3-6 months'}</p>
                    </div>
                    {projectDetails?.package && (
                      <div>
                        <p className="text-gray-600">Package</p>
                        <p className="font-medium">{projectDetails.package}</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Project Details */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-xl font-semibold text-[#00423D] mb-4">Project Details</h3>
                  <div className="space-y-2">
                    {projectDetails?.projectName ? (
                      <div>
                        <p className="text-gray-600">Project Name</p>
                        <p className="font-medium">{projectDetails.projectName}</p>
                      </div>
                    ) : null}
                    {projectDetails?.projectArea ? (
                      <div>
                        <p className="text-gray-600">Project Area</p>
                        <p className="font-medium">{projectDetails.projectArea} sq.ft</p>
                      </div>
                    ) : null}
                    {projectDetails?.details ? (
                      <div>
                        <p className="text-gray-600">Requirements</p>
                        <p className="font-medium break-words" title={projectDetails.details}>
                          {truncateText(projectDetails.details, 40)}
                        </p>
                      </div>
                    ) : null}
                    {!projectDetails?.projectName && !projectDetails?.details && !projectDetails?.projectArea && (
                      <div className="text-gray-500 italic">No additional details provided.</div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Client Information - Full Width */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border w-full">
                <h3 className="text-xl font-semibold text-[#00423D] mb-4">Client Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {clientName && (
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{clientName}</p>
                    </div>
                  )}
                  {clientPhone && (
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{clientPhone}</p>
                    </div>
                  )}
                  {clientEmail && (
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{clientEmail}</p>
                    </div>
                  )}
                  {clientAddress && (
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium">{clientAddress}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EstimateSummary;
