'use client';

import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner'; // Sonner for notifications

// Country Options with Names and Codes
const countryOptions = [
  { value: '+91', label: 'India (+91)' },
  { value: '+1', label: 'USA (+1)' },
  { value: '+44', label: 'UK (+44)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+81', label: 'Japan (+81)' },
  { value: '+971', label: 'UAE (+971)' },
  { value: '+65', label: 'Singapore (+65)' },
];

const ContactUsPage = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isValid, setIsValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('India (+91)');
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const charLimit = 250;

  // Phone Validation
  const validatePhone = (phone: string, countryCode: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    const countryCodeRegex = /^\+\d{1,3}$/;
    return phoneRegex.test(phone) && countryCodeRegex.test(countryCode);
  };

  // Handle Phone Input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setIsValid(validatePhone(value, countryCode) && charCount <= charLimit);
  };

  // Handle Country Selection
  const handleCountrySelect = (value: string) => {
    const selectedCountry = countryOptions.find((country) => country.label === value);
    if (selectedCountry) {
      setSelectedCountry(value);
      setCountryCode(selectedCountry.value);
      setIsValid(validatePhone(phone, selectedCountry.value) && charCount <= charLimit);
    }
  };

  // Handle Message Input and Character Count
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
    // Disable callback if message length exceeds limit
    setIsValid(validatePhone(phone, countryCode) && value.length <= charLimit);
  };

  // Handle Request Callback Button Click
  const handleRequestCallback = () => {
    if (isValid) {
      toast.success('📞 Callback Requested! ', {
        description:`📱 Phone: ${countryCode} ${phone}`,
        duration: 1500, // Auto-dismiss after 3 seconds
        action: {
          label: <X size={18} className="cursor-pointer" />,
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  // Handle Enter Key Press to Trigger Button
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      handleRequestCallback(); // Trigger callback if conditions are met
    }
  };

  return (
    <div className="mt-20 md:mt-0 md:min-h-screen bg-[#D2EBD0] sm:bg-[#E8F5E9] transition-all duration-300 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg md:shadow-lg flex flex-col md:flex-row gap-8">
        {/* Left Side Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-2xl font-bold text-[#295A47]">Contact Us</h2>
          <div className="space-y-4 text-gray-700">
            <p className="flex items-center gap-2">
              <MapPin />
              <a
                href="https://www.google.com/maps/place/Kayapalat/@22.4935035,88.3891571,17z/data=!3m1!4b1!4m6!3m5!1s0x3a0271868dc12e59:0x509108582c6ccb4!8m2!3d22.4935035!4d88.391732!16s%2Fg%2F11vqzp8xlf?authuser=0&entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                className="hover:text-gray-900"
              >
                179-A, Survey Park Rd, Purba Diganta, Santoshpur, Kolkata - 70075, WB, India
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone />
              <a href="tel:6026026026" className="hover:text-gray-900">
                602-602-602-6
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail />
              <a href="mailto:info@kayapalat.co" className="hover:text-gray-900">
                info@kayapalat.co
              </a>
            </p>
            {/* Operating Hours */}
            <p className="flex flex-col gap-1">
              <span className="font-semibold text-[#295A47]">Operating Hours:</span>
              <span>🕒 Monday - Saturday: 10:00 AM to 6:00 PM</span>
              <span>❌ Sunday: Closed</span>
            </p>
          </div>

          {/* Input Fields */}
          <div className="mt-6 space-y-2">
            <div className="flex gap-2">
              {/* Country Name Dropdown Using ShadCN Select */}
              <Select onValueChange={handleCountrySelect} defaultValue={selectedCountry}>
                <SelectTrigger className="w-1/3 p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((country) => (
                    <SelectItem key={country.value} value={country.label}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Phone Number Input */}
              <input
                type="text"
                placeholder="Phone Number (10 digits)"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyPress}
                className="p-1 border border-gray-300 rounded-lg w-2/3"
              />
            </div>

            {/* Message Box with Character Counter Inside */}
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Enter your message (max 250 characters)"
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyPress}
                className="p-2 w-full border border-gray-300 rounded-lg resize-none"
              />
              {/* Character Counter Inside Textarea */}
              <p
                className={`absolute bottom-3 right-2 text-xs font-semibold ${
                  charCount > charLimit
                    ? 'text-red-500'
                    : charCount > 0
                    ? 'text-green-500'
                    : 'text-gray-500'
                }`}
              >
                {charCount}/{charLimit}
              </p>
            </div>

            {/* Request Callback Button */}
            <button
              onClick={handleRequestCallback}
              disabled={!isValid}
              className={`w-full py-2 mt-4 rounded-lg transition-all duration-200 ${
                isValid
                  ? 'bg-[#295A47] text-white cursor-pointer hover:bg-[#1e4c3a] active:scale-95 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Request a Callback
            </button>
          </div>
        </div>

        {/* Right Side - Google Map */}
        <div className="w-full md:w-1/2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.2845823891944!2d88.38915707537451!3d22.493503479548064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271868dc12e59%3A0x509108582c6ccb4!2sKayapalat!5e0!3m2!1sen!2sin!4v1742228237886!5m2!1sen!2sin"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
