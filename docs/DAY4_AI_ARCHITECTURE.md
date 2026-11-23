# Day 4 — Multi-Model Intelligence Engine Architecture

> HYPERMIND AI · Day 4 of 10 · Build Date: November 2026

## Overview

Day 4 implements the core AI intelligence layer for HYPERMIND AI — a multi-provider AI orchestration system that connects to Google Gemini, Anthropic Claude, OpenAI, and open-weight models (GPT-OSS 120B) through a unified interface with intelligent routing, streaming, and fault tolerance.

```
┌─────────────────────────────────────────────────────────────────┐
│                     HYPERMIND AI Frontend                       │
│  (Next.js 14 · React 18 · Zustand · Tailwind · shadcn/ui)     │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐                 │
│  │ ChatInput│  │ Message  │  │ Model        │                 │
│  │          │  │ List     │  │ Selector     │                 │
│  └────┬─────┘  └──────────┘  └──────────────┘                 │
│       │                                                         │
│  ┌────▼─────────────────────────────────────────────┐          │
│  │  AI Client (lib/api/ai-client.ts)                │          │
│  │  SSE stream consumer · AbortController           │          │
│  └────┬─────────────────────────────────────────────┘          │
└───────┼─────────────────────────────────────────────────────────┘
        │  POST /api/v1/chat (SSE)
        │  GET  /api/v1/models
        │  POST /api/v1/chat/cancel
┌───────▼─────────────────────────────────────────────────────────┐
│                   Next.js API Routes (Server)                   │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐            │
│  │ Rate Limiter│  │ Request      │  │ AI Config  │            │
│  │ (in-memory) │  │ Validator    │  │ (.env keys)│            │
│  └─────────────┘  └──────────────┘  └────────────┘            │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Model Router (@hypermind/ai-providers)           │          │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────┐ │          │
│  │  │ Intent     │  │ Circuit      │  │ Fallback │ │          │
│  │  │ Classifier │  │ Breaker      │  │ Chains   │ │          │
│  │  └────────────┘  └──────────────┘  └──────────┘ │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │  Provider Adapters                                  │        │
│  │  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────┐│        │
│  │  │ Google  │  │Anthropic │  │ OpenAI │  │OpenAI ││        │
│  │  │ Gemini  │  │ Claude   │  │ Native │  │Compat ││        │
│  │  └────┬────┘  └────┬─────┘  └───┬────┘  └───┬───┘│        │
│  └───────┼───────────┼──────────────┼───────────┼────┘        │
└──────────┼───────────┼──────────────┼───────────┼─────────────┘
           │           │              │           │
     ┌─────▼───┐ ┌─────▼─────┐ ┌─────▼───┐ ┌────▼──────────┐
     │ Google  │ │ Anthropic │ │ OpenAI  │ │ Together AI  │
     │ AI API  │ │ API       │ │ API     │ │ Fireworks    │
     │         │ │           │ │         │ │ vLLM/Ollama  │
     └─────────┘ └───────────┘ └─────────┘ └──────────────┘
```

## Supported Providers & Models

| Provider | Model | API Model ID | Context | Capabilities | Cost (Input/Output per 1M) |
|----------|-------|-------------|---------|-------------|---------------------------|
| Anthropic | Claude Sonnet 4 | `claude-sonnet-4-20250514` | 200K | Reasoning, Code, Vision | $3.00 / $15.00 |
| Anthropic | Claude Opus 4 | `claude-opus-4-20250514` | 200K | Reasoning, Code, Vision | $15.00 / $75.00 |
| Anthropic | Claude 3.5 Haiku | `claude-3-5-haiku-20241022` | 200K | Fast, Code | $0.80 / $4.00 |
| OpenAI | GPT-4o | `gpt-4o` | 128K | Multimodal, Reasoning, Vision | $2.50 / $10.00 |
| OpenAI | GPT-4o Mini | `gpt-4o-mini` | 128K | Fast, Vision | $0.15 / $0.60 |
| Google | Gemini 2.5 Pro | `gemini-2.5-pro` | 1M | Multimodal, Reasoning, Code | $1.25 / $10.00 |
| Google | Gemini 2.5 Flash | `gemini-2.5-flash` | 1M | Fast, Multimodal | $0.15 / $0.60 |
| Google | Gemini 2.0 Flash | `gemini-2.0-flash` | 1M | Fast, Multimodal | $0.10 / $0.40 |
| Open Weight | GPT-OSS 120B | `openai/gpt-oss-120b` | 128K | General, Code, Reasoning | $0.88 / $0.88 |

