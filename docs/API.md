
---

## 📁 الملف 5/25: `API.md`

**المسار:** `buytuk-academy/docs/API.md`

```markdown
# API Reference

Base URL: `/api/v1`

## REST Endpoints
- `POST /auth/login`: Authenticate user.
- `GET /students/me`: Get current student profile.
- `POST /attempts`: Create a new reading attempt.
- `GET /reports/:id`: Fetch detailed reading report.
- `POST /exercises/assign`: Teacher assigns exercise to student.

## WebSocket Events (`/socket.io`)
- **Client -> Server**: `start_session`, `audio_chunk`, `stop_session`.
- **Server -> Client**: `session_started`, `pipeline_status`, `report_ready`.