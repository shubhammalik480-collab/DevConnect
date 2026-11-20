# DevConnect – API Documentation

## 1. Introduction

DevConnect is a developer networking platform that allows developers to create profiles, showcase projects, publish blogs, connect with other developers, and endorse technical skills.

This document describes the available REST API endpoints, HTTP methods, authentication requirements, request parameters, and response formats.

## 2. Base URLs

**Production Backend:**
`https://devconnect-backend-punb.onrender.com`

**API Base Path:**
`/api`

**Local Development:**
`http://localhost:5000/api`

## 3. Authentication and Security

DevConnect uses cookie-based authentication.

- Registration and login generate an authentication cookie.
- The authentication cookie is named `token`.
- Protected endpoints require valid authentication.
- Logout clears the authentication cookie.
- CORS is configured to allow the frontend origin with credentials.
- CSRF protection is applied to API requests.
- Helmet provides HTTP security headers.
- API rate limiting allows up to 100 requests per 15-minute window.
- JSON request bodies are limited to 10 KB.

For authenticated requests, clients should send cookies using credentials support.

Example using Axios:

```javascript
axios.get("/api/users/profile", {
  withCredentials: true
});
```

## 4. API Endpoint Summary

| Module | Method | Endpoint | Authentication |
|---|---|---|---|
| Health | GET | `/api/health` | No |
| Auth | POST | `/api/auth/register` | No |
| Auth | POST | `/api/auth/login` | No |
| Auth | POST | `/api/auth/logout` | No |
| Auth | GET | `/api/auth/github` | No |
| Auth | GET | `/api/auth/github/callback` | OAuth |
| Auth | GET | `/api/auth/profile` | Yes |
| Users | GET | `/api/users/profile` | Yes |
| Users | PUT | `/api/users/profile` | Yes |
| Users | DELETE | `/api/users/profile` | Yes |
| Users | POST | `/api/users/profile/image` | Yes |
| Users | GET | `/api/users/developers` | Yes |
| Users | GET | `/api/users/developers/:id` | Yes |
| Projects | POST | `/api/projects` | Yes |
| Projects | GET | `/api/projects` | Yes |
| Projects | GET | `/api/projects/:id` | Yes |
| Projects | PUT | `/api/projects/:id` | Yes |
| Projects | DELETE | `/api/projects/:id` | Yes |
| Skills | POST | `/api/skills` | Yes |
| Skills | GET | `/api/skills` | Yes |
| Skills | PUT | `/api/skills/:id` | Yes |
| Skills | DELETE | `/api/skills/:id` | Yes |
| Skills | POST | `/api/skills/endorse/:skillId` | Yes |
| Skills | DELETE | `/api/skills/endorse/:skillId` | Yes |
| Skills | GET | `/api/skills/user/:userId/endorsements` | Yes |
| Blogs | POST | `/api/blogs` | Yes |
| Blogs | GET | `/api/blogs` | Yes |
| Blogs | GET | `/api/blogs/slug/:slug` | Yes |
| Blogs | PUT | `/api/blogs/:id` | Yes |
| Connections | POST | `/api/connections/request/:id` | Yes |
| Connections | PATCH | `/api/connections/:id/accept` | Yes |
| Connections | PATCH | `/api/connections/:id/reject` | Yes |
| Connections | GET | `/api/connections/pending` | Yes |
| Connections | GET | `/api/connections/sent` | Yes |
| Connections | GET | `/api/connections` | Yes |
| Connections | GET | `/api/connections/mutual/:id` | Yes |
| Activities | GET | `/api/activities` | Yes |
| Dashboard | GET | `/api/dashboard/stats` | Yes |

## 5. Health Check API

### GET `/api/health`

Checks whether the backend API is running.

**Success Response – 200**

```json
{
  "success": true,
  "message": "DevConnect API is running"
}
```

## 6. Authentication APIs

### 6.1 Register User

**POST** `/api/auth/register`

Creates a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- Name, email, and password are required.
- Email must have a valid format.
- Password must contain at least 8 characters.
- Name must not exceed 100 characters.

**Success Response – 201**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

An authentication cookie is also set.

### 6.2 Login

**POST** `/api/auth/login`

Authenticates an existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response – 200**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

An authentication cookie is set after successful login.

### 6.3 Logout

**POST** `/api/auth/logout`

Clears the authentication cookie.

**Success Response – 200**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 6.4 GitHub OAuth Login

**GET** `/api/auth/github`

Starts GitHub OAuth authentication with the `user:email` scope.

### 6.5 GitHub OAuth Callback

**GET** `/api/auth/github/callback`

Handles the GitHub authentication callback.

