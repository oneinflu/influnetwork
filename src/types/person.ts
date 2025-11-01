export type PersonRole = 
  | 'Influencer' 
  | 'Model' 
  | 'Editor' 
  | 'Manager' 
  | 'Photographer' 
  | 'Brand Rep' 
  | 'Team' 
  | 'Vendor';

export type PersonStatus = 'Active' | 'Pending' | 'Onboarding' | 'Archived';

export type AvailabilityStatus = 'Available' | 'Booked' | 'On Hold';

export type Platform = 'Instagram' | 'YouTube' | 'TikTok' | 'LinkedIn' | 'Offline';

export type VisibilityLevel = 'Private' | 'Shareable' | 'Public';

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
}

export interface PlatformMetrics {
  instagram?: {
    followers: number;
    engagement: number;
  };
  youtube?: {
    subscribers: number;
    engagement: number;
  };
  tiktok?: {
    followers: number;
    engagement: number;
  };
  linkedin?: {
    connections: number;
    engagement: number;
  };
}

export interface BankDetails {
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  upiId?: string;
}

export interface PersonRelationship {
  id: string;
  personId: string;
  relatedPersonId: string;
  relationshipType: 'Manager' | 'Editor' | 'Photographer' | 'Assistant' | 'Team Member';
  isActive: boolean;
}

export interface PersonNote {
  id: string;
  content: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  createdBy: string;
  createdAt: string;
}

export interface PersonActivity {
  id: string;
  type: 'Created' | 'Updated' | 'Invited' | 'Campaign Added' | 'Invoice Created' | 'Payment Received' | 'Status Changed';
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Person {
  id: string;
  // Basic Information
  avatar?: string;
  fullName: string;
  handle?: string;
  roles: PersonRole[];
  primaryEmail: string;
  primaryPhone: string;
  secondaryPhone?: string;
  organization?: string;
  title?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  timezone?: string;
  languages?: string[];
  gender?: Gender;
  dateOfBirth?: string;
  
  // Profile & Social
  socialLinks: SocialLinks;
  portfolioLink?: string;
  isPortfolioPublic: boolean;
  shortBio?: string;
  longBio?: string;
  
  // Metrics
  platformMetrics: PlatformMetrics;
  audienceDemographics?: Record<string, any>;
  
  // Rates & Commercial
  defaultRateCardId?: string;
  pricingNotes?: string;
  isNegotiable: boolean;
  typicalDeliverables?: string;
  preferredPaymentMethod?: string;
  bankDetails?: BankDetails;
  
  // Work & Availability
  availabilityStatus: AvailabilityStatus;
  nextAvailableDate?: string;
  preferredLocations?: string[];
  certifications?: string[];
  
  // Admin & Meta
  tags: string[];
  customFields?: Record<string, any>;
  assignedTo?: string;
  status: PersonStatus;
  visibilityLevel: VisibilityLevel;
  isClaimable: boolean;
  isClaimed: boolean;
  claimToken?: string;
  
  // System fields
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
}

export interface PersonFormData {
  // Basic Information
  avatar?: File | string;
  fullName: string;
  handle?: string;
  roles: PersonRole[];
  primaryEmail: string;
  primaryPhone: string;
  secondaryPhone?: string;
  organization?: string;
  title?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  languages?: string[];
  gender?: Gender;
  dateOfBirth?: string;
  
  // Profile & Social
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
  portfolioLink?: string;
  isPortfolioPublic: boolean;
  shortBio?: string;
  longBio?: string;
  
  // Metrics
  instagramFollowers?: number;
  instagramEngagement?: number;
  youtubeSubscribers?: number;
  youtubeEngagement?: number;
  tiktokFollowers?: number;
  tiktokEngagement?: number;
  linkedinConnections?: number;
  linkedinEngagement?: number;
  
  // Rates & Commercial
  defaultRateCardId?: string;
  pricingNotes?: string;
  isNegotiable: boolean;
  typicalDeliverables?: string;
  preferredPaymentMethod?: string;
  
  // Work & Availability
  availabilityStatus: AvailabilityStatus;
  nextAvailableDate?: string;
  preferredLocations?: string[];
  
  // Admin & Meta
  tags: string[];
  assignedTo?: string;
  status: PersonStatus;
  visibilityLevel: VisibilityLevel;
  isClaimable: boolean;
}

export interface PersonFilters {
  search?: string;
  roles?: PersonRole[];
  platforms?: Platform[];
  followersRange?: {
    min: number;
    max: number;
  };
  availability?: AvailabilityStatus[];
  location?: string;
  tags?: string[];
  assignedTo?: string[];
  status?: PersonStatus[];
  lastActivityRange?: {
    start: string;
    end: string;
  };
}

export const PERSON_ROLE_OPTIONS = [
  { value: 'Influencer', label: 'Influencer' },
  { value: 'Model', label: 'Model' },
  { value: 'Editor', label: 'Editor' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Photographer', label: 'Photographer' },
  { value: 'Brand Rep', label: 'Brand Rep' },
  { value: 'Team', label: 'Team' },
  { value: 'Vendor', label: 'Vendor' }
] as const;

export const PERSON_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Onboarding', label: 'Onboarding' },
  { value: 'Archived', label: 'Archived' }
] as const;

export const AVAILABILITY_STATUS_OPTIONS = [
  { value: 'Available', label: 'Available' },
  { value: 'Booked', label: 'Booked' },
  { value: 'On Hold', label: 'On Hold' }
] as const;

export const PLATFORM_OPTIONS = [
  { value: 'Instagram', label: 'Instagram' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Offline', label: 'Offline' }
] as const;

export const VISIBILITY_LEVEL_OPTIONS = [
  { value: 'Private', label: 'Private to agency' },
  { value: 'Shareable', label: 'Shareable' },
  { value: 'Public', label: 'Public (for discovery)' }
] as const;

// Utility functions
export function getPersonDisplayName(person: Person): string {
  return person.fullName || person.handle || person.primaryEmail;
}

export function getPersonPrimaryPlatform(person: Person): Platform | null {
  const metrics = person.platformMetrics;
  let maxFollowers = 0;
  let primaryPlatform: Platform | null = null;
  
  if (metrics.instagram && metrics.instagram.followers > maxFollowers) {
    maxFollowers = metrics.instagram.followers;
    primaryPlatform = 'Instagram';
  }
  if (metrics.youtube && metrics.youtube.subscribers > maxFollowers) {
    maxFollowers = metrics.youtube.subscribers;
    primaryPlatform = 'YouTube';
  }
  if (metrics.tiktok && metrics.tiktok.followers > maxFollowers) {
    maxFollowers = metrics.tiktok.followers;
    primaryPlatform = 'TikTok';
  }
  if (metrics.linkedin && metrics.linkedin.connections > maxFollowers) {
    maxFollowers = metrics.linkedin.connections;
    primaryPlatform = 'LinkedIn';
  }
  
  return primaryPlatform;
}

export function getTotalFollowers(person: Person): number {
  const metrics = person.platformMetrics;
  return (
    (metrics.instagram?.followers || 0) +
    (metrics.youtube?.subscribers || 0) +
    (metrics.tiktok?.followers || 0) +
    (metrics.linkedin?.connections || 0)
  );
}

export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}