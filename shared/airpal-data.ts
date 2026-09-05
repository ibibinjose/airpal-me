export interface PropertyInfo {
  id: string;
  name: string;
  tagline: string;
  destination: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  whatsapp: string;
  wifi: {
    network: string;
    password: string;
    speed: string;
  };
  checkIn: string;
  checkOut: string;
  breakfast: {
    hours: string;
    location: string;
    type: string;
    price: string;
  };
  facilities: {
    name: string;
    hours: string;
    floor: string;
    details: string;
    icon: string;
  }[];
  roomsCount?: number;
  status?: "active" | "trial" | "suspended";
  ownerEmail?: string;
  monthlyRevenue?: number;
  plan?: "Starter" | "Professional" | "Enterprise";
}

export type UserRole = "super_admin" | "host_admin" | "staff" | "guest";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  propertyIds?: string[];
  createdAt?: string;
}

export interface MenuItem {
  id: string;
  propertyId?: string;
  name: string;
  category: "Starters" | "Mains" | "Desserts" | "Drinks" | "Breakfast" | "Late Night";
  price: number;
  description: string;
  dietary?: string[];
  popular?: boolean;
  available?: boolean;
}

export interface LocalPlace {
  id: string;
  propertyId?: string;
  name: string;
  category: "Food & Drink" | "Sights & Culture" | "Coffee" | "Nightlife" | "Nature & Walks" | "Family";
  distance: string;
  walkTime: string;
  priceLevel: "Free" | "$" | "$$" | "$$$";
  rating: number;
  whyGo: string;
  staffPick?: boolean;
  staffNote?: string;
  address: string;
  coordinates: { lat: number; lng: number };
  badge?: string;
}

export interface BookableExperience {
  id: string;
  propertyId?: string;
  title: string;
  category: string;
  price: number;
  duration: string;
  spotsLeft: number;
  description: string;
  included: string[];
  provider: string;
  imageAccent: string;
}

export interface UpsellItem {
  id: string;
  propertyId?: string;
  title: string;
  subtitle: string;
  price: number;
  badge: string;
  iconName: string;
  category: "stay" | "dining" | "transport" | "wellness";
}

export interface DealItem extends UpsellItem {
  originalPrice?: number;
  discountBadge?: string;
  active?: boolean;
  expiresAt?: string;
  inventoryLimit?: number;
  soldCount?: number;
}

export interface StaffTicket {
  id: string;
  propertyId?: string;
  roomNumber: string;
  guestName: string;
  category: "reception" | "housekeeping" | "maintenance" | "dining" | "late_checkout";
  details: string;
  status: "pending" | "in_progress" | "resolved";
  createdAt: string;
  urgency: "normal" | "urgent";
}

export interface ItineraryStop {
  time: string;
  title: string;
  duration: string;
  type: string;
  cost: string;
  description: string;
  weatherSensitive?: boolean;
  indoorAlternative?: {
    title: string;
    type: string;
    description: string;
  };
}

export const CURRENT_PROPERTY: PropertyInfo = {
  id: "harbour-hotel",
  name: "Harbour Hotel Sydney",
  tagline: "Your Boutique Sanctuary by the Rocks",
  destination: "Sydney",
  city: "Sydney",
  country: "Australia",
  address: "64 Argyle Street, The Rocks, NSW 2000",
  phone: "+61 2 9251 4000",
  whatsapp: "+61 488 912 345",
  roomsCount: 84,
  status: "active",
  ownerEmail: "marcus@harbourhotelsydney.com.au",
  monthlyRevenue: 34200,
  plan: "Professional",
  wifi: {
    network: "HarbourHotel_Guest",
    password: "rockssydney2026",
    speed: "250 Mbps High-Speed Fibre",
  },
  checkIn: "2:00 PM",
  checkOut: "10:00 AM",
  breakfast: {
    hours: "6:30 AM – 10:30 AM",
    location: "Ground Floor Atrium Restaurant",
    type: "Artisan Buffet & Made-to-Order Hot Dishes",
    price: "$28 (or pre-book for $22)",
  },
  facilities: [
    { name: "Rooftop Plunge Pool", hours: "6:00 AM – 10:00 PM", floor: "Level 7", details: "Heated water, panoramic harbour & bridge views", icon: "Waves" },
    { name: "Fitness Centre & Sauna", hours: "24 Hours (Keycard Access)", floor: "Level 2", details: "Technogym cardio, free weights & eucalyptus sauna", icon: "Dumbbell" },
    { name: "The Rocks Cellar Bar", hours: "4:00 PM – 11:30 PM", floor: "Ground Floor", details: "Australian natural wines & craft cocktails", icon: "Wine" },
    { name: "Luggage Storage", hours: "24/7 Front Desk", floor: "Lobby", details: "Complimentary secure luggage holding pre-checkin & post-checkout", icon: "Luggage" },
    { name: "Guest Laundry & Steamer", hours: "7:00 AM – 9:00 PM", floor: "Level 3", details: "Self-service Miele washers & dryers, dry cleaning available", icon: "Shirt" },
  ],
};

