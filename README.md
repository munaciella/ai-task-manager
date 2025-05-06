# Flowly

## Live Demo Disclaimer

Please note that the live demo linked above is intended **only** for development and testing. To keep hosting costs low:
- New user registrations may be restricted or disabled at any time.
- Some features may be unstable or unavailable.
- Use this demo **at your own risk**; do **not** rely on it for production data.

---

## Employer / Hiring Inquiries

If you’re an employer interested in leveraging this project, or if you encounter an issue you’d like me to solve, please reach out!  
Email me at: **francesco.vurchio82@gmail.com** with:
1. A brief description of the problem or feature you need, and  
2. Any relevant deadlines or context.  
I’ll get back to you as soon as possible.

---

```markdown
# Flowly

**Flowly** is a real-time, AI-powered Kanban-style task manager that helps teams and individuals organize, prioritize, and collaborate on tasks seamlessly. Built with Next.js, Clerk for authentication, Firebase Firestore for real-time data, and OpenAI for smart suggestions.

---

## Table of Contents

- [Introduction](#-introduction)  
- [Demo](#-demo)  
- [Features](#-features)  
- [Architecture & Tech Stack](#architecture--tech-stack)  
- [Getting Started](#-getting-started)  
   - [Prerequisites](#-prerequisites)  
   - [Installation](#-installation)  
   - [Environment Variables](#-environment-variables)  
   - [Running Locally](#-running-locally)  
- [Folder Structure](#-folder-structure)  
- [Usage Guide](#-usage-guide)  
   - [Authentication](#-authentication)  
   - [Dashboard Overview](#-dashboard-overview)  
   - [Creating & Managing Tasks](#-creating--managing-tasks)  
   - [Columns & Customization](#-columns--customization)  
   - [Search, Filter & Collapse](#-search-filter--collapse)  
   - [AI Suggestions](#-ai-suggestions)    
- [Deployment](#-deployment)  
- [Contributing](#-contributing)  

---

## Introduction

Flowly is designed to streamline your workflow by combining the simplicity of a Kanban board with the power of AI and real-time collaboration. Whether you’re managing personal to-dos or coordinating a team sprint, Flowly scales to your needs.

---

## Demo

[Click to view the deployed version](https://applywise-one.vercel.app/)

---

## Features

- **Real-time Collaboration**: Instant updates across all connected clients via Firestore’s `onSnapshot`.  
- **AI-Powered Suggestions**: Use OpenAI to suggest due dates and priority levels for new tasks.  
- **Drag & Drop Kanban**: Intuitive board with drag-and-drop cards powered by `@dnd-kit`.  
- **Custom Columns**: Add, rename, delete columns; reorder to fit your workflow.  
- **Search & Filter**: Quickly find tasks by title or priority.  
- **Collapse Columns**: Hide or reveal entire columns to focus on what matters.  
- **Dark & Light Themes**: System-aware theming with a toggle.  
- **Background Customization**: Choose your own board background or schedule daily/random rotations.  
- **Notifications & Toasts**: In-app feedback with Sonner toast messages.  
- **Mobile-Friendly**: Responsive design for tablets and phones.

---

## Architecture & Tech Stack

| Layer                  | Technology                      |
| ---------------------- | ------------------------------- |
| **Frontend**           | Next.js, React, TypeScript      |
| **Authentication**     | Clerk                           |
| **Database**           | Firebase Firestore              |
| **Real-time**          | Firestore `onSnapshot`          |
| **AI**                 | OpenAI API                      |
| **Drag & Drop**        | `@dnd-kit/core`, `@dnd-kit/sortable` |
| **UI Components**      | shadcn/ui, Tailwind CSS         |
| **Notifications**      | Sonner                          |
| **Deployment**         | Vercel (frontend)               |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18  
- A Firebase project with Firestore enabled  
- Clerk account and application  
- OpenAI API key  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/munaciella/ai-task-manager.git
   cd ai-task-manager
   ```

2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env.local` in the project root:

```env
NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
CLERK_API_KEY=<your-clerk-backend-key>
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
OPENAI_API_KEY=<your-openai-api-key>
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
├── app/
│   ├── api/
│   │   └── task-suggest/       # OpenAI suggestion endpoint
│   ├── dashboard/
│   │   ├── page.tsx            # Server component, wraps <DashboardClient />
│   │   └── DashboardClient.tsx # Client dashboard UI
│   └── page.tsx                # Home page
├── components/
│   ├── Board.tsx               # Kanban board
│   ├── Column.tsx              # Column UI
│   ├── TaskCard.tsx            # Card UI
│   ├── NewTaskForm.tsx         # Task creation sheet
│   ├── NewColumnForm.tsx       # Column creation form
│   └── BackgroundSettingsDialog.tsx # Background settings
├── lib/
│   └── firebase.ts             # Firebase init
├── types/
│   └── types.ts                # Task, Column interfaces
├── public/
│   └── bg.jpg                  # Default board background
├── .env.local                  # Environment variables
└── README.md
```

---

## Usage Guide

### Authentication

- Sign up or log in via Clerk modal.  
- Unauthenticated users are redirected to the sign-in page.

### Dashboard Overview

- **+ New Task** opens a slide-over form to add details, pick column, AI suggestions, etc.  
- **Add Column** lets you create custom columns that appear alongside “To Do,” “In Progress,” and “Done.”  
- **Search** and **Priority Filter** refine visible tasks instantly.  
- **Sort** control toggles oldest/newest first.

### Creating & Managing Tasks

1. Click **+ New Task**  
2. Fill in **Title**, **Description**, **Due Date**, **Priority**, **Column**  
3. (Optional) **Suggest** AI date and priority  
4. **Save** to push to Firestore  

Tasks can be **dragged** between columns or reordered within the same column. Edit or delete any card via the ⋯ menu.

### Columns & Customization

- **Add** new columns via the form.  
- **Collapse** columns by clicking the chevron in the header.  
- **Rename** or **Delete** columns in the Column component’s dropdown. Deleting a column preserves tasks (they become uncategorized).

### Search, Filter & Collapse

- **Search** bar filters cards by title text (case-insensitive).  
- **Priority Filter** dropdown toggles between All/High/Medium/Low.  
- **Collapse** hides a column’s cards but shows the count of hidden tasks.

### AI Suggestions

- Click **Suggest Date & Priority** in the New Task form.  
- Powered by OpenAI; responses are trimmed and applied to the form fields.

---

## Deployment

1. Push to GitHub.  
2. Link your repo to Vercel for frontend.  
3. Configure environment variables in Vercel dashboard.  
4. For any backend Workers (if used), deploy through Cloudflare dashboard.

---

## Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add YourFeature'`)  
4. Push to branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request

Please follow the existing code style and include tests where applicable.