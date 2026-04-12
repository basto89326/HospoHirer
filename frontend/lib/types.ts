export type Availability = "Both" | "Weekends" | "Casual" | "Weekdays";

export interface Role {
  label: string;
  primary?: boolean;
}

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
  availability: Availability | string;
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

export interface EmployerStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface SavedWorker {
  id: number;
  name: string;
  role: string;
  avatarUrl: string;
  savedAt: string;
}

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

export interface WorkHistoryEntry {
  title: string;
  place: string;
  dates: string;
  description: string;
  current: boolean;
}

export interface WorkerStat {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
}

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

export interface ProfileView {
  id: number;
  venueName: string;
  venueType: string;
  location: string;
  avatarUrl: string;
  viewedAt: string;
}

export interface ChatMessage {
  id: number;
  from: "me" | "them";
  text: string;
  sentAt: string;
}

export interface EmployerProfile {
  name: string;
  venueName: string;
  venueType: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  avatarUrl: string;
  website: string;
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