export const ALL_PROPERTIES: PropertyInfo[] = [
  CURRENT_PROPERTY,
  {
    id: "bondi-breeze-suites",
    name: "Bondi Breeze Boutique Suites",
    tagline: "Coastal Luxury & Ocean Panorama",
    destination: "Sydney",
    city: "Bondi Beach",
    country: "Australia",
    address: "18 Campbell Parade, Bondi Beach, NSW 2026",
    phone: "+61 2 9130 8800",
    whatsapp: "+61 488 234 567",
    roomsCount: 28,
    status: "active",
    ownerEmail: "sophie@bondibreezesuites.com.au",
    monthlyRevenue: 18400,
    plan: "Starter",
    wifi: {
      network: "BondiBreeze_UltraFast",
      password: "surfbondi2026",
      speed: "350 Mbps Fibre",
    },
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    breakfast: {
      hours: "7:00 AM – 11:00 AM",
      location: "Ocean Deck Café",
      type: "Acai Bowls, Organic Sourdough & Specialty Coffee",
      price: "$24 per person",
    },
    facilities: [
      { name: "Surfboard & Wetsuit Vault", hours: "6:00 AM – 8:00 PM", floor: "Basement", details: "Complimentary custom foamies & beach cruiser bikes", icon: "Waves" },
      { name: "Rooftop Yoga Terrace", hours: "6:30 AM Sunrise Sessions", floor: "Level 4", details: "Mats and instructor included for all house guests", icon: "Sun" },
      { name: "Outdoor Saltwater Pool", hours: "7:00 AM – 9:00 PM", floor: "Grounds", details: "Heated year-round with coastal cabanas", icon: "Waves" },
    ],
  },
  {
    id: "blue-mountains-lodge",
    name: "The Blue Mountains Heritage Lodge",
    tagline: "Eucalyptus Mist & Fireside Comfort",
    destination: "Blue Mountains",
    city: "Katoomba",
    country: "Australia",
    address: "42 Cliff Drive, Katoomba, NSW 2780",
    phone: "+61 2 4782 1100",
    whatsapp: "+61 488 789 012",
    roomsCount: 16,
    status: "active",
    ownerEmail: "edward@heritagebluemountains.com",
    monthlyRevenue: 9800,
    plan: "Starter",
    wifi: {
      network: "HeritageLodge_Guest",
      password: "three_sisters_mist",
      speed: "150 Mbps Starlink",
    },
    checkIn: "2:00 PM",
    checkOut: "10:30 AM",
    breakfast: {
      hours: "7:30 AM – 10:00 AM",
      location: "The Great Hearth Dining Room",
      type: "Country Farmhouse Cooked Breakfast & Local Berry Compote",
      price: "$26 included in select rates",
    },
    facilities: [
      { name: "Library & Whiskey Lounge", hours: "12:00 PM – Midnight", floor: "Main Hall", details: "Log fireplace with over 80 single malt selections", icon: "BookOpen" },
      { name: "Cedar Wood Hot Tubs", hours: "8:00 AM – 10:00 PM", floor: "Garden Walk", details: "Private forest-view cedar spas bookable by the hour", icon: "Bath" },
    ],
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    uid: "u-superadmin",
    email: "admin@airpal.me",
    displayName: "Elena Vance (Platform Director)",
    role: "super_admin",
    propertyIds: ["harbour-hotel", "bondi-breeze-suites", "blue-mountains-lodge"],
    createdAt: "2026-01-10",
  },
  {
    uid: "u-host",
    email: "host@harbourhotel.com.au",
    displayName: "Marcus Sterling (Harbour Hotel Owner)",
    role: "host_admin",
    propertyIds: ["harbour-hotel"],
    createdAt: "2026-02-01",
  },
  {
    uid: "u-staff",
    email: "staff@harbourhotel.com.au",
    displayName: "Liam Chen (Front Desk Duty Manager)",
    role: "staff",
    propertyIds: ["harbour-hotel"],
    createdAt: "2026-02-15",
  },
  {
    uid: "u-guest",
    email: "guest@airpal.me",
    displayName: "Bibin Jose (Room 508)",
    role: "guest",
    propertyIds: ["harbour-hotel"],
    createdAt: "2026-03-01",
  },
];

