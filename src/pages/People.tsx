import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import MultiSelect from "../components/form/MultiSelect";
import PeopleTable from "../components/tables/PeopleTable";
import PeopleGrid from "../components/cards/PeopleGrid";
import AddEditPersonModal from "../components/modals/AddEditPersonModal";
import PersonDetailDrawer from "../components/drawers/PersonDetailDrawer";
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
  const [people, ] = useState<Person[]>([
    {
      id: "1",
      fullName: "Rhea Styles",
      handle: "@rhea_styles",
      roles: ["Influencer"],
      primaryEmail: "rhea@styleinfluencer.com",
      primaryPhone: "+91 98765 43210",
      organization: "Style Influencer Co.",
      title: "Fashion Influencer",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
      },
      shortBio: "Fashion enthusiast and lifestyle blogger with 500K+ followers across platforms.",
      socialLinks: {
        instagram: "@rhea_styles",
        youtube: "RheaStylesOfficial",
        tiktok: "@rhea_styles",
        linkedin: "rhea-styles",
        website: "https://rheastyles.com"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        instagram: { followers: 520000, engagement: 4.2 },
        youtube: { subscribers: 85000, engagement: 6.8 },
        tiktok: { followers: 320000, engagement: 8.5 }
      },
      pricingNotes: "Rates vary based on campaign scope and deliverables",
      isNegotiable: true,
      availabilityStatus: "Available",
      nextAvailableDate: "2025-02-01",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: false,
      isClaimed: false,
      tags: ["Fashion", "Lifestyle", "Beauty"],
      createdBy: "admin",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2025-01-25T14:30:00Z"
    },
    {
      id: "2",
      fullName: "Manish Tech",
      handle: "@manishtech",
      roles: ["Influencer"],
      primaryEmail: "manish@techreviews.com",
      primaryPhone: "+91 87654 32109",
      organization: "Tech Reviews India",
      title: "Senior Tech Reviewer",
      location: {
        city: "Bangalore",
        state: "Karnataka",
        country: "India"
      },
      shortBio: "Technology enthusiast reviewing latest gadgets and tech trends for 300K+ audience.",
      socialLinks: {
        instagram: "@manishtech",
        youtube: "ManishTechReviews",
        linkedin: "manish-tech-reviewer",
        website: "https://techreviewsindia.com"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        youtube: { subscribers: 450000, engagement: 7.2 },
        instagram: { followers: 180000, engagement: 5.1 },
        linkedin: { connections: 25000, engagement: 3.8 }
      },
      pricingNotes: "Specialized in tech product reviews and unboxing videos",
      isNegotiable: false,
      availabilityStatus: "On Hold",
      nextAvailableDate: "2025-02-15",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: true,
      isClaimed: false,
      tags: ["Technology", "Reviews", "Gadgets"],
      createdBy: "admin",
      createdAt: "2024-02-10T09:15:00Z",
      updatedAt: "2025-01-24T16:45:00Z"
    },
    {
      id: "3",
      fullName: "Nisha Vogue",
      handle: "@nisha_vogue",
      roles: ["Influencer", "Model"],
      primaryEmail: "nisha@voguestyle.com",
      primaryPhone: "+91 76543 21098",
      organization: "Vogue Style Agency",
      title: "Fashion Model & Influencer",
      location: {
        city: "Delhi",
        state: "Delhi",
        country: "India"
      },
      shortBio: "Professional model and fashion influencer specializing in high-end fashion and lifestyle content.",
      socialLinks: {
        instagram: "@nisha_vogue",
        youtube: "NishaVogueOfficial",
        tiktok: "@nisha_vogue",
        linkedin: "nisha-vogue",
        website: "https://nishavogue.com"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        instagram: { followers: 750000, engagement: 6.3 },
        youtube: { subscribers: 120000, engagement: 5.9 },
        tiktok: { followers: 480000, engagement: 9.2 }
      },
      pricingNotes: "Premium rates for luxury brand collaborations",
      isNegotiable: true,
      availabilityStatus: "Available",
      nextAvailableDate: "2025-01-30",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: false,
      isClaimed: false,
      tags: ["Fashion", "Luxury", "Modeling"],
      createdBy: "admin",
      createdAt: "2024-01-08T11:30:00Z",
      updatedAt: "2025-01-23T13:20:00Z"
    },
    {
      id: "4",
      fullName: "Dance Queen",
      handle: "@dance_queen",
      roles: ["Influencer"],
      primaryEmail: "contact@dancequeen.com",
      primaryPhone: "+91 65432 10987",
      organization: "Dance Academy Mumbai",
      title: "Professional Dancer & Choreographer",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
      },
      shortBio: "Professional dancer and choreographer creating viral dance content and tutorials.",
      socialLinks: {
        instagram: "@dance_queen",
        tiktok: "@dance_queen",
        youtube: "DanceQueenOfficial"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        tiktok: { followers: 890000, engagement: 12.4 },
        instagram: { followers: 340000, engagement: 8.7 },
        youtube: { subscribers: 95000, engagement: 6.1 }
      },
      pricingNotes: "Specializes in dance challenges and choreography content",
      isNegotiable: true,
      availabilityStatus: "Available",
      nextAvailableDate: "2025-02-05",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: true,
      isClaimed: false,
      tags: ["Dance", "Entertainment", "Viral Content"],
      createdBy: "admin",
      createdAt: "2024-01-05T14:45:00Z",
      updatedAt: "2025-01-22T10:15:00Z"
    },
    {
      id: "5",
      fullName: "Business Guru",
      handle: "@business_guru",
      roles: ["Manager"],
      primaryEmail: "guru@businessinsights.com",
      primaryPhone: "+91 54321 09876",
      organization: "Business Insights Consulting",
      title: "Senior Business Consultant",
      location: {
        city: "Pune",
        state: "Maharashtra",
        country: "India"
      },
      shortBio: "Business strategist and thought leader sharing insights on entrepreneurship and leadership.",
      socialLinks: {
        linkedin: "business-guru-consultant",
        youtube: "BusinessGuruInsights",
        instagram: "@business_guru",
        website: "https://businessinsights.com"
      },
      isPortfolioPublic: false,
      platformMetrics: {
        linkedin: { connections: 85000, engagement: 5.4 },
        youtube: { subscribers: 65000, engagement: 4.8 },
        instagram: { followers: 45000, engagement: 3.2 }
      },
      pricingNotes: "Focus on B2B content and thought leadership pieces",
      isNegotiable: false,
      availabilityStatus: "Available",
      nextAvailableDate: "2025-02-01",
      status: "Active",
      visibilityLevel: "Private",
      isClaimable: false,
      isClaimed: false,
      tags: ["Business", "Leadership", "Consulting"],
      createdBy: "admin",
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2025-01-21T15:30:00Z"
    },
    {
      id: "6",
      fullName: "Sarah Johnson",
      handle: "@sarah_fitness",
      roles: ["Team"],
      primaryEmail: "sarah@fitnesscoach.com",
      primaryPhone: "+91 43210 98765",
      organization: "FitLife Studios",
      title: "Senior Fitness Coach",
      location: {
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India"
      },
      shortBio: "Certified fitness trainer helping people achieve their health and wellness goals.",
      socialLinks: {
        instagram: "@sarah_fitness",
        youtube: "SarahFitnessCoach"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        instagram: { followers: 125000, engagement: 7.1 },
        youtube: { subscribers: 78000, engagement: 8.3 }
      },
      pricingNotes: "Fitness and wellness content creation",
      isNegotiable: true,
      availabilityStatus: "Booked",
      nextAvailableDate: "2025-02-20",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: false,
      isClaimed: false,
      tags: ["Fitness", "Health", "Wellness"],
      createdBy: "admin",
      createdAt: "2024-03-12T12:00:00Z",
      updatedAt: "2025-01-20T09:45:00Z"
    },
    {
      id: "7",
      fullName: "Raj Patel",
      handle: "@raj_foodie",
      roles: ["Influencer"],
      primaryEmail: "raj@foodieadventures.com",
      primaryPhone: "+91 32109 87654",
      organization: "Foodie Adventures",
      title: "Food Content Creator",
      location: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
      },
      shortBio: "Food enthusiast exploring culinary delights and sharing authentic food experiences.",
      socialLinks: {
        instagram: "@raj_foodie",
        youtube: "RajFoodieAdventures",
        tiktok: "@raj_foodie",
        website: "https://foodieadventures.com"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        instagram: { followers: 280000, engagement: 9.1 },
        youtube: { subscribers: 145000, engagement: 7.6 },
        tiktok: { followers: 195000, engagement: 11.2 }
      },
      pricingNotes: "Restaurant reviews and food brand collaborations",
      isNegotiable: true,
      availabilityStatus: "Available",
      nextAvailableDate: "2025-01-28",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: true,
      isClaimed: false,
      tags: ["Food", "Travel", "Reviews"],
      createdBy: "admin",
      createdAt: "2024-02-28T16:20:00Z",
      updatedAt: "2025-01-19T11:10:00Z"
    },
    {
      id: "8",
      fullName: "Priya Sharma",
      handle: "@priya_beauty",
      roles: ["Influencer"],
      primaryEmail: "priya@beautyexpert.com",
      primaryPhone: "+91 21098 76543",
      organization: "Beauty Expert Co.",
      title: "Beauty & Skincare Specialist",
      location: {
        city: "Jaipur",
        state: "Rajasthan",
        country: "India"
      },
      shortBio: "Beauty and skincare expert sharing tips, tutorials, and product reviews.",
      socialLinks: {
        instagram: "@priya_beauty",
        youtube: "PriyaBeautyExpert",
        tiktok: "@priya_beauty"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        instagram: { followers: 420000, engagement: 8.9 },
        youtube: { subscribers: 185000, engagement: 6.4 },
        tiktok: { followers: 310000, engagement: 10.7 }
      },
      pricingNotes: "Beauty and skincare brand partnerships",
      isNegotiable: false,
      availabilityStatus: "Available",
      nextAvailableDate: "2025-02-03",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: false,
      isClaimed: false,
      tags: ["Beauty", "Skincare", "Tutorials"],
      createdBy: "admin",
      createdAt: "2024-01-20T13:15:00Z",
      updatedAt: "2025-01-18T14:25:00Z"
    },
    {
      id: "9",
      fullName: "Alex Thompson",
      handle: "@alex_travel",
      roles: ["Vendor"],
      primaryEmail: "alex@wanderlustadventures.com",
      primaryPhone: "+91 10987 65432",
      organization: "Wanderlust Adventures",
      title: "Travel Content Creator",
      location: {
        city: "Goa",
        state: "Goa",
        country: "India"
      },
      shortBio: "Travel enthusiast documenting adventures and hidden gems around the world.",
      socialLinks: {
        instagram: "@alex_travel",
        youtube: "AlexTravelAdventures",
        website: "https://wanderlustadventures.com"
      },
      isPortfolioPublic: true,
      platformMetrics: {
        instagram: { followers: 380000, engagement: 7.8 },
        youtube: { subscribers: 220000, engagement: 8.1 }
      },
      pricingNotes: "Travel and tourism brand collaborations",
      isNegotiable: true,
      availabilityStatus: "Booked",
      nextAvailableDate: "2025-03-01",
      status: "Active",
      visibilityLevel: "Public",
      isClaimable: true,
      isClaimed: false,
      tags: ["Travel", "Adventure", "Tourism"],
      createdBy: "admin",
      createdAt: "2024-04-05T10:30:00Z",
      updatedAt: "2025-01-17T16:50:00Z"
    },
    {
      id: "10",
      fullName: "Kavya Reddy",
      handle: "@kavya_lifestyle",
      roles: ["Influencer"],
      primaryEmail: "kavya@lifestylehub.com",
      primaryPhone: "+91 09876 54321",
      organization: "Lifestyle Hub",
      title: "Lifestyle Content Strategist",
      location: {
        city: "Hyderabad",
        state: "Telangana",
        country: "India"
      },
      shortBio: "Lifestyle influencer focusing on home decor, wellness, and sustainable living.",
      socialLinks: {
        instagram: "@kavya_lifestyle",
        youtube: "KavyaLifestyleHub",
        linkedin: "kavya-reddy-lifestyle",
        website: "https://lifestylehub.com"
      },
      isPortfolioPublic: false,
      platformMetrics: {
        instagram: { followers: 295000, engagement: 6.7 },
        youtube: { subscribers: 98000, engagement: 5.3 },
        linkedin: { connections: 15000, engagement: 4.1 }
      },
      pricingNotes: "Home decor and lifestyle brand partnerships",
      isNegotiable: true,
      availabilityStatus: "Available",
      nextAvailableDate: "2025-02-10",
      status: "Archived",
      visibilityLevel: "Private",
      isClaimable: false,
      isClaimed: false,
      tags: ["Lifestyle", "Home Decor", "Sustainability"],
      createdBy: "admin",
      createdAt: "2024-03-18T09:45:00Z",
      updatedAt: "2025-01-16T12:30:00Z"
    }
  ]);
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
    <div className="p-6 space-y-6">
      <PageBreadcrumb pageTitle="People" />
      
      {/* Compact Header with Actions and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            People
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage contacts, influencers, team members, and stakeholders
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
              <ListIcon className="w-4 h-4" />
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
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <MailIcon className="w-4 h-4 mr-2" />
              Invite
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Person
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Compact Filters */}
      <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="xl:col-span-2">
            <Input
              type="text"
              placeholder="Search by name, handle, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <MultiSelect
            label=""
            placeholder="Select roles"
            options={PERSON_ROLE_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.roles || []}
            onChange={(values) => setFilters(prev => ({ ...prev, roles: values as PersonRole[] }))}
          />
          
          <MultiSelect
            label=""
            placeholder="Select status"
            options={PERSON_STATUS_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.status || []}
            onChange={(values) => setFilters(prev => ({ ...prev, status: values as PersonStatus[] }))}
          />
          
          <MultiSelect
            label=""
            placeholder="Select platforms"
            options={PLATFORM_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.platforms || []}
            onChange={(values) => setFilters(prev => ({ ...prev, platforms: values as Platform[] }))}
          />
          
          <MultiSelect
            label=""
            placeholder="Select availability"
            options={AVAILABILITY_STATUS_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.availability || []}
            onChange={(values) => setFilters(prev => ({ ...prev, availability: values as AvailabilityStatus[] }))}
          />
        </div>
        
        {/* Results Count and Bulk Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredPeople.length} of {people.length} people
          </div>
          {selectedPeople.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPeople.length} selected
              </span>
              <select
                className="h-8 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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

      {/* Content Area */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
        {viewMode === 'table' ? (
          filteredPeople.length > 0 ? (
            <PeopleTable
              people={filteredPeople}
              selectedPeople={selectedPeople}
              onSelectionChange={setSelectedPeople}
              onPersonClick={handlePersonClick}
              onQuickAction={(action, personId) => console.log('Quick action:', action, 'for person:', personId)}
            />
          ) : (
            <div className="p-6">
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
          )
        ) : (
          <div className="p-6">
            <PeopleGrid
              people={filteredPeople}
              selectedPeople={selectedPeople}
              onSelectionChange={setSelectedPeople}
              onPersonClick={handlePersonClick}
              onQuickAction={handleBulkAction}
            />
          </div>
        )}
      </div>

      {/* Modals and Drawers */}
      <AddEditPersonModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        person={selectedPerson || undefined}
        onSave={(personData) => {
          // Handle save logic here
          console.log('Saving person:', personData);
          setShowAddModal(false);
          setSelectedPerson(null);
        }}
      />
      
      <PersonDetailDrawer
        isOpen={showDetailDrawer}
        onClose={() => {
          setShowDetailDrawer(false);
          setSelectedPerson(null);
        }}
        person={selectedPerson}
        onEdit={(person) => {
          setSelectedPerson(person);
          setShowDetailDrawer(false);
          setShowAddModal(true);
        }}
      />
    </div>
  );
}