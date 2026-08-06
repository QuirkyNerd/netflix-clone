# Netflix Clone

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A Netflix-inspired full-stack web application featuring a responsive Netflix UI and a Node.js/Express backend with MongoDB persistence, JWT authentication, and HTTP-only cookie session management.

<p align="center">
  <img src="frontend/src/img/Netflix-Logo.png" alt="Netflix Clone Logo" width="280"/>
</p>

---

## Overview

This repository demonstrates an end-to-end full-stack implementation of a Netflix-style streaming web interface combined with secure user authentication workflows. 

It covers:
* **Landing Experience**: Replica of Netflix India's marketing page with hero cards and interactive FAQ accordions.
* **User Authentication**: Registration and login workflows with email validation, password hashing, and tokenized session cookies.
* **Session Guarded Dashboard**: Post-login Netflix dashboard featuring media sliders, hero content banners, top-10 lists, and responsive category controls.

---

## Features

- **Responsive Landing Page**: Netflix-style landing UI with interactive FAQ dropdown accordions.
- **User Registration**: Form validation, duplicate email/username detection, and salted password hashing using `bcryptjs`.
- **User Login**: Credential verification issuing 15-day HTTP-only `jwt-netflix` JWT session cookies.
- **Protected Session Guard**: Pre-load session check (`GET /api/v1/auth/authCheck`) verifying JWT cookies before rendering the dashboard.
- **Logout Management**: Invalidates session cookies server-side and redirects users to the login screen.
- **Interactive Dashboard UI**: Rich Netflix dashboard powered by jQuery, Slick Carousel, Owl Carousel, and Bootstrap 4.

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
    API->>Middleware: Verify 'jwt-netflix' Cookie
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
* **jsonwebtoken** (JWT token signing & verification)
* **cookie-parser** (HTTP cookie parsing)
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
│   │   ├── db.js                 # Database connection logic
│   │   └── envVars.js            # Environment variable exporter
│   ├── controllers/
│   │   └── auth.controller.js    # Authentication controllers
│   ├── middleware/
│   │   └── protectRoute.js       # JWT cookie protection middleware
│   ├── models/
│   │   └── user.model.js         # Mongoose User schema
│   ├── routes/
│   │   └── auth.route.js         # API route declarations
│   ├── utils/
│   │   └── generateToken.js      # JWT signing & cookie utility
│   └── server.js                 # Application entry point
├── frontend/
│   ├── index.html                # Landing page
│   └── src/
│       ├── login.html            # Login page
│       ├── signup.html           # Registration page
│       ├── index.js              # Landing page accordion handler
│       ├── js/
│       │   ├── login.js          # Login form logic & API requests
│       │   └── signup.js         # Signup form logic & API requests
│       ├── style/
│       │   ├── login.css         # Login page styles
│       │   └── signup.css        # Signup page styles
│       └── netflix/              # Authenticated streaming dashboard
│           ├── homepage.html     # Dashboard layout & session guard
│           ├── main.js           # Slider & carousel interactions
│           ├── style.css         # Dashboard custom styles
│           └── (css/, js/, images/)
├── .gitignore
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
* **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI

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
Create a `.env` file in the project root directory with the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/netflix-clone
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4. Start Backend Server
```bash
npm run dev
```
The server will boot up at `http://localhost:5000`.

### 5. Launch Frontend
Serve the `frontend/` directory using any local web server (such as [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) on `http://127.0.0.1:5501` or `http://localhost:5500`).

---

## Security

* **Password Security**: Passwords are standardly hashed with `bcryptjs` using a salt factor of 10 prior to storage.
* **Token Storage**: JWT tokens are transmitted via `httpOnly`, `sameSite: "strict"` cookies, mitigating XSS and CSRF exposure.
* **Password Stripping**: Sensitive password hashes are stripped (`select("-password")`) from user objects returned by authentication APIs.
* **CORS Access**: Configured with strict origin checks and `credentials: true` support.

---

## Project Scope

This project focuses on full-stack web development, user authentication, security practices, and responsive UI design. It does not attempt to reproduce commercial video streaming servers, DRM, transcoders, or payment gateways.

---

## License & Attribution

* **License**: Open-source under the [ISC License](LICENSE).
* **Disclaimer**: This project is an educational Netflix-inspired clone created for portfolio and learning purposes. It is not affiliated with or endorsed by Netflix, Inc.
