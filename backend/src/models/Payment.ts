import mongoose, { Schema, Document } from 'mongoose';

// Payment types
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';
export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Cheque' | 'Cash' | 'Digital Wallet' | 'Other';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

// Payment Allocation interface
export interface IPaymentAllocation extends Document {
  paymentId: mongoose.Types.ObjectId;
  invoiceId: mongoose.Types.ObjectId;
  allocatedAmount: number;
  createdOn: Date;
}

// Payment interface
export interface IPayment extends Document {
  paymentNumber: string;
  invoiceIds: mongoose.Types.ObjectId[];
  amount: number;
  currency: Currency;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: PaymentStatus;
  notes?: string;
  receiptAttachment?: string;
  allocations: IPaymentAllocation[];
  recordedBy: mongoose.Types.ObjectId;
  recordedOn: Date;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Allocation schema
const paymentAllocationSchema = new Schema<IPaymentAllocation>({
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: [true, 'Payment ID is required']
  },
  invoiceId: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required']
  },
  allocatedAmount: {
    type: Number,
    required: [true, 'Allocated amount is required'],
    min: [0, 'Allocated amount cannot be negative']
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true,
  toJSON: {
    transform: function(doc, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __v, ...rest } = ret;
      return rest;
    }
  }
});

// Payment schema
const paymentSchema = new Schema<IPayment>({
  paymentNumber: {
    type: String,
    required: [true, 'Payment number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^PAY-[A-Z0-9]+-\d{6}-\d{4}$/.test(v);
      },
      message: 'Payment number must follow format: PAY-<code>-YYYYMM-0001'
    }
  },
  invoiceIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  }],
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: {
      values: ['INR', 'USD', 'EUR', 'GBP'],
      message: 'Invalid currency'
    },
    default: 'INR'
  },
  paymentDate: {
    type: Date,
    required: [true, 'Payment date is required'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Cheque', 'Cash', 'Digital Wallet', 'Other'],
      message: 'Invalid payment method'
    }
  },
  transactionReference: {
    type: String,
    trim: true,
    maxlength: [100, 'Transaction reference cannot exceed 100 characters']
  },
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: {
      values: ['Completed', 'Pending', 'Failed'],
      message: 'Invalid payment status'
    },
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
  allocations: [paymentAllocationSchema],
  recordedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recorded by is required']
  },
  recordedOn: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
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
paymentSchema.index({ invoiceIds: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ recordedBy: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ amount: -1 });

// Compound indexes
paymentSchema.index({ status: 1, paymentDate: -1 });
paymentSchema.index({ recordedBy: 1, status: 1 });
paymentSchema.index({ paymentMethod: 1, status: 1 });

// Pre-save middleware to update lastUpdated
paymentSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Pre-save middleware to generate payment number
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.paymentNumber) {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const yearMonth = `${year}${month}`;
      
      // Find the last payment number for this month
      const PaymentModel = this.constructor as mongoose.Model<IPayment>;
      const lastPayment = await PaymentModel.findOne({
        paymentNumber: new RegExp(`^PAY-AC123-${yearMonth}-`)
      }).sort({ paymentNumber: -1 });
      
      let sequence = 1;
      if (lastPayment && lastPayment.paymentNumber) {
        const lastSequence = parseInt(lastPayment.paymentNumber.split('-').pop() || '0');
        sequence = lastSequence + 1;
      }
      
      this.paymentNumber = `PAY-AC123-${yearMonth}-${String(sequence).padStart(4, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Pre-save middleware to validate allocations
paymentSchema.pre('save', function(next) {
  if (this.allocations && this.allocations.length > 0) {
    const totalAllocated = this.allocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
    
    // Allow some tolerance for floating point precision
    const tolerance = 0.01;
    if (Math.abs(totalAllocated - this.amount) > tolerance) {
      return next(new Error('Total allocated amount must equal payment amount'));
    }
  }
  next();
});

// Virtual for total allocated amount
paymentSchema.virtual('totalAllocated').get(function() {
  if (!this.allocations || this.allocations.length === 0) return 0;
  return this.allocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
});

// Virtual for unallocated amount
paymentSchema.virtual('unallocatedAmount').get(function() {
  const totalAllocated = this.allocations && this.allocations.length > 0 
    ? this.allocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0)
    : 0;
  return this.amount - totalAllocated;
});

// Virtual for formatted payment number
paymentSchema.virtual('formattedPaymentNumber').get(function() {
  return this.paymentNumber || 'N/A';
});

// Static method to get payments by status
paymentSchema.statics.getPaymentsByStatus = function(status: PaymentStatus) {
  return this.find({ status })
    .populate('invoiceIds', 'invoiceNumber clientName totalAmount')
    .populate('recordedBy', 'fullName email')
    .sort({ paymentDate: -1 });
};

// Static method to get payments by date range
paymentSchema.statics.getPaymentsByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    paymentDate: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .populate('invoiceIds', 'invoiceNumber clientName totalAmount')
    .populate('recordedBy', 'fullName email')
    .sort({ paymentDate: -1 });
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

// Static method to get payments by payment method
paymentSchema.statics.getPaymentsByMethod = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

// Instance method to add allocation
paymentSchema.methods.addAllocation = function(invoiceId: string, amount: number) {
  const allocation = {
    paymentId: this._id,
    invoiceId,
    allocatedAmount: amount,
    createdOn: new Date()
  };
  
  this.allocations.push(allocation);
  return this.save();
};

// Instance method to remove allocation
paymentSchema.methods.removeAllocation = function(allocationId: string) {
  this.allocations = this.allocations.filter(
    (allocation: IPaymentAllocation & { _id: mongoose.Types.ObjectId }) => 
      allocation._id.toString() !== allocationId
  );
  return this.save();
};

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);