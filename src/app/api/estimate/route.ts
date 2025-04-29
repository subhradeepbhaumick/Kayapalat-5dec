import { NextResponse } from 'next/server';

// Base costs for different room types (in INR)
const ROOM_COSTS = {
  livingRoom: 150000,
  bedroom: 120000,
  kitchen: 200000,
  bathroom: 80000,
  kidsRoom: 100000,
  falseCeiling: 50000,
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { rooms, totalArea, propertyType } = data;

    // Calculate base cost based on selected rooms
    let baseCost = 0;
    Object.entries(rooms).forEach(([room, isSelected]) => {
      if (isSelected) {
        baseCost += ROOM_COSTS[room as keyof typeof ROOM_COSTS];
      }
    });

    // Apply area multiplier
    const areaMultiplier = 
      totalArea < 500 ? AREA_MULTIPLIERS.small :
      totalArea < 1000 ? AREA_MULTIPLIERS.medium :
      AREA_MULTIPLIERS.large;

    // Apply property type multiplier
    const propertyMultiplier = PROPERTY_MULTIPLIERS[propertyType as keyof typeof PROPERTY_MULTIPLIERS];

    // Calculate final estimate
    const finalEstimate = baseCost * areaMultiplier * propertyMultiplier;

    // Add 10% buffer for contingencies
    const estimateWithBuffer = finalEstimate * 1.1;

    return NextResponse.json({
      success: true,
      estimate: Math.round(estimateWithBuffer),
      breakdown: {
        baseCost: Math.round(baseCost),
        areaMultiplier,
        propertyMultiplier,
        buffer: '10%',
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