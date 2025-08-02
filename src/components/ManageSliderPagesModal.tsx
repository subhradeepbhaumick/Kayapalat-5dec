// File: src/app/admin/designs/_components/ManageSliderPagesModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Page { 
  id: number;
  name: string; 
}

interface ManageSliderPagesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ManageSliderPagesModal({ isOpen, onOpenChange }: ManageSliderPagesModalProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [newPageName, setNewPageName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/slider/pages');
      setPages(await res.json());
    } catch (error) {
      toast.error('Failed to load pages.');
    }
  };

   useEffect(() => { if (isOpen) fetchPages(); }, [isOpen]);

  const handleAddPage = async () => {
    if (!newPageName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/slider/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPageName }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add page.');
      setNewPageName('');
      fetchPages();
      toast.success('Page added!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    try {
      const res = await fetch(`/api/slider/pages/${pageId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete page.');
      fetchPages();
      toast.success('Page deleted!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent  className='bg-white'>
        <DialogHeader><DialogTitle>Manage Pages</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="New page name..."
              disabled={isSubmitting}
              className="focus-visible:ring-1 focus-visible:ring-[#00423D]"
            />
            <Button onClick={handleAddPage} disabled={isSubmitting} className='bg-[#00423D] cursor-pointer text-white hover:bg-[#00261a]'>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto p-2 border rounded-md">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 hover:border hover:border-[#00261a]">
                <span className="text-sm">{page.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePage(page.id)} className="h-8 w-8 hover:bg-red-100">
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}