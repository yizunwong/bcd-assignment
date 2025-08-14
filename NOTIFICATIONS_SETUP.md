# Notifications Feature Setup

This document describes the notifications feature that has been added to the Coverly application.

## Overview

The notifications feature allows users to receive and view real-time notifications from the system. Notifications are stored in a Supabase table and displayed in a dropdown when the bell icon is clicked in the navbar.

## Features

- **Real-time notifications**: Notifications are fetched every 30 seconds
- **Unread count indicator**: Shows the number of unread notifications
- **Mark as read**: Click on a notification to mark it as read
- **Mark all as read**: Button to mark all notifications as read
- **Notification types**: Different icons for success, error, warning, and info notifications
- **Responsive design**: Works on both desktop and mobile

## Database Schema

The notifications table has the following structure:

```sql
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### GET /notifications

Get all notifications for the authenticated user with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of notifications per page (default: 20)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Notification Title",
      "message": "Notification message",
      "notification_type": "success",
      "read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

### PATCH /notifications/:id/read

Mark a specific notification as read.

**Response:**

```json
{
  "success": true
}
```

### PATCH /notifications/read-all

Mark all unread notifications as read.

**Response:**

```json
{
  "success": true
}
```

## Frontend Components

### NotificationsDropdown

The main component that displays the notifications dropdown. Features:

- Fetches notifications using React Query
- Displays unread count badge
- Handles marking notifications as read
- Responsive design for mobile and desktop

### useNotifications Hook

Custom hook that provides:

- `useNotifications()`: Fetches notifications
- `useMarkNotificationAsRead()`: Marks a notification as read
- `useMarkAllNotificationsAsRead()`: Marks all notifications as read

## Setup Instructions

1. **Run the migration** to create the notifications table:

   ```bash
   cd backend
   npm run migration:run
   ```

2. **Seed the database** with sample notifications:

   ```bash
   cd backend
   npm run seed
   ```

3. **Start the backend** server:

   ```bash
   cd backend
   npm run start:dev
   ```

4. **Start the frontend** application:
   ```bash
   cd dashboard
   npm run dev
   ```

## Usage

1. Log in to the application
2. Click the bell icon in the navbar
3. View your notifications in the dropdown
4. Click on a notification to mark it as read
5. Use "Mark all read" to mark all notifications as read

## Notification Types

- `success`: Green checkmark icon
- `error` or `warning`: Red alert icon
- `info`: Blue info icon (default)

## Security

- Row Level Security (RLS) is enabled on the notifications table
- Users can only view and update their own notifications
- All API endpoints require authentication
- Role-based access control is implemented

## Future Enhancements

- Real-time notifications using WebSockets
- Push notifications for mobile devices
- Email notifications
- Notification preferences and settings
- Bulk actions for notifications
