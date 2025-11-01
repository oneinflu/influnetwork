import { useState } from "react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { 
  DollarLineIcon, 
  EyeIcon, 
  DownloadIcon,
  MoreDotIcon 
} from "../../icons";
import Button from "../ui/button/Button";
import { Payment, PaymentStatus, Currency, PaymentAllocation } from "../../types/invoice";

// Extended Payment interface for display purposes
interface PaymentWithDetails extends Payment {
  paymentNumber: string;
  reference: string;
  currency: Currency;
  allocations: PaymentAllocation[];
}

interface PaymentHistoryTableProps {
  payments: PaymentWithDetails[];
  onViewPayment?: (payment: PaymentWithDetails) => void;
  onDownloadReceipt?: (payment: PaymentWithDetails) => void;
  onRefundPayment?: (payment: PaymentWithDetails) => void;
}

// Sample payment data
const samplePayments: PaymentWithDetails[] = [
  {
    id: "PAY-001",
    paymentNumber: "PAY-AC123-202511-0001",
    paymentDate: "2024-11-15",
    amount: 85550,
    currency: "INR" as Currency,
    paymentMethod: "Bank Transfer",
    status: "Completed" as PaymentStatus,
    reference: "TXN123456789",
    notes: "Payment for Invoice INF-AC123-202511-0002",
    allocations: [
      {
        id: "ALLOC-001",
        paymentId: "PAY-001",
        invoiceId: "2",
        allocatedAmount: 85550,
        createdOn: "2024-11-15T10:30:00Z"
      }
    ],
    recordedBy: "user@example.com",
    recordedOn: "2024-11-15T10:30:00Z",
    lastUpdated: "2024-11-15T10:30:00Z"
  },
  {
    id: "PAY-002",
    paymentNumber: "PAY-AC123-202511-0002",
    paymentDate: "2024-11-10",
    amount: 129800,
    currency: "INR" as Currency,
    paymentMethod: "Credit Card",
    status: "Completed" as PaymentStatus,
    reference: "CC987654321",
    notes: "Full payment for multiple invoices",
    allocations: [
      {
        id: "ALLOC-002",
        paymentId: "PAY-002",
        invoiceId: "4",
        allocatedAmount: 79355,
        createdOn: "2024-11-10T14:20:00Z"
      },
      {
        id: "ALLOC-003",
        paymentId: "PAY-002",
        invoiceId: "5",
        allocatedAmount: 50445,
        createdOn: "2024-11-10T14:20:00Z"
      }
    ],
    recordedBy: "user@example.com",
    recordedOn: "2024-11-10T14:20:00Z",
    lastUpdated: "2024-11-10T14:20:00Z"
  },
  {
    id: "PAY-003",
    paymentNumber: "PAY-AC123-202511-0003",
    paymentDate: "2024-11-08",
    amount: 45000,
    currency: "INR" as Currency,
    paymentMethod: "UPI",
    status: "Pending" as PaymentStatus,
    reference: "UPI123456789",
    notes: "Partial payment for Invoice INF-AC123-202511-0001",
    allocations: [
      {
        id: "ALLOC-004",
        paymentId: "PAY-003",
        invoiceId: "1",
        allocatedAmount: 45000,
        createdOn: "2024-11-08T09:15:00Z"
      }
    ],
    recordedBy: "user@example.com",
    recordedOn: "2024-11-08T09:15:00Z",
    lastUpdated: "2024-11-08T09:15:00Z"
  }
];

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'Failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

export default function PaymentHistoryTable({
  payments = samplePayments,
  onViewPayment,
  onDownloadReceipt,
 
}: PaymentHistoryTableProps) {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPayments(
      selectedPayments.length === payments.length 
        ? [] 
        : payments.map(p => p.id)
    );
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarLineIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Payment History
            </h3>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm">
              {payments.length} payments
            </span>
          </div>
          {selectedPayments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPayments.length} selected
              </span>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-white/[0.02]">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedPayments.length === payments.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payment Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount & Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Invoice Allocations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
            {payments.map((payment) => (
              <tr 
                key={payment.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => handleSelectPayment(payment.id)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                      {payment.paymentNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Ref: {payment.reference}
                    </div>
                    {payment.notes && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {payment.notes}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.paymentMethod}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {payment.allocations.map((allocation, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-gray-900 dark:text-white/90">
                          Invoice ID: {allocation.invoiceId}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {formatCurrency(allocation.allocatedAmount, payment.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(payment.paymentDate)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewPayment?.(payment)}
                      className="p-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadReceipt?.(payment)}
                      className="p-2"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2"
                    >
                      <MoreDotIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {payments.length === 0 && (
        <div className="text-center py-12">
          <DollarLineIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">
            No payments recorded
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Payment history will appear here once you start recording payments.
          </p>
        </div>
      )}

      {/* Summary Footer */}
      {payments.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              Total Payments: {payments.length}
            </div>
            <div className="text-gray-900 dark:text-white/90 font-medium">
              Total Amount: {formatCurrency(
                payments.reduce((sum, payment) => sum + payment.amount, 0),
                payments[0]?.currency || 'INR'
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}