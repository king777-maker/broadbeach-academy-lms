# Broadbeach Online Academy (LMS 2.0) — Comprehensive Project & Deployment Documentation

**Document Title:** Project Handoff, Technical Architecture & Production Deployment Guide  
**Project Name:** Broadbeach Online Academy (`bb_exp-2.0` / `lms-test`)  
**Production Domain:** [https://broadbeachonline.com](https://broadbeachonline.com)  
**Backend Host:** GoDaddy cPanel (`cadac.in` / Addon Domain: `broadbeachonline.com`)  
**Database Name:** `broad_beach_online`  
**Version:** 2.0.0 (Production Staging)  
**Date of Handoff:** November 21, 2026  
**Author:** Senior Full-Stack Developer & DevOps Engineering Team  

---

## Table of Contents
1. [Project Overview](#1-project-overview)
   - 1.1 Purpose & Mission
   - 1.2 Core Capabilities
   - 1.3 End-to-End User Journeys
2. [Tech Stack & System Architecture](#2-tech-stack--system-architecture)
   - 2.1 Technology Stack Matrix
   - 2.2 System Architecture Diagram
   - 2.3 Directory Structure & Module Breakdown
   - 2.4 API Communication & Reverse Proxy Strategy
3. [Environment Configuration & Local Setup](#3-environment-configuration--local-setup)
   - 3.1 Environment Variables Reference (`.env`)
   - 3.2 System Prerequisites
   - 3.3 Installation & Local Execution Steps
4. [Current Operational Status & Feature Verification](#4-current-operational-status--feature-verification)
   - 4.1 Production-Ready Features
   - 4.2 Comprehensive Route Inventory
   - 4.3 Key Architectural Fixes Recently Applied
5. [Deployment Audit & Critical Readiness Gaps](#5-deployment-audit--critical-readiness-gaps)
   - 5.1 Configuration & Build Pipeline Analysis
   - 5.2 Identified Production Blockers & Architectural Gaps
   - 5.3 Prioritized Step-by-Step Deployment Checklist
6. [Maintenance, Disaster Recovery & Support](#6-maintenance-disaster-recovery--support)
   - 6.1 Database Schema Migrations
   - 6.2 Rollback & Emergency Recovery Protocol

---

## 1. Project Overview

### 1.1 Purpose & Mission
Broadbeach Online Academy is an enterprise-grade Learning Management System (LMS) and International Standards Certification Platform. It delivers accredited training programs across ISO Management Systems (ISO 9001, ISO 14001, ISO 45001, ISO 27001, ISO 22000, IATF 16949, etc.), Health & Safety, Food Safety, Quality Management, and Lean Six Sigma.

The platform provides:
1. **Self-Paced Digital Learning:** 11 foundational free courses featuring video modules, synchronized slides, reference reading materials, and chapter-based completion tracking.
2. **Professional Certification Catalog:** Over 340 commercial auditor, lead auditor, and managerial certification courses with corporate enquiry pipelines.
3. **Automated Assessment & Grading:** Multi-chapter assessments requiring a strict 70% pass threshold.
4. **Instant Official Certificate Issuance:** Automated vector certificate generation following Broadbeach's official formatting (`26BB...` serials, uppercase candidate names, QR codes, and tamper-evident signatures).
5. **Universal Public Verification Engine:** High-performance authenticity search validating certificates across 5,400+ historical records and live database issuances.
6. **Multi-Role Administrative Console:** Obfuscated, role-based administrative portal for managing candidate records, manual certificate registries, support tickets, and trash audits.

---

### 1.2 Core Capabilities
* **Interactive Learning Player:** 3-chapter progressive video player with automated chapter unlocking upon completion.
* **Assessment Engine:** Timed, randomized multiple-choice questionnaires with real-time score tabulation and instant certificate routing upon achieving $\ge 70\%$.
* **Certificate Engine (PDF / Vector):** Client-side high-resolution rendering using `html2canvas` and `jspdf`, generating tamper-proof credential documents.
* **Public Authenticity Search:** Real-time query engine supporting certificate IDs (e.g., `26BB03769`), clean alphanumeric strings, and student names.
* **Student Help Desk & Ticketing:** Integrated ticket submission supporting technical, certification, and general inquiries.
* **Administrative Operations:** Super Admin, Operations Admin, Certification Manager, Support Agent, and Auditor role segmentation with full CRUD, trash-bin recovery, and bulk CSV/Excel exports.

---

### 1.3 End-to-End User Journeys

```
[ Visitor / Learner ]
        │
        ├──► Browse 340+ Courses / 11 Free Courses
        ├──► Register Account / Login (JWT Auth & Local Storage)
        │
        ▼
[ Course Enrollment & Learning ]
        │
        ├──► Open Learning Dashboard (/learning/:courseId)
        ├──► Watch Video Lectures & Review Chapter Slides
        ├──► Mark Chapters Complete -> Progress Tracker persists state
        │
        ▼
[ Assessment & Certification ]
        │
        ├──► Take Course Assessment (/assignment/:courseId)
        ├──► Score Calculation:
        │       ├── Below 70%: Review Answers & Retake
        │       └── 70% or Higher: PASSED!
        ├──► Certificate Generated (/certificate/:courseId)
        │       ├── Candidate Name capitalized (e.g., MANOJ)
        │       ├── Serial format: 26BBxxxxx
        │       └── Live QR Code linking to verification endpoint
        │
        ▼
[ Public Verification ]
        │
        └──► Anyone enters certificate ID at /verify-certificate
                └── Instant validation with student name, course, issue date
```

---

## 2. Tech Stack & System Architecture

### 2.1 Technology Stack Matrix

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.7` | Modern declarative component architecture |
| **Build Tool & Dev Server**| Vite | `^8.1.1` | Fast HMR, code-splitting, Rollup chunk optimization |
| **Routing** | React Router DOM | `^7.18.2` | Client-side SPA routing with deep link fallback |
| **Styling & Design System**| Tailwind CSS | `^4.3.3` | Utility-first styling with `@tailwindcss/vite` |
| **Icons & UI Assets** | Lucide React / React Icons | `^1.27.0` / `^5.7.0` | Vector iconography |
| **Animations** | GSAP / AOS | `^3.15.0` / `^2.3.4` | Performance-optimized micro-interactions and scroll effects |
| **3D Rendering** | Three.js | `^0.186.1` | Interactive 3D Earth Globe on Global Reach page |
| **Carousels & Sliders** | Swiper | `^14.0.7` | Touch-enabled responsive media sliders |
| **Certificate Engine** | html2canvas / jsPDF | `^1.4.1` / `^4.2.1` | High-DPI canvas rasterization and PDF generation |
| **PDF Rendering** | pdfjs-dist / react-pdf | `^6.3.289` / `^11.0.0`| Embedded syllabus and slide inspection |
| **QR Code Engine** | qrcode | `^1.5.4` | QR generator linking certificates to verification URLs |
| **Notifications** | react-hot-toast | `^2.6.0` | Accessible non-blocking user feedback |
| **Backend Architecture** | PHP (Native MVC) | `8.1+` / `8.2+` | RESTful API endpoints, session handling, authentication |
| **Database** | MySQL | `8.0+` | Relational store for users, certs, enrollments, tickets |
| **Hosting (Production)** | GoDaddy cPanel (Apache) | — | Addon domain hosting for `broadbeachonline.com` |
| **Hosting (Testing/Edge)** | Vercel | — | Serverless edge preview and reverse proxy |

---

### 2.2 System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              CLIENT BROWSER (SPA)                                 |
|                                                                                   |
|  [React 19 Frontend - Vite Build]                                                 |
|  ├── Public Pages (Home, Courses, Categories, About, Legal)                       |
|  ├── Learning Engine (LessonVideo, LessonSlides, Assessment, Result, Certificate) |
|  ├── Authenticity Verification Engine (VerifyCertificate)                         |
|  └── Admin Console (Protected via Obfuscated URL & Role Verification)             |
+-----------------------------------------┬-----------------------------------------+
                                          │
                    HTTP Requests: /api/* │ (Bearer Token / Cookie)
                                          ▼
+-----------------------------------------------------------------------------------+
|                        EDGE / REVERSE PROXY LAYER                                 |
|                                                                                   |
|  [Vite Dev Proxy / Vercel Edge Rewrites / Apache mod_rewrite]                     |
|  Rewrites /api/:path*  ──►  https://cadac.in/.../broadbeach-backend/api/:path*    |
+-----------------------------------------┬-----------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                        PHP RESTful BACKEND (cadac.in)                             |
|                                                                                   |
|  ├── AuthController.php            (Register, Login, Profile, JWT / Bearer)       |
|  ├── CertificateController.php     (Dynamic cert creation, validation)            |
|  ├── AssessmentController.php      (Assessment questions, evaluation)             |
|  ├── CourseProgressController.php  (Chapter unlocking & progression)              |
|  ├── EnrollmentController.php      (Course enrollment persistence)                |
|  ├── TicketController.php          (Student support desk, tenant scoping)         |
|  └── AdminModulesController.php    (Admin dashboard, CRUD, RBAC enforcement)     |
+-----------------------------------------┬-----------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                          DATABASE LAYER (MySQL)                                   |
|                                                                                   |
|  Database: broad_beach_online                                                     |
|  Tables: users, certificates, manual_certificates, enrollments, course_progress,  |
|          assessments, assessment_questions, tickets, ticket_replies, admin_users  |
+-----------------------------------------------------------------------------------+
```

---

### 2.3 Directory Structure & Module Breakdown

```
bb_exp-2.0/
├── public/                       # Static public assets served directly
│   ├── .htaccess                 # Apache SPA rewrite rules (Critical for GoDaddy)
│   ├── 404.html                  # Static fallback for hosts without rewrite support
│   ├── CNAME                     # Custom domain binding (broadbeachonline.com)
│   ├── brand-logo.svg            # Official vector logo
│   └── favicon.svg               # Browser icon
├── src/
│   ├── api/                      # Axios HTTP API services
│   │   ├── api.js                # Core LMS API client (auth, courses, certs)
│   │   └── adminApi.js           # Admin portal API client with fallback store
│   ├── assets/                   # Bundled graphics, icons, and certificate templates
│   ├── components/               # Modular reusable UI components
│   │   ├── Admin/                # Admin layout, sidebar, protected route guards
│   │   ├── Auth/                 # Protected route guards and auth modals
│   │   ├── Header/ & Footer/     # Global navigation and footer links
│   │   └── common/               # Cookie consent, modals, breadcrumbs
│   ├── config/                   # Global constants and maintenance flags
│   ├── constants/                # Course IDs, catalog mappings, video manifests
│   ├── context/                  # React Context state providers
│   │   ├── AuthContext.jsx       # Student authentication state
│   │   ├── AdminContext.jsx      # Admin user authentication & RBAC state
│   │   └── AuthPromptContext.jsx # Contextual sign-in modal state
│   ├── data/                     # Authoritative data files & registries
│   │   ├── assessmentCatalog.js  # Offline MCQ questions & grading criteria
│   │   ├── coursesResolver.js    # 340+ course catalog resolver
│   │   ├── freeCoursesData.js    # Data definitions for the 11 free courses
│   │   └── manualCertificatesData.js # 5,467 historical certificates registry
│   ├── pages/                    # Route page components (LMS, Learning, Admin)
│   │   ├── admin/                # AdminDashboard, OnlineCertMaster, TicketMaster, etc.
│   │   ├── categories/           # MainCategoryPage, Environment, FoodSafety, etc.
│   │   ├── courses/              # CourseDetails, CoursePlayer, etc.
│   │   ├── Learning.jsx          # Main 3-chapter learning portal
│   │   ├── Assignment.jsx        # MCQ Assessment questionnaire
│   │   ├── Result.jsx            # Score evaluation & certificate trigger
│   │   ├── Certificate.jsx       # Vector certificate renderer & PDF exporter
│   │   └── VerifyCertificate.jsx # Public certificate authenticity search
│   ├── server/                   # Vite dev-server simulated middlewares
│   │   └── adminMiddleware.js    # Dev mock server for admin CRUD & auth
│   └── utils/                    # Helper libraries
│       ├── adminRoutes.js        # Obfuscated admin route resolution
│       ├── certificateGenerator.js # Official 26BB serial & canvas builder
│       └── progressTracker.js    # Chapter unlocking & localStorage persistence
├── backend_inspection/           # Mirror of the PHP backend source code
│   └── app/
│       ├── Controllers/          # Hardened PHP controllers (Auth, Tickets, Admin)
│       ├── Models/               # Data access models
│       ├── config/               # Database, auth helper, and CORS definitions
│       └── routes/               # API and Admin route dispatchers
├── database/                     # Migration scripts & SQL seed archives
│   ├── 2026_11_04_chapter_locking_and_three_chapters_schema.sql
│   ├── 2026_11_07_import_official_google_drive_mcq_assessments.sql
│   └── 2026_11_09_import_manual_certificates.sql
├── scripts/                      # DevOps automation, testing & verification scripts
│   ├── build_cadac_sync_package.mjs # Packages backend updates for GoDaddy sync
│   ├── postbuild.mjs             # Generates dist/404.html and dist/CNAME
│   └── seedTestAccount.cjs       # Seeds local test credentials
├── cadac_admin_sync.php          # Remote PHP self-extracting deployment script
├── package.json                  # NPM dependencies and build commands
├── vercel.json                   # Vercel Edge deployment and reverse proxy rules
└── vite.config.js                # Vite build configuration, aliases, and dev plugins
```

---

### 2.4 API Communication & Reverse Proxy Strategy

#### Development Environment (`npm run dev`)
1. In local development, the browser makes API requests to `/api/*`.
2. Vite's internal development server intercepts `/api/course-enquiry`, `/api/submit-assessment`, `/api/create-certificate`, and `/api/admin/*` using custom dev plugins defined in `vite.config.js`.
3. Any unhandled API routes are proxied to `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api` via Vite's `server.proxy` configuration.

#### Production Deployment (GoDaddy cPanel / Apache)
1. The built frontend assets (`dist/*`) are placed in the document root of `broadbeachonline.com`.
2. Apache's `mod_rewrite` rule in `.htaccess` forwards all non-file route requests to `index.html` (supporting deep links like `/learning/322`).
3. Client API requests go to `/api/*`, which must either:
   - Route to local PHP API endpoints if the backend is hosted alongside the frontend, OR
   - Route to `https://cadac.in/.../broadbeach-backend/api` via Apache reverse proxy or configured `VITE_API_URL`.

#### Edge Deployment (Vercel)
1. `vercel.json` intercepts `/api/:path*` and rewrites requests directly to:
   `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/:path*`
2. This eliminates Cross-Origin (CORS) preflight issues by proxying calls through Vercel's edge network.

---

## 3. Environment Configuration & Local Setup

### 3.1 Environment Variables Reference (`.env`)

Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable Name | Required | Default / Example Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_APP_URL` | Yes | `http://localhost:3000` | Base URL of the client application |
| `VITE_SITE_URL` | Yes | `http://localhost:3000` | Canonical site origin for SEO and metadata |
| `VITE_BASENAME` | Yes | `/` | React Router basename (use `/` for custom domains) |
| `VITE_CUSTOM_DOMAIN` | No | `broadbeachonline.com` | Domain for postbuild `CNAME` output |
| `VITE_API_URL` | Yes | `/api` | Base API route (uses reverse proxy in dev/edge) |
| `VITE_API_URL_ASSETS` | No | `/uploads` | Asset upload root path |
| `VITE_MAINTENANCE_MODE`| Yes | `false` | Global toggle (`true` forces `/maintenance`) |
| `VITE_ADMIN_LOGIN_PATH`| Yes | `/secure-console/secret-token-key` | Obfuscated admin sign-in URL ($\ge 16$ characters) |
| `ADMIN_LOGIN_PATH` | Yes | `/secure-console/secret-token-key` | Node/SSR matching key for admin login path |
| `VITE_ADMIN_BASE_PATH` | Yes | `/admin` | Root base URL for authenticated admin screens |
| `ADMIN_BASE_PATH` | Yes | `/admin` | Node/SSR matching key for admin base path |

> [!CAUTION]
> **Production Secret Rotation:** The `VITE_ADMIN_LOGIN_PATH` must be kept secret and should never use predictable names like `/admin`, `/login`, or `/secret-admin`. Run `node scripts/rotate-admin-path.cjs` to generate a fresh high-entropy URL.

---

### 3.2 System Prerequisites
* **Node.js:** `v20.19.0+` or `v22.12.0+` (Vite 8 requires Node 20.19+ or 22.12+; running on 22.11.0 outputs a non-fatal warning).
* **Package Manager:** `npm` v10+ (or `pnpm` / `yarn`).
* **Operating System:** Windows 10/11, macOS, or Linux.
* **PHP Runtime (for backend sync):** PHP 8.1+ with `mysqli`, `openssl`, and `json` extensions.

---

### 3.3 Installation & Local Execution Steps

```bash
# 1. Clone repository and navigate to root
cd bb_exp-2.0

# 2. Install all NPM dependencies
npm install

# 3. Create .env configuration
cp .env.example .env

# 4. Start local development server
npm run dev
# -> Local server starts at: http://localhost:3000

# 5. Build for production
npm run build
# -> Compiles optimized chunks to dist/ and generates dist/404.html

# 6. Preview production build locally
npm run preview
```

---

## 4. Current Operational Status & Feature Verification

### 4.1 Production-Ready Features

* **340+ Course Catalog:** Fully searchable, categorized across ISO standards, management systems, and safety programs.
* **11 Core Free Courses:** Integrated with interactive video players, chapter progression tracking, and downloadable course guides:
  1. `322` — ISO 9001:2015 Quality Management System Awareness
  2. `332` — ISO 14001:2015 Environmental Management System Awareness
  3. `323` — ISO 45001:2018 Occupational Health & Safety Awareness
  4. `324` — ISO 22000:2018 Food Safety Management System Awareness
  5. `325` — ISO 27001:2022 Information Security Management System Awareness
  6. `333` — ISO 27001:2022 ISMS Lead Implementer Foundation
  7. `326` — Integrated Management Systems (IMS) Foundation
  8. `327` — ISO 50001:2018 Energy Management System Awareness
  9. `328` — ISO 13485:2016 Medical Devices Quality Management
  10. `329` — IATF 16949:2016 Automotive Quality Management
  11. `330` — Good Manufacturing Practices (GMP) Awareness
* **LMS Learning Portal:** 3-chapter progressive video player with automated chapter unlocking upon completion.
* **Assessment Engine:** Timed, randomized multiple-choice questionnaires with real-time score tabulation and instant certificate routing upon achieving $\ge 70\%$.
* **Certificate Engine (PDF / Vector):** Client-side high-resolution rendering using `html2canvas` and `jspdf`, generating tamper-proof credential documents.
* **Public Authenticity Search:** Real-time query engine supporting certificate IDs (e.g., `26BB03769`), clean alphanumeric strings, and student names.
* **Student Help Desk & Ticketing:** Integrated ticket submission supporting technical, certification, and general inquiries.
* **Administrative Operations:** Super Admin, Operations Admin, Certification Manager, Support Agent, and Auditor role segmentation with full CRUD, trash-bin recovery, and bulk CSV/Excel exports.

---

### 4.2 Comprehensive Route Inventory

| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/` | Public | Homepage featuring 340+ course search, hero banner, statistics |
| `/courses` | Public | Comprehensive course catalog with filters and search |
| `/free-courses` | Public | Grid of the 11 interactive free certification courses |
| `/course/:slug` | Public | Detailed course syllabus, objectives, and enrollment action |
| `/learning/:id` | Enrolled / Student | 3-chapter interactive video and slide learning player |
| `/assignment/:id` | Enrolled / Student | 10-question MCQ certification assessment |
| `/result/:id` | Enrolled / Student | Score display, pass/fail validation, certificate trigger |
| `/certificate/:id` | Enrolled / Student | Rendered official certificate with print and PDF export |
| `/verify-certificate` | Public | Certificate search engine (validates 5,400+ credentials) |
| `/login` | Public | Learner login (email & password with session store) |
| `/register` | Public | Learner registration |
| `/my-courses` | Protected (Student) | Dashboard showing enrolled courses and progress |
| `/profile` | Protected (Student) | Profile management and password updates |
| `/raise-a-ticket` | Protected (Student) | Student support desk for technical or certificate queries |
| `/global` | Public | Interactive 3D WebGL Earth showing worldwide student reach |
| `/legal/*` | Public | Privacy policy, terms, refund policy, cookies, accessibility |
| `[SECRET_ADMIN_PATH]` | Admin Only | High-entropy admin sign-in endpoint |
| `/admin` | Protected (Admin) | Administrative dashboard, metrics, and module navigation |
| `/admin/online-certs` | Protected (Admin) | Online LMS certificates management and revoking |
| `/admin/manual-certs` | Protected (Admin) | Historical registry management (5,400+ records) |
| `/admin/tickets` | Protected (Admin) | Student support ticketing inbox and response manager |
| `/admin/trash` | Protected (Admin) | Soft-deleted certificate and record restore console |
| `/admin/access` | Protected (Super Admin) | Admin user account creation, roles, and 2FA reset |

---

### 4.3 Key Architectural Fixes Recently Applied

1. **Course ID / Manual Certificate Collision Fix (`Certificate.jsx` & `manualCertificatesData.js`):**
   * *The Problem:* Visiting `/certificate/333` on the live site previously displayed an archived historical certificate belonging to "MARY WURAOLA AJIBADE" (Record #333) instead of generating the newly completed certificate for logged-in user Manoj.
   * *Root Cause:* The lookup function treated the numeric string `"333"` as a manual certificate ID before checking online course completions.
   * *Resolution:* Added regex guards (`/^\d{1,4}$/` and `FREE-`) preventing numeric course IDs from ever matching manual offline certificates, and bound certificate generation strictly to the active session user.
2. **Candidate Name Standardization:**
   * Enforced uppercase capitalization (`MANOJ`) across all rendered certificates, database exports, and verification responses.
3. **Official Certificate Number Sequencing:**
   * Enforced official Broadbeach Academy serial format (`26BB...`) with fallback to local cryptographically unique sequences during offline testing.
4. **Free Course Module 1 Video Fix:**
   * Corrected video URL catalog resolutions in `courseVideoCatalog.js` ensuring smooth playback across all 11 free courses.
5. **Security Hardening in Backend Controllers:**
   * Replaced raw string interpolation with parameterized SQL prepared statements in `AdminModulesController.php`.
   * Enforced tenant scoping on `TicketController.php` so students can only inspect and reply to their own tickets.
   * Removed credential leakage and GET token parameters from `cadac_admin_sync.php`.

---

## 5. Deployment Audit & Critical Readiness Gaps

### 5.1 Configuration & Build Pipeline Analysis

An exhaustive audit of build configurations and runtime dependencies revealed the following key operational aspects:

* **Build Pipeline (`vite.config.js`):**  
  The build script executes `vite build && node scripts/postbuild.mjs`.
  * Rollup manual chunking cleanly isolates `certificates-registry` (1.02 MB uncompressed / 95 KB gzip), `vendor-three` (526 KB), `vendor-pdf-tools` (600 KB), and `vendor-icons` (110 KB).
  * Postbuild automatically generates `dist/404.html` and copies `CNAME` for static host compatibility.
  * `public/.htaccess` is copied to `dist/.htaccess` during build.

---

### 5.2 Identified Production Blockers & Architectural Gaps

#### [CRITICAL BLOCKER 1] Vite Dev Middleware vs. Production API Discrepancy
* **Issue:** In local development, `vite.config.js` injects three custom middleware plugins (`courseEnquiryDevPlugin`, `assessmentDevPlugin`, and `adminDevMiddleware`). These handle requests like `/api/course-enquiry`, `/api/create-certificate`, and `/api/admin/*` in memory using JSON files in `src/data/`.
* **Impact in Production:** In a production static build (`dist/`), Vite's development middleware **does not exist**. When deployed to a web server (e.g., GoDaddy or Vercel), client requests hit the real remote backend on `cadac.in`. If the remote PHP backend has not had `cadac_admin_sync.php` executed to deploy the latest controllers (`AdminModulesController.php`, `CertificateController.php`, etc.), those endpoints will return HTTP 404 or 500 errors.
* **Remediation:** Run the backend synchronization package using `scripts/build_cadac_sync_package.mjs` and execute `cadac_admin_sync.php` on the GoDaddy server before launching.

#### [CRITICAL BLOCKER 2] GoDaddy Addon Domain Document Root & Dotfile Uploads
* **Issue:** `broadbeachonline.com` is configured as an Addon Domain in GoDaddy cPanel (`cadac.in`). Its files live in a specific subdirectory (e.g., `/public_html/broadbeachonline.com`).
* **Impact in Production:** When updating the site via cPanel File Manager or FTP, users often upload the contents of `dist/` without the `.htaccess` file because dotfiles are hidden by default in File Manager. Without `.htaccess`, direct visits to deep links (such as `/learning/322`, `/certificate/333`, or `/admin`) will immediately return Apache 404 Not Found errors.
* **Remediation:** In cPanel File Manager Settings, enable "Show Hidden Files (dotfiles)". Ensure `.htaccess` is present in the root folder of `broadbeachonline.com`.

#### [HIGH SEVERITY 3] CORS Policy on Production Backend
* **Issue:** The backend configuration file `backend_inspection/app/config/cors.php` restricts `Access-Control-Allow-Origin` to specific origins.
* **Impact in Production:** If the site is accessed via any newly added domain or temporary preview URL (such as a Vercel preview domain `*.vercel.app`) that is not listed in `cors.php`, all browser API requests will be blocked by CORS policy.
* **Remediation:** Ensure `cors.php` explicitly whitelists:
  * `https://broadbeachonline.com`
  * `https://www.broadbeachonline.com`
  * `https://broadbeach-academy-lms.vercel.app` (or edge reverse proxy)

#### [MEDIUM SEVERITY 4] Secret Admin Path Exposure in Client JS Bundle
* **Issue:** In `vite.config.js`, `envPrefix` includes `ADMIN_`. Consequently, `VITE_ADMIN_LOGIN_PATH` and `ADMIN_LOGIN_PATH` are bundled into the client JavaScript chunk.
* **Impact:** While the path looks random (e.g., `/secure-console/...`), an attacker can open DevTools and grep the bundled JS files for the route.
* **Remediation:** Security must not rely solely on path obscurity. The backend must enforce server-side authentication (HTTP 401/403) on all `/api/admin/*` routes regardless of what frontend URL was requested.

#### [LOW SEVERITY 5] Node.js Version Advisory in Vite
* **Issue:** Running `npm run build` on Node.js `v22.11.0` triggers:
  `You are using Node.js 22.11.0. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.`
* **Impact:** The build currently succeeds, but strict CI/CD environments may treat this warning as a failure.
* **Remediation:** Upgrade local/CI Node.js to `v22.12.0` or higher, or `v20.19.0` LTS.

---

### 5.3 Prioritized Step-by-Step Deployment Checklist

#### Phase 1: Remote Backend Synchronization (GoDaddy cPanel)
- [ ] 1. Open terminal in `bb_exp-2.0` and run:
  ```bash
  node scripts/build_cadac_sync_package.mjs
  ```
- [ ] 2. Access GoDaddy cPanel File Manager for `cadac.in`.
- [ ] 3. Upload `cadac_admin_sync.php` to the root of `broadbeachlearning.com/broadbeach-backend/`.
- [ ] 4. Execute the sync script securely via POST request using your configured `BROADBEACH_DEPLOY_TOKEN`.
- [ ] 5. Verify the JSON response confirms database schema updates and all 12 core controller files deployed.
- [ ] 6. Delete `cadac_admin_sync.php` from the live server immediately after execution to prevent unauthorized re-execution.

#### Phase 2: Frontend Production Build & Packaging
- [ ] 1. Verify `.env` has production variables set (`VITE_APP_URL=https://broadbeachonline.com`, `VITE_API_URL=/api`, `VITE_MAINTENANCE_MODE=false`).
- [ ] 2. Run clean build:
  ```bash
  npm run build
  ```
- [ ] 3. Verify that `dist/index.html`, `dist/404.html`, and `dist/.htaccess` exist.
- [ ] 4. Compress the contents of `dist/` into a single zip file for deployment:
  ```powershell
  Compress-Archive -Path 'dist\*' -DestinationPath 'dist_update_broadbeach.zip' -Force
  ```

#### Phase 3: GoDaddy Production Deployment
- [ ] 1. Log in to GoDaddy Hosting Dashboard (`host.godaddy.com`).
- [ ] 2. Navigate to **Websites** -> Find `broadbeachonline.com` -> Click `...` -> Select **File Manager**.
- [ ] 3. Ensure "Show Hidden Files" is enabled in cPanel settings.
- [ ] 4. Upload `dist_update_broadbeach.zip` into the document root for `broadbeachonline.com`.
- [ ] 5. Right-click `dist_update_broadbeach.zip` and select **Extract**.
- [ ] 6. Confirm that `.htaccess` is present alongside `index.html`.
- [ ] 7. Delete `dist_update_broadbeach.zip` from the server.

#### Phase 4: Edge / Vercel Deployment (Alternative / Staging)
- [ ] 1. Push project commits to the designated repository branch.
- [ ] 2. Ensure `vercel.json` is located in the root directory.
- [ ] 3. In Vercel Project Settings, add environment variables (`VITE_APP_URL`, `VITE_API_URL=/api`, etc.).
- [ ] 4. Trigger deployment and verify that edge rewrites route `/api/*` to the PHP backend without CORS errors.

#### Phase 5: Post-Deployment Smoke Verification
- [ ] 1. Open `https://broadbeachonline.com` in an Incognito window.
- [ ] 2. Test user login with a registered account.
- [ ] 3. Navigate to a free course (e.g., Course `322` or `333`) and verify video playback.
- [ ] 4. Complete an assessment, achieve $\ge 70\%$, and verify that the generated certificate shows the logged-in candidate's name in uppercase (`MANOJ`) with a valid `26BB...` certificate ID.
- [ ] 5. Navigate to `https://broadbeachonline.com/verify-certificate`, input the new certificate ID, and confirm that the certificate details resolve correctly.
- [ ] 6. Test direct deep links (e.g., `https://broadbeachonline.com/learning/322`) and verify that refreshing the page does not produce an Apache 404 error.

---

## 6. Maintenance, Disaster Recovery & Support

### 6.1 Database Schema Migrations
All database modifications are stored as non-destructive SQL files in `database/`:
* `2026_11_04_chapter_locking_and_three_chapters_schema.sql` (Progress tracking & chapter completion)
* `2026_11_07_import_official_google_drive_mcq_assessments.sql` (MCQ assessment questions & answers)
* `2026_11_09_import_manual_certificates.sql` (5,400+ historical offline records)
* `2026_11_17_import_certificate_26BB03769.sql` (Manual certificate updates)

To apply migrations manually via phpMyAdmin:
1. Open phpMyAdmin in GoDaddy cPanel.
2. Select database `broad_beach_online`.
3. Open the **Import** tab and upload the required `.sql` migration file.

---

### 6.2 Rollback & Emergency Recovery Protocol

In the event of an unexpected regression or deployment failure:

1. **Frontend Rollback:**
   - Restore the previous version from the automated backup archive:
     `$HOME\Desktop\bb_exp-2.0_backup.zip`
   - Extract the previous `dist` build to the `broadbeachonline.com` web root.
2. **Maintenance Mode Emergency Toggle:**
   - If an ongoing issue requires halting public access temporarily:
     Set `VITE_MAINTENANCE_MODE=true` in `.env`, run `npm run build`, and deploy the build. All routes will redirect to the maintenance notice page with administrative bypass availability.
3. **Database Restoration:**
   - In phpMyAdmin, use the backup dumps located in `database/` to restore previous table states.

---

*End of Documentation — Broadbeach Online Academy Handoff Report*
