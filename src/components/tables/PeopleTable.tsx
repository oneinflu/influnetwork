import { useState } from "react";
import { Person } from "../../types/person";
import Button from "../ui/button/Button";
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  MailIcon,
  PlusIcon,
  EyeIcon,
  MoreDotIcon,
  UserIcon,
  PaperPlaneIcon
} from "../../icons";
import { formatFollowerCount } from "../../types/person";

interface PeopleTableProps {
  people: Person[];
  selectedPeople: string[];
  onSelectionChange: (selected: string[]) => void;
  onPersonClick: (person: Person) => void;
  onQuickAction: (action: string, personId: string) => void;
}

type SortField = 'fullName' | 'roles' | 'organization' | 'availabilityStatus' | 'status' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

const PeopleTable: React.FC<PeopleTableProps> = ({
  people,
  selectedPeople,
  onSelectionChange,
  onPersonClick,
  onQuickAction
}) => {
  const [sortField, setSortField] = useState<SortField>('fullName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPeople = [...people].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'fullName':
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case 'roles':
        aValue = a.roles[0] || '';
        bValue = b.roles[0] || '';
        break;
      case 'organization':
        aValue = a.organization || '';
        bValue = b.organization || '';
        break;
      case 'availabilityStatus':
        aValue = a.availabilityStatus;
        bValue = b.availabilityStatus;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'lastActivity':
        aValue = new Date(a.lastActivity || a.updatedAt);
        bValue = new Date(b.lastActivity || b.updatedAt);
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = () => {
    if (selectedPeople.length === people.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(people.map(p => p.id));
    }
  };

  const handleSelectPerson = (personId: string) => {
    if (selectedPeople.includes(personId)) {
      onSelectionChange(selectedPeople.filter(id => id !== personId));
    } else {
      onSelectionChange([...selectedPeople, personId]);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Onboarding': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getAvailabilityBadgeColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Booked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Influencer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Model': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      case 'Editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Manager': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'Photographer': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Brand Rep': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Team': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300';
      case 'Vendor': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTotalFollowers = (person: Person): number => {
    const metrics = person.platformMetrics;
    let total = 0;
    
    if (metrics.Instagram?.followers) total += metrics.Instagram.followers;
    if (metrics.YouTube?.followers) total += metrics.YouTube.followers;
    if (metrics.TikTok?.followers) total += metrics.TikTok.followers;
    if (metrics.LinkedIn?.followers) total += metrics.LinkedIn.followers;
    
    return total;
  };

  const getPlatformTags = (person: Person): string[] => {
    const platforms: string[] = [];
    const metrics = person.platformMetrics;
    
    if (metrics.Instagram?.followers) platforms.push('Instagram');
    if (metrics.YouTube?.followers) platforms.push('YouTube');
    if (metrics.TikTok?.followers) platforms.push('TikTok');
    if (metrics.LinkedIn?.followers) platforms.push('LinkedIn');
    if (person.socialLinks.some(link => link.platform === 'Offline')) platforms.push('Offline');
    
    return platforms;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUpIcon className="w-4 h-4" /> : 
          <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4">
              <input
                type="checkbox"
                checked={selectedPeople.length === people.length && people.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
            </th>
            <th className="text-left py-3 px-4">
              <SortButton field="fullName">Name</SortButton>
            </th>
            <th className="text-left py-3 px-4">Handle</th>
            <th className="text-left py-3 px-4">
              <SortButton field="roles">Role</SortButton>
            </th>
            <th className="text-left py-3 px-4">
              <SortButton field="organization">Organization</SortButton>
            </th>
            <th className="text-left py-3 px-4">Contact</th>
            <th className="text-left py-3 px-4">Platforms</th>
            <th className="text-left py-3 px-4">Followers</th>
            <th className="text-left py-3 px-4">Rate Card</th>
            <th className="text-left py-3 px-4">
              <SortButton field="availabilityStatus">Availability</SortButton>
            </th>
            <th className="text-left py-3 px-4">Location</th>
            <th className="text-left py-3 px-4">Assigned To</th>
            <th className="text-left py-3 px-4">
              <SortButton field="status">Status</SortButton>
            </th>
            <th className="text-left py-3 px-4">
              <SortButton field="lastActivity">Last Activity</SortButton>
            </th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPeople.map((person) => (
            <tr
              key={person.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
              onClick={() => onPersonClick(person)}
            >
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedPeople.includes(person.id)}
                  onChange={() => handleSelectPerson(person.id)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
              </td>
              
              {/* Avatar & Name */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {person.avatar ? (
                      <img src={person.avatar} alt={person.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{person.fullName}</div>
                  </div>
                </div>
              </td>
              
              {/* Handle */}
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {person.handle ? `@${person.handle}` : '-'}
                </div>
              </td>
              
              {/* Role */}
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {person.roles.slice(0, 2).map((role) => (
                    <span
                      key={role}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}
                    >
                      {role}
                    </span>
                  ))}
                  {person.roles.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{person.roles.length - 2} more
                    </span>
                  )}
                </div>
              </td>
              
              {/* Organization */}
              <td className="py-3 px-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {person.organization || 'Freelance'}
                </div>
              </td>
              
              {/* Contact */}
              <td className="py-3 px-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-900 dark:text-white">{person.primaryPhone}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{person.primaryEmail}</div>
                </div>
              </td>
              
              {/* Platforms */}
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {getPlatformTags(person).slice(0, 3).map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      {platform}
                    </span>
                  ))}
                  {getPlatformTags(person).length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{getPlatformTags(person).length - 3}
                    </span>
                  )}
                </div>
              </td>
              
              {/* Followers */}
              <td className="py-3 px-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {getTotalFollowers(person) > 0 ? formatFollowerCount(getTotalFollowers(person)) : 'N/A'}
                </div>
              </td>
              
              {/* Rate Card */}
              <td className="py-3 px-4">
                <div className="text-center">
                  {person.rateCards && person.rateCards.length > 0 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAction('rate-card', person.id);
                      }}
                    >
                      View
                    </Button>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </div>
              </td>
              
              {/* Availability */}
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBadgeColor(person.availabilityStatus)}`}
                >
                  {person.availabilityStatus}
                </span>
              </td>
              
              {/* Location */}
              <td className="py-3 px-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {person.location ? (
                    typeof person.location === 'string' ? person.location : 
                    `${person.location.city || ''}, ${person.location.country || ''}`.replace(/^,\s*|,\s*$/g, '')
                  ) : '-'}
                </div>
              </td>
              
              {/* Assigned To */}
              <td className="py-3 px-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {person.assignedTo || '-'}
                </div>
              </td>
              
              {/* Status */}
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(person.status)}`}
                >
                  {person.status}
                </span>
              </td>
              
              {/* Last Activity */}
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(person.lastActivity || person.updatedAt)}
                </div>
              </td>
              
              {/* Actions */}
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickAction('message', person.id)}
                    title="Message"
                  >
                    <PaperPlaneIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickAction('add-to-campaign', person.id)}
                    title="Add to Campaign"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickAction('view-profile', person.id)}
                    title="View Profile"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickAction('more', person.id)}
                    title="More Actions"
                  >
                    <MoreDotIcon className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Table Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {people.length} of {people.length} people
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PeopleTable;