import { useState, useRef } from "react";
import { Campaign, formatCurrency } from "../../types/campaign";
import { CalenderIcon, DollarLineIcon, UserIcon, HorizontaLDots } from "../../icons";

interface KanbanViewProps {
  campaigns: Campaign[];
  onCampaignClick: (campaign: Campaign) => void;
  onCampaignUpdate?: (campaignId: string, newStatus: string) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'planning', title: 'Planning', status: 'Planning', color: 'bg-gray-100 border-gray-300' },
  { id: 'active', title: 'Active', status: 'Active', color: 'bg-blue-100 border-blue-300' },
  { id: 'review', title: 'In Review', status: 'In Review', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'completed', title: 'Completed', status: 'Completed', color: 'bg-green-100 border-green-300' },
  { id: 'paused', title: 'Paused', status: 'Paused', color: 'bg-orange-100 border-orange-300' },
];

export default function KanbanView({ campaigns, onCampaignClick, onCampaignUpdate }: KanbanViewProps) {
  const [draggedCampaign, setDraggedCampaign] = useState<Campaign | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const getCampaignsByStatus = (status: string) => {
    return campaigns.filter(campaign => campaign.status === status);
  };

  const handleDragStart = (e: React.DragEvent, campaign: Campaign) => {
    setDraggedCampaign(campaign);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', campaign.id);
  };

  const handleDragEnd = () => {
    setDraggedCampaign(null);
    setDragOverColumn(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (_e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverColumn(null);

    if (draggedCampaign && draggedCampaign.status !== columnStatus) {
      onCampaignUpdate?.(draggedCampaign.id, columnStatus);
    }
    setDraggedCampaign(null);
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, campaign)}
      onDragEnd={handleDragEnd}
      onClick={() => onCampaignClick(campaign)}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 ${
        draggedCampaign?.id === campaign.id ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      {/* Campaign Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {campaign.clientLogo && (
            <img 
              src={campaign.clientLogo} 
              alt={campaign.clientName}
              className="w-8 h-8 rounded object-cover"
            />
          )}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
              {campaign.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {campaign.clientName}
            </p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <HorizontaLDots className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Campaign Type & Platforms */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
          {campaign.type}
        </span>
        <div className="flex space-x-1">
          {campaign.platforms.slice(0, 2).map((platform) => (
            <span 
              key={platform}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
            >
              {platform}
            </span>
          ))}
          {campaign.platforms.length > 2 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
              +{campaign.platforms.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <UserIcon className="w-3 h-3" />
            <span>{campaign.teamMembers.length} members</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <span>{campaign.influencers.length} influencers</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <CalenderIcon className="w-3 h-3" />
            <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-900 dark:text-white font-medium">
            <DollarLineIcon className="w-3 h-3" />
            <span>{formatCurrency(campaign.financials.budgetTotal, campaign.financials.currency)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
        <div 
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, (campaign.deliverables.filter(d => d.status === 'Approved').length / Math.max(1, campaign.deliverables.length)) * 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {campaign.deliverables.filter(d => d.status === 'Approved').length}/{campaign.deliverables.length} deliverables completed
      </div>
    </div>
  );

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {KANBAN_COLUMNS.map((column) => {
        const columnCampaigns = getCampaignsByStatus(column.status);
        const isDropTarget = dragOverColumn === column.id;
        
        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-80 ${column.color} rounded-lg border-2 border-dashed transition-all duration-200 ${
              isDropTarget ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {columnCampaigns.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-4 min-h-[500px]">
              {columnCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 text-sm">
                    No campaigns in {column.title.toLowerCase()}
                  </div>
                  {dragOverColumn === column.id && (
                    <div className="mt-2 text-blue-500 text-sm font-medium">
                      Drop campaign here
                    </div>
                  )}
                </div>
              ) : (
                columnCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}