import React from "react";
import { Person } from "../../types/person";

import { MailIcon, MoreDotIcon, PencilIcon } from "../../icons";

interface PeopleGridProps {
  people: Person[];
  selectedPeople: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onPersonClick: (person: Person) => void;
  onQuickAction?: (action: string, personIds: string[]) => void;
}

const PeopleGrid: React.FC<PeopleGridProps> = ({
  people,
  selectedPeople,
  onSelectionChange,
  onPersonClick,
  onQuickAction,
}) => {
  const handleCardClick = (person: Person, event: React.MouseEvent) => {
    // Don't trigger if clicking on checkbox or action buttons
    if ((event.target as HTMLElement).closest('input, button')) {
      return;
    }
    onPersonClick(person);
  };

  const handleCheckboxChange = (personId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPeople, personId]);
    } else {
      onSelectionChange(selectedPeople.filter(id => id !== personId));
    }
  };

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'busy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'partially_available':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (people.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <MailIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No people found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {people.map((person) => (
        <div
          key={person.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={(e) => handleCardClick(person, e)}
        >
          {/* Header with checkbox and actions */}
          <div className="flex items-start justify-between mb-4">
            <input
              type="checkbox"
              checked={selectedPeople.includes(person.id)}
              onChange={(e) => handleCheckboxChange(person.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex items-center gap-1">
              <button
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onPersonClick(person);
                }}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAction?.('more', [person.id]);
                }}
              >
                <MoreDotIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Avatar and Name */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                {person.fullName.charAt(0)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {person.fullName}
            </h3>
            {person.handle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">@{person.handle}</p>
            )}
          </div>

          {/* Roles */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {person.roles.slice(0, 2).map((role, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {role}
                </span>
              ))}
              {person.roles.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{person.roles.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2 text-center">
              {person.platformMetrics.instagram && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-2 rounded">
                  <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">Instagram</p>
                  <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                    {formatFollowerCount(person.platformMetrics.instagram.followers)}
                  </p>
                </div>
              )}
              {person.platformMetrics.youtube && (
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded">
                  <p className="text-xs text-red-600 dark:text-red-300 font-medium">YouTube</p>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    {formatFollowerCount(person.platformMetrics.youtube.subscribers)}
                  </p>
                </div>
              )}
              {person.platformMetrics.tiktok && (
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">TikTok</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {formatFollowerCount(person.platformMetrics.tiktok.followers)}
                  </p>
                </div>
              )}
              {person.platformMetrics.linkedin && (
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                  <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">LinkedIn</p>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    {formatFollowerCount(person.platformMetrics.linkedin.connections)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status and Availability */}
          <div className="flex justify-between items-center mb-4">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(person.status)}`}>
              {person.status}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(person.availabilityStatus)}`}>
              {person.availabilityStatus.replace('_', ' ')}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MailIcon className="w-4 h-4" />
              <span className="truncate">{person.primaryEmail}</span>
            </div>
            {person.primaryPhone && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MailIcon className="w-4 h-4" />
                <span className="truncate">{person.primaryPhone}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {person.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                {person.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {person.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                    +{person.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PeopleGrid;