// File: src/app/admin/gallery/_components/GalleryImageForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { X, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

// --- TYPE DEFINITIONS ---
interface Category { id: number; name: string; }
interface GalleryImageFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: () => void;
}

export function GalleryImageForm({ isOpen, onOpenChange, onSave }: GalleryImageFormProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/gallery-categories');
        if (!res.ok) throw new Error('Failed to load categories');
        setAllCategories(await res.json());
      } catch (error: any) { toast.error("Failed to load categories."); }
    };

    if (isOpen) {
      fetchCategories();
      // Reset form state when modal opens
      setTitle('');
      setCategoryId('');
      setSelectedFile(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId || !selectedFile) {
        toast.error('Please fill out all fields: Title, Category, and select an Image.');
        return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('categoryId', categoryId);

    try {
      const response = await fetch('/api/gallery-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload image.`);
      }

      toast.success(`Image uploaded successfully!`);
      onSave();
      onOpenChange(false);
      router.refresh(); // Refresh the main page to update the table

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader><DialogTitle>Add New Gallery Image</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div>
            <Label>Image File</Label>
            <div className="mt-2 aspect-video w-full relative rounded-lg border-2 border-dashed flex items-center justify-center group bg-slate-50">
                {imagePreview ? (
                    <>
                        <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'contain' }} className="rounded-lg p-1" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg text-white">Change Image</button>
                    </>
                ) : (
                    <div className="text-center cursor-pointer p-4" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/><p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
                    </div>
                )}
                <Input id="file" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="title">Image Title <span className="text-red-500">*</span></Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Modern Bedroom Design" />
            </div>
            <div>
              <Label htmlFor="category_id">Category <span className="text-red-500">*</span></Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className='bg-[#00423D]/15 hover:bg-[#00423D]/25'>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white border shadow-lg">
                  {allCategories.map(cat => <SelectItem key={cat.id} value={String(cat.id)} className="hover:bg-[#00423D]/10">{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
              {isSubmitting ? 'Uploading...' : 'Upload Image'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
