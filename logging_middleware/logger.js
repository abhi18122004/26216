const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYmhpc2hlay4yNjIxNkBnZ25pbmRpYS5kcm9uYWNoYXJ5YS5pbmZvIiwiZXhwIjoxNzc3ODc4NzIyLCJpYXQiOjE3Nzc4Nzc4MjIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxYWM0ZTE3MC1lN2RhLTRhYmMtYWM2OC0zOTk0Y2MxY2RmNzciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhYmhpc2hlayBqYWluIiwic3ViIjoiMzkyZjYzNzMtOTg4OS00MjQ0LWJiNzMtNzMwYWZjOTkwYjQxIn0sImVtYWlsIjoiYWJoaXNoZWsuMjYyMTZAZ2duaW5kaWEuZHJvbmFjaGFyeWEuaW5mbyIsIm5hbWUiOiJhYmhpc2hlayBqYWluIiwicm9sbE5vIjoiMjYyMTYiLCJhY2Nlc3NDb2RlIjoidWtzZFdUIiwiY2xpZW50SUQiOiIzOTJmNjM3My05ODg5LTQyNDQtYmI3My03MzBhZmM5OTBiNDEiLCJjbGllbnRTZWNyZXQiOiJRWWJ0eGREV1lFWUJKU0tyIn0.WJaT9rWOz-VAZIfLmGb5ATswAN2RSy-IzL-QRyVzId0";

async function log(stack, level, pkg, message) {
  try {
    await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}

module.exports = log;