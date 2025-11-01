import { useState } from "react";

import InvoicesTable from "../components/tables/InvoicesTable";
import PaymentHistoryTable from "../components/tables/PaymentHistoryTable";
import InvoiceFormModal from "../components/modals/InvoiceFormModal";
import InvoiceDetailModal from "../components/modals/InvoiceDetailModal";
import PaymentFormModal from "../components/modals/PaymentFormModal";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import { useModal } from "../hooks/useModal";
import { 
  PlusIcon, 
  DollarLineIcon, 
  DocsIcon,
  ListIcon,
  
} from "../icons";
import { 
  Invoice, 
  InvoiceStatus, 
  PaymentFormData,
  INVOICE_STATUS_OPTIONS 
} from "../types/invoice";

// Sample invoices for available payments allocation
const availableInvoicesForPayment = [
  {
    id: "1",
    invoiceNumber: "INF-AC123-202511-0001",
    clientName: "Nykaa",
    totalAmount: 90270,
    balanceDue: 90270,
    currency: "INR"
  },
  {
    id: "2", 
    invoiceNumber: "INF-AC123-202511-0002",
    clientName: "Tanishq",
    totalAmount: 171100,
    balanceDue: 85550,
    currency: "INR"
  },
  {
    id: "3",
    invoiceNumber: "INF-AC123-202511-0003", 
    clientName: "Zudio",
    totalAmount: 50445,
    balanceDue: 50445,
    currency: "INR"
  }
];

export default function InvoicesPayments() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [filters, setFilters] = useState({
    search: '',
    status: 'All' as InvoiceStatus | 'All',
    dateRange: 'all'
  });

  // Modal states
  const invoiceFormModal = useModal();
  const invoiceDetailModal = useModal();
  const paymentFormModal = useModal();
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceFormMode, setInvoiceFormMode] = useState<'add' | 'edit'>('add');

  // Status filter options
  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    ...INVOICE_STATUS_OPTIONS.map(status => ({
      value: status,
      label: status
    }))
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  // Invoice action handlers
  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setInvoiceFormMode('add');
    invoiceFormModal.openModal();
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    invoiceDetailModal.openModal();
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceFormMode('edit');
    invoiceFormModal.openModal();
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    console.log('Delete invoice:', invoiceId);
    // Implementation would update the invoices list
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    paymentFormModal.openModal();
  };

  const handleSendInvoice = (invoice: Invoice) => {
    console.log('Send invoice:', invoice.id);
    // Implementation would update invoice status to 'Sent'
    // and record activity
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice.id);
    // Implementation would generate and download PDF
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceFormMode('add'); // Duplicate as new invoice
    invoiceFormModal.openModal();
  };

  // Invoice form handlers
  const handleSaveInvoice = (invoiceData: any) => {
    console.log('Save invoice:', invoiceData);
    // Implementation would save/update invoice
    invoiceFormModal.closeModal();
  };

  // Payment form handlers
  const handleSavePayment = (paymentData: PaymentFormData) => {
    console.log('Save payment:', paymentData);
    // Implementation would:
    // 1. Create payment record
    // 2. Update invoice(s) status and amounts
    // 3. Record activity log
    paymentFormModal.closeModal();
  };

  // Invoice detail modal handlers
  const handleInvoiceEdit = () => {
    invoiceDetailModal.closeModal();
    handleEditInvoice(selectedInvoice!);
  };

  const handleInvoiceDelete = () => {
    if (selectedInvoice) {
      handleDeleteInvoice(selectedInvoice.id);
      invoiceDetailModal.closeModal();
    }
  };

  const handleInvoiceSend = () => {
    if (selectedInvoice) {
      handleSendInvoice(selectedInvoice);
      invoiceDetailModal.closeModal();
    }
  };

  const handleInvoiceDownload = () => {
    if (selectedInvoice) {
      handleDownloadInvoice(selectedInvoice);
    }
  };

  const handleInvoiceDuplicate = () => {
    if (selectedInvoice) {
      invoiceDetailModal.closeModal();
      handleDuplicateInvoice(selectedInvoice);
    }
  };

  const handleInvoiceRecordPayment = () => {
    if (selectedInvoice) {
      invoiceDetailModal.closeModal();
      handleRecordPayment(selectedInvoice);
    }
  };

  const handleSendReminder = () => {
    console.log('Send reminder for invoice:', selectedInvoice?.id);
    // Implementation would send reminder and update activity log
  };

  const handleVoidInvoice = () => {
    console.log('Void invoice:', selectedInvoice?.id);
    // Implementation would update invoice status to 'Cancelled'
  };

  return (
    <div className="p-6 space-y-6">
    
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Invoices & Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage invoices, track payments, and monitor your financial transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => paymentFormModal.openModal()}
            className="flex items-center gap-2"
          >
            <DollarLineIcon className="w-4 h-4" />
            Record Payment
          </Button>
          <Button
            onClick={handleCreateInvoice}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <ListIcon className="w-5 h-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search invoices, clients, campaigns..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div>
            <Select
              options={statusOptions}
              placeholder="Filter by status"
              onChange={(value) => setFilters(prev => ({ ...prev, status: value as InvoiceStatus | 'All' }))}
              defaultValue={filters.status}
            />
          </div>
          <div>
            <Select
              options={dateRangeOptions}
              placeholder="Filter by date"
              onChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              defaultValue={filters.dateRange}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">24</p>
            </div>
            <DocsIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">₹2,26,265</p>
            </div>
            <DollarLineIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Paid This Month</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">₹1,29,800</p>
            </div>
            <DollarLineIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">₹50,445</p>
            </div>
            <DollarLineIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-white/[0.05]">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'invoices'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <DocsIcon className="w-4 h-4" />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'payments'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <DollarLineIcon className="w-4 h-4" />
            Payment History
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'invoices' ? (
            <InvoicesTable
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onRecordPayment={handleRecordPayment}
              onSendInvoice={handleSendInvoice}
              onDownloadInvoice={handleDownloadInvoice}
              onDuplicateInvoice={handleDuplicateInvoice}
            />
          ) : (
            <PaymentHistoryTable
              payments={[]}
              onViewPayment={(payment) => console.log('View payment:', payment)}
              onDownloadReceipt={(payment) => console.log('Download receipt:', payment)}
              onRefundPayment={(payment) => console.log('Refund payment:', payment)}
            />
          )}
        </div>
      </div>

      {/* Invoice Form Modal */}
      <InvoiceFormModal
        isOpen={invoiceFormModal.isOpen}
        onClose={invoiceFormModal.closeModal}
        onSave={handleSaveInvoice}
        invoice={selectedInvoice}
        mode={invoiceFormMode}
      />

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={invoiceDetailModal.isOpen}
        onClose={invoiceDetailModal.closeModal}
        invoice={selectedInvoice}
        onEdit={handleInvoiceEdit}
        onDelete={handleInvoiceDelete}
        onSend={handleInvoiceSend}
        onDownload={handleInvoiceDownload}
        onDuplicate={handleInvoiceDuplicate}
        onRecordPayment={handleInvoiceRecordPayment}
        onSendReminder={handleSendReminder}
        onVoid={handleVoidInvoice}
      />

      {/* Payment Form Modal */}
      <PaymentFormModal
        isOpen={paymentFormModal.isOpen}
        onClose={paymentFormModal.closeModal}
        onSave={handleSavePayment}
        mode="add"
        availableInvoices={availableInvoicesForPayment}
      />
    </div>
  );
}