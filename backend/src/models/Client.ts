import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  other?: Record<string, string>;
}

export interface IBusinessAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IClient extends Document {
  businessName: string; // display name for client
  logo?: string;
  isGstRegistered: boolean;
  gstNumber?: string;
  panNumber?: string;
  businessAddress?: IBusinessAddress;
  category?: string;
  website?: string;
  socialMedia?: ISocialMediaLinks;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const socialMediaSchema = new Schema<ISocialMediaLinks>({
  instagram: { type: String, trim: true, match: [/^https?:\/\/.+/, 'Enter a valid URL'] },
  facebook: { type: String, trim: true, match: [/^https?:\/\/.+/, 'Enter a valid URL'] },
  twitter: { type: String, trim: true, match: [/^https?:\/\/.+/, 'Enter a valid URL'] },
  linkedin: { type: String, trim: true, match: [/^https?:\/\/.+/, 'Enter a valid URL'] },
  youtube: { type: String, trim: true, match: [/^https?:\/\/.+/, 'Enter a valid URL'] },
  tiktok: { type: String, trim: true, match: [/^https?:\/\/.+/, 'Enter a valid URL'] },
  other: { type: Schema.Types.Mixed }
}, { _id: false });

const addressSchema = new Schema<IBusinessAddress>({
  line1: { type: String, trim: true, maxlength: 200 },
  line2: { type: String, trim: true, maxlength: 200 },
  city: { type: String, trim: true, maxlength: 100 },
  state: { type: String, trim: true, maxlength: 100 },
  postalCode: { type: String, trim: true, maxlength: 20 },
  country: { type: String, trim: true, maxlength: 100 }
}, { _id: false });

const clientSchema = new Schema<IClient>({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [200, 'Business name cannot exceed 200 characters']
  },
  logo: { type: String, trim: true },
  isGstRegistered: { type: Boolean, default: false },
  gstNumber: { type: String, trim: true, maxlength: 30 },
  panNumber: { type: String, trim: true, maxlength: 20 },
  businessAddress: addressSchema,
  category: { type: String, trim: true, maxlength: 100 },
  website: { type: String, trim: true, match: [/^https?:\/\/.+/, 'Please enter a valid URL'] },
  socialMedia: socialMediaSchema,
  notes: { type: String, trim: true, maxlength: 2000 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Created by is required'] }
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
clientSchema.index({ businessName: 1 });
clientSchema.index({ category: 1 });
clientSchema.index({ createdBy: 1 });
clientSchema.index({ createdAt: -1 });

export const Client = mongoose.model<IClient>('Client', clientSchema);