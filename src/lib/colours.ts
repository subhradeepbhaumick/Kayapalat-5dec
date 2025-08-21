// File: src/lib/colors.ts

// A simple hashing function to convert a string into a number
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

// A predefined palette of subtle, professional colors
const colorPalette = [
  // Tailwind CSS color classes for background and text
  { bg: 'bg-teal-100', text: 'text-teal-800' },
  { bg: 'bg-sky-100', text: 'text-sky-800' },
  { bg: 'bg-violet-100', text: 'text-violet-800' },
  { bg: 'bg-rose-100', text: 'text-rose-800' },
  { bg: 'bg-amber-100', text: 'text-amber-800' },
  { bg: 'bg-lime-100', text: 'text-lime-800' },
  { bg: 'bg-cyan-100', text: 'text-cyan-800' },
];

/**
 * Gets a consistent color pair from the palette based on the category name.
 * @param categoryName - The name of the category (e.g., "Living Room").
 * @returns An object with `bg` and `text` Tailwind CSS classes.
 */
export const getCategoryColor = (categoryName: string | undefined | null): { bg: string; text: string } => {
  if (!categoryName) {
    return colorPalette[0]; // Default color
  }
  const hash = stringToHash(categoryName);
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};
