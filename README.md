# 🪻 PANDORA

### MSA Interactive Event Platform

> **REGISTER. VERIFY. FORM YOUR TEAM. ENTER PANDORA.**

Pandora is a futuristic event registration and participant management platform developed for **Microsoft Student Affairs (MSA)**.

The platform transforms a conventional event registration process into an interactive experience where participants move through a sequence of stages — from registration and email verification to team formation, shortlisting, episodes, final results, and a personalized event wrap-up.

---

## 🌌 Event Journey

```text
REGISTER
   ↓
OTP VERIFICATION
   ↓
TEAM FORMATION
   ↓
CONFIRMATION
   ↓
PARTICIPANT DASHBOARD
   ↓
SHORTLISTING
   ↓
RESULT
   ↓
EPISODE 01
   ↓
EPISODE 02
   ↓
EPISODE 03
   ↓
FINAL RESULT
   ↓
PANDORA WRAPPED
```

---

## ✨ Features

### 🔐 Registration & Verification

* SRMIST email verification
* OTP-based verification flow
* Password-based registration
* Registration validation
* Secure backend API integration

### 👥 Team Formation

Participants can create their event team by providing:

* Team name
* Team leader email
* Member 2 email
* Member 3 email
* Member 4 email
* Leader photograph
* Member 2 photograph
* Member 3 photograph
* Member 4 photograph

Team photographs are stored using Supabase Storage.

### ⏳ Live Event Scheduling

Pandora includes time-controlled event rounds.

Each round has:

* Start time
* End time
* Countdown timer
* Locked state
* Live state
* Ended state

Participants can only enter a round when it is officially live.

### 🎯 Event Rounds

Pandora currently supports:

* Shortlisting
* Episode 01
* Episode 02
* Episode 03
* Final Result
* Pandora Wrapped

### 💫 Interactive UI

The frontend uses a futuristic visual language featuring:

* Purple glassmorphism
* Animated backgrounds
* Glowing elements
* Gradient typography
* Countdown cards
* Interactive buttons
* Responsive layouts
* Smooth transitions
* Modern event dashboard

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* CSS
* Lucide React

## Backend

* Node.js
* Express
* TypeScript
* Multer
* Supabase

## Database & Storage

* Supabase PostgreSQL
* Supabase Storage

---

# 📁 Project Architecture

The project is maintained in a single GitHub repository using separate branches.

```text
Pandora
│
├── frontend branch
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── ...
│
└── backend branch
    ├── src/
    │   ├── server.ts
    │   └── supabase.ts
    ├── package.json
    ├── tsconfig.json
    └── ...
```

---

# 🚀 Running the Frontend

Clone the repository:

```bash
git clone https://github.com/Sam-1014/Pandora.git
```

Switch to the frontend branch:

```bash
git checkout frontend
```

Move into the frontend project:

```bash
cd pandora_frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# ⚙️ Running the Backend

Switch to the backend branch:

```bash
git checkout backend
```

Move into the backend project:

```bash
cd pandora_backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=3000
```

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:3000
```

---

# 🔗 API Endpoints

## Authentication

### Request OTP

```http
POST /api/auth/request-otp
```

### Verify OTP

```http
POST /api/auth/verify-otp
```

---

## Teams

### Create Team

```http
POST /api/teams
```

Uses `multipart/form-data` to submit team information and photographs.

### Get Team

```http
GET /api/teams/:id
```

---

# 🗄️ Supabase

Pandora uses Supabase for:

* PostgreSQL database
* Team information
* Team member information
* Team photograph storage

### Storage Bucket

```text
team-photos
```

The team table stores URLs for:

```text
leader_photo_url
member_2_photo_url
member_3_photo_url
member_4_photo_url
```

---

# 🔒 Environment Variables

Sensitive credentials should **never** be committed to GitHub.

The backend uses:

```env
SUPABASE_URL=
SUPABASE_KEY=
PORT=
```

Use `.env.example` when sharing the project:

```env
SUPABASE_URL=
SUPABASE_KEY=
PORT=3000
```

---

# 🎨 Design Philosophy

Pandora is designed around the idea of an event being an **experience rather than a form**.

The interface combines:

**Mystery + Technology + Competition + Storytelling**

The goal is to make participants feel like they are entering an evolving digital world rather than simply submitting a registration form.

---

# 🧩 Event Flow

```text
┌──────────────┐
│ Registration │
└──────┬───────┘
       ↓
┌──────────────┐
│ OTP Verify   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Team Form    │
└──────┬───────┘
       ↓
┌──────────────┐
│ Confirmation │
└──────┬───────┘
       ↓
┌──────────────┐
│  Dashboard   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Shortlisting │
└──────┬───────┘
       ↓
┌──────────────┐
│   Episode 1  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Episode 2  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Episode 3  │
└──────┬───────┘
       ↓
┌──────────────┐
│ Final Result │
└──────┬───────┘
       ↓
┌──────────────┐
│    Wrapped   │
└──────────────┘
```

---

# 👩‍💻 Development

Developed for:

**Microsoft Student Affairs (MSA)**
**SRM Institute of Science and Technology**

---

## 📌 Project Status

🚧 **Under Active Development**

Current implementation includes:

* Registration flow
* OTP verification
* Team formation
* Four-member photo uploads
* Participant dashboard
* Timed event rounds
* Shortlisting flow
* Episode navigation
* Final result flow
* Pandora Wrapped experience

---

## 🌌 Pandora

> **Every door opens only when the time is right.**

**Enter Pandora.**
