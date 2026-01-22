'use client'
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useEventStore, CreateEventRequest } from '@/app/store/useEventStore';
import { useDataStore } from '@/app/store/useDataStore';

interface EventFormValues {
  name: string;
  description: string;
  date: string;
  cropId: string;
  cropQuantity: string;
  cropQuantityUnit: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formValues, setFormValues] = useState<EventFormValues>({
    name: '',
    description: '',
    date: '',
    cropId: '',
    cropQuantity: '',
    cropQuantityUnit: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventFormValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EventFormValues, boolean>>>({});

  const { createEvent, isCreating } = useEventStore();
  const { crops, fetchCrops, cropsLoading } = useDataStore();

  // Fetch crops when modal opens
  useEffect(() => {
    if (isOpen && crops.length === 0) {
      fetchCrops().catch(console.error);
    }
  }, [isOpen, crops.length, fetchCrops]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isCreating) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isCreating, onClose]);

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        name: '',
        description: '',
        date: '',
        cropId: '',
        cropQuantity: '',
        cropQuantityUnit: ''
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const quantityUnits = [
    { value: 'tonne', label: 'Tonne' },
    { value: 'kilogram', label: 'Kilogram (kg)' },
  ];

  const validateField = (name: keyof EventFormValues, value: string | boolean) => {
    switch (name) {
      case 'name':
        return typeof value === 'string' && value.trim() ? '' : 'Event name is required';
      case 'description':
        return ''; // Description is optional
      case 'date':
        return typeof value === 'string' && value ? '' : 'Event date is required';
      case 'cropId':
        return !value ? 'Crop selection is required' : '';
      case 'cropQuantity':
        return !value ? 'Crop quantity is required' : '';
      case 'cropQuantityUnit':
        return !value ? 'Quantity unit is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof EventFormValues]) {
      const error = validateField(name as keyof EventFormValues, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof EventFormValues) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldValue = formValues[name];
    const error = validateField(name, fieldValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof EventFormValues, string>> = {};
    (Object.keys(formValues) as Array<keyof EventFormValues>).forEach(key => {
      if (key !== 'description') {
        const fieldValue = formValues[key];
        const error = validateField(key, fieldValue);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  // Map form values to API request format
  const mapFormToApiRequest = (values: EventFormValues): CreateEventRequest => {
    return {
      name: values.name,
      description: values.description || undefined,
      referenceType: 'custom', // Always custom for harvest events
      referenceId: values.cropId || undefined,
      eventDate: values.date, // YYYY-MM-DD format
      isHarvestEvent: true, // Always true
      cropId: values.cropId || undefined,
      cropQuantity: values.cropQuantity || undefined,
      cropQuantityUnit: values.cropQuantityUnit || undefined,
    };
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    setTouched({
      name: true,
      description: true,
      date: true,
      cropId: true,
      cropQuantity: true,
      cropQuantityUnit: true
    });

    if (Object.keys(newErrors).length === 0) {
      try {
        const apiRequest = mapFormToApiRequest(formValues);
        await createEvent(apiRequest);
        
        console.log('Event created successfully:', formValues);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Close modal
        onClose();
      } catch (error) {
        console.error('Failed to create event:', error);
        // Error is already handled in the store with toast
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={!isCreating ? onClose : undefined}
      />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add New Event</h2>
            <button
              onClick={onClose}
              disabled={isCreating}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  placeholder="Enter event name"
                  disabled={isCreating}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add event description..."
                  disabled={isCreating}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formValues.date}
                  onChange={handleChange}
                  onBlur={() => handleBlur('date')}
                  disabled={isCreating}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.date && touched.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>

              {/* Info about harvest events */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> All events are harvest events and are visible to processors, helping them discover your available crops for purchase.
                </p>
              </div>

              {/* Crop Fields - Always shown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="cropId"
                  value={formValues.cropId}
                  onChange={handleChange}
                  onBlur={() => handleBlur('cropId')}
                  disabled={isCreating || cropsLoading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select crop type</option>
                  {cropsLoading ? (
                    <option value="" disabled>Loading crops...</option>
                  ) : (
                    crops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.cropId && touched.cropId && (
                  <p className="text-red-500 text-xs mt-1">{errors.cropId}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="cropQuantity"
                    value={formValues.cropQuantity}
                    onChange={handleChange}
                    onBlur={() => handleBlur('cropQuantity')}
                    placeholder="200"
                    min="0"
                    step="0.01"
                    disabled={isCreating}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.cropQuantity && touched.cropQuantity && (
                    <p className="text-red-500 text-xs mt-1">{errors.cropQuantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cropQuantityUnit"
                    value={formValues.cropQuantityUnit}
                    onChange={handleChange}
                    onBlur={() => handleBlur('cropQuantityUnit')}
                    disabled={isCreating}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select unit</option>
                    {quantityUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.cropQuantityUnit && touched.cropQuantityUnit && (
                    <p className="text-red-500 text-xs mt-1">{errors.cropQuantityUnit}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isCreating}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isCreating}
                className="flex-1 px-6 py-3 bg-mainGreen text-white rounded-md hover:bg-mainGreen focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};