import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import { RateCard, RateCardFormData, CATEGORY_OPTIONS, SERVICE_TYPE_OPTIONS, PRICING_TYPE_OPTIONS, APPLICABLE_FOR_OPTIONS } from "../../types/rateCard";

interface RateCardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rateCard: Partial<RateCard>) => void;
  rateCard?: RateCard | null; // For editing existing rate card
  mode: 'add' | 'edit';
}

export default function RateCardFormModal({ isOpen, onClose, onSave, rateCard, mode }: RateCardFormModalProps) {
  const [formData, setFormData] = useState<RateCardFormData>({
    rateCardName: '',
    category: '',
    serviceType: '',
    contentDuration: '',
    baseRate: 0,
    discountPercentage: 0,
    finalRate: 0,
    pricingType: '',
    linkedInfluencer: '',
    applicableFor: '',
    inclusions: '',
    deliveryTime: '',
    attachments: '',
    visibility: 'Public'
  });

  // Initialize form data when rateCard prop changes
  useEffect(() => {
    if (mode === 'edit' && rateCard) {
      setFormData({
        rateCardName: rateCard.rateCardName,
        category: rateCard.category,
        serviceType: rateCard.serviceType,
        contentDuration: rateCard.contentDuration || '',
        baseRate: rateCard.baseRate,
        discountPercentage: rateCard.discountPercentage,
        finalRate: rateCard.finalRate,
        pricingType: rateCard.pricingType,
        linkedInfluencer: rateCard.linkedInfluencer,
        applicableFor: rateCard.applicableFor,
        inclusions: rateCard.inclusions || '',
        deliveryTime: rateCard.deliveryTime || '',
        visibility: rateCard.visibility,
        attachments: rateCard.attachments?.join(', ') || ''
      });
    } else if (mode === 'add') {
      setFormData({
        rateCardName: '',
        category: '',
        serviceType: '',
        contentDuration: '',
        baseRate: 0,
        discountPercentage: 0,
        finalRate: 0,
        pricingType: '',
        linkedInfluencer: '',
        applicableFor: '',
        inclusions: '',
        deliveryTime: '',
        visibility: 'Public',
        attachments: ''
      });
    }
  }, [rateCard, mode]);

  // Calculate final rate when base rate or discount changes
  useEffect(() => {
    const finalRate = formData.baseRate - (formData.baseRate * formData.discountPercentage / 100);
    setFormData(prev => ({ ...prev, finalRate }));
  }, [formData.baseRate, formData.discountPercentage]);

  const handleInputChange = (field: keyof RateCardFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.rateCardName || !formData.category || !formData.serviceType || !formData.baseRate) {
      alert('Please fill in all required fields (Rate Card Name, Category, Service Type, Base Rate)');
      return;
    }

    // Convert form data to RateCard format
    const attachmentsArray = formData.attachments 
      ? formData.attachments.split(',').map(item => item.trim()).filter(item => item.length > 0)
      : [];

    // Generate ID and timestamps for new rate cards
    const rateCardData = mode === 'add' 
      ? { 
          ...formData, 
          id: Date.now().toString(),
          attachments: attachmentsArray,
          lastUpdated: new Date().toISOString().split('T')[0],
          createdBy: 'Current User', // In real app, this would come from auth context
          createdOn: new Date().toISOString().split('T')[0]
        }
      : { 
          ...formData,
          attachments: attachmentsArray,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

    onSave(rateCardData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-4xl mx-2 sm:mx-4 my-2 sm:my-4">
      <div className="relative w-full h-[85vh] flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 lg:px-8 lg:pt-8 lg:pb-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            {mode === 'add' ? 'Add New Rate Card' : 'Edit Rate Card'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'add' 
              ? 'Create a new rate card for your services' 
              : 'Update the rate card information below'
            }
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:px-8" style={{ scrollbarWidth: 'thin' }}>
          <form id="rate-card-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Basic Information */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="rateCardName">Rate Card Name / Title *</Label>
                      <Input
                        id="rateCardName"
                        type="text"
                        value={formData.rateCardName}
                        onChange={(e) => handleInputChange('rateCardName', e.target.value)}
                        placeholder="e.g., Instagram Story – Beauty"
                      />
                    </div>
                    <div>
                      <Label>Category / Platform *</Label>
                      <Select
                        options={[
                          { value: '', label: 'Select Category' },
                          ...CATEGORY_OPTIONS.map(option => ({ value: option, label: option }))
                        ]}
                        onChange={(value) => handleInputChange('category', value)}
                        defaultValue={formData.category}
                      />
                    </div>
                    <div>
                      <Label>Service Type / Deliverable *</Label>
                      <Select
                        options={[
                          { value: '', label: 'Select Service Type' },
                          ...SERVICE_TYPE_OPTIONS.map(option => ({ value: option, label: option }))
                        ]}
                        onChange={(value) => handleInputChange('serviceType', value)}
                        defaultValue={formData.serviceType}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contentDuration">Content Duration / Format</Label>
                      <Input
                        id="contentDuration"
                        type="text"
                        value={formData.contentDuration}
                        onChange={(e) => handleInputChange('contentDuration', e.target.value)}
                        placeholder="e.g., 30 sec Reel, 1 min Video"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Pricing Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="baseRate">Base Rate (₹) *</Label>
                      <Input
                        id="baseRate"
                        type="number"
                        value={formData.baseRate}
                        onChange={(e) => handleInputChange('baseRate', Number(e.target.value))}
                        placeholder="e.g., 15000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountPercentage">Discount / Offer (%)</Label>
                      <Input
                        id="discountPercentage"
                        type="number"
                        value={formData.discountPercentage}
                        onChange={(e) => handleInputChange('discountPercentage', Number(e.target.value))}
                        placeholder="e.g., 10"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="finalRate">Final Rate (₹)</Label>
                      <Input
                        id="finalRate"
                        type="number"
                        value={formData.finalRate}
                        disabled
                        className="bg-gray-100 dark:bg-gray-700"
                        placeholder="Auto-calculated"
                      />
                    </div>
                    <div>
                      <Label>Pricing Type</Label>
                      <Select
                        options={[
                          { value: '', label: 'Select Pricing Type' },
                          ...PRICING_TYPE_OPTIONS.map(option => ({ value: option, label: option }))
                        ]}
                        onChange={(value) => handleInputChange('pricingType', value)}
                        defaultValue={formData.pricingType}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Target & Applicability */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Target & Applicability</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="linkedInfluencer">Linked Influencer / Talent</Label>
                      <Input
                        id="linkedInfluencer"
                        type="text"
                        value={formData.linkedInfluencer}
                        onChange={(e) => handleInputChange('linkedInfluencer', e.target.value)}
                        placeholder="e.g., @ritika_beauty, Multiple"
                      />
                    </div>
                    <div>
                      <Label>Applicable For (Client Type)</Label>
                      <Select
                        options={[
                          { value: '', label: 'Select Client Type' },
                          ...APPLICABLE_FOR_OPTIONS.map(option => ({ value: option, label: option }))
                        ]}
                        onChange={(value) => handleInputChange('applicableFor', value)}
                        defaultValue={formData.applicableFor}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time</Label>
                      <Input
                        id="deliveryTime"
                        type="text"
                        value={formData.deliveryTime}
                        onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                        placeholder="e.g., 3 days, 1 week"
                      />
                    </div>
                    <div>
                      <Label>Visibility</Label>
                      <Select
                        options={[
                          { value: 'Public', label: 'Public' },
                          { value: 'Private', label: 'Private' }
                        ]}
                        onChange={(value) => handleInputChange('visibility', value as 'Public' | 'Private')}
                        defaultValue={formData.visibility}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Additional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="inclusions">Inclusions / Description</Label>
                      <TextArea
                        value={formData.inclusions}
                        onChange={(value) => handleInputChange('inclusions', value)}
                        placeholder="e.g., 3 stories + 1 post + usage rights for 7 days"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attachments">Attachments</Label>
                      <Input
                        id="attachments"
                        type="text"
                        value={formData.attachments}
                        onChange={(e) => handleInputChange('attachments', e.target.value)}
                        placeholder="e.g., Beauty_Rates2025.pdf"
                      />
                    </div>
                  </div>
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
              form="rate-card-form"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 min-w-[100px]"
            >
              {mode === 'add' ? 'Add Rate Card' : 'Update Rate Card'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}