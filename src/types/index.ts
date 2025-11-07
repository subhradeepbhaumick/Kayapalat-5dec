export interface ClientReview {
  id: string;
  name: string;
  message: string;
  rating: 1 | 2 | 3 | 4 | 5;
  profileImage: string | null;
  reviewImages: { type: "image" | "video"; url: string }[];
  createdAt: string;
}
