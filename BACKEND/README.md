# Task Board Application Backend

This is the backend API for the Task Board application, built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables (see `.env.example`):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskboard
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks for current user (protected)
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `PATCH /api/tasks/:id/status` - Update task status (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

## Postman Collection
A Postman collection is included in the `postman` directory for testing the API endpoints.
