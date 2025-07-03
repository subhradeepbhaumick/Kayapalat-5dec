export interface PricePackage {
  essential: number;
  comfort: number;
  luxury: number;
}

export const ROOM_BASE_PRICES: Record<string, PricePackage> = {
  livingRoom: { essential: 150000, comfort: 195000, luxury: 240000 },
  bedroom: { essential: 120000, comfort: 156000, luxury: 192000 },
  kitchen: { essential: 200000, comfort: 260000, luxury: 320000 },
  bathroom: { essential: 80000, comfort: 104000, luxury: 128000 },
  kidsRoom: { essential: 100000, comfort: 130000, luxury: 160000 },
};

// Accessories per room with 3-tier pricing
export const ACCESSORY_PRICES: Record<
  string,
  Record<string, PricePackage>
> = {
  livingRoom: {
    "TV Unit": { essential: 30000, comfort: 39000, luxury: 48000 },
    "Sofa Set": { essential: 50000, comfort: 65000, luxury: 80000 },
    "Center Table": { essential: 15000, comfort: 19500, luxury: 24000 },
    "Shoe Rack": { essential: 10000, comfort: 13000, luxury: 16000 },
    "Pooja Unit": { essential: 20000, comfort: 26000, luxury: 32000 },
    "Bookshelf": { essential: 18000, comfort: 23400, luxury: 28800 },
    "Chandelier": { essential: 12000, comfort: 15600, luxury: 19200 },
    "Wall Painting": { essential: 8000, comfort: 10400, luxury: 12800 },
    "Accent Chair": { essential: 16000, comfort: 20800, luxury: 25600 },
    "Curtains": { essential: 7000, comfort: 9100, luxury: 11200 },
  },
  bedroom: {
    "Wardrobe": { essential: 35000, comfort: 45500, luxury: 56000 },
    "Bed": { essential: 40000, comfort: 52000, luxury: 64000 },
    "Study Table": { essential: 25000, comfort: 32500, luxury: 40000 },
    "Side Table": { essential: 8000, comfort: 10400, luxury: 12800 },
    "Dressing Table": { essential: 18000, comfort: 23400, luxury: 28800 },
    "Wall Lamp": { essential: 6000, comfort: 7800, luxury: 9600 },
    "Bookshelf": { essential: 14000, comfort: 18200, luxury: 22400 },
    "Rug": { essential: 4000, comfort: 5200, luxury: 6400 },
    "AC Unit": { essential: 25000, comfort: 32500, luxury: 40000 },
    "Curtains": { essential: 7000, comfort: 9100, luxury: 11200 },
  },
  kitchen: {
    "Cabinets": { essential: 80000, comfort: 104000, luxury: 128000 },
    "Countertop": { essential: 50000, comfort: 65000, luxury: 80000 },
   " Appliances": { essential: 70000, comfort: 91000, luxury: 112000 },
    "Sink": { essential: 15000, comfort: 19500, luxury: 24000 },    
    "Dishwasher": { essential: 35000, comfort: 45500, luxury: 56000 },
    "Island Table": { essential: 30000, comfort: 39000, luxury: 48000 },
    "Wall Tiles": { essential: 20000, comfort: 26000, luxury: 32000 },
    "Exhaust Fan": { essential: 6000, comfort: 7800, luxury: 9600 },
    "Chimney": { essential: 12000, comfort: 15600, luxury: 19200 },
    "Water Purifier": { essential: 12000, comfort: 15600, luxury: 19200 },
  },
  dining: {
    "Table": { essential: 30000, comfort: 39000, luxury: 48000 },
    "Chairs": { essential: 15000, comfort: 19500, luxury: 24000 },
    "Cutler Set": { essential: 50000, comfort: 65000, luxury: 80000 },
    "Table Lamp": { essential: 10000, comfort: 13000, luxury: 16000 },
    "Table Decor": { essential: 8000, comfort: 10400, luxury: 12800 },
    "Wall Painting": { essential: 8000, comfort: 10400, luxury: 12800 },
    "Curtains": { essential: 7000, comfort: 9100, luxury: 11200 },
  },
  bathroom: {
    "Vanity": { essential: 25000, comfort: 32500, luxury: 40000 },
    "Shower": { essential: 20000, comfort: 26000, luxury: 32000 },
    "Mirror": { essential: 8000, comfort: 10400, luxury: 12800 },
    "Exhaust Fan": { essential: 6000, comfort: 7800, luxury: 9600 },
    "Cabinets": { essential: 12000, comfort: 15600, luxury: 19200 },
    "Heater": { essential: 18000, comfort: 23400, luxury: 28800 },
    "Soap Dispenser": { essential: 3000, comfort: 3900, luxury: 4800 },
    "Towel Hanger": { essential: 2000, comfort: 2600, luxury: 3200 },
    "Rug": { essential: 4000, comfort: 5200, luxury: 6400 },
    "Curtains": { essential: 7000, comfort: 9100, luxury: 11200 },
  },
  kids: {
    "Play Area": { essential: 30000, comfort: 39000, luxury: 48000 },
    "Toy Storage": { essential: 20000, comfort: 26000, luxury: 32000 },
    "Blackboard Wall": { essential: 10000, comfort: 13000, luxury: 16000 },
    "Study Desk": { essential: 15000, comfort: 19500, luxury: 24000 },
    "Wall Stickers": { essential: 3000, comfort: 3900, luxury: 4800 },
    "Kids Swing": { essential: 16000, comfort: 20800, luxury: 25600 },
    "Tent House": { essential: 12000, comfort: 15600, luxury: 19200 },
    "Glow Lights": { essential: 6000, comfort: 7800, luxury: 9600 },
  },
};

export const FEATURE_PRICES: Record<string, PricePackage> = {
  falseCeiling: { essential: 25000, comfort: 32500, luxury: 40000 },
  loft: { essential: 35000, comfort: 45500, luxury: 56000 },
};