export const DEFAULT_DEALS: DealItem[] = [
  {
    id: "deal_sunset_cruise",
    propertyId: "harbour-hotel",
    title: "Exclusive Sunset Sailing & Champagne Special",
    subtitle: "2-hour luxury catamaran cruise with free-flowing Veuve Clicquot and Sydney Rock Oysters.",
    price: 95,
    originalPrice: 140,
    discountBadge: "Save 32%",
    badge: "Limited Daily Deal",
    iconName: "Compass",
    category: "wellness",
    active: true,
    inventoryLimit: 6,
    soldCount: 4,
    expiresAt: "Tonight 6:00 PM",
  },
  {
    id: "deal_late_checkout",
    propertyId: "harbour-hotel",
    title: "VIP Guaranteed 4:00 PM Late Check-out",
    subtitle: "Keep your room and shower before your evening flight. Normal check-out is 10:00 AM.",
    price: 45,
    originalPrice: 65,
    discountBadge: "Save $20",
    badge: "Best Seller",
    iconName: "Clock",
    category: "stay",
    active: true,
    inventoryLimit: 10,
    soldCount: 8,
  },
  {
    id: "deal_artisan_breakfast",
    propertyId: "harbour-hotel",
    title: "Artisan Buffet & Barista Coffee Pre-book",
    subtitle: "Unlimited gourmet hot breakfast, Sonoma pastries, and specialty barista coffee.",
    price: 22,
    originalPrice: 28,
    discountBadge: "Save $6/day",
    badge: "Breakfast Deal",
    iconName: "Coffee",
    category: "dining",
    active: true,
    inventoryLimit: 50,
    soldCount: 34,
  },
  {
    id: "deal_airport_chauffeur",
    propertyId: "harbour-hotel",
    title: "Private Executive Airport Chauffeur",
    subtitle: "Mercedes E-Class sedan direct from hotel lobby to Sydney Airport terminal with luggage assist.",
    price: 65,
    originalPrice: 85,
    discountBadge: "Fixed Fare",
    badge: "Stress-Free",
    iconName: "Car",
    category: "transport",
    active: true,
    inventoryLimit: 8,
    soldCount: 3,
  },
  {
    id: "deal_spa_remedial",
    propertyId: "harbour-hotel",
    title: "60-Min In-Room Organic Remedial Massage",
    subtitle: "Certified therapist brings organic aromatic oils and heated stone treatment to your room.",
    price: 125,
    originalPrice: 160,
    discountBadge: "Save $35",
    badge: "Wellness Treat",
    iconName: "Sparkles",
    category: "wellness",
    active: true,
    inventoryLimit: 4,
    soldCount: 2,
  },
];

export const IN_ROOM_DINING_MENU: MenuItem[] = [
  { id: "m1", name: "Harbour Wagyu Smash Burger", category: "Mains", price: 26, description: "Double grass-fed patty, aged cheddar, pickles, smoked aioli on milk bun with truffle fries", dietary: ["Halal available"], popular: true },
  { id: "m2", name: "Barramundi Fillet & Charred Greens", category: "Mains", price: 34, description: "Crispy skin Australian ocean barramundi, lemon myrtle butter, roasted asparagus", dietary: ["GF"], popular: true },
  { id: "m3", name: "Artisan Sourdough & Whipped Ricotta", category: "Starters", price: 16, description: "Warm Sonoma sourdough, truffled honeycomb, sea salt flakes", dietary: ["V"] },
  { id: "m4", name: "Sydney Rock Oysters (Half Dozen)", category: "Starters", price: 28, description: "Freshly shucked with finger lime mignonette and ponzu", dietary: ["GF", "DF"] },
  { id: "m5", name: "Wild Mushroom & Truffle Pappardelle", category: "Mains", price: 28, description: "Hand-rolled pasta, pine mushrooms, shaved pecorino, thyme", dietary: ["V", "Vegetarian"] },
  { id: "m6", name: "Warm Valrhona Chocolate Lava Tart", category: "Desserts", price: 17, description: "70% dark molten center with vanilla bean gelato & macadamia crumb", dietary: ["V"] },
  { id: "m7", name: "Artisan Breakfast Bowl", category: "Breakfast", price: 22, description: "Organic poached eggs, avocado fan, Danish feta, blistered truss tomatoes on seeded sourdough", dietary: ["V", "GF available"] },
  { id: "m8", name: "Cold-Pressed Native Juice", category: "Drinks", price: 9, description: "Green apple, cucumber, kale, ginger and Davidson plum", dietary: ["Vegan", "GF"] },
];

