import { useState, useMemo } from "react";
import { Campaign, Deliverable, formatCurrency } from "../../types/campaign";
import { ChevronLeftIcon, ChevronUpIcon, CalenderIcon, DollarLineIcon } from "../../icons";

interface CalendarViewProps {
  campaigns: Campaign[];
  onCampaignClick: (campaign: Campaign) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'campaign_start' | 'campaign_end' | 'deliverable';
  campaign: Campaign;
  deliverable?: Deliverable;
  color: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ campaigns, onCampaignClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Generate calendar events from campaigns
  const events = useMemo(() => {
    const eventList: CalendarEvent[] = [];

    campaigns.forEach((campaign) => {
      // Campaign start event
      eventList.push({
        id: `${campaign.id}-start`,
        title: `${campaign.name} (Start)`,
        date: new Date(campaign.startDate),
        type: 'campaign_start',
        campaign,
        color: 'bg-green-500'
      });

      // Campaign end event
      eventList.push({
        id: `${campaign.id}-end`,
        title: `${campaign.name} (End)`,
        date: new Date(campaign.endDate),
        type: 'campaign_end',
        campaign,
        color: 'bg-red-500'
      });

      // Deliverable events
      campaign.deliverables.forEach((deliverable) => {
        if (deliverable.deadline) {
          eventList.push({
            id: `${campaign.id}-${deliverable.id}`,
            title: `${deliverable.type} - ${campaign.name}`,
            date: new Date(deliverable.deadline),
            type: 'deliverable',
            campaign,
            deliverable,
            color: deliverable.status === 'Approved' ? 'bg-blue-500' : 
                   deliverable.status === 'Submitted' ? 'bg-yellow-500' : 'bg-gray-500'
          });
        }
      });
    });

    return eventList.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [campaigns]);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const EventCard = ({ event }: { event: CalendarEvent }) => (
    <div
      onClick={() => onCampaignClick(event.campaign)}
      className={`${event.color} text-white text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity truncate`}
      title={event.title}
    >
      {event.type === 'deliverable' ? (
        <span>📋 {event.deliverable?.type}</span>
      ) : event.type === 'campaign_start' ? (
        <span>🚀 {event.campaign.name}</span>
      ) : (
        <span>🏁 {event.campaign.name}</span>
      )}
    </div>
  );

  const calendarDays = getCalendarDays();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 rotate-90" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Today
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Legend */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Start</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">End</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Deliverable</span>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {DAYS.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 min-h-[120px] p-2 ${
                  !isCurrentMonthDay ? 'opacity-40' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isTodayDate 
                    ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Events
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {events
            .filter(event => event.date >= new Date())
            .slice(0, 10)
            .map((event) => (
              <div
                key={event.id}
                onClick={() => onCampaignClick(event.campaign)}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-3 h-3 ${event.color} rounded-full flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {event.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <CalenderIcon className="w-3 h-3" />
                    <span>{event.date.toLocaleDateString()}</span>
                    <DollarLineIcon className="w-3 h-3" />
                    <span>{formatCurrency(event.campaign.financials.budgetTotal, event.campaign.financials.currency)}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}