## Environment Configuration

Copy `.env.example` to `.env.local` and configure your API keys:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_AI_API_KEY` | For Gemini | Google AI Studio API key |
| `ANTHROPIC_API_KEY` | For Claude | Anthropic Console API key |
| `OPENAI_API_KEY` | For GPT-4o | OpenAI Platform API key |
| `OPENAI_COMPAT_PROVIDER` | For GPT-OSS | `together` \| `fireworks` \| `vllm` \| `ollama` |
| `TOGETHER_API_KEY` | For Together AI | Together AI API key |
| `FIREWORKS_API_KEY` | For Fireworks | Fireworks AI API key |
| `OPENAI_COMPAT_BASE_URL` | For self-hosted | Custom inference endpoint URL |

**Security:** All API keys are server-side environment variables only. They are never bundled into the client JavaScript or exposed in browser network requests.

## API Endpoints

### `POST /api/v1/chat`
Streaming chat completion via Server-Sent Events (SSE).

**Request Body:**
```json
{
  "content": "Explain quantum computing",
  "modelId": "claude-sonnet-4-20250514",
  "conversationId": "optional-conv-id",
  "conversationHistory": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ],
  "systemPrompt": "You are a helpful AI assistant",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

**SSE Events:**
```
event: metadata
data: {"conversationId":"...","messageId":"...","modelId":"...","provider":"...","reason":"user_selected"}

event: token
data: {"delta":"Hello","index":0}

event: token
data: {"delta":" world","index":1}

event: fallback
data: {"originalModel":"claude-sonnet-4-20250514","fallbackModel":"gpt-4o","reason":"Provider unavailable"}

event: done
data: {"promptTokens":150,"completionTokens":300,"totalTokens":450,"costUsd":0.006,"finishReason":"stop","latencyMs":2500}
```

### `POST /api/v1/chat/cancel`
Cancel an active generation.

```json
{ "messageId": "uuid-from-x-message-id-header" }
```

### `GET /api/v1/models`
Returns available models with their capabilities and configuration status.

### `GET /api/v1/models/:id/status`
Returns health status and circuit breaker state for a specific model.

## Model Routing

### Priority Order
1. **User-selected model** — Never silently changed. The user's choice is always honored first.
2. **Fallback** — If the selected provider fails, the router attempts fallback models. The user is explicitly notified via an SSE `fallback` event.
3. **Auto-routing** — When no model is specified, the Intent Classifier analyzes the message and routes to the best model.

### Auto-routing Rules
| Task Type | Recommended Model | Why |
|-----------|------------------|-----|
| Code generation/debug | Claude Sonnet 4 | Best code quality |
| Deep reasoning/math | Claude Opus 4 | Extended thinking |
| Fast conversation | Gemini 2.5 Flash | Lowest latency |
| Multimodal (images) | Gemini 2.5 Pro | Best multimodal |
| General | Claude Sonnet 4 | Best all-around |

### Fallback Chains
| Primary Model | Fallback 1 | Fallback 2 |
|--------------|------------|------------|
| Claude Sonnet 4 | GPT-4o | Gemini 2.5 Pro |
| Claude Opus 4 | Claude Sonnet 4 | GPT-4o |
| GPT-4o | Claude Sonnet 4 | Gemini 2.5 Pro |
| GPT-4o Mini | Gemini 2.5 Flash | Claude 3.5 Haiku |
| Gemini 2.5 Flash | GPT-4o Mini | Claude 3.5 Haiku |
| GPT-OSS 120B | GPT-4o | Claude Sonnet 4 |

### Circuit Breaker
- **CLOSED** (normal) → 3 consecutive failures → **OPEN**
- **OPEN** → 60s cooldown → **HALF_OPEN**
- **HALF_OPEN** → success → **CLOSED** / failure → **OPEN**

### Retry Policy
- Max 2 retries per model
- Exponential backoff with full jitter
- Base delay: 500ms, Max delay: 3000ms
- Formula: `delay = random(0, min(3000, 500 × 2^attempt))`

