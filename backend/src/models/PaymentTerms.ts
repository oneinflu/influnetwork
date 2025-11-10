import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentMilestoneTemplate {
  id: string;
  description: string;
  percentage?: number;
  amount?: number;
  daysFromStart: number;
  isPercentage: boolean;
  conditions?: string;
}

export interface IPaymentTermsTemplate extends Document {
  _id: string;
  name: string;
  description: string;
  milestones: IPaymentMilestoneTemplate[];
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentMilestoneTemplateSchema = new Schema<IPaymentMilestoneTemplate>({
  id: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  percentage: { type: Number, min: 0, max: 100 },
  amount: { type: Number, min: 0 },
  daysFromStart: { type: Number, required: true, min: 0 },
  isPercentage: { type: Boolean, required: true, default: true },
  conditions: { type: String, trim: true }
}, { _id: false });

const paymentTermsTemplateSchema = new Schema<IPaymentTermsTemplate>({
  name: {
    type: String,
    required: [true, 'Payment terms name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  milestones: {
    type: [paymentMilestoneTemplateSchema],
    required: true,
    validate: {
      validator: function(milestones: IPaymentMilestoneTemplate[]) {
        if (milestones.length === 0) return false;
        
        // Check if percentages add up to 100% for percentage-based milestones
        const percentageMilestones = milestones.filter(m => m.isPercentage);
        if (percentageMilestones.length > 0) {
          const totalPercentage = percentageMilestones.reduce((sum, m) => sum + (m.percentage || 0), 0);
          return Math.abs(totalPercentage - 100) < 0.01; // Allow for floating point precision
        }
        
        return true;
      },
      message: 'Percentage-based milestones must add up to 100%'
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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
      const { __v, ...rest } = ret;
      return rest;
    }
  }
});

// Indexes
paymentTermsTemplateSchema.index({ name: 1 });
paymentTermsTemplateSchema.index({ isDefault: 1 });
paymentTermsTemplateSchema.index({ isActive: 1 });
paymentTermsTemplateSchema.index({ createdBy: 1 });

// Ensure only one default template
paymentTermsTemplateSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await mongoose.model('PaymentTermsTemplate').updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

export const PaymentTermsTemplate = mongoose.model<IPaymentTermsTemplate>('PaymentTermsTemplate', paymentTermsTemplateSchema);