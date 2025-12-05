// File: src/app/admin/blogs/_components/BlogForm.tsx

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, UploadCloud, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

// --- TYPE DEFINITIONS ---
interface BlogData {
  id?: number;
  title: string;
  slug: string;
  image: string;
  content: string;
  excerpt: string;
  meta_description: string;
  status: 'published' | 'draft';
  category_id: number | null;
  is_featured: 0 | 1;
  tag_ids: number[];
}
interface Category { id: number; name: string; }
interface Tag { id: number; name: string; }
interface BlogFormProps {
  mode: 'create' | 'edit';
  blog?: Partial<BlogData> | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: () => void;
}

const emptyFormData: BlogData = {
    title: '', slug: '', image: '', content: '<p></p>', excerpt: '',
    meta_description: '', status: 'draft', category_id: null,
    is_featured: 0, tag_ids:[],
};

export function BlogForm({ mode, blog, isOpen, onOpenChange, onSave }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogData>(emptyFormData);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const originalImageUrl = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch('/api/blogs/blog_categories', { credentials: 'include' }),
          fetch('/api/blogs/tags', { credentials: 'include' })
        ]);
        setAllCategories(await catRes.json());
        setAllTags(await tagRes.json());
      } catch (error: any) { toast.error("Failed to load form metadata."); }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchBlogForEdit = async (blogId: number) => {
      setIsLoadingData(true);
      try {
        const res = await fetch(`/api/blogs/${blogId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch blog details');
        const fullBlogData = await res.json();
        setFormData({ ...emptyFormData, ...fullBlogData, tag_ids: fullBlogData.tag_ids || [] });
        setImagePreview(fullBlogData.image || null);
        originalImageUrl.current = fullBlogData.image || null;
      } catch (error: any) {
        toast.error(error.message);
        onOpenChange(false);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isOpen) {
        if (mode === 'edit' && blog?.id) {
            fetchBlogForEdit(blog.id);
        } else {
            setFormData(emptyFormData);
            setImagePreview(null);
            originalImageUrl.current = null;
        }
        setSelectedFile(null);
    }
  }, [isOpen, mode, blog, onOpenChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSelectChange = (name: string, value: string) => setFormData(p => ({ ...p, [name]: ['category_id', 'is_featured'].includes(name) ? Number(value) : value }));
  const handleContentChange = (content: string) => setFormData(p => ({ ...p, content }));
  const handleTagChange = (tagId: number) => 
    setFormData(p => {
        const currentTagIds = Array.isArray(p.tag_ids) ? p.tag_ids : [];
        return {
            ...p, 
            tag_ids: currentTagIds.includes(tagId) 
                ? currentTagIds.filter(id => id !== tagId) 
                : [...currentTagIds, tagId]
        };
    });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const removeSelectedImage = () => {
      setSelectedFile(null);
      setImagePreview(originalImageUrl.current);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || formData.content === '<p></p>' || !formData.excerpt || !formData.category_id) {
        toast.error('Please fill out all required fields: Title, Content, Excerpt, and Category.');
        return;
    }
    if (!imagePreview) {
        toast.error('A lead image is required.');
        return;
    }

    setIsSubmitting(true);
    let finalImageUrl = imagePreview;

    try {
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedFile);
        const uploadResponse = await fetch('/api/blogs/upload', { method: 'POST', body: imageFormData, credentials: 'include' });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || 'Image upload failed.');
        finalImageUrl = uploadResult.path;
      }
      
      const finalBlogData = { ...formData, image: finalImageUrl, user_id: 1 };

      const apiEndpoint = mode === 'edit' ? `/api/blogs/${blog?.id}` : '/api/blogs';
      const apiMethod = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(apiEndpoint, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalBlogData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${mode} blog post.`);
      }

      toast.success(`Blog ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      onSave();
      onOpenChange(false);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const dialogTitle = useMemo(() => mode === 'edit' ? 'Edit Blog Post' : 'Add New Blog Post', [mode]);
  const buttonText = useMemo(() => mode === 'edit' ? 'Save Changes' : 'Publish New Blog', [mode]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[95vh] flex flex-col bg-white">
        <DialogHeader><DialogTitle>{dialogTitle}</DialogTitle></DialogHeader>

        {isLoadingData ? (<div className="flex-grow flex items-center justify-center"><p>Loading Blog Data...</p></div>) : (
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-6 pl-2 space-y-6">
          <div>
            <Label>Lead Image</Label>
            <div className="mt-2 aspect-video w-full relative rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center group bg-slate-50">
                {imagePreview ? (
                    <>
                        <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} className="rounded-lg" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-white flex items-center gap-2 p-2 bg-black/50 rounded-lg hover:bg-black/70"><Pencil className="w-4 h-4"/> Change</button>
                        </div>
                        {selectedFile && <button type="button" onClick={removeSelectedImage} className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-gray-800 hover:bg-white"><X className="w-4 h-4"/></button>}
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
            <div><Label htmlFor="title">Title <span className="text-red-500 m-2">*</span></Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} /></div>
            <div><Label htmlFor="slug" className='m-2'>URL Slug (optional)</Label><Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="auto-generated-from-title" className='m-2' /></div>
          </div>
          <div><Label htmlFor="excerpt">Excerpt <span className="text-red-500 m-2">*</span></Label><Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={3} /></div>
          
          <div>
            <Label>Content <span className="text-red-500">*</span></Label>
            {isOpen && (
                <SimpleEditor
                    key={formData.id || 'create-new'}
                    content={formData.content}
                    onChange={(html: string) => {
                        handleContentChange(html);
                    }}
                />
            )}
          </div>

          <div><Label htmlFor="meta_description" className='m-2'>Meta Description (for SEO)</Label><Textarea id="meta_description" name="meta_description" value={formData.meta_description} onChange={handleInputChange} rows={3} /></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="category_id">Category <span className="text-red-500 m-2">*</span></Label>
              <Select name="category_id" value={formData.category_id ? String(formData.category_id) : ''} onValueChange={(value) => handleSelectChange('category_id', value)}>
                <SelectTrigger className='bg-[#00423D]/15 z-10 hover:bg-[#00423D]/25 active:bg-[#00423D]/35 transition-colors duration-200'>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white border shadow-lg">
                  {allCategories.map(cat => <SelectItem key={cat.id} value={String(cat.id)} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer" >{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className='m-2'>Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className='bg-[#00423D]/15 z-10 hover:bg-[#00423D]/25 active:bg-[#00423D]/35 transition-colors duration-200'>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white border shadow-lg">
                  <SelectItem value="published" className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer">Published</SelectItem>
                  <SelectItem value="draft" className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="is_featured" className="m-2 ">Featured Post?</Label>
              <Select name="is_featured" value={String(formData.is_featured)} onValueChange={(value) => handleSelectChange('is_featured', value)}>
                <SelectTrigger className='bg-[#00423D]/15 z-10 hover:bg-[#00423D]/25 active:bg-[#00423D]/35 transition-colors duration-200'>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white border shadow-lg">
                  <SelectItem value="1" className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer">Yes</SelectItem>
                  <SelectItem value="0" className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
    <Label>Tags</Label>
    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 p-4 border rounded-lg max-h-48 overflow-y-auto">
        {allTags?.map(tag => {
            return (
                <div key={tag.id} className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id={`tag-${tag.id}`} 
                        checked={formData.tag_ids?.includes(tag.id)} 
                        onChange={() => handleTagChange(tag.id)} 
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="font-normal cursor-pointer">
                        {tag.name}
                    </Label>
                </div>
            );
        })}
    </div>
</div>
          
          <DialogFooter className="sticky bottom-0 bg-white py-4 mt-4 -mx-2">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
              {isSubmitting ? 'Saving...' : buttonText}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}