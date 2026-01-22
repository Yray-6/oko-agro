import { CalendarEvent, EventDetails } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imageLoader = ({src}:any) => {
    return  `${src}`
}

export const formatPrice = (price: string, currency: string, unit: string): string => {
  const isKilogram = unit === 'kilogram' || unit === 'kg';
  const suffix = isKilogram ? 'kg' : 'ton';
  
  // Handle currency formatting - case insensitive
  const normalizedCurrency = currency.toUpperCase();
  const currencySymbol = normalizedCurrency === 'NGN' ? '₦' : currency;
  
  // Format the price with proper number formatting
  const numericPrice = parseFloat(price);
  const formattedPrice = numericPrice.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${currencySymbol}${formattedPrice}/${suffix}`;
};
export const transformEventToCalendarEvent = (event: EventDetails): CalendarEvent => {
  const eventDate = new Date(event.eventDate);
  
  // Determine category based on referenceType or description
  let category: CalendarEvent['category'] = 'custom';
  if (event.referenceType === 'product') {
    category = 'crop-harvest';
  } else if (event.referenceType === 'order') {
    category = 'delivery';
  } else if (event.description?.toLowerCase().includes('inspection')) {
    category = 'quality-inspection';
  }
  
  // Extract location from owner information
  let location = 'Location TBD';
  if (event.owner) {
    const locationParts: string[] = [];
    if (event.owner.farmAddress) {
      locationParts.push(event.owner.farmAddress);
    }
    if (event.owner.state) {
      locationParts.push(event.owner.state);
    }
    if (event.owner.country) {
      locationParts.push(event.owner.country);
    }
    if (locationParts.length > 0) {
      location = locationParts.join(', ');
    } else if (event.owner.state && event.owner.country) {
      location = `${event.owner.state}, ${event.owner.country}`;
    } else if (event.owner.state) {
      location = event.owner.state;
    } else if (event.owner.country) {
      location = event.owner.country;
    }
  }
  
  // Determine status based on event date and current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDateOnly = new Date(eventDate);
  eventDateOnly.setHours(0, 0, 0, 0);
  
  let status: CalendarEvent['status'] = 'upcoming';
  if (event.status) {
    // Use status from API if available
    const apiStatus = event.status.toLowerCase();
    if (apiStatus === 'completed' || apiStatus === 'done') {
      status = 'completed';
    } else if (apiStatus === 'in-progress' || apiStatus === 'in_progress') {
      status = 'in-progress';
    } else if (eventDateOnly < today) {
      status = 'completed';
    } else if (eventDateOnly.getTime() === today.getTime()) {
      status = 'in-progress';
    } else {
      status = 'upcoming';
    }
  } else {
    // Fallback: determine status based on date
    if (eventDateOnly < today) {
      status = 'completed';
    } else if (eventDateOnly.getTime() === today.getTime()) {
      status = 'in-progress';
    } else {
      status = 'upcoming';
    }
  }
  
  return {
    id: event.id,
    title: event.name,
    date: eventDate.toISOString().split('T')[0], // YYYY-MM-DD
    location,
    status,
    category,
    description: event.description || undefined
  };
};

// Helper to get events for a specific date
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  const dateStr = date.toISOString().split('T')[0];
  return events.filter(event => event.date === dateStr);
};

// Helper to get today's events
export const getTodaysEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  const today = new Date();
  return getEventsForDate(events, today);
};

// Helper to count events by category
export const countEventsByCategory = (events: CalendarEvent[]) => {
  return events.reduce((acc, event) => {
    if (event.category === 'quality-inspection') acc.inspections++;
    if (event.category === 'delivery') acc.deliveries++;
    if (event.category === 'crop-harvest') acc.harvests++;
    return acc;
  }, { inspections: 0, deliveries: 0, harvests: 0 });
};