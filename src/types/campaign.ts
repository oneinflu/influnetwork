// Campaign & Project Types

export type CampaignStatus = 'Draft' | 'Proposal' | 'Active' | 'Review' | 'Completed' | 'Paid';
export type CampaignType = 'Influencer' | 'Event' | 'Ad' | 'Collaboration' | 'Organic' | 'Paid' | 'Barter' | 'PR';
export type Platform = 'Instagram' | 'YouTube' | 'LinkedIn' | 'Facebook' | 'Twitter' | 'TikTok' | 'Offline' | 'Event';
export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue';
export type Visibility = 'Private' | 'Public';
export type ViewMode = 'list' | 'kanban' | 'calendar';
export type DeliverableType = 'Post' | 'Story' | 'Reel' | 'Blog' | 'Video' | 'Event Appearance' | 'Live Stream' | 'Carousel';
export type DeliverableStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Approved' | 'Published' | 'Rejected';
export type TeamRole = 'Manager' | 'Creator' | 'Editor' | 'Client Servicing' | 'Account Manager' | 'Creative Director';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type PaymentTerms = 'Net 7' | 'Net 15' | 'Net 30' | 'Advance 50%' | 'Advance 100%' | 'On Delivery';

export interface Deliverable {
  id: string;
  type: DeliverableType;
  quantity: number;
  platform: Platform;
  deadline: string;
  status: DeliverableStatus;
  description?: string;
  proofUrl?: string;
  proofThumbnail?: string;
  remarks?: string;
  assignedTo?: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  publishedUrl?: string;
  engagementMetrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    reach?: number;
    impressions?: number;
  };
}

export interface TeamMember {
  id: string;
  personId: string;
  name: string;
  role: TeamRole;
  email?: string;
  phone?: string;
  avatar?: string;
  responsibility?: string;
  notes?: string;
}

export interface InfluencerAssignment {
  id: string;
  personId: string;
  name: string;
  handle: string;
  platform: Platform;
  avatar?: string;
  followers: number;
  engagementRate: number;
  fee: number;
  paymentStatus: PaymentStatus;
  deliverables: string[]; // deliverable IDs
  notes?: string;
  rateCardId?: string;
}

export interface CampaignFinancials {
  budgetTotal: number;
  currency: Currency;
  agencyCommissionPercent: number;
  influencerPayoutTotal: number;
  taxPercent?: number;
  taxAmount?: number;
  totalDealValue: number;
  paymentTerms: PaymentTerms;
  clientInvoiceId?: string;
  profitMargin?: number;
  costBreakdown?: {
    influencerFees: number;
    productionCosts: number;
    platformAds: number;
    miscellaneous: number;
  };
}

export interface CampaignFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: 'contract' | 'brief' | 'moodboard' | 'script' | 'proof' | 'other';
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  tags?: string[];
  description?: string;
}

export interface CampaignNote {
  id: string;
  type: 'internal' | 'client' | 'influencer';
  content: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  isPrivate: boolean;
  tags?: string[];
}

export interface CampaignTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  createdBy: string;
  completedAt?: string;
}

export interface CampaignAnalytics {
  totalReach: number;
  totalImpressions: number;
  totalEngagement: number;
  averageEngagementRate: number;
  costPerEngagement: number;
  roi?: number;
  topPerformingContent?: {
    deliverableId: string;
    platform: Platform;
    engagementRate: number;
    reach: number;
  }[];
  platformBreakdown?: {
    platform: Platform;
    reach: number;
    engagement: number;
    cost: number;
  }[];
}

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  clientLogo?: string;
  type: CampaignType;
  platforms: Platform[];
  category: string;
  brief: string;
  goals: string;
  status: CampaignStatus;
  visibility: Visibility;
  
  // Dates
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  
  // Financial
  financials: CampaignFinancials;
  
  // Team & Influencers
  teamMembers: TeamMember[];
  influencers: InfluencerAssignment[];
  
  // Deliverables
  deliverables: Deliverable[];
  
  // Progress
  progress: number;
  progressPercent: number;
  completedDeliverables: number;
  totalDeliverables: number;
  
  // Files & Documentation
  files: CampaignFile[];
  
  // Communication
  notes: CampaignNote[];
  tasks: CampaignTask[];
  
  // Analytics
  analytics?: CampaignAnalytics;
  
  // Approvals
  clientApproved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  
  // Metadata
  createdBy: string;
  lastUpdatedBy: string;
  tags?: string[];
  location?: string;
  
  // Linked entities
  linkedInvoices?: string[];
  linkedPayments?: string[];
  linkedRateCards?: string[];
}

export interface CampaignFilters {
  search?: string;
  clientId?: string[];
  influencerId?: string[];
  status?: CampaignStatus[];
  type?: CampaignType[];
  platform?: Platform[];
  assignedTo?: string[];
  budgetRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  paymentStatus?: PaymentStatus[];
  hasInvoice?: boolean;
  visibility?: Visibility[];
  location?: string[];
  category?: string[];
}

