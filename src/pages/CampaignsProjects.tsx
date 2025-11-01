import { useState, useMemo } from "react";

import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import MultiSelect from "../components/form/MultiSelect";
import CampaignFormModal from "../components/modals/CampaignFormModal";
import CampaignDetailModal from "../components/modals/CampaignDetailModal";
import KanbanView from "../components/views/KanbanView";
import CalendarView from "../components/views/CalendarView";
import { 
  PlusIcon, 
  ListIcon, 
  GridIcon,
  ArrowDownIcon,
  EyeIcon,
 
  CalenderIcon,
  HorizontaLDots
  
} from "../icons";
import { 
  Campaign,
  CampaignFormData,
  CampaignFilters,
  CampaignSortBy,
  ViewMode,
  CampaignStatus,
  CampaignType,
  Platform,
  PaymentStatus,
  InfluencerAssignment,
  Deliverable,
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  PLATFORM_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  formatCurrency,
  
  getStatusColor,
  getPaymentStatusColor
} from "../types/campaign";

export default function CampaignsProjects() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [sortBy, ] = useState<CampaignSortBy>('updatedAt');
  const [sortOrder, ] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sample data - replace with actual data fetching
  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Diwali Glow with Nykaa",
      clientId: "nykaa-001",
      clientName: "Nykaa Beauty",
      clientLogo: "/images/clients/nykaa-logo.png",
      type: "Influencer",
      platforms: ["Instagram", "YouTube"],
      category: "Beauty",
      brief: "Festive beauty campaign showcasing Diwali makeup looks and skincare routines",
      goals: "Increase brand awareness during festive season, drive product sales, engage with beauty enthusiasts",
      status: "Active",
      visibility: "Public",
      startDate: "2024-11-01",
      endDate: "2024-11-15",
      createdAt: "2024-10-15T10:00:00Z",
      updatedAt: "2024-11-02T15:30:00Z",
      financials: {
        budgetTotal: 150000,
        currency: "INR",
        agencyCommissionPercent: 15,
        influencerPayoutTotal: 127500,
        totalDealValue: 150000,
        paymentTerms: "Net 15"
      },
      teamMembers: [
        {
          id: "tm1",
          personId: "ritika-001",
          name: "Ritika Sharma",
          role: "Manager",
          email: "ritika@agency.com",
          avatar: "/images/team/ritika.jpg"
        }
      ],
      influencers: [
        {
          id: "inf1",
          personId: "beauty-001",
          name: "Ritika Beauty",
          handle: "@ritika_beauty",
          platform: "Instagram",
          avatar: "/images/influencers/ritika-beauty.jpg",
          followers: 250000,
          engagementRate: 4.2,
          fee: 75000,
          paymentStatus: "Partial",
          deliverables: ["d1", "d2"]
        },
        {
          id: "inf2",
          personId: "manish-001",
          name: "Manish Tech",
          handle: "@manishtech",
          platform: "YouTube",
          avatar: "/images/influencers/manish-tech.jpg",
          followers: 180000,
          engagementRate: 3.8,
          fee: 52500,
          paymentStatus: "Pending",
          deliverables: ["d3"]
        }
      ],
      deliverables: [
        {
          id: "d1",
          type: "Reel",
          quantity: 3,
          platform: "Instagram",
          deadline: "2024-11-10",
          status: "Approved",
          description: "Diwali makeup tutorial reels"
        },
        {
          id: "d2",
          type: "Story",
          quantity: 2,
          platform: "Instagram",
          deadline: "2024-11-12",
          status: "In Progress",
          description: "Behind-the-scenes stories"
        },
        {
          id: "d3",
          type: "Video",
          quantity: 1,
          platform: "YouTube",
          deadline: "2024-11-14",
          status: "Not Started",
          description: "Complete Diwali look tutorial"
        }
      ],
      progressPercent: 60,
      completedDeliverables: 1,
      totalDeliverables: 3,
      progress: 60,
      files: [],
      notes: [],
      tasks: [],
      clientApproved: true,
      createdBy: "admin",
      lastUpdatedBy: "ritika-001",
      tags: ["Diwali", "Beauty", "Festive"],
      linkedInvoices: ["INV-2024-014"]
    },
    {
      id: "2",
      name: "Tech Review Series",
      clientId: "tech-brand-001",
      clientName: "TechBrand Pro",
      clientLogo: "/images/clients/techbrand-logo.png",
      type: "Collaboration",
      platforms: ["YouTube", "LinkedIn"],
      category: "Technology",
      brief: "Comprehensive review series for latest tech products",
      goals: "Build credibility, showcase product features, drive pre-orders",
      status: "Review",
      visibility: "Public",
      startDate: "2024-10-20",
      endDate: "2024-12-15",
      createdAt: "2024-10-01T09:00:00Z",
      updatedAt: "2024-11-01T12:00:00Z",
      financials: {
        budgetTotal: 200000,
        currency: "INR",
        agencyCommissionPercent: 20,
        influencerPayoutTotal: 160000,
        totalDealValue: 200000,
        paymentTerms: "Advance 50%"
      },
      teamMembers: [
        {
          id: "tm2",
          personId: "manish-001",
          name: "Manish Kumar",
          role: "Account Manager",
          email: "manish@agency.com",
          avatar: "/images/team/manish.jpg"
        }
      ],
      influencers: [
        {
          id: "inf3",
          personId: "tech-reviewer-001",
          name: "Tech Reviewer Pro",
          handle: "@techreviewerpro",
          platform: "YouTube",
          avatar: "/images/influencers/tech-reviewer.jpg",
          followers: 500000,
          engagementRate: 5.1,
          fee: 160000,
          paymentStatus: "Paid",
          deliverables: ["d4", "d5"]
        }
      ],
      deliverables: [
        {
          id: "d4",
          type: "Video",
          quantity: 4,
          platform: "YouTube",
          deadline: "2024-12-10",
          status: "Submitted",
          description: "Product review videos"
        },
        {
          id: "d5",
          type: "Post",
          quantity: 8,
          platform: "LinkedIn",
          deadline: "2024-12-12",
          status: "In Progress",
          description: "Tech insights posts"
        }
      ],
      progressPercent: 75,
      completedDeliverables: 1,
      totalDeliverables: 2,
      progress: 75,
      files: [],
      notes: [],
      tasks: [],
      clientApproved: false,
      createdBy: "admin",
      lastUpdatedBy: "manish-001",
      tags: ["Technology", "Review", "Products"],
      linkedInvoices: []
    }
  ]);

  // Filter and sort campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !campaign.clientName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.status && filters.status.length > 0 && !filters.status.includes(campaign.status)) {
      return false;
    }
    
    if (filters.type && filters.type.length > 0 && !filters.type.includes(campaign.type)) {
      return false;
    }
    
    if (filters.platform && filters.platform.length > 0) {
      const hasMatchingPlatform = campaign.platforms.some(platform => 
        filters.platform!.includes(platform)
      );
      if (!hasMatchingPlatform) return false;
    }
    
    return true;
  });

  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'budget':
          aValue = a.financials.budgetTotal;
          bValue = b.financials.budgetTotal;
          break;
        case 'startDate':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'endDate':
          aValue = new Date(a.endDate);
          bValue = new Date(b.endDate);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          aValue = a[sortBy as keyof Campaign];
          bValue = b[sortBy as keyof Campaign];
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCampaigns, sortBy, sortOrder]);

  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailView(true);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedCampaigns);
    // Implement bulk actions
  };

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleKanbanDrop = (campaignId: string, newStatus: string) => {
    // Update campaign status in your data source
    console.log(`Moving campaign ${campaignId} to status ${newStatus}`);
    // In a real app, you would update the campaign status here
    // For now, we'll just log it
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === sortedCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(sortedCampaigns.map(c => c.id));
    }
  };

  const handleSaveCampaign = (campaignData: CampaignFormData) => {
    // In a real app, this would make an API call to save the campaign
    console.log('Saving campaign:', campaignData);
    
    // For now, just close the modal and show a success message
    setShowCreateModal(false);
    
    // You could add the new campaign to the local state here
    // setCampaigns(prev => [...prev, newCampaign]);
  };

  // Quick stats
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c: Campaign) => c.status === 'Active').length;
  const completedCampaigns = campaigns.filter((c: Campaign) => c.status === 'Completed').length;
  const totalBudget = campaigns.reduce((sum: number, c: Campaign) => sum + c.financials.budgetTotal, 0);

  return (
    <div className="space-y-6">
    
      
      {/* Header Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Campaigns & Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage marketing campaigns, track performance, and monitor project workflows
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <ArrowDownIcon className="w-4 h-4" />
              Filters
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowDownIcon className="w-4 h-4" />
              Export
            </Button>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-white/[0.02] rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalCampaigns}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Campaigns
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-white/[0.02] rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeCampaigns}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-white/[0.02] rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {completedCampaigns}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-white/[0.02] rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalBudget)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Budget
            </div>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <EyeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search campaigns, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {selectedCampaigns.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCampaigns.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('archive')}
                >
                  Archive
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.05] rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' 
                  ? 'bg-white dark:bg-white/[0.1] shadow-sm' 
                  : 'hover:bg-white/50 dark:hover:bg-white/[0.05]'
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded ${viewMode === 'kanban' 
                  ? 'bg-white dark:bg-white/[0.1] shadow-sm' 
                  : 'hover:bg-white/50 dark:hover:bg-white/[0.05]'
                }`}
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded ${viewMode === 'calendar' 
                  ? 'bg-white dark:bg-white/[0.1] shadow-sm' 
                  : 'hover:bg-white/50 dark:hover:bg-white/[0.05]'
                }`}
              >
                <CalenderIcon className="w-4 h-4" />
              </button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowDownIcon className="w-4 h-4" />
              Sort
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MultiSelect
              label="Status"
              options={CAMPAIGN_STATUS_OPTIONS.map(opt => ({
                value: opt.value,
                text: opt.label
              }))}
              value={filters.status || []}
              onChange={(values) => setFilters(prev => ({ ...prev, status: values as CampaignStatus[] }))}
              placeholder="All statuses"
            />
            
            <MultiSelect
              label="Campaign Type"
              options={CAMPAIGN_TYPE_OPTIONS.map(opt => ({
                value: opt.value,
                text: opt.label
              }))}
              value={filters.type || []}
              onChange={(values) => setFilters(prev => ({ ...prev, type: values as CampaignType[] }))}
              placeholder="All types"
            />
            
            <MultiSelect
              label="Platform"
              options={PLATFORM_OPTIONS.map(opt => ({
                value: opt.value,
                text: opt.label
              }))}
              value={filters.platform || []}
              onChange={(values) => setFilters(prev => ({ ...prev, platform: values as Platform[] }))}
              placeholder="All platforms"
            />
            
            <MultiSelect
              label="Payment Status"
              options={PAYMENT_STATUS_OPTIONS.map(opt => ({
                value: opt.value,
                text: opt.label
              }))}
              value={filters.paymentStatus || []}
              onChange={(values) => setFilters(prev => ({ ...prev, paymentStatus: values as PaymentStatus[] }))}
              placeholder="All payment statuses"
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-white/[0.05]">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.length === sortedCampaigns.length && sortedCampaigns.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Campaign Name</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Client</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Influencers</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Deliverables</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Dates</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Budget</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Progress</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Payment</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.map((campaign: Campaign) => (
                  <tr 
                    key={campaign.id}
                    className="border-b border-gray-100 dark:border-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={() => handleCampaignSelect(campaign.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {campaign.type} • {campaign.platforms.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {campaign.clientLogo && (
                          <img 
                            src={campaign.clientLogo} 
                            alt={campaign.clientName}
                            className="w-6 h-6 rounded"
                          />
                        )}
                        <span className="text-gray-900 dark:text-white">
                          {campaign.clientName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-2">
                        {campaign.influencers.slice(0, 3).map((influencer: InfluencerAssignment) => (
                          <img
                            key={influencer.id}
                            src={influencer.avatar || '/images/default-avatar.png'}
                            alt={influencer.name}
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                            title={influencer.name}
                          />
                        ))}
                        {campaign.influencers.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium">
                            +{campaign.influencers.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white">
                          {campaign.totalDeliverables} items
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {campaign.deliverables.map((d: Deliverable) => d.type).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white">
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          to {new Date(campaign.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(campaign.financials.budgetTotal)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getStatusColor(campaign.status) }}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${campaign.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {campaign.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ 
                          backgroundColor: getPaymentStatusColor(
                            campaign.influencers[0]?.paymentStatus || 'Pending'
                          ) 
                        }}
                      >
                        {campaign.influencers[0]?.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-1"
                      >
                        <HorizontaLDots className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'kanban' && (
          <KanbanView 
            campaigns={sortedCampaigns}
            onCampaignClick={handleCampaignClick}
            onCampaignUpdate={handleKanbanDrop}
          />
        )}

        {viewMode === 'calendar' && (
          <CalendarView 
            campaigns={sortedCampaigns}
            onCampaignClick={handleCampaignClick}
          />
        )}

        {sortedCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <PlusIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first campaign
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Campaign
            </Button>
          </div>
        )}
      </div>

      {/* Campaign Form Modal */}
      <CampaignFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveCampaign}
        mode="add"
      />

      {/* Campaign Detail Modal */}
      <CampaignDetailModal
        isOpen={showDetailView}
        onClose={() => setShowDetailView(false)}
        campaign={selectedCampaign}
        onEdit={() => {
          setShowDetailView(false);
          setShowCreateModal(true);
        }}
      />
    </div>
  );
}