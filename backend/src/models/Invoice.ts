import mongoose, { Document, Schema } from 'mongoose';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';
export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Cheque' | 'Cash' | 'Digital Wallet' | 'Other';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface IInvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercentage: number;
  lineTotal: number;
  taxAmount: number;
  totalWithTax: number;
}

export interface IPayment {
  id: string;
  invoiceId?: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: PaymentStatus;
  notes?: string;
  receiptAttachment?: string;
  recordedBy: string;
  recordedOn: Date;
  lastUpdated: Date;
}

export interface IPaymentAllocation {
  id: string;
  paymentId: string;
  invoiceId: string;
  allocatedAmount: number;
  createdOn: Date;
}

export interface IInvoiceActivity {
  id: string;
  invoiceId: string;
  activityType: 'created' | 'sent' | 'viewed' | 'payment_recorded' | 'reminder_sent' | 'status_changed' | 'edited';
  description: string;
  performedBy: string;
  performedOn: Date;
  metadata?: Record<string, unknown>;
}

export interface IRefund {
  id: string;
  paymentId: string;
  invoiceId: string;
  amount: number;
  refundDate: Date;
  reason: string;
  refundMethod: PaymentMethod;
  transactionReference?: string;
  status: 'Processed' | 'Pending' | 'Failed';
  processedBy: string;
  processedOn: Date;
  notes?: string;
}

export interface ICreditNote {
  id: string;
  creditNoteNumber: string;
  originalInvoiceId: string;
  clientId: string;
  issueDate: Date;
  amount: number;
  reason: string;
  status: 'Draft' | 'Issued' | 'Applied';
  appliedToInvoiceId?: string;
  createdBy: string;
  createdOn: Date;
}

export interface IInvoice extends Document {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  contactPerson: string;
  clientEmail: string;
  clientPhone?: string;
  campaignId?: string;
  campaignName?: string;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  currency: Currency;
  lineItems: IInvoiceLineItem[];
  subtotal: number;
  discountType: 'amount' | 'percentage';
  discountValue: number;
  discountAmount: number;
  taxAmount: number;
  adjustments: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  payments?: IPayment[];
  paymentTerms: string;
  notes?: string;
  termsAndConditions?: string;
  createdBy: string;
  lastPaymentMethod?: PaymentMethod;
  attachments?: string[];
  sentDate?: Date;
  remindersSent: number;
  lastReminderDate?: Date;
  activities?: IInvoiceActivity[];
  createdAt: Date;
  updatedAt: Date;
}

