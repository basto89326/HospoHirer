// ---------------------------------------------------------------------------
// Mock data — swap these out for real API/DB calls when the backend is ready
// ---------------------------------------------------------------------------

// ─── Shared types ───────────────────────────────────────────────────────────

export type Availability = "Both" | "Weekends" | "Casual" | "Weekdays";

export interface Role {
  label: string;
  primary?: boolean;
}

// ─── Employer dashboard ─────────────────────────────────────────────────────

export interface WorkerCardHistoryEntry {
  title: string;
  place: string;
  dates: string;
  description: string;
  current: boolean;
}

export interface WorkerCard {
  id: number;
  name: string;
  location: string;
  distanceKm: number;
  availability: Availability;
  availabilityColor: string;
  avatarUrl: string;
  online: boolean;
  roles: Role[];
  mostRecentRole: string;
  mostRecentDates: string;
  bio: string;
  certifications: string[];
  workHistory: WorkerCardHistoryEntry[];
}

export const mockWorkers: WorkerCard[] = [
  {
    id: 1,
    name: "Marcus L.",
    location: "Fitzroy",
    distanceKm: 2,
    availability: "Both",
    availabilityColor: "bg-green-100 text-green-700",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
    online: true,
    roles: [{ label: "Head Barista", primary: true }, { label: "Cafe Manager" }],
    mostRecentRole: "Head Barista @ The Daily Grind",
    mostRecentDates: "Aug 2021 – Present",
    bio: "Dedicated and fast-paced Head Barista with over 6 years of experience in high-volume specialty coffee shops. Proficient with La Marzocco, Victoria Arduino, and Synesso machines. Strong understanding of dialling in, alternative brewing methods, and team management.",
    certifications: ["RSA — Victoria"],
    workHistory: [
      {
        title: "Head Barista",
        place: "The Daily Grind, Fitzroy",
        dates: "Aug 2021 – Present",
        description: "Managed coffee operations doing 50kg+ per week. Trained junior staff and maintained consistent shot quality during peak service.",
        current: true,
      },
      {
        title: "Barista",
        place: "Cornerstone Cafe, Richmond",
        dates: "Feb 2019 – Jul 2021",
        description: "Handled high-volume coffee service and FOH duties including running food and operating the POS system.",
        current: false,
      },
      {
        title: "Wait Staff / FOH",
        place: "Bistro 42, Melbourne CBD",
        dates: "Nov 2017 – Jan 2019",
        description: "Fast-paced table service, section management, and customer relations in a 100-seat restaurant.",
        current: false,
      },
    ],
  },
  {
    id: 2,
    name: "Emma Davies",
    location: "Richmond",
    distanceKm: 5,
    availability: "Weekends",
    availabilityColor: "bg-purple-100 text-purple-700",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    online: false,
    roles: [{ label: "Wait Staff", primary: true }, { label: "FOH" }],
    mostRecentRole: "Senior Waitress @ Bistro 42",
    mostRecentDates: "Mar 2022 – Present",
    bio: "Experienced FOH professional with a strong eye for detail and a genuine love of hospitality. Comfortable managing sections independently and training new staff during service.",
    certifications: ["RSA — Victoria"],
    workHistory: [
      {
        title: "Senior Waitress",
        place: "Bistro 42, Richmond",
        dates: "Mar 2022 – Present",
        description: "Managed a section of 8 tables in a high-end bistro environment. Regular wine service and private events.",
        current: true,
      },
      {
        title: "Wait Staff",
        place: "The Adelphi Hotel, CBD",
        dates: "Jun 2020 – Feb 2022",
        description: "All-day dining service across breakfast and dinner shifts. Trained in POS and allergen management.",
        current: false,
      },
    ],
  },
  {
    id: 3,
    name: "Liam Smith",
    location: "CBD",
    distanceKm: 8,
    availability: "Casual",
    availabilityColor: "bg-blue-100 text-blue-700",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    online: true,
    roles: [{ label: "Bartender", primary: true }, { label: "Mixologist" }],
    mostRecentRole: "Lead Bartender @ The Rooftop",
    mostRecentDates: "Jan 2020 – Oct 2023",
    bio: "Creative mixologist with 5+ years behind the stick at high-volume Melbourne venues. Specials in classic cocktails, spirits education, and cellar management.",
    certifications: ["RSA — Victoria", "Responsible Service of Alcohol Refresher"],
    workHistory: [
      {
        title: "Lead Bartender",
        place: "The Rooftop Bar, CBD",
        dates: "Jan 2020 – Oct 2023",
        description: "Led a team of 4 bartenders across Friday and Saturday nights serving 400+ covers. Designed seasonal cocktail menu.",
        current: false,
      },
      {
        title: "Bartender",
        place: "Bar Lourinhã, CBD",
        dates: "Mar 2018 – Dec 2019",
        description: "Craft cocktail service in an award-winning Portuguese-inspired bar. Focus on natural wines and spirits.",
        current: false,
      },
      {
        title: "Barback / Glassie",
        place: "Revolver Upstairs, Prahran",
        dates: "Aug 2016 – Feb 2018",
        description: "High-energy nightclub support role — glass collection, ice runs, bar stocking during peak periods.",
        current: false,
      },
    ],
  },
  {
    id: 4,
    name: "Sarah J.",
    location: "Collingwood",
    distanceKm: 3,
    availability: "Weekdays",
    availabilityColor: "bg-amber-100 text-amber-700",
    avatarUrl:
      "https://images.unsplash.com/photo-1583332426815-5e04288f6b7e?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
    online: false,
    roles: [{ label: "Sous Chef", primary: true }, { label: "Kitchen Hand" }],
    mostRecentRole: "Sous Chef @ Fine Dining Co.",
    mostRecentDates: "May 2018 – Jan 2024",
    bio: "Classically trained chef with 6 years of fine dining experience. Strong in French technique, seasonal menus, and fast-paced kitchen leadership.",
    certifications: ["Food Safety Supervisor — Victoria"],
    workHistory: [
      {
        title: "Sous Chef",
        place: "Fine Dining Co., Melbourne CBD",
        dates: "May 2018 – Jan 2024",
        description: "Second in command in a 2-hat fine dining kitchen. Led lunch service prep and managed section leads.",
        current: false,
      },
      {
        title: "Chef de Partie",
        place: "Attica, Ripponlea",
        dates: "Jan 2016 – Apr 2018",
        description: "Cold section and pastry rotation at one of Australia's most acclaimed restaurants.",
        current: false,
      },
    ],
  },
  {
    id: 5,
    name: "Priya N.",
    location: "South Yarra",
    distanceKm: 6,
    availability: "Both",
    availabilityColor: "bg-green-100 text-green-700",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    online: true,
    roles: [{ label: "Barista", primary: true }, { label: "Wait Staff" }],
    mostRecentRole: "Barista @ Proud Mary Coffee",
    mostRecentDates: "Sep 2022 – Present",
    bio: "Passionate specialty coffee barista with a background in customer service. Quick to learn new equipment and always brings a positive energy to the floor.",
    certifications: ["RSA — Victoria"],
    workHistory: [
      {
        title: "Barista",
        place: "Proud Mary Coffee, Collingwood",
        dates: "Sep 2022 – Present",
        description: "Full espresso bar service including filter bar operation, milk training, and retail coffee sales.",
        current: true,
      },
      {
        title: "Cafe All-rounder",
        place: "Hardware Société, CBD",
        dates: "Feb 2021 – Aug 2022",
        description: "Combined FOH and bar support role across a high-demand brunch venue.",
        current: false,
      },
    ],
  },
  {
    id: 6,
    name: "Jake T.",
    location: "St Kilda",
    distanceKm: 12,
    availability: "Weekends",
    availabilityColor: "bg-purple-100 text-purple-700",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    online: false,
    roles: [{ label: "Bartender", primary: true }, { label: "Glassie" }],
    mostRecentRole: "Bartender @ Revolver Upstairs",
    mostRecentDates: "Jun 2021 – Present",
    bio: "High-volume nightlife bartender comfortable handling busy service under pressure. Fast on the stick, reliable, and great with regulars.",
    certifications: ["RSA — Victoria"],
    workHistory: [
      {
        title: "Bartender",
        place: "Revolver Upstairs, Prahran",
        dates: "Jun 2021 – Present",
        description: "Weekend bar service across multiple rooms in one of Melbourne's busiest late-night venues.",
        current: true,
      },
      {
        title: "Glassie / Bar Support",
        place: "Prince of Wales, St Kilda",
        dates: "Nov 2019 – May 2021",
        description: "Live music venue support including bar stocking, glass collection, and cellar runs.",
        current: false,
      },
    ],
  },
  {
    id: 7,
    name: "Chloe B.",
    location: "Brunswick",
    distanceKm: 4,
    availability: "Casual",
    availabilityColor: "bg-blue-100 text-blue-700",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
    online: true,
    roles: [{ label: "Head Chef", primary: true }, { label: "Sous Chef" }],
    mostRecentRole: "Head Chef @ Smith Street Kitchen",
    mostRecentDates: "Feb 2020 – Present",
    bio: "Creative and organised Head Chef with a focus on produce-driven menus and zero-waste cooking. Experienced in leading small to medium kitchen teams.",
    certifications: ["Food Safety Supervisor — Victoria", "Food Handler Certificate"],
    workHistory: [
      {
        title: "Head Chef",
        place: "Smith Street Kitchen, Collingwood",
        dates: "Feb 2020 – Present",
        description: "Full kitchen ownership across a 60-seat neighbourhood restaurant. Weekly menu changes, supplier relationships, and team management.",
        current: true,
      },
      {
        title: "Sous Chef",
        place: "Epocha, Carlton",
        dates: "Jul 2017 – Jan 2020",
        description: "Supported head chef in a critically acclaimed European bistro. Managed breakfast and lunch mise en place.",
        current: false,
      },
    ],
  },
  {
    id: 8,
    name: "Daniel W.",
    location: "Prahran",
    distanceKm: 7,
    availability: "Weekdays",
    availabilityColor: "bg-amber-100 text-amber-700",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    online: false,
    roles: [{ label: "FOH Manager", primary: true }, { label: "Wait Staff" }],
    mostRecentRole: "FOH Manager @ The Windsor Hotel",
    mostRecentDates: "Nov 2019 – Dec 2023",
    bio: "Experienced FOH Manager with a track record of building high-performing floor teams in upscale hotel and fine dining environments.",
    certifications: ["RSA — Victoria", "Responsible Manager of Licensed Venue"],
    workHistory: [
      {
        title: "FOH Manager",
        place: "The Windsor Hotel, Spring Street",
        dates: "Nov 2019 – Dec 2023",
        description: "Oversaw all front-of-house operations across restaurant, bar, and event spaces. Managed a team of 12 staff.",
        current: false,
      },
      {
        title: "Senior Wait Staff",
        place: "Vue de Monde, CBD",
        dates: "Mar 2017 – Oct 2019",
        description: "Fine dining floor service with a focus on wine pairing, tasting menus, and international clientele.",
        current: false,
      },
    ],
  },
];

