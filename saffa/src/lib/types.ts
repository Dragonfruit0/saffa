export type PackageCategory = 'Economy' | 'Deluxe' | 'Luxury' | 'Family' | 'Group' | 'Private';

export type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  duration: string;
  category: PackageCategory;
  distanceFromHaram: string;
  distanceFromMasjidENabawi: string;
  departureLocation: string;
  agentName?: string;
  food?: string;
  airlines?: string;
  introduction?: string;
  experience?: string;
  notice?: string;
  transparencyAndLegal?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatarUrl: string;
  avatarHint: string;
};

export type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  photoURL?: string;
  phoneNumber?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  wishlist?: string[];
  previousTrips?: string[];
  role?: 'admin';
};

export type Blog = {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string | null;
  };

export type AISearchPreference = {
  duration_days?: number;
  budget_inr?: number;
  travel_month?: string;
  accommodation_rating?: string;
  transportation_preference?: string;
};
