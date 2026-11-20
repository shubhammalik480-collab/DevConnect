# DevConnect – Developer Networking Platform

A full-stack developer networking platform where developers can create profiles, showcase projects and skills, publish blogs, and connect with other developers.

## 🌐 Live Demo

**Live Website:** https://dev-connect-three-drab.vercel.app

**Backend API:** https://devconnect-backend-punb.onrender.com

## ✨ Features

- User registration and login
- JWT-based authentication
- GitHub OAuth integration
- Developer profiles
- Project creation and management
- Skills management
- Blog creation and publishing
- Developer connections
- Dashboard and activity tracking
- Real-time communication using Socket.IO
- Image uploads using Cloudinary

## 🛠️ Tech Stack

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
- JWT Authentication

### Database
- PostgreSQL
- Prisma ORM
- Neon Database

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon

## 📁 Project Structure

```text
DevConnect/
│
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── config/
│
├── server/                 # Node.js backend
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── services/
│
├── shared/                 # Shared code
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/shubhammalik480-collab/DevConnect.git
cd DevConnect
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the required environment variables.

Required variables:

```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

Generate Prisma Client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Build and start the backend:

```bash
npm run build
npm start
```

### 3. Setup Frontend

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

Start the frontend:

```bash
npm run dev
```

## 🔐 Environment Variables

Never commit `.env` files, database passwords, API secrets, or private OAuth credentials to GitHub.

Configure production environment variables through the respective deployment platforms.

## 🚀 Deployment

- Frontend is deployed on Vercel.
- Backend and Socket.IO server are deployed on Render.
- PostgreSQL database is hosted on Neon.
- Cloudinary handles image uploads.

## 🧪 Testing

The project includes backend tests and frontend production build checks.

Production deployment was verified through registration, login, dashboard, profile, projects, blogs, connections, and logout workflows.

## 👨‍💻 Author

**Shubham Malik**

B.Tech – Computer Science and Engineering

GitHub: https://github.com/shubhammalik480-collab

---

⭐ If you find this project useful, consider giving it a star!