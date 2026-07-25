export type TestimonialRow = {
  id: string;
  content: string;
  authorName: string;
  petName: string | null;
  rating: number;
  published: boolean;
  createdAt: string;
};
