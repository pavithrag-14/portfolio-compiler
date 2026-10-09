# 🚀 Portfolio Compiler

> **AI-Powered Student Portfolio Compiler & Career Readiness Intelligence Platform**

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Overview

**Portfolio Compiler** is a full-stack web application designed for students and aspiring software professionals to systematically consolidate academic records, verify technical competency, and compile an industry-ready digital portfolio. 

The platform features an automated **CGPA Discrepancy Engine**, **50-MCQ Calibrated Topic Assessments**, an **AI Speech & Acoustic Mock Interview Simulator**, and a unified **Career Readiness Index**.

---

## ✨ Key Features

### 1. 📊 Central Dashboard & Career Readiness Index
- **Weighted Readiness Algorithm**: Calculates an overall readiness percentage (0–100%) incorporating profile completeness, skill gaps, verified certifications, academic standing, and interview performance.
- **Role Alignment Tracker**: Compares student capabilities directly against industry target roles (e.g., *UI/UX Designer*, *Full Stack Developer*, *Data Scientist*, *Cloud Engineer*).
- **Interactive Quick Metrics**: Real-time gauges for GitHub commits, LeetCode solved counts, verified certificates, and completed assessments.

### 2. 🎓 Academic Records & CGPA Discrepancy Detection
- **Semester Marksheet Uploads**: Supports uploading marksheets from Semester 1 through 8.
- **Automatic SGPA-to-CGPA Calculation**: Computes accurate cumulative GPAs based on individual semester inputs.
- **Discrepancy Audit**: Automatically compares calculated CGPAs against claimed or document CGPAs, raising warning flags if variances exceed threshold limits.

### 3. 🧠 Calibrated 50-MCQ Topic Assessments
- **7 Technical Domains**: Comprehensive question banks covering:
  - `UI/UX Design` (User research, wireframing, heuristics, Figma)
  - `Python Programming` (Core syntax, OOP, functional paradigms, memory management)
  - `Data Structures & Algorithms` (Trees, graphs, dynamic programming, Big-O)
  - `SQL & Databases` (Joins, indexes, ACID compliance, normalization)
  - `Machine Learning` (Supervised/unsupervised models, regularization, metrics)
  - `Full Stack Web Development` (React, REST APIs, state management, security)
  - `Cloud & DevOps` (Docker, Kubernetes, CI/CD, AWS fundamentals)
- **Calibrated Difficulty Distribution**: Exactly **15 Easy, 25 Medium, and 10 Hard** questions per topic.
- **Strict Completion Rule**: Enforces all 50 questions to be answered before computing verified competency scores.
- **Interactive Exam Controls**: Real-time elapsed timer, question jump palette (1–50), flagging mechanism, draft saving, and full review keys with explanations.

### 4. 🎙️ Personalized AI Mock Interview Simulator
- **Dynamic Context Injection**: Customizes technical and behavioral interview questions based on the candidate's chosen target role and **actual project titles** in their profile.
- **Speech-to-Text Input**: Integrates the browser's Web Speech API for voice response dictation.
- **Acoustic & Delivery Analytics**:
  - **Pace Measurement**: Calculates words per minute (WPM).
  - **Filler Word Detection**: Identifies verbal hesitations (`um`, `uh`, `like`, `basically`, etc.).
  - **Technical Depth Evaluation**: Assesses architectural reasoning and domain depth with qualitative strengths and suggestions.

### 5. 🌐 Instant Public Portfolio Generator
- **One-Click Publishing**: Generates a shareable, responsive portfolio page under a unique URL slug (`/portfolio/:slug`).
- **Showcase Components**: Displays featured projects with live GitHub/demo links, verified skill proficiency badges, academic verification stamps, and contact channels.

---

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern component architecture with functional hooks.
- **Vite 8**: Ultra-fast build tool and development server with hot module replacement (HMR).
- **Tailwind CSS v4**: High-performance utility-first styling with dark-mode aesthetic.
- **Lucide React**: Clean, modern UI icon set.
- **Canvas Confetti**: Engaging celebratory visual effects on completion.
- **Web Speech API**: Browser-native voice recognition for real-time acoustic interview capture.

### Backend
- **Node.js (v24)**: High-throughput runtime environment.
- **Express 5**: REST API backend routing and middleware architecture.
- **In-Memory Mock Database**: Pre-seeded demo user (`usr_neshat_demo`) with persistent session tracking.
- **JWT & Optional Auth Middleware**: Permissive guest/demo exploration with secure user authentication options.

---

## 📁 Project Structure

```plaintext
portfolio-compiler/
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration & /api reverse proxy
├── .gitignore                   # Excludes node_modules, build & temp files
│
├── src/
│   ├── main.jsx                 # Application bootstrapping
│   ├── App.jsx                  # Main application shell with navigation
│   ├── index.css                # Global Tailwind CSS directives
│   ├── api.js                   # Unified API client
│   │
│   ├── views/
│   │   ├── DashboardView.jsx    # Central dashboard with readiness index
│   │   ├── ProfileView.jsx      # Student bio and target role selector
│   │   ├── AcademicsView.jsx    # Marksheets & CGPA discrepancy validator
│   │   ├── CertificationsView.jsx # Certificate upload & verification
│   │   ├── CodingProfilesView.jsx # GitHub & LeetCode sync
│   │   ├── ProjectsView.jsx     # Project manager & GitHub repository importer
│   │   ├── SkillsView.jsx       # Skill gap analysis against target roles
│   │   ├── AssessmentsView.jsx  # 50-MCQ testing engine with live tracker
│   │   ├── InterviewView.jsx    # Speech & acoustic mock interview simulator
│   │   └── PortfolioView.jsx    # Public portfolio preview & publishing
│   │
│   └── components/              # Shared navigation, badges, and modals
│
└── server/
    ├── index.js                 # Express server bootstrap & dashboard routes
    ├── db.js                    # In-memory database with preloaded demo profile
    ├── auth.js                  # Authentication middleware (strict & optional)
    ├── pushToGithub.js          # Direct GitHub REST API upload utility
    │
    ├── data/
    │   └── mcqBank.js           # 350 calibrated MCQs across 7 topic domains
    │
    └── routes/
        ├── authRoutes.js
        ├── profileRoutes.js
        ├── academicRoutes.js
        ├── certRoutes.js
        ├── codingRoutes.js
        ├── projectRoutes.js
        ├── skillRoutes.js
        ├── roleRoutes.js
        ├── assessmentRoutes.js  # 50-MCQ topic testing & grading
        ├── interviewRoutes.js   # Question generation & acoustic evaluation
        ├── careerReadinessRoutes.js
        └── portfolioRoutes.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pavithrag-14/portfolio-compiler.git
   cd portfolio-compiler
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *This command concurrently launches the Express backend on `http://127.0.0.1:5000` (with hot reloading via `node --watch`) and the Vite client on `http://127.0.0.1:5173`.*

4. **Open your browser:**
   Navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔌 API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Retrieves comprehensive readiness metrics and student stats |
| `GET` | `/api/assessments/topics` | Lists all 7 assessment topics with attempt status |
| `GET` | `/api/assessments/:topicId/questions` | Fetches 50 questions for a topic (answers hidden) |
| `POST` | `/api/assessments/submit` | Evaluates all 50 answered MCQs and updates skill gap |
| `GET` | `/api/interview/generate-questions` | Generates 4 personalized project-linked questions |
| `POST` | `/api/interview/evaluate` | Evaluates speech transcript, acoustic pace (WPM) & fillers |
| `GET` | `/api/portfolio/settings` | Retrieves current public portfolio draft & theme settings |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
