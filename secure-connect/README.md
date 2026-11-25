# Lab 4 – Secure Connect and Communication Platform

Node.js + Express + JWT + bcrypt + dotenv + Socket.IO + MongoDB (Mongoose).

## Run
```bash
npm install
cp .env.example .env     # edit JWT_SECRET
# start MongoDB locally (or point MONGO_URI to Atlas)
npm start
```
Chat test client: open http://localhost:5000 in two browser tabs (log in as two users).

## Endpoints
| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | /api/auth/signup | – | `{username,email,password}`; add `"adminKey"` (from .env) for admin role |
| POST | /api/auth/login | – | returns JWT + sets `token` cookie |
| POST | /api/auth/logout | – | clears cookie |
| GET | /api/auth/me | JWT | protected route |
| POST/GET | /api/notes | JWT | create / list own notes |
| GET/PUT/DELETE | /api/notes/:id | JWT | owner only |
| GET | /api/admin/users, /api/admin/notes | JWT + admin | RBAC |

Send the token as `Authorization: Bearer <token>` or the `token` cookie.
Without a token → `403 {"message":"No token provided"}`.

## Socket.IO events
Connect with `io({ auth: { token } })`.
- `joinRoom` (room) · `chatMessage` ({room,text}) · `typing` (room)
- server emits `chatMessage`, `system`, `typing`

## EventEmitter (events/appEvents.js)
`user:registered`, `user:login`, `note:created|updated|deleted`, `chat:message` → logged to console.
