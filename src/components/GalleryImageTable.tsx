// File: src/app/admin/gallery/_components/GalleryImageTable.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

// --- INTERFACES ---
interface GalleryImage {
    id: number;
    title: string;
    image_path: string;
    category_name: string;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

export function GalleryImageTable() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [catRes, imgRes] = await Promise.all([
                fetch('/api/gallery-categories'),
                // NOTE: We need a new API endpoint or modify the existing one to support search/filter
                fetch(`/api/gallery-images?search=${debouncedSearchTerm}&category=${selectedCategory}`)
            ]);

            if (!catRes.ok) throw new Error('Failed to fetch categories');
            setCategories(await catRes.json());
            
            if (!imgRes.ok) throw new Error('Failed to fetch images');
            setImages(await imgRes.json());

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategory]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteClick = (image: GalleryImage) => {
        setImageToDelete(image);
        setIsAlertOpen(true);
    };

    const confirmDelete = async () => {
        if (!imageToDelete) return;
        try {
            const response = await fetch(`/api/gallery-images`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: imageToDelete.id, image_path: imageToDelete.image_path }),
             });
            if (!response.ok) throw new Error('Failed to delete the image.');
            
            fetchData(); // Re-fetch data to update the table
            toast.success("The image has been deleted.");

        } catch (err: any) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setIsAlertOpen(false);
            setImageToDelete(null);
        }
    };

    return (
        <>
            <div className="rounded-lg border bg-white/70 text-card-foreground shadow-sm p-4">
                {/* Search Bar and Filters */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by image title..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}
                    >
                        <SelectTrigger className="w-[200px] bg-[#00423D]/15 z-10 hover:bg-[#00423D]/25">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-white border shadow-lg">
                            <SelectItem value="all" className="hover:bg-[#00423D]/10">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)} className="hover:bg-[#00423D]/10">
                                    {cat.name}
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
                                <TableHead className="w-[50%] px-4">Title</TableHead>
                                <TableHead className="px-4">Category</TableHead>
                                <TableHead className="px-4">Date</TableHead>
                                <TableHead className="text-left px-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
                            ) : images.length > 0 ? (
                                images.map((image) => (
                                    <TableRow key={image.id} className="hover:bg-muted/50">
                                        <TableCell className="p-2 px-4">
                                            <Image
                                                src={image.image_path || 'https://placehold.co/400x400/e2e8f0/e2e8f0?text=.'}
                                                alt={image.title}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover aspect-square"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground px-4">{image.title}</TableCell>
                                        <TableCell className="px-4">
                                            <Badge variant="outline">{image.category_name || 'N/A'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-4">{new Date(image.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="px-4">
                                            <button onClick={() => handleDeleteClick(image)} className="text-red-600 hover:text-red-900 transition-colors" aria-label="Delete image">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center">No images found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white rounded-lg shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete this image from the server and database.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
