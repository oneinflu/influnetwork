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
  TrashBinIcon
} from "../../icons";
import { 
  Invoice, 
  InvoiceFormData, 
  InvoiceStatus,
  formatCurrency 
} from "../../types/invoice";

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: InvoiceFormData) => void;
  invoice?: Invoice | null;
  mode: 'add' | 'edit';
}

export default function InvoiceFormModal({ isOpen, onClose, onSave, invoice, mode }: InvoiceFormModalProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientId: '',
    clientName: '',
    contactPerson: '',
    clientEmail: '',
    clientPhone: '',
    campaignId: '',
    campaignName: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'INR',
    lineItems: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxPercentage: 0,
        total: 0
      }
    ],
    discountType: 'percentage',
    discountValue: 0,
    adjustments: 0,
    paymentTerms: 'Net 30',
    notes: '',
    termsAndConditions: '',
    attachments: '',
    status: 'Draft'
  });

  // Client options (in real app, this would come from CRM)
  const clientOptions = [
    { value: 'Nykaa Fashion', label: 'Nykaa Fashion' },
    { value: 'Tanishq Jewelry', label: 'Tanishq Jewelry' },
    { value: 'Zudio Retail', label: 'Zudio Retail' },
    { value: 'Myntra Lifestyle', label: 'Myntra Lifestyle' },
    { value: 'Ajio Fashion', label: 'Ajio Fashion' }
  ];

  // Status options
  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Partially Paid', label: 'Partially Paid' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  // Payment terms options
  const paymentTermsOptions = [
    { value: 'Net 15', label: 'Net 15 days' },
    { value: 'Net 30', label: 'Net 30 days' },
    { value: 'Net 45', label: 'Net 45 days' },
    { value: 'Net 60', label: 'Net 60 days' },
    { value: 'Due on Receipt', label: 'Due on Receipt' },
    { value: 'Custom', label: 'Custom Terms' }
  ];

  // Discount type options
  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'amount', label: 'Fixed Amount' }
  ];

  // Initialize form data when invoice prop changes
  useEffect(() => {
    if (mode === 'edit' && invoice) {
      setFormData({
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        contactPerson: invoice.contactPerson,
        clientEmail: invoice.clientEmail,
        clientPhone: invoice.clientPhone || '',
        campaignId: invoice.campaignId || '',
        campaignName: invoice.campaignName || '',
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        currency: invoice.currency,
        lineItems: invoice.lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxPercentage: item.taxPercentage,
          total: item.total
        })),
        discountType: invoice.discountType,
        discountValue: invoice.discountValue,
        adjustments: invoice.adjustments,
        paymentTerms: invoice.paymentTerms,
        notes: invoice.notes || '',
        termsAndConditions: invoice.termsAndConditions || '',
        attachments: invoice.attachments?.join(', ') || '',
        status: invoice.status
      });
    } else if (mode === 'add') {
      // Reset form for new invoice
      setFormData({
        clientId: '',
        clientName: '',
        contactPerson: '',
        clientEmail: '',
        clientPhone: '',
        campaignId: '',
        campaignName: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        currency: 'INR',
        lineItems: [
          {
            description: '',
            quantity: 1,
            unitPrice: 0,
            taxPercentage: 0,
            total: 0
          }
        ],
        discountType: 'percentage',
        discountValue: 0,
        adjustments: 0,
        paymentTerms: 'Net 30',
        notes: '',
        termsAndConditions: '',
        attachments: '',
        status: 'Draft'
      });
    }
  }, [invoice, mode]);

  const handleInputChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineItemChange = (index: number, field: keyof typeof formData.lineItems[0], value: any) => {
    const updatedLineItems = [...formData.lineItems];
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      [field]: value
    };

    setFormData(prev => ({
      ...prev,
      lineItems: updatedLineItems
    }));
  };

  const addLineItem = () => {
    const newLineItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxPercentage: 0,
      total: 0
    };

    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newLineItem]
    }));
  };

  const removeLineItem = (index: number) => {
    if (formData.lineItems.length > 1) {
      const updatedLineItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        lineItems: updatedLineItems
      }));
    }
  };

  const calculateLineTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.clientName || !formData.campaignName || !formData.issueDate || !formData.dueDate) {
      alert('Please fill in all required fields (Client Name, Campaign Name, Issue Date, Due Date)');
      return;
    }

    // Validate line items
    const hasValidLineItems = formData.lineItems.some(item => 
      item.description.trim() !== '' && item.quantity > 0 && item.unitPrice > 0
    );

    if (!hasValidLineItems) {
      alert('Please add at least one valid line item with description, quantity, and unit price');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-6xl mx-2 sm:mx-4 my-2 sm:my-4">
      <div className="relative w-full h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 lg:px-8 lg:pt-8 lg:pb-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            {mode === 'add' ? 'Create New Invoice' : 'Edit Invoice'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'add' 
              ? 'Fill in the details to create a new invoice' 
              : 'Update the invoice information below'
            }
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:px-8" style={{ scrollbarWidth: 'thin' }}>
          <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                Invoice Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Select
                    options={clientOptions}
                    placeholder="Select or type client name"
                    onChange={(value) => handleInputChange('clientName', value)}
                    defaultValue={formData.clientName}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="client@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Client Phone</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    type="text"
                    value={formData.campaignName}
                    onChange={(e) => handleInputChange('campaignName', e.target.value)}
                    placeholder="e.g., Summer Collection 2024"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    options={statusOptions}
                    placeholder="Select status"
                    onChange={(value) => handleInputChange('status', value as InvoiceStatus)}
                    defaultValue={formData.status}
                  />
                </div>
              </div>
            </div>

            {/* Dates and Terms */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                Dates & Terms
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    id="issueDate"
                    label="Issue Date *"
                    placeholder="Select issue date"
                    defaultDate={formData.issueDate}
                    onChange={(_dates, currentDateString) => {
                      handleInputChange('issueDate', currentDateString);
                    }}
                  />
                </div>
                <div>
                  <DatePicker
                    id="dueDate"
                    label="Due Date *"
                    placeholder="Select due date"
                    defaultDate={formData.dueDate}
                    onChange={(_dates, currentDateString) => {
                      handleInputChange('dueDate', currentDateString);
                    }}
                  />
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select
                    options={paymentTermsOptions}
                    placeholder="Select payment terms"
                    onChange={(value) => handleInputChange('paymentTerms', value)}
                    defaultValue={formData.paymentTerms}
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Line Items
                </h3>
                <Button
                  variant="outline"
                  onClick={addLineItem}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="col-span-12 md:col-span-4">
                      <Label>Description</Label>
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newUnitPrice = parseFloat(e.target.value) || 0;
                          handleLineItemChange(index, 'unitPrice', newUnitPrice);
                          // Auto-calculate total when unit price changes
                          const newTotal = calculateLineTotal(item.quantity, newUnitPrice);
                          handleLineItemChange(index, 'total', newTotal);
                        }}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <Label>Tax %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step={0.01}
                        value={item.taxPercentage}
                        onChange={(e) => handleLineItemChange(index, 'taxPercentage', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <Label>Total</Label>
                      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium">
                        {formatCurrency(calculateLineTotal(item.quantity, item.unitPrice), formData.currency)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {formData.lineItems.length > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => removeLineItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount and Adjustments */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                Discount & Adjustments
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    options={discountTypeOptions}
                    onChange={(value) => handleInputChange('discountType', value as 'amount' | 'percentage')}
                    defaultValue={formData.discountType}
                  />
                </div>
                <div>
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    min="0"
                    step={0.01}
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                    placeholder={formData.discountType === 'percentage' ? '10' : '1000'}
                  />
                </div>
                <div>
                  <Label>Adjustments</Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={formData.adjustments}
                    onChange={(e) => handleInputChange('adjustments', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

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
                    placeholder="Internal notes about this invoice"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
                  <TextArea
                    value={formData.termsAndConditions}
                    onChange={(value) => handleInputChange('termsAndConditions', value)}
                    placeholder="Payment terms, late fees, etc."
                    rows={4}
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
              form="invoice-form"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 min-w-[120px]"
            >
              {mode === 'add' ? 'Create Invoice' : 'Update Invoice'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}