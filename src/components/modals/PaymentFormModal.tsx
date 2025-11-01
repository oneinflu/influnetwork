import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import DatePicker from "../form/date-picker";
import { 
  PlusIcon, 
  TrashBinIcon,
  DollarLineIcon
} from "../../icons";
import { 
  Payment, 
  PaymentFormData, 
  PaymentMethod,
  PaymentStatus,
  Currency,
  formatCurrency,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS
} from "../../types/invoice";

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: PaymentFormData) => void;
  payment?: Payment | null;
  mode: 'add' | 'edit';
  availableInvoices?: Array<{
    id: string;
    invoiceNumber: string;
    clientName: string;
    totalAmount: number;
    balanceDue: number;
    currency: string;
  }>;
}

interface PaymentAllocation {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  balanceDue: number;
  allocatedAmount: number;
  currency: string;
}

export default function PaymentFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  payment, 
  mode, 
  availableInvoices = [] 
}: PaymentFormModalProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    invoiceIds: [],
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    transactionReference: '',
    status: 'Completed',
    notes: '',
    receiptAttachment: ''
  });

  const [allocations, setAllocations] = useState<PaymentAllocation[]>([]);
  const [remainingAmount, setRemainingAmount] = useState(0);

  // Payment method options with icons
  const paymentMethodOptions = PAYMENT_METHOD_OPTIONS.map(method => ({
    value: method,
    label: method
  }));

  // Payment status options
  const paymentStatusOptions = PAYMENT_STATUS_OPTIONS.map(status => ({
    value: status,
    label: status
  }));

  // Initialize form data when payment prop changes
  useEffect(() => {
    if (mode === 'edit' && payment) {
      setFormData({
        invoiceIds: payment.invoiceId ? [payment.invoiceId] : [],
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        transactionReference: payment.transactionReference || '',
        status: payment.status,
        notes: payment.notes || '',
        receiptAttachment: ''
      });
    } else if (mode === 'add') {
      // Reset form for new payment
      setFormData({
        invoiceIds: [],
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        transactionReference: '',
        status: 'Completed',
        notes: '',
        receiptAttachment: ''
      });
      setAllocations([]);
    }
  }, [payment, mode]);

  // Calculate remaining amount when allocations change
  useEffect(() => {
    const totalAllocated = allocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
    setRemainingAmount(formData.amount - totalAllocated);
  }, [allocations, formData.amount]);

  const handleInputChange = (field: keyof PaymentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addInvoiceAllocation = () => {
    if (availableInvoices.length === 0) return;
    
    // Find an invoice that's not already allocated
    const unallocatedInvoice = availableInvoices.find(
      invoice => !allocations.some(allocation => allocation.invoiceId === invoice.id)
    );

    if (unallocatedInvoice) {
      const newAllocation: PaymentAllocation = {
        invoiceId: unallocatedInvoice.id,
        invoiceNumber: unallocatedInvoice.invoiceNumber,
        clientName: unallocatedInvoice.clientName,
        totalAmount: unallocatedInvoice.totalAmount,
        balanceDue: unallocatedInvoice.balanceDue,
        allocatedAmount: Math.min(unallocatedInvoice.balanceDue, remainingAmount),
        currency: unallocatedInvoice.currency
      };

      setAllocations(prev => [...prev, newAllocation]);
      
      // Update invoiceIds in form data
      setFormData(prev => ({
        ...prev,
        invoiceIds: [...prev.invoiceIds, unallocatedInvoice.id]
      }));
    }
  };

  const removeInvoiceAllocation = (index: number) => {
    const removedAllocation = allocations[index];
    setAllocations(prev => prev.filter((_, i) => i !== index));
    
    // Update invoiceIds in form data
    setFormData(prev => ({
      ...prev,
      invoiceIds: prev.invoiceIds.filter(id => id !== removedAllocation.invoiceId)
    }));
  };

  const updateAllocationAmount = (index: number, amount: number) => {
    const updatedAllocations = [...allocations];
    const allocation = updatedAllocations[index];
    
    // Ensure amount doesn't exceed balance due or remaining payment amount
    const maxAmount = Math.min(
      allocation.balanceDue,
      remainingAmount + allocation.allocatedAmount
    );
    
    updatedAllocations[index] = {
      ...allocation,
      allocatedAmount: Math.min(amount, maxAmount)
    };

    setAllocations(updatedAllocations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (!formData.paymentDate) {
      alert('Please select a payment date');
      return;
    }

    if (!formData.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Validate allocations if any
    if (allocations.length > 0) {
      const totalAllocated = allocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
      
      if (totalAllocated > formData.amount) {
        alert('Total allocated amount cannot exceed payment amount');
        return;
      }

      // Check for zero allocations
      const hasZeroAllocations = allocations.some(allocation => allocation.allocatedAmount <= 0);
      if (hasZeroAllocations) {
        alert('All invoice allocations must have an amount greater than zero');
        return;
      }
    }

    onSave(formData);
    onClose();
  };

  const getTotalAllocated = () => {
    return allocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-4xl mx-2 sm:mx-4 my-2 sm:my-4">
      <div className="relative w-full h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 lg:px-8 lg:pt-8 lg:pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <DollarLineIcon className="w-6 h-6 text-brand-500" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {mode === 'add' ? 'Record New Payment' : 'Edit Payment'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'add' 
              ? 'Record a payment and allocate it to invoices' 
              : 'Update the payment information below'
            }
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:px-8" style={{ scrollbarWidth: 'thin' }}>
          <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Payment Information */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                Payment Details
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Payment Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step={0.01}
                    value={formData.amount.toString()}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                    <DatePicker
                      id="paymentDate"
                      label="Payment Date *"
                      placeholder="Select payment date"
                      defaultDate={formData.paymentDate}
                      onChange={(_dates, currentDateString) => {
                        handleInputChange('paymentDate', currentDateString || '');
                      }}
                    />
                </div>
                <div>
                  <Label>Payment Method *</Label>
                  <Select
                    options={paymentMethodOptions}
                    placeholder="Select payment method"
                    onChange={(value) => handleInputChange('paymentMethod', value as PaymentMethod)}
                    defaultValue={formData.paymentMethod}
                  />
                </div>
                <div>
                  <Label htmlFor="transactionReference">Transaction Reference</Label>
                  <Input
                    id="transactionReference"
                    type="text"
                    value={formData.transactionReference}
                    onChange={(e) => handleInputChange('transactionReference', e.target.value)}
                    placeholder="UTR/Cheque No/Transaction ID"
                  />
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <Select
                    options={paymentStatusOptions}
                    placeholder="Select status"
                    onChange={(value) => handleInputChange('status', value as PaymentStatus)}
                    defaultValue={formData.status}
                  />
                </div>
              </div>
            </div>

            {/* Invoice Allocations */}
            {availableInvoices.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                    Invoice Allocations
                  </h3>
                  <Button
                    variant="outline"
                    onClick={addInvoiceAllocation}
                    className="flex items-center gap-2"
                    disabled={allocations.length >= availableInvoices.length}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Invoice
                  </Button>
                </div>
                
                {allocations.length > 0 ? (
                  <div className="space-y-4">
                    {allocations.map((allocation, index) => (
                      <div key={allocation.invoiceId} className="grid grid-cols-12 gap-3 items-end p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="col-span-12 md:col-span-3">
                          <Label>Invoice Number</Label>
                          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium">
                            {allocation.invoiceNumber}
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-3">
                          <Label>Client</Label>
                          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
                            {allocation.clientName}
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <Label>Balance Due</Label>
                          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium">
                            {formatCurrency(allocation.balanceDue, allocation.currency as Currency)}
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <Label>Allocated Amount</Label>
                          <Input
                            type="number"
                            min="0"
                            max={Math.min(allocation.balanceDue, remainingAmount + allocation.allocatedAmount).toString()}
                            step={0.01}
                            value={allocation.allocatedAmount.toString()}
                            onChange={(e) => updateAllocationAmount(index, parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-4 md:col-span-1">
                          <Button
                            variant="outline"
                            onClick={() => removeInvoiceAllocation(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Allocation Summary */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Payment Amount:</span>
                          <span className="font-medium">{formatCurrency(formData.amount, 'INR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Allocated:</span>
                          <span className="font-medium">{formatCurrency(getTotalAllocated(), 'INR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                          <span className={`font-medium ${remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(remainingAmount, 'INR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <DollarLineIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No invoice allocations added yet</p>
                    <p className="text-sm">Click "Add Invoice" to allocate this payment to specific invoices</p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <TextArea
                    value={formData.notes}
                    onChange={(value) => handleInputChange('notes', value)}
                    placeholder="Payment notes, special instructions, etc."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="receiptAttachment">Receipt Attachment</Label>
                  <Input
                    id="receiptAttachment"
                    type="text"
                    value={formData.receiptAttachment}
                    onChange={(e) => handleInputChange('receiptAttachment', e.target.value)}
                    placeholder="Receipt file path or URL"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 lg:px-8 lg:pb-8 lg:pt-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="min-w-[100px]">
              Cancel
            </Button>
            <button 
              type="submit"
              form="payment-form"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 min-w-[120px]"
            >
              {mode === 'add' ? 'Record Payment' : 'Update Payment'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}