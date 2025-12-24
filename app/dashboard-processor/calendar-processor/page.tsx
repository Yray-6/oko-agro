'use client'
import CalendarViewProcessor from "@/app/components/dashboad-processor/CalendarViewProcessor";
import ScheduleEvent from "@/app/components/dashboard/Schedule";
import ScheduleSummary from "@/app/components/dashboard/ScheduleSummary";
import { AddEventModal } from "@/app/components/dashboard/AddEvent";
import { EventDetailsModal } from "@/app/components/dashboard/EventDetailsModal";
import { Clock, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useEventStore } from '@/app/store/useEventStore';
import { useDataStore } from '@/app/store/useDataStore';
import { CalendarEvent, EventDetails } from "@/app/types";
import { countEventsByCategory, getTodaysEvents, transformEventToCalendarEvent } from "@/app/helpers";


// Get user ID from auth storage
const getUserId = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    
    const authData = JSON.parse(authStorage);
    return authData?.state?.user?.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<CalendarEvent[]>([]);
  
  const { events, fetchUserEvents, fetchEvent, isFetching } = useEventStore();
  const { crops, fetchCrops } = useDataStore();

  // Fetch events and crops on component mount
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchUserEvents(userId);
    }
    if (crops.length === 0) {
      fetchCrops().catch(console.error);
    }
  }, [fetchUserEvents, fetchCrops, crops.length]);

  // Transform API events to calendar events when they change
  useEffect(() => {
    if (events.length > 0) {
      const transformed = events.map(transformEventToCalendarEvent);
      setCalendarEvents(transformed);
      setTodaysEvents(getTodaysEvents(transformed));
    }
  }, [events]);

  // Handle successful event creation
  const handleEventSuccess = () => {
    const userId = getUserId();
    if (userId) {
      fetchUserEvents(userId); // Refresh events list
    }
  };

  // Handle event click
  const handleEventClick = async (event: EventDetails) => {
    try {
      const eventDetails = await fetchEvent(event.id);
      setSelectedEvent(eventDetails);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      // Fallback: use the event passed in
      setSelectedEvent(event);
      setIsDetailsModalOpen(true);
    }
  };

  // Calculate summary data
  const upcomingEvents = calendarEvents.filter(e => e.status === 'upcoming').length;
  const todaysCount = todaysEvents.length;
  const categoryCounts = countEventsByCategory(calendarEvents);

  const summaryData = {
    upcoming: upcomingEvents,
    today: todaysCount,
    inspections: categoryCounts.inspections,
    deliveries: categoryCounts.deliveries,
    harvests: categoryCounts.harvests
  };

  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Schedule & Calendar</p>
          <p className="text-sm text-gray-600">
            Manage your farming activities
          </p>
        </div>
        <div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white bg-mainGreen hover:bg-mainGreen/90 transition-colors"
          >
            <Plus color="white" size={16} />
            Add Event
          </button>
        </div>
      </div>

      <div className="border border-mainGreen/20 rounded-lg p-5">
        <div className="flex items-center gap-2">
          <Clock size={17}/> Today&apos;s Schedule 
          <span className="text-mainGreen bg-mainGreen/20 rounded-full text-xs px-2 py-1 font-medium">
            {todaysCount} {todaysCount === 1 ? 'event' : 'events'}
          </span>
        </div>
        <div className="mt-6">
          {isFetching ? (
            <div className="text-center py-4 text-gray-500">Loading events...</div>
          ) : todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map(event => {
                const apiEvent = events.find(e => e.id === event.id);
                return (
                  <ScheduleEvent 
                    key={event.id}
                    title={event.title}
                    time={event.time}
                    location={event.location}
                    status={event.status}
                    onClick={apiEvent ? () => handleEventClick(apiEvent) : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No events scheduled for today
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 mt-5 gap-4">
        <div className="col-span-2">
          <CalendarViewProcessor events={events} onEventClick={handleEventClick} />
        </div>
        <div className="col-span-1">
          <ScheduleSummary data={summaryData} />
        </div>
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEventSuccess}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        crops={crops}
      />
    </div>
  );
}