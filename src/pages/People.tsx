import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import MultiSelect from "../components/form/MultiSelect";
import { 
  PlusIcon, 
  ListIcon, 
  GridIcon,
  DownloadIcon,
  MailIcon,
  GroupIcon
} from "../icons";
import { 
  Person, 
  PersonFilters, 
  PersonRole,
  PersonStatus,
  AvailabilityStatus,
  Platform,
  PERSON_ROLE_OPTIONS,
  PERSON_STATUS_OPTIONS,
  AVAILABILITY_STATUS_OPTIONS,
  PLATFORM_OPTIONS
} from "../types/person";

export default function People() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PersonFilters>({});
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Sample data - replace with actual data fetching
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  // Filter people based on search and filters
  useEffect(() => {
    let filtered = people;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(person => 
        person.fullName.toLowerCase().includes(query) ||
        person.handle?.toLowerCase().includes(query) ||
        person.primaryEmail.toLowerCase().includes(query) ||
        person.primaryPhone.includes(query)
      );
    }

    // Role filter
    if (filters.roles && filters.roles.length > 0) {
      filtered = filtered.filter(person => 
        person.roles.some(role => filters.roles!.includes(role))
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(person => 
        filters.status!.includes(person.status)
      );
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      filtered = filtered.filter(person => 
        filters.availability!.includes(person.availabilityStatus)
      );
    }

    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      filtered = filtered.filter(person => {
        const personPlatforms = Object.keys(person.platformMetrics) as Platform[];
        return filters.platforms!.some(platform => 
          personPlatforms.includes(platform)
        );
      });
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(person => 
        filters.tags!.some(tag => person.tags.includes(tag))
      );
    }

    setFilteredPeople(filtered);
  }, [people, searchQuery, filters]);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setShowDetailDrawer(true);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedPeople);
    // Implement bulk actions
  };

  const stats = {
    total: people.length,
    active: people.filter(p => p.status === 'Active').length,
    available: people.filter(p => p.availabilityStatus === 'Available').length,
    influencers: people.filter(p => p.roles.includes('Influencer')).length
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="People" />
      
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              People
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage contacts, influencers, team members, and stakeholders
            </p>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Person
            </Button>
            <Button variant="outline" size="sm">
              Import CSV
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <MailIcon className="w-4 h-4 mr-2" />
              Invite
            </Button>
            {selectedPeople.length > 0 && (
              <div className="relative">
                <select
                  className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  onChange={(e) => handleBulkAction(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Actions</option>
                  <option value="assign">Assign to Team Member</option>
                  <option value="tag">Add Tags</option>
                  <option value="archive">Archive</option>
                  <option value="export">Export Selected</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total People</div>
          </div>
          <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.available}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
          </div>
          <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.influencers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Influencers</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by name, handle, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-4">
          <MultiSelect
            label="Role"
            placeholder="Select roles"
            options={PERSON_ROLE_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.roles || []}
            onChange={(values) => setFilters(prev => ({ ...prev, roles: values as PersonRole[] }))}
          />
          <MultiSelect
            label="Status"
            placeholder="Select status"
            options={PERSON_STATUS_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.status || []}
            onChange={(values) => setFilters(prev => ({ ...prev, status: values as PersonStatus[] }))}
          />
          <MultiSelect
            label="Platform"
            placeholder="Select platforms"
            options={PLATFORM_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.platforms || []}
            onChange={(values) => setFilters(prev => ({ ...prev, platforms: values as Platform[] }))}
          />
          <MultiSelect
            label="Availability"
            placeholder="Select availability"
            options={AVAILABILITY_STATUS_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.availability || []}
            onChange={(values) => setFilters(prev => ({ ...prev, availability: values as AvailabilityStatus[] }))}
          />
          <Input
            type="text"
            placeholder="Location"
            value={filters.location || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="max-w-xs"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredPeople.length} of {people.length} people
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
            <div className="flex rounded-lg border border-gray-200 dark:border-white/[0.05]">
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <ListIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <GridIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
        {viewMode === 'table' ? (
          <div className="p-6">
            {/* Table will be implemented in PeopleTable component */}
            <div className="text-center py-12">
              <GroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No people found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by adding your first person to the system.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Grid view will be implemented later */}
            <div className="text-center py-12">
              <GridIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Grid View Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Switch to table view to see your people.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals and Drawers will be added here */}
      {/* AddEditPersonModal */}
      {/* PersonDetailDrawer */}
    </div>
  );
}