export const LOCAL_PLACES: LocalPlace[] = [
  {
    id: "p1",
    name: "The Glenmore Rooftop",
    category: "Food & Drink",
    distance: "300m",
    walkTime: "4 min walk",
    priceLevel: "$$",
    rating: 4.8,
    whyGo: "Unmatched 180° vista of Sydney Opera House and Circular Quay without tourist trap markups. Arrive at 5:45 PM for golden hour.",
    staffPick: true,
    staffNote: "Our concierge Mark recommends the grilled halloumi sliders and local Balter IPA.",
    address: "96 Cumberland St, The Rocks",
    coordinates: { lat: -33.8587, lng: 151.2076 },
    badge: "Best Sunset View",
  },
  {
    id: "p2",
    name: "Edition Coffee Roasters",
    category: "Coffee",
    distance: "650m",
    walkTime: "8 min walk",
    priceLevel: "$$",
    rating: 4.9,
    whyGo: "Nordic-Japanese inspired single-origin coffee and soufflé pancakes. Pure sanctuary away from the hustle.",
    staffPick: true,
    staffNote: "Try the El Fenix batch brew and matcha tiramisu.",
    address: "60 Darling Dr, Haymarket (or near Barangaroo branch)",
    coordinates: { lat: -33.864, lng: 151.201 },
    badge: "Staff Coffee Pick",
  },
  {
    id: "p3",
    name: "Spice Alley & Kensington St",
    category: "Food & Drink",
    distance: "1.8km",
    walkTime: "12 min light rail",
    priceLevel: "$",
    rating: 4.7,
    whyGo: "Hawker-style vibrant open-air laneway with Singaporean, Malaysian, Vietnamese and Thai stalls. Incredible flavours under $20.",
    staffPick: true,
    staffNote: "Kopitiam's roti canai and Alex Lee Kitchen's laksa are phenomenal.",
    address: "Kensington St, Chippendale",
    coordinates: { lat: -33.886, lng: 151.201 },
    badge: "Best Cheap Eats",
  },
  {
    id: "p4",
    name: "The Rocks Secret Historic Laneways",
    category: "Nature & Walks",
    distance: "100m",
    walkTime: "1 min walk",
    priceLevel: "Free",
    rating: 4.9,
    whyGo: "Cobblestone alleys dating back to 1788 with hidden sandstone stairwells, gas lamps, and ghost stories.",
    staffPick: true,
    staffNote: "Head down Foundation Park and Suez Canal alleyway right behind the hotel.",
    address: "Argyle Cut & Foundation Park",
    coordinates: { lat: -33.859, lng: 151.206 },
    badge: "Hidden Gem",
  },
  {
    id: "p5",
    name: "Museum of Contemporary Art (MCA)",
    category: "Sights & Culture",
    distance: "400m",
    walkTime: "5 min walk",
    priceLevel: "Free",
    rating: 4.7,
    whyGo: "World-class contemporary Australian & Indigenous art directly on the waterfront. Free entry to permanent galleries.",
    address: "140 George St, The Rocks",
    coordinates: { lat: -33.8598, lng: 151.209 },
    badge: "Rainy Day Hero",
  },
  {
    id: "p6",
    name: "Maybe Sammy Cocktail Bar",
    category: "Nightlife",
    distance: "450m",
    walkTime: "6 min walk",
    priceLevel: "$$$",
    rating: 4.9,
    whyGo: "Voted World's 50 Best Bars. 1950s Rat Pack glamour, theatrical mixology, and flamingo pink velvet banquettes.",
    staffPick: true,
    staffNote: "Book or arrive right at 4:30 PM for aperitivo hour miniature cocktails.",
    address: "115 Harrington St, The Rocks",
    coordinates: { lat: -33.861, lng: 151.207 },
    badge: "World's Top 50 Bars",
  },
];

