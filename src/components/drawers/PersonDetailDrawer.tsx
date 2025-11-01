import React, { useState } from "react";
import { Person } from "../../types/person";
import Button from "../ui/button/Button";
import { CloseIcon, MailIcon, PencilIcon } from "../../icons";

interface PersonDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  onEdit?: (person: Person) => void;
}

const PersonDetailDrawer: React.FC<PersonDetailDrawerProps> = ({
  isOpen,
  onClose,
  person,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "contact", label: "Contact" },
    { id: "rates", label: "Rates" },
    { id: "campaigns", label: "Campaigns" },
    { id: "files", label: "Files" },
    { id: "team", label: "Team" },
    { id: "notes", label: "Notes" },
    { id: "timeline", label: "Timeline" },
  ];

  if (!isOpen || !person) return null;

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                {person.fullName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {person.fullName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {person.roles.join(", ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(person)}
                startIcon={<PencilIcon />}
              >
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {person.status}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Availability</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {person.availabilityStatus}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {person.shortBio && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Bio</h3>
                  <p className="text-gray-600 dark:text-gray-300">{person.shortBio}</p>
                </div>
              )}

              {/* Platform Metrics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Platform Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {person.platformMetrics.instagram && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white">
                      <h4 className="font-medium">Instagram</h4>
                      <p className="text-2xl font-bold">
                        {formatFollowerCount(person.platformMetrics.instagram.followers)}
                      </p>
                      <p className="text-sm opacity-90">
                        {person.platformMetrics.instagram.engagement}% engagement
                      </p>
                    </div>
                  )}
                  {person.platformMetrics.youtube && (
                    <div className="bg-red-500 p-4 rounded-lg text-white">
                      <h4 className="font-medium">YouTube</h4>
                      <p className="text-2xl font-bold">
                        {formatFollowerCount(person.platformMetrics.youtube.subscribers)}
                      </p>
                      <p className="text-sm opacity-90">
                        {person.platformMetrics.youtube.engagement}% engagement
                      </p>
                    </div>
                  )}
                  {person.platformMetrics.tiktok && (
                    <div className="bg-black p-4 rounded-lg text-white">
                      <h4 className="font-medium">TikTok</h4>
                      <p className="text-2xl font-bold">
                        {formatFollowerCount(person.platformMetrics.tiktok.followers)}
                      </p>
                      <p className="text-sm opacity-90">
                        {person.platformMetrics.tiktok.engagement}% engagement
                      </p>
                    </div>
                  )}
                  {person.platformMetrics.linkedin && (
                    <div className="bg-blue-600 p-4 rounded-lg text-white">
                      <h4 className="font-medium">LinkedIn</h4>
                      <p className="text-2xl font-bold">
                        {formatFollowerCount(person.platformMetrics.linkedin.connections)}
                      </p>
                      <p className="text-sm opacity-90">
                        {person.platformMetrics.linkedin.engagement}% engagement
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {person.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {person.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MailIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Primary Email</p>
                      <p className="text-gray-900 dark:text-white">{person.primaryEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MailIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Primary Phone</p>
                      <p className="text-gray-900 dark:text-white">{person.primaryPhone}</p>
                    </div>
                  </div>
                  {person.secondaryPhone && (
                    <div className="flex items-center gap-3">
                      <MailIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Secondary Phone</p>
                        <p className="text-gray-900 dark:text-white">{person.secondaryPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              {person.location && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {typeof person.location === 'object' 
                      ? `${person.location.city || ''}, ${person.location.state || ''}, ${person.location.country || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
                      : person.location
                    }
                  </p>
                </div>
              )}

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Social Links</h3>
                <div className="space-y-2">
                  {person.socialLinks.instagram && (
                    <a
                      href={person.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Instagram: {person.socialLinks.instagram}
                    </a>
                  )}
                  {person.socialLinks.youtube && (
                    <a
                      href={person.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      YouTube: {person.socialLinks.youtube}
                    </a>
                  )}
                  {person.socialLinks.tiktok && (
                    <a
                      href={person.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      TikTok: {person.socialLinks.tiktok}
                    </a>
                  )}
                  {person.socialLinks.linkedin && (
                    <a
                      href={person.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      LinkedIn: {person.socialLinks.linkedin}
                    </a>
                  )}
                  {person.socialLinks.website && (
                    <a
                      href={person.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Website: {person.socialLinks.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rates" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rate Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Default Rate Card</p>
                  <p className="text-gray-900 dark:text-white">
                    {person.defaultRateCardId || "No rate card assigned"}
                  </p>
                </div>
              </div>

              {person.pricingNotes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Pricing Notes</h3>
                  <p className="text-gray-600 dark:text-gray-300">{person.pricingNotes}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Negotiable:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  person.isNegotiable 
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}>
                  {person.isNegotiable ? "Yes" : "No"}
                </span>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No campaigns found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Campaigns will appear here when this person is added to campaigns
                </p>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No files uploaded</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Files and documents will appear here
                </p>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              {person.assignedTo && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Assigned To</h3>
                  <p className="text-gray-600 dark:text-gray-300">{person.assignedTo}</p>
                </div>
              )}
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No team relationships</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Team relationships and collaborations will appear here
                </p>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No notes added</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Add notes to keep track of important information
                </p>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">Person created</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(person.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {person.updatedAt !== person.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">Profile updated</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(person.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonDetailDrawer;