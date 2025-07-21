'use client';

import { useEffect, useState, useRef } from 'react';
import { Phone, Mail, MapPin, X, Linkedin, Instagram, Facebook, Twitter, ChevronDown, Youtube } from 'lucide-react';
import { toast } from 'sonner'; // For displaying notifications
import Link from 'next/link';

// --- Custom Combobox Component (Mimicking shadcn/ui Combobox behavior) ---
// This component provides a searchable dropdown functionality.
const Combobox = ({ options, value, onValueChange, placeholder, searchTerm, onSearchTermChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef(null);

  // Determine the displayed label based on the current value
  const displayLabel = options.find(option => option.value === value)?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setIsOpen(false);
        onSearchTermChange(''); // Clear search term when closing
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSearchTermChange]);

  const handleItemClick = (optionValue, optionLabel) => {
    onValueChange(optionValue);
    setIsOpen(false);
    onSearchTermChange(''); // Clear search term after selection
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={comboboxRef}>
      {/* Combobox Trigger Button */}
      <button
        type="button"
        className="flex justify-between items-center w-full p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#295A47] text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Combobox Content (Dropdown List with Search) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 z-10 max-h-60 overflow-y-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            className="p-2 w-full border-b border-gray-200 sticky top-0 bg-white z-20 focus:outline-none"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking search input
            autoFocus // Focus search input when dropdown opens
          />
          {/* Filtered Options List */}
          <ul role="listbox" className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-100"
                  onClick={() => handleItemClick(option.value, option.label)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Data for Dropdowns ---

// Comprehensive list of countries with flags and dial codes.
const countryOptions = [
  { value: '+93', label: 'Afghanistan (+93)' },
  { value: '+355', label: 'Albania (+355)' },
  { value: '+213', label: 'Algeria (+213)' },
  { value: '+376', label: 'Andorra (+376)' },
  { value: '+244', label: 'Angola (+244)' },
  { value: '+54', label: 'Argentina (+54)' },
  { value: '+374', label: 'Armenia (+374)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+43', label: 'Austria (+43)' },
  { value: '+994', label: 'Azerbaijan (+994)' },
  { value: '+973', label: 'Bahrain (+973)' },
  { value: '+880', label: 'Bangladesh (+880)' },
  { value: '+32', label: 'Belgium (+32)' },
  { value: '+591', label: 'Bolivia (+591)' },
  { value: '+387', label: 'Bosnia and Herzegovina (+387)' },
  { value: '+55', label: 'Brazil (+55)' },
  { value: '+359', label: 'Bulgaria (+359)' },
  { value: '+237', label: 'Cameroon (+237)' },
  { value: '+1-CA', label: 'Canada (+1)' }, // Unique value for Canada
  { value: '+56', label: 'Chile (+56)' },
  { value: '+86', label: 'China (+86)' },
  { value: '+57', label: 'Colombia (+57)' },
  { value: '+506', label: 'Costa Rica (+506)' },
  { value: '+385', label: 'Croatia (+385)' },
  { value: '+53', label: 'Cuba (+53)' },
  { value: '+357', label: 'Cyprus (+357)' },
  { value: '+420', label: 'Czech Republic (+420)' },
  { value: '+45', label: 'Denmark (+45)' },
  { value: '+20', label: 'Egypt (+20)' },
  { value: '+503', label: 'El Salvador (+503)' },
  { value: '+372', label: 'Estonia (+372)' },
  { value: '+358', label: 'Finland (+358)' },
  { value: '+33', label: 'France (+33)' },
  { value: '+995', label: 'Georgia (+995)' },
  { value: '+49', label: 'Germany (+49)' },
  { value: '+30', label: 'Greece (+30)' },
  { value: '+502', label: 'Guatemala (+502)' },
  { value: '+852', label: 'Hong Kong (+852)' },
  { value: '+36', label: 'Hungary (+36)' },
  { value: '+354', label: 'Iceland (+354)' },
  { value: '+91', label: 'India (+91)' },
  { value: '+62', label: 'Indonesia (+62)' },
  { value: '+98', label: 'Iran (+98)' },
  { value: '+353', label: 'Ireland (+353)' },
  { value: '+972', label: 'Israel (+972)' },
  { value: '+39', label: 'Italy (+39)' },
  { value: '+81', label: 'Japan (+81)' },
  { value: '+962', label: 'Jordan (+962)' },
  { value: '+7-Kaza', label: 'Kazakhstan (+7)' },
  { value: '+254', label: 'Kenya (+254)' },
  { value: '+82', label: 'South Korea (+82)' },
  { value: '+965', label: 'Kuwait (+965)' },
  { value: '+371', label: 'Latvia (+371)' },
  { value: '+961', label: 'Lebanon (+961)' },
  { value: '+370', label: 'Lithuania (+370)' },
  { value: '+352', label: 'Luxembourg (+352)' },
  { value: '+60', label: 'Malaysia (+60)' },
  { value: '+52', label: 'Mexico (+52)' },
  { value: '+373', label: 'Moldova (+373)' },
  { value: '+976', label: 'Mongolia (+976)' },
  { value: '+212', label: 'Morocco (+212)' },
  { value: '+977', label: 'Nepal (+977)' },
  { value: '+31', label: 'Netherlands (+31)' },
  { value: '+64', label: 'New Zealand (+64)' },
  { value: '+234', label: 'Nigeria (+234)' },
  { value: '+47', label: 'Norway (+47)' },
  { value: '+968', label: 'Oman (+968)' },
  { value: '+92', label: 'Pakistan (+92)' },
  { value: '+507', label: 'Panama (+507)' },
  { value: '+51', label: 'Peru (+51)' },
  { value: '+63', label: 'Philippines (+63)' },
  { value: '+48', label: 'Poland (+48)' },
  { value: '+351', label: 'Portugal (+351)' },
  { value: '+974', label: 'Qatar (+974)' },
  { value: '+40', label: 'Romania (+40)' },
  { value: '+7-RUS', label: 'Russia (+7)' },
  { value: '+966', label: 'Saudi Arabia (+966)' },
  { value: '+381', label: 'Serbia (+381)' },
  { value: '+65', label: 'Singapore (+65)' },
  { value: '+421', label: 'Slovakia (+421)' },
  { value: '+386', label: 'Slovenia (+386)' },
  { value: '+27', label: 'South Africa (+27)' },
  { value: '+34', label: 'Spain (+34)' },
  { value: '+94', label: 'Sri Lanka (+94)' },
  { value: '+46', label: 'Sweden (+46)' },
  { value: '+41', label: 'Switzerland (+41)' },
  { value: '+66', label: 'Thailand (+66)' },
  { value: '+90', label: 'Turkey (+90)' },
  { value: '+380', label: 'Ukraine (+380)' },
  { value: '+971', label: 'UAE (+971)' },
  { value: '+44', label: 'UK (+44)' },
  { value: '+1-US', label: 'USA (+1)' }, // Unique value for USA
  { value: '+598', label: 'Uruguay (+598)' },
  { value: '+998', label: 'Uzbekistan (+998)' },
  { value: '+58', label: 'Venezuela (+58)' },
  { value: '+84', label: 'Vietnam (+84)' },
];

const reasonOptions = [
  { value: 'service-design-only', label: 'Service - Design Only' },
  { value: 'turnkey', label: 'Turnkey Project' },
  { value: 'project-management', label: 'Project Management' },
  { value: 'general-inquiry', label: 'General Inquiry' },
  { value: 'other', label: 'Other' },
];

const cityOptions = [
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'pune', label: 'Pune' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'lucknow', label: 'Lucknow' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'kochi', label: 'Kochi' },
  { value: 'goa', label: 'Goa' },
  { value: 'other', label: 'Other' },
];

// --- Main ContactUsPage Component ---
const ContactUsPage = () => {
  // --- State Variables ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); // Default country code
  const [selectedCity, setSelectedCity] = useState('');
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [reasonForContact, setReasonForContact] = useState('');
  const [isValid, setIsValid] = useState(false); // Overall form validation status
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission in progress

  // New state for email validation error
  const [emailError, setEmailError] = useState('');

  // States for search terms in dropdowns (now passed to Combobox)
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [reasonSearchTerm, setReasonSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');

  const charLimit = 250; // Maximum characters for the message box

  // --- Validation Logic ---
  // This useEffect hook runs whenever relevant form fields change to update the isValid state.
  useEffect(() => {
    const validateForm = () => {
      // Basic validation for name (not empty)
      const isNameValid = name.trim().length > 0;

      // Regex for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(email);

      // Set email error message
      if (email.length > 0 && !isEmailValid) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }

      // Regex for 10-digit phone number
      const isPhoneValid = /^\d{10}$/.test(phone);
      // Message must be non-empty and within character limit
      const isMessageValid = message.length > 0 && message.length <= charLimit;
      // Reason for contact must be selected
      const isReasonValid = reasonForContact.length > 0;
      // City must be selected
      const isCityValid = selectedCity.length > 0;
      // WhatsApp number validation:
      // - If same as phone, it's valid if phone is valid.
      // - If different, it must be non-empty and 10 digits.
      const isWhatsappValid = whatsappSameAsPhone || (whatsappNumber.length > 0 && /^\d{10}$/.test(whatsappNumber));

      // All conditions must be true for the form to be valid
      return isNameValid && isEmailValid && isPhoneValid && isMessageValid && isReasonValid && isWhatsappValid && isCityValid;
    };
    setIsValid(validateForm());
  }, [name, email, phone, whatsappSameAsPhone, whatsappNumber, message, charCount, reasonForContact, selectedCity]);

  // --- Event Handlers for Input Changes ---
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Re-evaluate email validation immediately on change
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (e.target.value.length > 0 && !emailRegex.test(e.target.value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleWhatsappSameAsPhoneChange = (e) => setWhatsappSameAsPhone(e.target.checked);
  const handleWhatsappNumberChange = (e) => setWhatsappNumber(e.target.value);
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };
  const handleReasonChange = (value) => setReasonForContact(value);
  const handleCityChange = (value) => setSelectedCity(value);

  const handleCountrySelect = (value) => {
    // Value now corresponds to unique identifiers like '+1-CA' or '+1-US'
    setCountryCode(value);
  };

  // --- Handle Form Submission ---
  const handleSubmit = async () => {
    // Prevent submission if form is invalid or already submitting
    if (!isValid || isSubmitting) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true); // Set submission status to true

    try {
      // Extract the numeric dial code from the unique countryCode value for backend
      const numericCountryCode = countryCode.includes('-') ? countryCode.split('-')[0] : countryCode;

      // Prepare data for backend
      const callbackData = {
        name,
        email,
        phone: `${numericCountryCode} ${phone}`, // Combine numeric country code and phone number
        whatsappNumber: whatsappSameAsPhone ? `${numericCountryCode} ${phone}` : (whatsappNumber ? `${numericCountryCode} ${whatsappNumber}` : ''), // Include WhatsApp number if provided, with numeric country code
        message,
        reasonForContact,
        city: selectedCity,
        selectedCountryValue: countryCode, // Store the unique country value (e.g., '+1-CA')
        timestamp: new Date().toISOString(), // Current timestamp in ISO format for database
      };

      // --- API Call to Your MySQL Backend ---
      // This is a placeholder endpoint. You MUST replace '/api/submit-callback'
      // with the actual URL of your backend API that handles MySQL insertion.
      const response = await fetch('/api/submit-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callbackData),
      });

      // Check if the API call was successful
      if (response.ok) {
        toast.success('🎉 Callback Requested Successfully!', {
          description: 'Our team will get in touch with you shortly.',
          duration: 3000, // Notification duration
          action: {
            label: <X size={18} className="cursor-pointer" />,
            onClick: () => toast.dismiss(), // Dismiss button for toast
          },
        });

        // Clear form fields after successful submission
        setName('');
        setEmail('');
        setPhone('');
        setWhatsappSameAsPhone(true);
        setWhatsappNumber('');
        setMessage('');
        setCharCount(0);
        setReasonForContact('');
        setCountryCode('+91'); // Reset country dropdown to default (India)
        setSelectedCity('');
      } else {
        // Handle errors from the backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong on the server.');
      }

    } catch (error) {
      // Catch any network errors or errors thrown from the response handling
      console.error("Error submitting callback:", error);
      let errorMessage = 'Please try again later or contact us directly.';
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      toast.error('❌ Failed to request callback.', {
        description: errorMessage || 'Please try again later or contact us directly.',
        duration: 3000,
        action: {
          label: <X size={18} className="cursor-pointer" />,
          onClick: () => toast.dismiss(),
        },
      });
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  // --- Handle Enter Key Press ---
  // Allows submitting the form by pressing Enter if valid.
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      e.preventDefault(); // Prevent default form submission behavior
      handleSubmit();
    }
  };

  return (
    <div className="mt-20 bg-gradient-to-br from-[#D2EBD0] to-[#E8F5E9] flex justify-center items-center p-4 sm:p-8 font-inter">
      <div className="fixed left-0 top-2/5 -translate-y-1/2 flex flex-col gap-3 z-50 p-2 bg-white/70 backdrop-blur-sm rounded-r-lg shadow-lg">
        <Link href="https://facebook.com/" target="_blank" className="text-[#295A47] hover:scale-110 transition-transform p-1 rounded-full">
          <Facebook className="w-5 h-5" />
        </Link>
        <Link href="https://instagram.com/" target="_blank" className="text-[#295A47] hover:scale-110 transition-transform p-1 rounded-full">
          <Instagram className="w-5 h-5" />
        </Link>
        <Link href="https://www.youtube.com/@kayapalat1622" target="_blank" className="text-[#295A47] hover:scale-110 transition-transform p-1 rounded-full">
          <Youtube className="w-5 h-5" />
        </Link>
        <Link href="https://linkedin.com/" target="_blank" className="text-[#295A47] hover:scale-110 transition-transform p-1 rounded-full">
          <Linkedin className="w-5 h-5" />
        </Link>
      </div>
      <div className="bg-white w-full max-w-5xl p-6 sm:p-10 rounded-xl shadow-2xl flex flex-col md:flex-row gap-8 md:gap-12 relative overflow-hidden">

        {/* Decorative Pattern (Top-Left) */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#295A47] opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        {/* Decorative Pattern (Bottom-Right) */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#295A47] opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>

        {/* Left Side: Contact Info & Owner/Team & Socials */}
        <div className="w-full md:w-1/2 space-y-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#295A47] mb-4 leading-tight">
              Get in Touch with Our Team
            </h1>
            <p className="text-gray-600 text-md p-2 mb-6">
              We're here to help and answer any question you might have. We look forward to hearing from you!
            </p>

            {/* Contact Details Section */}
            <div className="space-y-4 text-gray-700 text-base">
              <p className="flex items-center gap-3">
                <MapPin className="text-[#295A47] flex-shrink-0" size={20} />
                <a
                  href="https://www.google.com/maps/place/Kayapalat/@22.4935035,88.3891571,17z/data=!3m1!4b1!4m6!3m5!1s0x3a0271868dc12e59:0x509108582c6ccb4!8m2!3d22.4935035!4d88.391732!16s%2Fg%2F11vqzp8xlf?authuser=0&entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1e4c3a] transition-colors duration-200"
                >
                  179-A, Survey Park Rd, Purba Diganta, Santoshpur, Kolkata - 70075, WB, India
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-[#295A47] flex-shrink-0" size={20} />
                <a href="tel:6026026026" className="hover:text-[#1e4c3a] transition-colors duration-200">
                  +91 602-602-602-6
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="text-[#295A47] flex-shrink-0" size={20} />
                <a href="mailto:info@kayapalat.co" className="hover:text-[#1e4c3a] transition-colors duration-200">
                  info@kayapalat.co
                </a>
              </p>
              <p className="flex flex-col gap-1 pt-2">
                <span className="font-semibold text-[#295A47] text-lg">Operating Hours:</span>
                <span>🕒 Monday - Saturday: 10:00 AM to 6:00 PM</span>
                <span>❌ Sunday: Closed</span>
              </p>
            </div>
          </div>

          {/* Owner/Team Section */}
          <div className="mt-8 p-6 bg-[#F0FDF4] rounded-lg shadow-inner flex items-center space-x-4">
            <img
              src="/favicon.png" // Placeholder image for team
              alt="Team Representative"
              className="w-24 h-24 p-1 rounded-full object-cover border-4 border-[#295A47]"
            />
            <div>
              <h3 className="text-xl font-bold text-[#295A47]">Our Dedicated Team</h3>
              <p className="text-gray-700 mt-1">
                "We are committed to bringing your visions to life with passion and precision."
              </p>
            </div>
          </div>

          {/* Social Media Section */}

        </div>

        {/* Right Side: Contact Form */}
        <div className="w-full md:w-1/2 space-y-5">
          <h2 className="text-3xl font-bold text-[#295A47] mb-6">Request a Callback</h2>

          {/* Name Input Field (Compulsory) */}
          <input
            type="text"
            placeholder="Your Full Name *"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyPress}
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#295A47]"
          />
          {/* Email Input Field (Compulsory) */}
          <div>
            <input
              type="email"
              placeholder="Your Email Address *"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleKeyPress}
              className={`p-3 border rounded-lg w-full focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#295A47]'}`}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Phone Number Input with Country Code Combobox */}
          <div className="flex gap-2">
            <div className="relative w-1/3">
              <Combobox
                options={countryOptions}
                value={countryCode}
                onValueChange={handleCountrySelect}
                placeholder="Select Country *"
                className="w-full"
                searchTerm={countrySearchTerm}
                onSearchTermChange={setCountrySearchTerm}
              />
            </div>
            {/* Phone Number Input Field (Compulsory) */}
            <input
              type="text"
              placeholder="Phone Number (10 digits) *"
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyPress}
              className="p-3 border border-gray-300 rounded-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-[#295A47]"
            />
          </div>

          {/* WhatsApp Number Checkbox and Conditional Input */}

          {!whatsappSameAsPhone && (
            // WhatsApp Number Input Field (Compulsory if checkbox is unchecked)
            <input
              type="text"
              placeholder="WhatsApp Number (10 digits) *"
              value={whatsappNumber}
              onChange={handleWhatsappNumberChange}
              onKeyDown={handleKeyPress}
              className="p-3 border border-gray-300 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-[#295A47]"
            />
          )}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="whatsappSame"
              checked={whatsappSameAsPhone}
              onChange={handleWhatsappSameAsPhoneChange}
              className="h-4 w-4 text-[#295A47] focus:ring-[#295A47] border-gray-300 rounded"
            />
            <label htmlFor="whatsappSame" className="text-gray-700 text-sm">WhatsApp number is same as phone number</label>
          </div>

          {/* Reason for Contact Combobox */}
          <div className="relative">
            <Combobox
              options={reasonOptions}
              value={reasonForContact}
              onValueChange={handleReasonChange}
              placeholder="Reason for Contact *"
              searchTerm={reasonSearchTerm}
              onSearchTermChange={setReasonSearchTerm}
            />
          </div>

          {/* City Combobox */}
          <div className="relative">
            <Combobox
              options={cityOptions}
              value={selectedCity}
              onValueChange={handleCityChange}
              placeholder="Which city are you from? *"
              searchTerm={citySearchTerm}
              onSearchTermChange={setCitySearchTerm}
            />
          </div>

          {/* Message Box with Character Counter Inside (Compulsory) */}
          <div className="relative">
            <textarea
              rows={4}
              placeholder="Enter your message (max 250 characters) *"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
              className="p-3 w-full border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#295A47]"
            />
            {/* Character counter display */}
            <p
              className={`absolute bottom-3 right-3 text-xs font-semibold ${charCount > charLimit
                  ? 'text-red-500' // Red if over limit
                  : charCount > 0
                    ? 'text-green-600' // Green if characters entered
                    : 'text-gray-500' // Gray if no characters
                }`}
            >
              {charCount}/{charLimit}
            </p>
          </div>

          {/* Request Callback Button */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting} // Button disabled if form is invalid or submitting
            className={`w-full py-3 mt-4 rounded-lg transition-all duration-300 font-semibold text-lg
              ${isValid && !isSubmitting
                ? 'bg-[#295A47] text-white cursor-pointer hover:bg-[#1e4c3a] active:scale-[0.98] shadow-lg hover:shadow-xl' // Enabled styles
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-md' // Disabled styles
              }`}
          >
            {isSubmitting ? 'Submitting...' : 'Request a Callback'} {/* Change text when submitting */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;