export interface EmployerStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export const mockEmployerStats: EmployerStat[] = [
  { label: "Workers matching", value: "42", icon: "fa-solid fa-users", color: "text-blue-500" },
  { label: "New this week", value: "7", icon: "fa-solid fa-user-plus", color: "text-green-500" },
  { label: "Profiles viewed", value: "12", icon: "fa-solid fa-eye", color: "text-orange-500" },
  { label: "Contacts made", value: "3", icon: "fa-solid fa-phone", color: "text-purple-500" },
];

export interface SavedWorker {
  id: number;
  name: string;
  role: string;
  avatarUrl: string;
  savedAt: string;
}

export const mockSavedWorkers: SavedWorker[] = [
  {
    id: 1,
    name: "Marcus L.",
    role: "Head Barista",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
    savedAt: "2 days ago",
  },
  {
    id: 3,
    name: "Liam Smith",
    role: "Bartender",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    savedAt: "5 days ago",
  },
  {
    id: 7,
    name: "Chloe B.",
    role: "Head Chef",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
    savedAt: "1 week ago",
  },
];

// ─── Worker dashboard ────────────────────────────────────────────────────────

export interface WorkerProfile {
  name: string;
  headline: string;
  avatarUrl: string;
  location: string;
  travelRadiusKm: number;
  availability: string;
  phone: string;
  email: string;
  profileCompletion: number;
  bio: string;
  roles: Role[];
  certifications: { label: string; region: string; status: "Valid" | "Expired" }[];
}

