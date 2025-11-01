import React, { useState, useEffect } from "react";
import { Person, PersonFormData, AvailabilityStatus, PersonRole, PersonStatus, VisibilityLevel, PERSON_ROLE_OPTIONS, PERSON_STATUS_OPTIONS, AVAILABILITY_STATUS_OPTIONS, VISIBILITY_LEVEL_OPTIONS } from "../../types/person";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import MultiSelect from "../form/MultiSelect";
import { CloseIcon,} from "../../icons";

interface AddEditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person?: Person;
  onSave: (personData: PersonFormData) => void;
}

const AddEditPersonModal: React.FC<AddEditPersonModalProps> = ({
  isOpen,
  onClose,
  person,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<PersonFormData>({
    fullName: "",
    roles: [],
    primaryEmail: "",
    primaryPhone: "",
    isPortfolioPublic: false,
    isNegotiable: false,
    availabilityStatus: "Available" as AvailabilityStatus,
    tags: [],
    status: "Active",
    visibilityLevel: "Private",
    isClaimable: false,
  });

  useEffect(() => {
    if (person) {
      setFormData({
        fullName: person.fullName,
        handle: person.handle,
        roles: person.roles,
        primaryEmail: person.primaryEmail,
        primaryPhone: person.primaryPhone,
        secondaryPhone: person.secondaryPhone,
        organization: person.organization,
        title: person.title,
        city: person.location?.city,
        state: person.location?.state,
        country: person.location?.country,
        timezone: person.timezone,
        languages: person.languages,
        gender: person.gender,
        dateOfBirth: person.dateOfBirth,
        instagram: person.socialLinks.instagram,
        youtube: person.socialLinks.youtube,
        tiktok: person.socialLinks.tiktok,
        linkedin: person.socialLinks.linkedin,
        website: person.socialLinks.website,
        portfolioLink: person.portfolioLink,
        isPortfolioPublic: person.isPortfolioPublic,
        shortBio: person.shortBio,
        longBio: person.longBio,
        instagramFollowers: person.platformMetrics.instagram?.followers,
        instagramEngagement: person.platformMetrics.instagram?.engagement,
        youtubeSubscribers: person.platformMetrics.youtube?.subscribers,
        youtubeEngagement: person.platformMetrics.youtube?.engagement,
        tiktokFollowers: person.platformMetrics.tiktok?.followers,
        tiktokEngagement: person.platformMetrics.tiktok?.engagement,
        linkedinConnections: person.platformMetrics.linkedin?.connections,
        linkedinEngagement: person.platformMetrics.linkedin?.engagement,
        defaultRateCardId: person.defaultRateCardId,
        pricingNotes: person.pricingNotes,
        isNegotiable: person.isNegotiable,
        typicalDeliverables: person.typicalDeliverables,
        preferredPaymentMethod: person.preferredPaymentMethod,
        availabilityStatus: person.availabilityStatus,
        nextAvailableDate: person.nextAvailableDate,
        preferredLocations: person.preferredLocations,
        tags: person.tags,
        assignedTo: person.assignedTo,
        status: person.status,
        visibilityLevel: person.visibilityLevel,
        isClaimable: person.isClaimable,
      });
    }
  }, [person]);

  const handleSave = () => {
    onSave(formData);
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "profile", label: "Profile & Social" },
    { id: "metrics", label: "Platform Metrics" },
    { id: "rates", label: "Rates & Commercial" },
    { id: "availability", label: "Availability" },
    { id: "settings", label: "Settings" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {person ? "Edit Person" : "Add New Person"}
            </h3>
            <Button variant="outline" onClick={onClose} startIcon={<CloseIcon />}>
              Close
            </Button>
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
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="handle">Handle</Label>
                    <Input
                      id="handle"
                      value={formData.handle || ""}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="roles">Roles *</Label>
                  <MultiSelect
                    label="Roles"
                    options={PERSON_ROLE_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
                    value={formData.roles}
                    onChange={(selected) => setFormData({ ...formData, roles: selected as PersonRole[] })}
                    placeholder="Select roles"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryEmail">Primary Email *</Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={formData.primaryEmail}
                      onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryPhone">Primary Phone *</Label>
                    <Input
                      id="primaryPhone"
                      type="tel"
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={formData.organization || ""}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state || ""}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country || ""}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shortBio">Short Bio</Label>
                  <textarea
                    id="shortBio"
                    value={formData.shortBio || ""}
                    onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                    placeholder="Brief description..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.instagram || ""}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.youtube || ""}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      placeholder="https://youtube.com/channel/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      value={formData.tiktok || ""}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin || ""}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website || ""}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                     <Input
                       id="instagramFollowers"
                       type="number"
                       value={formData.instagramFollowers?.toString() || ""}
                       onChange={(e) => setFormData({ ...formData, instagramFollowers: parseInt(e.target.value) || undefined })}
                       placeholder="0"
                     />
                   </div>
                   <div>
                     <Label htmlFor="instagramEngagement">Instagram Engagement (%)</Label>
                     <Input
                       id="instagramEngagement"
                       type="number"
                       step={0.1}
                       value={formData.instagramEngagement?.toString() || ""}
                       onChange={(e) => setFormData({ ...formData, instagramEngagement: parseFloat(e.target.value) || undefined })}
                       placeholder="0.0"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="youtubeSubscribers">YouTube Subscribers</Label>
                     <Input
                       id="youtubeSubscribers"
                       type="number"
                       value={formData.youtubeSubscribers?.toString() || ""}
                       onChange={(e) => setFormData({ ...formData, youtubeSubscribers: parseInt(e.target.value) || undefined })}
                       placeholder="0"
                     />
                   </div>
                   <div>
                     <Label htmlFor="youtubeEngagement">YouTube Engagement (%)</Label>
                     <Input
                       id="youtubeEngagement"
                       type="number"
                       step={0.1}
                       value={formData.youtubeEngagement?.toString() || ""}
                       onChange={(e) => setFormData({ ...formData, youtubeEngagement: parseFloat(e.target.value) || undefined })}
                       placeholder="0.0"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="tiktokFollowers">TikTok Followers</Label>
                     <Input
                       id="tiktokFollowers"
                       type="number"
                       value={formData.tiktokFollowers?.toString() || ""}
                       onChange={(e) => setFormData({ ...formData, tiktokFollowers: parseInt(e.target.value) || undefined })}
                       placeholder="0"
                     />
                   </div>
                   <div>
                     <Label htmlFor="linkedinConnections">LinkedIn Connections</Label>
                     <Input
                       id="linkedinConnections"
                       type="number"
                       value={formData.linkedinConnections?.toString() || ""}
                       onChange={(e) => setFormData({ ...formData, linkedinConnections: parseInt(e.target.value) || undefined })}
                       placeholder="0"
                     />
                   </div>
                 </div>
              </div>
            )}

            {activeTab === "rates" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pricingNotes">Pricing Notes</Label>
                  <textarea
                    id="pricingNotes"
                    value={formData.pricingNotes || ""}
                    onChange={(e) => setFormData({ ...formData, pricingNotes: e.target.value })}
                    placeholder="Special pricing information..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNegotiable"
                    checked={formData.isNegotiable}
                    onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="isNegotiable">Rates are negotiable</Label>
                </div>
              </div>
            )}

            {activeTab === "availability" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="availabilityStatus">Availability Status</Label>
                  <Select
                    options={[...AVAILABILITY_STATUS_OPTIONS]}
                    value={formData.availabilityStatus}
                    onChange={(value) => setFormData({ ...formData, availabilityStatus: value as AvailabilityStatus })}
                  />
                </div>

                <div>
                  <Label htmlFor="nextAvailableDate">Next Available Date</Label>
                  <Input
                    id="nextAvailableDate"
                    type="date"
                    value={formData.nextAvailableDate || ""}
                    onChange={(e) => setFormData({ ...formData, nextAvailableDate: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    options={[...PERSON_STATUS_OPTIONS]}
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value as PersonStatus })}
                  />
                </div>

                <div>
                  <Label htmlFor="visibilityLevel">Visibility Level</Label>
                  <Select
                    options={[...VISIBILITY_LEVEL_OPTIONS]}
                    value={formData.visibilityLevel}
                    onChange={(value) => setFormData({ ...formData, visibilityLevel: value as VisibilityLevel })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isClaimable"
                    checked={formData.isClaimable}
                    onChange={(e) => setFormData({ ...formData, isClaimable: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="isClaimable">Allow person to claim profile</Label>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {person ? "Update Person" : "Add Person"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditPersonModal;