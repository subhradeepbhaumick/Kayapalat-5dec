// File: src/app/admin/gallery/_components/ManageGalleryCategoriesModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface Category { id: number; name: string; }

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ManageGalleryCategoriesModal({ isOpen, onOpenChange }: ManageCategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/gallery-categories');
      if (!res.ok) throw new Error('Failed to load categories');
      setCategories(await res.json());
    } catch (error) {
      toast.error('Failed to load categories.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/gallery-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!res.ok) throw new Error('Failed to add category.');
      setNewCategoryName('');
      fetchCategories(); // Refresh list
      router.refresh(); // Refresh the main page data
      toast.success('Category added!');
    } catch (error) {
      toast.error('Failed to add category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure? Deleting a category will also delete all of its images.')) return;
    try {
      const res = await fetch(`/api/gallery-categories`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category.');
      }
      fetchCategories(); // Refresh list
      router.refresh(); // Refresh the main page data
      toast.success('Category deleted!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='bg-white'>
        <DialogHeader><DialogTitle>Manage Gallery Categories</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name..."
              disabled={isSubmitting}
              className="focus-visible:ring-1 focus-visible:ring-[#00423D]"
            />
            <Button onClick={handleAddCategory} disabled={isSubmitting} className="bg-[#00423D] cursor-pointer text-white hover:bg-[#00261a]">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto p-2 rounded-md">
            {categories.length > 0 ? categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2 rounded">
                <span className="text-sm">{cat.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="h-8 w-8 hover:bg-red-100">
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )) : <p className="text-sm text-center text-gray-500 py-4">No categories found.</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
