'use client'
import React, { useState, useEffect } from 'react';
import CalendarView from '@/app/components/dashboard/CalendarView';
import { EventDetailsModal } from '@/app/components/dashboard/EventDetailsModal';
import { useEventStore } from '@/app/store/useEventStore';
import { useDataStore } from '@/app/store/useDataStore';
import { CalendarEvent, EventDetails } from '@/app/types';
import { transformEventToCalendarEvent } from '@/app/helpers';
import { Calendar, Clock, Package, User, MapPin } from 'lucide-react';

export default function AdminEventsPage() {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  const { events, fetchAllEvents, fetchEvent, isFetching } = useEventStore();
  const { crops, fetchCrops } = useDataStore();

  // Fetch all events and crops on component mount
  useEffect(() => {
    fetchAllEvents().catch(console.error);
    if (crops.length === 0) {
      fetchCrops().catch(console.error);
    }
  }, [fetchAllEvents, fetchCrops, crops.length]);

  // Transform API events to calendar events when they change
  useEffect(() => {
    if (events.length > 0) {
      const transformed = events.map(transformEventToCalendarEvent);
      setCalendarEvents(transformed);
    }
  }, [events]);

  // Handle event click
  const handleEventClick = async (event: CalendarEvent | EventDetails) => {
    try {
      // If it's already an EventDetails, use it directly
      if ('eventDate' in event && 'referenceType' in event) {
        const eventDetails = await fetchEvent(event.id);
        setSelectedEvent(eventDetails);
        setIsDetailsModalOpen(true);
      } else {
        // If it's a CalendarEvent, find the corresponding EventDetails
        const apiEvent = events.find(e => e.id === event.id);
        if (apiEvent) {
          const eventDetails = await fetchEvent(apiEvent.id);
          setSelectedEvent(eventDetails);
          setIsDetailsModalOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      // Fallback: try to find event in current list
      const apiEvent = events.find(e => e.id === event.id);
      if (apiEvent) {
        setSelectedEvent(apiEvent);
        setIsDetailsModalOpen(true);
      }
    }
  };


  // Get crop name helper
  const getCropName = (event: EventDetails): string | null => {
    if (event.cropId && crops.length > 0) {
      return crops.find(c => c.id === event.cropId)?.name || null;
    }
    // Check if event has crop object (from API response)
    if ('crop' in event && event.crop && typeof event.crop === 'object' && 'name' in event.crop) {
      return (event.crop as { name: string }).name;
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Events Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          View and manage all events across the platform
        </p>
      </div>

      {/* Calendar View */}
      <div className="mb-8">
        <CalendarView 
          events={calendarEvents} 
          onEventClick={(event) => {
            const apiEvent = events.find(e => e.id === event.id);
            if (apiEvent) {
              handleEventClick(apiEvent);
            }
          }} 
        />
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Events ({events.length})
          </h2>
        </div>

        {isFetching ? (
          <div className="text-center py-8 text-gray-500">Loading events...</div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => {
              const eventDate = new Date(event.eventDate);
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              const formattedTime = eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              const cropName = getCropName(event);

              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                      {event.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'upcoming' 
                        ? 'bg-mainGreen/10 text-mainGreen border border-mainGreen/20'
                        : event.status === 'in-progress'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-green-50 text-green-600 border border-green-200'
                    }`}>
                      {event.status || 'upcoming'}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formattedTime}</span>
                    </div>
                    {event.isHarvestEvent && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Package className="w-4 h-4" />
                        <span>
                          {cropName && `${cropName} - `}
                          {event.cropQuantity} {event.cropQuantityUnit || ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Owner/Farmer Details */}
                  {event.owner && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-700 mb-2">Owner Details</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span>
                            {event.owner.firstName} {event.owner.lastName}
                            {event.owner.role && ` (${event.owner.role})`}
                          </span>
                        </div>
                        {event.owner.farmName && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{event.owner.farmName}</span>
                          </div>
                        )}
                        {event.owner.state && (
                          <div className="text-xs text-gray-500 pl-5">
                            {event.owner.state}, {event.owner.country || 'Nigeria'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

               
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No events found
          </div>
        )}
      </div>

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