On successful authentication:
- Sets the authentication cookie.
- Redirects the user to the frontend homepage.

On failure:
- Redirects the user to the login page.

### 6.6 Check Authentication

**GET** `/api/auth/profile`

Checks whether the current user is authenticated.

**Success Response – 200**

```json
{
  "success": true,
  "message": "You are authenticated!",
  "userId": "user_id"
}
```

## 7. User APIs

### 7.1 Get Current User Profile

**GET** `/api/users/profile`

Returns the authenticated user's profile.

**Success Response – 200**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Full Stack Developer",
    "location": "India",
    "avatar": "https://example.com/avatar.png",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### 7.2 Update Profile

**PUT** `/api/users/profile`

**Request Body:**

```json
{
  "name": "John Doe",
  "bio": "Full Stack Developer",
  "location": "India",
  "avatar": "https://example.com/avatar.png"
}
```

All supplied fields are optional.

**Success Response – 200**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Full Stack Developer",
    "location": "India",
    "avatar": "https://example.com/avatar.png",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### 7.3 Delete Profile

**DELETE** `/api/users/profile`

Deletes the authenticated user's account.

**Success Response – 200**

```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

### 7.4 Upload Profile Image

**POST** `/api/users/profile/image`

Uploads a profile image.

**Content-Type:** `multipart/form-data`

**Form Field:**
- `image` – Image file.

The uploaded image is stored using Cloudinary.

**Success Response – 200**

```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/image.png"
  }
}
```

Maximum allowed file size: 5 MB.

### 7.5 Search Developers

**GET** `/api/users/developers`

Returns developers excluding the authenticated user.

**Optional Query Parameter:**

`search` – Searches developer name, location, and skill name.

Example:

`GET /api/users/developers?search=React`

**Success Response – 200**

```json
{
  "success": true,
  "message": "Developers fetched successfully",
  "count": 1,
  "data": []
}
```

### 7.6 Get Developer Profile

**GET** `/api/users/developers/:id`

Returns a developer's public profile, skills, projects, and project/blog counts.

**Path Parameter:**
- `id` – Developer ID.

**Success Response – 200**

```json
{
  "success": true,
  "message": "Developer profile fetched successfully",
  "data": {}
}
```

## 8. Project APIs

### 8.1 Create Project

**POST** `/api/projects`

**Request Body:**

```json
{
  "title": "Portfolio Website",
  "description": "Personal portfolio project",
  "techStack": ["React", "Node.js", "MongoDB"],
  "liveUrl": "https://example.com",
  "repositoryUrl": "https://github.com/example/project"
}
```

Required fields:
- title
- description
- techStack (must be an array)

**Success Response – 201**

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {}
}
```

### 8.2 Get Projects

**GET** `/api/projects`

Returns projects belonging to the authenticated user, ordered by creation date.

### 8.3 Get Project by ID

**GET** `/api/projects/:id`

Returns a specific project belonging to the authenticated user.

### 8.4 Update Project

**PUT** `/api/projects/:id`

**Request Body:**

```json
{
  "title": "Updated Portfolio",
  "description": "Updated project description",
  "techStack": ["React", "TypeScript"],
  "liveUrl": "https://example.com",
  "repositoryUrl": "https://github.com/example/project"
}
```

All fields are optional. If supplied, `techStack` must be an array.

### 8.5 Delete Project

**DELETE** `/api/projects/:id`

Deletes a project owned by the authenticated user.

## 9. Skill and Endorsement APIs

All skill endpoints require authentication.

### 9.1 Add Skill

**POST** `/api/skills`

**Request Body:**

```json
{
  "name": "Java",
  "level": "Intermediate"
}
```

**Success Response – 201**

```json
{
  "success": true,
  "message": "Skill added successfully",
  "data": {}
}
```

### 9.2 Get Current User Skills

**GET** `/api/skills`

Returns the authenticated user's skills, including endorsement counts.

### 9.3 Update Skill

**PUT** `/api/skills/:id`

**Request Body:**

```json
{
  "name": "Java",
  "level": "Advanced"
}
```

### 9.4 Delete Skill

**DELETE** `/api/skills/:id`

Deletes a skill owned by the authenticated user.

### 9.5 Endorse Another Developer's Skill

**POST** `/api/skills/endorse/:skillId`

**Request Body:**

```json
{
  "message": "Excellent Java programming skills!"
}
```

The message field is optional.

A user cannot endorse their own skill. Duplicate endorsements are rejected.

**Success Response – 201**

```json
{
  "success": true,
  "message": "Skill endorsed successfully",
  "data": {}
}
```

### 9.6 Remove Endorsement

