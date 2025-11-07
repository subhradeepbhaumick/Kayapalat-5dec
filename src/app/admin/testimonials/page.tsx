'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { TestimonialsTable } from '@/components/TestimonialsTable.tsx';
import { TestimonialsForm } from '@/components/TestimonialsForm.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function ManageTestimonialsPage() {
  const router = useRouter();
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);

  const handleSaveSuccess = () => {
    router.refresh();
  };

  return (
    <div className="p-6 md:p-8 bg-[#D2EBD0] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Testimonials</h1>
          <p className="text-muted-foreground">A list of all client testimonials in your site.</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#00423D]/15 border-[#00423D] border shadow-lg cursor-pointer  text-[#00423D] hover:bg-[#00423D]/25 active:bg-[#00423D]/35">
              <PlusCircle className="mr-2 h-4 w-4" /> Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem onSelect={() => setIsTestimonialFormOpen(true)} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 cursor-pointer">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add New Testimonial</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      <TestimonialsTable />

      <TestimonialsForm mode="create" isOpen={isTestimonialFormOpen} onOpenChange={setIsTestimonialFormOpen} onSave={handleSaveSuccess} />
    </div>
  );
}
