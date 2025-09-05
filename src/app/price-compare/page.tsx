"use client";

import React, { useState, useEffect, FC, ElementType, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown } from 'lucide-react';

// --- (Part 1: Data, Styles, and Presentational Components) ---
// This section contains your existing quotation data, styles, and the
// QuotationCard component. No logic changes were needed here.

interface RoomDetails {
    count?: number; type: string; furniture: string; accessories: string;
    paint?: string; shutter?: string; falseCeiling?: string;
}
interface PackageDetails {
    packageName?: string; company?: string; price: string; size?: string;
    title?: string; rooms: { [roomName: string]: RoomDetails };
}
interface QuotationCategory {
    essential: PackageDetails; premium: PackageDetails; luxury: PackageDetails;
    notes?: { [key: string]: string };
}
type QuotationData = { [key: string]: QuotationCategory; };

const quotationData: QuotationData = {
    "1bhk": {
        essential: { packageName: "Essential (1-BHK)", company: "KAYAPALAT", price: "₹ 6,70,868", rooms: { livingRoom: { count: 1, type: "Economy", furniture: "HDF-HMR* TV Unit in Pre-Lam Finish, 3-seater Sofa, Dining Table with 4 Chairs, Pooja unit", accessories: "Wallpaper, Curtains", paint: "Premium Luxury Emulsion on both walls and ceiling", }, kitchen: { count: 1, type: "Economy", furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets", shutter: "Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors", accessories: "Hob & Chimney, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Corner Units, Tambour", paint: "Premium Luxury Emulsion on both walls and ceiling", }, masterBedroom: { count: 1, type: "Economy", furniture: "2 Door HDF-HMR* Hinged Wardrobe in Pre Lam Finish, Queen Bed", accessories: "Curtains, Wallpaper", paint: "Premium Luxury Emulsion on both walls and ceiling", }, bathroom: { count: 1, type: "Economy", furniture: "Vanity Unit", accessories: "Shower Partition, One-Piece Water Closet with Health Faucet, Shower System, Wall-Mounted Basin & Tap", }, }, },
        premium: { packageName: "Premium (1-BHK)", company: "KAYAPALAT", price: "₹ 11,57,768", rooms: { livingRoom: { count: 1, type: "Premium", furniture: "BWR Ply* TV Unit in Matt Pro Lam Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit", accessories: "Wallpaper, Curtains", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, kitchen: { count: 1, type: "Premium", furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets", shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors", accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, masterBedroom: { count: 1, type: "Premium", furniture: "Gloss Lam Sliding Wardrobe in PU Finish, Bed", accessories: "Curtains, Wallpaper", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, bathroom: { count: 1, type: "Premium", furniture: "Vanity with Granite top & Mirror", accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub", }, }, },
        luxury: { packageName: "Luxury (1-BHK)", company: "KAYAPALAT", price: "₹ 20,34,510", rooms: { livingRoom: { count: 1, type: "Luxury", furniture: "BWR Ply* TV Unit in PU Matt Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit", accessories: "Wallpaper, Curtains", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, kitchen: { count: 1, type: "Luxury", furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets", shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Veneer and Ceramic, Exotic Crest Finishes", accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit, Tall Units & Inbuilt Appliances, Other European Accessories & Fittings", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, masterBedroom: { count: 1, type: "Luxury", furniture: "BWR Ply* Sliding Wardrobe in PU Finish, Bed with Side Tables", accessories: "Curtains, Wallpaper", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, bathroom: { count: 1, type: "Luxury", furniture: "Vanity with Granite top & Mirror", accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Matt Black Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub", }, }, },
    },
    "2bhk": {
        essential: { packageName: "Essential (2-BHK)", company: "KAYAPALAT", price: "₹ 8,59,480", rooms: { livingRoom: { count: 1, type: "Economy", furniture: "HDF-HMR* TV Unit in Pre-Lam Finish, 3-seater Sofa, Dining Table with 4 Chairs, Pooja unit", accessories: "Wallpaper, Curtains", paint: "Premium Luxury Emulsion on both walls and ceiling", }, kitchen: { count: 1, type: "Economy", furniture: "HDF/BWR cabinets", shutter: "Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors", accessories: "Hob & Chimney, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Corner Units, Tambour", paint: "Premium Luxury Emulsion on both walls and ceiling", }, masterBedroom: { count: 1, type: "Economy", furniture: "2 Door HDF-HMR* Hinged Wardrobe in Pre Lam Finish, Queen Bed", accessories: "Curtains, Wallpaper", paint: "Premium Luxury Emulsion on both walls and ceiling", }, bathroom: { count: 2, type: "Economy", furniture: "Vanity Unit", accessories: "Shower Partition, One-Piece Water Closet with Health Faucet, Shower System, Wall-Mounted Basin & Tap", }, kidsRoom: { count: 1, type: "Economy", furniture: "HDF-HMR* Hinged Wardrobe, Study Table in Pre Lam Finish, Single Bed", accessories: "Wallpaper, Curtains", paint: "Premium Luxury Emulsion on both walls and ceiling", }, }, },
        premium: { packageName: "Premium (2-BHK)", company: "KAYAPALAT", price: "₹ 14,32,408", rooms: { livingRoom: { count: 1, type: "Premium", furniture: "BWR Ply* TV Unit in Matt Pro Lam Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit", accessories: "Wallpaper, Curtains", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, kitchen: { count: 1, type: "Premium", furniture: "HDF/BWR cabinets", shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors", accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, masterBedroom: { count: 1, type: "Premium", furniture: "Gloss Lam Sliding Wardrobe in PU Finish, Bed", accessories: "Curtains, Wallpaper", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, bathroom: { count: 2, type: "Premium", furniture: "Vanity with Granite top & Mirror", accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub", }, kidsRoom: { count: 1, type: "Premium", furniture: "BWR Ply* Hinged Wardrobe, Study Table in Matt Pro Lam Finish, Single Bed", accessories: "Wallpaper, Curtains", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, }, },
        luxury: { packageName: "Luxury (2-BHK)", company: "KAYAPALAT", price: "₹ 24,16,354", rooms: { livingRoom: { count: 1, type: "Luxury", furniture: "BWR Ply* TV Unit in PU Matt Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit", accessories: "Wallpaper, Curtains", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, kitchen: { count: 1, type: "Luxury", furniture: "HDF/BWR cabinets", shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Veneer and Ceramic, Exotic Crest Finishes", accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit, Tall Units & Inbuilt Appliances, Other European Accessories & Fittings", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, masterBedroom: { count: 1, type: "Luxury", furniture: "BWR Ply* Sliding Wardrobe in PU Finish, Bed with Side Tables", accessories: "Curtains, Wallpaper", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, bathroom: { count: 2, type: "Luxury", furniture: "Vanity with Granite top & Mirror", accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Matt Black Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub", }, kidsRoom: { count: 1, type: "Luxury", furniture: "BWR Ply* Hinged Wardrobe, Study Table in PU Finish, Single Bed", accessories: "Wallpaper, Curtains", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, }, },
    },
    "Moduler kitchen": {
        essential: { packageName: "Economy (Kitchen)", company: "KAYAPALAT", price: "₹ 1,26,000", size: "10 x 8", rooms: { kitchen: { type: "Economy", furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets", shutter: "Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors", accessories: "Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Corner Units, Tambour", paint: "Premixture Emulsion on both walls and ceiling", }, }, },
        premium: { packageName: "Premium (Kitchen)", company: "KAYAPALAT", price: "₹ 2,01,500", size: "10 x 10", rooms: { kitchen: { type: "Premium", furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets", shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors", accessories: "Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit", paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling", }, }, },
        luxury: { packageName: "Luxury (Kitchen)", company: "KAYAPALAT", price: "₹ 6,04,062", size: "10 x 10", rooms: { kitchen: { type: "Luxury", furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets", shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Veneer and Ceramic, Exotic Crest Finishes", accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit, Tall Units & Inbuilt Appliances, Other European Accessories & Fittings", paint: "Royale Aspira on walls, Royale Matte on ceiling", }, }, },
    },
};

interface StyleConfig {
    textColor: string; bgImage: string; icon: string; bgColor?: string;
    headerBorderColor?: string; buttonBgColor?: string; priceColor?: string;
    companyColor: string; detailsTextColor: string; detailsBorderColor?: string;
}
const categoryStyles: { [key: string]: StyleConfig } = {
    essential: { textColor: "text-[#00423D]", bgColor: "bg-[#E0F2F1]", headerBorderColor: "border-[#0D9276]", buttonBgColor: "bg-[#0D9276]", bgImage: "url('/compare/essential2.jpg')", priceColor: "text-purple-800", companyColor: "text-gray-600", detailsTextColor: "text-gray-600", icon: "/compare/chess2.svg", },
    premium: { textColor: "text-neutral/80", bgImage: "url('/compare/premimum.jpg')", companyColor: "text-[#FBFCF8]", detailsTextColor: "text-[#FBFCF8]", detailsBorderColor: "text-[#FBFCF8]", icon: "/compare/svg1.svg", },
    luxury: { textColor: "text-[#333333]", bgImage: "url('/compare/luxury2.jpg')", priceColor: "text-[#333333]", companyColor: "text-[#333333]", detailsTextColor: "text-[#333333]", detailsBorderColor: "text-[#333333]", icon: "/compare/svg2.svg", },
};
const categories = ["essential", "premium", "luxury"];
const bhkOptions = ["1bhk", "2bhk", "3bhk", "4bhk", "5bhk", "bungalow", "wardrobe", "Moduler kitchen", "Kids Room", "Master Bedroom", "Living Room", "Bathroom", "Study Room", "Guest Room"];

interface StyledHeadingProps {
    level?: ElementType; children: React.ReactNode; className?: string;
}
const StyledHeading: FC<StyledHeadingProps> = ({ level: Level = 'h2', children, className }) => (
    <Level style={{ WebkitTextStroke: ".2px black", fontFamily: "'Abril Fatface', cursive" }} className={className}>
        {children}
    </Level>
);

interface QuotationCardProps {
    category: string; selectedBHK: string; onBhkChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    allBhkOptions: string[]; data: PackageDetails | undefined; styles: StyleConfig;
}
const QuotationCard: FC<QuotationCardProps> = ({ category, selectedBHK, onBhkChange, allBhkOptions, data, styles, }) => {
    return (
        <div className="rounded-2xl shadow-xl p-6 transition-transform hover:scale-105 hover:shadow-2xl flex flex-col"
            style={{ borderColor: styles.headerBorderColor, backgroundImage: styles.bgImage, backgroundSize: 'cover', backgroundPosition: 'center', }}>
            <div className="flex justify-between items-center mb-4 border-b-2 pb-3" style={{ borderColor: styles.headerBorderColor }}>
                <div className="flex items-center gap-5">
                    <Image src={styles.icon} alt={`${category} icon`} width={56} height={48} className="w-14 h-12" />
                    <StyledHeading level="h3" className={`text-2xl capitalize ${styles.textColor} drop-shadow-md`}>{category}</StyledHeading>
                </div>
                <select value={selectedBHK} onChange={onBhkChange} className="custom-select-arrow cursor-pointer appearance-none text-center border border-gray-300 rounded-xl py-2 pl-4 pr-8 sm:w-auto w-[40%] text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                    {allBhkOptions.map((opt) => (<option key={opt} value={opt} className="text-center">{opt.toUpperCase()}</option>))}
                </select>
            </div>
            {data ? (
                <>
                    <div className="mb-3 text-center">
                        <p className={`text-4xl font-semibold ${styles.priceColor}`}>{data.price}</p>
                        {data.size && <p className={`text-md font-semibold ml-4 ${styles.priceColor}`}>{data.size}</p>}
                        {data.company && <p className={`text-sm ml-4 ${styles.companyColor}`}>{data.company}</p>}
                    </div>
                    <div className={`mb-6 space-y-4 p-2 ${styles.detailsTextColor} shadow-inner`}>
                        {Object.entries(data.rooms).map(([room, details]) => (
                            <div key={room} className={`border-t ${styles.detailsBorderColor} pt-2 mt-2 first:border-t-0`}>
                                <StyledHeading level="h4" className={`${styles.textColor} text-lg mb-1`}>{room.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</StyledHeading>
                                <p className="text-sm"><b>Furniture:</b> {details.furniture}</p>
                                {details.falseCeiling && <p className="text-sm">{details.falseCeiling}</p>}
                                {details.shutter && <p className="text-sm"><b>Shutters:</b> {details.shutter}</p>}
                                <p className="text-sm"><b>Accessories:</b> {details.accessories}</p>
                                {details.paint && <p className="text-sm"><b>Paint:</b> {details.paint}</p>}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center text-gray-400 text-center p-4 bg-opacity-30 rounded-lg">
                    <p className="italic text-white">Details for {selectedBHK.toUpperCase()} not available.</p>
                </div>
            )}
        </div>
    );
};

// --- (Part 2: New Modal Components) ---

const countryOptions = [
    { value: '+93', label: 'Afghanistan (+93)' }, { value: '+355', label: 'Albania (+355)' },
    { value: '+213', label: 'Algeria (+213)' }, { value: '+376', label: 'Andorra (+376)' },
    { value: '+244', label: 'Angola (+244)' }, { value: '+54', label: 'Argentina (+54)' },
    { value: '+374', label: 'Armenia (+374)' }, { value: '+61', label: 'Australia (+61)' },
    { value: '+43', label: 'Austria (+43)' }, { value: '+994', label: 'Azerbaijan (+994)' },
    { value: '+973', label: 'Bahrain (+973)' }, { value: '+880', label: 'Bangladesh (+880)' },
    { value: '+32', label: 'Belgium (+32)' }, { value: '+591', label: 'Bolivia (+591)' },
    { value: '+387', label: 'Bosnia and Herzegovina (+387)' }, { value: '+55', label: 'Brazil (+55)' },
    { value: '+359', label: 'Bulgaria (+359)' }, { value: '+237', label: 'Cameroon (+237)' },
    { value: '+1-CA', label: 'Canada (+1)' }, { value: '+56', label: 'Chile (+56)' },
    { value: '+86', label: 'China (+86)' }, { value: '+57', label: 'Colombia (+57)' },
    { value: '+506', label: 'Costa Rica (+506)' }, { value: '+385', label: 'Croatia (+385)' },
    { value: '+53', label: 'Cuba (+53)' }, { value: '+357', label: 'Cyprus (+357)' },
    { value: '+420', label: 'Czech Republic (+420)' }, { value: '+45', label: 'Denmark (+45)' },
    { value: '+20', label: 'Egypt (+20)' }, { value: '+503', label: 'El Salvador (+503)' },
    { value: '+372', label: 'Estonia (+372)' }, { value: '+358', label: 'Finland (+358)' },
    { value: '+33', label: 'France (+33)' }, { value: '+995', label: 'Georgia (+995)' },
    { value: '+49', label: 'Germany (+49)' }, { value: '+30', label: 'Greece (+30)' },
    { value: '+502', label: 'Guatemala (+502)' }, { value: '+852', label: 'Hong Kong (+852)' },
    { value: '+36', label: 'Hungary (+36)' }, { value: '+354', label: 'Iceland (+354)' },
    { value: '+91', label: 'India (+91)' }, { value: '+62', label: 'Indonesia (+62)' },
    { value: '+98', label: 'Iran (+98)' }, { value: '+353', label: 'Ireland (+353)' },
    { value: '+972', label: 'Israel (+972)' }, { value: '+39', label: 'Italy (+39)' },
    { value: '+81', label: 'Japan (+81)' }, { value: '+962', label: 'Jordan (+962)' },
    { value: '+7-Kaza', label: 'Kazakhstan (+7)' }, { value: '+254', label: 'Kenya (+254)' },
    { value: '+82', label: 'South Korea (+82)' }, { value: '+965', label: 'Kuwait (+965)' },
    { value: '+371', label: 'Latvia (+371)' }, { value: '+961', label: 'Lebanon (+961)' },
    { value: '+370', label: 'Lithuania (+370)' }, { value: '+352', label: 'Luxembourg (+352)' },
    { value: '+60', label: 'Malaysia (+60)' }, { value: '+52', label: 'Mexico (+52)' },
    { value: '+373', label: 'Moldova (+373)' }, { value: '+976', label: 'Mongolia (+976)' },
    { value: '+212', label: 'Morocco (+212)' }, { value: '+977', label: 'Nepal (+977)' },
    { value: '+31', label: 'Netherlands (+31)' }, { value: '+64', label: 'New Zealand (+64)' },
    { value: '+234', label: 'Nigeria (+234)' }, { value: '+47', label: 'Norway (+47)' },
    { value: '+968', label: 'Oman (+968)' }, { value: '+92', label: 'Pakistan (+92)' },
    { value: '+507', label: 'Panama (+507)' }, { value: '+51', label: 'Peru (+51)' },
    { value: '+63', label: 'Philippines (+63)' }, { value: '+48', label: 'Poland (+48)' },
    { value: '+351', label: 'Portugal (+351)' }, { value: '+974', label: 'Qatar (+974)' },
    { value: '+40', label: 'Romania (+40)' }, { value: '+7-RUS', label: 'Russia (+7)' },
    { value: '+966', label: 'Saudi Arabia (+966)' }, { value: '+381', label: 'Serbia (+381)' },
    { value: '+65', label: 'Singapore (+65)' }, { value: '+421', label: 'Slovakia (+421)' },
    { value: '+386', label: 'Slovenia (+386)' }, { value: '+27', label: 'South Africa (+27)' },
    { value: '+34', label: 'Spain (+34)' }, { value: '+94', label: 'Sri Lanka (+94)' },
    { value: '+46', label: 'Sweden (+46)' }, { value: '+41', label: 'Switzerland (+41)' },
    { value: '+66', label: 'Thailand (+66)' }, { value: '+90', label: 'Turkey (+90)' },
    { value: '+380', label: 'Ukraine (+380)' }, { value: '+971', label: 'UAE (+971)' },
    { value: '+44', label: 'UK (+44)' }, { value: '+1-US', label: 'USA (+1)' },
    { value: '+598', label: 'Uruguay (+598)' }, { value: '+998', label: 'Uzbekistan (+998)' },
    { value: '+58', label: 'Venezuela (+58)' }, { value: '+84', label: 'Vietnam (+84)' },
];

const Combobox = ({ options, value, onValueChange, placeholder, searchTerm, onSearchTermChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const comboboxRef = useRef(null);
    const displayLabel = options.find((option) => option.value === value)?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsOpen(false);
                onSearchTermChange('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onSearchTermChange]);

    const handleItemClick = (optionValue) => {
        onValueChange(optionValue);
        setIsOpen(false);
        onSearchTermChange('');
    };

    const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={`relative ${className}`} ref={comboboxRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#295A47] text-left">
                <span>{displayLabel}</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 z-10 max-h-60 overflow-y-auto">
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => onSearchTermChange(e.target.value)} onClick={(e) => e.stopPropagation()} autoFocus className="p-2 w-full border-b border-gray-200 sticky top-0 bg-white z-20 focus:outline-none" />
                    <ul role="listbox" className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li key={option.value} onClick={() => handleItemClick(option.value)} role="option" aria-selected={option.value === value} className="p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-100">{option.label}</li>
                            ))
                        ) : (<li className="p-2 text-gray-500">No results found.</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

const DetailsCaptureModal = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [countrySearchTerm, setCountrySearchTerm] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        const validateForm = () => {
            const isNameValid = name.trim().length > 0;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmailValid = emailRegex.test(email);
            setEmailError(email.length > 0 && !isEmailValid ? 'Please enter a valid email.' : '');
            const isPhoneValid = /^\d{10}$/.test(phone);
            const isWhatsappValid = whatsappSameAsPhone || /^\d{10}$/.test(whatsappNumber);
            return isNameValid && isEmailValid && isPhoneValid && isWhatsappValid;
        };
        setIsValid(validateForm());
    }, [name, email, phone, whatsappSameAsPhone, whatsappNumber]);

    const handleSubmit = async () => {
        if (!isValid || isSubmitting) {
            toast.error("Please fill all fields correctly to proceed.");
            return;
        }
        setIsSubmitting(true);
        try {
            const numericCountryCode = countryCode.includes('-') ? countryCode.split('-')[0] : countryCode;
            const callbackData = {
                name: name,
                email: email,
                phone: `${numericCountryCode} ${phone}`,
                whatsappNumber: !whatsappSameAsPhone ? `${numericCountryCode} ${whatsappNumber}` : '',
                whatsappSameAsPhone: whatsappSameAsPhone,
                message: `${name} was checking price comparison.`,
                reasonForContact: "Price Comparison",
                city: null,
            };

            const response = await fetch('/api/submit-callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(callbackData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Submission failed. Please try again.');
            }
            onSuccess();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl">
                <StyledHeading level="h2" className="text-2xl md:text-3xl text-center mb-2">Unlock Price Comparison</StyledHeading>
                <p className="text-center text-gray-600 mb-6">Please provide your details to continue.</p>
                <div className="space-y-4">
                    <input type="text" placeholder="Your Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#295A47]" />
                    <div>
                        <input type="email" placeholder="Your Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} className={`p-3 border rounded-lg w-full focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#295A47]'}`} />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Combobox options={countryOptions} value={countryCode} onValueChange={setCountryCode} placeholder="Country" className="w-1/3" searchTerm={countrySearchTerm} onSearchTermChange={setCountrySearchTerm} />
                        <input type="text" placeholder="Phone (10 digits) *" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-3 border border-gray-300 rounded-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-[#295A47]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="whatsappSame" checked={whatsappSameAsPhone} onChange={(e) => setWhatsappSameAsPhone(e.target.checked)} className="h-4 w-4 text-[#295A47] focus:ring-[#295A47] border-gray-300 rounded" />
                        <label htmlFor="whatsappSame" className="text-gray-700 text-sm">WhatsApp is same as phone</label>
                    </div>
                    {!whatsappSameAsPhone && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <input type="text" placeholder="WhatsApp Number (10 digits) *" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="p-3 border border-gray-300 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-[#295A47]" />
                        </motion.div>
                    )}
                    <button onClick={handleSubmit} disabled={!isValid || isSubmitting} className={`w-full py-3 mt-4 rounded-lg transition-all duration-300 font-semibold text-lg ${isValid && !isSubmitting ? 'bg-[#295A47] text-white cursor-pointer hover:bg-[#1e4c3a] active:scale-[0.98] shadow-lg hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-md'}`}>
                        {isSubmitting ? 'Submitting...' : 'View Prices Now'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const SuccessModal = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 1500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /> 
                <StyledHeading level="h2" className="text-2xl text-center">Now Enjoy Our Price Comparison Feature!</StyledHeading>
            </motion.div>
        </div>
    );
};

const CompareQuotation: FC = () => {
    const params = useParams();
    const [isVerified, setIsVerified] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
    const initialBHK = bhkOptions.includes(typeParam?.toLowerCase() ?? "") ? typeParam?.toLowerCase() ?? "1bhk" : "1bhk";

    const [selectedBHK, setSelectedBHK] = useState({ essential: initialBHK, premium: initialBHK, luxury: initialBHK });

    useEffect(() => {
        if (typeParam && bhkOptions.includes(typeParam.toLowerCase())) {
            const newBhk = typeParam.toLowerCase();
            setSelectedBHK({ essential: newBhk, premium: newBhk, luxury: newBhk });
        }
    }, [typeParam]);
    
    // *** FIX: Added useEffect for scroll locking ***
    useEffect(() => {
        // When the modal is open (!isVerified), disable scrolling.
        if (!isVerified) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup function to restore scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isVerified]);

    const handleBhkChange = (category: string, value: string) => {
        setSelectedBHK(prevState => ({ ...prevState, [category]: value }));
    };

    const handleSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setIsVerified(true);
            setShowSuccess(false);
        }, 1500);
    };

    const allCardsHaveData = categories.every(cat => {
        const currentBHK = selectedBHK[cat as keyof typeof selectedBHK];
        return !!quotationData[currentBHK]?.[cat as keyof QuotationCategory];
    });

    return (
        <div className="relative">
            <AnimatePresence>
                {!isVerified && !showSuccess && <DetailsCaptureModal onSuccess={handleSuccess} />}
                {showSuccess && <SuccessModal onClose={() => {}} />}
            </AnimatePresence>
            
            <div className={`pt-24 px-4 bg-[#D2EBD0] min-h-screen font-sans pb-24 transition-filter duration-500 ${!isVerified ? 'blur-lg pointer-events-none' : ''}`}>
                <StyledHeading level="h2" className="text-3xl md:text-6xl mb-4 text-center drop-shadow-lg">
                    {typeParam ? `Compare ${typeParam.toUpperCase()} Packages` : "Compare Packages"}
                </StyledHeading>
                <h3 className="text-xl md:text-2xl mb-8 text-center text-[#00423D]">
                    Essential, Premium, & Luxury Options
                </h3>
                <div className={`grid md:grid-cols-1 lg:grid-cols-3 gap-8 ${!allCardsHaveData ? 'lg:items-start' : ''}`}>
                    {categories.map((cat) => {
                        const currentBHK = selectedBHK[cat as keyof typeof selectedBHK];
                        const data = quotationData[currentBHK]?.[cat as keyof QuotationCategory] as PackageDetails | undefined;
                        return (
                            <QuotationCard
                                key={cat}
                                category={cat}
                                selectedBHK={currentBHK}
                                onBhkChange={(e) => handleBhkChange(cat, e.target.value)}
                                allBhkOptions={bhkOptions}
                                data={data}
                                styles={categoryStyles[cat]}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CompareQuotation;
