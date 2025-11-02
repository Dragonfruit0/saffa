import type { Package, Testimonial } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) {
    return { imageUrl: '', imageHint: '' };
  }
  return { imageUrl: img.imageUrl, imageHint: img.imageHint };
}

export const featuredPackages: Package[] = [];

export const testimonials: Testimonial[] = [];
