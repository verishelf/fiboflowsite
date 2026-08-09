import type {
  Destination,
  GalleryItem,
  Partner,
  Rally,
  Sponsor,
} from "@/types/database";

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const SEED_RALLIES: Rally[] = [
  {
    id: "1",
    slug: "revved-up-west",
    name: "REVVED UP WEST",
    tagline: "Desert highways. Neon horizons.",
    description:
      "A cinematic journey from the Pacific coast to the desert lights of Las Vegas.",
    route: "Los Angeles → Las Vegas",
    start_location: "Los Angeles, CA",
    end_location: "Las Vegas, NV",
    distance: "270 miles",
    duration: "3 Days",
    experience_level: "Intermediate",
    year: 2027,
    start_date: "2027-04-15",
    end_date: "2027-04-17",
    hero_image: unsplash("photo-1503376780353-7e6692767b70"),
    card_image: unsplash("photo-1492144534655-ae79c964c9d7"),
    vehicle_requirements: "Performance or exotic vehicles. Minimum 400 HP recommended.",
    whats_included: [
      "Curated route & navigation",
      "Luxury hotel accommodations",
      "Welcome reception & farewell dinner",
      "Professional photography",
      "Concierge support",
    ],
    hotels: [
      { name: "The Beverly Hills Hotel", location: "Los Angeles" },
      { name: "The Cosmopolitan", location: "Las Vegas" },
    ],
    stops: [
      { name: "Malibu Coast Drive", location: "Malibu, CA" },
      { name: "Desert Oasis", location: "Joshua Tree, CA" },
    ],
    experiences: [
      "Private collection viewing",
      "Sunset desert drive",
      "Members-only dinner",
    ],
    schedule: [
      { day: 1, title: "Arrival & Welcome", description: "Check-in and evening reception." },
      { day: 2, title: "The Drive", description: "Coastal and desert stages." },
      { day: 3, title: "Vegas Finale", description: "Arrival celebration." },
    ],
    route_waypoints: [
      { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
      { lat: 34.0259, lng: -118.7798, label: "Malibu" },
      { lat: 36.1699, lng: -115.1398, label: "Las Vegas" },
    ],
    published: true,
  },
  {
    id: "2",
    slug: "revved-up-coast",
    name: "REVVED UP COAST",
    tagline: "Pacific to desert elegance.",
    description: "San Diego through Palm Springs to the Scottsdale desert.",
    route: "San Diego → Palm Springs → Scottsdale",
    start_location: "San Diego, CA",
    end_location: "Scottsdale, AZ",
    distance: "450 miles",
    duration: "4 Days",
    experience_level: "Intermediate",
    year: 2027,
    start_date: "2027-06-10",
    end_date: "2027-06-13",
    hero_image: unsplash("photo-1544636331-e26879cd4d9b"),
    card_image: unsplash("photo-1583121274602-3e2820c088d8"),
    vehicle_requirements: "Performance vehicles. All makes welcome.",
    whats_included: ["Hotels", "Route guide", "Events", "Photography"],
    hotels: [],
    stops: [],
    experiences: [],
    schedule: [],
    route_waypoints: [
      { lat: 32.7157, lng: -117.1611, label: "San Diego" },
      { lat: 33.8303, lng: -116.5453, label: "Palm Springs" },
      { lat: 33.4942, lng: -111.9261, label: "Scottsdale" },
    ],
    published: true,
  },
  {
    id: "3",
    slug: "revved-up-pacific",
    name: "REVVED UP PACIFIC",
    tagline: "Where the coast meets the circuit.",
    description: "San Francisco through Monterey to the legendary Big Sur coastline.",
    route: "San Francisco → Monterey → Big Sur",
    start_location: "San Francisco, CA",
    end_location: "Big Sur, CA",
    distance: "180 miles",
    duration: "3 Days",
    experience_level: "Advanced",
    year: 2027,
    start_date: "2027-08-20",
    end_date: "2027-08-22",
    hero_image: unsplash("photo-1618843479313-40f8afb4b4d8"),
    card_image: unsplash("photo-1614162692292-7c4aaed92b23"),
    vehicle_requirements: "High-performance vehicles recommended for coastal roads.",
    whats_included: ["Hotels", "Track day access", "Route guide"],
    hotels: [],
    stops: [],
    experiences: [],
    schedule: [],
    route_waypoints: [
      { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
      { lat: 36.6002, lng: -121.8947, label: "Monterey" },
      { lat: 36.2704, lng: -121.8081, label: "Big Sur" },
    ],
    published: true,
  },
  {
    id: "4",
    slug: "revved-up-desert",
    name: "REVVED UP DESERT",
    tagline: "Red rock. Open road.",
    description: "Las Vegas through Zion to the Utah canyon country.",
    route: "Las Vegas → Zion → Utah",
    start_location: "Las Vegas, NV",
    end_location: "Utah",
    distance: "320 miles",
    duration: "4 Days",
    experience_level: "Advanced",
    year: 2027,
    start_date: "2027-10-05",
    end_date: "2027-10-08",
    hero_image: unsplash("photo-1552519507-da3b142c6e3d"),
    card_image: unsplash("photo-1580274455191-6c54558a933a"),
    vehicle_requirements: "All performance and exotic vehicles.",
    whats_included: ["Hotels", "Guided routes", "Photography"],
    hotels: [],
    stops: [],
    experiences: [],
    schedule: [],
    route_waypoints: [
      { lat: 36.1699, lng: -115.1398, label: "Las Vegas" },
      { lat: 37.2982, lng: -113.0263, label: "Zion" },
      { lat: 38.5733, lng: -109.5498, label: "Moab" },
    ],
    published: true,
  },
];

export const SEED_DESTINATIONS: Destination[] = [
  { id: "1", slug: "los-angeles", name: "Los Angeles", description: "Where automotive culture meets Hollywood glamour.", image_url: unsplash("photo-1515894206110-ae272ca0e870"), featured: true, sort_order: 1 },
  { id: "2", slug: "san-diego", name: "San Diego", description: "Coastal drives and refined luxury.", image_url: unsplash("photo-1501594907352-04cda38ebc29"), featured: true, sort_order: 2 },
  { id: "3", slug: "las-vegas", name: "Las Vegas", description: "Desert horizons and neon nights.", image_url: unsplash("photo-1581351721017-429861e94679"), featured: true, sort_order: 3 },
  { id: "4", slug: "palm-springs", name: "Palm Springs", description: "Mid-century modern meets desert roads.", image_url: unsplash("photo-1506905925346-21bda4d32df4"), featured: false, sort_order: 4 },
  { id: "5", slug: "scottsdale", name: "Scottsdale", description: "Desert luxury and open highways.", image_url: unsplash("photo-1470071459604-3b5ec3a7fe05"), featured: false, sort_order: 5 },
  { id: "6", slug: "monterey", name: "Monterey", description: "Legendary motorsport heritage.", image_url: unsplash("photo-1568605117036-5fe5e7bab0b7"), featured: true, sort_order: 6 },
  { id: "7", slug: "big-sur", name: "Big Sur", description: "The world's most dramatic coastal drive.", image_url: unsplash("photo-1506905925346-21bda4d32df4", 1200), featured: true, sort_order: 7 },
  { id: "8", slug: "napa-valley", name: "Napa Valley", description: "Wine country elegance.", image_url: unsplash("photo-1506377247727-90437911402b"), featured: false, sort_order: 8 },
  { id: "9", slug: "miami", name: "Miami", description: "Tropical luxury and Art Deco style.", image_url: unsplash("photo-1533106418989-88406c7cc8ca"), featured: false, sort_order: 9 },
  { id: "10", slug: "new-york", name: "New York", description: "Urban sophistication.", image_url: unsplash("photo-1496442226666-8d0d0e62e049"), featured: false, sort_order: 10 },
  { id: "11", slug: "newport", name: "Newport", description: "Coastal New England charm.", image_url: unsplash("photo-1507525428034-b723cf961d3e"), featured: false, sort_order: 11 },
  { id: "12", slug: "aspen", name: "Aspen", description: "Mountain luxury retreats.", image_url: unsplash("photo-1464822759844-d150baec0131"), featured: false, sort_order: 12 },
  { id: "13", slug: "dallas", name: "Dallas", description: "Big city energy, open Texas roads.", image_url: unsplash("photo-1470071459604-3b5ec3a7fe05", 1200), featured: false, sort_order: 13 },
  { id: "14", slug: "austin", name: "Austin", description: "Live music and hill country drives.", image_url: unsplash("photo-1531218150210-855cf1146463"), featured: false, sort_order: 14 },
  { id: "15", slug: "denver", name: "Denver", description: "Gateway to mountain adventures.", image_url: unsplash("photo-1464822759844-d150baec0131", 1200), featured: false, sort_order: 15 },
  { id: "16", slug: "park-city", name: "Park City", description: "Alpine luxury and scenic routes.", image_url: unsplash("photo-1519681393784-d120267933ba"), featured: false, sort_order: 16 },
];

export const SEED_SPONSORS: Sponsor[] = [
  { id: "1", name: "Velocity Motors", slug: "velocity-motors", description: "Premium automotive performance.", logo_url: null, website: "https://example.com", category: "automotive", featured: true },
  { id: "2", name: "Apex Performance", slug: "apex-performance", description: "Track-ready engineering.", logo_url: null, website: "https://example.com", category: "performance", featured: true },
  { id: "3", name: "Maison Luxe", slug: "maison-luxe", description: "Luxury lifestyle brand.", logo_url: null, website: "https://example.com", category: "luxury", featured: false },
  { id: "4", name: "Horizon Travel", slug: "horizon-travel", description: "Curated travel experiences.", logo_url: null, website: "https://example.com", category: "travel", featured: false },
  { id: "5", name: "Grand Reserve Hotels", slug: "grand-reserve", description: "Five-star hospitality.", logo_url: null, website: "https://example.com", category: "hospitality", featured: true },
  { id: "6", name: "Nexus Tech", slug: "nexus-tech", description: "Automotive technology solutions.", logo_url: null, website: "https://example.com", category: "technology", featured: false },
];

export const SEED_PARTNERS: Partner[] = [
  { id: "1", name: "The Peninsula", slug: "the-peninsula", description: "Luxury hotel partner.", logo_url: null, website: "https://example.com", category: "hotels", benefits: "Member room upgrades", featured: true },
  { id: "2", name: "Nobu", slug: "nobu", description: "Fine dining experiences.", logo_url: null, website: "https://example.com", category: "restaurants", benefits: "Priority reservations", featured: true },
  { id: "3", name: "Pristine Detail", slug: "pristine-detail", description: "Concours-level detailing.", logo_url: null, website: "https://example.com", category: "detailing", benefits: "20% member discount", featured: false },
  { id: "4", name: "Racing Dynamics", slug: "racing-dynamics", description: "Performance tuning specialists.", logo_url: null, website: "https://example.com", category: "performance_shops", benefits: "Priority scheduling", featured: false },
  { id: "5", name: "Prestige Motors", slug: "prestige-motors", description: "Exotic car dealership.", logo_url: null, website: "https://example.com", category: "dealerships", benefits: "Exclusive inventory access", featured: true },
  { id: "6", name: "Carbon Collective", slug: "carbon-collective", description: "Aftermarket performance brand.", logo_url: null, website: "https://example.com", category: "automotive_brands", benefits: "Member pricing", featured: false },
  { id: "7", name: "Atlas Voyages", slug: "atlas-voyages", description: "Luxury travel concierge.", logo_url: null, website: "https://example.com", category: "travel", benefits: "Complimentary planning", featured: false },
  { id: "8", name: "Lens & Motion", slug: "lens-motion", description: "Automotive photography.", logo_url: null, website: "https://example.com", category: "photography", benefits: "Rally photo packages", featured: true },
  { id: "9", name: "Drive Culture", slug: "drive-culture", description: "Automotive media.", logo_url: null, website: "https://example.com", category: "media", benefits: "Featured member profiles", featured: false },
  { id: "10", name: "Elite Lifestyle Co.", slug: "elite-lifestyle", description: "Luxury lifestyle services.", logo_url: null, website: "https://example.com", category: "luxury_lifestyle", benefits: "VIP access", featured: false },
];

export const SEED_GALLERY: GalleryItem[] = [
  { id: "1", title: "Desert Run", caption: "Revved Up West 2027", image_url: unsplash("photo-1503376780353-7e6692767b70"), category: "rallies", featured: true },
  { id: "2", title: "GT3 RS", caption: "Member garage", image_url: unsplash("photo-1503736334956-4c8f8e92946d"), category: "cars", featured: true },
  { id: "3", title: "Coastal Convoy", caption: "Pacific rally stage", image_url: unsplash("photo-1494976388531-d10584998cdd"), category: "rallies", featured: false },
  { id: "4", title: "The Community", caption: "Members gathering", image_url: unsplash("photo-1558618666-fcd25c85cd64"), category: "people", featured: false },
  { id: "5", title: "Big Sur", caption: "Destination highlight", image_url: unsplash("photo-1506905925346-21bda4d32df4"), category: "destinations", featured: true },
  { id: "6", title: "Night Drive", caption: "Vegas arrival", image_url: unsplash("photo-1485291571156-776cb8947aba"), category: "lifestyle", featured: false },
  { id: "7", title: "Huracán", caption: "Exotic lineup", image_url: unsplash("photo-1544636331-e26879cd4d9b"), category: "cars", featured: true },
  { id: "8", title: "Monterey", caption: "Motorsport heritage", image_url: unsplash("photo-1568605117036-5fe5e7bab0b7"), category: "destinations", featured: false },
];

export const SEED_VEHICLES = [
  { year: 2024, make: "PORSCHE", model: "911 GT3 RS", trim: "Weissach Package", color: "Arctic Grey" },
  { year: 2023, make: "LAMBORGHINI", model: "HURACÁN", trim: "STO", color: "Verde Mantis" },
  { year: 2024, make: "FERRARI", model: "296 GTB", trim: "Assetto Fiorano", color: "Rosso Corsa" },
  { year: 2024, make: "MCLAREN", model: "750S", trim: null, color: "Papaya Spark" },
  { year: 2023, make: "ASTON MARTIN", model: "VANTAGE", trim: "F1 Edition", color: "Onyx Black" },
  { year: 2024, make: "MERCEDES-AMG", model: "GT", trim: "63 S", color: "Selenite Grey" },
  { year: 2024, make: "NISSAN", model: "GT-R", trim: "NISMO", color: "Stealth Grey" },
  { year: 2023, make: "CHEVROLET", model: "CORVETTE Z06", trim: null, color: "Hypersonic Grey" },
];

export const RALLY_EXPERIENCE_STEPS = [
  {
    number: "01",
    title: "THE ARRIVAL",
    description:
      "Members arrive at a curated destination. Luxury accommodations, welcome reception, and the anticipation of what's ahead.",
    image: unsplash("photo-1563729787504-6d5d5e36c9af"),
  },
  {
    number: "02",
    title: "THE DRIVE",
    description:
      "The heart of every rally. Hand-selected roads, perfect pacing, and the symphony of exceptional machines in motion.",
    image: unsplash("photo-1492144534655-ae79c964c9d7"),
  },
  {
    number: "03",
    title: "THE DESTINATION",
    description:
      "Each rally culminates in an unforgettable location — from desert resorts to coastal hideaways.",
    image: unsplash("photo-1506905925346-21bda4d32df4"),
  },
  {
    number: "04",
    title: "THE EXPERIENCE",
    description:
      "Private events, exclusive access, and connections that extend far beyond the final checkpoint.",
    image: unsplash("photo-1558618666-fcd25c85cd64"),
  },
];

export const ABOUT_TIMELINE = [
  { title: "THE IDEA", year: "2024", description: "A vision to create something beyond traditional car clubs — an experience built for enthusiasts who demand more." },
  { title: "THE FIRST RALLY", year: "2026", description: "The inaugural Revved Up Rally brought together exceptional cars and people on the Pacific Coast." },
  { title: "THE COMMUNITY", year: "2027", description: "A growing network of members, partners, and destinations across the country." },
  { title: "THE FUTURE", year: "2028+", description: "International rallies, exclusive events, and the next chapter of automotive lifestyle." },
];

export const NAV_LINKS = [
  { href: "/#rallies", label: "RALLIES" },
  { href: "/destinations", label: "DESTINATIONS" },
  { href: "/#membership", label: "MEMBERSHIP" },
  { href: "/sponsors", label: "SPONSORS" },
  { href: "/partners", label: "PARTNERS" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/about", label: "ABOUT" },
] as const;

export const FOOTER_LINKS = [
  { href: "/#rallies", label: "Rallies" },
  { href: "/#membership", label: "Membership" },
  { href: "/destinations", label: "Destinations" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/partners", label: "Partners" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/membership-agreement", label: "Membership Agreement" },
  { href: "/code-of-conduct", label: "Code of Conduct" },
] as const;