export const BOOKABLE_EXPERIENCES: BookableExperience[] = [
  {
    id: "exp1",
    title: "Sydney Harbour Sunset Kayak Tour",
    category: "Adventure & Views",
    price: 54,
    duration: "90 mins",
    spotsLeft: 4,
    description: "Paddle under the Sydney Harbour Bridge as twilight bathes the Opera House in pink and gold. Guided by local marine experts.",
    included: ["Double kayak & paddle", "Life jacket", "Safety briefing", "High-res photos taken by guide", "Hot tea afterwards"],
    provider: "Sydney Kayak Expeditions (AirPal Partner)",
    imageAccent: "sunset",
  },
  {
    id: "exp2",
    title: "The Rocks Secret Food & History Trail",
    category: "Food & Culture",
    price: 68,
    duration: "2.5 hours",
    spotsLeft: 6,
    description: "A culinary journey through 5 historic pubs and artisan eateries, tasting craft beer, Sydney rock oysters, and handmade chocolates.",
    included: ["5 food and drink tastings", "Expert historian guide", "Historic venue access", "Small group max 10"],
    provider: "Taste of Sydney",
    imageAccent: "food",
  },
  {
    id: "exp3",
    title: "Opera House Behind-the-Scenes Tour",
    category: "Culture",
    price: 45,
    duration: "60 mins",
    spotsLeft: 8,
    description: "Step inside the iconic sails, hear acoustic secrets, and visit dressing rooms where world legends prepared.",
    included: ["Fast-track entry", "Live audio headset", "Authorized heritage guide"],
    provider: "Sydney Opera House Trust",
    imageAccent: "culture",
  },
];

export const HOTEL_UPSELLS: UpsellItem[] = [
  {
    id: "up_late_checkout",
    title: "Late Check-out until 4:00 PM",
    subtitle: "Flight later today? Relax, shower, and keep your room until late afternoon.",
    price: 45,
    badge: "Popular Upsell",
    iconName: "Clock",
    category: "stay",
  },
  {
    id: "up_breakfast",
    title: "Artisan Breakfast Package",
    subtitle: "Unlimited gourmet buffet + barista flat white at the Ground Floor Atrium.",
    price: 22,
    badge: "Save $6 vs Walk-in",
    iconName: "Coffee",
    category: "dining",
  },
  {
    id: "up_airport_transfer",
    title: "Sydney Airport Private Chauffeur",
    subtitle: "Mercedes E-Class executive sedan direct from hotel lobby to terminal.",
    price: 65,
    badge: "Fixed Price · No Surge",
    iconName: "Car",
    category: "transport",
  },
  {
    id: "up_harbour_upgrade",
    title: "Room Upgrade to Opera View Suite",
    subtitle: "Direct unobstructed harbour balcony view with complimentary welcome champagne.",
    price: 85,
    badge: "Subject to Availability",
    iconName: "Sparkles",
    category: "stay",
  },
];

