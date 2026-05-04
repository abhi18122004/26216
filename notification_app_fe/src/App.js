import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://20.207.122.201/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYmhpc2hlay4yNjIxNkBnZ25pbmRpYS5kcm9uYWNoYXJ5YS5pbmZvIiwiZXhwIjoxNzc3ODc4NzIyLCJpYXQiOjE3Nzc4Nzc4MjIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxYWM0ZTE3MC1lN2RhLTRhYmMtYWM2OC0zOTk0Y2MxY2RmNzciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhYmhpc2hlayBqYWluIiwic3ViIjoiMzkyZjYzNzMtOTg4OS00MjQ0LWJiNzMtNzMwYWZjOTkwYjQxIn0sImVtYWlsIjoiYWJoaXNoZWsuMjYyMTZAZ2duaW5kaWEuZHJvbmFjaGFyeWEuaW5mbyIsIm5hbWUiOiJhYmhpc2hlayBqYWluIiwicm9sbE5vIjoiMjYyMTYiLCJhY2Nlc3NDb2RlIjoidWtzZFdUIiwiY2xpZW50SUQiOiIzOTJmNjM3My05ODg5LTQyNDQtYmI3My03MzBhZmM5OTBiNDEiLCJjbGllbnRTZWNyZXQiOiJRWWJ0eGREV1lFWUJKU0tyIn0.WJaT9rWOz-VAZIfLmGb5ATswAN2RSy-IzL-QRyVzId0"; 

const priorityMap = {
  placement: 1,
  result: 2,
  event: 3,
};

const getPriority = (type) => {
  return priorityMap[type] || 4;
};

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      // Handle different response shapes safely
      const data = res.data.notifications || res.data || [];

      // Sorting logic (FIXED CASES)
      const sorted = data.sort((a, b) => {
        const p1 = getPriority((a.Type || "").toLowerCase());
        const p2 = getPriority((b.Type || "").toLowerCase());

        if (p1 !== p2) return p1 - p2;

        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });

      setNotifications(sorted.slice(0, 10));
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Top Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        notifications.map((n, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            <h4>{n.Type}</h4>
            <p>{n.Message}</p>
            <small>{n.Timestamp}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;