# HRMS Recruitment Pro

A modern, full-stack Human Resources Management System designed to streamline the recruitment pipeline. Built with a focus on clean architecture, beautiful UI, and robust state management.

## 🏗 Architecture Overview

The application follows a standard Client-Server architecture:
- **Frontend (Client)**: A React application (bootstrapped with Vite) utilizing **Redux Toolkit** for predictable state management, **React Router** for navigation, and **Tailwind CSS** for responsive, utility-first styling. Forms are validated securely using **React Hook Form** and **Zod**.
- **Backend (Server)**: A Node.js application built with **Express.js**, acting as a RESTful API. It interfaces with a **MongoDB** database via **Mongoose** for data modeling. Authentication is handled via **JWT** (JSON Web Tokens).

## 📁 Folder Structure

```text
HRMS Recruitment/
├── backend/
│   ├── src/
│   │   ├── config/      # Database & Environment configs
│   │   ├── controllers/ # Route handlers (logic)
│   │   ├── middlewares/ # Auth & validation middlewares
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Express route definitions
│   │   └── index.js     # Entry point
│   ├── .env             # Server secrets (ignored by git)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance & API calls
    │   ├── app/         # Redux store configuration
    │   ├── components/  # Reusable UI elements
    │   ├── features/    # Redux slices (auth, jobs, etc.)
    │   ├── layouts/     # Page wrappers (sidebar, etc.)
    │   ├── pages/       # Route-level components
    │   ├── routes/      # Protected/Guest routing logic
    │   ├── App.jsx      # Root component
    │   └── main.jsx     # React entry point
    ├── .env             # Client config (ignored by git)
    └── package.json
```

## 🚀 Setup Instructions

Follow these steps to run the project locally.

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder (see Environment Variables below).
4. Start the development server:
   ```bash
   npm run dev
   ```
   *(The server will typically run on http://localhost:5000)*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder (see Environment Variables below).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The app will be accessible at http://localhost:5173)*

## 🔐 Environment Variables

You must create `.env` files in both the `backend` and `frontend` directories. Do not commit these files to version control!

### Backend `.env`

```env
# The port the Express server will run on (e.g. 5000)
PORT=5000

# Your MongoDB connection string (e.g. mongodb://127.0.0.1:27017/hrms-recruitment)
MONGODB_URI=

# A secure random string used to sign JWT tokens
JWT_SECRET=
```

### Frontend `.env`

```env
# The base URL of your backend API (e.g. http://localhost:5000/api)
VITE_API_URL=
```

## ⚠️ Known Limitations

- **Pagination:** Lists (Jobs, Candidates) currently fetch all available records at once. In a large production environment, server-side pagination should be implemented to ensure scalability.
- **Complex Filtering:** Search functions are currently performed globally or via simple backend queries; advanced filtering (e.g., "skills match", "salary range") is not yet implemented.
- **Image/Resume Uploads:** Candidate profiles currently do not support direct file uploads (like PDFs for resumes) to a cloud storage provider (like AWS S3). 
- **Roles & Permissions:** While there is a standard user authentication system, granular role-based access control (e.g., Admin vs Hiring Manager) is minimal.
