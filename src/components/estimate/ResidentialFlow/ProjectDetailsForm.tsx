"use client";

import React, { useMemo } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Package {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  features: string[];
}

export interface ProjectDetails {
  location: string;
  timeline: string;
  selectedPackage: string;
  budget: string;
}

interface ProjectDetailsFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'card' | 'modal';
  details: ProjectDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProjectDetails>>;
}

const PackageCard: React.FC<{
  pkg: Package;
  checked: boolean;
  onChange: () => void;
  badges?: ('Recommended' | 'Popular')[];
}> = ({ pkg, checked, onChange, badges }) => (
  <label
    className={`
      relative flex items-start space-x-4 p-6 mb-4 rounded-xl border-2 transition-all duration-300
      bg-white/50 hover:bg-white
      ${checked ? 'border-[#00423D] bg-white' : 'border-gray-200'}
    `}
    style={{ background: 'linear-gradient(to right, white, rgb(156,224,156))' }}
  >
    <input
      type="radio"
      name="package"
      className="sr-only"
      checked={checked}
      onChange={onChange}
    />

    <div className="flex-1">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl text-[#00423D]">
            {pkg.id === 'essential'
              ? <FaMapMarkerAlt />
              : pkg.id === 'comfort'
                ? <FaCalendarAlt />
                : <FaInfoCircle />}
          </span>
          <span className="font-semibold text-lg">{pkg.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          {badges?.map((b, i) => (
            <span
              key={i}
              className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-[#00423D] text-white"
            >
              {b}
            </span>
          ))}
          <span
            className="
              relative flex items-center justify-center flex-shrink-0 mt-1
              h-5 w-5 rounded-full border-2 border-[#00423D]
              bg-white cursor-pointer transition-all
            "
          >
            {checked && (
              <span className="h-[80%] w-[80%] rounded-full bg-[#00423D]" />
            )}
          </span>
        </div>
      </div>
      <p className="text-gray-700 text-sm mb-2">{pkg.description}</p>
      <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
        {pkg.features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
    </div>
  </label>
);

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  isOpen = false,
  onClose = () => {},
  mode = 'modal',
  details,
  setDetails,
}) => {
  const packages: Package[] = [
    {
      id: 'essential',
      name: 'Essential',
      description: 'Perfect for budget-conscious homeowners',
      multiplier: 1,
      features: [
        'Standard quality materials',
        'Basic modular furniture',
        'Standard lighting fixtures',
        'Basic false ceiling',
        'Standard bathroom fittings',
      ],
    },
    {
      id: 'comfort',
      name: 'Comfort',
      description: 'Balanced quality and value',
      multiplier: 1.3,
      features: [
        'Premium quality materials',
        'Custom modular furniture',
        'Premium lighting fixtures',
        'Designer false ceiling',
        'Premium bathroom fittings',
        'Smart home features',
      ],
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'Ultimate luxury and customization',
      multiplier: 1.6,
      features: [
        'Luxury quality materials',
        'Custom designer furniture',
        'Luxury lighting fixtures',
        'Designer false ceiling',
        'Luxury bathroom fittings',
        'Advanced smart home features',
        'Custom artwork and decor',
      ],
    },
  ];

  const recommendedId = useMemo(() => {
    const b = Number(details.budget);
    if (b >= 200000) return 'luxury';
    if (b >= 100000) return 'comfort';
    if (b > 0) return 'essential';
    return null;
  }, [details.budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const content = (
    <div className="w-full rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-[#00423D] mb-6">
        Project Details
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={details.location}
            onChange={e =>
              setDetails(prev => ({ ...prev, location: e.target.value }))
            }
            placeholder="Enter project location"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D] transition duration-300"
          />
        </div>
        <div>
  <label className="block text-gray-700 mb-2 font-medium">
    Timeline
  </label>
  <div className="relative">
    <select
      name="timeline"
      value={details.timeline}
      onChange={e =>
        setDetails(prev => ({ ...prev, timeline: e.target.value }))
      }
      required
      className={`
        w-full
        px-4 py-3 pr-10                      /* extra padding so SVG isn’t flush */
        border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-[#00423D]
        transition duration-300
        appearance-none                     /* hide native arrow */
        ${!details.timeline ? 'text-gray-400' : 'text-gray-900'}  /* placeholder vs value color */
      `}
    >
      <option disabled hidden value="">
        Select timeline
      </option>
      <option value="1-3 months">1–3 months</option>
      <option value="Less than 6 months">Less than 6 months</option>
      <option value="More than 6 months">More than 6 months</option>
    </select>

    {/* Custom arrow SVG */}
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg
        className="w-5 h-5 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 12z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  </div>
</div>


        <div className="lg:col-span-2">
          <label className="block text-gray-700 mb-2 font-medium">
            Budget (INR-₹)
          </label>
          <input
            type="number"
            name="budget"
            value={details.budget}
            onChange={e =>
              setDetails(prev => ({ ...prev, budget: e.target.value }))
            }
            placeholder="Enter your budget"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00423D] transition duration-300"
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-gray-700 mb-2 font-medium">
          Select Package
        </label>
        <div className="grid grid-cols-1">
          {packages.map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              checked={details.selectedPackage === pkg.id}
              onChange={() =>
                setDetails(prev => ({ ...prev, selectedPackage: pkg.id }))
              }
              badges={[
                ...(pkg.id === recommendedId ? ['Recommended'] : []),
                ...(pkg.id === 'comfort' ? ['Popular'] : []),
              ]}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-[#00423D] mb-1">
          Package Selection Guide
        </h4>
        <p className="text-gray-700 text-sm">
          Choose a package that fits your needs and budget. You can compare
          features and upgrade later if needed.
        </p>
      </div>

      {mode === 'card' ? null : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-between pt-4 space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#00423D] text-white rounded-lg hover:bg-[#00332D] transition duration-300 font-medium"
          >
            Continue
          </button>
        </form>
      )}
    </div>
  );

  if (mode === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="
            w-full
            max-w-full
            sm:max-w-2xl
            md:max-w-3xl
            lg:max-w-4xl
            overflow-y-auto
            max-h-[80vh]
            backdrop-blur-sm
          "
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#00423D] text-center">
              Project Details
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};

export default ProjectDetailsForm;
