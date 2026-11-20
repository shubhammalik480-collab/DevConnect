# DevConnect – Frontend

The frontend of DevConnect is built using React, TypeScript, and Vite. It provides a responsive and interactive interface that allows developers to create profiles, showcase projects, publish blogs, discover developers, and manage professional connections.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| TypeScript | Type-safe development |
| Vite | Development server and build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Socket.IO Client | Real-time communication |
| React Markdown | Markdown rendering |
| Remark GFM | GitHub Flavored Markdown |
| UIW React Markdown Editor | Blog content editing |
| ESLint | Code quality and linting |

## Features

- User registration and login.
- Protected routes and authentication.
- Developer dashboard.
- Developer profiles.
- Project management.
- Developer search and discovery.
- Professional connections.
- Blog creation and editing.
- Markdown-based blog editor.
- Blog content rendering.
- Real-time communication support.
- Responsive user interface.

## Project Structure

```text
client/
│
├── public/
│
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React context and shared state
│   ├── pages/            # Application pages
│   ├── services/         # API and service functions
│   ├── config/           # Application configuration
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Prerequisites

Before running the frontend, make sure you have:

- Node.js installed.
- npm installed.
- DevConnect backend running locally or accessible through its deployed API.

## Installation

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file inside the `client` directory.

Configure the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

For production, configure these variables with the deployed backend URLs.

**Note:** Vite exposes variables prefixed with `VITE_` to frontend code. Never store passwords, private API keys, or other secrets in frontend environment variables.

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Production Build

To generate an optimized production build:

```bash
npm run build
```

The production files will be generated inside the `dist/` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Code Quality

Run ESLint to check the frontend code:

```bash
npm run lint
```

## Deployment

The DevConnect frontend is deployed using Vercel.

**Live Application:**

https://dev-connect-three-drab.vercel.app

**GitHub Repository:**

https://github.com/shubhammalik480-collab/DevConnect

## Author

**Shubham Malik**

B.Tech – Computer Science and Engineering

GitHub: https://github.com/shubhammalik480-collab

---

Part of the Code-A-Nova Full Stack Development Internship.