# HYPERMIND AI — FRONTEND ARCHITECTURE SPECIFICATION

```text
====================================================================================================
PROJECT:        HYPERMIND Universal AI Ecosystem Platform
DOCUMENT TYPE:  Frontend Architecture Specification & Engineering Standards
DOCUMENT ID:    HM-ARCH-05
DATE:           November 15, 2026
VERSION:        1.0.0
STATUS:         Approved for Implementation
CLASSIFICATION: Engineering Confidential
AUTHORS:        HYPERMIND Core Architecture Team (Stream 2)
TARGET STACK:   Next.js 14+ / React 18 / TypeScript 5+ / Tailwind CSS 3.4 / shadcn/ui / Zustand
====================================================================================================
```

---

## Source Verification & Authority Index

In compliance with HYPERMIND engineering governance standards, all architectural statements, technology selections, interfaces, and metric baselines within this document are tagged with their authoritative origin:

- **[A] Officially Verified**: Confirmed by official vendor documentation (Next.js, React, Vercel AI SDK, Tailwind CSS, Radix UI / shadcn/ui, Monaco Editor, Zustand).
- **[B] Announced / Preview**: Documented in official vendor roadmaps, developer previews, or beta APIs.
- **[C] Third-Party Observation**: Documented in industry benchmarks, peer-reviewed engineering analyses, or high-scale production postmortems.
- **[D] Engineering Recommendation**: Architectural decision or design pattern formulated by the HYPERMIND Core Architecture Team based on functional requirements and trade-off analysis.
- **[E] Unverified Assumption**: Preliminary sizing or planning assumption subject to Day 5 load testing and empirical verification.

---

## Table of Contents

