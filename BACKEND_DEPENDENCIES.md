# Backend Dependencies & Requirements

**Project:** OKO Agro Platform  
**Priority:** High  
**Status:** Pending Implementation

---

## Overview

This document outlines critical backend dependencies and missing features required for the frontend to function properly. These requirements need to be implemented on the backend API to ensure seamless integration with the frontend application.

---

## 1. Purchase Order Document - Make Optional in Payload

### Current Issue
When creating a **general buy request** (where `isGeneral: true`), the frontend does not include `purchaseOrderDoc` in the payload. However, the backend is currently throwing validation errors when this field is missing, even though it should only be required for specific buy requests (`isGeneral: false`).

### Requirement
The `purchaseOrderDoc` field should be **optional** in the buy request creation payload (`POST /buy-requests/create`).

### Expected Behavior
- **General Buy Requests** (`isGeneral: true`):
  - `purchaseOrderDoc` should be **optional** (can be omitted or `null`)
  - No validation error should be thrown if `purchaseOrderDoc` is not provided
  - Backend should accept the request without this field

- **Specific Buy Requests** (`isGeneral: false`):
  - `purchaseOrderDoc` should be **required** (validation should enforce this)
  - Validation error should be thrown if `purchaseOrderDoc` is missing for specific requests

### Current Frontend Implementation
The frontend already handles this logic:
- For general requests: `purchaseOrderDoc` is not included in the payload
- For specific requests: `purchaseOrderDoc` is included as a base64-encoded string

### API Endpoint Affected
- `POST /buy-requests/create`

### Payload Structure
```json
{
  "description": "string",
  "cropId": "string",
  "qualityStandardId": "string",
  "productQuantity": "string",
  "productQuantityUnit": "string",
  "pricePerUnitOffer": "string",
  "estimatedDeliveryDate": "string",
  "deliveryLocation": "string",
  "preferredPaymentMethod": "pay_on_delivery | bank_transfer | mobile_money | cash",
  "isGeneral": boolean,
  "productId": "string (optional)",
  "sellerId": "string (optional)",
  "purchaseOrderDoc": "string (optional - base64 encoded, required only when isGeneral is false)"
}
```

---

## 2. Notification System Endpoint

### Overview
A comprehensive notification system is required to handle real-time updates and communication between users (farmers and processors). This system should store notifications and messages that can be retrieved by the frontend.

### 2.1 Notification Endpoint Structure

#### Endpoint: `GET /notifications`
**Purpose:** Retrieve all notifications for the authenticated user

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `pageNumber` (optional, default: 1)
- `pageSize` (optional, default: 20)
- `type` (optional): Filter by notification type (`buy_request`, `order_status`, `contact_message`)
- `isRead` (optional): Filter by read status (`true`/`false`)

**Response Structure:**
```json
{
  "statusCode": 200,
  "message": "Notifications retrieved successfully",
  "data": {
    "items": [
      {
        "id": "string",
        "type": "buy_request | order_status | contact_message",
        "title": "string",
        "message": "string",
        "relatedEntityType": "buy_request | order",
        "relatedEntityId": "string",
        "senderId": "string (optional - for contact messages)",
        "senderName": "string (optional - for contact messages)",
        "isRead": boolean,
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime"
      }
    ],
    "totalRecord": number,
    "pageNumber": number,
    "pageSize": number,
    "unreadCount": number
  }
}
```

#### Endpoint: `PUT /notifications/:notificationId/read`
**Purpose:** Mark a notification as read

