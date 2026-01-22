'use client'
import React, { useState, useEffect, useMemo } from 'react';
import CalendarView from '@/app/components/dashboard/CalendarView';
import { EventDetailsModal } from '@/app/components/dashboard/EventDetailsModal';
import { useEventStore } from '@/app/store/useEventStore';
import { useDataStore } from '@/app/store/useDataStore';
import { CalendarEvent, EventDetails } from '@/app/types';
import { transformEventToCalendarEvent } from '@/app/helpers';
import { Calendar, Clock, Package, User, MapPin, Download, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminEventsPage() {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  
  const { events, fetchAllEvents, isFetching } = useEventStore();
  const { crops, fetchCrops } = useDataStore();

  // Fetch all events and crops on component mount
  useEffect(() => {
    fetchAllEvents().catch(console.error);
    if (crops.length === 0) {
      fetchCrops().catch(console.error);
    }
  }, [fetchAllEvents, fetchCrops, crops.length]);

  // Get crop name helper
  const getCropName = useMemo(() => {
    return (event: EventDetails): string | null => {
      if (event.cropId && crops.length > 0) {
        return crops.find(c => c.id === event.cropId)?.name || null;
      }
      // Check if event has crop object (from API response)
      if ('crop' in event && event.crop && typeof event.crop === 'object' && 'name' in event.crop) {
        return (event.crop as { name: string }).name;
      }
      return null;
    };
  }, [crops]);

  // Filter and sort events by date (earliest to latest)
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];
    
    // Filter by crop if selected
    if (selectedCropFilter !== 'all') {
      filtered = filtered.filter(event => {
        const cropName = getCropName(event);
        return cropName && crops.find(c => c.id === selectedCropFilter)?.name === cropName;
      });
    }
    
    // Sort by date (earliest to latest)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.eventDate).getTime();
      const dateB = new Date(b.eventDate).getTime();
      return dateA - dateB; // Ascending order (earliest first)
    });
  }, [events, selectedCropFilter, crops, getCropName]);

  // Transform API events to calendar events when they change
  useEffect(() => {
    if (filteredAndSortedEvents.length > 0) {
      const transformed = filteredAndSortedEvents.map(transformEventToCalendarEvent);
      setCalendarEvents(transformed);
    } else {
      setCalendarEvents([]);
    }
  }, [filteredAndSortedEvents]);

  // Handle event click - use already fetched events instead of calling API
  const handleEventClick = (event: CalendarEvent | EventDetails) => {
    // If it's already an EventDetails, use it directly
    if ('eventDate' in event && 'referenceType' in event) {
      setSelectedEvent(event as EventDetails);
      setIsDetailsModalOpen(true);
    } else {
      // If it's a CalendarEvent, find the corresponding EventDetails from already fetched events
      const apiEvent = filteredAndSortedEvents.find(e => e.id === event.id);
      if (apiEvent) {
        setSelectedEvent(apiEvent);
        setIsDetailsModalOpen(true);
      }
    }
  };

  // Export events to Excel
  const handleExportToExcel = () => {
    const exportData = filteredAndSortedEvents.map(event => {
      const eventDate = new Date(event.eventDate);
      const cropName = getCropName(event);
      
      return {
        'Event Name': event.name,
        'Description': event.description || '',
        'Event Date': eventDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        'Event Time': eventDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        'Status': event.status || 'upcoming',
        'Is Harvest Event': event.isHarvestEvent ? 'Yes' : 'No',
        'Crop Type': cropName || '',
        'Crop Quantity': event.cropQuantity || '',
        'Crop Quantity Unit': event.cropQuantityUnit || '',
        'Owner Name': event.owner ? `${event.owner.firstName} ${event.owner.lastName}` : '',
        'Owner Role': event.owner?.role || '',
        'Farm Name': event.owner?.farmName || '',
        'Location': event.owner ? `${event.owner.state || ''}, ${event.owner.country || 'Nigeria'}`.replace(/^,\s*|,\s*$/g, '') : '',
        'Farm Address': event.owner?.farmAddress || '',
      };
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Events');

    // Generate filename with current date
    const dateStr = new Date().toISOString().split('T')[0];
    const cropFilter = selectedCropFilter !== 'all' 
      ? `_${crops.find(c => c.id === selectedCropFilter)?.name || 'filtered'}` 
      : '';
    const filename = `events_export${cropFilter}_${dateStr}.xlsx`;

    // Write and download
    XLSX.writeFile(wb, filename);
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
            const apiEvent = filteredAndSortedEvents.find(e => e.id === event.id);
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
            All Events ({filteredAndSortedEvents.length})
          </h2>
          <div className="flex items-center gap-3">
            {/* Crop Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent"
              >
                <option value="all">All Crops</option>
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Export Button */}
            <button
              onClick={handleExportToExcel}
              disabled={filteredAndSortedEvents.length === 0 || isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
        </div>

        {isFetching ? (
          <div className="text-center py-8 text-gray-500">Loading events...</div>
        ) : filteredAndSortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedEvents.map((event) => {
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

