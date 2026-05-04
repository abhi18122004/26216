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

# Stage 2: Database Design

## 1. Database Choice

For storing notifications, I would use PostgreSQL.

The main reason is that notifications follow a structured format (user_id, message, type, etc.), so a relational database fits well. PostgreSQL also provides strong support for indexing and querying, which will be useful when fetching notifications efficiently for a large number of users.

---

## 2. Table Schema

The core table in the system will be the `notifications` table.

| Column Name | Type      | Description                          |
|-------------|----------|--------------------------------------|
| id          | UUID     | Unique identifier for each notification |
| user_id     | INT      | ID of the user receiving the notification |
| type        | VARCHAR  | Type of notification (placement, result, etc.) |
| message     | TEXT     | Actual notification content          |
| is_read     | BOOLEAN  | Indicates whether the notification is read |
| created_at  | TIMESTAMP| Timestamp when the notification was created |

This schema keeps things simple and allows us to efficiently query notifications based on user and status.

---

## 3. Indexing Strategy

Since notifications will be frequently fetched for a specific user, indexing becomes important.

- An index on `user_id` will help quickly retrieve notifications for a user  
- An index on `is_read` helps when filtering unread notifications  
- A composite index on `(user_id, is_read, created_at)` will improve performance for common queries like fetching unread notifications in sorted order  

Example:

CREATE INDEX idx_notifications  
ON notifications(user_id, is_read, created_at);

---

## 4. Scalability Considerations

As the number of users grows, the system should still perform efficiently. Some strategies I would consider:

- Using pagination to avoid loading too many records at once  
- Partitioning the table if the dataset becomes very large  
- Introducing caching (e.g., Redis) for frequently accessed notifications  
- Archiving old notifications to reduce load on the main table  

These steps ensure that the system remains responsive even with a large number of users and notifications.

# Stage 3: Query Optimization

## Given Query

SELECT * 
FROM notifications 
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;

---

## Problems in the Query

There are a few issues with this query:

1. **No proper indexing**
   - Without an index, the database will perform a full table scan, which becomes slow as data grows.

2. **Using SELECT ***
   - Fetching all columns is unnecessary and increases data transfer time.

3. **Sorting without index**
   - ORDER BY createdAt can be expensive if not supported by an index.

---

## Optimized Approach

### 1. Add Composite Index

To improve performance, we can create a composite index:

CREATE INDEX idx_notifications 
ON notifications(studentID, isRead, createdAt);

This helps:
- Filter faster (studentID + isRead)
- Sort faster (createdAt)

---

### 2. Avoid SELECT *

Instead of fetching all columns, we should fetch only required fields:

SELECT id, type, message, createdAt
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;

---

## Result

With proper indexing and optimized query structure:
- Query execution becomes faster
- Reduced load on database
- Better scalability for large datasets