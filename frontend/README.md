# CCTV-Based Automated Attendance System (Frontend)

An interactive, real-time web application built with **React** and **Vite** that serves as the administrative control panel for the CCTV-Based Automated Attendance System. The platform enables academic institutions to completely automate classroom attendance monitoring by connecting directly to an intelligent edge processing backend executing facial recognition tasks (via MTCNN and FaceNet).

---

## 🚀 Key Features

- **🔒 Guarded Router Session Tracking**: State-persistent session handling built over a centralized React Context framework utilizing secure JSON Web Tokens (JWT).
- **📹 Live Monitoring & Stream Playback**: A specialized viewing deck designed to render live CCTV camera matrices paired side-by-side with instantaneous rolling verification logs.
- **⚡ Reactive Data Streaming**: Low-latency event listener protocols (WebSockets / Server-Sent Events) that pipe identified student records instantly to the UI without forcing page invalidations.
- **👥 Student Roster Registry**: An administrative control panel enabling management of student profiles, academic parameters, and image enrollment payloads for embedding computations.
- **📊 Granular Analytics Reporting**: Searchable, filterable historic logs (by Date, Semester, or Class Roll Section) with embedded client-side tools to export datasets into CSV formats.
- **🎨 Unified Single-Page Architecture**: Fluid layout assembly optimized with grid layouts, a persistent side navigation channel, and structural view caching via standard router outlets.

---

## 📂 Codebase Directory Layout

This project follows a modular, **feature-driven layout pattern** designed to bundle business logic, visual interfaces, and isolated style scopes together for maintenance and scalability:

```text
src/
├── assets/                  # Centralized static resources and unified branding layouts
│   ├── css/                 # Variable foundations and global utility declarations
│   └── images/              # Media vectors, icons, and academic logos
├── components/              # Globally shared layout shells (Sidebar, Navbar, MainLayout)
├── context/                 # Application-wide global state engines (AuthContext wrapper)
├── features/                # Domain-specific application engines (Encapsulated scopes)
│   ├── auth/                # Sign-in forms and credentials validations
│   ├── dashboard/           # Aggregate numerical analytics and distribution metrics
│   ├── live-stream/         # Video stream matrix configurations and live event tables
│   ├── students/            # Profile card managers and image registration prompts
│   └── attendance/          # Filterable historical record grids and download triggers
├── hooks/                   # Custom reusable utility hooks (useAuth, useFetch)
├── routes/                  # AppRoutes configuration maps and ProtectedRoute gatekeepers
├── services/                # Network-layer configurations and isolated Axios API clients
└── utils/                   # Pure utility tools (date-string formatters, validation checkers)
```
