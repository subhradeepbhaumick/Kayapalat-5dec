'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { X, UploadCloud, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ClientReview } from '@/types/index';

interface TestimonialsFormProps {
  mode: 'create' | 'edit';
  testimonial?: ClientReview | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: () => void;
}

const emptyFormData: Partial<ClientReview> = {
    name: '',
    message: '',
    rating: 5,
    profileImage: null,
    reviewImages: [],
};

export function TestimonialsForm({ mode, testimonial, isOpen, onOpenChange, onSave }: TestimonialsFormProps) {
  const [formData, setFormData] = useState<Partial<ClientReview>>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const originalProfileImageUrl = useRef<string | null>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedReviewFiles, setSelectedReviewFiles] = useState<File[]>([]);
  const [reviewImagesPreview, setReviewImagesPreview] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const reviewFilesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTestimonialForEdit = async (testimonialId: string) => {
      setIsLoadingData(true);
      try {
        const res = await fetch(`/api/client-reviews/${testimonialId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch testimonial details');
        const fullTestimonialData = await res.json();
        setFormData(fullTestimonialData);
        setProfileImagePreview(fullTestimonialData.profileImage || null);
        originalProfileImageUrl.current = fullTestimonialData.profileImage || null;

        // Separate images and videos
        const images = fullTestimonialData.reviewImages.filter((item: any) => item.type === 'image').map((item: any) => item.url);
        const videos = fullTestimonialData.reviewImages.filter((item: any) => item.type === 'video').map((item: any) => item.url);
        setReviewImagesPreview(images);
        setVideoUrls(videos);
      } catch (error: any) {
        toast.error(error.message);
        onOpenChange(false);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isOpen) {
        if (mode === 'edit' && testimonial?.id) {
            fetchTestimonialForEdit(testimonial.id);
        } else {
            setFormData(emptyFormData);
            setProfileImagePreview(null);
            originalProfileImageUrl.current = null;
            setReviewImagesPreview([]);
            setVideoUrls([]);
        }
        setSelectedProfileFile(null);
        setSelectedReviewFiles([]);
    }
  }, [isOpen, mode, testimonial, onOpenChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSelectChange = (name: string, value: string) => setFormData(p => ({ ...p, [name]: name === 'rating' ? Number(value) : value }));

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProfileFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const removeProfileImage = () => {
      setSelectedProfileFile(null);
      setProfileImagePreview(originalProfileImageUrl.current);
      if (profileFileInputRef.current) profileFileInputRef.current.value = "";
  };

  const handleReviewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedReviewFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setReviewImagesPreview(prev => [...prev, ...newPreviews]);
  };

  const removeReviewImage = (index: number) => {
    setSelectedReviewFiles(prev => prev.filter((_, i) => i !== index));
    setReviewImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    try {
      const urls = value.split('\n').map(url => url.trim()).filter(url => url);
      setVideoUrls(urls);
    } catch {
      setVideoUrls([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message || !formData.rating) {
        toast.error('Please fill out all required fields: Name, Message, and Rating.');
        return;
    }

    setIsSubmitting(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('message', formData.message);
      submitFormData.append('rating', formData.rating.toString());

      if (selectedProfileFile) {
        submitFormData.append('profileImage', selectedProfileFile);
      }

      selectedReviewFiles.forEach(file => {
        submitFormData.append('reviewImages', file);
      });

      if (videoUrls.length > 0) {
        submitFormData.append('videoUrls', JSON.stringify(videoUrls));
      }

      const apiEndpoint = mode === 'edit' ? `/api/client-reviews/${testimonial?.id}` : '/api/client-reviews';
      const apiMethod = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(apiEndpoint, {
        method: apiMethod,
        body: submitFormData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${mode} testimonial.`);
      }

      toast.success(`Testimonial ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      onSave();
      onOpenChange(false);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = mode === 'edit' ? 'Edit Testimonial' : 'Add New Testimonial';
  const buttonText = mode === 'edit' ? 'Save Changes' : 'Create Testimonial';
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[95vh] flex flex-col bg-gray-50 rounded-2xl shadow-2xl p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#00423D] mb-2">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Loading Testimonial Data...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-4 pl-1 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-semibold mb-1 block">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-400 bg-white/70 focus:border-[#00423D] focus:ring-1 focus:ring-[#00423D] focus:ring-offset-0 outline-none transition-all"
                />
              </div>

              <div>
                <Label htmlFor="rating" className="text-gray-700 font-semibold mb-1 block">
                  Rating <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="rating"
                  value={formData.rating?.toString()}
                  onValueChange={(value) => handleSelectChange('rating', value)}
                >
                  <SelectTrigger className="bg-white/70 border border-gray-400 rounded-lg focus:border-[#00423D] focus:ring-1 focus:ring-[#00423D] focus:ring-offset-0 outline-none transition-all">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-white border shadow-lg rounded-lg">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem
                        key={rating}
                        value={rating.toString()}
                        className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer"
                      >
                        {rating} Star{rating > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="text-gray-700 font-semibold mb-1 block">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-white/70 focus:border-[#00423D] focus:ring-1 focus:ring-[#00423D] focus:ring-offset-0 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div>
                <Label className="text-gray-700 font-semibold mb-1 block">
                  Profile Image (Optional)
                </Label>
                <div className="mt-2 aspect-square w-40 relative rounded-xl border-2 border-dashed border-gray-400/70 flex items-center justify-center group bg-white/60 hover:bg-white transition">
                  {profileImagePreview ? (
                    <>
                      <Image
                        src={profileImagePreview}
                        alt="Profile Preview"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl text-white gap-2">
                        <button
                          type="button"
                          onClick={() => profileFileInputRef.current?.click()}
                          className="text-white flex items-center gap-2 p-2 bg-black/50 rounded-lg hover:bg-black/70"
                        >
                          <Pencil className="w-4 h-4" /> Change
                        </button>
                      </div>
                      {selectedProfileFile && (
                        <button
                          type="button"
                          onClick={removeProfileImage}
                          className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-gray-800 hover:bg-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div
                      className="text-center cursor-pointer p-4"
                      onClick={() => profileFileInputRef.current?.click()}
                    >
                      <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-xs text-gray-600">Upload</p>
                    </div>
                  )}
                  <Input
                    id="profileFile"
                    type="file"
                    accept="image/*"
                    ref={profileFileInputRef}
                    onChange={handleProfileFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Review Images */}
              <div>
                <Label className="text-gray-700 font-semibold mb-1 block">
                  Review Images (Optional)
                </Label>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {reviewImagesPreview.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg border border-gray-400 overflow-hidden"
                    >
                      <Image
                        src={preview}
                        alt={`Review ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeReviewImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-gray-800 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-400/70 flex items-center justify-center cursor-pointer bg-white/60 hover:bg-white transition"
                    onClick={() => reviewFilesInputRef.current?.click()}
                  >
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <Input
                  id="reviewFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  ref={reviewFilesInputRef}
                  onChange={handleReviewFilesChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="videoUrls" className="text-gray-700 font-semibold mb-1 block">
                Video URLs (Optional)
              </Label>
              <Textarea
                id="videoUrls"
                value={videoUrls.join('\n')}
                onChange={handleVideoUrlsChange}
                placeholder="https://youtube.com/watch?v=..."
                rows={3}
                className="w-full rounded-lg border border-gray-400 bg-white/70 focus:border-[#00423D] focus:ring-1 focus:ring-[#00423D] focus:ring-offset-0 outline-none transition-all"
              />
            </div>

            <DialogFooter className="sticky bottom-0 bg-gray-50 py-4 mt-4 -mx-1 flex justify-end gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#00423D] hover:bg-[#006B63] text-white px-6 py-2 transition"
              >
                {isSubmitting ? 'Saving...' : buttonText}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