export type CampaignSortBy = 
  | 'name' 
  | 'clientName' 
  | 'startDate' 
  | 'endDate' 
  | 'budget' 
  | 'status' 
  | 'progress' 
  | 'createdAt' 
  | 'updatedAt';

// Form Data Types
export interface CampaignFormData {
  // Basic Details
  name: string;
  clientId: string;
  type: CampaignType;
  platforms: Platform[];
  category: string;
  brief: string;
  goals: string;
  visibility: Visibility;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  
  // Financial
  budgetTotal: number;
  currency: Currency;
  agencyCommissionPercent: number;
  taxPercent?: number;
  paymentTerms: PaymentTerms;
  
  // Team Assignment
  teamMembers: Omit<TeamMember, 'id'>[];
  influencers: Omit<InfluencerAssignment, 'id'>[];
  
  // Deliverables
  deliverables: Omit<Deliverable, 'id'>[];
  
  // Additional
  tags?: string[];
  location?: string;
  clientApproved: boolean;
}

// Options for dropdowns
export const CAMPAIGN_STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft', color: '#6B7280' },
  { value: 'Proposal', label: 'Proposal', color: '#F59E0B' },
  { value: 'Active', label: 'Active', color: '#10B981' },
  { value: 'Review', label: 'Review', color: '#3B82F6' },
  { value: 'Completed', label: 'Completed', color: '#8B5CF6' },
  { value: 'Paid', label: 'Paid', color: '#059669' }
] as const;

export const CAMPAIGN_TYPE_OPTIONS = [
  { value: 'Influencer', label: 'Influencer Campaign' },
  { value: 'Event', label: 'Event Campaign' },
  { value: 'Ad', label: 'Paid Advertising' },
  { value: 'Collaboration', label: 'Brand Collaboration' },
  { value: 'Organic', label: 'Organic Content' },
  { value: 'Paid', label: 'Paid Partnership' },
  { value: 'Barter', label: 'Barter Campaign' },
  { value: 'PR', label: 'PR Campaign' }
] as const;

export const PLATFORM_OPTIONS = [
  { value: 'Instagram', label: 'Instagram', icon: '📷' },
  { value: 'YouTube', label: 'YouTube', icon: '📺' },
  { value: 'LinkedIn', label: 'LinkedIn', icon: '💼' },
  { value: 'Facebook', label: 'Facebook', icon: '👥' },
  { value: 'Twitter', label: 'Twitter', icon: '🐦' },
  { value: 'TikTok', label: 'TikTok', icon: '🎵' },
  { value: 'Offline', label: 'Offline', icon: '🏢' },
  { value: 'Event', label: 'Event', icon: '🎪' }
] as const;

export const DELIVERABLE_TYPE_OPTIONS = [
  { value: 'Post', label: 'Social Media Post' },
  { value: 'Story', label: 'Story' },
  { value: 'Reel', label: 'Reel/Short Video' },
  { value: 'Blog', label: 'Blog Article' },
  { value: 'Video', label: 'Long-form Video' },
  { value: 'Event Appearance', label: 'Event Appearance' },
  { value: 'Live Stream', label: 'Live Stream' },
  { value: 'Carousel', label: 'Carousel Post' }
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', color: '#F59E0B' },
  { value: 'Partial', label: 'Partial', color: '#3B82F6' },
  { value: 'Paid', label: 'Paid', color: '#10B981' },
  { value: 'Overdue', label: 'Overdue', color: '#EF4444' }
] as const;

export const TEAM_ROLE_OPTIONS = [
  { value: 'Manager', label: 'Campaign Manager' },
  { value: 'Creator', label: 'Content Creator' },
  { value: 'Editor', label: 'Video/Photo Editor' },
  { value: 'Client Servicing', label: 'Client Servicing' },
  { value: 'Account Manager', label: 'Account Manager' },
  { value: 'Creative Director', label: 'Creative Director' }
] as const;

// Utility functions
export const getStatusColor = (status: CampaignStatus): string => {
  const statusOption = CAMPAIGN_STATUS_OPTIONS.find(opt => opt.value === status);
  return statusOption?.color || '#6B7280';
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const statusOption = PAYMENT_STATUS_OPTIONS.find(opt => opt.value === status);
  return statusOption?.color || '#6B7280';
};

export const calculateProgress = (deliverables: Deliverable[]): number => {
  if (deliverables.length === 0) return 0;
  const completed = deliverables.filter(d => 
    d.status === 'Approved' || d.status === 'Published'
  ).length;
  return Math.round((completed / deliverables.length) * 100);
};

export const formatCurrency = (amount: number, currency: Currency = 'INR'): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const getDaysUntilDeadline = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (deadline: string): boolean => {
  return getDaysUntilDeadline(deadline) < 0;
};