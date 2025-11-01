import { useState } from "react";

import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import MultiSelect from "../form/MultiSelect";
import TextArea from "../form/input/TextArea";
import { CloseIcon } from "../../icons";
import { 
  Campaign, 
  CampaignFormData, 
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  PLATFORM_OPTIONS
} from "../../types/campaign";

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: CampaignFormData) => void;
  campaign?: Campaign | null;
  mode: 'add' | 'edit';
}

export default function CampaignFormModal({ isOpen, onClose, onSave, campaign, mode }: CampaignFormModalProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: campaign?.name || '',
    clientId: campaign?.clientId || '',
    type: campaign?.type || 'Influencer',
    platforms: campaign?.platforms || [],
    category: campaign?.category || '',
    brief: campaign?.brief || '',
    goals: campaign?.goals || '',
    status: campaign?.status || 'Draft',
    visibility: campaign?.visibility || 'Private',
    startDate: campaign?.startDate || '',
    endDate: campaign?.endDate || '',
    tags: campaign?.tags || [],
    budgetTotal: campaign?.financials?.budgetTotal || 0,
    currency: campaign?.financials?.currency || 'INR',
    agencyCommissionPercent: campaign?.financials?.agencyCommissionPercent || 15,
    paymentTerms: campaign?.financials?.paymentTerms || 'Net 30',
    teamMembers: campaign?.teamMembers || [],
    influencers: campaign?.influencers || [],
    deliverables: campaign?.deliverables || [],
    clientApproved: campaign?.clientApproved || false
  });

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const categoryOptions = [
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Beauty', label: 'Beauty' },
    { value: 'Tech', label: 'Tech' },
    { value: 'Food', label: 'Food' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Lifestyle', label: 'Lifestyle' }
  ];

  const visibilityOptions = [
    { value: 'Private', label: 'Private' },
    { value: 'Public', label: 'Public' },
    { value: 'Team', label: 'Team Only' }
  ];

  return (
    <div className={`fixed inset-0 z-[999999] ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mode === 'add' ? 'Create Campaign' : 'Edit Campaign'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter campaign name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientId">Client ID *</Label>
                    <Input
                      id="clientId"
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      placeholder="Enter client ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Campaign Type *</Label>
                    <Select
                      value={formData.type}
                      onChange={(value) => handleInputChange('type', value)}
                      options={CAMPAIGN_TYPE_OPTIONS.map(type => ({ value: type.value, label: type.label }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onChange={(value) => handleInputChange('category', value)}
                      options={categoryOptions}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="platforms">Platforms *</Label>
                  <MultiSelect
                    label="Platforms"
                    value={formData.platforms}
                    onChange={(value) => handleInputChange('platforms', value)}
                    options={PLATFORM_OPTIONS.map(platform => ({ value: platform.value, text: platform.label }))}
                    placeholder="Select platforms"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      type="date"
                      id="endDate"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onChange={(value) => handleInputChange('status', value)}
                      options={CAMPAIGN_STATUS_OPTIONS.map(status => ({ value: status.value, label: status.label }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={formData.visibility}
                      onChange={(value) => handleInputChange('visibility', value)}
                      options={visibilityOptions}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="brief">Campaign Brief</Label>
                  <TextArea
                    value={formData.brief}
                    onChange={(value) => handleInputChange('brief', value)}
                    placeholder="Describe the campaign objectives, target audience, and key messaging"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="goals">Campaign Goals</Label>
                  <TextArea
                    value={formData.goals}
                    onChange={(value) => handleInputChange('goals', value)}
                    placeholder="Define specific, measurable goals for this campaign"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(', ').filter(tag => tag.trim()))}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>

              {/* Budget Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Budget Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budgetTotal">Total Budget *</Label>
                    <Input
                      id="budgetTotal"
                      type="number"
                      value={formData.budgetTotal}
                      onChange={(e) => handleInputChange('budgetTotal', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={formData.currency}
                      onChange={(value) => handleInputChange('currency', value)}
                      options={[
                        { value: 'INR', label: 'INR' },
                        { value: 'USD', label: 'USD' },
                        { value: 'EUR', label: 'EUR' }
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="agencyCommission">Agency Commission (%)</Label>
                  <Input
                    id="agencyCommission"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.agencyCommissionPercent}
                    onChange={(e) => handleInputChange('agencyCommissionPercent', parseInt(e.target.value) || 0)}
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    value={formData.paymentTerms}
                    onChange={(value) => handleInputChange('paymentTerms', value)}
                    options={[
                      { value: 'Net 15', label: 'Net 15' },
                      { value: 'Net 30', label: 'Net 30' },
                      { value: 'Net 45', label: 'Net 45' },
                      { value: 'Net 60', label: 'Net 60' }
                    ]}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button>
                  {mode === 'add' ? 'Create Campaign' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}