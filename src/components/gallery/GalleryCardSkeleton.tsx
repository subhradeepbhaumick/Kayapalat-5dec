// File: src/components/gallery/GalleryCardSkeleton.tsx
export function GalleryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full bg-gray-300 aspect-[4/3]"></div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-3 w-16 bg-gray-300 rounded mt-1"></div>
            </div>
          </div>
          <div className="h-6 w-10 bg-gray-300 rounded-full"></div>
        </div>
        <div className="h-8 w-full bg-gray-300 rounded mt-4"></div>
      </div>
    </div>
  );
}
