export interface RateCard {
  id: string;
  rateCardName: string;
  category: string; // Platform (Instagram, YouTube, LinkedIn, Event, etc.)
  serviceType: string; // Deliverable (Story, Post, Reel, Integration, Review, Appearance)
  contentDuration?: string; // Optional format details
  baseRate: number; // Base cost before discounts
  discountPercentage: number; // Discount percentage
  finalRate: number; // Auto-calculated = Base - Discount
  pricingType: string; // Per Post, Per Campaign, Monthly, Per Deliverable
  linkedInfluencer: string; // Influencer name or "Multiple"
  applicableFor: string; // Brand, Agency, Direct Collaboration
  inclusions: string; // What's included in the price
  deliveryTime: string; // Expected timeline
  lastUpdated: string; // ISO date string
  attachments?: string[]; // Optional file paths/URLs
  visibility: 'Public' | 'Private'; // Public/Private visibility
  createdBy: string; // User who created the rate card
  createdOn: string; // ISO date string
}

export interface RateCardFilters {
  search: string;
  category: string;
  serviceType: string;
  linkedInfluencer: string;
  visibility: 'All' | 'Public' | 'Private';
  priceRange: {
    min: number;
    max: number;
  };
}

export interface RateCardSortConfig {
  field: keyof RateCard;
  direction: 'asc' | 'desc';
}

export type RateCardViewMode = 'table' | 'grid';

// Form data interface for Add/Edit modal
export interface RateCardFormData {
  rateCardName: string;
  category: string;
  serviceType: string;
  contentDuration: string;
  baseRate: number;
  discountPercentage: number;
  finalRate: number; // Add this field
  pricingType: string;
  linkedInfluencer: string;
  applicableFor: string;
  inclusions: string;
  deliveryTime: string;
  attachments: string; // Change to string for simplicity in form
  visibility: 'Public' | 'Private';
}

// Dropdown options
export const CATEGORY_OPTIONS = [
  'Instagram',
  'YouTube',
  'LinkedIn',
  'Facebook',
  'Twitter',
  'TikTok',
  'Event',
  'Offline',
  'Other'
];

export const SERVICE_TYPE_OPTIONS = [
  'Story',
  'Post',
  'Reel',
  'Video',
  'Integration',
  'Review',
  'Appearance',
  'Campaign',
  'Collaboration'
];

export const PRICING_TYPE_OPTIONS = [
  'Per Post',
  'Per Campaign',
  'Monthly',
  'Per Deliverable',
  'Per Hour',
  'Per Day'
];

export const APPLICABLE_FOR_OPTIONS = [
  'Brand',
  'Agency',
  'Direct Collaboration',
  'All'
];