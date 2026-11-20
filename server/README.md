# DevConnect – Backend

The DevConnect backend is a RESTful API developed using Node.js, Express.js, and TypeScript. It manages authentication, user profiles, projects, blogs, developer connections, database operations, and real-time communication.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| TypeScript | Type-safe development |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and migrations |
| JWT | Authentication |
| Passport.js | GitHub OAuth |
| Socket.IO | Real-time communication |
| Cloudinary | Image storage |
| Helmet | HTTP security headers |
| Express Rate Limit | API rate limiting |
| Multer | File uploads |
| Vitest | Backend testing |
| Supertest | HTTP endpoint testing |

## Features

- User registration and login.
- JWT-based authentication.
- GitHub OAuth integration.
- Secure cookie-based authentication.
- User profile management.
- Project management.
- Skills management.
- Blog creation and management.
- Developer connections.
- Dashboard APIs.
- Activity APIs.
- Real-time Socket.IO integration.
- Cloudinary image uploads.
- API security and rate limiting.

## Project Structure

```text
server/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── app.ts
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js
- npm
- PostgreSQL or Neon PostgreSQL
- GitHub OAuth application credentials
- Cloudinary account

## Installation

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

Never commit actual credentials or secret values to GitHub.

## Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Apply development migrations:

```bash
npx prisma migrate dev
```

For production:

```bash
npx prisma migrate deploy
```

## Development

Start the backend development server:

```bash
npm run dev
```

The backend will run using `tsx watch`.

## Production Build

Compile TypeScript:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Testing

Run backend tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The project uses Vitest as its testing framework and Supertest for HTTP testing.

## API Overview

| Module | Endpoint |
|---|---|
| Authentication | `/api/auth` |
| Users | `/api/users` |
| Projects | `/api/projects` |
| Skills | `/api/skills` |
| Blogs | `/api/blogs` |
| Connections | `/api/connections` |
| Activities | `/api/activities` |
| Dashboard | `/api/dashboard` |
| Health Check | `/api/health` |

## Deployment

The DevConnect backend is deployed on Render.

**Backend URL:**

https://devconnect-backend-punb.onrender.com

**Health Check:**

https://devconnect-backend-punb.onrender.com/api/health

**GitHub Repository:**

https://github.com/shubhammalik480-collab/DevConnect

## Security

- JWT authentication.
- HTTP-only authentication cookies.
- Helmet security headers.
- CORS configuration.
- CSRF protection.
- API rate limiting.
- Request body size limits.
- Image upload validation.
- Centralized error handling.

## Author

**Shubham Malik**

B.Tech – Computer Science and Engineering

GitHub: https://github.com/shubhammalik480-collab

---

Part of the Code-A-Nova Full Stack Development Internship.