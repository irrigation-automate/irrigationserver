# Notification Service

## Table of Contents

- [Overview](#overview)
- [Notification Types](#notification-types)
- [Endpoints](#endpoints)
- [Push Notifications](#push-notifications)
- [Webhooks](#webhooks)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

## Overview

The Notification Service handles all system notifications including in-app notifications, email alerts, and push notifications.

## Notification Types

### System Notifications

- Account activity (login attempts, password changes)
- System alerts (maintenance, updates)
- Security notifications

### Irrigation Alerts

- Watering started/stopped
- Schedule changes
- Leak detection
- Pump failures

### Weather Alerts

- Frost warnings
- High wind alerts
- Rain delays

## Endpoints

### 1. Get Notifications

```http
GET /api/v1/notifications
```

**Query Parameters**

- `status` - Filter by read/unread (optional)
- `type` - Filter by notification type (optional)
- `limit` - Number of notifications to return (default: 20)
- `page` - Page number (default: 1)

**Response**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "notif_123",
        "type": "irrigation",
        "title": "Watering Complete",
        "message": "Front Lawn watering completed. 15L used.",
        "read": false,
        "data": {
          "zoneId": "zone-1",
          "duration": 30,
          "waterUsed": 15
        },
        "createdAt": "2025-10-02T08:30:00Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

### 2. Mark as Read

```http
PATCH /api/v1/notifications/{notificationId}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "notif_123",
    "read": true,
    "readAt": "2025-10-02T09:00:00Z"
  }
}
```

### 3. Mark All as Read

```http
PATCH /api/v1/notifications/read-all
```

**Response**

```json
{
  "success": true,
  "data": {
    "updatedCount": 5
  }
}
```

## Push Notifications

### 1. Register Device

```http
POST /api/v1/notifications/devices
```

**Request Body**

```json
{
  "token": "device-push-token",
  "platform": "ios",
  "deviceId": "device-123",
  "preferences": {
    "irrigationAlerts": true,
    "weatherAlerts": true,
    "systemAlerts": false,
    "silentHours": {
      "enabled": true,
      "start": "22:00",
      "end": "07:00"
    }
  }
}
```

### 2. Update Notification Preferences

```http
PATCH /api/v1/notifications/preferences
```

**Request Body**

```json
{
  "irrigationAlerts": true,
  "weatherAlerts": true,
  "systemAlerts": false,
  "silentHours": {
    "enabled": true,
    "start": "22:00",
    "end": "07:00"
  }
}
```

## Webhooks

### Outgoing Webhooks

Configure webhook endpoints to receive real-time notifications.

**Webhook Payload Example**

```json
{
  "event": "irrigation.complete",
  "timestamp": "2025-10-02T08:30:00Z",
  "data": {
    "zoneId": "zone-1",
    "zoneName": "Front Lawn",
    "duration": 30,
    "waterUsed": 15,
    "status": "completed"
  }
}
```

## Data Models

### 1. Notification Document

```typescript
interface INotificationDocument {
  // Core Fields
  id: string; // Auto-generated unique identifier
  moduleName: ModuleName; // Module that triggered the notification
  action: ActionType; // Type of action that occurred
  status: NotificationStatus; // Current status of the notification

  // Subscription Management
  subscribe: INotificationSubscriber[]; // List of subscribers with read status

  // Payload
  payload?: Record<string, unknown>; // Additional notification data

  // Timestamps
  createdAt: Date; // When the notification was created
  updatedAt: Date; // When the notification was last updated

  // Virtuals (not stored in DB)
  isRead?: boolean; // Computed based on current user's read status
}

interface INotificationSubscriber {
  userId: mongoose.Types.ObjectId; // Reference to user
  seenAt: Date | null; // When the user viewed the notification
}

// Enum Definitions
enum ModuleName {
  USER = 'USER',
  AUTH = 'AUTH',
  IRRIGATION = 'IRRIGATION',
  SYSTEM = 'SYSTEM',
}

enum ActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

enum NotificationStatus {
  PENDING = 'PENDING', // Notification created but not yet processed
  SENT = 'SENT', // Notification sent to all subscribers
  READ = 'READ', // All subscribers have read the notification
  ARCHIVED = 'ARCHIVED', // Notification archived
}
```

### 2. Notification Preferences

```typescript
interface INotificationPreferences {
  // User Reference
  userId: mongoose.Types.ObjectId;

  // Notification Channels
  email: boolean;  // Receive email notifications
  push: boolean;   // Receive push notifications
  sms: boolean;    // Receive SMS notifications

  // Notification Types
  preferences: {
    [key in NotificationType]: boolean;
    systemAlerts: boolean;
    securityAlerts: boolean;
    irrigationAlerts: boolean;
    weatherAlerts: boolean;
  };

  // Quiet Hours
  silentHours?: {
    enabled: boolean;
    start: string;  // Format: "HH:MM"
    end: string;    // Format: "HH:MM"
  };

  // Timestamps
  updatedAt: Date;
}

type NotificationType =
  | 'systemAlerts'
  | 'securityAlerts'
  | 'irrigationAlerts'
  | 'weatherAlerts';
```

### 3. Device Registration

```typescript
interface IDeviceRegistration {
  // Device Identification
  deviceId: string; // Unique device identifier
  userId: mongoose.Types.ObjectId; // Associated user

  // Push Notification Tokens
  token: string; // Device push token
  platform: 'ios' | 'android' | 'web';

  // Metadata
  userAgent?: string; // Device/browser information
  lastActive: Date; // Last activity timestamp

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Webhook Subscription

```typescript
interface IWebhookSubscription {
  // Subscription Details
  userId: mongoose.Types.ObjectId;
  url: string; // Endpoint to receive webhooks

  // Event Subscriptions
  events: string[]; // e.g., ["irrigation.complete", "system.alert"]

  // Security
  secret?: string; // For HMAC signature verification

  // Status
  active: boolean;
  lastDelivery?: Date; // Last successful delivery

  // Retry Configuration
  retryCount: number;
  lastRetry?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Notification Template

```typescript
interface INotificationTemplate {
  // Identification
  name: string; // Unique template identifier

  // Content
  subject: string; // For email/push notifications
  message: string; // Can include template variables

  // Configuration
  channels: Array<'email' | 'push' | 'sms' | 'in-app'>;

  // Localization
  locale: string; // e.g., "en-US", "fr-FR"

  // Versioning
  version: number;
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PREFERENCE",
    "message": "Invalid notification preference value"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOTIFICATION_NOT_FOUND",
    "message": "Notification not found"
  }
}
```

## Rate Limiting

- 60 requests per minute per user
- Webhook retry policy: 3 attempts with exponential backoff