export const mockWorkerProfile: WorkerProfile = {
  name: "Marcus L.",
  headline: "Head Barista & Cafe Manager",
  avatarUrl:
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  location: "Fitzroy, VIC 3065",
  travelRadiusKm: 10,
  availability: "Both (Weekdays & Weekends)",
  phone: "0412 345 678",
  email: "marcus.l@email.com",
  profileCompletion: 85,
  bio: `Dedicated and fast-paced Head Barista with over 6 years of experience in high-volume specialty coffee shops. Proficient with La Marzocco, Victoria Arduino, and Synesso machines.

Strong understanding of dialling in, alternative brewing methods (V60, Aeropress), and basic latte art (rosettas, tulips, swans). I also have experience managing FOH staff and handling stock ordering. Looking for reliable shifts in a quality-focused environment.`,
  roles: [
    { label: "Barista", primary: true },
    { label: "Head Barista" },
    { label: "Cafe Manager" },
    { label: "Front of House" },
  ],
  certifications: [
    { label: "RSA", region: "Victoria", status: "Valid" },
  ],
};

export interface WorkHistoryEntry {
  title: string;
  place: string;
  dates: string;
  description: string;
  current: boolean;
}

export const mockWorkHistory: WorkHistoryEntry[] = [
  {
    title: "Head Barista",
    place: "The Daily Grind, Fitzroy",
    dates: "Aug 2021 – Present",
    description:
      "Managed coffee operations doing 50kg+ per week. Trained junior staff, maintained equipment, and ensured consistent shot quality during peak morning rushes.",
    current: true,
  },
  {
    title: "Barista",
    place: "Cornerstone Cafe, Richmond",
    dates: "Feb 2019 – Jul 2021",
    description:
      "Handled high-volume coffee service, assisted with FOH duties including running food and operating the POS system.",
    current: false,
  },
  {
    title: "Wait Staff / FOH",
    place: "Bistro 42, Melbourne CBD",
    dates: "Nov 2017 – Jan 2019",
    description:
      "Fast-paced table service, section management, and customer relations in a 100-seat restaurant.",
    current: false,
  },
];

