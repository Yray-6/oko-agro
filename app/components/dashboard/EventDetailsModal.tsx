'use client'
import React from 'react';
import { X, Calendar, FileText, Package, MapPin, Clock, User, Mail, Phone } from 'lucide-react';
import { EventDetails } from '@/app/types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetails | null;
  crops?: Array<{ id: string; name: string }>;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  crops = []
}) => {
  if (!isOpen || !event) return null;

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const getStatusBadge = (status?: string) => {
    const statusLower = (status || 'upcoming').toLowerCase();
    switch (statusLower) {
      case 'upcoming':
        return 'bg-mainGreen/10 text-mainGreen border border-mainGreen/20';
      case 'in-progress':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-600 border border-green-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const getReferenceTypeLabel = (type: string) => {
    switch (type) {
      case 'custom':
        return 'Custom Event';
      case 'product':
        return 'Product Related';
      case 'order':
        return 'Order Related';
      default:
        return type;
    }
  };

  // Get crop name - check for crop object first (from API), then cropId
  const cropName = (() => {
    // Check if event has crop object (from API response)
    if ('crop' in event && event.crop && typeof event.crop === 'object' && 'name' in event.crop) {
      return (event.crop as { name: string }).name;
    }
    // Fallback to cropId lookup
    if (event.cropId && crops.length > 0) {
      return crops.find(c => c.id === event.cropId)?.name || null;
    }
    return null;
  })();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Event Title and Status */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>
              </div>
              {event.description && (
                <p className="text-gray-600 mt-2">{event.description}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-mainGreen/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-mainGreen" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{formattedTime}</p>
                </div>
              </div>
            </div>

         

            {/* Harvest Event Details */}
            {event.isHarvestEvent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Harvest Event Details</h4>
                </div>
                <div className="space-y-3">
                  {cropName && (
                    <div>
                      <p className="text-sm text-gray-600">Crop Type</p>
                      <p className="font-medium text-gray-900">{cropName}</p>
                    </div>
                  )}
                  {event.cropQuantity && (
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium text-gray-900">
                        {event.cropQuantity} {event.cropQuantityUnit || ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Owner/Farmer Details */}
            {event.owner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Owner/Farmer Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-medium text-gray-900">
                      {event.owner.firstName} {event.owner.lastName}
                    </p>
                    {event.owner.role && (
                      <p className="text-xs text-gray-500 mt-1 capitalize">{event.owner.role}</p>
                    )}
                  </div>
                  
                  {event.owner.email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 text-sm">{event.owner.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.owner.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900">{event.owner.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.owner.farmName && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Farm Name</p>
                      <p className="font-medium text-gray-900">{event.owner.farmName}</p>
                    </div>
                  )}
                  
                  {event.owner.farmAddress && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Farm Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="font-medium text-gray-900">{event.owner.farmAddress}</p>
                      </div>
                    </div>
                  )}
                  
                  {(event.owner.state || event.owner.country) && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <p className="font-medium text-gray-900">
                        {event.owner.state && `${event.owner.state}`}
                        {event.owner.state && event.owner.country && ', '}
                        {event.owner.country || 'Nigeria'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 mb-2">Event ID</p>
              <p className="text-xs font-mono text-gray-400">{event.id}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

