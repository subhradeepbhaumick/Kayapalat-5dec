'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, CheckCircle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// --- Data for Job Roles ---
const jobRoles = [
  {
    title: "Interior Designer",
    description: "Interior Design is a multi-faceted profession in which creative and technical solutions are applied within a structure to achieve a built interior environment. These solutions are functional, enhance the quality of life and culture, of the occupants, and are aesthetically attractive."
  },
  {
    title: "Site Coordinator",
    description: "A Site Coordinator is the person who plans and coordinates events for organizations, businesses and schools. Also executing the site, managing the site. They are responsible for things like vetting and hiring vendors, building public awareness and budgeting costs for events."
  },
  {
    title: "Sales Executive (BDE)",
    description: "Business development executive is a person who is responsible for the growth of the business. The main job of the Business development executive is to find new targets and leads to promote the sales and services of the company or organization."
  },
  {
    title: "Customer Relationship Manager (CRM)",
    description: "CRM stands for “Customer Relationship Management” and refers to all strategies, techniques, tools, and technologies used by enterprises for developing, retaining and acquiring customers."
  }
];

// --- Success Modal Component ---
const SuccessModal = ({ applicantName, role, onClose }: { applicantName: string; role: string; onClose: () => void; }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        const closeTimeout = setTimeout(onClose, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(closeTimeout);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                
                <Image src="/kayapalat-logo.png" alt="KayaPalat Logo" width={80} height={80} className="mx-auto mb-4" />
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Received!</h2>
                <p className="text-gray-600 leading-relaxed">
                    Dear <strong>{applicantName}</strong>,
                </p>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Your application for the role of <strong>{role}</strong> has been received.Team KayaPalat will contact you soon.
                </p>

                <div className="absolute mt-20 bottom-2 left-1/2 -translate-x-1/2 text-sm text-gray-400">
                    Closing in {countdown}s
                </div>
            </motion.div>
        </motion.div>
    );
};


export default function CareersPage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [about, setAbout] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0); // State for the accordion
    const [submittedName, setSubmittedName] = useState(''); // State to hold the name for the modal
  const [submittedRole, setSubmittedRole] = useState(''); // State to hold the role for the modal
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        toast.error('Invalid file type. Please upload a DOC, DOCX, or PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }
      setResume(file);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange(e.dataTransfer.files);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !role || !resume) {
      toast.error('Please fill in all required fields and upload your resume.');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('role', role);
    formData.append('about', about);
    formData.append('resume', resume);

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application.');
      }
      
      setShowSuccessModal(true);
      setSubmittedName(fullName); // Set the name for the modal
      setSubmittedRole(role); // Set the role for the modal

      setFullName('');
      setPhoneNumber('');
      setRole('');
      setAbout('');
      setResume(null);

      // Now we can use the captured data for the modal
      // This logic is handled inside the modal's display logic
      // We just need to ensure the modal state is managed correctly
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#D2EBD0] relative">
      <AnimatePresence>
        {showSuccessModal && (
            <SuccessModal
                applicantName={submittedName}
                role={submittedRole}
                onClose={() => setShowSuccessModal(false)} 
            />
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <motion.section 
        className="py-20 md:py-32 text-center bg-gradient-to-br from-[#00423D] to-[#006B5F] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6">
          <h1 
            className="text-4xl md:text-6xl font-bold tracking-wider"
            style={{ fontFamily: "'Abril Fatface', cursive" }}
          >
            Join Our Team
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200">
            Be a part of a creative and passionate team dedicated to transforming spaces and lives.
          </p>
        </div>
      </motion.section>

      {/* --- Main Content Section (Accordion & Form) --- */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-15 grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* --- Left Column: Open Positions Accordion --- */}
          <div className="md:col-span-2">
            <h2 className="text-3xl md:text-4xl text-center font-bold text-[#00423D] mb-8" style={{ fontFamily: "'Abril Fatface', cursive" }}> Available Roles</h2>
            <div className="space-y-4">
              {jobRoles.map((job, index) => (
                <div key={job.title} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setOpenAccordionIndex(openAccordionIndex === index ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                  >
                    <h3 className="text-xl font-bold text-[#00423D]">{job.title}</h3>
                    <ChevronDown className={`transform transition-transform duration-300 ${openAccordionIndex === index ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openAccordionIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="px-5"
                      >
                        <p className="text-gray-600 leading-relaxed pb-5 pt-2 border-t">{job.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* --- Right Column: Application Form Card --- */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 md:p-12 rounded-xl shadow-2xl"
            >
                <h2 
                    className="text-3xl md:text-4xl font-bold text-center text-[#00423D] mb-10"
                    style={{ fontFamily: "'Abril Fatface', cursive"}}
                >
                    Apply Now
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form fields remain the same */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 border border-[#00423D] rounded-md shadow-sm focus:ring-[#00423D] focus:border-[#00423D]" required />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-2 border border-[#00423D] rounded-md shadow-sm focus:ring-[#00423D] focus:border-[#00423D]" required />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role Applying For *</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border border-[#00423D] rounded-md shadow-sm focus:ring-[#00423D] focus:border-[#00423D]" required>
                            <option value="" disabled>Select a role...</option>
                            {jobRoles.map(job => <option key={job.title} value={job.title}>{job.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">Tell us something about yourself</label>
                        <textarea id="about" rows={4} value={about} onChange={(e) => setAbout(e.target.value)} className="w-full px-4 py-2 border border-[#00423D] rounded-md shadow-sm focus:ring-[#00423D] focus:border-[#00423D]"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (DOC, DOCX, PDF) *</label>
                        <div 
                            className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-[#00423D] border-dashed rounded-md cursor-pointer hover:border-[#00423D]"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                        >
                            <div className="space-y-1 text-center">
                                {resume ? (
                                    <div className="flex items-center text-gray-700 relative">
                                        <FileText className="w-10 h-10 mx-auto text-[#00423D]" />
                                        <p className="pl-3">{resume.name}</p>
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.stopPropagation(); setResume(null); }} 
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                                        <p className="text-xs text-gray-500">Max file size: 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} accept=".doc,.docx,.pdf" className="hidden" />
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00423D] hover:bg-[#063F3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00423D] disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}