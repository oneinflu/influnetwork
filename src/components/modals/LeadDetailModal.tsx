
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon, AlertIcon, CalenderIcon, EnvelopeIcon, UserIcon, DollarLineIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { Lead } from "../tables/LeadsTable";

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export default function LeadDetailModal({ isOpen, onClose, lead, onEdit, onDelete }: LeadDetailModalProps) {
  if (!lead) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'info';
      case 'contacted':
        return 'warning';
      case 'proposal sent':
        return 'primary';
      case 'negotiation':
        return 'warning';
      case 'won':
        return 'success';
      case 'lost':
        return 'error';
      default:
        return 'light';
    }
  };

  const getLeadTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fashion':
        return 'text-pink-600 dark:text-pink-400';
      case 'tech':
        return 'text-blue-600 dark:text-blue-400';
      case 'fmcg':
        return 'text-green-600 dark:text-green-400';
      case 'lifestyle':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600 dark:text-green-400';
    if (probability >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      onDelete(lead.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-5xl mx-2 sm:mx-4 my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh]">
      <div className="relative w-full h-full overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
        <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
              Lead Details
            </h2>
            <div className="flex items-center gap-3">
              <Badge color={getStatusBadgeColor(lead.status)}>
                {lead.status}
              </Badge>
              <span className={`font-medium ${getLeadTypeColor(lead.leadType)}`}>
                {lead.leadType}
              </span>
              {lead.hasReminders && (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <AlertIcon className="size-4" />
                  <span className="text-sm">Has Reminders</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(lead)}
              className="flex items-center gap-2"
            >
              <PencilIcon className="size-4" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <TrashBinIcon className="size-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                <UserIcon className="size-5" />
                Business Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Business Name</label>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{lead.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Person</label>
                  <p className="text-gray-800 dark:text-white/90">{lead.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Website/Instagram</label>
                  <p className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{lead.website}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                <EnvelopeIcon className="size-5" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-800 dark:text-white/90">{lead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                  <p className="text-gray-800 dark:text-white/90">{lead.contactNumber}</p>
                </div>
              </div>
            </div>

            {/* Lead Classification */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Lead Classification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Lead Type</label>
                  <p className={`font-medium ${getLeadTypeColor(lead.leadType)}`}>{lead.leadType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Lead Source</label>
                  <p className="text-gray-800 dark:text-white/90">{lead.leadSource}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Information */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                <DollarLineIcon className="size-5" />
                Deal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Range</label>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{lead.budgetRange}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Probability</label>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${getProbabilityColor(lead.conversionProbability)}`}>
                      {lead.conversionProbability}%
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          lead.conversionProbability >= 70 ? 'bg-green-500' :
                          lead.conversionProbability >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${lead.conversionProbability}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned To</label>
                  <p className="text-gray-800 dark:text-white/90">{lead.assignedTo}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                <CalenderIcon className="size-5" />
                Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Created On</label>
                  <p className="text-gray-800 dark:text-white/90">{new Date(lead.createdOn).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Contacted</label>
                  <p className="text-gray-800 dark:text-white/90">{new Date(lead.lastContacted).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Follow-up</label>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{new Date(lead.nextFollowUp).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Notes & Attachments */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Notes & Attachments</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                  <p className="text-gray-800 dark:text-white/90 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    {lead.notes || 'No notes available'}
                  </p>
                </div>
                {lead.attachments && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Attachments</label>
                    <p className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      📎 {lead.attachments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit(lead)} className="flex items-center gap-2">
            <PencilIcon className="size-4" />
            Edit Lead
          </Button>
        </div>
        </div>
      </div>
    </Modal>
  );
}