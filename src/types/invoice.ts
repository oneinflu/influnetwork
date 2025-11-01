// Invoice Status Types
export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

// Payment Status Types
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';

// Payment Method Types
export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Cheque' | 'Cash' | 'Digital Wallet' | 'Other';

// Currency Types
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

// Invoice Line Item Interface
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercentage: number;
  lineTotal: number; // quantity * unitPrice
  total: number; // Alias for lineTotal for backward compatibility
  taxAmount: number; // lineTotal * (taxPercentage / 100)
  totalWithTax: number; // lineTotal + taxAmount
}

// Invoice Interface
export interface Invoice {
  id: string;
  invoiceNumber: string; // Format: INF-<agency_code>-YYYYMM-0001
  clientId: string;
  clientName: string; // Brand/Company name
  contactPerson: string;
  clientEmail: string;
  clientPhone?: string;
  campaignId?: string;
  campaignName?: string;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  status: InvoiceStatus;
  currency: Currency;
  
  // Line Items
  lineItems: InvoiceLineItem[];
  
  // Calculations
  subtotal: number; // Sum of all line totals
  discountType: 'amount' | 'percentage';
  discountValue: number;
  discountAmount: number; // Calculated discount amount
  discount?: number; // Alias for discountAmount for backward compatibility
  taxAmount: number; // Sum of all tax amounts
  adjustments: number; // Additional adjustments (can be negative)
  totalAmount: number; // Final calculated total
  
  // Payment tracking
  amountPaid: number;
  balanceDue: number; // totalAmount - amountPaid
  payments?: Payment[]; // Associated payments
  
  // Terms and conditions
  paymentTerms: string; // e.g., "Net 15", "Due on receipt"
  notes?: string;
  termsAndConditions?: string;
  
  // Metadata
  createdBy: string;
  createdOn: string; // ISO date string
  lastUpdated: string; // ISO date string
  lastPaymentMethod?: PaymentMethod;
  
  // Attachments
  attachments?: string[];
  
  // Activity tracking
  sentDate?: string; // When invoice was sent
  remindersSent: number; // Count of reminders sent
  lastReminderDate?: string;
  activities?: InvoiceActivity[]; // Activity log
}

// Payment Interface
export interface Payment {
  id: string;
  invoiceId?: string; // Optional for advance payments
  amount: number;
  paymentDate: string; // ISO date string
  paymentMethod: PaymentMethod;
  transactionReference?: string; // UTR/Cheque No/Transaction ID
  status: PaymentStatus;
  notes?: string;
  receiptAttachment?: string;
  
  // Metadata
  recordedBy: string;
  recordedOn: string; // ISO date string
  lastUpdated: string;
}

// Payment Allocation Interface (for partial payments across multiple invoices)
export interface PaymentAllocation {
  id: string;
  paymentId: string;
  invoiceId: string;
  allocatedAmount: number;
  createdOn: string;
}

// Invoice Form Data Interface
export interface InvoiceFormData {
  clientId: string;
  clientName: string;
  contactPerson: string;
  clientEmail: string;
  clientPhone: string;
  campaignId: string;
  campaignName: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  lineItems: Omit<InvoiceLineItem, 'id' | 'lineTotal' | 'taxAmount' | 'totalWithTax'>[];
  discountType: 'amount' | 'percentage';
  discountValue: number;
  adjustments: number;
  paymentTerms: string;
  notes: string;
  termsAndConditions: string;
  attachments: string; // Comma-separated for form
  status: InvoiceStatus;
}

// Payment Form Data Interface
export interface PaymentFormData {
  invoiceIds: string[]; // Support multiple invoices
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  status: PaymentStatus;
  notes: string;
  receiptAttachment: string;
}

// Invoice Filters Interface
export interface InvoiceFilters {
  search: string;
  status: InvoiceStatus | 'All';
  clientName: string;
  campaignName: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  amountRange: {
    min: number;
    max: number;
  };
  paymentMethod: PaymentMethod | 'All';
  overdueDays: number; // Filter by overdue days
}

