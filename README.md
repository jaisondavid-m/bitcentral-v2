# 🎓 BIT-CENTRAL

> **The All-in-One Academic & Campus Lifecycle Platform for BITS Students**

BIT-CENTRAL is a comprehensive, production-grade web application built to centralize academic resources, campus utilities, research practice management, exam seating allotments, mess schedules, and administrative workflows into a unified, high-performance portal.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features & Use Cases](#key-features--use-cases)
  - [📚 Academic Resource Hub](#-academic-resource-hub)
  - [🏢 Exam Hall & Seating Finder](#-exam-hall--seating-finder)
  - [🍽️ Campus Mess Schedule](#️-campus-mess-schedule)
  - [🗺️ Campus Navigation (Find My Way)](#️-campus-navigation-find-my-way)
  - [📝 Outstation & Leave Management](#-outstation--leave-management)
  - [💼 Practice School & Research Portals](#-practice-school--research-portals)
  - [👤 Student Directory & Profile Reports](#-student-directory--profile-reports)
  - [🛡️ Admin Governance Suite](#️-admin-governance-suite)
- [Technical Stack](#technical-stack)
- [System Architecture](#system-architecture)
- [Directory Structure](#directory-structure)
- [Environment Configuration](#environment-configuration)
- [Local Setup & Installation](#local-setup--installation)
- [Available Scripts](#available-scripts)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Contributing & License](#contributing--license)

---

## Overview

Finding study materials, previous year question papers, mess menus, exam seat allotments, and leave pass updates can often be fragmented across multiple channels. **BIT-CENTRAL** solves this by offering a single, responsive, dark-mode-ready portal for BITSians.

Powered by a modern **React 19** frontend and a robust **Go (Gin Framework)** backend with **Firebase Authentication** and **MySQL**, BIT-CENTRAL provides lightning-fast search, inline PDF previews, real-time presence tracking, and role-restricted admin management.

---

## Key Features & Use Cases

### 📚 Academic Resource Hub
- **Question Paper & Answer Key Bank (`/semester`, `/ak_22ph202`, `/tamil_ak`)**: Access past mid-semester papers, module tests, comprehension exams, and official/student solution keys.
- **Fuzzy Search & Filtering**: Built-in instant filtering via [Fuse.js](https://fusejs.io/) to locate course codes, subjects, or semester bundles instantly.
- **Inline PDF Viewing**: High-performance PDF renderer powered by [`react-pdf`](https://github.com/wojtekmaj/react-pdf) with zoom, full-screen, page jump, and secure download support.

### 🏢 Exam Hall & Seating Finder
- **Automated Seating Allotment (`/exam-hall`)**: Search seating plans by ID or course code to find exact room numbers, bench numbers, and hall locations.
- **Seating Plan Downloads (`/exam-hall-manual`)**: Direct download pipeline for published exam hall layout PDFs.

### 🍽️ Campus Mess Schedule
- **Live Mess Menu (`/mess`)**: Interactive daily and weekly meal schedules (Breakfast, Lunch, Snacks, Dinner) tailored for campus hostellers.
- **Admin Mess Controller (`/admin/mess`)**: Allows mess administrators to dynamically update menus and special meal announcements.

### 🗺️ Campus Navigation (Find My Way)
- **Interactive Campus Finder (`/findmyway`)**: Locate lecture halls, labs, administrative blocks, hostel wings, and campus amenities with clear direction guidelines.

### 📝 Outstation & Leave Management
- **Leave Request & Details (`/leavedetails`)**: Submit, track, and verify outstation leave passes and gate passes in real-time.
- **Approval Pipeline**: Integrates with the backend leave handler for administrative approval and pass verification.

### 💼 Practice School & Research Portals
- **Research Practice (RP) Site (`/rpsite`)**: Explore RP stations, faculty projects, cutoffs, stipend statistics, and past student feedback.
- **Academic Practice (AP) Site (`/apsite`)**: Browse AP course details and academic guidelines.
- **PCDP Portal (`/pcdp`)**: Professional Career Development Program hub with career resources and skill tracks.
- **PS Rewards & Leaderboards (`/admin/ps-rewards`)**: Syncs with Google Sheets API via OAuth 2.0 to showcase student performance rewards and rankings.

### 👤 Student Directory & Profile Reports
- **User Directory (`/user-directory`)**: Searchable student and campus user database.
- **Student Analytics Reports (`/student-report/:id`)**: Comprehensive individual student profile pages showing course enrollment, leave history, and academic engagement.

### ❤️ Developer Support & Patron Portal
- **Support Developer (`/support-dev`)**: Dedicated contribution portal to support platform maintenance (servers, storage, domain renewals) via Razorpay (`https://pages.razorpay.com/X8K4y93`).
- **Payment Successful Honor Wall (`/payment-successful`)**: Automated post-payment redirection page featuring inspirational quotes and patron certificates to celebrate donators.

### 🛡️ Admin Governance Suite
- **Comprehensive Admin Dashboard (`/admin`)**: Real-time overview of active student sessions, system analytics, and quick admin actions.
- **User Governance (`/admin/users`)**: Manage user roles, grant admin privileges, and inspect active presence (`PING_ON`).
- **Question Bank Management (`/admin/qb`)**: Upload, categorize, edit, or remove exam papers and answer key PDFs.
- **Card & Resource Controls (`/admin/cards`)**: Manage featured cards, announcements, and resource links shown on the user dashboard.
- **Super Admin Operations (`/admin/super`)**: High-level system configuration and permission overrides.

---

## Technical Stack

| Tier | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 7 | Lightning-fast rendering and modern ES build tooling |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design with dark mode support |
| **UI & Animations** | Framer Motion & Lucide Icons | Fluid page transitions, modal animations, and crisp icons |
| **State & Data Fetching** | TanStack Query v5 + Context API | Cached API requests, optimistic updates, and global state |
| **Search Engine** | Fuse.js | Client-side fuzzy search across question papers & directories |
| **PDF Processing** | PDF.js (`react-pdf`) | Native, zero-dependency PDF document previewer |
| **Authentication** | Firebase Auth (Google & Email) | Secure user authentication and JWT session scoping |
| **Backend Engine** | Go (Gin Web Framework) | High-throughput REST API server written in Go |
| **Database** | MySQL | Relational data persistence for users, cards, leaves, & cards |
| **Integrations** | Google Sheets API OAuth 2.0 | Automated syncing for PS Rewards and Leaderboards |
| **SEO & Meta** | React Helmet Async | Dynamic SEO meta tags, OpenGraph data, and sitemaps |

---

## System Architecture

```
                                  +-----------------------+
                                  |     BITS Students     |
                                  +-----------+-----------+
                                              |
                                              v
                              +---------------+---------------+
                              |    React 19 Client Portal     |
                              |  (Vite + Tailwind CSS v4)     |
                              +---------------+---------------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
        +------------+------------+                       +------------+------------+
        |   Firebase Auth Service |                       |     Go (Gin) Backend API    |
        |  (Google / Email Login) |                       |     (Port 8080 default)   |
        +-------------------------+                       +------------+------------+
                                                                       |
                                              +------------------------+------------------------+
                                              |                        |                        |
                                              v                        v                        v
                                     +--------+--------+      +--------+--------+      +--------+--------+
                                     |  MySQL Database |      |  Local PDF Storage |      |  Google Sheets |
                                     | (User/Leave/QB) |      |   (/pdfs endpoint) |      | (OAuth 2.0 API)|
                                     +-----------------+      +--------------------+      +----------------+
```

---

## Directory Structure

```
bitcentral/
├── client/                      # React Frontend Application
│   ├── public/                  # Static public assets & pre-rendered HTML
│   ├── scripts/                 # Sitemap generation & pre-rendering scripts
│   ├── src/
│   │   ├── api/                 # Axios configuration and API client helpers
│   │   ├── Authentication/      # Firebase authentication initialization & config
│   │   ├── Component/           # Reusable UI components (NavBar, Cards, Modals, SEO)
│   │   ├── config/              # Application constants and default configs
│   │   ├── content/             # Markdown and structured content files
│   │   ├── context/             # Global contexts (ThemeContext, StudentContext)
│   │   ├── Layout/              # Main App wrapper & route setup (App.jsx)
│   │   ├── Pages/               # Route components (Home, Semester, Admin, ExamHall...)
│   │   │   └── answers/         # Specific answer key pages
│   │   ├── routes/              # Protected & Admin route guard wrappers
│   │   └── seo/                 # Route-specific SEO meta configurations
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                      # Go Backend API Server
    ├── config/                  # MySQL & Firebase Admin initialization
    ├── handlers/                # HTTP request handlers (Leave, Mess, Exam, QB, Cards...)
    ├── middleware/              # Auth middleware & CORS handling
    ├── models/                  # GORM / Database structures
    ├── pdfs/                    # Static PDF storage directory
    ├── routes/                  # Gin router definition & API endpoint registration
    ├── main.go                  # Server entry point
    └── go.mod
```

---

## Environment Configuration

### Client Environment Variables (`client/.env`)

Create a `.env` file in the `client/` folder:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API Endpoint
VITE_API_BASE=http://localhost:8080

# Admin Access Control
VITE_ADMIN_FIREBASE_UID=your_admin_firebase_uid

# Presence Pinging (Set to "true" to enable live user tracking and admin refresh)
PING_ON=true
```

### Server Environment Variables (`server/.env`)

Create a `.env` file in the `server/` folder:

```env
# Server Port
PORT=8080

# MySQL Database Configuration
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bitcentral

# Optional Debug Flag (Set "true" to bypass MySQL/Firebase init during dev testing)
SKIP_SERVICE_INIT=false
```

---

## Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Go**: v1.20 or higher
- **MySQL Database** (or local instance)
- **Firebase Account** with authentication enabled

---

### Step 1: Start the Go Backend Server

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   go mod download
   ```

3. Setup your `server/.env` file with MySQL credentials.

4. Run the server:
   ```bash
   go run main.go
   ```
   *The server will start listening on `http://localhost:8080`.*

---

### Step 2: Start the React Frontend Client

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup your `client/.env` file with Firebase and API settings.

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## Available Scripts

In the `client/` directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches Vite local development server with HMR |
| `npm run build` | Builds the app for production, generates sitemaps, and runs pre-rendering |
| `npm run preview` | Previews the local production build |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `npm run seo:sitemap` | Executes script to automatically regenerate `sitemap.xml` |
| `npm run seo:prerender` | Pre-renders static public routes for fast initial page loads |

---

## Role-Based Access Control (RBAC)

BIT-CENTRAL enforces strict multi-tier permissions:

- 🔓 **Public Routes**: `/login`, `/landing`, `/privacy-policy`, `/terms`, `/about`, `/features`, `/faq`, `/contact`. Accessible without signing in.
- 🔒 **Student Protected Routes**: `/home`, `/dashboard`, `/semester`, `/exam-hall`, `/mess`, `/leavedetails`, `/rpsite`, `/apsite`, `/pcdp`, `/findmyway`, `/user-directory`, `/student-report`. Requires active Firebase user authentication (`ProtectedRoute.jsx`).
- 🛡️ **Admin Protected Routes**: `/admin`, `/admin/users`, `/admin/qb`, `/admin/cards`, `/admin/mess`, `/admin/ps-rewards`, `/admin/super`. Restricted to users matching administrative UID roles (`AdminRoute.jsx`).

---

## Contributing & License

1. **Fork** the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. **Commit** your changes with clear messages:
   ```bash
   git commit -m "Add new exam hall filter"
   ```
3. **Push** to the branch and open a **Pull Request**.

This project is licensed under the **MIT License**. Feel free to customize and extend for your campus! 🚀
