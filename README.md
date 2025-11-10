# PeerConnect 

This is a student peer-learning and skill-sharing platform.  
It handles student data, skill management, help requests, assignments, and ratings using **Express.js** and **Supabase**.

---

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Render
- **Frontend:** Deployed separately and connects to this backend via REST APIs

---

## Features
- Student registration and skill linking
- Help request posting and assignment to helpers
- Ratings system with automatic leaderboard updates
- Skills and student skill management
- Integrated Supabase triggers for real-time rating averages

---

## Folder Structure
```
backend/
│
├── server.js
├── routes/
│   ├── students.js
│   ├── skills.js
│   ├── requests.js
│   ├── assignments.js
│   ├── ratings.js
│   └── studentSkills.js
│
├── config/
│   └── supabaseClient.js
│
├── package.json
├── .gitignore
└── .env.example
frontend/
│
├── index.html
```

---

## Deployment (Render)

### Build and Start Commands
```
Build Command: npm install
Start Command: npm start
```

> `https://peerconnect-backend.onrender.com/api/students`

---

## API Testing (Postman)
Example endpoints:

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/students` | Get all students |
| `GET` | `/api/students/:id` | Get student by ID |
| `POST` | `/api/students` | Add a student |
| `GET` | `/api/skills` | Get all skills |
| `GET` | `/api/student-skills/:id` | Get skills of a particular student by ID|
| `GET` | `/api/skills/:id` | Get skill by ID |
| `POST` | `/api/requests` | Create a help request |
| `POST` | `/api/ratings` | Rate a helper |
| `GET` | `/api/ratings/leaderboard` | View leaderboard |

---

## Deployed Links

- **Frontend:** [https://peer-connect-green.vercel.app/](#)
- **Backend (Render):** [https://peer-connect-lqsy.onrender.com](#)

---

### Notes
- The backend is designed to be modular and scalable.
- Leaderboard updates automatically via SQL triggers.
- Frontend can cache `/api/skills` responses for faster rendering.

---
