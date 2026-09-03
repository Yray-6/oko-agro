import { Notification } from '@/app/types';

export type UserRole = 'farmer' | 'processor';

/**
 * Resolve the destination route for a notification based on user role.
 * Returns null when the notification has no meaningful navigation target.
 */
export function resolveNotificationRoute(
  notification: Notification,
  role: UserRole,
): string | null {
  const prefix = role === 'processor' ? '/dashboard-processor' : '/dashboard';

  // --- Processor-specific routing ---
  if (role === 'processor') {
    // Contact message from a farmer → farmer profile with product highlight
    if (notification.type === 'contact_message' && notification.senderId) {
      const params = new URLSearchParams({ farmerId: notification.senderId });
      if (notification.productId) params.set('productId', notification.productId);
      if (notification.cropId) params.set('cropId', notification.cropId);
      return `${prefix}/find-farmer/farmer-details?${params.toString()}`;
    }

    // New product availability → find farmer page
    if (
      notification.type === 'system' &&
      notification.title?.toLowerCase().includes('product availability')
    ) {
      return `${prefix}/find-farmer`;
    }

    // Buy-request, order-status, dispute, rating → processor orders
    if (
      notification.type === 'buy_request' ||
      notification.type === 'order_status' ||
      notification.type === 'dispute' ||
      notification.type === 'rating' ||
      notification.relatedEntityType === 'buy_request' ||
      notification.relatedEntityType === 'order'
    ) {
      return `${prefix}/orders`;
    }

    return null;
  }

  // --- Farmer routing ---

  // General buy-request availability (sent as type 'system' with specific title)
  if (
    notification.type === 'system' &&
    notification.title?.toLowerCase().includes('general buyrequest availability')
  ) {
    return `${prefix}/marketplace`;
  }

  // Direct buy request → orders
  if (
    notification.type === 'buy_request' ||
    notification.relatedEntityType === 'buy_request'
  ) {
    return `${prefix}/orders`;
  }

  // Order status / dispute / rating → orders
  if (
    notification.type === 'order_status' ||
    notification.type === 'dispute' ||
    notification.type === 'rating' ||
    notification.relatedEntityType === 'order'
  ) {
    return `${prefix}/orders`;
  }

  // New product availability for farmer (system) – no special page, stay
  return null;
}
