// File: src/components/ManageTagsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Tag { id: number; name: string; }

interface ManageTagsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ManageTagsModal({ isOpen, onOpenChange }: ManageTagsModalProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/blogs/tags');
      const data = await res.json();
      setTags(data);
    } catch (error) {
      toast.error('Failed to load tags.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/blogs/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName }),
      });
      if (!res.ok) throw new Error('Failed to add tag.');
      setNewTagName('');
      fetchTags(); // Refresh list
      toast.success('Tag added!');
    } catch (error) {
      toast.error('Failed to add tag.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      const res = await fetch(`/api/blogs/tags/${tagId}`, { method: 'DELETE' });
      const data = await res.json(); // Always parse the JSON

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete tag.');
      }

      fetchTags(); // Refresh list on success
      toast.success('Tag deleted!');
    } catch (error: any) {
      toast.error(error.message);
    }
};
return (
  <Dialog open={isOpen} onOpenChange={onOpenChange} >
    <DialogContent className='bg-white'>
      <DialogHeader><DialogTitle>Manage Tags</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name..."
            disabled={isSubmitting}
            // STYLED: Added focus style
            className="focus-visible:ring-1 focus-visible:ring-[#00423D]"
          />
          {/* STYLED: Themed the add button */}
          <Button onClick={handleAddTag} disabled={isSubmitting} className="bg-[#00423D] cursor-pointer text-white hover:bg-[#00261a]">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto p-2  rounded-md">
          {tags.length > 0 ? tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border hover:border-[#00261a] p-2 rounded">
              <span className="text-sm">{tag.name}</span>
              {/* STYLED: Added hover effect to delete button */}
              <Button variant="ghost" size="icon" onClick={() => handleDeleteTag(tag.id)} className="h-8 w-8 hover:bg-red-100">
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )) : <p className="text-sm text-center text-gray-500 py-4">No tags found.</p>}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
}