export const WHAT_TO_DO_NOW_RECOMMENDATIONS = {
  morning: [
    {
      id: "now_m1",
      title: "Harbour Bridge Viewpoint Walk",
      timeEstimate: "45 mins",
      cost: "Free",
      whyNow: "Crisp morning air, no tourist crowds, and golden light bouncing off the sails.",
      actionLabel: "Start Walking Route",
      category: "Nature",
    },
    {
      id: "now_m2",
      title: "Artisan Coffee at Edition Roasters",
      timeEstimate: "30 mins",
      cost: "$7",
      whyNow: "Fresh morning batch brew and warm soufflé pancakes 8 min away.",
      actionLabel: "View Menu & Directions",
      category: "Coffee",
    },
    {
      id: "now_m3",
      title: "Rocks Heritage Sandstone Trail",
      timeEstimate: "60 mins",
      cost: "Free",
      whyNow: "Quiet cobblestone alleys right behind the hotel before shops open.",
      actionLabel: "Open Audio Guide",
      category: "Culture",
    },
  ],
  afternoon: [
    {
      id: "now_a1",
      title: "Museum of Contemporary Art (MCA)",
      timeEstimate: "90 mins",
      cost: "Free Entry",
      whyNow: "Air-conditioned creative sanctuary 5 minutes away, featuring rooftop sculpture terrace.",
      actionLabel: "Get Walking Route",
      category: "Culture",
    },
    {
      id: "now_a2",
      title: "Chinatown & Spice Alley Lunch Trail",
      timeEstimate: "75 mins",
      cost: "$15–$20",
      whyNow: "Vibrant lunch rush with hot fresh laksa, dumplings, and iced teh tarik.",
      actionLabel: "See Hawker Stalls",
      category: "Food",
    },
    {
      id: "now_a3",
      title: "Royal Botanic Garden Foreshore Stroll",
      timeEstimate: "60 mins",
      cost: "Free",
      whyNow: "Shaded coastal path leading past Mrs Macquarie’s Chair with harbour breeze.",
      actionLabel: "Start Walk",
      category: "Nature",
    },
  ],
  evening: [
    {
      id: "now_e1",
      title: "Glenmore Rooftop Sunset Drinks",
      timeEstimate: "60 mins",
      cost: "$$",
      whyNow: "Sun begins dipping behind the bridge right now. 4 min walk from lobby.",
      actionLabel: "View Rooftop Guide",
      category: "Drinks",
    },
    {
      id: "now_e2",
      title: "Sydney Harbour Sunset Kayak",
      timeEstimate: "90 mins",
      cost: "$54",
      whyNow: "2 spots remaining for tonight's 6:00 PM harbour twilight paddle.",
      actionLabel: "Reserve Spot",
      category: "Adventure",
    },
    {
      id: "now_e3",
      title: "Maybe Sammy Cocktail Hour",
      timeEstimate: "45 mins",
      cost: "$$$",
      whyNow: "World's Top 50 bar just opened its doors. Perfect time before queues form.",
      actionLabel: "Get Directions",
      category: "Cocktails",
    },
  ],
};

export const INITIAL_STAFF_TICKETS: StaffTicket[] = [
  {
    id: "t-101",
    roomNumber: "508",
    guestName: "Bibin Jose",
    category: "maintenance",
    details: "Air conditioning in bedroom making a low humming rattle. Temperature stuck at 24°C.",
    status: "in_progress",
    createdAt: "10 mins ago",
    urgency: "urgent",
  },
  {
    id: "t-102",
    roomNumber: "312",
    guestName: "Sarah Jenkins",
    category: "late_checkout",
    details: "Requested late checkout until 3:00 PM for flight QF11.",
    status: "resolved",
    createdAt: "45 mins ago",
    urgency: "normal",
  },
  {
    id: "t-103",
    roomNumber: "204",
    guestName: "Liam Evans",
    category: "housekeeping",
    details: "Extra feather pillows and hypoallergenic duvet requested.",
    status: "pending",
    createdAt: "Just now",
    urgency: "normal",
  },
];

export const TRANSPORT_OPTIONS = [
  { id: "airport", title: "Airport transfer", detail: "Private chauffeur 35–45 min to SYD · $65 fixed", action: "Book transfer" },
  { id: "train", title: "Train & light rail", detail: "Circular Quay station 6 min walk · Opal card at hotel desk", action: "View routes" },
  { id: "ferry", title: "Harbour ferries", detail: "Manly, Taronga Zoo and Watsons Bay from Circular Quay", action: "Open timetable" },
  { id: "rideshare", title: "Taxi & rideshare", detail: "Uber, DiDi and 13cabs pickup at Argyle Street porte-cochère", action: "Request pickup" },
];

export const HOTEL_EVENTS = [
  { id: "ev1", time: "7:30 PM", date: "2026-09-15", title: "Rooftop film club", detail: "Under the stars on Level 7 · 8 spots left", price: "Free for in-house guests" },
  { id: "ev2", time: "5:00 PM", date: "2026-09-15", title: "Australian wine hour", detail: "The Rocks Cellar Bar · complimentary tasting flight", price: "Included" },
  { id: "ev3", time: "10:00 AM", date: "2026-09-16", title: "The Rocks walking tour", detail: "Meet in lobby · 75 minutes of hidden sandstone lanes", price: "$18" },
];

