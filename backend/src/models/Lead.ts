import mongoose, { Schema, Document } from 'mongoose';

// Lead interface
export interface ILead extends Document {
  businessName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  website: string;
  leadType: string;
  leadSource: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  budgetRange: string;
  lastContacted: Date;
  nextFollowUp: Date;
  assignedTo: string;
  notes: string;
  conversionProbability: number;
  attachments: string;
  hasReminders: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Lead schema
const leadSchema = new Schema<ILead>({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  contactNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^[+]?[\d\s\-()]+$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  leadType: {
    type: String,
    required: [true, 'Lead type is required'],
    enum: {
      values: ['Fashion', 'Tech', 'FMCG', 'Lifestyle', 'Healthcare', 'Education', 'Finance', 'Real Estate'],
      message: 'Invalid lead type'
    }
  },
  leadSource: {
    type: String,
    required: [true, 'Lead source is required'],
    enum: {
      values: ['Manual', 'Referral', 'Discovery', 'Inbound', 'Social Media', 'Website', 'Cold Outreach'],
      message: 'Invalid lead source'
    }
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
      message: 'Invalid status'
    },
    default: 'New'
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '₹5,000 – ₹25,000',
        '₹25,000 – ₹50,000', 
        '₹50,000 – ₹1,00,000',
        '₹1,00,000 – ₹2,50,000',
        '₹2,50,000 – ₹5,00,000',
        '₹5,00,000+'
      ],
      message: 'Invalid budget range'
    }
  },
  lastContacted: {
    type: Date,
    default: Date.now
  },
  nextFollowUp: {
    type: Date,
    required: [true, 'Next follow-up date is required']
  },
  assignedTo: {
    type: String,
    required: [true, 'Lead must be assigned to someone'],
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  conversionProbability: {
    type: Number,
    required: [true, 'Conversion probability is required'],
    min: [0, 'Conversion probability cannot be negative'],
    max: [100, 'Conversion probability cannot exceed 100'],
    default: 0
  },
  attachments: {
    type: String,
    trim: true
  },
  hasReminders: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __v, ...rest } = ret;
      return rest;
    }
  }
});

// Indexes for better query performance
leadSchema.index({ businessName: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ leadType: 1 });
leadSchema.index({ leadSource: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ nextFollowUp: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ conversionProbability: -1 });

// Compound indexes
leadSchema.index({ status: 1, assignedTo: 1 });
leadSchema.index({ leadType: 1, status: 1 });
leadSchema.index({ createdBy: 1, status: 1 });

// Pre-save middleware to validate next follow-up date
leadSchema.pre('save', function(next) {
  if (this.nextFollowUp && this.nextFollowUp < new Date()) {
    // Allow past dates for existing records being updated
    if (!this.isNew) {
      return next();
    }
    return next(new Error('Next follow-up date cannot be in the past'));
  }
  next();
});

// Virtual for days until next follow-up
leadSchema.virtual('daysUntilFollowUp').get(function() {
  if (!this.nextFollowUp) return null;
  const today = new Date();
  const followUpDate = new Date(this.nextFollowUp);
  const diffTime = followUpDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for lead age in days
leadSchema.virtual('leadAge').get(function() {
  const today = new Date();
  const createdDate = new Date(this.createdAt);
  const diffTime = today.getTime() - createdDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Static method to get leads by status
leadSchema.statics.getLeadsByStatus = function(status: string) {
  return this.find({ status }).populate('createdBy', 'fullName email');
};

// Static method to get leads requiring follow-up
leadSchema.statics.getLeadsRequiringFollowUp = function(days: number = 0) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  
  return this.find({
    nextFollowUp: { $lte: targetDate },
    status: { $nin: ['Won', 'Lost'] }
  }).populate('createdBy', 'fullName email');
};

// Static method to get conversion statistics
leadSchema.statics.getConversionStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgConversionProbability: { $avg: '$conversionProbability' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

export const Lead = mongoose.model<ILead>('Lead', leadSchema);