**Authentication:** Required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Notification marked as read",
  "data": {
    "id": "string",
    "isRead": true
  }
}
```

#### Endpoint: `PUT /notifications/read-all`
**Purpose:** Mark all notifications as read for the authenticated user

**Authentication:** Required

**Response:**
```json
{
  "statusCode": 200,
  "message": "All notifications marked as read",
  "data": {
    "markedCount": number
  }
}
```

### 2.2 Automatic Notification Generation

The backend should **automatically create notifications** in the following scenarios:

#### A. Buy Request Status Changes

**Trigger:** When a buy request status is updated (`PUT /buy-requests/update-status`)

**Notification Recipients:**
- The **buyer** (processor) when farmer changes status
- The **seller** (farmer) when processor updates request

**Notification Types & Messages:**

| Status Change | Recipient | Title | Message Template |
|--------------|-----------|-------|------------------|
| `pending` → `accepted` | Buyer (Processor) | "Buy Request Accepted" | "Your buy request #{requestNumber} has been accepted by {farmerName}. The order is now active." |
| `pending` → `accepted` | Seller (Farmer) | "Request Accepted" | "You have accepted buy request #{requestNumber} from {processorName}. The order is now active." |
| `pending` → `rejected` | Buyer (Processor) | "Buy Request Rejected" | "Your buy request #{requestNumber} has been rejected by {farmerName}." |
| `pending` → `rejected` | Seller (Farmer) | "Request Rejected" | "You have rejected buy request #{requestNumber} from {processorName}." |
| `accepted` → `cancelled` | Buyer/Seller | "Order Cancelled" | "Order #{requestNumber} has been cancelled by {userName}." |
| Any → `completed` | Buyer/Seller | "Order Completed" | "Order #{requestNumber} has been completed successfully." |

**Implementation Notes:**
- Replace placeholders: `{requestNumber}`, `{farmerName}`, `{processorName}`, `{userName}` with actual values
- Include `relatedEntityType: "buy_request"` and `relatedEntityId: <buyRequestId>`

#### B. Order State Changes

**Trigger:** When order state is updated (`PUT /buy-requests/update-order-state`)

**Notification Recipients:**
- The **seller** (farmer) when order state changes
- The **buyer** (processor) for informational purposes

**Notification Types & Messages:**

| Order State | Recipient | Title | Message Template |
|------------|-----------|-------|------------------|
| `awaiting_shipping` | Seller (Farmer) | "Order Ready for Shipping" | "Order #{requestNumber} is ready for shipping. Please prepare the products for delivery." |
| `awaiting_shipping` | Buyer (Processor) | "Order Awaiting Shipping" | "Your order #{requestNumber} is awaiting shipping from {farmerName}." |
| `in_transit` | Seller (Farmer) | "Order In Transit" | "Your order #{requestNumber} is now in transit to {processorName}." |
| `in_transit` | Buyer (Processor) | "Order In Transit" | "Your order #{requestNumber} is in transit. You will receive it soon." |
| `delivered` | Seller (Farmer) | "Order Delivered" | "Your order #{requestNumber} has been delivered to {processorName}." |
| `delivered` | Buyer (Processor) | "Order Delivered" | "Your order #{requestNumber} has been delivered successfully." |
| `completed` | Seller (Farmer) | "Order Completed" | "Order #{requestNumber} has been completed. Payment should be processed." |
| `completed` | Buyer (Processor) | "Order Completed" | "Order #{requestNumber} has been completed successfully." |

**Implementation Notes:**
- Replace placeholders with actual values
- Include `relatedEntityType: "order"` and `relatedEntityId: <buyRequestId>`
- These notifications should be **automatically generated** when the order state changes

### 2.3 Contact Messages (Farmer to Processor)

**Trigger:** When a farmer views a processor's buy request and clicks "Contact"

**Endpoint:** `POST /notifications/contact-message`

**Purpose:** Create a customized contact message notification when a farmer wants to contact a processor about their buy request

**Authentication:** Required (Farmer must be authenticated)

**Request Payload:**
```json
{
  "buyRequestId": "string (required)",
  "processorId": "string (required)",
  "message": "string (optional - if not provided, use default template)"
}
```

**Default Message Template (if message not provided):**
```
"Hi, I'm {farmerName} and I have {productName} available. You can view my profile and send a purchase order or contact me. My farm is located in {state}, {country}."
```

**Message Template Variables:**
- `{farmerName}` - Full name of the farmer (firstName + lastName)
- `{productName}` - Name of the product (if linked to a specific product)
- `{state}` - Farmer's state
- `{country}` - Farmer's country
- `{farmName}` - Farmer's farm name (if available)

**Response:**
```json
{
  "statusCode": 201,
  "message": "Contact message sent successfully",
  "data": {
    "id": "string",
    "type": "contact_message",
    "title": "New Contact Message",
    "message": "string (the actual message sent)",
    "senderId": "string (farmer's userId)",
    "senderName": "string (farmer's full name)",
    "recipientId": "string (processor's userId)",
    "relatedEntityType": "buy_request",
    "relatedEntityId": "string (buyRequestId)",
    "isRead": false,
    "createdAt": "ISO 8601 datetime"
  }
}
```

**Notification Recipient:**
- The **processor** (buyer) who created the buy request

**Notification Details:**
- `type`: `"contact_message"`
- `title`: `"New Contact Message from {farmerName}"`
- `message`: The customized message (either provided or generated from template)
- `senderId`: Farmer's user ID
- `senderName`: Farmer's full name
- `relatedEntityType`: `"buy_request"`
- `relatedEntityId`: The buy request ID

**Frontend Usage:**
- When a farmer views a processor's buy request and clicks "Contact", the frontend will call this endpoint
- The frontend can optionally provide a custom message, or let the backend generate the default template
- The processor will receive this notification in their notification list

### 2.4 Notification Data Model

**Suggested Database Schema:**
```sql
notifications (
  id: UUID (Primary Key)
  userId: UUID (Foreign Key to users) - recipient
  type: ENUM('buy_request', 'order_status', 'contact_message')
  title: VARCHAR(255)
  message: TEXT
  relatedEntityType: ENUM('buy_request', 'order')
  relatedEntityId: UUID
  senderId: UUID (Foreign Key to users, nullable) - for contact messages
  senderName: VARCHAR(255) (nullable) - for contact messages
  isRead: BOOLEAN (default: false)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
  deletedAt: TIMESTAMP (nullable, for soft delete)
)

