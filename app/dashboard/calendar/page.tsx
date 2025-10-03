'use client'
import CalendarView from "@/app/components/dashboard/CalendarView";
import ScheduleEvent from "@/app/components/dashboard/Schedule";
import ScheduleSummary from "@/app/components/dashboard/ScheduleSummary";
import { AddEventModal } from "@/app/components/dashboard/AddEvent";
import { Clock, Plus } from "lucide-react";
import React, { useState } from "react";

interface EventFormValues {
  title: string;
  category: 'quality-inspection' | 'delivery' | 'crop-harvest' | '';
  date: string;
  time: string;
  location: string;
  notes: string;
}

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<EventFormValues[]>([]);

  const handleAddEvent = (values: EventFormValues) => {
    console.log('New event added:', values);
    // Add the new event to your events array
    setEvents(prev => [...prev, values]);
    
    // Here you would typically make an API call to save the event
    // Example: await createEvent(values);
    
    // Optionally show a success message
    // toast.success('Event added successfully!');
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
            1 event
          </span>
        </div>
        <div className="mt-6">
          <ScheduleEvent 
            title="Farm Inspection" 
            time="10:00 AM" 
            location="Main Farm" 
            status="upcoming" 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 mt-5 gap-4">
        <div className="col-span-2">
          <CalendarView/>
        </div>
        <div className="col-span-1">
          <ScheduleSummary/>
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
      />
    </div>
  );
}