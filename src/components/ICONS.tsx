// File: src/config/icons.ts
import React from 'react';
import { 
  // Rooms
  FaCouch, FaBed, FaBath, FaUtensils, FaChild, FaTv, FaWarehouse, FaChair,
  // Styles & Concepts
  FaLightbulb, FaSeedling, FaPalette, FaGem, FaDraftingCompass, FaStar,
  // Tools & General
  FaHardHat, FaPaintBrush, FaRulerCombined, FaBookOpen, FaKey, FaHome,
} from 'react-icons/fa';

// This is the list for your admin form (name + component for selection)
export const AVAILABLE_ICONS = [
  // --- Rooms ---
  { name: 'FaCouch', component: <FaCouch /> },      // Living Room
  { name: 'FaBed', component: <FaBed /> },          // Bedroom
  { name: 'FaUtensils', component: <FaUtensils /> },// Kitchen / Dining
  { name: 'FaBath', component: <FaBath /> },        // Bathroom
  { name: 'FaChild', component: <FaChild /> },      // Kids' Room
  { name: 'FaBookOpen', component: <FaBookOpen /> },  // Study / Office
  { name: 'FaTv', component: <FaTv /> },            // Entertainment / TV Unit
  { name: 'FaWarehouse', component: <FaWarehouse /> },// Wardrobe / Storage
  { name: 'FaChair', component: <FaChair /> },        // Seating / Dining Area

  // --- Styles & Concepts ---
  { name: 'FaGem', component: <FaGem /> },          // Luxury
  { name: 'FaStar', component: <FaStar /> },        // Premium / Featured
  { name: 'FaPalette', component: <FaPalette /> },  // Color Schemes / Palettes
  { name: 'FaLightbulb', component: <FaLightbulb /> },// Lighting / Ideas
  { name: 'FaSeedling', component: <FaSeedling /> },// Gardens / Eco-Friendly
  
  // --- Tools & General ---
  { name: 'FaPaintBrush', component: <FaPaintBrush /> },// Finishes / Painting
  { name: 'FaDraftingCompass', component: <FaDraftingCompass /> }, // Planning / Design
  { name: 'FaRulerCombined', component: <FaRulerCombined /> }, // Measurement / Space
  { name: 'FaKey', component: <FaKey /> },          // Turnkey Projects
  { name: 'FaHardHat', component: <FaHardHat /> },    // Construction / Renovation
  { name: 'FaHome', component: <FaHome /> },        // General Home
];

// This map is for dynamically rendering the icons on your public pages
export const ICON_COMPONENTS: { [key: string]: React.ReactNode } = {
  // Rooms
  FaCouch: <FaCouch className="w-4 h-4 md:w-6 md:h-6" />,
  FaBed: <FaBed className="w-4 h-4 md:w-6 md:h-6" />,
  FaUtensils: <FaUtensils className="w-4 h-4 md:w-6 md:h-6" />,
  FaBath: <FaBath className="w-4 h-4 md:w-6 md:h-6" />,
  FaChild: <FaChild className="w-4 h-4 md:w-6 md:h-6" />,
  FaBookOpen: <FaBookOpen className="w-4 h-4 md:w-6 md:h-6" />,
  FaTv: <FaTv className="w-4 h-4 md:w-6 md:h-6" />,
  FaWarehouse: <FaWarehouse className="w-4 h-4 md:w-6 md:h-6" />,
  FaChair: <FaChair className="w-4 h-4 md:w-6 md:h-6" />,
  
  // Styles & Concepts
  FaGem: <FaGem className="w-4 h-4 md:w-6 md:h-6" />,
  FaStar: <FaStar className="w-4 h-4 md:w-6 md:h-6" />,
  FaPalette: <FaPalette className="w-4 h-4 md:w-6 md:h-6" />,
  FaLightbulb: <FaLightbulb className="w-4 h-4 md:w-6 md:h-6" />,
  FaSeedling: <FaSeedling className="w-4 h-4 md:w-6 md:h-6" />,

  // Tools & General
  FaPaintBrush: <FaPaintBrush className="w-4 h-4 md:w-6 md:h-6" />,
  FaDraftingCompass: <FaDraftingCompass className="w-4 h-4 md:w-6 md:h-6" />,
  FaRulerCombined: <FaRulerCombined className="w-4 h-4 md:w-6 md:h-6" />,
  FaKey: <FaKey className="w-4 h-4 md:w-6 md:h-6" />,
  FaHardHat: <FaHardHat className="w-4 h-4 md:w-6 md:h-6" />,
  FaHome: <FaHome className="w-4 h-4 md:w-6 md:h-6" />,
  
  // Default fallback icon
  Default: <FaHome className="w-4 h-4 md:w-6 md:h-6" />,
};