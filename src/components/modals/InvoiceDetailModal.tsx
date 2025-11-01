import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { 
  PencilIcon, 
  TrashBinIcon, 
  CloseIcon, 
  DocsIcon, 
  PaperPlaneIcon, 
  DollarLineIcon, 
  CopyIcon,
  
  FileIcon,
  TimeIcon,
  DownloadIcon
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { Invoice,  getInvoiceStatusBadgeColor, formatCurrency } from "../../types/invoice";

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onSend: (invoiceId: string) => void;
  onDownload: (invoiceId: string) => void;
  onDuplicate: (invoiceId: string) => void;
  onRecordPayment: (invoiceId: string) => void;
  onSendReminder: (invoiceId: string) => void;
  onVoid: (invoiceId: string) => void;
}

type TabType = 'overview' | 'line-items' | 'payments' | 'attachments' | 'activity';

export default function InvoiceDetailModal({ 
  isOpen, 
  onClose, 
  invoice, 
  onEdit, 
 
  onSend, 
  onDownload, 
  onDuplicate, 
  onRecordPayment, 
  onSendReminder, 
  onVoid 
}: InvoiceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!invoice) return null;

  const balanceDue = invoice.totalAmount - invoice.amountPaid;
  const paymentPercentage = (invoice.amountPaid / invoice.totalAmount) * 100;


  const handleVoid = () => {
    if (window.confirm('Are you sure you want to void this invoice? This action cannot be undone.')) {
      onVoid(invoice.id);
      onClose();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DocsIcon },
    { id: 'line-items', label: 'Line Items', icon: DocsIcon },
    { id: 'payments', label: 'Payments', icon: DollarLineIcon },
    { id: 'attachments', label: 'Attachments', icon: FileIcon },
    { id: 'activity', label: 'Activity', icon: TimeIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Invoice Summary</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtotal</label>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{formatCurrency(invoice.subtotal, invoice.currency)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Discount</label>
                  <p className="text-gray-800 dark:text-white/90">{formatCurrency(invoice.discount || 0, invoice.currency)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tax</label>
                  <p className="text-gray-800 dark:text-white/90">{formatCurrency(invoice.taxAmount || 0, invoice.currency)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</label>
                  <p className="text-gray-800 dark:text-white/90 font-bold text-lg">{formatCurrency(invoice.totalAmount, invoice.currency)}</p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Payment Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount Paid</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance Due</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">{formatCurrency(balanceDue, invoice.currency)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${paymentPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {paymentPercentage.toFixed(1)}% paid
                </p>
              </div>
            </div>

            {/* Notes & Terms */}
            {(invoice.notes || invoice.paymentTerms) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Notes & Terms</h3>
                <div className="space-y-4">
                  {invoice.paymentTerms && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Terms</label>
                      <p className="text-gray-800 dark:text-white/90">{invoice.paymentTerms}</p>
                    </div>
                  )}
                  {invoice.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                      <p className="text-gray-800 dark:text-white/90">{invoice.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'line-items':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">Qty</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">Unit Price</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">Tax %</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {invoice.lineItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90 text-right">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90 text-right">{item.taxPercentage || 0}%</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90 text-right font-medium">{formatCurrency(item.total, invoice.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-4">
            {invoice.payments && invoice.payments.length > 0 ? (
              <div className="space-y-3">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <DollarLineIcon className="size-5 text-green-600" />
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          {formatCurrency(payment.amount, invoice.currency)}
                        </span>
                        <Badge color={payment.status === 'Completed' ? 'success' : payment.status === 'Pending' ? 'warning' : 'error'}>
                          {payment.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Method:</span>
                        <span className="ml-2 text-gray-800 dark:text-white/90">{payment.paymentMethod}</span>
                      </div>
                      {payment.transactionReference && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                          <span className="ml-2 text-gray-800 dark:text-white/90">{payment.transactionReference}</span>
                        </div>
                      )}
                    </div>
                    {payment.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{payment.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarLineIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">No payments recorded</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Record the first payment for this invoice</p>
                <Button onClick={() => onRecordPayment(invoice.id)}>
                  Record Payment
                </Button>
              </div>
            )}
          </div>
        );

      case 'attachments':
        return (
          <div className="space-y-4">
            {invoice.attachments && invoice.attachments.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {invoice.attachments.map((attachment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileIcon className="size-5 text-gray-600" />
                      <span className="text-gray-800 dark:text-white/90">{attachment}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">No attachments</h3>
                <p className="text-gray-500 dark:text-gray-400">No files have been attached to this invoice</p>
              </div>
            )}
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-4">
            {invoice.activities && invoice.activities.length > 0 ? (
              <div className="space-y-3">
                {invoice.activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <TimeIcon className="size-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-800 dark:text-white/90">{activity.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{activity.performedBy}</span>
                          <span>{new Date(activity.performedOn).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TimeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">No activity</h3>
                <p className="text-gray-500 dark:text-gray-400">No activity has been recorded for this invoice</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-6xl mx-2 sm:mx-4 my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh]">
      <div className="relative w-full h-full overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
        <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                Invoice {invoice.invoiceNumber}
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <Badge color={getInvoiceStatusBadgeColor(invoice.status)}>
                  {invoice.status}
                </Badge>
                <span className="text-gray-600 dark:text-gray-400">
                  {invoice.clientName}
                </span>
                {invoice.campaignName && (
                  <span className="text-gray-600 dark:text-gray-400">
                    • {invoice.campaignName}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                  <span className="ml-2 text-gray-800 dark:text-white/90">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                  <span className="ml-2 text-gray-800 dark:text-white/90">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="ml-2 text-gray-800 dark:text-white/90 font-bold">
                    {formatCurrency(invoice.totalAmount, invoice.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Balance Due:</span>
                  <span className="ml-2 text-gray-800 dark:text-white/90 font-bold">
                    {formatCurrency(balanceDue, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onSendReminder(invoice.id)} size="sm">
                <PaperPlaneIcon className="size-4" />
              </Button>
              <Button variant="outline" onClick={() => onDownload(invoice.id)} size="sm">
                <DownloadIcon className="size-4" />
              </Button>
              <Button variant="outline" onClick={onClose} size="sm">
                <CloseIcon className="size-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <Button onClick={() => onSend(invoice.id)} size="sm">
              <PaperPlaneIcon className="size-4 mr-2" />
              Send Invoice
            </Button>
            <Button onClick={() => onRecordPayment(invoice.id)} size="sm">
              <DollarLineIcon className="size-4 mr-2" />
              Record Payment
            </Button>
            <Button variant="outline" onClick={() => onDownload(invoice.id)} size="sm">
              <DownloadIcon className="size-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => onDuplicate(invoice.id)} size="sm">
              <CopyIcon className="size-4 mr-2" />
              Duplicate
            </Button>
            {invoice.status === 'Draft' && (
              <Button variant="outline" onClick={() => onEdit(invoice)} size="sm">
                <PencilIcon className="size-4 mr-2" />
                Edit
              </Button>
            )}
            {(invoice.status === 'Draft' || invoice.status === 'Sent') && (
              <Button variant="outline" onClick={handleVoid} size="sm" className="text-red-600 hover:text-red-700">
                <TrashBinIcon className="size-4 mr-2" />
                Void
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {invoice.status === 'Draft' && (
              <Button onClick={() => onEdit(invoice)} className="flex items-center gap-2">
                <PencilIcon className="size-4" />
                Edit Invoice
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}