"use client";

import React, { useState, useEffect, FC, ElementType } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// --- Type Definitions, Data, and Styles (No Changes) ---
// ... (All the interfaces, quotationData, categoryStyles, etc., remain here)
interface RoomDetails {
    count?: number;
    type: string;
    furniture: string;
    accessories: string;
    paint?: string;
    shutter?: string;
    falseCeiling?: string;
}
interface PackageDetails {
    packageName?: string;
    company?: string;
    price: string;
    size?: string;
    title?: string;
    rooms: { [roomName: string]: RoomDetails };
}
interface QuotationCategory {
    essential: PackageDetails;
    premium: PackageDetails;
    luxury: PackageDetails;
    notes?: { [key: string]: string };
}
type QuotationData = {
    [key: string]: QuotationCategory;
};
const quotationData: QuotationData = {
    "1bhk": {
        essential: {
            packageName: "Essential (1-BHK)",
            company: "KAYAPALAT",
            price: "₹ 6,70,868",
            rooms: {
                livingRoom: {
                    count: 1,
                    type: "Economy",
                    furniture: "HDF-HMR* TV Unit in Pre-Lam Finish, 3-seater Sofa, Dining Table with 4 Chairs, Pooja unit",
                    accessories: "Wallpaper, Curtains",
                    paint: "Premium Luxury Emulsion on both walls and ceiling",
                },
                kitchen: {
                    count: 1,
                    type: "Economy",
                    furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets",
                    shutter: "Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors",
                    accessories: "Hob & Chimney, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Corner Units, Tambour",
                    paint: "Premium Luxury Emulsion on both walls and ceiling",
                },
                masterBedroom: {
                    count: 1,
                    type: "Economy",
                    furniture: "2 Door HDF-HMR* Hinged Wardrobe in Pre Lam Finish, Queen Bed",
                    accessories: "Curtains, Wallpaper",
                    paint: "Premium Luxury Emulsion on both walls and ceiling",
                },
                bathroom: {
                    count: 1,
                    type: "Economy",
                    furniture: "Vanity Unit",
                    accessories: "Shower Partition, One-Piece Water Closet with Health Faucet, Shower System, Wall-Mounted Basin & Tap",
                },
            },
        },
        premium: {
            packageName: "Premium (1-BHK)",
            company: "KAYAPALAT",
            price: "₹ 11,57,768",
            rooms: {
                livingRoom: {
                    count: 1,
                    type: "Premium",
                    furniture: "BWR Ply* TV Unit in Matt Pro Lam Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit",
                    accessories: "Wallpaper, Curtains",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
                kitchen: {
                    count: 1,
                    type: "Premium",
                    furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets",
                    shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors",
                    accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
                masterBedroom: {
                    count: 1,
                    type: "Premium",
                    furniture: "Gloss Lam Sliding Wardrobe in PU Finish, Bed",
                    accessories: "Curtains, Wallpaper",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
                bathroom: {
                    count: 1,
                    type: "Premium",
                    furniture: "Vanity with Granite top & Mirror",
                    accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub",
                },
            },
        },
        luxury: {
            packageName: "Luxury (1-BHK)",
            company: "KAYAPALAT",
            price: "₹ 20,34,510",
            rooms: {
                livingRoom: {
                    count: 1,
                    type: "Luxury",
                    furniture: "BWR Ply* TV Unit in PU Matt Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit",
                    accessories: "Wallpaper, Curtains",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
                kitchen: {
                    count: 1,
                    type: "Luxury",
                    furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets",
                    shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Veneer and Ceramic, Exotic Crest Finishes",
                    accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit, Tall Units & Inbuilt Appliances, Other European Accessories & Fittings",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
                masterBedroom: {
                    count: 1,
                    type: "Luxury",
                    furniture: "BWR Ply* Sliding Wardrobe in PU Finish, Bed with Side Tables",
                    accessories: "Curtains, Wallpaper",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
                bathroom: {
                    count: 1,
                    type: "Luxury",
                    furniture: "Vanity with Granite top & Mirror",
                    accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Matt Black Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub",
                },
            },
        },
    },
    "2bhk": {
        essential: {
            packageName: "Essential (2-BHK)",
            company: "KAYAPALAT",
            price: "₹ 8,59,480",
            rooms: {
                livingRoom: {
                    count: 1,
                    type: "Economy",
                    furniture: "HDF-HMR* TV Unit in Pre-Lam Finish, 3-seater Sofa, Dining Table with 4 Chairs, Pooja unit",
                    accessories: "Wallpaper, Curtains",
                    paint: "Premium Luxury Emulsion on both walls and ceiling",
                },
                kitchen: {
                    count: 1,
                    type: "Economy",
                    furniture: "HDF/BWR cabinets",
                    shutter: "Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors",
                    accessories: "Hob & Chimney, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Corner Units, Tambour",
                    paint: "Premium Luxury Emulsion on both walls and ceiling",
                },
                masterBedroom: {
                    count: 1,
                    type: "Economy",
                    furniture: "2 Door HDF-HMR* Hinged Wardrobe in Pre Lam Finish, Queen Bed",
                    accessories: "Curtains, Wallpaper",
                    paint: "Premium Luxury Emulsion on both walls and ceiling",
                },
                bathroom: {
                    count: 2,
                    type: "Economy",
                    furniture: "Vanity Unit",
                    accessories: "Shower Partition, One-Piece Water Closet with Health Faucet, Shower System, Wall-Mounted Basin & Tap",
                },
                kidsRoom: {
                    count: 1,
                    type: "Economy",
                    furniture: "HDF-HMR* Hinged Wardrobe, Study Table in Pre Lam Finish, Single Bed",
                    accessories: "Wallpaper, Curtains",
                    paint: "Premium Luxury Emulsion on both walls and ceiling",
                },
            },
        },
        premium: {
            packageName: "Premium (2-BHK)",
            company: "KAYAPALAT",
            price: "₹ 14,32,408",
            rooms: {
                livingRoom: {
                    count: 1,
                    type: "Premium",
                    furniture: "BWR Ply* TV Unit in Matt Pro Lam Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit",
                    accessories: "Wallpaper, Curtains",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
                kitchen: {
                    count: 1,
                    type: "Premium",
                    furniture: "HDF/BWR cabinets",
                    shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors",
                    accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
                masterBedroom: {
                    count: 1,
                    type: "Premium",
                    furniture: "Gloss Lam Sliding Wardrobe in PU Finish, Bed",
                    accessories: "Curtains, Wallpaper",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
                bathroom: {
                    count: 2,
                    type: "Premium",
                    furniture: "Vanity with Granite top & Mirror",
                    accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub",
                },
                kidsRoom: {
                    count: 1,
                    type: "Premium",
                    furniture: "BWR Ply* Hinged Wardrobe, Study Table in Matt Pro Lam Finish, Single Bed",
                    accessories: "Wallpaper, Curtains",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
            },
        },
        luxury: {
            packageName: "Luxury (2-BHK)",
            company: "KAYAPALAT",
            price: "₹ 24,16,354",
            rooms: {
                livingRoom: {
                    count: 1,
                    type: "Luxury",
                    furniture: "BWR Ply* TV Unit in PU Matt Finish, 3-seater Sofa, Dining Table with 6 Chairs, Pooja unit",
                    accessories: "Wallpaper, Curtains",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
                kitchen: {
                    count: 1,
                    type: "Luxury",
                    furniture: "HDF/BWR cabinets",
                    shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Veneer and Ceramic, Exotic Crest Finishes",
                    accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit, Tall Units & Inbuilt Appliances, Other European Accessories & Fittings",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
                masterBedroom: {
                    count: 1,
                    type: "Luxury",
                    furniture: "BWR Ply* Sliding Wardrobe in PU Finish, Bed with Side Tables",
                    accessories: "Curtains, Wallpaper",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
                bathroom: {
                    count: 2,
                    type: "Luxury",
                    furniture: "Vanity with Granite top & Mirror",
                    accessories: "Shower Partition, Wall-Hung Rimless Water Closet with Matt Black Health Faucet, Shower System, Tabletop Basin & Tap, Bathtub",
                },
                kidsRoom: {
                    count: 1,
                    type: "Luxury",
                    furniture: "BWR Ply* Hinged Wardrobe, Study Table in PU Finish, Single Bed",
                    accessories: "Wallpaper, Curtains",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
            },
        },
    },
    "Moduler kitchen": {
        essential: {
            packageName: "Economy (Kitchen)",
            company: "KAYAPALAT",
            price: "₹ 1,26,000",
            size: "10 x 8",
            rooms: {
                kitchen: {
                    type: "Economy",
                    furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets",
                    shutter: "Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors",
                    accessories: "Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Corner Units, Tambour",
                    paint: "Premixture Emulsion on both walls and ceiling",
                },
            },
        },
        premium: {
            packageName: "Premium (Kitchen)",
            company: "KAYAPALAT",
            price: "₹ 2,01,500",
            size: "10 x 10",
            rooms: {
                kitchen: {
                    type: "Premium",
                    furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets",
                    shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Gloss & Matt Laminate, Premium Textured Laminate, Anti-Scratch Acrylic, Profile Glass Doors",
                    accessories: "Cutlery & Thali Storage Units, Oil/Masala Pull-Out units, Above Sink Glass & Plate rack, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit",
                    paint: "Royale Shyne on walls, Premium Luxury Emulsion on ceiling",
                },
            },
        },
        luxury: {
            packageName: "Luxury (Kitchen)",
            company: "KAYAPALAT",
            price: "₹ 6,04,062",
            size: "10 x 10",
            rooms: {
                kitchen: {
                    type: "Luxury",
                    furniture: "High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets",
                    shutter: "PU Painted Gloss and Matt, PU Painted Toughened Glass, Veneer and Ceramic, Exotic Crest Finishes",
                    accessories: "Hob & Chimney, Microwave OTG, Refrigerator, Dishwasher, Premium Drawer & Lift-ups, Premium Corner & Pantry Unit, Tall Units & Inbuilt Appliances, Other European Accessories & Fittings",
                    paint: "Royale Aspira on walls, Royale Matte on ceiling",
                },
            },
        },
    },
};
const headingStyle: React.CSSProperties = {
    WebkitTextStroke: "1px black",
    fontFamily: "'Abril Fatface', cursive",
    color: "#00423D",
};
interface StyleConfig {
    textColor: string;
    bgImage: string;
    icon: string;
    bgColor?: string;
    headerBorderColor?: string;
    buttonBgColor?: string;
    priceColor?: string;
    companyColor: string;
    detailsTextColor: string;
    detailsBorderColor?: string;
}
const categoryStyles: { [key: string]: StyleConfig } = {
    essential: {
        textColor: "text-[#00423D]",
        bgColor: "bg-[#E0F2F1]",
        headerBorderColor: "border-[#0D9276]",
        buttonBgColor: "bg-[#0D9276]",
        bgImage: "url('/compare/essential2.jpg')",
        priceColor: "text-purple-800",
        companyColor: "text-gray-600",
        detailsTextColor: "text-gray-600",
        icon: "/compare/chess2.svg",
    },
    premium: {
        textColor: "text-neutral/80",
        bgImage: "url('/compare/premimum.jpg')",
        companyColor: "text-[#FBFCF8]",
        detailsTextColor: "text-[#FBFCF8]",
        detailsBorderColor: "text-[#FBFCF8]",
        icon: "/compare/svg1.svg",
    },
    luxury: {
        textColor: "text-[#333333]",
        bgImage: "url('/compare/luxury2.jpg')",
        priceColor: "text-[#333333]",
        companyColor: "text-[#333333]",
        detailsTextColor: "text-[#333333]",
        detailsBorderColor: "text-[#333333]",
        icon: "/compare/svg2.svg",
    },
};
const categories = ["essential", "premium", "luxury"];
const bhkOptions = ["1bhk", "2bhk", "3bhk", "4bhk", "5bhk", "bungalow", "wardrobe", "Moduler kitchen", "Kids Room", "Master Bedroom", "Living Room", "Bathroom", "Study Room", "Guest Room"];
interface StyledHeadingProps {
    level?: ElementType;
    children: React.ReactNode;
    className?: string;
}

const StyledHeading: FC<StyledHeadingProps> = ({ level: Level = 'h2', children, className }) => (
    <Level
        style={{
            WebkitTextStroke: ".2px black",
            fontFamily: "'Abril Fatface', cursive",
        }}
        className={className}
    >
        {children}
    </Level>
);

// --- 1. The New QuotationCard Component (Presentational) ---

interface QuotationCardProps {
    category: string;
    selectedBHK: string;
    onBhkChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    allBhkOptions: string[];
    data: PackageDetails | undefined;
    styles: StyleConfig;
}

const QuotationCard: FC<QuotationCardProps> = ({
    category,
    selectedBHK,
    onBhkChange,
    allBhkOptions,
    data,
    styles,
}) => {
    return (
        <div
            className="rounded-2xl shadow-xl p-6 transition-transform hover:scale-105 hover:shadow-2xl flex flex-col"
            style={{
                borderColor: styles.headerBorderColor,
                backgroundImage: styles.bgImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Card Header */}
            <div
                className="flex justify-between items-center mb-4 border-b-2 pb-3"
                style={{ borderColor: styles.headerBorderColor }}
            >
                <div className="flex items-center gap-5">
                    <Image
                        src={styles.icon}
                        alt={`${category} icon`}
                        width={56}
                        height={48}
                        className="w-14 h-12"
                    />
                    <StyledHeading level="h3" className={`text-2xl capitalize ${styles.textColor} drop-shadow-md`}>
                        {category}
                    </StyledHeading>
                </div>
                <select
                    value={selectedBHK}
                    onChange={onBhkChange}
                    className="custom-select-arrow cursor-pointer appearance-none text-center border border-gray-300 rounded-xl py-2 pl-4 pr-8 sm:w-auto w-[40%] text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                    {allBhkOptions.map((opt) => (
                        <option key={opt} value={opt} className="text-center">
                            {opt.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Card Body */}
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
                                <StyledHeading level="h4" className={`${styles.textColor} text-lg mb-1`}>
                                    {room.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                </StyledHeading>
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
                <div className="flex items-center justify-center text-gray-400 text-center p-4  bg-opacity-30 rounded-lg">
                    <p className="italic text-white">Details for {selectedBHK.toUpperCase()} not available.</p>
                </div>
            )}
        </div>
    );
};

// --- 2. The Updated CompareQuotation Component (Container) ---

const CompareQuotation: FC = () => {
    const params = useParams();
    const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;

    const initialBHK = bhkOptions.includes(typeParam?.toLowerCase() ?? "")
        ? typeParam?.toLowerCase() ?? "1bhk"
        : "1bhk";

    const [selectedBHK, setSelectedBHK] = useState({
        essential: initialBHK,
        premium: initialBHK,
        luxury: initialBHK,
    });

    useEffect(() => {
        if (typeParam && bhkOptions.includes(typeParam.toLowerCase())) {
            const newBhk = typeParam.toLowerCase();
            setSelectedBHK({ essential: newBhk, premium: newBhk, luxury: newBhk });
        }
    }, [typeParam]);

    const handleBhkChange = (category: string, value: string) => {
        setSelectedBHK(prevState => ({
            ...prevState,
            [category]: value,
        }));
    };

    const bhkHeadings: { [key: string]: string } = {
        "1bhk": "1 BHK Interior Packages",
        "2bhk": "2 BHK Interior Packages",
        "3bhk": "3 BHK Interior Packages",
        "Moduler kitchen": "Modular Kitchen Packages",
        // Add other headings as needed
    };

    // ... inside CompareQuotation component, before the return statement

    // Check if every category has data for its selected BHK type
    const allCardsHaveData = categories.every(cat => {
        const currentBHK = selectedBHK[cat as keyof typeof selectedBHK];
        return !!quotationData[currentBHK]?.[cat as keyof QuotationCategory];
    });

    return (
        <div className="pt-24 px-4 bg-[#D2EBD0] min-h-screen font-sans pb-24">
            <StyledHeading level="h2" className="text-3xl md:text-6xl mb-4 text-center drop-shadow-lg">
                {bhkHeadings[typeParam?.toLowerCase() ?? ""] || "Compare  Packages"}
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
    );
};

export default CompareQuotation;