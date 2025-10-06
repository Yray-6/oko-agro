'use client'
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useEventStore, CreateEventRequest } from '@/app/store/useEventStore';

interface EventFormValues {
  title: string;
  category: 'quality-inspection' | 'delivery' | 'crop-harvest' | '';
  date: string;
  notes: string;
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
    title: '',
    category: '',
    date: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventFormValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EventFormValues, boolean>>>({});

  const { createEvent, isCreating } = useEventStore();

  const categories = [
    { value: 'quality-inspection', label: 'Quality Inspection' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'crop-harvest', label: 'Crop Harvest' }
  ];

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
        title: '',
        category: '',
        date: '',
        notes: ''
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const validateField = (name: keyof EventFormValues, value: string) => {
    switch (name) {
      case 'title':
        return value.trim() ? '' : 'Event title is required';
      case 'category':
        return value ? '' : 'Please select a category';
      case 'date':
        return value ? '' : 'Event date is required';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    const error = validateField(name, formValues[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCategorySelect = (value: string) => {
    setFormValues(prev => ({ ...prev, category: value as EventFormValues['category'] }));
    setTouched(prev => ({ ...prev, category: true }));
    const error = validateField('category', value);
    setErrors(prev => ({ ...prev, category: error }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof EventFormValues, string>> = {};
    (Object.keys(formValues) as Array<keyof EventFormValues>).forEach(key => {
      if (key !== 'notes') {
        const error = validateField(key, formValues[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  // Map form values to API request format
  const mapFormToApiRequest = (values: EventFormValues): CreateEventRequest => {
    // Convert date to ISO 8601 format
    const eventDate = new Date(values.date).toISOString();
    
    // Map category to referenceType
    // const referenceTypeMap: Record<string, 'custom' | 'product' | 'order'> = {
    //   'quality-inspection': 'custom',
    //   'delivery': 'order',
    //   'crop-harvest': 'product'
    // };

    return {
      name: values.title,
      description: values.notes || `${values.category}`,
      referenceType: 'custom',
      referenceId: null,
      eventDate: eventDate // ISO 8601 format: 2025-10-01T00:00:00.000Z
    };
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    setTouched({
      title: true,
      category: true,
      date: true,
      notes: true
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
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  onBlur={() => handleBlur('title')}
                  placeholder="Enter event title"
                  disabled={isCreating}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.title && touched.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategorySelect(cat.value)}
                      disabled={isCreating}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        formValues.category === cat.value
                          ? 'border-mainGreen bg-green-50 text-mainGreen'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {errors.category && touched.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add note (optional)
                </label>
                <textarea
                  name="notes"
                  value={formValues.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add any extra information regarding the schedule..."
                  disabled={isCreating}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
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