export interface WorkerStat {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
}

export const mockWorkerStats: WorkerStat[] = [
  {
    label: "Profile views",
    value: "34",
    sub: "this week",
    icon: "fa-solid fa-eye",
    color: "text-blue-500",
  },
  {
    label: "Search appearances",
    value: "118",
    sub: "last 7 days",
    icon: "fa-solid fa-magnifying-glass",
    color: "text-orange-500",
  },
  {
    label: "Enquiries",
    value: "5",
    sub: "awaiting reply",
    icon: "fa-solid fa-envelope",
    color: "text-green-500",
  },
  {
    label: "Profile saved by",
    value: "9",
    sub: "employers",
    icon: "fa-solid fa-bookmark",
    color: "text-purple-500",
  },
];

export interface EmployerEnquiry {
  id: number;
  venueName: string;
  venueLocation: string;
  contactName: string;
  avatarUrl: string;
  message: string;
  sentAt: string;
  read: boolean;
}

export const mockEnquiries: EmployerEnquiry[] = [
  {
    id: 1,
    venueName: "Patricia's Espresso Bar",
    venueLocation: "Fitzroy North",
    contactName: "Patricia H.",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    message:
      "Hi Marcus — we're looking for a senior barista for Thursday/Friday mornings. Would love to have a chat if you're available.",
    sentAt: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    venueName: "Altura Coffee Roasters",
    venueLocation: "Collingwood",
    contactName: "Ben A.",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    message:
      "Hey! We've been looking at your profile — we have a casual position available. Let me know if you'd be keen.",
    sentAt: "Yesterday",
    read: false,
  },
  {
    id: 3,
    venueName: "The Pressed Penny",
    venueLocation: "Brunswick",
    contactName: "Sophie W.",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    message:
      "Marcus, your experience looks great. We're opening a second site in April and need a strong barista lead.",
    sentAt: "3 days ago",
    read: true,
  },
  {
    id: 4,
    venueName: "Grind & Co.",
    venueLocation: "South Yarra",
    contactName: "Tom R.",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    message:
      "We run a busy brunch spot — looking for weekend barista cover starting next month. Interested?",
    sentAt: "5 days ago",
    read: true,
  },
];

