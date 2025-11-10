import mongoose, { Document, Schema } from 'mongoose';

export interface IPlatformMetrics {
  followers?: number;
  engagement?: number;
  subscribers?: number;
  connections?: number;
}

export interface IPortfolioFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document';
  fileSize: number;
  uploadedAt: Date;
  tags: string[];
  description?: string;
}

export interface IPerson extends Document {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  roles: string[];
  organization?: string;
  location?: string;
  website?: string;
  shortBio?: string;
  longBio?: string;
  platformMetrics: {
    instagram?: IPlatformMetrics;
    youtube?: IPlatformMetrics;
    tiktok?: IPlatformMetrics;
    linkedin?: IPlatformMetrics;
  };
  portfolioFiles: IPortfolioFile[];
  defaultRateCardId?: string;
  pricingNotes?: string;
  isNegotiable: boolean;
  typicalDeliverables: string[];
  preferredPaymentMethod?: string;
  availabilityStatus: 'Available' | 'Busy' | 'Unavailable';
  nextAvailableDate?: Date;
  preferredLocations: string[];
  tags: string[];
  assignedTo?: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Archived';
  visibilityLevel: 'Public' | 'Private' | 'Team';
  isClaimable: boolean;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const platformMetricsSchema = new Schema<IPlatformMetrics>({
  followers: { type: Number, min: 0 },
  engagement: { type: Number, min: 0, max: 100 },
  subscribers: { type: Number, min: 0 },
  connections: { type: Number, min: 0 }
}, { _id: false });

const portfolioFileSchema = new Schema<IPortfolioFile>({
  id: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { 
    type: String, 
    enum: ['image', 'video', 'document'], 
    required: true 
  },
  fileSize: { type: Number, required: true, min: 0 },
  uploadedAt: { type: Date, default: Date.now },
  tags: [{ type: String, trim: true }],
  description: { type: String, trim: true }
}, { _id: false });

const personSchema = new Schema<IPerson>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    sparse: true // Allow multiple null values
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  profilePhoto: {
    type: String,
    default: null
  },
  roles: [{
    type: String,
    trim: true,
    required: true
  }],
  organization: {
    type: String,
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  shortBio: {
    type: String,
    trim: true,
    maxlength: [500, 'Short bio cannot exceed 500 characters']
  },
  longBio: {
    type: String,
    trim: true,
    maxlength: [2000, 'Long bio cannot exceed 2000 characters']
  },
  platformMetrics: {
    instagram: platformMetricsSchema,
    youtube: platformMetricsSchema,
    tiktok: platformMetricsSchema,
    linkedin: platformMetricsSchema
  },
  portfolioFiles: [portfolioFileSchema],
  defaultRateCardId: {
    type: String,
    ref: 'RateCard'
  },
  pricingNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Pricing notes cannot exceed 1000 characters']
  },
  isNegotiable: {
    type: Boolean,
    default: true
  },
  typicalDeliverables: [{
    type: String,
    trim: true
  }],
  preferredPaymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'PayPal', 'UPI', 'Cash', 'Cheque'],
    default: 'Bank Transfer'
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Busy', 'Unavailable'],
    default: 'Available'
  },
  nextAvailableDate: {
    type: Date
  },
  preferredLocations: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  assignedTo: {
    type: String,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending', 'Archived'],
    default: 'Active'
  },
  visibilityLevel: {
    type: String,
    enum: ['Public', 'Private', 'Team'],
    default: 'Private'
  },
  isClaimable: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, __v, ...cleanRet } = ret;
      return { id: _id, ...cleanRet };
    }
  }
});

// Indexes for better query performance
personSchema.index({ fullName: 'text', shortBio: 'text', longBio: 'text' });
personSchema.index({ roles: 1 });
personSchema.index({ status: 1 });
personSchema.index({ availabilityStatus: 1 });
personSchema.index({ assignedTo: 1 });
personSchema.index({ tags: 1 });
personSchema.index({ visibilityLevel: 1 });
personSchema.index({ createdAt: -1 });
personSchema.index({ lastActivity: -1 });

export default mongoose.model<IPerson>('Person', personSchema);