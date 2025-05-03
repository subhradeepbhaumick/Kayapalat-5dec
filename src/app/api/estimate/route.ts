import { NextResponse } from 'next/server';

interface RoomDetails {
  size: string;
  accessories: string[];
  falseCeiling: boolean;
  additionalNotes: string;
}

interface RoomConfig {
  base: number;
  accessories: {
    [key: string]: number;
  };
  falseCeiling: number;
}

// Base costs for different room types (in INR)
const ROOM_COSTS: { [key: string]: RoomConfig } = {
  livingRoom: {
    base: 150000,
    accessories: {
      sofaSet: 50000,
      tvUnit: 30000,
      centerTable: 15000,
    },
    falseCeiling: 25000,
  },
  bedroom: {
    base: 120000,
    accessories: {
      bed: 40000,
      wardrobe: 35000,
      dressingTable: 25000,
    },
    falseCeiling: 20000,
  },
  kitchen: {
    base: 200000,
    accessories: {
      cabinets: 80000,
      countertop: 50000,
      appliances: 70000,
    },
    falseCeiling: 30000,
  },
  bathroom: {
    base: 80000,
    accessories: {
      vanity: 25000,
      shower: 20000,
      storage: 15000,
    },
    falseCeiling: 15000,
  },
  kidsRoom: {
    base: 100000,
    accessories: {
      bed: 35000,
      studyTable: 25000,
      storage: 20000,
    },
    falseCeiling: 20000,
  },
  falseCeiling: {
    base: 50000,
    accessories: {},
    falseCeiling: 0,
  },
};

// Area multipliers
const AREA_MULTIPLIERS = {
  small: 1, // < 500 sq ft
  medium: 1.2, // 500-1000 sq ft
  large: 1.5, // > 1000 sq ft
};

// Property type multipliers
const PROPERTY_MULTIPLIERS = {
  residential: 1,
  commercial: 1.3,
  office: 1.2,
};

// BHK multipliers
const BHK_MULTIPLIERS = {
  '1': 1,
  '2': 1.2,
  '3': 1.4,
  '4': 1.6,
  '5': 1.8,
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { rooms, roomDetails, propertyType, bhkType } = data;

    // Calculate base cost and room-wise breakdown
    let baseCost = 0;
    const roomBreakdown: { [key: string]: number } = {};

    Object.entries(rooms).forEach(([room, isSelected]) => {
      if (isSelected) {
        const roomConfig = ROOM_COSTS[room];
        let roomCost = roomConfig.base;

        // Add accessory costs
        if (roomDetails[room]?.accessories) {
          roomDetails[room].accessories.forEach((accessory: string) => {
            if (roomConfig.accessories[accessory]) {
              roomCost += roomConfig.accessories[accessory];
            }
          });
        }

        // Add false ceiling cost if required
        if (roomDetails[room]?.falseCeiling) {
          roomCost += roomConfig.falseCeiling;
        }

        baseCost += roomCost;
        roomBreakdown[room] = roomCost;
      }
    });

    // Apply area multiplier based on total room sizes
    const totalArea = Object.values(roomDetails as { [key: string]: RoomDetails }).reduce((sum, details) => 
      sum + (Number(details?.size) || 0), 0
    );

    const areaMultiplier = 
      totalArea < 500 ? AREA_MULTIPLIERS.small :
      totalArea < 1000 ? AREA_MULTIPLIERS.medium :
      AREA_MULTIPLIERS.large;

    // Apply property type multiplier
    const propertyMultiplier = PROPERTY_MULTIPLIERS[propertyType as keyof typeof PROPERTY_MULTIPLIERS];

    // Apply BHK multiplier for residential properties
    const bhkMultiplier = propertyType === 'residential' 
      ? BHK_MULTIPLIERS[bhkType as keyof typeof BHK_MULTIPLIERS] 
      : 1;

    // Calculate final estimate
    const finalEstimate = baseCost * areaMultiplier * propertyMultiplier * bhkMultiplier;

    // Add 10% buffer for contingencies
    const estimateWithBuffer = finalEstimate * 1.1;

    // Apply multipliers to room breakdown
    Object.keys(roomBreakdown).forEach(room => {
      roomBreakdown[room] = Math.round(roomBreakdown[room] * areaMultiplier * propertyMultiplier * bhkMultiplier * 1.1);
    });

    return NextResponse.json({
      success: true,
      estimate: Math.round(estimateWithBuffer),
      breakdown: {
        baseCost: Math.round(baseCost),
        areaMultiplier,
        propertyMultiplier,
        bhkMultiplier,
        buffer: '10%',
        roomBreakdown,
      },
    });
  } catch (error) {
    console.error('Error calculating estimate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate estimate' },
      { status: 500 }
    );
  }
} 