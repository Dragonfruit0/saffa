
export type PackageCategory = 'Economy' | 'Deluxe' | 'Luxury' | 'Family' | 'Group' | 'Private';

export type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  duration: string;
  location: string;
  category: PackageCategory;
  distanceFromHaram: string;
  distanceFromMasjidENabawi: string;
  departureLocation: string;
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
};
