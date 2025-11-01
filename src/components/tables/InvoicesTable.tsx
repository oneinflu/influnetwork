import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { 
  EyeIcon, 
  PencilIcon, 
  TrashBinIcon, 
  DocsIcon, 
  PaperPlaneIcon,
  DollarLineIcon,
  CopyIcon
} from "../../icons";
import { Invoice, formatCurrency,  isInvoiceOverdue } from "../../types/invoice";

// Sample data for demonstration
const sampleInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INF-AC123-202511-0001",
    clientId: "client-1",
    clientName: "Nykaa",
    contactPerson: "Rohan Sharma",
    clientEmail: "rohan@nykaa.com",
    clientPhone: "+91 98765 43210",
    campaignId: "campaign-1",
    campaignName: "Diwali Beauty Campaign",
    issueDate: "2025-11-01",
    dueDate: "2025-11-16",
    status: "Sent",
    currency: "INR",
    lineItems: [],
    subtotal: 85000,
    discountType: "percentage",
    discountValue: 10,
    discountAmount: 8500,
    taxAmount: 13770,
    adjustments: 0,
    totalAmount: 90270,
    amountPaid: 0,
    balanceDue: 90270,
    paymentTerms: "Net 15",
    notes: "Diwali campaign content creation and management",
    createdBy: "Ritika (Manager)",
    createdOn: "2025-11-01T10:00:00Z",
    lastUpdated: "2025-11-01T10:00:00Z",
    lastPaymentMethod: undefined,
    remindersSent: 0
  },
  {
    id: "2",
    invoiceNumber: "INF-AC123-202511-0002",
    clientId: "client-2",
    clientName: "Tanishq",
    contactPerson: "Priya Mehta",
    clientEmail: "priya@tanishq.co.in",
    clientPhone: "+91 87654 32109",
    campaignId: "campaign-2",
    campaignName: "Wedding Season Campaign",
    issueDate: "2025-10-28",
    dueDate: "2025-11-12",
    status: "Partially Paid",
    currency: "INR",
    lineItems: [],
    subtotal: 150000,
    discountType: "amount",
    discountValue: 5000,
    discountAmount: 5000,
    taxAmount: 26100,
    adjustments: 0,
    totalAmount: 171100,
    amountPaid: 85550,
    balanceDue: 85550,
    paymentTerms: "Net 15",
    notes: "Jewelry campaign for wedding season",
    createdBy: "Amit (Sales)",
    createdOn: "2025-10-28T14:30:00Z",
    lastUpdated: "2025-11-05T09:15:00Z",
    lastPaymentMethod: "Bank Transfer",
    remindersSent: 1,
    sentDate: "2025-10-28T15:00:00Z"
  },
  {
    id: "3",
    invoiceNumber: "INF-AC123-202511-0003",
    clientId: "client-3",
    clientName: "Zudio",
    contactPerson: "Karan Singh",
    clientEmail: "karan@zudio.com",
    clientPhone: "+91 76543 21098",
    campaignId: undefined,
    campaignName: undefined,
    issueDate: "2025-10-15",
    dueDate: "2025-10-30",
    status: "Overdue",
    currency: "INR",
    lineItems: [],
    subtotal: 45000,
    discountType: "percentage",
    discountValue: 5,
    discountAmount: 2250,
    taxAmount: 7695,
    adjustments: 0,
    totalAmount: 50445,
    amountPaid: 0,
    balanceDue: 50445,
    paymentTerms: "Net 15",
    notes: "Brand launch campaign content",
    createdBy: "Sarah (Executive)",
    createdOn: "2025-10-15T11:20:00Z",
    lastUpdated: "2025-10-15T11:20:00Z",
    lastPaymentMethod: undefined,
    remindersSent: 2,
    sentDate: "2025-10-15T12:00:00Z",
    lastReminderDate: "2025-11-02T10:00:00Z"
  },
  {
    id: "4",
    invoiceNumber: "INF-AC123-202511-0004",
    clientId: "client-4",
    clientName: "Myntra",
    contactPerson: "Arjun Patel",
    clientEmail: "arjun@myntra.com",
    clientPhone: "+91 65432 10987",
    campaignId: "campaign-4",
    campaignName: "Fashion Week Campaign",
    issueDate: "2025-11-03",
    dueDate: "2025-11-18",
    status: "Paid",
    currency: "INR",
    lineItems: [],
    subtotal: 120000,
    discountType: "amount",
    discountValue: 10000,
    discountAmount: 10000,
    taxAmount: 19800,
    adjustments: 0,
    totalAmount: 129800,
    amountPaid: 129800,
    balanceDue: 0,
    paymentTerms: "Net 15",
    notes: "Fashion week content and influencer management",
    createdBy: "Ritika (Manager)",
    createdOn: "2025-11-03T16:45:00Z",
    lastUpdated: "2025-11-06T14:20:00Z",
    lastPaymentMethod: "UPI",
    remindersSent: 0,
    sentDate: "2025-11-03T17:00:00Z"
  },
  {
    id: "5",
    invoiceNumber: "INF-AC123-202511-0005",
    clientId: "client-5",
    clientName: "Boat",
    contactPerson: "Neha Gupta",
    clientEmail: "neha@boat-lifestyle.com",
    clientPhone: "+91 54321 09876",
    campaignId: undefined,
    campaignName: undefined,
    issueDate: "2025-11-05",
    dueDate: "2025-11-20",
    status: "Draft",
    currency: "INR",
    lineItems: [],
    subtotal: 75000,
    discountType: "percentage",
    discountValue: 8,
    discountAmount: 6000,
    taxAmount: 12420,
    adjustments: 0,
    totalAmount: 81420,
    amountPaid: 0,
    balanceDue: 81420,
    paymentTerms: "Net 15",
    notes: "Audio product campaign - draft pending approval",
    createdBy: "Amit (Sales)",
    createdOn: "2025-11-05T13:10:00Z",
    lastUpdated: "2025-11-05T13:10:00Z",
    lastPaymentMethod: undefined,
    remindersSent: 0
  }
];

