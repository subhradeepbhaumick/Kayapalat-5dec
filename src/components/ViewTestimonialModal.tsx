'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { ClientReview } from '@/types/index';

interface ViewTestimonialModalProps {
  testimonial: ClientReview | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ViewTestimonialModal({ testimonial, isOpen, onOpenChange }: ViewTestimonialModalProps) {
  if (!testimonial) return null;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  const convertToEmbedUrl = (url: string): string => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>View Testimonial</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            {testimonial.profileImage ? (
              <Image
                src={testimonial.profileImage}
                alt={testimonial.name}
                width={80}
                height={80}
                className="rounded-full border border-gray-400 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#295A47] text-white flex items-center justify-center font-bold text-xl">
                {testimonial.name.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="font-bold text-xl text-gray-900">{testimonial.name}</h3>
              <div className="flex mt-1">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Created: {new Date(testimonial.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
            <p className="text-gray-700 leading-relaxed">{testimonial.message}</p>
          </div>

          {/* Review Images/Videos */}
          {testimonial.reviewImages && testimonial.reviewImages.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Media</h4>
              <div className="grid grid-cols-2 gap-4">
                {testimonial.reviewImages.map((media, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden border border-gray-300">
                    {media.type === "image" ? (
                      <Image
                        src={media.url}
                        alt={`Review media ${index + 1}`}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={convertToEmbedUrl(media.url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Review video ${index + 1}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
