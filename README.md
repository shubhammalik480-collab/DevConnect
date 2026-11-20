# DevConnect – Developer Networking Platform

DevConnect is a full-stack developer networking platform designed to help developers connect, collaborate, share knowledge, and showcase their technical skills.

Developers can create professional profiles, showcase projects, publish technical blogs, discover other developers, and build meaningful professional connections.

## Live Application

- **Frontend:** https://dev-connect-three-drab.vercel.app
- **Backend API:** https://devconnect-backend-punb.onrender.com
- **Repository:** https://github.com/shubhammalik480-collab/DevConnect

## Features

- User registration and login with JWT authentication.
- GitHub OAuth authentication.
- Developer profiles with skills and personal information.
- Project creation and management.
- Developer discovery and search.
- Professional connections between developers.
- Skill endorsements.
- Technical blog publishing and editing.
- Markdown-based blog editor.
- User dashboard.
- Real-time communication using Socket.IO.
- Image uploads using Cloudinary.
- Responsive user interface.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Socket.IO
- Passport.js
- JWT
- Helmet
- Express Rate Limit

### Database
- PostgreSQL
- Prisma ORM
- Neon PostgreSQL

### Authentication
- JWT Authentication
- Cookie-based authentication
- GitHub OAuth
- Passport.js

### Cloud Services and Deployment
- Vercel – Frontend Hosting
- Render – Backend Hosting
- Neon – Database Hosting
- Cloudinary – Image Storage

## Project Structure

```text
DevConnect/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── config/
│   └── README.md
│
├── server/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── services/
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- PostgreSQL database or Neon PostgreSQL account

### 1. Clone Repository

```bash
git clone https://github.com/shubhammalik480-collab/DevConnect.git

cd DevConnect
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory.

Configure the following environment variables:

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

Generate Prisma Client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Build and start the backend:

```bash
npm run build
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Deployment

DevConnect is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Image Storage | Cloudinary |

## Security

The backend implements several security measures:

- JWT-based authentication.
- HTTP security headers using Helmet.
- CORS configuration.
- CSRF protection.
- API rate limiting.
- HTTP-only authentication cookies.
- Request body size restrictions.
- Image upload validation.

## Author

**Shubham Malik**

B.Tech – Computer Science and Engineering

GitHub: https://github.com/shubhammalik480-collab

---

Developed as part of the Code-A-Nova Full Stack Development Internship.