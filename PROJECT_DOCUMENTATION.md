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

### 1.3 Target Users
- **Senior Partners**: For high-level ROI and efficiency monitoring.
- **Legal Assistants**: For managing transcriptions and approving CRM data.
- **Operations Managers**: For monitoring pipeline reliability and error rates.

### 1.4 Key Features
- **Real-time KPI Tracking**: Live metrics on contracts, tokens, and savings.
- **Interactive Charts**: Visual breakdown of generation trends and contract types.
- **Approval Workflow**: Streamlined list for validating CRM data points.
- **Error Registry**: Severity-based logging for pipeline maintenance.

---

## 2. Tech Stack Explanation

### 2.1 React JS (Vite)
- **Choice**: Vite provides an ultra-fast development experience with Hot Module Replacement (HMR).
- **Benefit**: React 19's performance optimizations and modern hook patterns ensure a highly responsive UI that feels alive.

### 2.2 Tailwind CSS
- **Choice**: Utility-first CSS framework.
- **Benefit**: Allows for precise, consistent styling while maintaining a tiny bundle size. It enables the "Premium SaaS" look through custom theme tokens for charcoal/gold backgrounds and glows.

### 2.3 React Query (TanStack Query)
- **Choice**: Powerful asynchronous state management.
- **Benefit**: Even with mock data, it establishes the pattern for caching, loading states, and background refetching, making the transition to real APIs seamless.

### 2.4 Recharts
- **Choice**: Composable charting library for React.
- **Benefit**: Offers high customizability for dark themes and gold accents, ensuring the charts match the "LegalTech Premium" aesthetic.

---

## 3. Architecture

The project implements a **Feature-Based Scalable Structure**, isolating domain logic to ensure maintainability.

### 3.1 Folder-by-Folder Breakdown
- `src/features/`: Domain-specific business logic and pages. Contains hooks, services, sub-components, and mappers.
- `src/components/ui/`: Atomic, reusable UI primitives.
- `src/components/layout/`: Global layout components (Sidebar, AppLayout).
- `src/lib/`: Shared utilities and helper functions (e.g., Supabase client).
- `src/routes/`: Routing configuration and navigation mapping.

### 3.2 Responsibility of Each Layer
| Layer | Responsibility |
| :--- | :--- |
| **Components (UI)** | Presentation only. Should be data-agnostic and highly reusable. |
| **Features** | Domain logic. Exposes purely through React Query `hooks.js`. Provides transformations via `mappers.js`. |
| **Services** | Contained inside features. The ONLY place where `supabase` is imported. |
| **Routes** | Manage application state via URLs and wrap pages in layouts. |
| **Lib** | Tech-side helpers (e.g., DB connection, class mergers). |

---

## 4. Component System

### 4.1 Reusable Components
1. **ActionButton**: Themed buttons supporting `primary`, `secondary`, `outline`, and `ghost` variants.
2. **StatCard**: metric display with large values, labels, and trend type indicators (success, error, warning).
3. **StatusBadge**: Multi-state pill badges for status tracking (Generated, Failed, Processing, etc.).
4. **SectionCard**: consistent container with optional header actions and subtle border styling.
5. **SidebarNav**: categorised navigation with integrated status counters and branding.

### 4.2 Guidelines
- Use **ActionButton** for all interactions to ensure consistent focus and hover states.
- Use **SectionCard** for any block of content to maintain uniform elevation and spacing.

---

## 5. Design System

### 5.1 Color Palette
- **Background**: `#09090b` (Deep Charcoal) - The base of the application.
- **Surface**: `#121214` - Elevated card backgrounds.
- **Primary**: `#cfb53b` (Gold) - Primary buttons, active states, and brand accents.
- **Success**: `#10b981` (Emerald) - Positive trends and "Generated" states.
- **Error**: `#ef4444` (Rose) - Alerts and "Failed" pipeline states.
- **Text**: Off-white (`#f4f4f5`) for headers; Muted silver (`#a1a1aa`) for body text.

### 5.2 Typography
- **Font Family**: Inter (Sans-serif) via Google Fonts/System stack.
- **Guidelines**: Bold weights for KPIs; Monospace font for technical scores and Log IDs.

### 5.3 Spacing & Layout
- 10-unit (`p-10`) padding for main containers.
- 4-unit (`gap-4`) spacing for KPI grids.
- 10-unit (`space-y-10`) vertical rhythm for page sections.

---

## 6. Pages Breakdown

### 6.1 Dashboard
- **Purpose**: High-level execution overview.
- **Components**: `StatCard` grid, `BarChart` (Recharts), `RecentActivity`.
- **Data**: Driven by `DASHBOARD_STATS` and `CONTRACTS_CHART_DATA`.

### 6.2 CRM Approval
- **Purpose**: Human validation of extracted client data.
- **Structure**: Vertical list of rich cards with initials-based avatars.
- **Components**: `ApprovalItem` style cards, `ActionButton` groups.

### 6.3 Contracts
- **Purpose**: Registry of generated legal documents.
- **Structure**: KPI header followed by a Data Table and a Distribution Pie Chart.
- **Components**: `PieChart` (Recharts), `StatusBadge`.

### 6.4 Transcriptions & Errors
- **Purpose**: Monitoring the raw pipeline ingest and debugging failures.
- **Structure**: Status-rich lists with processing animations and retry logic UI.

---

## 7. State Management & Data Flow

### 7.1 Approach
- **Data State**: Handled natively by `@tanstack/react-query` calling our service layer.
- **Service Layer**: Pure fetch/mutation commands directly hitting `Supabase`.
- **UI State**: Handled locally via `useState` for things like filters and toggle states.

### 7.2 Strict Serverless Flow
1. **Component**: Requests data using a custom hook (e.g., `useClientsListQuery`).
2. **Hook**: Manages loading state and error states. Calls the service.
3. **Service**: Fetches data from `Supabase`.
4. **Mapper**: Converts the DB Row response into a typed frontend model logic.

---

## 8. UX Decisions

- **Premium Feel**: implemented via `shadow-premium` and `gold-glow` shadows to give a sense of depth and luxury.
- **Processing states**: animated pulses on processing badges to indicate "live" work.
- **Empty States**: custom illustrations and CTAs for when lists are empty (e.g., transcription upload).
- **Hover Transitions**: `transition-all duration-300` on all cards to make the dashboard feel responsive to curiosity.

---

## 9. Scalability & Future Integration

### 9.1 Path to Production
1. **Migrations & Schemas**: Generate strict TypeScript interfaces using Supabase CLI.
2. **Authentication**: Set up RLS (Row Level Security) and handle login dynamically.
3. **Real-time**: Integrate WebSockets for live pipeline updates on the Dashboard and Errors pages.

### 9.2 Safe Extension
New features should be added as new folders in `src/features/`. Any shared UI component discovered during this process should be extracted to `src/components/ui/`.

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

# Build for production
npm run build
```

### 10.2 Entry Points
- `src/App.jsx`: Root application shell.
- `src/routes/index.jsx`: Primary navigation mapping.
- `src/components/layout/AppLayout.jsx`: Main UI wrapper for all pages.

---

## 11. Assumptions & Notes
- **Inferred Logic**: confidence scores on the CRM page are assumed to be 0.0-1.0 based on common LLM output formats.
- **Layout**: Sidebar collapse was not implemented to maintain the "enterprise hub" feel from the screenshots.

---
*Last Updated: 2026-04-07*