export interface ProfileView {
  id: number;
  venueName: string;
  venueType: string;
  location: string;
  avatarUrl: string;
  viewedAt: string;
}

export const mockProfileViews: ProfileView[] = [
  {
    id: 1,
    venueName: "Patricia's Espresso Bar",
    venueType: "Cafe",
    location: "Fitzroy North",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    viewedAt: "2 hours ago",
  },
  {
    id: 2,
    venueName: "Altura Coffee Roasters",
    venueType: "Roastery / Cafe",
    location: "Collingwood",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    viewedAt: "Yesterday",
  },
  {
    id: 3,
    venueName: "Smith St. Alimentari",
    venueType: "Deli / Cafe",
    location: "Collingwood",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    viewedAt: "2 days ago",
  },
  {
    id: 4,
    venueName: "The Pressed Penny",
    venueType: "Cafe",
    location: "Brunswick",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    viewedAt: "3 days ago",
  },
  {
    id: 5,
    venueName: "Grind & Co.",
    venueType: "Brunch Bar",
    location: "South Yarra",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    viewedAt: "5 days ago",
  },
];

// ─── Messaging ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: number;
  from: "me" | "them";
  text: string;
  sentAt: string;
}

export interface Conversation {
  id: number;
  name: string;
  subtitle: string;
  location: string;
  avatarUrl: string;
  online: boolean;
  lastMessage: string;
  lastAt: string;
  unread: boolean;
  messages: ChatMessage[];
}

// Worker's inbox — "me" is Marcus L., "them" is employers
export const mockWorkerConversations: Conversation[] = [
  {
    id: 1,
    name: "Patricia's Espresso Bar",
    subtitle: "Cafe · Fitzroy North",
    location: "Fitzroy North",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    online: true,
    lastMessage: "Sounds great — we'll lock you in for Thursday at 7am.",
    lastAt: "2 hours ago",
    unread: true,
    messages: [
      { id: 1, from: "them", text: "Hi Marcus — we're looking for a senior barista for Thursday/Friday mornings. Would love to have a chat if you're available.", sentAt: "Mon 9:12am" },
      { id: 2, from: "me", text: "Hey Patricia! Thursday mornings work well for me. What time would you need me in?", sentAt: "Mon 9:45am" },
      { id: 3, from: "them", text: "We open at 7am and the morning rush is done by 11. Pays $32/hr.", sentAt: "Mon 10:02am" },
      { id: 4, from: "me", text: "That works for me. Happy to do a trial shift if you'd like.", sentAt: "Mon 10:15am" },
      { id: 5, from: "them", text: "Sounds great — we'll lock you in for Thursday at 7am.", sentAt: "2 hours ago" },
    ],
  },
  {
    id: 2,
    name: "Altura Coffee Roasters",
    subtitle: "Roastery / Cafe · Collingwood",
    location: "Collingwood",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    online: false,
    lastMessage: "Hey! We've been looking at your profile — we have a casual position available.",
    lastAt: "Yesterday",
    unread: true,
    messages: [
      { id: 1, from: "them", text: "Hey! We've been looking at your profile — we have a casual position available. Let me know if you'd be keen.", sentAt: "Yesterday 3:30pm" },
    ],
  },
  {
    id: 3,
    name: "The Pressed Penny",
    subtitle: "Cafe · Brunswick",
    location: "Brunswick",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    online: false,
    lastMessage: "No worries at all — keep us in mind if things free up.",
    lastAt: "3 days ago",
    unread: false,
    messages: [
      { id: 1, from: "them", text: "Marcus, your experience looks great. We're opening a second site in April and need a strong barista lead.", sentAt: "Thu 11:00am" },
      { id: 2, from: "me", text: "Thanks Sophie, that sounds exciting! I'm pretty tied up through March but might have more availability in April. Can I reach out then?", sentAt: "Thu 11:45am" },
      { id: 3, from: "them", text: "No worries at all — keep us in mind if things free up.", sentAt: "3 days ago" },
    ],
  },
  {
    id: 4,
    name: "Grind & Co.",
    subtitle: "Brunch Bar · South Yarra",
    location: "South Yarra",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    online: true,
    lastMessage: "Interested? We run a busy weekend brunch — great team.",
    lastAt: "5 days ago",
    unread: false,
    messages: [
      { id: 1, from: "them", text: "We run a busy brunch spot — looking for weekend barista cover starting next month. Interested? We run a busy weekend brunch — great team.", sentAt: "5 days ago" },
    ],
  },
];