1. [Architectural Principles & Client Runtime Goals](#1-architectural-principles--client-runtime-goals)
2. [Next.js 14+ App Router & Directory Structure](#2-nextjs-14-app-router--directory-structure)
3. [Server Components vs. Client Components Strategy](#3-server-components-vs-client-components-strategy)
4. [Component Architecture: Atomic Design System](#4-component-architecture-atomic-design-system)
5. [Unified State Management Architecture](#5-unified-state-management-architecture)
6. [Real-Time Streaming & Communication Layer](#6-real-time-streaming--communication-layer)
7. [Design System & Theme Engine](#7-design-system--theme-engine)
8. [Motion, Animation & Transitions](#8-motion-animation--transitions)
9. [Form Handling, Validation & File Ingestion](#9-form-handling-validation--file-ingestion)
10. [Specialized Workspace Integrations](#10-specialized-workspace-integrations)
    - [10.1 Monaco Code Studio Integration](#101-monaco-code-studio-integration)
    - [10.2 Markdown & Code Rendering Pipeline](#102-markdown--code-rendering-pipeline)
    - [10.3 Voice & Audio Synthesis Interface](#103-voice--audio-synthesis-interface)
11. [Accessibility (a11y) & WCAG 2.1 AA Compliance](#11-accessibility-a11y--wcag-21-aa-compliance)
12. [Performance Engineering & Core Web Vitals](#12-performance-engineering--core-web-vitals)
13. [Resilience, Error Boundaries & Telemetry](#13-resilience-error-boundaries--telemetry)
14. [Master Frontend Architectural Diagrams](#14-master-frontend-architectural-diagrams)
    - [14.1 Component Hierarchy Diagram](#141-component-hierarchy-diagram)
    - [14.2 State Management & Streaming Flow Diagram](#142-state-management--streaming-flow-diagram)
15. [Document Status & Next Milestones](#15-document-status--next-milestones)

---

## 1. Architectural Principles & Client Runtime Goals

The HYPERMIND frontend is engineered as a high-density, real-time operating surface for generative intelligence [D]. Unlike traditional CRUD web applications, an AI-native workspace requires continuous reactive token streaming, complex multi-pane window orchestration, multi-modal drag-and-drop ingestion, and sub-16ms UI responsiveness (60 FPS) during heavy LLM output streams [D].

### Core Runtime Goals:
- **Instant Interactive First Load**: Time to Interactive (TTI) < 1.2s on desktop broadband; First Contentful Paint (FCP) < 0.8s [D, E].
- **Zero-Jank Token Streaming**: Token insertion into the DOM must not trigger layout recalculations across unrelated panes; token rendering is debounced or scheduled via React 18 `startTransition` and CSS containment (`contain: content`) [A, D].
- **Sub-50ms Input-to-Feedback Latency**: Optimistic UI rendering for all user actions (chat submission, pane toggling, mode switching, code edits) [D].
- **Offline & Reconnection Grace**: WebSocket and SSE disconnects reconnect automatically with exponential backoff and resume streaming state without losing conversational history [D].

---

## 2. Next.js 14+ App Router & Directory Structure

The frontend application adopts the Next.js 14+ App Router paradigm [A], utilizing route groups to cleanly decouple public marketing assets, isolated authentication flows, and the authenticated high-density workspace.

```text
apps/web/
├── app/
│   ├── (auth)/                         # Isolated Authentication Flow
│   │   ├── layout.tsx                  # Centered minimalist card layout
│   │   ├── login/
│   │   │   └── page.tsx                # Email/Password + OAuth sign-in
│   │   ├── register/
│   │   │   └── page.tsx                # User registration
│   │   ├── verify/
│   │   │   └── page.tsx                # Email verification / magic link
│   │   └── reset-password/
│   │       └── page.tsx                # Password reset trigger & confirmation
│   ├── (marketing)/                    # Public Landing & Documentation
│   │   ├── layout.tsx                  # Marketing header, footer, announcement banner
│   │   ├── page.tsx                    # Hero, feature showcase, dynamic pricing
│   │   ├── docs/
│   │   │   └── [...slug]/page.tsx      # Static/ISR documentation viewer
│   │   └── pricing/
│   │       └── page.tsx                # Subscription comparison table
│   ├── (workspace)/                    # Authenticated Application Workspace
│   │   ├── layout.tsx                  # Root workspace shell: NavRail + ContextDrawer
│   │   ├── chat/
│   │   │   ├── page.tsx                # Default new chat surface
│   │   │   └── [conversationId]/
│   │   │       └── page.tsx            # Active conversation thread
│   │   ├── documents/
│   │   │   ├── page.tsx                # Document library & vector collections
│   │   │   └── [documentId]/
│   │   │       └── page.tsx            # Split-screen PDF viewer + RAG chat
│   │   ├── research/
│   │   │   ├── page.tsx                # Deep web research console
│   │   │   └── [researchId]/
│   │   │       └── page.tsx            # Multi-source synthesis report
│   │   ├── code/
│   │   │   ├── page.tsx                # Monaco studio, project file tree
│   │   │   └── [projectId]/
│   │   │       └── page.tsx            # Multi-file code workspace
│   │   ├── agents/
│   │   │   ├── page.tsx                # Agent directory & DAG execution tracker
│   │   │   └── [taskId]/
│   │   │       └── page.tsx            # Step-by-step DAG run visualizer
│   │   ├── studio/                     # Post-MVP Creative Studio
│   │   │   └── page.tsx                # Canvas generation & prompt lab
│   │   └── settings/
│   │       ├── layout.tsx              # Settings side navigation
│   │       ├── account/page.tsx        # Profile, avatar, email
│   │       ├── appearance/page.tsx     # Theme, density, fonts
│   │       ├── models/page.tsx         # Default provider preferences & API keys
│   │       └── usage/page.tsx          # Token burn charts & billing portal
│   ├── api/                            # Next.js Route Handlers
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts                # NextAuth v5 Route Handler [A]
│   │   ├── chat/
│   │   │   └── route.ts                # Vercel AI SDK Core proxy / Edge bridge [A]
│   │   └── upload/
│   │       └── presign/route.ts        # Cloudflare R2 presigned URL signer [A]
│   ├── favicon.ico
│   ├── globals.css                     # Tailwind base + CSS variable design tokens
│   └── layout.tsx                      # Root HTML, ThemeProvider, ToastProvider, Fonts
├── components/
│   ├── atoms/                          # Atomic primitives (Buttons, Badges, Inputs)
│   ├── molecules/                      # Molecule compositions (ModelPill, TokenCounter)
│   ├── organisms/                      # Complex organisms (ChatFeed, MonacoEditor, Sidebar)
│   ├── templates/                      # Workspace layouts & pane splitters
│   └── ui/                             # shadcn/ui generated Radix primitives
├── hooks/                              # Custom React Hooks
│   ├── use-chat-stream.ts              # Wrapped @ai-sdk/react useChat with custom telemetry
│   ├── use-socket.ts                   # Socket.io connection manager for agent updates
│   ├── use-keyboard-shortcuts.ts       # Global hotkey listener
│   ├── use-media-query.ts              # Breakpoint detection hook
│   └── use-file-upload.ts              # Chunked presigned R2 upload hook
├── lib/                                # Utility Modules
│   ├── auth.ts                         # NextAuth v5 client & server helpers
│   ├── constants.ts                    # Model capabilities, limits, pricing
│   ├── formatters.ts                   # Number, currency, token, date formatters
│   ├── socket.ts                       # Singleton Socket.io client instance
│   └── utils.ts                        # cn() classnames merger (clsx + tailwind-merge)
├── stores/                             # Zustand Client State Stores
│   ├── workspace-store.ts              # Sidebar open/closed, active pane, drawer
│   ├── model-store.ts                  # Active model selection, temperature, max tokens
│   ├── agent-store.ts                  # Live agent execution status, DAG nodes, HITL queue
│   └── code-store.ts                   # Active file, tabs, editor language, dirty state
├── styles/
│   └── themes.css                      # Semantic CSS variables for light/dark modes
├── types/                              # Shared TypeScript Interfaces
│   ├── chat.ts                         # Message, Conversation, Chunk, Citation types
│   ├── agent.ts                        # Agent, TaskNode, DAG, HITL types
│   └── models.ts                       # ModelDefinition, Provider, CostMatrix types
├── middleware.ts                       # Edge authentication & route protection [A]
├── next.config.mjs                     # Next.js optimization configuration
├── tailwind.config.ts                  # Tailwind theme, plugins, and color scales
└── tsconfig.json                       # Strict TypeScript 5 configuration
```

---

## 3. Server Components vs. Client Components Strategy

Next.js 14’s architecture demands a rigorous boundary between React Server Components (RSC) and Client Components (`'use client'`) [A].

```
+-----------------------------------------------------------------------------------+
| SERVER COMPONENT TREE (Default)                                                  |
| - Layout scaffolding & HTML skeleton                                             |
| - Authentication session validation (headers(), cookies())                        |
| - Initial database / backend data fetching (Conversation list, user profile)       |
| - Static marketing copy & documentation markdown                                  |
+-----------------------------------------------------------------------------------+
                                         │
                         Leaves / Interaction Boundaries
                                         ▼
+-----------------------------------------------------------------------------------+
| CLIENT COMPONENT LEAF ISLANDS ('use client')                                     |
| - Conversational message stream & input box (@ai-sdk/react useChat)               |
| - Monaco code editor instance & syntax highlighter                                |
| - Resizable pane splitters & sliding drawers (react-resizable-panels)             |
| - Interactive dropzones (react-dropzone) & file progress bars                     |
| - Audio waveform visualizer & Web Audio API synthesizers                          |
+-----------------------------------------------------------------------------------+
```

### 3.1 Decision Rules Matrix
1. **Server Components by Default**: Every layout, page, and container begins as an async Server Component. Data is fetched server-to-server with zero client roundtrips [A, D].
2. **Push Client Boundaries to the Leaves**: A component only receives the `'use client'` directive if it consumes React state (`useState`, `useReducer`), lifecycle effects (`useEffect`), browser APIs (Web Audio, LocalStorage, Monaco), or event handlers (`onClick`, `onChange`) [A, D].
3. **Serialization Hygiene**: Only JSON-serializable primitives (strings, numbers, booleans, plain arrays, objects) are passed across the Server-to-Client boundary. Functions, class instances, and raw backend models with sensitive columns are never passed directly [D].
4. **Hydration Suppression on Streaming**: High-frequency streaming text chunks are kept inside isolated client leaf components (`<StreamingMessageDelta />`) to prevent parent component re-render cascades [D].

---

## 4. Component Architecture: Atomic Design System

HYPERMIND structures all UI components using an enhanced Atomic Design taxonomy [D], standardizing component granularity, props interfaces, and styling tokens:

```
Atoms (Base UI) ──> Molecules (Compositions) ──> Organisms (Features) ──> Templates (Layouts) ──> Pages (Routes)
```

### 4.1 Taxonomy & Directory Mapping

| Atomic Level | Description | Examples | Directory |
| :--- | :--- | :--- | :--- |
| **Atoms** | Indivisible UI elements; stateless or pure visual primitives. Zero domain knowledge. | `Button`, `Badge`, `Input`, `Avatar`, `Spinner`, `Tooltip`, `Separator`, `Switch` | `components/atoms/` & `components/ui/` |
| **Molecules** | Functional combinations of 2–3 atoms serving a specific interaction unit. | `SearchInput` (Input + SearchIcon + KbdHint), `ModelBadge` (Avatar + Text + CostTag), `AttachmentChip` (Icon + Filename + RemoveBtn) | `components/molecules/` |
| **Organisms** | Complex, domain-aware UI blocks encapsulating distinct feature functionality. | `MessageFeed`, `PromptInputBar`, `MonacoEditorContainer`, `AgentTaskTimeline`, `SourceCitationPanel`, `DocumentViewer` | `components/organisms/` |
| **Templates** | Structural scaffolding defining pane splits, header slots, navigation rails, and responsive layouts. | `WorkspaceLayoutTemplate`, `SplitPaneLayoutTemplate`, `SettingsLayoutTemplate` | `components/templates/` |
| **Pages** | Concrete route entry points feeding server-fetched data into layout templates. | `ChatPage`, `DocumentAnalysisPage`, `CodingStudioPage`, `ResearchReportPage` | `app/(workspace)/...` |

---

## 5. Unified State Management Architecture

To balance real-time responsiveness, local persistence, and memory consumption, state is separated into three distinct tiers [D]:

```
+----------------------------------------------------------------------------------+
| 1. SERVER STATE (Cache & Invalidation)                                          |
| Engine: TanStack Query v5 / SWR                                                  |
| Scope: Conversation summaries, user profiles, usage statistics, documents list  |
| Strategy: Stale-While-Revalidate, 60s cache TTL, optimistic cache mutations     |
+----------------------------------------------------------------------------------+
                                         │
+----------------------------------------------------------------------------------+
| 2. CLIENT WORKSPACE STATE (Transient Interactive State)                          |
| Engine: Zustand Stores                                                           |
| Scope: Active model config, pane sizes, drawer states, active editor tab         |
| Strategy: In-memory store, selective localStorage sync via 'persist' middleware |
+----------------------------------------------------------------------------------+
                                         │
+----------------------------------------------------------------------------------+
| 3. REAL-TIME STREAMING STATE (High-Frequency Transient Buffer)                  |
| Engine: @ai-sdk/react (useChat) + Socket.io Event Bus                            |
| Scope: Incoming token deltas, tool-call progress, agent execution steps          |
| Strategy: Direct hook state, requestAnimationFrame throttled DOM updates        |
+----------------------------------------------------------------------------------+
```

### 5.1 Zustand Workspace Store Specification (`workspace-store.ts`)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  // Navigation & Layout
  isNavRailCollapsed: boolean;
  toggleNavRail: () => void;
  isContextDrawerOpen: boolean;
  activeContextDrawerTab: 'citations' | 'files' | 'agent-logs' | 'model-params';
  setContextDrawerTab: (tab: WorkspaceState['activeContextDrawerTab']) => void;
  toggleContextDrawer: (open?: boolean) => void;

  // Active Model Configuration
  selectedModelId: string;
  temperature: number;
  maxOutputTokens: number;
  systemPromptOverride: string | null;
  setModelConfig: (config: Partial<Pick<WorkspaceState, 'selectedModelId' | 'temperature' | 'maxOutputTokens' | 'systemPromptOverride'>>) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      isNavRailCollapsed: false,
      toggleNavRail: () => set((state) => ({ isNavRailCollapsed: !state.isNavRailCollapsed })),
      isContextDrawerOpen: false,
      activeContextDrawerTab: 'citations',
      setContextDrawerTab: (tab) => set({ activeContextDrawerTab: tab, isContextDrawerOpen: true }),
      toggleContextDrawer: (open) => set((state) => ({ isContextDrawerOpen: open ?? !state.isContextDrawerOpen })),

      selectedModelId: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxOutputTokens: 4096,
      systemPromptOverride: null,
      setModelConfig: (config) => set((state) => ({ ...state, ...config })),
    }),
    {
      name: 'hypermind-workspace-prefs',
      partialize: (state) => ({
        isNavRailCollapsed: state.isNavRailCollapsed,
        selectedModelId: state.selectedModelId,
      }),
    }
  )
);
```

---

## 6. Real-Time Streaming & Communication Layer

Real-time interaction operates via two distinct communication channels, each optimized for its performance profile [D]:

### 6.1 Server-Sent Events (SSE) via Vercel AI SDK
- **Channel**: HTTP POST `/api/chat` returning `Transfer-Encoding: chunked` with `Content-Type: text/event-stream` [A].
- **Client Hook**: `@ai-sdk/react` `useChat` [A].
- **Payload Schema**: Vercel AI Data Stream Protocol emitting text parts, tool call invitations, tool call results, and terminal finish reasons [A].

```typescript
// Custom abstraction hook wrapping @ai-sdk/react
'use client';

import { useChat as useBaseChat } from '@ai-sdk/react';
import { useWorkspaceStore } from '@/stores/workspace-store';

export function useChatStream(conversationId: string) {
  const { selectedModelId, temperature } = useWorkspaceStore();

  return useBaseChat({
    id: conversationId,
    api: '/api/chat',
    body: {
      conversationId,
      model: selectedModelId,
      temperature,
    },
    onError: (error) => {
      console.error('[HYPERMIND Stream Error]:', error);
    },
    onFinish: (message) => {
      // Trigger cache invalidation for conversation summaries
    },
  });
}
```

### 6.2 Bidirectional WebSocket Gateway (Socket.io)
- **Channel**: Persistent WSS connection to `/ws/agents` on the NestJS backend [A, D].
- **Use Cases**: Live multi-step agent execution updates, Human-In-The-Loop approval modal triggers, real-time token quota alerts [D].
- **Client Reconnection Strategy**: Exponential backoff (1s, 2s, 4s, 8s, max 15s) with automatic queueing of outbound messages during offline state [D].

---

## 7. Design System & Theme Engine

HYPERMIND is designed with a **Dark-First Architectural Philosophy** [D]. The interface evokes deep technical clarity, minimal visual noise, and intentional vibrant violet/blue accents.

### 7.1 CSS Variables & Semantic Tokens (`styles/themes.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base Surface Scales (Light Mode) */
    --background: 220 20% 98%;
    --foreground: 224 71% 4%;
    --card: 0 0% 100%;
    --card-foreground: 224 71% 4%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71% 4%;

    /* Brand Primary: Deep Violet to Indigo */
    --primary: 250 84% 54%;
    --primary-foreground: 210 20% 98%;

    /* Accent & Secondary */
    --secondary: 220 14% 96%;
    --secondary-foreground: 220 9% 46%;
    --accent: 262 83% 58%;
    --accent-foreground: 210 20% 98%;

    /* Semantic States */
    --success: 142 71% 45%;
    --warning: 38 92% 50%;
    --destructive: 0 84% 60%;
    --info: 199 89% 48%;

    /* Structural & Borders */
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 250 84% 54%;
    --radius: 0.5rem;
  }

  .dark {
    /* Base Surface Scales (Dark Mode - Default) */
    --background: 224 71% 4%;         /* Deep Obsidian #080B11 */
    --foreground: 210 20% 98%;
    --card: 222 47% 7%;              /* Elevated Dark #0F141E */
    --card-foreground: 210 20% 98%;
    --popover: 222 47% 7%;
    --popover-foreground: 210 20% 98%;

    /* Brand Primary: Electric Violet Gradient Anchor */
    --primary: 252 87% 67%;          /* #7C65F6 */
    --primary-foreground: 224 71% 4%;

    /* Accent & Secondary */
    --secondary: 217 33% 13%;        /* #151D2A */
    --secondary-foreground: 210 20% 80%;
    --accent: 263 70% 50%;           /* #8B5CF6 */
    --accent-foreground: 210 20% 98%;

    /* Semantic States */
    --success: 142 76% 36%;
    --warning: 38 92% 50%;
    --destructive: 0 62% 45%;
    --info: 199 89% 48%;

    /* Structural & Borders */
    --border: 217 33% 15%;           /* Subtle Border #1A2434 */
    --input: 217 33% 15%;
    --ring: 252 87% 67%;
  }
}
```

### 7.2 Theme Detection & Persistence
- Managed via `next-themes` [A] supporting `light`, `dark`, and `system` preferences.
- Anti-flash script injected in `<head>` ensures zero theme flash during SSR hydration [A, D].

---

## 8. Motion, Animation & Transitions

HYPERMIND enforces a tiered motion model balancing fluid aesthetic delight with performance efficiency [D]:

### 8.1 Motion Tiering
1. **Micro-Interactions (CSS Only)**: Button hover states, input focus outlines, model pill transitions. Executed strictly with CSS hardware-accelerated properties (`opacity`, `transform`) using standard durations: `150ms ease-out` [D].
2. **Layout & Panes (Framer Motion)**: Resizable drawer collapse/expand, navigation rail transitions, modal dialog entrances.
3. **Reduced Motion Compliance**: Evaluates `prefers-reduced-motion: reduce`. When active, all Framer Motion springs are bypassed (`duration: 0`) and CSS transitions disabled [A, D].

---

## 9. Form Handling, Validation & File Ingestion

### 9.1 Form Architecture
- Form logic is managed via **React Hook Form** paired with **Zod** schema resolvers (`@hookform/resolvers/zod`) [A].
- Strict schema validation occurs synchronously on the client before network dispatch, providing immediate inline error feedback [D].

### 9.2 High-Throughput Chunked File Ingestion
To eliminate server memory pressure, large document uploads (PDFs up to 50MB, high-res images up to 20MB) bypass the NestJS backend memory buffer entirely [D]:

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Drag & Drop)
    participant Client as react-dropzone Hook
    participant NextAPI as Next.js API (/api/upload/presign)
    participant R2 as Cloudflare R2 Bucket
    participant Backend as NestJS DocumentService

    User->>Client: Drops file (contract.pdf, 32MB)
    Client->>Client: Client-side MIME check & SHA-256 hash
    Client->>NextAPI: POST /api/upload/presign (filename, size, mimeType)
    NextAPI->>NextAPI: Verify user quota & sign AWS SDK v3 PutObjectCommand
    NextAPI-->>Client: Return presigned URL (TTL: 15 min) + target fileKey
    
    rect rgb(15, 23, 42)
        Note over Client,R2: Direct Binary S3 PUT
        Client->>R2: HTTP PUT [presignedUrl] (Binary payload with Progress callback)
        R2-->>Client: HTTP 200 OK (ETag returned)
    end

    Client->>Backend: POST /api/documents/ingest (fileKey, filename, size)
    Backend->>Backend: Enqueue BullMQ document parsing & embedding job
    Backend-->>Client: HTTP 202 Accepted (Document ID)
```

---

## 10. Specialized Workspace Integrations

### 10.1 Monaco Code Studio Integration
HYPERMIND CODE integrates `@monaco-editor/react` [A] to provide a full-fledged IDE experience within the browser [D]:
- **Dynamic Language Switching**: Automatic detection based on active file extension (TypeScript, Python, Rust, Go, SQL, HTML/CSS) [A].
- **Custom Theme Injection**: Custom HYPERMIND Obsidian syntax theme matching platform design tokens [D].
- **Side-by-Side Diffing**: Built-in Monaco Diff Editor displaying AI-generated code proposals alongside user code with one-click "Accept Changes" merge [D].
- **Web Worker Offloading**: Syntax parsing and language services run inside dedicated Web Workers, ensuring zero frame drops on the main thread [A, D].

### 10.2 Markdown & Code Rendering Pipeline
AI streaming output is processed through a deterministic markdown sanitization and compilation pipeline [D]:
- `react-markdown`: Core AST parser [A].
- `remark-gfm`: GitHub Flavored Markdown support (tables, task lists, strikethrough) [A].
- `remark-math` + `rehype-katex`: High-performance LaTeX mathematical formula rendering [A].
- `rehype-prism-plus` / Shiki: Syntax-highlighted code blocks with line numbering and a copy-to-clipboard action bar [A, D].
- **Custom Element Renderers**:
  - Code Blocks: Rendered with a header bar showing language badge, token count estimate, and "Run in Monaco" action [D].
  - Inline Citations: Rendered as interactive tooltips displaying source title, snippet, and external link [D].

### 10.3 Voice & Audio Synthesis Interface
- **Output Synthesis (TTS)**: Consumes streaming audio PCM chunks from the backend, buffering into an HTML5 `AudioContext` [A, D].
- **Visualizer**: HTML5 Canvas running at 60 FPS using `AnalyserNode.getByteFrequencyData()`, rendering an organic pulsating violet waveform reflecting voice amplitude [D].

---

## 11. Accessibility (a11y) & WCAG 2.1 AA Compliance

HYPERMIND complies with WCAG 2.1 AA accessibility standards across all interactive surfaces [A, D]:

1. **Color Contrast Ratios**:
   - All text content maintains a minimum contrast ratio of 4.5:1 against its background. Large text (>= 18pt) maintains >= 3:1 [A, D].
2. **Keyboard Navigation & Focus Management**:
   - Every interactive control is reachable via the `Tab` sequence.
   - Modals and contextual drawers implement focus trapping (`@radix-ui/react-focus-scope`) [A].
   - Escape key dismisses active drawers, popovers, and dialogs cleanly [D].
3. **Screen Reader Support**:
   - All icon-only buttons (`Button variant="ghost" size="icon"`) include explicit `aria-label` or `sr-only` descriptions [A, D].
   - Streaming AI messages declare `aria-live="polite"` to announce content updates to assistive devices without interrupting current speech [A, D].
4. **Reduced Motion**:
   - Respects user operating system reduced-motion settings, disabling non-essential transitions [D].

---

## 12. Performance Engineering & Core Web Vitals

| Metric Target | Threshold | Optimization Technique Applied |
| :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | < 1.8s [A] | Critical layout rendered via Server Components; font preloading via `next/font` [A, D]. |
| **First Input Delay (FID) / INP** | < 100ms [A] | Main thread offloaded; heavy parsing moved to Web Workers [D]. |
| **Cumulative Layout Shift (CLS)** | < 0.05 [A] | Fixed aspect ratios for media; reserved height containers for streaming output [D]. |
| **Bundle Size Optimization** | Initial JS < 120KB (gzipped) [D, E] | Dynamic imports (`next/dynamic`) for Monaco Editor, KateX, and PDF.js [A, D]. |
| **Image Delivery** | WebP/AVIF format [A] | Native `next/image` optimization with responsive `srcset` and blur placeholder [A]. |

---

## 13. Resilience, Error Boundaries & Telemetry

### 13.1 Nested Error Boundaries
To prevent an isolated component failure (e.g., Monaco editor crash or corrupt markdown syntax) from crashing the entire workspace, HYPERMIND implements nested error boundaries [D]:
- **Global Boundary (`app/error.tsx`)**: Handles catastrophic route-level failures with a reload prompt [A].
- **Workspace Boundary (`components/templates/WorkspaceErrorBoundary.tsx`)**: Isolates the main activity surface; navigation rail and conversation list remain fully functional [D].
- **Stream Boundary (`components/organisms/MessageErrorBoundary.tsx`)**: Replaces corrupted streaming messages with an inline retry button [D].

### 13.2 Client Telemetry & Sentry
- Client errors, unhandled promise rejections, and slow route transitions (> 2500ms) are reported directly to Sentry with scrubbed PII [A, D].

---

## 14. Master Frontend Architectural Diagrams

### 14.1 Component Hierarchy Diagram
This diagram outlines the complete component composition tree from the Root Layout down to atomic interactive leaves.

```mermaid
graph TD
    classDef serverStyle fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#ffffff;
    classDef clientStyle fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef atomStyle fill:#022c22,stroke:#10b981,stroke-width:2px,color:#ffffff;

    subgraph ServerRoot["Server Component Scaffolding"]
        RootLayout["RootLayout (app/layout.tsx)"]:::serverStyle
        ThemeProvider["ThemeProvider (next-themes)"]:::serverStyle
        WorkspaceLayout["WorkspaceLayout (app/(workspace)/layout.tsx)"]:::serverStyle
        ChatPage["ChatPage (app/(workspace)/chat/[id]/page.tsx)"]:::serverStyle
    end

    subgraph ClientWorkspace["Client Component Surface ('use client')"]
        Shell["WorkspaceShell (Resizable Splitter)"]:::clientStyle
        NavRail["NavigationRail (Left Sidebar)"]:::clientStyle
        ContextDrawer["ContextDrawer (Right Collapsible Drawer)"]:::clientStyle
        MainSurface["MainChatSurface (Center Activity)"]:::clientStyle
        
        subgraph ChatOrganisms["Chat Feature Organisms"]
            HeaderBar["ChatHeaderBar (Model Selector & Controls)"]:::clientStyle
            MessageFeed["MessageFeed (Virtualized Scroll List)"]:::clientStyle
            PromptBar["PromptInputBar (Textarea + Attachments)"]:::clientStyle
        end

        subgraph SpecializedOrganisms["Specialized Feature Organisms"]
            MonacoPane["MonacoCodeEditorContainer"]:::clientStyle
            DocViewer["DocumentSplitViewer (PDF Canvas)"]:::clientStyle
            AgentConsole["AgentDAGVisualizer"]:::clientStyle
        end
    end

    subgraph AtomsAndMolecules["Atoms & Molecules (shadcn/ui + custom)"]
        ModelPill["ModelSelectorPill"]:::atomStyle
        TokenBadge["TokenBurnCounter"]:::atomStyle
        MessageItem["ChatMessageBubble"]:::atomStyle
        MarkdownRender["MarkdownRenderer (Shiki/KaTeX)"]:::atomStyle
        Dropzone["FileDropzoneTarget"]:::atomStyle
        ActionBtn["ActionButton (Button primitive)"]:::atomStyle
    end

    %% Hierarchy Links
    RootLayout --> ThemeProvider
    ThemeProvider --> WorkspaceLayout
    WorkspaceLayout --> Shell
    Shell --> NavRail
    Shell --> MainSurface
    Shell --> ContextDrawer

    MainSurface --> ChatPage
    ChatPage --> HeaderBar
    ChatPage --> MessageFeed
    ChatPage --> PromptBar

    MainSurface -.->|"Route: /code"| MonacoPane
    MainSurface -.->|"Route: /documents"| DocViewer
    MainSurface -.->|"Route: /agents"| AgentConsole

    HeaderBar --> ModelPill
    HeaderBar --> TokenBadge
    MessageFeed --> MessageItem
    MessageItem --> MarkdownRender
    PromptBar --> Dropzone
    PromptBar --> ActionBtn
```

---

### 14.2 State Management & Streaming Flow Diagram
This diagram shows the continuous reactive data loop between user interaction, Zustand client stores, Vercel AI SDK hooks, and incoming SSE tokens.

```mermaid
sequenceDiagram
    autonumber
    actor User as End User
    participant UI as ChatMessageInput ('use client')
    participant Store as Zustand (useWorkspaceStore)
    participant Hook as @ai-sdk/react (useChat)
    participant SSE as Next.js Route Handler (/api/chat)
    participant Backend as NestJS API Core
    participant Cache as TanStack Query Client

    User->>UI: Selects model "Claude 3.5 Sonnet"
    UI->>Store: setModelConfig({ selectedModelId: 'claude-3-5-sonnet' })
    Store-->>UI: State updated & persisted to localStorage
    
    User->>UI: Enters prompt & hits Send (Enter)
    UI->>Hook: append({ content: prompt, role: 'user' })
    Hook->>Hook: Optimistically insert user message into local state
    Hook->>SSE: POST /api/chat (Messages, ModelId, Temp)
    
    SSE->>Backend: Proxy request with User JWT Claims
    Backend-->>SSE: HTTP 200 chunked stream
    
    loop Real-Time Token Generation
        SSE-->>Hook: SSE Chunk ("0: 'Here is'")
        Hook->>Hook: Update message delta state
        Hook-->>UI: Re-render StreamingBubble (DOM updated)
    end

    SSE-->>Hook: SSE End Chunk ("[DONE]")
    Hook->>Cache: Invalidate queries ['conversations', convId]
    Cache->>Backend: Background re-fetch updated message metadata
```

---

## 15. Document Status & Next Milestones

### 15.1 Completeness Verification
- [x] Next.js 14+ App Router structure and route groups specified in full detail.
- [x] Rigorous Server Components vs. Client Components boundary rules formulated.
- [x] Complete state management architecture (TanStack Query + Zustand + Vercel AI SDK) documented.
- [x] Chunked presigned R2 file ingestion sequence documented.
- [x] Specialized integrations (Monaco Editor, Markdown/Shiki/KaTeX, Web Audio) specified.
- [x] Both required Mermaid diagrams (Component Hierarchy and State Flow) created.
- [x] Source classification tags ([A], [B], [C], [D], [E]) applied throughout.

### 15.2 Immediate Downstream Dependencies
- **HM-DOC-16 (UI/UX Design System)**: Provides concrete CSS variables, color scales, typography metrics, and wireframe layouts implemented by these components.

```text
====================================================================================================
DOCUMENT STATUS: COMPLETE & AUTHORITATIVE
APPROVED BY: HYPERMIND Frontend Architecture Working Group
DATE OF NEXT FORMAL REVIEW: Day 5 Frontend Integration Checkpoint
====================================================================================================
```
