import type { Package, Testimonial } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) {
    return { imageUrls: [] };
  }
  return { imageUrls: [img.imageUrl] };
}

export const featuredPackages: Package[] = [];

export const testimonials: Testimonial[] = [];
