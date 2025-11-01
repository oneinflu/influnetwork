import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Select from "../form/Select";

import RateCardFormModal from "../modals/RateCardFormModal";
import RateCardViewModal from "../modals/RateCardViewModal";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashBinIcon,
  CopyIcon,
  GridIcon,
  TableIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../icons";
import {
  RateCard,
  RateCardFilters,
  RateCardSortConfig,
  RateCardViewMode,
  CATEGORY_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "../../types/rateCard";

interface RateCardsTableProps {
  rateCards: RateCard[];
  onAddRateCard: () => void;
  onEditRateCard: (rateCard: RateCard) => void;
  onDuplicateRateCard: (rateCard: RateCard) => void;
  onDeleteRateCard: (id: string) => void;
  onViewRateCard: (rateCard: RateCard) => void;
  onToggleVisibility: (id: string, visibility: 'Public' | 'Private') => void;
}

// Sample data for demonstration
const sampleRateCards: RateCard[] = [
  {
    id: "1",
    rateCardName: "Instagram Story – Fashion",
    category: "Instagram",
    serviceType: "Story",
    contentDuration: "30 sec",
    baseRate: 8000,
    discountPercentage: 10,
    finalRate: 7200,
    pricingType: "Per Post",
    linkedInfluencer: "@rhea_styles",
    applicableFor: "Brand",
    inclusions: "1 story + usage rights for 24 hours",
    deliveryTime: "1 day",
    lastUpdated: "2025-01-25",
    visibility: "Public",
    createdBy: "Rhea Styles (Influencer)",
    createdOn: "2025-01-15",
  },
  {
    id: "2",
    rateCardName: "YouTube Product Review",
    category: "YouTube",
    serviceType: "Video",
    contentDuration: "5-8 min",
    baseRate: 25000,
    discountPercentage: 0,
    finalRate: 25000,
    pricingType: "Per Video",
    linkedInfluencer: "@manishtech",
    applicableFor: "Brand",
    inclusions: "1 dedicated review video + 3 social media posts",
    deliveryTime: "7 days",
    lastUpdated: "2025-01-24",
    visibility: "Private",
    createdBy: "Manish Tech (Influencer)",
    createdOn: "2025-01-10",
  },
  {
    id: "3",
    rateCardName: "Event Appearance – Lifestyle Expo",
    category: "Event",
    serviceType: "Appearance",
    contentDuration: "4 hours",
    baseRate: 40000,
    discountPercentage: 10,
    finalRate: 36000,
    pricingType: "Per Event",
    linkedInfluencer: "@nisha_vogue",
    applicableFor: "Agency",
    inclusions: "4-hour appearance + 5 social media posts + meet & greet",
    deliveryTime: "Event day",
    lastUpdated: "2025-01-23",
    visibility: "Public",
    createdBy: "Nisha Vogue (Influencer)",
    createdOn: "2025-01-08",
  },
];

export default function RateCardsTable({
  rateCards = sampleRateCards,
  onAddRateCard,
  onEditRateCard,
 
  onDeleteRateCard,
 
  onToggleVisibility,
}: RateCardsTableProps) {
  const [viewMode, setViewMode] = useState<RateCardViewMode>('table');
  const [filters, setFilters] = useState<RateCardFilters>({
    search: '',
    category: '',
    serviceType: '',
    linkedInfluencer: '',
    visibility: 'All',
    priceRange: { min: 0, max: 100000 },
  });
  const [sortConfig, setSortConfig] = useState<RateCardSortConfig>({
    field: 'lastUpdated',
    direction: 'desc',
  });

  // Modal state management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRateCard, setSelectedRateCard] = useState<RateCard | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Modal handlers
  const handleAddRateCard = () => {
    setSelectedRateCard(null);
    setModalMode('add');
    setIsFormModalOpen(true);
  };

  const handleEditRateCard = (rateCard: RateCard) => {
    setSelectedRateCard(rateCard);
    setModalMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDuplicateRateCard = (rateCard: RateCard) => {
    const duplicatedCard = {
      ...rateCard,
      id: '', // Will be generated in modal
      rateCardName: `${rateCard.rateCardName} (Copy)`,
      createdOn: '',
      lastUpdated: ''
    };
    setSelectedRateCard(duplicatedCard);
    setModalMode('add');
    setIsFormModalOpen(true);
  };

  const handleDeleteRateCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this rate card?')) {
      onDeleteRateCard(id);
    }
  };

  const handleViewRateCard = (rateCard: RateCard) => {
    setSelectedRateCard(rateCard);
    setIsViewModalOpen(true);
  };

  const handleSaveRateCard = (rateCardData: Partial<RateCard>) => {
    if (modalMode === 'add') {
      onAddRateCard();
    } else {
      onEditRateCard(rateCardData as RateCard);
    }
  };

  // Filter and sort rate cards
  const filteredAndSortedRateCards = useMemo(() => {
    let filtered = rateCards.filter((card) => {
      const matchesSearch = 
        card.rateCardName.toLowerCase().includes(filters.search.toLowerCase()) ||
        card.linkedInfluencer.toLowerCase().includes(filters.search.toLowerCase()) ||
        card.inclusions.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.category || card.category === filters.category;
      const matchesServiceType = !filters.serviceType || card.serviceType === filters.serviceType;
      const matchesInfluencer = !filters.linkedInfluencer || 
        card.linkedInfluencer.toLowerCase().includes(filters.linkedInfluencer.toLowerCase());
      const matchesVisibility = filters.visibility === 'All' || card.visibility === filters.visibility;
      const matchesPriceRange = card.finalRate >= filters.priceRange.min && 
        card.finalRate <= filters.priceRange.max;

      return matchesSearch && matchesCategory && matchesServiceType && 
        matchesInfluencer && matchesVisibility && matchesPriceRange;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [rateCards, filters, sortConfig]);

  const handleSort = (field: keyof RateCard) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (key: keyof RateCardFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const SortButton = ({ field, children }: { field: keyof RateCard; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {children}
      {sortConfig.field === field && (
        sortConfig.direction === 'asc' ? 
          <ChevronUpIcon className="w-4 h-4" /> : 
          <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Rate Cards
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage service pricing and rate cards for different platforms
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Grid View"
            >
              <GridIcon className="w-4 h-4" />
            </button>
          </div>
          
          <Button onClick={handleAddRateCard} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Rate Card
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="xl:col-span-2">
            <Input
              placeholder="Search rate cards, influencers..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select
            options={[
              { value: '', label: 'All Categories' },
              ...CATEGORY_OPTIONS.map(option => ({ value: option, label: option }))
            ]}
            onChange={(value) => handleFilterChange('category', value)}
            className="w-full"
            defaultValue={filters.category}
          />
          
          <Select
            options={[
              { value: '', label: 'All Services' },
              ...SERVICE_TYPE_OPTIONS.map(option => ({ value: option, label: option }))
            ]}
            onChange={(value) => handleFilterChange('serviceType', value)}
            className="w-full"
            defaultValue={filters.serviceType}
          />
          
          <Input
            placeholder="Filter by influencer"
            value={filters.linkedInfluencer}
            onChange={(e) => handleFilterChange('linkedInfluencer', e.target.value)}
            className="w-full"
          />
          
          <Select
            options={[
              { value: 'All', label: 'All Visibility' },
              { value: 'Public', label: 'Public' },
              { value: 'Private', label: 'Private' }
            ]}
            onChange={(value) => handleFilterChange('visibility', value)}
            className="w-full"
            defaultValue={filters.visibility}
          />
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <SortButton field="rateCardName">Rate Card Name</SortButton>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <SortButton field="category">Platform</SortButton>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <SortButton field="serviceType">Deliverable</SortButton>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <SortButton field="baseRate">Base Rate</SortButton>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <SortButton field="finalRate">Final Rate</SortButton>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <SortButton field="linkedInfluencer">Linked Influencer</SortButton>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Visibility
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <SortButton field="lastUpdated">Last Updated</SortButton>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredAndSortedRateCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                        <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {card.rateCardName}
                        </div>
                        {card.contentDuration && (
                          <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                            {card.contentDuration}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge color="light">
                        {card.category}
                      </Badge>
                      <Badge 
                        color={card.visibility === 'Public' ? 'success' : 'warning'}
                      >
                        {card.visibility === 'Public' ? '🟢' : '🔒'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge color="primary">
                        {card.serviceType}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                        {formatCurrency(card.baseRate)}
                      </div>
                      {card.discountPercentage > 0 && (
                        <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                          -{card.discountPercentage}%
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="text-gray-800 text-theme-sm dark:text-white/90 font-semibold">
                        {formatCurrency(card.finalRate)}
                      </div>
                      <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {card.pricingType}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {card.linkedInfluencer}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <button
                        onClick={() => onToggleVisibility(card.id, card.visibility === 'Public' ? 'Private' : 'Public')}
                        className="flex items-center gap-1"
                      >
                        <Badge 
                          color={card.visibility === 'Public' ? 'success' : 'warning'}
                        >
                          {card.visibility === 'Public' ? '🟢 Public' : '🔒 Private'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(card.lastUpdated)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewRateCard(card)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditRateCard(card)}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          title="Edit Rate Card"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateRateCard(card)}
                          className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                          title="Duplicate Rate Card"
                        >
                          <CopyIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRateCard(card.id)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete Rate Card"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {filteredAndSortedRateCards.length} of {rateCards.length} rate cards
              </span>
              <div className="flex items-center gap-4">
                <span>
                  Total Value: {formatCurrency(
                    filteredAndSortedRateCards.reduce((sum, card) => sum + card.finalRate, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedRateCards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-200"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge color="light">
                    {card.category}
                  </Badge>
                  <Badge 
                    color={card.visibility === 'Public' ? 'success' : 'warning'}
                  >
                    {card.visibility === 'Public' ? '🟢' : '🔒'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewRateCard(card)}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditRateCard(card)}
                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white/90 line-clamp-2">
                  {card.rateCardName}
                </h3>
                
                <div className="flex items-center justify-between">
                  <Badge color="primary">
                    {card.serviceType}
                  </Badge>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white/90">
                      {formatCurrency(card.finalRate)}
                    </div>
                    {card.discountPercentage > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                        {formatCurrency(card.baseRate)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Influencer:</span>
                    <span className="font-medium">{card.linkedInfluencer}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Delivery:</span>
                    <span>{card.deliveryTime}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Updated {formatDate(card.lastUpdated)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicateRateCard(card)}
                        className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                        title="Duplicate"
                      >
                        <CopyIcon className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteRateCard(card.id)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <TrashBinIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedRateCards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <TableIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">
            No rate cards found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.search || filters.category || filters.serviceType
              ? "Try adjusting your filters to see more results."
              : "Get started by creating your first rate card."}
          </p>
          <Button onClick={handleAddRateCard} className="flex items-center gap-2 mx-auto">
            <PlusIcon className="w-4 h-4" />
            Add Rate Card
          </Button>
        </div>
      )}

      {/* Rate Card Form Modal */}
      <RateCardFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveRateCard}
        rateCard={selectedRateCard}
        mode={modalMode}
      />

      {/* Rate Card View Modal */}
      <RateCardViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        rateCard={selectedRateCard}
      />
    </div>
  );
}