import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectMilestone {
  id: string;
  milestoneName: string;
  payment: {
    type: 'amount' | 'percentage';
    value: number;
  };
  collectIn: number; // days from project start
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: Date;
}

export interface IProject extends Document {
  _id: string;
  campaignName: string;
  clientId: mongoose.Types.ObjectId;
  projectAgreedBudget: number;
  startDate: Date;
  endDate: Date;
  campaignType: 'Influencer Campaign' | 'UGC' | 'Event' | 'Branding' | 'Other';
  peopleInvolved: mongoose.Types.ObjectId[];
  paymentTerms: 'default' | 'customised';
  paymentTermsTemplateId?: mongoose.Types.ObjectId;
  milestones: IProjectMilestone[];
  targetPlatform: string[];
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'on-hold';
  description?: string;
  deliverables?: string[];
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectMilestoneSchema = new Schema<IProjectMilestone>({
  id: { type: String, required: true },
  milestoneName: { 
    type: String, 
    required: [true, 'Milestone name is required'],
    trim: true,
    maxlength: [200, 'Milestone name cannot exceed 200 characters']
  },
  payment: {
    type: {
      type: String,
      enum: ['amount', 'percentage'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: [0, 'Payment value must be positive']
    }
  },
  collectIn: {
    type: Number,
    required: true,
    min: [0, 'Collection days must be non-negative']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue'],
    default: 'pending'
  },
  completedAt: { type: Date }
}, { _id: false });

const projectSchema = new Schema<IProject>({
  campaignName: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [200, 'Campaign name cannot exceed 200 characters']
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  projectAgreedBudget: {
    type: Number,
    required: [true, 'Project budget is required'],
    min: [0, 'Budget must be positive']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(this: IProject, endDate: Date) {
        return endDate > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  campaignType: {
    type: String,
    enum: ['Influencer Campaign', 'UGC', 'Event', 'Branding', 'Other'],
    required: [true, 'Campaign type is required']
  },
  peopleInvolved: [{
    type: Schema.Types.ObjectId,
    ref: 'Person'
  }],
  paymentTerms: {
    type: String,
    enum: ['default', 'customised'],
    default: 'default'
  },
  paymentTermsTemplateId: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentTermsTemplate'
  },
  milestones: {
    type: [projectMilestoneSchema],
    required: true,
    validate: {
      validator: function(milestones: IProjectMilestone[]) {
        if (milestones.length === 0) return false;
        
        // Check if percentages add up to 100% for percentage-based milestones
        const percentageMilestones = milestones.filter(m => m.payment.type === 'percentage');
        if (percentageMilestones.length > 0) {
          const totalPercentage = percentageMilestones.reduce((sum, m) => sum + m.payment.value, 0);
          return Math.abs(totalPercentage - 100) < 0.01;
        }
        
        return true;
      },
      message: 'Percentage-based milestones must add up to 100%'
    }
  },
  targetPlatform: [{
    type: String,
    trim: true,
    required: true
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled', 'on-hold'],
    default: 'draft'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  deliverables: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
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
projectSchema.index({ campaignName: 'text', description: 'text' });
projectSchema.index({ clientId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ campaignType: 1 });
projectSchema.index({ startDate: 1 });
projectSchema.index({ endDate: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ targetPlatform: 1 });

// Compound indexes
projectSchema.index({ status: 1, startDate: 1 });
projectSchema.index({ clientId: 1, status: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);