## Project Structure

```
hyper mind AI/
├── .env.example                        # API key template
├── package.json                        # Monorepo root (npm workspaces)
├── packages/
│   ├── shared-types/                   # Shared TypeScript types
│   │   └── src/
│   │       ├── models/provider.types.ts
│   │       ├── chat/message.types.ts
│   │       ├── chat/sse-events.types.ts
│   │       └── cinema/cinema.types.ts  # Future module interfaces
│   └── ai-providers/                   # AI provider adapters & routing
│       ├── src/
│       │   ├── interfaces/provider-adapter.interface.ts
│       │   ├── adapters/
│       │   │   ├── google.adapter.ts
│       │   │   ├── anthropic.adapter.ts
│       │   │   ├── openai.adapter.ts
│       │   │   ├── openai-compat.adapter.ts
│       │   │   └── adapter-registry.ts
│       │   ├── router/
│       │   │   ├── model-router.ts
│       │   │   └── intent-classifier.ts
│       │   └── usage/usage-tracker.ts
│       └── test/                       # Vitest test suites
│           ├── adapter-registry.test.ts
│           ├── adapters.test.ts
│           ├── intent-classifier.test.ts
│           ├── model-router.test.ts
│           ├── model-router-resilience.test.ts
│           └── usage-tracker.test.ts
└── apps/web/                           # Next.js 14 frontend
    ├── app/
    │   ├── api/
    │   │   ├── middleware/
    │   │   │   ├── rate-limit.ts
    │   │   │   └── validate.ts
    │   │   └── v1/
    │   │       ├── chat/route.ts       # SSE streaming chat
    │   │       ├── chat/cancel/route.ts
    │   │       ├── models/route.ts
    │   │       └── models/[id]/status/route.ts
    │   └── (workspace)/chat/
    │       ├── page.tsx                # New chat (updated)
    │       └── [id]/page.tsx           # Chat detail (real streaming)
    ├── lib/
    │   ├── api/
    │   │   ├── ai-client.ts           # Frontend SSE client
    │   │   └── ai-config.server.ts    # Server-side config
    │   ├── models.ts                   # Updated model catalog
    │   └── stores/
    │       ├── ui-store.ts            # UI state (existing)
    │       └── chat-store.ts          # Chat streaming state (new)
    └── components/chat/
        └── message-item.tsx            # Streaming cursor indicator
```

## Testing Instructions

```bash
# Run AI provider tests (requires vitest)
cd packages/ai-providers
npx vitest run

# Run specific test suite
npx vitest run test/intent-classifier.test.ts
npx vitest run test/model-router-resilience.test.ts
npx vitest run test/usage-tracker.test.ts

# Type-check the web app
cd apps/web
npx tsc --noEmit

# Build the application
npm run build
```

## Known Limitations

1. **No persistent database** — Conversations are not persisted. Chat history resets on page reload. Planned for Day 5 (PostgreSQL + Prisma).
2. **In-memory rate limiting** — Rate limits reset on server restart. Upgrade to Redis in Day 5.
3. **In-memory circuit breaker** — Circuit breaker state is not shared across serverless function invocations in production. Upgrade to Redis in Day 5.
4. **No authentication** — API routes are not protected by user authentication. Planned for Day 5 (NextAuth).
5. **No WebSocket support** — Only SSE streaming. WebSockets planned for Day 7 (agent control).
6. **GPT-OSS 120B availability** — Requires a third-party inference provider (Together AI, Fireworks) or self-hosted setup. Not available via OpenAI directly.
7. **Token counting** — Uses a 4-chars-per-token heuristic estimate. Actual tokenizer integration planned for future.
8. **No conversation persistence** — New chats always route to the same mock conversation IDs. Full conversation CRUD planned for Day 5.

## Remaining Work for Day 5

1. **Database layer** — PostgreSQL + Prisma ORM for conversation and message persistence
2. **Authentication** — NextAuth.js with credential and OAuth providers
3. **User management** — User accounts, API key management per user
4. **Persistent conversation CRUD** — Create, read, update, delete conversations
5. **Redis integration** — Persistent rate limiting, circuit breaker state, session cache
6. **Search** — Full-text search across conversation history
7. **File upload handling** — Image and document upload for multimodal models
