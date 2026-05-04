const axios = require("axios");
const log = require("../logging_middleware/logger");

const API_URL = "http://20.207.122.201/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYmhpc2hlay4yNjIxNkBnZ25pbmRpYS5kcm9uYWNoYXJ5YS5pbmZvIiwiZXhwIjoxNzc3ODc4NzIyLCJpYXQiOjE3Nzc4Nzc4MjIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxYWM0ZTE3MC1lN2RhLTRhYmMtYWM2OC0zOTk0Y2MxY2RmNzciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhYmhpc2hlayBqYWluIiwic3ViIjoiMzkyZjYzNzMtOTg4OS00MjQ0LWJiNzMtNzMwYWZjOTkwYjQxIn0sImVtYWlsIjoiYWJoaXNoZWsuMjYyMTZAZ2duaW5kaWEuZHJvbmFjaGFyeWEuaW5mbyIsIm5hbWUiOiJhYmhpc2hlayBqYWluIiwicm9sbE5vIjoiMjYyMTYiLCJhY2Nlc3NDb2RlIjoidWtzZFdUIiwiY2xpZW50SUQiOiIzOTJmNjM3My05ODg5LTQyNDQtYmI3My03MzBhZmM5OTBiNDEiLCJjbGllbnRTZWNyZXQiOiJRWWJ0eGREV1lFWUJKU0tyIn0.WJaT9rWOz-VAZIfLmGb5ATswAN2RSy-IzL-QRyVzId0";

// Priority mapping
const priorityMap = {
  placement: 1,
  result: 2,
  event: 3,
};

function getPriority(type) {
  return priorityMap[type] || 4;
}

async function fetchNotifications() {
  try {
    await log("backend", "info", "service", "Fetching notifications started");

    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    await log("backend", "debug", "service", "Notifications fetched successfully");

    const notifications = res.data.notifications;

    // Sorting
    const sorted = notifications.sort((a, b) => {
      const p1 = getPriority(a.type);
      const p2 = getPriority(b.type);

      if (p1 !== p2) return p1 - p2;

      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    await log("backend", "info", "service", "Sorting completed");

    const top10 = sorted.slice(0, 10);

    console.log("Top 10 Notifications:");
    console.log(top10);

    await log("backend", "info", "service", "Top 10 notifications ready");

  } catch (error) {
    await log("backend", "error", "handler", "Error in fetching notifications");
    console.error("Error:", error.message);
  }
}

fetchNotifications();