**DELETE** `/api/skills/endorse/:skillId`

Removes the authenticated user's endorsement for the specified skill.

### 9.7 Get User Skills with Endorsements

**GET** `/api/skills/user/:userId/endorsements`

Returns a developer's skills, endorsement counts, and endorsement details.

Skills are ordered by endorsement count and then name.

## 10. Blog APIs

### 10.1 Create Blog

**POST** `/api/blogs`

**Request Body:**

```json
{
  "title": "Introduction to Web Development",
  "content": "Blog content goes here...",
  "excerpt": "A short blog description",
  "coverImage": "https://example.com/cover.png",
  "published": true
}
```

Required fields:
- title
- content

The slug is generated automatically from the title.

**Success Response – 201**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {}
}
```

### 10.2 Get Blogs

**GET** `/api/blogs`

Returns published blogs and the authenticated user's own blogs, ordered by creation date.

### 10.3 Get Blog by Slug

**GET** `/api/blogs/slug/:slug`

Returns a published blog or the authenticated user's own unpublished blog.

### 10.4 Update Blog

**PUT** `/api/blogs/:id`

**Request Body:**

```json
{
  "title": "Updated Blog Title",
  "content": "Updated content",
  "excerpt": "Updated excerpt",
  "coverImage": "https://example.com/cover.png",
  "published": true
}
```

All fields are optional. Only the blog owner can update the blog.

**Note:** A blog deletion endpoint is not currently defined in the route configuration.

## 11. Connection APIs

### 11.1 Send Connection Request

**POST** `/api/connections/request/:id`

Sends a connection request to another developer.

**Path Parameter:**
- `id` – Receiver's user ID.

**Success Response – 201**

```json
{
  "success": true,
  "message": "Connection request sent successfully",
  "data": {}
}
```

Users cannot send requests to themselves. Existing requests or connections are rejected.

### 11.2 Accept Connection Request

**PATCH** `/api/connections/:id/accept`

Accepts a pending connection request received by the authenticated user.

### 11.3 Reject Connection Request

**PATCH** `/api/connections/:id/reject`

Rejects a pending connection request received by the authenticated user.

### 11.4 Get Pending Requests

**GET** `/api/connections/pending`

Returns incoming pending connection requests.

### 11.5 Get Sent Requests

**GET** `/api/connections/sent`

Returns outgoing pending connection requests.

### 11.6 Get Accepted Connections

**GET** `/api/connections`

Returns accepted connections of the authenticated user.

### 11.7 Get Mutual Connections

**GET** `/api/connections/mutual/:id`

Returns mutual connections between the authenticated user and another developer.

## 12. Activity API

### Get Activity Feed

**GET** `/api/activities`

Returns the latest 20 activities belonging to the authenticated user.

Each activity includes information about the user who performed the action.

**Success Response – 200**

```json
{
  "success": true,
  "count": 1,
  "data": []
}
```

Activity records are created for events such as connection requests and skill endorsements.

## 13. Dashboard API

### Get Dashboard Statistics

**GET** `/api/dashboard/stats`

Returns statistics for the authenticated user's dashboard.

**Success Response – 200**

```json
{
  "success": true,
  "data": {
    "totalProjects": 5,
    "totalSkills": 8,
    "totalBlogs": 3,
    "totalConnections": 12,
    "pendingRequests": 2
  }
}
```

## 14. Common HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request or validation error |
| 401 | Authentication required or invalid credentials |
| 403 | Access denied or CSRF protection blocked the request |
| 404 | Requested resource not found |
| 409 | Duplicate resource or conflicting request |
| 413 | Uploaded file exceeds the allowed size |
| 500 | Internal server error |

## 15. Global Error Handling

The Express application provides centralized error handling for:

- Multer upload errors.
- File size limit errors.
- Invalid or unsupported image content.
- Other unexpected server errors.

Example:

```json
{
  "success": false,
  "message": "Internal server error."
}
```

## 16. Real-Time Notifications

DevConnect uses Socket.IO for real-time notifications.

The backend emits a `notification` event for events including:

- New connection requests.
- Accepted connection requests.
- Skill endorsements.

Notifications are sent to user-specific rooms using the naming convention:

`user_<userId>`

## 17. Technology Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT-based cookie authentication
- Passport.js and GitHub OAuth
- Socket.IO
- Cloudinary
- Helmet
- Express Rate Limit

## 18. Conclusion

The DevConnect REST API provides authentication, developer profiles, project management, blogging, skills, endorsements, connection management, activity feeds, and dashboard statistics.

The API follows a modular architecture using Express routes, controllers, middleware, services, and Prisma ORM.