// File: /app/admin/blogs/page.tsx
'use client';

import { useState } from 'react';
import { PlusCircle, Settings, Tag, Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { BlogTable } from '@/components/BlogTable';
import { ManageTagsModal } from '@/components/ManageTagsModal';
import { ManageCategoriesModal } from '@/components/ManageCategoriesModal';
import { BlogForm } from '@/components/BlogForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function ManageBlogsPage() {
  const router = useRouter();
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);

  const handleSaveSuccess = () => {
    router.refresh();
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Blogs</h1>
          <p className="text-muted-foreground">A list of all blog posts in your site.</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* STYLED: Applied new theme to the trigger button */}
            <Button className="bg-[#00423D]/15 border-[#00423D] border shadow-lg cursor-pointer  text-[#00423D] hover:bg-[#00423D]/25 active:bg-[#00423D]/35">
              <Settings className="mr-2 h-4 w-4" /> Actions
            </Button>
          </DropdownMenuTrigger>
          {/* STYLED: Applied new theme to the content and items */}
          <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem onSelect={() => setIsBlogFormOpen(true)} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 cursor-pointer">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add New Blog</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsTagsModalOpen(true)} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 cursor-pointer">
              <Tag className="mr-2 h-4 w-4" />
              <span>Manage Tags</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsCategoriesModalOpen(true)} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 cursor-pointer">
              <Folder className="mr-2 h-4 w-4" />
              <span>Manage Categories</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      
      <BlogTable />

      <ManageTagsModal isOpen={isTagsModalOpen} onOpenChange={setIsTagsModalOpen} />
      <ManageCategoriesModal isOpen={isCategoriesModalOpen} onOpenChange={setIsCategoriesModalOpen} />
      <BlogForm mode="create" isOpen={isBlogFormOpen} onOpenChange={setIsBlogFormOpen} onSave={handleSaveSuccess} />
    </div>
  );
}