// Nested schemas
const invoiceLineItemSchema = new Schema<IInvoiceLineItem>({
  id: { type: String, required: true },
  description: {
    type: String,
    required: [true, 'Line item description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  taxPercentage: {
    type: Number,
    required: [true, 'Tax percentage is required'],
    min: [0, 'Tax percentage cannot be negative'],
    max: [100, 'Tax percentage cannot exceed 100%']
  },
  lineTotal: {
    type: Number,
    required: true,
    min: [0, 'Line total cannot be negative']
  },
  taxAmount: {
    type: Number,
    required: true,
    min: [0, 'Tax amount cannot be negative']
  },
  totalWithTax: {
    type: Number,
    required: true,
    min: [0, 'Total with tax cannot be negative']
  }
}, { _id: false });

const paymentSchema = new Schema<IPayment>({
  id: { type: String, required: true },
  invoiceId: { type: String, ref: 'Invoice' },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0.01, 'Payment amount must be greater than 0']
  },
  paymentDate: {
    type: Date,
    required: [true, 'Payment date is required']
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Cheque', 'Cash', 'Digital Wallet', 'Other'],
    required: [true, 'Payment method is required']
  },
  transactionReference: {
    type: String,
    trim: true,
    maxlength: [100, 'Transaction reference cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Failed'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  receiptAttachment: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: String,
    required: [true, 'Recorded by is required'],
    ref: 'User'
  },
  recordedOn: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paymentAllocationSchema = new Schema<IPaymentAllocation>({
  id: { type: String, required: true },
  paymentId: { type: String, required: true },
  invoiceId: { type: String, required: true, ref: 'Invoice' },
  allocatedAmount: {
    type: Number,
    required: [true, 'Allocated amount is required'],
    min: [0.01, 'Allocated amount must be greater than 0']
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const invoiceActivitySchema = new Schema<IInvoiceActivity>({
  id: { type: String, required: true },
  invoiceId: { type: String, required: true },
  activityType: {
    type: String,
    enum: ['created', 'sent', 'viewed', 'payment_recorded', 'reminder_sent', 'status_changed', 'edited'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  performedBy: {
    type: String,
    required: [true, 'Performed by is required'],
    ref: 'User'
  },
  performedOn: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, { _id: false });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const refundSchema = new Schema<IRefund>({
  id: { type: String, required: true },
  paymentId: { type: String, required: true },
  invoiceId: { type: String, required: true, ref: 'Invoice' },
  amount: {
    type: Number,
    required: [true, 'Refund amount is required'],
    min: [0.01, 'Refund amount must be greater than 0']
  },
  refundDate: {
    type: Date,
    required: [true, 'Refund date is required']
  },
  reason: {
    type: String,
    required: [true, 'Refund reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  refundMethod: {
    type: String,
    enum: ['Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Cheque', 'Cash', 'Digital Wallet', 'Other'],
    required: [true, 'Refund method is required']
  },
  transactionReference: {
    type: String,
    trim: true,
    maxlength: [100, 'Transaction reference cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['Processed', 'Pending', 'Failed'],
    default: 'Pending'
  },
  processedBy: {
    type: String,
    required: [true, 'Processed by is required'],
    ref: 'User'
  },
  processedOn: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, { _id: false });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const creditNoteSchema = new Schema<ICreditNote>({
  id: { type: String, required: true },
  creditNoteNumber: {
    type: String,
    required: [true, 'Credit note number is required'],
    unique: true,
    trim: true
  },
  originalInvoiceId: {
    type: String,
    required: [true, 'Original invoice ID is required'],
    ref: 'Invoice'
  },
  clientId: {
    type: String,
    required: [true, 'Client ID is required'],
    ref: 'Person'
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  amount: {
    type: Number,
    required: [true, 'Credit note amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  reason: {
    type: String,
    required: [true, 'Credit note reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Draft', 'Issued', 'Applied'],
    default: 'Draft'
  },
  appliedToInvoiceId: {
    type: String,
    ref: 'Invoice'
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required'],
    ref: 'User'
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Main Invoice Schema
const invoiceSchema = new Schema<IInvoice>({
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Invoice number cannot exceed 50 characters']
  },
  clientId: {
    type: String,
    required: [true, 'Client ID is required'],
    ref: 'Person'
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [200, 'Client name cannot exceed 200 characters']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true,
    maxlength: [100, 'Contact person cannot exceed 100 characters']
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  clientPhone: {
    type: String,
    trim: true,
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  campaignId: {
    type: String,
    ref: 'Campaign'
  },
  campaignName: {
    type: String,
    trim: true,
    maxlength: [200, 'Campaign name cannot exceed 200 characters']
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft'
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    default: 'INR'
  },
  lineItems: {
    type: [invoiceLineItemSchema],
    required: [true, 'At least one line item is required'],
    validate: {
      validator: function(items: IInvoiceLineItem[]) {
        return items && items.length > 0;
      },
      message: 'Invoice must have at least one line item'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  discountType: {
    type: String,
    enum: ['amount', 'percentage'],
    default: 'amount'
  },
  discountValue: {
    type: Number,
    default: 0,
    min: [0, 'Discount value cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  taxAmount: {
    type: Number,
    required: true,
    min: [0, 'Tax amount cannot be negative']
  },
  adjustments: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: [0, 'Amount paid cannot be negative']
  },
  balanceDue: {
    type: Number,
    required: true,
    min: [0, 'Balance due cannot be negative']
  },
  payments: [paymentSchema],
  paymentTerms: {
    type: String,
    required: [true, 'Payment terms are required'],
    trim: true,
    maxlength: [200, 'Payment terms cannot exceed 200 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  termsAndConditions: {
    type: String,
    trim: true,
    maxlength: [2000, 'Terms and conditions cannot exceed 2000 characters']
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required'],
    ref: 'User'
  },
  lastPaymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Cheque', 'Cash', 'Digital Wallet', 'Other']
  },
  attachments: [{
    type: String,
    trim: true
  }],
  sentDate: {
    type: Date
  },
  remindersSent: {
    type: Number,
    default: 0,
    min: [0, 'Reminders sent cannot be negative']
  },
  lastReminderDate: {
    type: Date
  },
  activities: [invoiceActivitySchema]
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

// Pre-save middleware to calculate totals
invoiceSchema.pre('save', function(next) {
  // Calculate line item totals
  this.lineItems.forEach(item => {
    item.lineTotal = item.quantity * item.unitPrice;
    item.taxAmount = item.lineTotal * (item.taxPercentage / 100);
    item.totalWithTax = item.lineTotal + item.taxAmount;
  });

  // Calculate subtotal
  this.subtotal = this.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  // Calculate discount amount
  if (this.discountType === 'percentage') {
    this.discountAmount = (this.subtotal * this.discountValue) / 100;
  } else {
    this.discountAmount = this.discountValue;
  }

  // Calculate tax amount
  this.taxAmount = this.lineItems.reduce((sum, item) => sum + item.taxAmount, 0);

  // Calculate total amount
  this.totalAmount = this.subtotal - this.discountAmount + this.taxAmount + this.adjustments;

  // Calculate balance due
  this.balanceDue = this.totalAmount - this.amountPaid;

  // Update status based on payment
  if (this.amountPaid === 0) {
    if (this.status !== 'Draft' && this.status !== 'Sent' && this.status !== 'Cancelled') {
      // Check if overdue
      if (this.dueDate < new Date() && this.status !== 'Overdue') {
        this.status = 'Overdue';
      }
    }
  } else if (this.amountPaid >= this.totalAmount) {
    this.status = 'Paid';
  } else if (this.amountPaid > 0) {
    this.status = 'Partially Paid';
  }

  next();
});

// Indexes for better query performance
invoiceSchema.index({ clientId: 1 });
invoiceSchema.index({ campaignId: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ issueDate: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ totalAmount: 1 });
invoiceSchema.index({ createdBy: 1 });
invoiceSchema.index({ clientName: 'text', campaignName: 'text' });
invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ updatedAt: -1 });

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);