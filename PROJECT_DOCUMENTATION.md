# Altata Légal - Automation Hub Documentation

Welcome to the official documentation for the **Altata Légal Automation Hub**. This document serves as the **Single Source of Truth** for the project, providing a comprehensive overview of the architecture, design system, and implementation details for developers and stakeholders.

---

## 1. Project Overview

### 1.1 What the project is
The Automation Hub is a premium, enterprise-grade dashboard designed for **Altata Légal** to manage and monitor legal automation pipelines. It centralizes document transcriptions, contract generation, and CRM synchronization into a single, high-fidelity interface.

### 1.2 Purpose of the dashboard
- **Pipeline Orchestration**: Monitor the health and status of multiple automation flows (n8n connected).
- **Manual Intervention**: Provide interfaces for human-in-the-loop approvals (CRM synchronization).
- **Performance Analytics**: visualize ROI, time saved, and success rates across all legal automations.
- **Error Resolution**: centralize pipeline logs for rapid debugging and retrying.
- **Access Control**: ensure only authorized legal personnel can access sensitive case data.

### 1.3 Target Users
- **Admin**: Full system access, member management, and performance auditing.
- **Employee**: Access to dashboard, pipeline monitoring, and data approval tasks.

### 1.4 Key Features
- **Secure Authentication**: Email/Password login with session persistence.
- **Role-Based Authorization**: Strict access control for admin-only features.
- **Real-time KPI Tracking**: Live metrics on contracts, tokens, and savings.
- **Interactive Charts**: Visual breakdown of generation trends and contract types.
- **Approval Workflow**: Streamlined list for validating CRM data points.
- **Error Registry**: Severity-based logging for pipeline maintenance.

---

## 2. Tech Stack Explanation

### 2.1 React JS (Vite)
- **Choice**: Vite provides an ultra-fast development experience with Hot Module Replacement (HMR).
- **Benefit**: React 19 ensures a highly responsive UI that feels alive.

### 2.2 Tailwind CSS
- **Choice**: Utility-first CSS framework.
- **Benefit**: Enables the "Premium SaaS" look through custom theme tokens for charcoal/gold backgrounds and glows.

### 2.3 React Query (TanStack Query)
- **Choice**: Powerful asynchronous state management.
- **Benefit**: Manages caching, loading states, and mutations with automatic invalidation.

### 2.4 Supabase
- **Database**: PostgreSQL for storing profiles, transcripts, contracts, and logs.
- **Authentication**: Supabase Auth handles secure login, session management, and password recovery.
- **Authorization**: Row Level Security (RLS) is used to protect data at the database level.

### 2.5 Recharts
- **Benefit**: offers high customizability for dark themes and gold accents.

---

## 3. Architecture

The project implements a **Feature-Based Scalable Structure (Page → Hook → Service → Supabase)**.

### 3.1 Folder-by-Folder Breakdown
- `src/features/auth/`: Login, password reset, and session context logic.
- `src/features/admin/`: User management and administrative tools.
- `src/features/[domain]/`: Feature-specific logic (dashboard, contracts, etc.).
- `src/components/auth/`: Guards for protecting routes (`AuthGuard`, `AdminGuard`).
- `src/components/ui/`: Atomic, reusable UI primitives.
- `src/components/layout/`: Global layout components (Sidebar, AppLayout).
- `src/lib/`: Shared utilities and Supabase client.
- `src/routes/`: Central routing configuration with protection logic.

### 3.2 Responsibility of Each Layer
| Layer | Responsibility |
| :--- | :--- |
| **Pages** | Orchestrate hooks and handle UI state for specific URL paths. |
| **Hooks** | Manage React Query state (queries/mutations) and business logic. |
| **Services** | Pure async functions directy interacting with Supabase clients. |
| **Guards** | Intercept routing to enforce authentication or role requirements. |
| **Context** | Global state for auth session and profile data. |

---

## 4. Authentication & Authorization

### 4.1 Auth Flow
1. **Login**: Users authenticate with email and password via `LoginPage`.
2. **Session**: `AuthContext` listens for session changes and fetches the user's `profile`.
3. **Recovery**: `ForgotPasswordPage` triggers a password reset email via Supabase.
4. **Update**: Authenticated users can change their password in the Security settings.

### 4.2 Role Model
The system supports two roles defined in the `profiles` table:
- **`admin`**: Can access the "User Management" area and invite new employees.
- **`employee`**: Standard access to pipelines and data without administrative privileges.

### 4.3 Route Protection
- **Public Routes**: accessible by anyone (Login, Forgot Password).
- **Protected Routes**: require a valid session (`AuthGuard`).
- **Admin Routes**: require a valid session AND `admin` role (`AdminGuard`).

---

## 5. Component System

### 5.1 Reusable Components
1. **ActionButton**: Themed buttons supporting `primary`, `secondary`, `outline`, and `ghost` variants.
2. **StatCard**: metric display with large values, labels, and trend type indicators.
3. **StatusBadge**: Multi-state pill badges for status tracking.
4. **SectionCard**: consistent container for content blocks.
5. **SidebarNav**: role-aware navigation with integrated status counters.

---

## 6. Design System

### 6.1 Color Palette
- **Background**: `#09090b` (Deep Charcoal) - The base of the application.
- **Surface**: `#121214` - Elevated card backgrounds.
- **Primary**: `#cfb53b` (Gold) - accents and primary actions.
- **Status Colors**: Success (Emerald), Error (Rose), Warning (Amber).
- **Text**: Off-white for headers; Muted silver for body text.

---

## 7. Pages Breakdown

### 7.1 Dashboard
- **Purpose**: High-level execution overview and ROI metrics.
- **Access**: All authenticated users.

### 7.2 User Management (Admin)
- **Purpose**: Invite team members and manage access.
- **Access**: Admin only.
- **Features**: User list, invite modal, password reset trigger.

### 7.3 CRM Approval & Contracts
- **Purpose**: Pipeline validation and document registry.
- **Access**: All authenticated users.

### 7.4 Security Settings
- **Purpose**: Personal account security and password updates.
- **Access**: All authenticated users.

---

## 8. State Management & Data Flow

### 8.1 Approach
- **Server State**: Handled natively by `@tanstack/react-query`.
- **Auth State**: Handled by `AuthContext` using Supabase subscription.
- **Invalidation**: Mutations automatically invalidate related queries to keep the UI in sync.

---

## 9. UX Decisions

- **Premium Feel**: implemented via `shadow-premium` and `gold-glow` shadows.
- **Role Visibility**: Navigation items are hidden for non-admin users to reduce interface noise.
- **Loading UX**: Consistent skeletons and spinners during auth checks to prevent flash of unstyled content.

---

## 10. Getting Started

### 10.1 Running Locally
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Populate VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY inside .env

# Run development server
npm run dev
```

### 10.2 Database Preparation
Ensure the `profiles` table exists in your Supabase project with the following fields:
- `id` (uuid, primary key, references auth.users.id)
- `email` (text)
- `full_name` (text)
- `role` (text, default 'employee')
- `is_active` (boolean, default true)

---

*Last Updated: 2026-04-11*
7*
