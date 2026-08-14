import * as XLSX from "xlsx";
import { CalendarEvent, EventDetails, InventoryType } from "../types";

export const getInventoryTypeLabel = (type: InventoryType | string): string => {
  switch (type) {
    case 'addition':
      return 'Stock Added';
    case 'reservation':
      return 'In Transit';
    case 'release':
      return 'Released';
    case 'deduction':
      return 'Sold';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const getInventoryTypeBadgeStyle = (type: string): string => {
  switch (type) {
    case 'addition':
      return 'bg-green-100 text-green-800';
    case 'reservation':
      return 'bg-blue-100 text-blue-800';
    case 'release':
      return 'bg-yellow-100 text-yellow-800';
    case 'deduction':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imageLoader = ({src}:any) => {
    return  `${src}`
}

export const formatQuantity = (quantityKg: string | number): string => {
  const num = typeof quantityKg === 'string' ? parseFloat(quantityKg) || 0 : quantityKg;
  return num.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
};

export const getAvailableQuantityKg = (
  quantityKg: string | number | null | undefined,
  reservedQuantityKg: string | number | null | undefined,
): number => {
  const total = typeof quantityKg === 'string' ? parseFloat(quantityKg) || 0 : quantityKg || 0;
  const reserved =
    typeof reservedQuantityKg === 'string'
      ? parseFloat(reservedQuantityKg) || 0
      : reservedQuantityKg || 0;
  return Math.max(total - reserved, 0);
};

export type ProductDisplayStatus =
  | 'Active'
  | 'Pending Inspection'
  | 'Sold Out';

/** Display status from approval + available stock (quantityKg - reservedQuantityKg). */
export const getProductDisplayStatus = (product: {
  approvalStatus?: string | null;
  quantityKg?: string | number | null;
  reservedQuantityKg?: string | number | null;
}): ProductDisplayStatus => {
  const approvalStatus = product.approvalStatus?.toLowerCase();

  if (approvalStatus === 'pending') {
    return 'Pending Inspection';
  }

  if (approvalStatus === 'rejected') {
    return 'Sold Out';
  }

  if (getAvailableQuantityKg(product.quantityKg, product.reservedQuantityKg) <= 0) {
    return 'Sold Out';
  }

  return 'Active';
};

export const formatAvailableInventory = (
  quantityKg: string | number | null | undefined,
  reservedQuantityKg: string | number | null | undefined,
): { status: string; percentage: number; available: number } => {
  const total =
    typeof quantityKg === 'string' ? parseFloat(quantityKg) || 0 : quantityKg || 0;
  const reserved =
    typeof reservedQuantityKg === 'string'
      ? parseFloat(reservedQuantityKg) || 0
      : reservedQuantityKg || 0;
  const available = Math.max(total - reserved, 0);
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  if (percentage === 0) {
    return {
      status: `0/${formatQuantity(total)}kg available`,
      percentage: 0,
      available,
    };
  }

  return {
    status:
      reserved > 0
        ? `${formatQuantity(available)}kg available · ${formatQuantity(reserved)}kg in transit`
        : `${formatQuantity(available)}kg available`,
    percentage,
    available,
  };
};

export const formatPrice = (price: string, currency: string, _unit?: string): string => {
  const normalizedCurrency = currency.toUpperCase();
  const currencySymbol = normalizedCurrency === 'NGN' ? '₦' : currency;
  
  const numericPrice = parseFloat(price);
  const formattedPrice = numericPrice.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${currencySymbol}${formattedPrice}/kg`;
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

/** Export array of objects to Excel file. data: array of row objects with string keys. sheetName & filename optional. */
export const exportToExcel = (
  data: Record<string, string | number>[],
  filename = 'export',
  sheetName = 'Sheet1'
) => {
  if (data.length === 0) return;
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
};