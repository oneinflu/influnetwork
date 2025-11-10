import mongoose, { Document, Schema } from 'mongoose';

export interface IRateCard extends Document {
  _id: string;
  rateCardName: string;
  category: string;
  serviceType: string;
  contentDuration?: string;
  baseRate: number;
  discountPercentage: number;
  finalRate: number;
  pricingType: string;
  linkedInfluencer: string;
  applicableFor: string;
  inclusions: string;
  deliveryTime: string;
  attachments?: string[];
  visibility: 'Public' | 'Private';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const rateCardSchema = new Schema<IRateCard>({
  rateCardName: {
    type: String,
    required: [true, 'Rate card name is required'],
    trim: true,
    maxlength: [200, 'Rate card name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Twitter', 'TikTok', 'Event', 'Offline', 'Other'],
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['Story', 'Post', 'Reel', 'Video', 'Integration', 'Review', 'Appearance', 'Campaign', 'Collaboration'],
    trim: true
  },
  contentDuration: {
    type: String,
    trim: true,
    maxlength: [100, 'Content duration cannot exceed 100 characters']
  },
  baseRate: {
    type: Number,
    required: [true, 'Base rate is required'],
    min: [0, 'Base rate cannot be negative']
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100%'],
    default: 0
  },
  finalRate: {
    type: Number,
    required: [true, 'Final rate is required'],
    min: [0, 'Final rate cannot be negative']
  },
  pricingType: {
    type: String,
    required: [true, 'Pricing type is required'],
    enum: ['Per Post', 'Per Campaign', 'Monthly', 'Per Deliverable', 'Per Hour', 'Per Day'],
    trim: true
  },
  linkedInfluencer: {
    type: String,
    required: [true, 'Linked influencer is required'],
    trim: true,
    maxlength: [200, 'Linked influencer name cannot exceed 200 characters']
  },
  applicableFor: {
    type: String,
    required: [true, 'Applicable for is required'],
    enum: ['Brand', 'Agency', 'Direct Collaboration', 'All'],
    trim: true
  },
  inclusions: {
    type: String,
    required: [true, 'Inclusions are required'],
    trim: true,
    maxlength: [1000, 'Inclusions cannot exceed 1000 characters']
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    trim: true,
    maxlength: [100, 'Delivery time cannot exceed 100 characters']
  },
  attachments: [{
    type: String,
    trim: true
  }],
  visibility: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Private'
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required'],
    ref: 'User'
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

// Pre-save middleware to calculate final rate
rateCardSchema.pre('save', function(next) {
  if (this.baseRate !== undefined && this.discountPercentage !== undefined) {
    const discountAmount = (this.baseRate * this.discountPercentage) / 100;
    this.finalRate = this.baseRate - discountAmount;
  }
  next();
});

// Indexes for better query performance
rateCardSchema.index({ rateCardName: 'text', inclusions: 'text' });
rateCardSchema.index({ category: 1 });
rateCardSchema.index({ serviceType: 1 });
rateCardSchema.index({ linkedInfluencer: 1 });
rateCardSchema.index({ visibility: 1 });
rateCardSchema.index({ createdBy: 1 });
rateCardSchema.index({ finalRate: 1 });
rateCardSchema.index({ baseRate: 1 });
rateCardSchema.index({ createdAt: -1 });
rateCardSchema.index({ updatedAt: -1 });

export default mongoose.model<IRateCard>('RateCard', rateCardSchema);