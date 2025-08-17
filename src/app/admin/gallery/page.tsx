// File: src/app/admin/gallery/page.tsx
'use client';

import { useState } from 'react';
import { PlusCircle, Folder, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { GalleryImageTable } from '@/components/GalleryImageTable';
import { ManageGalleryCategoriesModal } from '@/components/ManageGalleryCategoriesModal';
import { GalleryImageForm } from '@/components/GalleryImageForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ManageGalleryPage() {
  const router = useRouter();
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isImageFormOpen, setIsImageFormOpen] = useState(false);

  // This function is called when the form successfully saves an image
  const handleSaveSuccess = () => {
    // We don't need router.refresh() here because the table component re-fetches its own data
  };

  return (
    <div className="p-6 md:p-8 bg-[#D2EBD0] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Gallery</h1>
          <p className="text-muted-foreground">A list of all images in your gallery.</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#00423D]/15 border-[#00423D] border shadow-lg cursor-pointer text-[#00423D] hover:bg-[#00423D]/25 active:bg-[#00423D]/35">
              <Settings className="mr-2 h-4 w-4" /> Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem onSelect={() => setIsImageFormOpen(true)} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 cursor-pointer">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add New Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsCategoriesModalOpen(true)} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 cursor-pointer">
              <Folder className="mr-2 h-4 w-4" />
              <span>Manage Categories</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* The main table that displays all gallery images */}
      <GalleryImageTable />

      {/* Modal for managing categories */}
      <ManageGalleryCategoriesModal 
        isOpen={isCategoriesModalOpen} 
        onOpenChange={setIsCategoriesModalOpen} 
      />

      {/* Modal for adding a new image */}
      <GalleryImageForm 
        isOpen={isImageFormOpen} 
        onOpenChange={setIsImageFormOpen} 
        onSave={handleSaveSuccess} 
      />
    </div>
  );
}
