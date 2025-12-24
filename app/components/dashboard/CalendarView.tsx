'use client'
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { CalendarEvent } from '@/app/types';

interface ScheduleEventProps {
  title: string;
  time: string;
  location: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  className?: string;
  onClick?: () => void;
}

const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  title,
  time,
  location,
  status,
  className = '',
  onClick
}) => {
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          border: 'border-transparent',
          badge: 'bg-mainGreen/10 text-mainGreen border border-mainGreen/10'
        };
      case 'in-progress':
        return {
          border: 'border-blue-400',
          badge: 'bg-blue-50 text-blue-600 border border-blue-200'
        };
      case 'completed':
        return {
          border: 'border-green-400',
          badge: 'bg-green-50 text-green-600 border border-green-200'
        };
      default:
        return {
          border: 'border-gray-400',
          badge: 'bg-gray-50 text-gray-600 border border-gray-200'
        };
    }
  };

  const colors = getStatusColors(status);

  return (
    <div 
      className={`bg-white border-l-4 border-red rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`w-1 h-12 rounded-full ${colors.border.replace('border-', 'bg-')}`}></div>
        
        <div className="flex-1 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-base mb-1">{title}</h3>
            
            <div className="flex items-center gap-4 text-xs text-[#6A7C6A]">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

interface CalendarViewProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events = [], onEventClick }) => {
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

  // Get events for the current month
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
      
      days.push(
        <div key={day} className="p-3 text-sm hover:bg-gray-50 cursor-pointer relative">
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
            Events for {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </h3>
          
          <div className="space-y-3">
            {monthEvents.length > 0 ? (
              monthEvents.map(event => (
                <ScheduleEvent
                  key={event.id}
                  title={event.title}
                  time={event.time}
                  location={event.location}
                  status={event.status}
                  onClick={onEventClick ? () => onEventClick(event) : undefined}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No events scheduled for this month
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;