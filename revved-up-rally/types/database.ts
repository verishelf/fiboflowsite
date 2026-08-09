export type ApplicationStatus = "pending" | "approved" | "rejected" | "waitlisted";
export type MemberStatus = "pending_payment" | "active" | "expired" | "suspended";
export type GalleryCategory = "rallies" | "cars" | "people" | "destinations" | "lifestyle";
export type SponsorCategory =
  | "automotive"
  | "performance"
  | "luxury"
  | "travel"
  | "hospitality"
  | "technology"
  | "lifestyle";
export type PartnerCategory =
  | "hotels"
  | "restaurants"
  | "detailing"
  | "performance_shops"
  | "dealerships"
  | "automotive_brands"
  | "luxury_lifestyle"
  | "travel"
  | "photography"
  | "media";

export interface MembershipPlanRow {
  id: string;
  name: string;
  price_annual: number;
  stripe_price_id: string | null;
  badge: string | null;
  description: string | null;
  features: string[];
  sort_order: number;
}

export interface Rally {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  route: string;
  start_location: string;
  end_location: string;
  distance: string | null;
  duration: string | null;
  experience_level: string | null;
  year: number;
  start_date: string | null;
  end_date: string | null;
  hero_image: string | null;
  card_image: string | null;
  vehicle_requirements: string | null;
  whats_included: string[];
  hotels: unknown[];
  stops: unknown[];
  experiences: unknown[];
  schedule: unknown[];
  route_waypoints: { lat: number; lng: number; label: string }[];
  published: boolean;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string;
  featured: boolean;
  sort_order: number;
}

export interface Sponsor {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  category: SponsorCategory;
  featured: boolean;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  category: PartnerCategory;
  benefits: string | null;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  caption: string | null;
  image_url: string;
  category: GalleryCategory;
  featured: boolean;
}

export interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  instagram: string | null;
  occupation: string | null;
  company: string | null;
  hear_about_us: string | null;
  vehicle_info: Record<string, unknown>;
  membership_plan_id: string;
  application_answers: Record<string, unknown>;
  emergency_contact: Record<string, unknown>;
  status: ApplicationStatus;
  admin_notes: string | null;
  stripe_checkout_session_id: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string | null;
  application_id: string | null;
  membership_plan_id: string;
  status: MemberStatus;
  membership_number: string | null;
  joined_at: string | null;
  expiration_date: string | null;
  stripe_customer_id: string | null;
  profile: Record<string, unknown>;
}

export interface Vehicle {
  id: string;
  member_id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  color: string | null;
  horsepower: number | null;
  engine: string | null;
  photo_url: string | null;
  is_primary: boolean;
}

export interface Message {
  id: string;
  member_id: string;
  subject: string;
  body: string;
  is_from_admin: boolean;
  read_at: string | null;
  created_at: string;
}

export interface RallyRegistration {
  id: string;
  rally_id: string;
  member_id: string;
  vehicle_id: string | null;
  status: string;
  rally?: Rally;
}
