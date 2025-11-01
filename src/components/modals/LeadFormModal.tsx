import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import DatePicker from "../form/date-picker";
import { Lead } from "../tables/LeadsTable";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  lead?: Lead | null; // For editing existing lead
  mode: 'add' | 'edit';
}

export default function LeadFormModal({ isOpen, onClose, onSave, lead, mode }: LeadFormModalProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    businessName: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    website: '',
    leadType: '',
    leadSource: '',
    status: 'New',
    budgetRange: '',
    lastContacted: '',
    nextFollowUp: '',
    assignedTo: '',
    notes: '',
    conversionProbability: 0,
    attachments: '',
    hasReminders: false,
    createdOn: new Date().toISOString().split('T')[0]
  });

  // Lead type options
  const leadTypeOptions = [
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Tech', label: 'Tech' },
    { value: 'FMCG', label: 'FMCG' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Real Estate', label: 'Real Estate' }
  ];

  // Lead source options
  const leadSourceOptions = [
    { value: 'Manual', label: 'Manual' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Discovery', label: 'Discovery' },
    { value: 'Inbound', label: 'Inbound' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Website', label: 'Website' },
    { value: 'Cold Outreach', label: 'Cold Outreach' }
  ];

  // Status options
  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Proposal Sent', label: 'Proposal Sent' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' }
  ];

  // Assigned to options (in real app, this would come from user management)
  const assignedToOptions = [
    { value: 'Ritika (Manager)', label: 'Ritika (Manager)' },
    { value: 'Amit (Sales)', label: 'Amit (Sales)' },
    { value: 'Sarah (Executive)', label: 'Sarah (Executive)' },
    { value: 'Priya (Lead)', label: 'Priya (Lead)' },
    { value: 'Karan (Associate)', label: 'Karan (Associate)' }
  ];

  // Budget range options
  const budgetRangeOptions = [
    { value: '₹5,000 – ₹25,000', label: '₹5,000 – ₹25,000' },
    { value: '₹25,000 – ₹50,000', label: '₹25,000 – ₹50,000' },
    { value: '₹50,000 – ₹1,00,000', label: '₹50,000 – ₹1,00,000' },
    { value: '₹1,00,000 – ₹2,50,000', label: '₹1,00,000 – ₹2,50,000' },
    { value: '₹2,50,000 – ₹5,00,000', label: '₹2,50,000 – ₹5,00,000' },
    { value: '₹5,00,000+', label: '₹5,00,000+' }
  ];

  // Initialize form data when lead prop changes
  useEffect(() => {
    if (mode === 'edit' && lead) {
      setFormData(lead);
    } else if (mode === 'add') {
      setFormData({
        businessName: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
        website: '',
        leadType: '',
        leadSource: '',
        status: 'New',
        budgetRange: '',
        lastContacted: '',
        nextFollowUp: '',
        assignedTo: '',
        notes: '',
        conversionProbability: 0,
        attachments: '',
        hasReminders: false,
        createdOn: new Date().toISOString().split('T')[0]
      });
    }
  }, [lead, mode]);

  const handleInputChange = (field: keyof Lead, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.businessName || !formData.contactPerson || !formData.email) {
      alert('Please fill in all required fields (Business Name, Contact Person, Email)');
      return;
    }

    // Generate ID for new leads
    const leadData = mode === 'add' 
      ? { ...formData, id: Date.now().toString() }
      : formData;

    onSave(leadData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-4xl mx-2 sm:mx-4 my-2 sm:my-4">
      <div className="relative w-full h-[85vh] flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 lg:px-8 lg:pt-8 lg:pb-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            {mode === 'add' ? 'Add New Lead' : 'Edit Lead'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'add' 
              ? 'Fill in the details to add a new lead to your pipeline' 
              : 'Update the lead information below'
            }
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:px-8" style={{ scrollbarWidth: 'thin' }}>
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="space-y-5">
              {/* Business Information */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">
                  Business Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="businessName">Business/Brand Name *</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName || ''}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="e.g., Nykaa, Tanishq, Zudio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      type="text"
                      value={formData.contactPerson || ''}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      placeholder="e.g., Rohan Sharma"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website/Instagram</Label>
                    <Input
                      id="website"
                      type="text"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="e.g., instagram.com/nykaabeauty"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g., rohan@nykaa.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      value={formData.contactNumber || ''}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      placeholder="e.g., +91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Lead Classification */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Lead Classification</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Lead Type/Category</Label>
                    <Select
                      options={leadTypeOptions}
                      placeholder="Select lead type"
                      onChange={(value) => handleInputChange('leadType', value)}
                      defaultValue={formData.leadType || ''}
                    />
                  </div>
                  <div>
                    <Label>Lead Source</Label>
                    <Select
                      options={leadSourceOptions}
                      placeholder="Select lead source"
                      onChange={(value) => handleInputChange('leadSource', value)}
                      defaultValue={formData.leadSource || ''}
                    />
                  </div>
                  <div>
                    <Label>Status/Stage</Label>
                    <Select
                      options={statusOptions}
                      placeholder="Select status"
                      onChange={(value) => handleInputChange('status', value)}
                      defaultValue={formData.status || 'New'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
              <div className="space-y-5">
              {/* Deal Information */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Deal Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Budget Range</Label>
                    <Select
                      options={budgetRangeOptions}
                      placeholder="Select budget range"
                      onChange={(value) => handleInputChange('budgetRange', value)}
                      defaultValue={formData.budgetRange || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="conversionProbability">Conversion Probability (%)</Label>
                    <Input
                      id="conversionProbability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.conversionProbability || 0}
                      onChange={(e) => handleInputChange('conversionProbability', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 70"
                    />
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <Select
                      options={assignedToOptions}
                      placeholder="Select team member"
                      onChange={(value) => handleInputChange('assignedTo', value)}
                      defaultValue={formData.assignedTo || ''}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Assignment & Timeline</h3>
                <div className="space-y-3">
                  <div>
                    <DatePicker
                      id="lastContacted"
                      label="Last Contacted"
                      placeholder="Select date"
                      defaultDate={formData.lastContacted || undefined}
                      onChange={(_dates, currentDateString) => {
                        handleInputChange('lastContacted', currentDateString);
                      }}
                    />
                  </div>
                  <div>
                    <DatePicker
                      id="nextFollowUp"
                      label="Next Follow-Up"
                      placeholder="Select date"
                      defaultDate={formData.nextFollowUp || undefined}
                      onChange={(_dates, currentDateString) => {
                        handleInputChange('nextFollowUp', currentDateString);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes & Attachments - Full Width */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">Notes & Attachments</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="notes">Notes/Remarks</Label>
                      <TextArea
                        value={formData.notes || ''}
                        onChange={(value) => handleInputChange('notes', value)}
                        placeholder="e.g., Discussed Diwali Campaign – waiting for approval"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attachments">Attachments/Files</Label>
                      <Input
                        id="attachments"
                        type="text"
                        value={formData.attachments || ''}
                        onChange={(e) => handleInputChange('attachments', e.target.value)}
                        placeholder="e.g., proposal_nykaa.pdf"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="hasReminders"
                        checked={formData.hasReminders || false}
                        onChange={(e) => handleInputChange('hasReminders', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="hasReminders" className="cursor-pointer">
                        Set reminders/alerts for this lead
                      </Label>
                    </div>
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
              form="lead-form"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 min-w-[100px]"
            >
              {mode === 'add' ? 'Add Lead' : 'Update Lead'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}