export const SAFETY_AND_EMERGENCY_DATA = {
  hotelEmergency: {
    frontDeskInternal: "Dial '9' on your in-room telephone",
    directEmergencyNumber: "+61 2 9251 4099",
    dutyManager24_7: "+61 488 999 111",
    assemblyPoint: "First Fleet Park (Green lawn directly opposite MCA on George St)",
    defibrillatorLocation: "Lobby Front Desk & Level 7 Pool Entry",
  },
  destinationEmergency: [
    { name: "Emergency Services (Police / Fire / Ambulance)", phone: "000", desc: "National emergency dialer in Australia" },
    { name: "Sydney Hospital & Eye Hospital (24/7 ER)", phone: "+61 2 9382 7111", desc: "8 Macquarie St (7 min taxi)" },
    { name: "The Rocks Police Station", phone: "+61 2 8220 6399", desc: "132 George St, The Rocks (300m walk)" },
    { name: "Late Night Chemist (Chemist Warehouse Circular Quay)", phone: "+61 2 9247 1827", desc: "Open until 9:00 PM (100 George St)" },
    { name: "Consular Services Direct", phone: "+61 2 6261 3305", desc: "Australian Government consular assistance for international travelers" },
  ],
};

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to",
    tagline: "Your intelligent guest & destination companion",
    askAirPal: "Ask AirPal",
    whatToDoNow: "What should I do now?",
    yourStay: "Your Stay",
    localDiscovery: "Local Discovery",
    experiences: "Experiences",
    hotelServices: "Services",
    emergency: "Safety & Emergency",
    wifiPassword: "Wi-Fi Password",
    copy: "Copy",
    copied: "Copied to clipboard!",
    reception: "Reception",
    housekeeping: "Housekeeping",
    dining: "Order Food",
    planMyTrip: "Plan My Trip",
    lateCheckout: "Late Check-out",
    book: "Book Now",
    callHotel: "Call Front Desk",
    familyMode: "Family Mode",
    seniorMode: "Senior Mode",
  },
  zh: {
    welcome: "欢迎来到",
    tagline: "您的智能酒店与目的地数字伴侣",
    askAirPal: "向 AirPal 提问",
    whatToDoNow: "我现在该做什么？",
    yourStay: "您的入住",
    localDiscovery: "当地探索",
    experiences: "体验项目",
    hotelServices: "酒店服务",
    emergency: "安全与紧急联系",
    wifiPassword: "Wi-Fi 密码",
    copy: "复制",
    copied: "已复制到剪贴板！",
    reception: "前台服务",
    housekeeping: "客房清洁",
    dining: "点餐服务",
    planMyTrip: "行程规划",
    lateCheckout: "延迟退房",
    book: "立即预订",
    callHotel: "致电前台",
    familyMode: "亲子模式",
    seniorMode: "长者关怀模式",
  },
  ja: {
    welcome: "ようこそ",
    tagline: "あなただけのスマート滞在＆街歩きコンパニオン",
    askAirPal: "AirPalに質問する",
    whatToDoNow: "今何をするべき？",
    yourStay: "ご滞在情報",
    localDiscovery: "ローカル体験",
    experiences: "アクティビティ",
    hotelServices: "ホテルサービス",
    emergency: "安全・緊急情報",
    wifiPassword: "Wi-Fi パスワード",
    copy: "コピー",
    copied: "コピーしました！",
    reception: "フロント",
    housekeeping: "ハウスキーピング",
    dining: "ルームサービス",
    planMyTrip: "旅行プラン作成",
    lateCheckout: "レイトチェックアウト",
    book: "予約する",
    callHotel: "フロントに電話",
    familyMode: "ファミリーモード",
    seniorMode: "シニアモード",
  },
  es: {
    welcome: "Bienvenido a",
    tagline: "Tu compañero digital de estancia y destino",
    askAirPal: "Preguntar a AirPal",
    whatToDoNow: "¿Qué debería hacer ahora?",
    yourStay: "Tu Estancia",
    localDiscovery: "Descubrimiento Local",
    experiences: "Experiencias",
    hotelServices: "Servicios del Hotel",
    emergency: "Seguridad y Emergencias",
    wifiPassword: "Clave Wi-Fi",
    copy: "Copiar",
    copied: "¡Copiado al portapapeles!",
    reception: "Recepción",
    housekeeping: "Limpieza",
    dining: "Pedir Comida",
    planMyTrip: "Planear Mi Viaje",
    lateCheckout: "Salida Tardía",
    book: "Reservar Ahora",
    callHotel: "Llamar a Recepción",
    familyMode: "Modo Familia",
    seniorMode: "Modo Senior",
  },
  fr: {
    welcome: "Bienvenue à",
    tagline: "Votre compagnon de séjour et de destination intelligent",
    askAirPal: "Demander à AirPal",
    whatToDoNow: "Que faire maintenant ?",
    yourStay: "Votre Séjour",
    localDiscovery: "Découvertes Locales",
    experiences: "Expériences",
    hotelServices: "Services de l'Hôtel",
    emergency: "Sécurité & Urgences",
    wifiPassword: "Mot de passe Wi-Fi",
    copy: "Copier",
    copied: "Copié dans le presse-papiers !",
    reception: "Réception",
    housekeeping: "Ménage",
    dining: "Commander à manger",
    planMyTrip: "Planifier mon séjour",
    lateCheckout: "Départ tardif",
    book: "Réserver",
    callHotel: "Appeler la réception",
    familyMode: "Mode Famille",
    seniorMode: "Mode Senior",
  },
  de: {
    welcome: "Willkommen im",
    tagline: "Ihr intelligenter Hotel- und Reisebegleiter",
    askAirPal: "AirPal fragen",
    whatToDoNow: "Was soll ich jetzt tun?",
    yourStay: "Ihr Aufenthalt",
    localDiscovery: "Lokale Entdeckungen",
    experiences: "Erlebnisse",
    hotelServices: "Hotelservices",
    emergency: "Sicherheit & Notfall",
    wifiPassword: "WLAN-Passwort",
    copy: "Kopieren",
    copied: "In die Zwischenablage kopiert!",
    reception: "Rezeption",
    housekeeping: "Zimmerservice",
    dining: "Essen bestellen",
    planMyTrip: "Trip planen",
    lateCheckout: "Später Check-out",
    book: "Jetzt buchen",
    callHotel: "Rezeption anrufen",
    familyMode: "Familienmodus",
    seniorMode: "Seniorenmodus",
  },
  hi: {
    welcome: "स्वागत है",
    tagline: "आपका व्यक्तिगत डिजिटल होटल और यात्रा साथी",
    askAirPal: "AirPal से पूछें",
    whatToDoNow: "मुझे अभी क्या करना चाहिए?",
    yourStay: "आपका प्रवास",
    localDiscovery: "स्थानीय खोज",
    experiences: "अनुभव और पर्यटन",
    hotelServices: "होटल सेवाएँ",
    emergency: "सुरक्षा और आपातकालीन",
    wifiPassword: "वाई-फ़ाई पासवर्ड",
    copy: "कॉपी करें",
    copied: "कॉपी कर लिया गया!",
    reception: "रिसेप्शन",
    housekeeping: "हाउसकीपिंग",
    dining: "खाना ऑर्डर करें",
    planMyTrip: "यात्रा योजना बनाएं",
    lateCheckout: "लेट चेक-आउट",
    book: "अभी बुक करें",
    callHotel: "होटल को कॉल करें",
    familyMode: "पारिवारिक मोड",
    seniorMode: "वरिष्ठ मोड",
  },
  ar: {
    welcome: "مرحباً بكم في",
    tagline: "رفيقك الذكي للإقامة واستكشاف المدينة",
    askAirPal: "اسأل AirPal",
    whatToDoNow: "ماذا يجب أن أفعل الآن؟",
    yourStay: "إقامتك",
    localDiscovery: "اكتشاف الأماكن المحلية",
    experiences: "التجارب والأنشطة",
    hotelServices: "خدمات الفندق",
    emergency: "الأمان والطوارئ",
    wifiPassword: "كلمة سر الواي فاي",
    copy: "نسخ",
    copied: "تم النسخ!",
    reception: "الاستقبال",
    housekeeping: "خدمة الغرف",
    dining: "طلب الطعام",
    planMyTrip: "خطط لرحلتي",
    lateCheckout: "تسجيل خروج متأخر",
    book: "احجز الآن",
    callHotel: "اتصال بالاستقبال",
    familyMode: "الوضع العائلي",
    seniorMode: "وضع كبار السن",
  },
};
