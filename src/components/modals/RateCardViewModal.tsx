
import { Modal } from "../ui/modal";

import Badge from "../ui/badge/Badge";
import {  UserIcon, DollarLineIcon, CalenderIcon } from "../../icons";
import { RateCard } from "../../types/rateCard";

interface RateCardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateCard: RateCard | null;
}

export default function RateCardViewModal({
  isOpen,
  onClose,
  rateCard,
}: RateCardViewModalProps) {
  if (!rateCard) return null;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVisibilityBadgeColor = (visibility: string) => {
    return visibility === 'Public' ? 'success' : 'warning';
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'instagram':
        return 'text-pink-600 dark:text-pink-400';
      case 'youtube':
        return 'text-red-600 dark:text-red-400';
      case 'event':
        return 'text-purple-600 dark:text-purple-400';
      case 'facebook':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
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
                Rate Card Details
              </h2>
              <div className="flex items-center gap-3">
                <Badge color={getVisibilityBadgeColor(rateCard.visibility)}>
                  {rateCard.visibility === 'Public' ? '🟢 Public' : '🔒 Private'}
                </Badge>
                <span className={`font-medium ${getCategoryColor(rateCard.category)}`}>
                  {rateCard.category}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rate Card Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                  <UserIcon className="size-5" />
                  Rate Card Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Rate Card Name</label>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{rateCard.rateCardName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Service Type</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.serviceType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Content Duration</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.contentDuration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Linked Influencer</label>
                    <p className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{rateCard.linkedInfluencer}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                  <DollarLineIcon className="size-5" />
                  Pricing Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Base Rate</label>
                    <p className="text-gray-800 dark:text-white/90 font-semibold">{formatCurrency(rateCard.baseRate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Discount Percentage</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.discountPercentage}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Final Rate</label>
                    <p className="text-green-600 dark:text-green-400 font-bold text-lg">{formatCurrency(rateCard.finalRate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pricing Type</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.pricingType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Applicable For</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.applicableFor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Inclusions</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.inclusions}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivery Time</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.deliveryTime}</p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                  <CalenderIcon className="size-5" />
                  Metadata
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Created By</label>
                    <p className="text-gray-800 dark:text-white/90">{rateCard.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Created On</label>
                    <p className="text-gray-800 dark:text-white/90">{formatDate(rateCard.createdOn)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</label>
                    <p className="text-gray-800 dark:text-white/90">{formatDate(rateCard.lastUpdated)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Visibility</label>
                    <Badge color={getVisibilityBadgeColor(rateCard.visibility)} size="sm">
                      {rateCard.visibility}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}