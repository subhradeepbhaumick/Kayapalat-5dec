'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Pencil, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { ClientReview } from '@/types/index';
import { TestimonialsForm } from './TestimonialsForm.tsx';
import { ViewTestimonialModal } from './ViewTestimonialModal.tsx';

export function TestimonialsTable() {
    const [testimonials, setTestimonials] = useState<ClientReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    // State for Delete Dialog
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null);

    // State for Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [testimonialToEdit, setTestimonialToEdit] = useState<ClientReview | null>(null);

    // State for View Modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [testimonialToView, setTestimonialToView] = useState<ClientReview | null>(null);

    const fetchTestimonials = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = `/api/client-reviews?search=${debouncedSearchTerm}&rating=${selectedRating}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch testimonials');
            const data = await response.json();
            setTestimonials(data);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedRating]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const handleDeleteClick = (testimonialId: number) => {
        setTestimonialToDelete(testimonialId);
        setIsAlertOpen(true);
    };

    const handleEditClick = (testimonial: ClientReview) => {
        setTestimonialToEdit(testimonial);
        setIsEditModalOpen(true);
    };

    const handleViewClick = (testimonial: ClientReview) => {
        setTestimonialToView(testimonial);
        setIsViewModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!testimonialToDelete) return;
        try {
            const response = await fetch(`/api/client-reviews/${testimonialToDelete}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete the testimonial.');
            fetchTestimonials();
            toast.success("The testimonial has been deleted.");
        } catch (err: any) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setIsAlertOpen(false);
            setTestimonialToDelete(null);
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        ));
    };

    return (
        <>
            <div className="rounded-lg border bg-white/70 text-card-foreground shadow-sm p-4">
                {/* Search Bar and Filters */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={selectedRating === "" ? "all" : selectedRating}
                        onValueChange={(value) => setSelectedRating(value === "all" ? "" : value)}
                    >
                        <SelectTrigger className="w-[200px] bg-[#00423D]/15 z-10 hover:bg-[#00423D]/25 active:bg-[#00423D]/35 transition-colors duration-200">
                            <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>

                        <SelectContent position="popper" className="bg-white border border-gray-200 shadow-lg">
                            <SelectItem value="all" className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer">
                                All Ratings
                            </SelectItem>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <SelectItem key={rating} value={rating.toString()} className="hover:bg-[#00423D]/10 focus:bg-[#00423D]/15 data-[state=checked]:bg-[#00423D]/20 data-[state=checked]:text-[#00423D] data-[state=checked]:font-medium transition-colors duration-150 cursor-pointer">
                                    {rating} Star{rating > 1 ? 's' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[80px] px-4">Image</TableHead>
                                <TableHead className="w-[20%] px-4">Name</TableHead>
                                <TableHead className="px-4">Rating</TableHead>
                                <TableHead className="w-[40%] px-4">Message</TableHead>
                                <TableHead className="px-4">Date</TableHead>
                                <TableHead className="text-left px-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell></TableRow>
                            ) : testimonials.length > 0 ? (
                                testimonials.map((testimonial) => (
                                    <TableRow key={testimonial.id} className="hover:bg-muted/50">
                                        <TableCell className="p-2 px-4">
                                            <Image
                                                src={testimonial.profileImage || 'https://placehold.co/400x400/e2e8f0/e2e8f0?text=.'}
                                                alt={testimonial.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full object-cover aspect-square"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground px-4">{testimonial.name}</TableCell>
                                        <TableCell className="px-4">
                                            <div className="flex">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-4">
                                            {testimonial.message.length > 100 ? `${testimonial.message.substring(0, 100)}...` : testimonial.message}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-4">{new Date(testimonial.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="px-4">
                                            <div className="flex items-center space-x-4">
                                                <button onClick={() => handleViewClick(testimonial)} className="text-blue-600 hover:text-blue-900 transition-colors" aria-label="View testimonial">
                                                    <Eye className="h-7 w-7 pt-2" />
                                                </button>
                                                <button onClick={() => handleEditClick(testimonial)} className="text-yellow-600 hover:text-yellow-900 transition-colors" aria-label="Edit testimonial">
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(parseInt(testimonial.id))} className="text-red-600 hover:text-red-900 transition-colors" aria-label="Delete testimonial">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={6} className="h-24 text-center">No testimonials found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900 mb-2">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-600">This action cannot be undone. This will permanently delete this testimonial.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-end space-x-2 mt-6">
                        <AlertDialogCancel onClick={() => setIsAlertOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Modal */}
            <TestimonialsForm
                mode='edit'
                testimonial={testimonialToEdit}
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSave={fetchTestimonials}
            />

            {/* View Modal */}
            <ViewTestimonialModal
                testimonial={testimonialToView}
                isOpen={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
            />
        </>
    );
}
