import { CloseIcon, DollarLineIcon, UserIcon } from "../../icons";
import { Campaign, formatCurrency, getStatusColor } from "../../types/campaign";
import Button from "../ui/button/Button";

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onEdit?: () => void;
}

export default function CampaignDetailModal({ isOpen, onClose, campaign, onEdit }: CampaignDetailModalProps) {
  if (!campaign || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {campaign.clientLogo && (
              <img 
                src={campaign.clientLogo} 
                alt={campaign.clientName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {campaign.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {campaign.clientName} • {campaign.type}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                Edit Campaign
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status and Basic Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Overview</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{campaign.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Platforms:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{campaign.platforms.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">End Date:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Brief and Goals */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Campaign Brief</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{campaign.brief}</p>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Campaign Goals</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{campaign.goals}</p>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Team Members ({campaign.teamMembers.length})
                </h4>
                <div className="space-y-2">
                  {campaign.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Influencers */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Influencers ({campaign.influencers.length})
                </h4>
                <div className="space-y-3">
                  {campaign.influencers.map((influencer) => (
                    <div key={influencer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {influencer.avatar ? (
                          <img src={influencer.avatar} alt={influencer.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {influencer.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{influencer.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {influencer.handle} • {influencer.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(influencer.fee, campaign.financials.currency)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          influencer.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          influencer.paymentStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {influencer.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Financial Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <DollarLineIcon className="w-5 h-5 mr-2" />
                  Financial Summary
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total Budget:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(campaign.financials.budgetTotal, campaign.financials.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Influencer Payout:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(campaign.financials.influencerPayoutTotal, campaign.financials.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Agency Commission:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {campaign.financials.agencyCommissionPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Payment Terms:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {campaign.financials.paymentTerms}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Deliverables ({campaign.deliverables.length})
                </h4>
                <div className="space-y-2">
                  {campaign.deliverables.map((deliverable) => (
                    <div key={deliverable.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{deliverable.type}</p>
                        <p className="text-gray-500 dark:text-gray-400">{deliverable.platform}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        deliverable.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        deliverable.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                        deliverable.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {deliverable.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {campaign.tags && campaign.tags.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}