-- Indexes
INDEX idx_userId_isRead (userId, isRead)
INDEX idx_userId_createdAt (userId, createdAt DESC)
INDEX idx_relatedEntity (relatedEntityType, relatedEntityId)
```

### 2.5 Implementation Requirements

1. **Automatic Notification Creation:**
   - When buy request status changes → Create notifications for both parties
   - When order state changes → Create notifications for both parties
   - These should be created **automatically** in the same transaction as the status/state update

2. **Message Customization:**
   - All notification messages should use the templates provided above
   - Replace all placeholders with actual data from the database
   - Ensure messages are user-friendly and informative

3. **Notification Storage:**
   - All notifications must be stored in the database
   - Notifications should persist until explicitly deleted or marked as read (with optional auto-cleanup after X days)

4. **Real-time Considerations (Future):**
   - Consider implementing WebSocket support for real-time notifications (optional for now)
   - For now, frontend will poll the notifications endpoint

5. **Performance:**
   - Implement pagination for notification retrieval
   - Include unread count in response
   - Optimize queries with proper indexing

---

## 3. Additional Requirements

**Note:** The last requirement was not fully specified. Please clarify the third requirement so it can be added to this document.

---

## Testing Checklist

### Purchase Order Document
- [ ] Create general buy request without `purchaseOrderDoc` → Should succeed
- [ ] Create specific buy request without `purchaseOrderDoc` → Should fail with validation error
- [ ] Create specific buy request with `purchaseOrderDoc` → Should succeed

### Notification System
- [ ] Buy request status change → Notifications created for both parties
- [ ] Order state change → Notifications created for both parties with correct messages
- [ ] Farmer contacts processor → Contact message notification created
- [ ] GET /notifications → Returns paginated list of notifications
- [ ] GET /notifications with filters → Returns filtered notifications
- [ ] PUT /notifications/:id/read → Marks notification as read
- [ ] PUT /notifications/read-all → Marks all notifications as read
- [ ] Notification messages contain correct placeholders replaced with actual data

---

## Priority

1. **High Priority:**
   - Purchase Order Document optional field fix
   - Notification endpoint creation (GET, PUT endpoints)
   - Automatic notification generation for buy request status changes
   - Automatic notification generation for order state changes

2. **Medium Priority:**
   - Contact message endpoint
   - Notification filtering and pagination
   - Unread count functionality

---

## Questions & Clarifications

1. Should notifications be automatically deleted after a certain period (e.g., 30 days)?
2. Do we need notification preferences (users can opt-out of certain notification types)?
3. Should contact messages support replies/threading, or are they one-time messages?
4. What is the third requirement that was mentioned but not completed?

---

## Contact

For questions or clarifications regarding these requirements, please contact the frontend development team.

---

**Document Version:** 1.0