// Invoice Sort Configuration
export interface InvoiceSortConfig {
  field: keyof Invoice;
  direction: 'asc' | 'desc';
}

// Agency Configuration for Invoice Numbering
export interface AgencyConfig {
  id: string;
  agencyCode: string; // e.g., "AC123"
  agencyName: string;
  lastInvoiceSequence: number; // For generating invoice numbers
  defaultPaymentTerms: string;
  defaultCurrency: Currency;
}

// Invoice Activity Log
export interface InvoiceActivity {
  id: string;
  invoiceId: string;
  activityType: 'created' | 'sent' | 'viewed' | 'payment_recorded' | 'reminder_sent' | 'status_changed' | 'edited';
  description: string;
  performedBy: string;
  performedOn: string; // ISO date string
  metadata?: Record<string, any>; // Additional data for the activity
}

// Refund Interface
export interface Refund {
  id: string;
  paymentId: string;
  invoiceId: string;
  amount: number;
  refundDate: string;
  reason: string;
  refundMethod: PaymentMethod;
  transactionReference?: string;
  status: 'Processed' | 'Pending' | 'Failed';
  processedBy: string;
  processedOn: string;
  notes?: string;
}

// Credit Note Interface
export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  originalInvoiceId: string;
  clientId: string;
  issueDate: string;
  amount: number;
  reason: string;
  status: 'Draft' | 'Issued' | 'Applied';
  appliedToInvoiceId?: string; // If applied to future invoice
  createdBy: string;
  createdOn: string;
}

// Dropdown Options
export const INVOICE_STATUS_OPTIONS: InvoiceStatus[] = [
  'Draft',
  'Sent', 
  'Partially Paid',
  'Paid',
  'Overdue',
  'Cancelled'
];

export const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = [
  'Bank Transfer',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cheque',
  'Cash',
  'Digital Wallet',
  'Other'
];

export const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  'Completed',
  'Pending',
  'Failed'
];

export const CURRENCY_OPTIONS: Currency[] = [
  'INR',
  'USD',
  'EUR',
  'GBP'
];

// Utility Functions
export const generateInvoiceNumber = (agencyCode: string, sequence: number): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const sequenceStr = String(sequence).padStart(4, '0');
  return `INF-${agencyCode}-${year}${month}-${sequenceStr}`;
};

export const calculateInvoiceTotals = (lineItems: InvoiceLineItem[], discountType: 'amount' | 'percentage', discountValue: number, adjustments: number = 0) => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalTax = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
  
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * discountValue) / 100;
  } else {
    discountAmount = discountValue;
  }
  
  const totalAmount = subtotal + totalTax - discountAmount + adjustments;
  
  return {
    subtotal,
    totalTax,
    discountAmount,
    totalAmount: Math.max(0, totalAmount) // Ensure non-negative
  };
};

export const getInvoiceStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case 'Draft':
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    case 'Sent':
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-800/20';
    case 'Partially Paid':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-800/20';
    case 'Paid':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-800/20';
    case 'Overdue':
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-800/20';
    case 'Cancelled':
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
  }
};

export const getInvoiceStatusBadgeColor = (status: InvoiceStatus): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark' => {
  switch (status) {
    case 'Draft':
      return 'light';
    case 'Sent':
      return 'info';
    case 'Partially Paid':
      return 'warning';
    case 'Paid':
      return 'success';
    case 'Overdue':
      return 'error';
    case 'Cancelled':
      return 'dark';
    default:
      return 'light';
  }
};

export const isInvoiceOverdue = (dueDate: string, status: InvoiceStatus): boolean => {
  if (status === 'Paid' || status === 'Cancelled') return false;
  return new Date(dueDate) < new Date();
};

export const formatCurrency = (amount: number, currency: Currency = 'INR'): string => {
  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  
  return `${currencySymbols[currency]}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};