// Employer's inbox — "me" is the employer (David G.), "them" is workers
export const mockEmployerConversations: Conversation[] = [
  {
    id: 1,
    name: "Marcus L.",
    subtitle: "Head Barista",
    location: "Fitzroy",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
    online: true,
    lastMessage: "That works for me. Happy to do a trial shift if you'd like.",
    lastAt: "2 hours ago",
    unread: true,
    messages: [
      { id: 1, from: "me", text: "Hi Marcus — we're looking for a senior barista for Thursday/Friday mornings. Would love to have a chat if you're available.", sentAt: "Mon 9:12am" },
      { id: 2, from: "them", text: "Hey! Thursday mornings work well for me. What time would you need me in?", sentAt: "Mon 9:45am" },
      { id: 3, from: "me", text: "We open at 7am and the morning rush is done by 11. Pays $32/hr.", sentAt: "Mon 10:02am" },
      { id: 4, from: "them", text: "That works for me. Happy to do a trial shift if you'd like.", sentAt: "2 hours ago" },
    ],
  },
  {
    id: 2,
    name: "Chloe B.",
    subtitle: "Head Chef",
    location: "Brunswick",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
    online: true,
    lastMessage: "I can do Tuesdays and Wednesdays from next week — does that suit?",
    lastAt: "Yesterday",
    unread: true,
    messages: [
      { id: 1, from: "me", text: "Hi Chloe, we saw your profile and think you'd be a great fit for our kitchen. We need a head chef for weekday lunch service. Interested?", sentAt: "Sun 2:00pm" },
      { id: 2, from: "them", text: "Hi! Yes absolutely, I've been looking for some extra weekday work. What's the kitchen like?", sentAt: "Sun 4:15pm" },
      { id: 3, from: "me", text: "Modern Australian, 40 covers for lunch. Tight team of 3 in the kitchen. Great produce suppliers.", sentAt: "Sun 5:00pm" },
      { id: 4, from: "them", text: "Sounds right up my alley. What days are you looking at?", sentAt: "Mon 8:30am" },
      { id: 5, from: "me", text: "Tuesdays through Thursdays ideally. Are you free for a quick call this week?", sentAt: "Mon 9:00am" },
      { id: 6, from: "them", text: "I can do Tuesdays and Wednesdays from next week — does that suit?", sentAt: "Yesterday 1:00pm" },
    ],
  },
  {
    id: 3,
    name: "Emma Davies",
    subtitle: "Wait Staff / FOH",
    location: "Richmond",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    online: false,
    lastMessage: "Thanks for reaching out! I'll have a look and get back to you.",
    lastAt: "3 days ago",
    unread: false,
    messages: [
      { id: 1, from: "me", text: "Hey Emma, your profile caught my eye. We're after an experienced wait staff for Friday and Saturday evenings — fine dining, 80 covers.", sentAt: "Tue 11:00am" },
      { id: 2, from: "them", text: "Thanks for reaching out! I'll have a look and get back to you.", sentAt: "3 days ago" },
    ],
  },
  {
    id: 4,
    name: "Liam Smith",
    subtitle: "Bartender / Mixologist",
    location: "CBD",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    online: false,
    lastMessage: "Appreciate the offer but I've just picked up a regular gig. Cheers!",
    lastAt: "1 week ago",
    unread: false,
    messages: [
      { id: 1, from: "me", text: "Hi Liam — we run a cocktail bar in the CBD and need a reliable bartender for Thursday–Saturday nights. Your mixology background is exactly what we're after.", sentAt: "Last week" },
      { id: 2, from: "them", text: "Appreciate the offer but I've just picked up a regular gig. Cheers!", sentAt: "1 week ago" },
    ],
  },
];
