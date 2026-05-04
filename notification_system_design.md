# Stage 1: Notification API Design

## 1. Core Actions

The notification system supports the following core actions:

- Fetch notifications for a user
- Mark notification as read
- Create/send notification

---

## 2. API Design

### 2.1 Get Notifications

GET /notifications?userId={userId}&page=1&limit=10

#### Response:
{
  "notifications": [
    {
      "id": "uuid",
      "type": "placement",
      "message": "Google is hiring",
      "timestamp": "2026-05-04T10:00:00Z",
      "isRead": false
    }
  ]
}

---

### 2.2 Mark Notification as Read

POST /notifications/read

#### Request:
{
  "notificationId": "uuid"
}

#### Response:
{
  "status": "success"
}

---

### 2.3 Create Notification

POST /notifications

#### Request:
{
  "userId": 123,
  "type": "placement",
  "message": "Amazon hiring"
}

#### Response:
{
  "status": "created"
}

---

## 3. Real-Time Notification Mechanism

- WebSockets will be used for real-time delivery
- If WebSocket fails, fallback to polling

---

## 4. Logging Middleware Usage

All APIs will use logging middleware:

- Info logs → successful API calls
- Error logs → failures
- Debug logs → internal processing

Example:
- "fetch notifications request received"
- "notification marked as read"
- "error while fetching notifications"