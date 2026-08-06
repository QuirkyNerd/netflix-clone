# Netflix Clone

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A Netflix-inspired full-stack web application featuring a responsive user interface and a Node.js/Express backend with MongoDB persistence, JWT authentication, and HTTP-only cookie session management.

---

## Overview

This repository demonstrates a full-stack implementation of a Netflix-style web application combined with secure user authentication workflows.

Key areas implemented:
* **Landing Experience**: Replica of Netflix India's marketing landing page with feature cards and interactive FAQ accordions.
* **User Authentication**: Registration and login workflows with email/username validation, password hashing, and tokenized session cookies.
* **Session Guarded Dashboard**: Post-login Netflix dashboard featuring movie carousels, hero banners, top-10 lists, and category selectors.

---

## Features

- **Responsive Landing Page**: Netflix-style landing UI with interactive FAQ dropdown accordions.
- **User Registration**: Form validation, duplicate email/username handling, and salted password hashing via `bcryptjs`.
- **User Login**: Credential verification issuing 15-day HTTP-only `jwt-netflix` session cookies.
- **Protected Session Guard**: Pre-load session verification (`GET /api/v1/auth/authCheck`) validating JWT cookies before permitting dashboard access.
- **Logout Management**: Invalidates session cookies server-side and redirects users to the login screen.
- **Interactive Dashboard UI**: Rich Netflix media browsing interface powered by jQuery, Slick Carousel, Owl Carousel, and Bootstrap 4.

---

## Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Frontend Browser
    participant API as Express Server
    participant Middleware as protectRoute
    participant DB as MongoDB

    Note over User, DB: Registration Flow
    User->>Frontend: Submit Signup Form (username, email, password)
    Frontend->>API: POST /api/v1/auth/signup
    API->>DB: Check existing email/username
    API->>API: Hash password with bcrypt
    API->>DB: Save User Document
    API-->>Frontend: 201 Created -> Redirect to Login

    Note over User, DB: Authentication & Session Flow
    User->>Frontend: Submit Login Form (email, password)
    Frontend->>API: POST /api/v1/auth/login (withCredentials)
    API->>DB: Find User & Compare Password
    API->>API: Sign JWT Token
    API-->>Frontend: 200 OK + Set HTTP-Only Cookie 'jwt-netflix'
    Frontend->>Frontend: Redirect to Dashboard (homepage.html)

    Note over User, DB: Dashboard Session Verification
    Frontend->>API: GET /api/v1/auth/authCheck (withCredentials)
    API->>Middleware: Extract & Verify 'jwt-netflix' Cookie
    Middleware->>DB: Fetch User (exclude password)
    API-->>Frontend: 200 OK (Session Valid)

    Note over User, DB: Logout Flow
    User->>Frontend: Click Logout
    Frontend->>API: POST /api/v1/auth/logout (withCredentials)
    API-->>Frontend: 200 OK + Clear Cookie
    Frontend->>Frontend: Redirect to Login Page
```

---

## Tech Stack

### Backend
* **Node.js** & **Express.js** (ES Modules)
* **MongoDB** & **Mongoose ODM**

### Security & Session Management
* **bcryptjs** (Password hashing)
* **jsonwebtoken** (JWT signing & verification)
* **cookie-parser** (Cookie extraction)
* **CORS** (Cross-origin credential handling)

### Frontend
* **HTML5** & **Vanilla CSS3**
* **JavaScript (ES6+)** & **Axios**
* **jQuery**, **Bootstrap 4**, **Slick Carousel**, **Owl Carousel**, **Select2**, **Font Awesome**

---

## Architecture

```
                               ┌─────────────────────────┐
                               │     Browser Client      │
                               │ (HTML / JS / jQuery)    │
                               └────────────┬────────────┘
                                            │
                                  HTTP (with Credentials)
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │  Express.js API Server  │
                               │     (server.js:5000)    │
                               └────────────┬────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
   ┌───────────────────────┐   ┌────────────────────────┐   ┌────────────────────────┐
   │    Auth Controller    │   │ protectRoute Middleware│   │    generateToken.js    │
   │ (signup/login/logout) │   │ (verify JWT cookie)    │   │ (HTTP-only JWT cookie) │
   └───────────┬───────────┘   └────────────┬───────────┘   └────────────────────────┘
               │                            │
               └────────────────────────────┴────────────────────────────┐
                                                                         │
                                                                         ▼
                                                            ┌────────────────────────┐
                                                            │     MongoDB Database   │
                                                            │     (User Document)    │
                                                            └────────────────────────┘
```

---

## Project Structure

```
netflix-clone/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database connection setup
│   │   └── envVars.js            # Environment variable configuration
│   ├── controllers/
│   │   └── auth.controller.js    # Auth handlers (signup, login, logout, authCheck)
│   ├── middleware/
│   │   └── protectRoute.js       # JWT cookie protection middleware
│   ├── models/
│   │   └── user.model.js         # Mongoose User model
│   ├── routes/
│   │   └── auth.route.js         # Authentication API routes
│   ├── utils/
│   │   └── generateToken.js      # JWT generation & cookie helper
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── index.html                # Landing page
│   └── src/
│       ├── login.html            # Login page
│       ├── signup.html           # Registration page
│       ├── index.js              # Landing page accordion handler
│       ├── js/
│       │   ├── login.js          # Login form logic & API request
│       │   └── signup.js         # Signup form logic & API request
│       ├── style/
│       │   ├── login.css         # Login page stylesheet
│       │   └── signup.css        # Signup page stylesheet
│       └── netflix/              # Authenticated streaming dashboard
│           ├── homepage.html     # Dashboard layout & session guard
│           ├── main.js           # Slider & carousel interactions
│           ├── style.css         # Dashboard stylesheet
│           └── (css/, js/, images/)
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/signup` | Registers a new user account | No |
| `POST` | `/api/v1/auth/login` | Authenticates credentials & sets `jwt-netflix` cookie | No |
| `POST` | `/api/v1/auth/logout` | Clears authentication cookie | No |
| `GET` | `/api/v1/auth/authCheck` | Verifies JWT cookie and returns authenticated user | **Yes** |

---

## Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/QuirkyNerd/netflix-clone.git
cd netflix-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/netflix-clone
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Start Backend Server
```bash
npm run dev
```
The Express server will start on `http://localhost:5000`.

### 5. Launch Frontend
Serve the `frontend/` directory using a local HTTP server (such as [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) running on `http://127.0.0.1:5501` or `http://localhost:5500` to match CORS configuration).

---

## Security

* **Password Protection**: Passwords are salted and hashed with `bcryptjs` (salt factor 10) prior to persistence.
* **HTTP-Only Cookies**: JWT tokens are issued with `httpOnly: true`, helping mitigate XSS-based cookie access.
* **CSRF Mitigation**: Cookies use `sameSite: "strict"` to restrict cross-site cookie transmission.
* **HTTPS Flag**: Cookies use `secure: true` when `NODE_ENV === "production"`.
* **Password Exclude**: Sensitive password fields are explicitly excluded (`select("-password")`) from returned user data.
* **CORS Policy**: Configured to restrict origin access while supporting credentialed requests (`credentials: true`).

---

## Project Scope

This project is designed as an educational full-stack web application focusing on authentication architecture, session guards, and Netflix UI design. It does not contain commercial video streaming infrastructure, video transcoders, DRM, or payment gateways.

---

## License & Attribution

* **License**: Released under the [MIT License](LICENSE).
* **Disclaimer**: This educational project is a Netflix-inspired clone created for portfolio and learning purposes. It is not affiliated with, sponsored by, or endorsed by Netflix, Inc.
