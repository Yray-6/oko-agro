'use client'
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent, EventDetails } from '@/app/types';
import ScheduleEvent from './Schedule'; // Import the actual ScheduleEvent component

interface CalendarViewProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent | EventDetails) => void;
  allEvents?: EventDetails[]; // Pass original events for lookup
}

const CalendarView: React.FC<CalendarViewProps> = ({ events = [], onEventClick, allEvents = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // Get upcoming events (events with date >= today)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // Reset time to start of day
      // Show events that are today or in the future
      return eventDate >= today;
    }).sort((a, b) => {
      // Sort by date ascending
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  // Get events for the current month (for calendar display)
  const monthEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  }, [events, currentDate]);

  const hasEvent = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthEvents.find(event => event.date === dateStr);
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-mainGreen text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month's trailing days
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${prevMonthDays - i}`} className="p-3 text-gray-400 text-sm">
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const event = hasEvent(day);
      const today = new Date();
      const isToday = day === today.getDate() && 
                      currentDate.getMonth() === today.getMonth() && 
                      currentDate.getFullYear() === today.getFullYear();
      
      const handleDayClick = () => {
        if (event && onEventClick) {
          // Try to find the original event from allEvents if available
          const originalEvent = allEvents.find(e => e.id === event.id);
          if (originalEvent) {
            onEventClick(originalEvent);
          } else {
            onEventClick(event);
          }
        }
      };
      
      days.push(
        <div 
          key={day} 
          className={`p-3 text-sm hover:bg-gray-50 relative ${event && onEventClick ? 'cursor-pointer' : ''}`}
          onClick={event && onEventClick ? handleDayClick : undefined}
        >
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
            event ? getEventColor(event.status) : ''
          } ${isToday && !event ? 'bg-gray-200 font-semibold' : ''}`}>
            {day}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="p-3 text-gray-400 text-sm">
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Calendar View</h1>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h2 className="text-base font-medium text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-sm font-medium text-mainGreen">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Upcoming Events
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => {
                // Always create handleViewDetails if onEventClick is provided
                const handleViewDetails = onEventClick ? () => {
                  // Try to find the original event from allEvents if available
                  const originalEvent = allEvents.find(e => e.id === event.id);
                  if (originalEvent) {
                    onEventClick(originalEvent);
                  } else {
                    onEventClick(event);
                  }
                } : undefined;
                
                return (
                  <ScheduleEvent
                    key={event.id}
                    title={event.title}
                    location={event.location}
                    status={event.status}
                    onViewDetails={handleViewDetails}
                  />
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">
                No upcoming events scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;