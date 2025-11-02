import type { RecommendOptimalPackagesOutput } from "@/ai/flows/recommend-optimal-packages";

export type Package = RecommendOptimalPackagesOutput[0] & {
  id: string;
  imageUrl: string;
  imageHint: string;
};

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatarUrl: string;
  avatarHint: string;
};
