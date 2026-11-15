# HYPERMIND Universal AI Ecosystem — Architectural Decision Records (ADR Log)
**Document Type:** Architectural Decision Records (ADRs)  
**Document ID:** HM-SPEC-020  
**Date:** November 15, 2026  
**Version:** 1.0.0-PROD-SPEC  
**Author:** Stream 5 Engineering Architecture  
**Information Source Level:** [A] Officially verified standards / [D] Engineering recommendations  

---

## Table of Contents
1. [Architecture Decision Framework & Governance](#1-architecture-decision-framework--governance)
2. [Executive ADR Summary Matrix](#2-executive-adr-summary-matrix)
3. [Architectural Decision Records (ADR-001 to ADR-015)](#3-architectural-decision-records)
   - [ADR-001: PostgreSQL over MongoDB for Core Relational & Vector Persistence](#adr-001-postgresql-over-mongodb-for-core-relational--vector-persistence)
   - [ADR-002: NestJS over Express.js for Enterprise Backend Architecture](#adr-002-nestjs-over-expressjs-for-enterprise-backend-architecture)
   - [ADR-003: Next.js 14+ App Router for Frontend Client & SSR Layer](#adr-003-nextjs-14-app-router-for-frontend-client--ssr-layer)
   - [ADR-004: Vercel AI SDK with Direct Provider SDK Fallback](#adr-004-vercel-ai-sdk-with-direct-provider-sdk-fallback)
   - [ADR-005: Railway for Containerized Backend Hosting & Managed Data Services](#adr-005-railway-for-containerized-backend-hosting--managed-data-services)
   - [ADR-006: Cloudflare R2 over AWS S3 for Blob & Document Storage](#adr-006-cloudflare-r2-over-aws-s3-for-blob--document-storage)
   - [ADR-007: Modular Monolith over Microservices Architecture](#adr-007-modular-monolith-over-microservices-architecture)
   - [ADR-008: NextAuth.js (Auth.js v5) for Unified Session & Federated Identity](#adr-008-nextauthjs-authjs-v5-for-unified-session--federated-identity)
   - [ADR-009: pgvector Extension over Standalone Dedicated Vector Database](#adr-009-pgvector-extension-over-standalone-dedicated-vector-database)
   - [ADR-010: Server-Sent Events (SSE) over WebSockets for LLM Streaming](#adr-010-server-sent-events-sse-over-websockets-for-llm-streaming)
   - [ADR-011: shadcn/ui and Tailwind CSS over Proprietary Component Library](#adr-011-shadcnui-and-tailwind-css-over-proprietary-component-library)
   - [ADR-012: BullMQ and Redis for Asynchronous Task & Agent Queueing](#adr-012-bullmq-and-redis-for-asynchronous-task--agent-queueing)
   - [ADR-013: 10-Day MVP Scope Selection (6 Core/Basic + 3 Partial + 3 Deferred)](#adr-013-10-day-mvp-scope-selection-6-corebasic--3-partial--3-deferred)
   - [ADR-014: Monorepo Architecture with Turborepo & pnpm Workspaces](#adr-014-monorepo-architecture-with-turborepo--pnpm-workspaces)
   - [ADR-015: Multi-Provider AI Routing Strategy over Single-Vendor Lock-In](#adr-015-multi-provider-ai-routing-strategy-over-single-vendor-lock-in)
4. [Document Status & Completeness Checklist](#4-document-status--completeness-checklist)

---

## 1. Architecture Decision Framework & Governance

All architectural, infrastructural, and protocol decisions for HYPERMIND follow the lightweight Architectural Decision Record (ADR) standard popularized by Michael Nygard. Each record captures:
- **Decision ID & Title:** Unique canonical identifier.
- **Status:** DECIDED (Active baseline for implementation).
- **Context:** The technical driver, business constraints, or trade-offs necessitating a decision.
- **Options Considered:** Multi-variant evaluation with objective pros and cons.
- **Decision & Rationale:** The selected direction and explicit technical justification.
- **Consequences:** Positive, negative, and neutral ramifications.
- **Reversibility:** Cost and friction required to modify or reverse this decision post-launch.

---

## 2. Executive ADR Summary Matrix

| ADR ID | Decision Title | Selected Option | Primary Driver | Reversibility |
|---|---|---|---|---|
| **ADR-001** | Relational Database | **PostgreSQL 16** | Strict relational integrity + vector co-location | High Effort (DB Migration) |
| **ADR-002** | Backend Framework | **NestJS 10+** | Enterprise dependency injection & modular monolith | Moderate Effort |
| **ADR-003** | Frontend Architecture | **Next.js 14 (App Router)** | Streaming UI, SSR performance, React Server Components | High Effort |
| **ADR-004** | AI SDK Integration | **Vercel AI SDK + Native SDKs** | Unified streaming standard with provider flexibility | Low Effort |
| **ADR-005** | Backend Infrastructure | **Railway** | Zero-DevOps, native Redis/PostgreSQL, predictable pricing | Low Effort |
| **ADR-006** | File & Blob Storage | **Cloudflare R2** | Zero egress fees, standard S3 API compatibility | Very Low Effort |
| **ADR-007** | Architecture Topology | **Modular Monolith** | Maximum 10-day velocity, zero distributed systems overhead | Moderate Effort |
| **ADR-008** | Authentication Engine | **NextAuth.js v5** | Seamless OAuth + Credentials bridge to JWT | Low-to-Moderate Effort |
| **ADR-009** | Vector Storage Engine | **PostgreSQL pgvector** | Zero data duplication, single transaction boundary | Low Effort |
| **ADR-010** | LLM Streaming Transport | **Server-Sent Events (SSE)** | Native HTTP/2 multiplexing, automatic reconnect | Low Effort |
| **ADR-011** | UI Component System | **shadcn/ui + Tailwind CSS** | Complete source code ownership, zero runtime bloat | Low Effort |
| **ADR-012** | Task & Agent Queue | **BullMQ + Redis** | Redis reuse, robust DAG workflow orchestration | Low-to-Moderate Effort |
| **ADR-013** | MVP Scope Boundaries | **6 Full/Basic + 3 Partial + 3 Post**| Guaranteed 10-day delivery of production quality | N/A (Sprint Scope) |
| **ADR-014** | Repository Structure | **Turborepo Monorepo** | Shared contracts (`@hypermind/shared-types`), fast caching | Moderate Effort |
| **ADR-015** | AI Model Strategy | **Multi-Provider Routing** | Uptime resilience, cost arbitrage, best-in-class models | Low Effort |

---

## 3. Architectural Decision Records

### ADR-001: PostgreSQL over MongoDB for Core Relational & Vector Persistence
- **Decision ID:** ADR-001
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  HYPERMIND requires a resilient data storage engine capable of managing structured relational entities (Users, Subscriptions, Conversations, Messages, Token Usage Logs) while simultaneously enabling semantic similarity searches across high-dimensional vector embeddings for Document Intelligence and Memory.
- **Options Considered:**
  1. *MongoDB 7.0 (Document Store with Atlas Vector Search):*
     - Pros: Flexible schema, rapid early prototyping for JSON-heavy conversation trees.
     - Cons: Weak multi-table relational integrity, costly managed vector clusters, eventual consistency complexities.
  2. *PostgreSQL 16 with pgvector Extension (Chosen):*
     - Pros: ACID compliance, foreign key cascade guarantees, rock-solid schema migrations via Prisma, and native high-performance vector search (HNSW index) inside the same database engine.
     - Cons: Rigid schema requiring deliberate migrations; connection pooling management required under high concurrency.
- **Decision:**
  Adopt PostgreSQL 16 managed on Railway with the `pgvector` extension enabled.
- **Rationale:**
  Co-locating relational data and vector embeddings within a single database eliminates distributed two-phase commits, synchronization drift, and external vector database subscription costs. Prisma ORM provides type-safe query generation matching our strict TypeScript standards.
- **Consequences:**
  - Database migrations must be tested and version-controlled via `prisma migrate`.
  - Connection pooling must be configured using Prisma PgBouncer or Railway connection pooling.
- **Reversibility:**
  High Effort. Migrating core relational models away from PostgreSQL would require writing extensive ETL scripts and rewriting database repositories.

---

### ADR-002: NestJS over Express.js for Enterprise Backend Architecture
- **Decision ID:** ADR-002
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  The backend orchestrates complex, poly-modal workflows: authentication, provider gateways, rate limiters, BullMQ background jobs, WebSocket connections, and SSE streams. An unopinionated framework like vanilla Express frequently degenerates into an unmaintainable codebase with inconsistent error handling and circular dependencies.
- **Options Considered:**
  1. *Express.js 4/5 (Minimalist HTTP Server):*
     - Pros: Minimal boilerplate, ubiquitous documentation, lightweight runtime.
     - Cons: Zero architectural conventions, manual dependency injection, prone to spaghetti architecture in team environments.
  2. *Fastify (High Performance Node.js Framework):*
     - Pros: High throughput, schema-based serialization.
     - Cons: Smaller ecosystem of enterprise plugins compared to NestJS.
  3. *NestJS 10+ (Modular TypeScript Framework - Chosen):*
     - Pros: Standardized architectural patterns (Modules, Controllers, Services, Guards, Interceptors, Pipes), native TypeScript first-class support, built-in dependency injection, seamless WebSockets and BullMQ integration.
     - Cons: Steeper initial learning curve, higher initial file count.
- **Decision:**
  Adopt NestJS 10+ as the foundational backend framework.
- **Rationale:**
  NestJS enforces architectural discipline across all 10 core backend modules. Its built-in decorators and lifecycle hooks make adding cross-cutting features (e.g. Redis rate-limiting guards, logging interceptors, RFC 7807 exception filters) clean and standardized.
- **Consequences:**
  - All backend code must adhere to NestJS dependency injection patterns.
  - Test suites utilize `@nestjs/testing` for mocking module graphs.
- **Reversibility:**
  Moderate Effort. Services are decoupled from controllers, meaning business logic could be ported, but framework decorators would require refactoring.

---

### ADR-003: Next.js 14+ App Router for Frontend Client & SSR Layer
- **Decision ID:** ADR-003
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  The frontend requires instant page loads for marketing and documentation, combined with reactive, low-latency streaming user interfaces for conversational AI, workspace canvases, and agent dashboards.
- **Options Considered:**
  1. *Single Page Application (Vite + React 18):*
     - Pros: Ultra-fast local HMR, simple client-only deployment.
     - Cons: Sub-optimal SEO for marketing pages, slower initial load times on mobile, lacks built-in server route handlers for secure API proxying.
  2. *Remix (React Router 7):*
     - Pros: Excellent data loader model and native web standards.
     - Cons: Smaller ecosystem of pre-built UI components and lower adoption compared to Next.js.
  3. *Next.js 14+ with App Router (Chosen):*
     - Pros: React Server Components (RSC) minimize client bundle sizes, native streaming with Suspense boundaries, built-in BFF route handlers for NextAuth.js, and frictionless Vercel deployment.
     - Cons: App Router caching semantics require deliberate configuration to prevent stale AI data.
- **Decision:**
  Adopt Next.js 14+ utilizing App Router, Server Components for outer layouts, and Client Components for dynamic streaming controls.
- **Rationale:**
  The App Router enables clear separation of concerns: public marketing routes render statically for instant SEO, while protected workspace routes stream AI responses via React 18 Suspense boundaries with minimal JavaScript overhead.
- **Consequences:**
  - Developers must understand the boundary between Server Components (`page.tsx`) and interactive Client Components (`'use client'`).
- **Reversibility:**
  High Effort. Migrating between Next.js App Router and Vite/Remix involves restructuring routing, layout hierarchies, and data-fetching patterns.

---

### ADR-004: Vercel AI SDK with Direct Provider SDK Fallback
- **Decision ID:** ADR-004
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  HYPERMIND integrates multiple upstream model providers (OpenAI, Anthropic, Google). We require a clean abstraction for streaming text and tool calls without sacrificing provider-specific capabilities (e.g. Anthropic prompt caching, Google 1M context audio/video).
- **Options Considered:**
  1. *Direct Provider SDKs Exclusively (openai, @anthropic-ai/sdk, @google/genai):*
     - Pros: Immediate access to cutting-edge vendor features upon release.
     - Cons: Distinct streaming APIs for each vendor require writing and maintaining custom chunk-normalizing adapters.
  2. *LangChain.js / LlamaIndex:*
     - Pros: Broad chain abstractions.
     - Cons: Excessive abstraction overhead, bloated bundle sizes, slow release cycle for new model features, complex debugging.
  3. *Vercel AI SDK (`ai` package) with Direct SDK Fallback (Chosen):*
     - Pros: Industry-standard unified streaming format, seamless integration with React hooks (`useChat`), lightweight, and easily bypassable for raw direct SDK calls when advanced features demand it.
     - Cons: Occasional version lag on brand-new proprietary parameters.
- **Decision:**
  Adopt Vercel AI SDK as the primary streaming engine inside `@hypermind/ai-providers`, supplemented by direct provider SDKs for vendor-specific multimodal and caching capabilities.
- **Rationale:**
  Provides the optimal balance of developer velocity and streaming standardization, while preserving our architectural freedom to invoke native provider SDKs directly when needed.
- **Consequences:**
  - AI streaming utilities standardize on standard web `ReadableStream` patterns.
- **Reversibility:**
  Low Effort. All provider calls are encapsulated within `@hypermind/ai-providers`, keeping core backend logic completely insulated.

---

### ADR-005: Railway for Containerized Backend Hosting & Managed Data Services
- **Decision ID:** ADR-005
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  The 10-day MVP timeline precludes dedicating engineering hours to configuring AWS ECS/EKS clusters, VPC peering, IAM roles, and manual Kubernetes manifests. We need a reliable PaaS supporting Docker, PostgreSQL with extensions, and Redis.
- **Options Considered:**
  1. *AWS (ECS Fargate + RDS PostgreSQL + ElastiCache):*
     - Pros: Unlimited enterprise scale, enterprise compliance.
     - Cons: High configuration friction, complex billing, slow setup time requiring days of Terraform scripts.
  2. *Render:*
     - Pros: Simple managed platform.
     - Cons: Slower build times, higher container sleep latency on lower tiers.
  3. *Railway (Chosen):*
     - Pros: Direct GitHub container deployments, one-click managed PostgreSQL with custom Dockerfile extensions (`pgvector`), managed Redis 7, private networking between services, predictable pricing.
     - Cons: Custom networking configurations more constrained than raw AWS VPCs.
- **Decision:**
  Deploy the NestJS backend container, PostgreSQL database with pgvector, and Redis cache on Railway.
- **Rationale:**
  Railway enables full infrastructure deployment in under 2 hours, including SSL, continuous delivery on git push, and zero-egress internal private networking between backend, database, and Redis.
- **Consequences:**
  - Infrastructure is defined via clean `Dockerfile` and `docker-compose` blueprints.
- **Reversibility:**
  Low Effort. Because the backend is standard Docker and databases are standard PostgreSQL/Redis, migrating to AWS or GCP requires only deploying the container and restoring database dumps.

---

### ADR-006: Cloudflare R2 over AWS S3 for Blob & Document Storage
- **Decision ID:** ADR-006
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  Users upload documents, PDFs, images, and audio files for AI analysis. High-bandwidth retrieval of large files and vectorization jobs can incur substantial data egress expenses on traditional cloud storage providers.
- **Options Considered:**
  1. *Amazon Web Services S3:*
     - Pros: Industry standard, extensive SDKs and tooling.
     - Cons: Significant data egress fees ($0.09/GB), complex IAM permissions.
  2. *Cloudflare R2 Object Storage (Chosen):*
     - Pros: **Zero data egress fees**, full S3-compatible API (consumable via standard `@aws-sdk/client-s3`), integrated edge CDN caching, low cost ($0.015/GB-month storage).
     - Cons: Lacks S3-specific niche lifecycle rules like Glacier Deep Archive.
- **Decision:**
  Adopt Cloudflare R2 for all user document uploads, avatars, and generated media.
- **Rationale:**
  Completely eliminates the financial risk of bandwidth egress shock (RSK-017) while retaining 100% code compatibility with the standard S3 client library.
- **Consequences:**
  - Storage service configures endpoint URL to `https://<account-id>.r2.cloudflarestorage.com`.
- **Reversibility:**
  Very Low Effort. Switching back to AWS S3 or GCP Cloud Storage requires modifying only 3 environment variables in our S3 client initialization.

---

### ADR-007: Modular Monolith over Microservices Architecture
- **Decision ID:** ADR-007
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  Modern AI platforms involve distinct operational domains: Chat, Memory, Agent Execution, Files, and Billing. Splitting these into separate microservices during the 10-day MVP phase creates massive distributed tracing, network serialization, and deployment orchestration overhead.
- **Options Considered:**
  1. *Microservices (Independent services per domain):*
     - Pros: Independent team scaling, isolated deployments.
     - Cons: Extreme operational complexity, distributed transactions, cross-service authentication latency, high DevOps burden.
  2. *Modular Monolith inside NestJS (Chosen):*
     - Pros: High-velocity in-memory function calls, unified transactional database, single deployment pipeline, strict boundary enforcement via NestJS modules.
     - Cons: Entire backend deploys together; scaling must scale the entire container unless worker roles are split.
- **Decision:**
  Build HYPERMIND as a structured Modular Monolith.
- **Rationale:**
  Guarantees maximum feature velocity for the 10-day sprint. By strictly enforcing module boundaries (e.g. `AuthModule`, `AiModule`, `AgentModule`), individual services can be extracted into standalone microservices in Phase 2 with zero domain refactoring.
- **Consequences:**
  - Cross-module calls occur via injected services or domain events, avoiding direct database table mutations across domains.
- **Reversibility:**
  Moderate Effort. NestJS module architecture makes extracting any module into a separate microservice straightforward.

---

### ADR-008: NextAuth.js (Auth.js v5) for Unified Session & Federated Identity
- **Decision ID:** ADR-008
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  User authentication must support credentials (email/password) as well as modern social OAuth providers (Google, GitHub) while maintaining session integrity across both Next.js SSR and the NestJS REST API.
- **Options Considered:**
  1. *Roll-Your-Own Custom Auth in NestJS:*
     - Pros: 100% control over every cookie and cryptographic byte.
     - Cons: High risk of security vulnerabilities (CSRF, timing attacks), substantial development time for OAuth handshakes.
  2. *Third-Party Auth Provider (Clerk / Auth0 / Supabase Auth):*
     - Pros: Turnkey hosted UI.
     - Cons: High recurring per-MAU costs, vendor lock-in, latency overhead on token verification.
  3. *NextAuth.js v5 (Auth.js) with Prisma Adapter (Chosen):*
     - Pros: Open source, zero licensing cost, built specifically for Next.js App Router, securely manages OAuth callbacks and issues JWTs signed with RSA-256 for NestJS backend consumption.
     - Cons: NextAuth v5 documentation in active transition during beta.
- **Decision:**
  Implement NextAuth.js v5 on the frontend to manage credentials and OAuth sessions, issuing verified JWT bearer tokens to the NestJS API.
- **Rationale:**
  Combines rapid UI integration with zero ongoing vendor subscription fees and absolute ownership over user credentials and data.
- **Consequences:**
  - Next.js acts as the OAuth callback receiver; NestJS verifies the shared JWT secret on inbound requests.
- **Reversibility:**
  Low-to-Moderate Effort. Standard JWT structure ensures backend guards remain unchanged if frontend auth is swapped.

---

### ADR-009: pgvector Extension over Standalone Dedicated Vector Database
- **Decision ID:** ADR-009
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  Document Intelligence, Semantic Memory, and RAG require indexing and searching high-dimensional vector embeddings (1536-dim via OpenAI `text-embedding-3-small`).
- **Options Considered:**
  1. *Pinecone / Qdrant Cloud / Milvus (Dedicated Vector DB):*
     - Pros: Specialized vector indexing algorithms, high horizontal scale.
     - Cons: Extra infrastructure service to manage, separate billing ($70+/mo baseline), data synchronization latency, separate backup pipelines.
  2. *PostgreSQL pgvector Extension (Chosen):*
     - Pros: Zero additional infrastructure costs, native SQL joins between documents, chunks, and user permissions, transactional consistency, fast HNSW vector indexing.
     - Cons: Higher RAM requirements on PostgreSQL instance at multimillion-vector scale.
- **Decision:**
  Utilize the `pgvector` extension directly within our Railway PostgreSQL 16 database.
- **Rationale:**
  For our MVP and scaling target (< 1,000,000 document vectors), `pgvector` with HNSW indexing delivers sub-20ms query latency while allowing atomic queries that join vector similarity with user ownership filters in a single SQL statement.
- **Consequences:**
  - PostgreSQL instance must include the compiled `vector` shared library.
- **Reversibility:**
  Low Effort. If vector volume exceeds 5M items, embedding vectors can be synced to Qdrant without altering document text schemas.

---

### ADR-010: Server-Sent Events (SSE) over WebSockets for LLM Streaming
- **Decision ID:** ADR-010
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  Large Language Models generate output token-by-token over durations spanning 2 to 60 seconds. We need a reliable, lightweight streaming transport for the chat interface.
- **Options Considered:**
  1. *WebSockets (Full-Duplex TCP Connection):*
     - Pros: Bidirectional communication on a single socket.
     - Cons: Heavy connection state on server, problematic through some enterprise firewalls/proxies, requires custom heartbeat/reconnect protocols, overkill for unidirectional text output.
  2. *Long Polling:*
     - Pros: Simple HTTP fallback.
     - Cons: Enormous request overhead, poor latency, inefficient for high-frequency token chunks.
  3. *Server-Sent Events (SSE) over HTTP/2 (Chosen):*
     - Pros: Unidirectional client-friendly standard (`text/event-stream`), native browser `EventSource` with automated reconnection, zero custom framing overhead, multiplexes cleanly over existing HTTP/2 connections.
     - Cons: Unidirectional (client cannot send messages back over the same HTTP stream).
- **Decision:**
  Adopt Server-Sent Events (SSE) for all LLM text and tool streaming, while retaining WebSockets solely for bidirectional Autonomous Agent human-in-the-loop task control.
- **Rationale:**
  Chat inference is fundamentally a request-response flow where the response happens to be streamed over time. SSE provides the lowest latency, standard HTTP caching/headers, and zero stateful socket leak risk.
- **Consequences:**
  - Inference endpoints return `Content-Type: text/event-stream`.
- **Reversibility:**
  Low Effort. Swapping SSE for WebSocket streaming would require only updating the transport layer in `@hypermind/ai-providers` and the frontend hook.

---

### ADR-011: shadcn/ui and Tailwind CSS over Proprietary Component Library
- **Decision ID:** ADR-011
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  The frontend requires an elegant, accessible, dark-mode native design system built rapidly without accumulating third-party CSS runtime bloat.
- **Options Considered:**
  1. *MUI (Material UI) / Chakra UI:*
     - Pros: Comprehensive component suite out of the box.
     - Cons: Heavy CSS-in-JS runtime overhead, difficult to override styling to match dark futuristic AI aesthetics.
  2. *Custom CSS from Scratch:*
     - Pros: Complete artistic control.
     - Cons: Severe time sink; writing accessible accessible modals, dropdowns, and tooltips would consume the entire 10-day sprint.
  3. *shadcn/ui + Tailwind CSS 3.4 (Chosen):*
     - Pros: Zero runtime overhead (compiled CSS), components are copy-pasted directly into the repository for 100% source ownership, built on accessible Radix UI primitives, native Tailwind theming.
     - Cons: Component updates must be manually reviewed and incorporated.
- **Decision:**
  Adopt Tailwind CSS 3.4 and shadcn/ui primitives.
- **Rationale:**
  Delivers immediate visual polish and accessible keyboard navigation while allowing complete customization of every component directly inside `apps/web/components/ui/`.
- **Consequences:**
  - Component code resides directly within the project tree, styled via Tailwind utility classes.
- **Reversibility:**
  Low Effort. Because code is native React + Tailwind, swapping individual primitives does not risk breaking an external npm dependency.

---

### ADR-012: BullMQ and Redis for Asynchronous Task & Agent Queueing
- **Decision ID:** ADR-012
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  Autonomous agent tasks (multi-step web research, document parsing, code analysis) are long-running jobs that cannot execute inside standard synchronous HTTP request-response cycles without timing out.
- **Options Considered:**
  1. *In-Memory Node.js Async Loops:*
     - Pros: Zero infrastructure dependencies.
     - Cons: Tasks evaporate if the container restarts; no concurrency throttling or exponential backoff retries.
  2. *RabbitMQ / AWS SQS:*
     - Pros: Robust standalone enterprise message brokers.
     - Cons: Requires configuring a separate service, increasing operational complexity.
  3. *BullMQ on Existing Redis Instance (Chosen):*
     - Pros: Reuses our existing Redis 7 infrastructure, supports DAG parent-child task dependencies, concurrency controls, delayed retries, and job progress reporting.
     - Cons: Requires persistent Redis storage to guarantee zero job loss on crash.
- **Decision:**
  Implement BullMQ with Redis for all background agent execution and document vectorization pipelines.
- **Rationale:**
  Maximizes infrastructure efficiency by leveraging Redis for both fast in-memory rate limiting and mission-critical job queueing without spinning up a secondary message broker.
- **Consequences:**
  - NestJS incorporates `@nestjs/bullmq` module with background worker processors.
- **Reversibility:**
  Low-to-Moderate Effort. Job processors can be mapped to SQS or Kafka workers if enterprise event throughput demands it.

---

### ADR-013: 10-Day MVP Scope Selection (6 Core/Basic + 3 Partial + 3 Deferred)
- **Decision ID:** ADR-013
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  The HYPERMIND vision encompasses 12 universal AI systems. Attempting to build all 12 systems to full maturity in a 10-day sprint guarantees half-baked features, severe bugs, and project failure. A ruthless prioritization strategy is necessary.
- **Options Considered:**
  1. *Build All 12 Systems Shallowly:*
     - Pros: Broadest marketing claims.
     - Cons: High failure rate; broken user flows, zero robust error handling.
  2. *Build Chat Exclusively (1 System):*
     - Pros: Low risk.
     - Cons: Fails the mission of a universal AI ecosystem.
  3. *Tiered 6 / 3 / 3 Architecture Scope (Chosen):*
     - **Full / Basic (6):** Chat, Router, Documents, Vision, Memory, Auth/Users.
     - **Partial (3):** Code (syntax/generation only), Research (web search citations), Voice (TTS output only).
     - **Deferred Post-MVP (3):** Learning, Video, Creative Studio (documented architecture only).
- **Decision:**
  Lock the 10-day development roadmap to the 6 / 3 / 3 scope matrix.
- **Rationale:**
  Focuses core development effort on the high-value daily drivers (Chat, Documents, Multimodal Vision, and Multi-Provider Routing) while establishing functional hooks for Voice, Code, and Research, ensuring a cohesive launch product.
- **Consequences:**
  - Systems 10, 11, and 12 remain pure architectural specifications during Phase 1.
- **Reversibility:**
  N/A. Sprint boundary decision governing immediate execution.

---

### ADR-014: Monorepo Architecture with Turborepo & pnpm Workspaces
- **Decision ID:** ADR-014
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  Building separate git repositories for Frontend, Backend, Types, and Adapters leads to version mismatch hell, duplicated contract definitions, and multi-repo PR coordination overhead.
- **Options Considered:**
  1. *Multi-Repo (Polyrepo):*
     - Pros: Isolated permissions per repo.
     - Cons: Painful cross-repo PRs, constant publishing of private npm packages for shared types, slow iteration.
  2. *Nx Monorepo:*
     - Pros: Extensive enterprise plugin ecosystem.
     - Cons: Heavy configuration footprint, complex mental model.
  3. *Turborepo with pnpm Workspaces (Chosen):*
     - Pros: Blazing fast build pipeline caching, lightweight configuration (`turbo.json`), native TypeScript project references, strict dependency isolation.
     - Cons: Requires clean configuration of shared tsconfigs and exports.
- **Decision:**
  Adopt Turborepo with `pnpm` workspaces for all applications (`apps/web`, `apps/api`) and shared libraries (`packages/shared-types`, `packages/ai-providers`).
- **Rationale:**
  Guarantees end-to-end type safety across the stack. Updating an API response schema in `packages/shared-types` instantly provides compiler feedback across both NestJS controllers and Next.js UI hooks.
- **Consequences:**
  - Root repository manages workspace scripts via `pnpm turbo run build / lint / test`.
- **Reversibility:**
  Moderate Effort. Packages are cleanly separated in subdirectories, making polyrepo splitting feasible if required.

---

### ADR-015: Multi-Provider AI Routing Strategy over Single-Vendor Lock-In
- **Decision ID:** ADR-015
- **Date:** November 15, 2026
- **Status:** DECIDED
- **Context:**
  Relying exclusively on a single AI provider (e.g. OpenAI only) exposes the platform to rate limit shutdowns, price increases, latency degradation, and downtime risk. Furthermore, different models excel at different tasks (Claude 3.5 Sonnet leads coding; GPT-4o leads multimodal reasoning; Gemini Flash leads long-context speed).
- **Options Considered:**
  1. *Single Provider (OpenAI Only):*
     - Pros: Single billing relationship, simpler initial implementation.
     - Cons: Complete vendor lock-in, zero fallback capability during OpenAI outages, unable to offer superior Claude coding capabilities.
  2. *Multi-Provider Routing Gateway (OpenAI + Anthropic + Google - Chosen):*
     - Pros: 99.9% uptime resilience via automated fallback, intelligent routing based on task domain and complexity, cost optimization by routing low-complexity tasks to high-speed low-cost models.
     - Cons: Must maintain 3 API accounts and balance credit balances.
- **Decision:**
  Implement a dynamic Multi-Provider Routing Gateway inside `apps/api/src/modules/ai/`.
- **Rationale:**
  The core value proposition of HYPERMIND is universal intelligence. Providing dynamic access to the best model for every specific prompt (and automatic failover if any provider hiccups) makes the platform dramatically more resilient and capable than single-model interfaces.
- **Consequences:**
  - System tracks health status, circuit breakers, and token pricing for all three providers.
- **Reversibility:**
  Low Effort. The modular provider adapter design makes adding or removing downstream model vendors trivial.

---

## 4. Document Status & Completeness Checklist

| Verification Requirement | Status | Verification Detail |
|---|---|---|
| All 15 Requested ADRs Documented | COMPLETE | ADR-001 through ADR-015 exhaustively detailed |
| Standard ADR Structure Enforced | COMPLETE | Context, Options Considered, Decision, Rationale, Consequences, Reversibility |
| Tech Stack Alignment | COMPLETE | 100% consistent with Agreed Technology Stack |
| Summary Matrix Included | COMPLETE | Executive table summarizing all architectural choices |
| Real Technical Content | COMPLETE | Zero placeholders, concrete algorithms, libraries, and configurations |

**Open Items for Post-MVP:**
- ADR-016: Local LLM Execution via WebGPU / Ollama adapter.
- ADR-017: Multi-Region PostgreSQL read replica distribution strategy.