interface InvoicesTableProps {
  onViewInvoice?: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoiceId: string) => void;
  onRecordPayment?: (invoice: Invoice) => void;
  onSendInvoice?: (invoice: Invoice) => void;
  onDownloadInvoice?: (invoice: Invoice) => void;
  onDuplicateInvoice?: (invoice: Invoice) => void;
}

export default function InvoicesTable({
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onRecordPayment,
  onSendInvoice,
  onDownloadInvoice,
  onDuplicateInvoice
}: InvoicesTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);

  // Action handlers
  const handleViewInvoice = (invoice: Invoice) => {
    onViewInvoice?.(invoice);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    onEditInvoice?.(invoice);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
      onDeleteInvoice?.(invoiceId);
    }
  };

  const handleRecordPayment = (invoice: Invoice) => {
    onRecordPayment?.(invoice);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    onSendInvoice?.(invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    onDownloadInvoice?.(invoice);
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    onDuplicateInvoice?.(invoice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getOverdueDays = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/[0.05]">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Invoices & Payments
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage invoices, track payments, and monitor outstanding balances
          </p>
        </div>
        <Button onClick={() => onEditInvoice?.(null as any)}>
          Create Invoice
        </Button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Invoice #
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Client (Brand)
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Campaign / Project
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Issue Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Due Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Paid
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Balance Due
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Payment Method
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Created By
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {invoices.map((invoice) => {
              const isOverdue = isInvoiceOverdue(invoice.dueDate, invoice.status);
              const overdueDays = isOverdue ? getOverdueDays(invoice.dueDate) : 0;
              
              return (
                <TableRow key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  {/* Invoice Number */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      {invoice.invoiceNumber}
                    </button>
                  </TableCell>

                  {/* Client (Brand) */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white/90">
                        {invoice.clientName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.contactPerson}
                      </div>
                    </div>
                  </TableCell>

                  {/* Campaign / Project */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="text-sm text-gray-900 dark:text-white/90">
                      {invoice.campaignName || '-'}
                    </div>
                  </TableCell>

                  {/* Issue Date */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="text-sm text-gray-900 dark:text-white/90">
                      {formatDate(invoice.issueDate)}
                    </div>
                  </TableCell>

                  {/* Due Date */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-white/90'}`}>
                      {formatDate(invoice.dueDate)}
                      {isOverdue && (
                        <div className="text-xs text-red-500 dark:text-red-400">
                          {overdueDays} days overdue
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Badge
                      variant="light"
                      color={
                        invoice.status === 'Draft' ? 'light' :
                        invoice.status === 'Sent' ? 'info' :
                        invoice.status === 'Partially Paid' ? 'warning' :
                        invoice.status === 'Paid' ? 'success' :
                        invoice.status === 'Overdue' ? 'error' :
                        'light'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>

                  {/* Total */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="font-medium text-gray-900 dark:text-white/90">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </div>
                  </TableCell>

                  {/* Paid */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="text-sm text-gray-900 dark:text-white/90">
                      {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </div>
                  </TableCell>

                  {/* Balance Due */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className={`font-medium ${invoice.balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {formatCurrency(invoice.balanceDue, invoice.currency)}
                    </div>
                  </TableCell>

                  {/* Payment Method */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="text-sm text-gray-900 dark:text-white/90">
                      {invoice.lastPaymentMethod || '-'}
                    </div>
                  </TableCell>

                  {/* Created By */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="text-sm text-gray-900 dark:text-white/90">
                      {invoice.createdBy}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                        className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>

                      {/* Edit (only for Draft) */}
                      {invoice.status === 'Draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Send (for Draft and Sent) */}
                      {(invoice.status === 'Draft' || invoice.status === 'Sent') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendInvoice(invoice)}
                          className="p-1.5 h-auto text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <PaperPlaneIcon className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Download */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <DocsIcon className="w-4 h-4" />
                      </Button>

                      {/* Record Payment (for unpaid invoices) */}
                      {invoice.balanceDue > 0 && invoice.status !== 'Draft' && invoice.status !== 'Cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecordPayment(invoice)}
                          className="p-1.5 h-auto text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200"
                        >
                          <DollarLineIcon className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Duplicate */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateInvoice(invoice)}
                        className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>

                      {/* Delete (only for Draft) */}
                      {invoice.status === 'Draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-1.5 h-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <div className="text-center py-12">
          <DocsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">
            No invoices found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by creating your first invoice
          </p>
          <Button onClick={() => onEditInvoice?.(null as any)}>
            Create Invoice
          </Button>
        </div>
      )}
    </div>
  );
}