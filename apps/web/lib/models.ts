export type ModelCapability =
  | 'reasoning'
  | 'code'
  | 'vision'
  | 'fast'
  | 'multimodal'
  | 'tools'
  | 'general';

export type ModelStatus = 'available' | 'preview' | 'coming-soon';

export interface ModelProvider {
  id: string;
  name: string;
  icon: string; // Lucide component name
  color: string;
  description?: string;
}

export interface AIModel {
  id: string;
  apiModelId: string; // Exact model ID string sent to the provider API
  name: string;
  provider: string;
  providerName: string;
  description: string;
  contextWindow: string;
  contextWindowTokens: number;
  maxOutputTokens: number;
  capabilities: ModelCapability[];
  costPer1MInput: number;
  costPer1MOutput: number;
  status: ModelStatus;
  iconColor: string;
  badgeColor?: string;
  badge?: string;
  isPopular?: boolean;
  supportsStreaming: boolean;
  supportsSystemPrompt: boolean;
  supportsImages?: boolean;
}

export const PROVIDERS: ModelProvider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: 'Brain',
    color: '#D97757',
    description: 'Frontier AI research focused on safety, nuance, and code intelligence.',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'Sparkles',
    color: '#10A37F',
    description: 'Pioneering generative models with advanced multimodal and tool-use capabilities.',
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'Compass',
    color: '#4285F4',
    description: 'Massive million-token context windows and state-of-the-art multimodal reasoning.',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'Zap',
    color: '#0066FF',
    description: 'High-efficiency open architecture models specialized in chain-of-thought reasoning.',
  },
  {
    id: 'openai-compat',
    name: 'Open Weight',
    icon: 'Layers',
    color: '#8B5CF6',
    description: 'Open-weight models via Together AI, Fireworks, vLLM, or self-hosted inference.',
  },
];

export const MODELS: AIModel[] = [
  // ── Anthropic ──────────────────────────────────────────────────────────
  {
    id: 'claude-sonnet-4',
    apiModelId: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    providerName: 'Anthropic',
    description: 'Most intelligent model for complex reasoning, multi-step coding, and nuanced prose.',
    contextWindow: '200K',
    contextWindowTokens: 200_000,
    maxOutputTokens: 8192,
    capabilities: ['reasoning', 'code', 'vision', 'tools', 'general'],
    costPer1MInput: 3.0,
    costPer1MOutput: 15.0,
    status: 'available',
    iconColor: '#D97757',
    badgeColor: '#D97757',
    badge: 'Flagship',
    isPopular: true,
    supportsStreaming: true,
    supportsSystemPrompt: true,
    supportsImages: true,
  },
  {
    id: 'claude-opus-4',
    apiModelId: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    provider: 'anthropic',
    providerName: 'Anthropic',
    description: 'Most powerful model for deep reasoning, complex analysis, and extended thinking.',
    contextWindow: '200K',
    contextWindowTokens: 200_000,
    maxOutputTokens: 32_768,
    capabilities: ['reasoning', 'code', 'vision', 'tools', 'general'],
    costPer1MInput: 15.0,
    costPer1MOutput: 75.0,
    status: 'available',
    iconColor: '#D97757',
    badgeColor: '#D97757',
    badge: 'Reasoning',
    isPopular: true,
    supportsStreaming: true,
    supportsSystemPrompt: true,
    supportsImages: true,
  },
  {
    id: 'claude-3-5-haiku',
    apiModelId: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    providerName: 'Anthropic',
    description: 'Lightning-fast responses with exceptional coding ability at a fraction of the latency.',
    contextWindow: '200K',
    contextWindowTokens: 200_000,
    maxOutputTokens: 8192,
    capabilities: ['fast', 'code', 'general'],
    costPer1MInput: 0.80,
    costPer1MOutput: 4.0,
    status: 'available',
    iconColor: '#D97757',
    badgeColor: '#D97757',
    badge: 'Fast',
    supportsStreaming: true,
    supportsSystemPrompt: true,
  },

  // ── OpenAI ─────────────────────────────────────────────────────────────
  {
    id: 'gpt-4o',
    apiModelId: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    providerName: 'OpenAI',
    description: 'Omni-modal flagship model with native audio, vision, fast inference, and robust tool-calling.',
    contextWindow: '128K',
    contextWindowTokens: 128_000,
    maxOutputTokens: 16_384,
    capabilities: ['vision', 'tools', 'reasoning', 'multimodal', 'general'],
    costPer1MInput: 2.5,
    costPer1MOutput: 10.0,
    status: 'available',
    iconColor: '#10A37F',
    badgeColor: '#10A37F',
    badge: 'Multimodal',
    isPopular: true,
    supportsStreaming: true,
    supportsSystemPrompt: true,
    supportsImages: true,
  },
  {
    id: 'gpt-4o-mini',
    apiModelId: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    providerName: 'OpenAI',
    description: 'Cost-efficient small model designed for high-throughput, low-latency daily tasks.',
    contextWindow: '128K',
    contextWindowTokens: 128_000,
    maxOutputTokens: 16_384,
    capabilities: ['fast', 'vision', 'tools', 'general'],
    costPer1MInput: 0.15,
    costPer1MOutput: 0.60,
    status: 'available',
    iconColor: '#10A37F',
    badgeColor: '#10A37F',
    badge: 'Affordable',
    supportsStreaming: true,
    supportsSystemPrompt: true,
    supportsImages: true,
  },

  // ── Google ─────────────────────────────────────────────────────────────
  {
    id: 'gemini-2-5-pro',
    apiModelId: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    providerName: 'Google',
    description: 'Ultra-powerful reasoning and multimodal model with 1M token context window.',
    contextWindow: '1M',
    contextWindowTokens: 1_000_000,
    maxOutputTokens: 65_536,
    capabilities: ['multimodal', 'reasoning', 'vision', 'code', 'general'],
    costPer1MInput: 1.25,
    costPer1MOutput: 10.0,
    status: 'available',
    iconColor: '#4285F4',
    badgeColor: '#4285F4',
    badge: '1M Context',
    isPopular: true,
    supportsStreaming: true,
    supportsSystemPrompt: true,
    supportsImages: true,
  },
  {
    id: 'gemini-2-5-flash',
    apiModelId: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    providerName: 'Google',
    description: 'Ultra-fast multimodal model built for high-throughput summarization and real-time processing.',
    contextWindow: '1M',
    contextWindowTokens: 1_000_000,
    maxOutputTokens: 65_536,
    capabilities: ['fast', 'multimodal', 'vision', 'general'],
    costPer1MInput: 0.15,
    costPer1MOutput: 0.60,
    status: 'available',
    iconColor: '#4285F4',
    badgeColor: '#4285F4',
    badge: 'Fast',
    supportsStreaming: true,
    supportsSystemPrompt: true,
    supportsImages: true,
  },
  {
    id: 'gemini-2-0-flash',
    apiModelId: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    providerName: 'Google',
    description: 'High-frequency multimodal model optimized for rapid generation and cost efficiency.',
    contextWindow: '1M',
    contextWindowTokens: 1_000_000,
    maxOutputTokens: 8192,
    capabilities: ['fast', 'multimodal', 'vision', 'general'],
    costPer1MInput: 0.10,
    costPer1MOutput: 0.40,
    status: 'available',
    iconColor: '#4285F4',
    badgeColor: '#4285F4',
    badge: 'Economy',
    supportsStreaming: true,
    supportsSystemPrompt: true,
    supportsImages: true,
  },

  // ── DeepSeek ───────────────────────────────────────────────────────────
  {
    id: 'deepseek-r1',
    apiModelId: 'deepseek-reasoner',
    name: 'DeepSeek-R1',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    description: 'Specialized open reasoning model utilizing reinforced chain-of-thought verification for STEM and logic.',
    contextWindow: '64K',
    contextWindowTokens: 64_000,
    maxOutputTokens: 8192,
    capabilities: ['reasoning', 'code', 'general'],
    costPer1MInput: 0.55,
    costPer1MOutput: 2.19,
    status: 'available',
    iconColor: '#0066FF',
    badgeColor: '#0066FF',
    badge: 'Reasoning',
    isPopular: true,
    supportsStreaming: true,
    supportsSystemPrompt: false,
  },
  {
    id: 'deepseek-v3',
    apiModelId: 'deepseek-chat',
    name: 'DeepSeek-V3',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    description: '671B Mixture-of-Experts architecture delivering frontier-grade general capabilities at extreme efficiency.',
    contextWindow: '128K',
    contextWindowTokens: 128_000,
    maxOutputTokens: 8192,
    capabilities: ['general', 'code', 'fast'],
    costPer1MInput: 0.14,
    costPer1MOutput: 0.28,
    status: 'available',
    iconColor: '#0066FF',
    badgeColor: '#0066FF',
    badge: 'MoE',
    supportsStreaming: true,
    supportsSystemPrompt: true,
  },

  // ── GPT-OSS 120B (Open Weight via Together/Fireworks/vLLM) ─────────────
  {
    id: 'gpt-oss-120b',
    apiModelId: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B',
    provider: 'openai-compat',
    providerName: 'Open Weight',
    description: 'OpenAI open-weight ~117B MoE model with 128K context. Apache 2.0 license. Via Together AI or self-hosted.',
    contextWindow: '128K',
    contextWindowTokens: 128_000,
    maxOutputTokens: 4096,
    capabilities: ['general', 'code', 'reasoning'],
    costPer1MInput: 0.88,
    costPer1MOutput: 0.88,
    status: 'available',
    iconColor: '#8B5CF6',
    badgeColor: '#8B5CF6',
    badge: 'Open Weight',
    supportsStreaming: true,
    supportsSystemPrompt: true,
  },
];

export const DEFAULT_MODEL_ID = 'claude-sonnet-4';

export function getDefaultModel(): AIModel {
  return (
    MODELS.find((m) => m.id === DEFAULT_MODEL_ID) ||
    MODELS[0]
  );
}

export function getModelById(id?: string): AIModel {
  if (!id) return getDefaultModel();
  return MODELS.find((model) => model.id === id) || getDefaultModel();
}

/** Look up a model by its API model ID string */
export function getModelByApiId(apiModelId: string): AIModel | undefined {
  return MODELS.find((model) => model.apiModelId === apiModelId);
}

/** Resolve the API model ID from a frontend display ID */
export function resolveApiModelId(displayId: string): string {
  const model = getModelById(displayId);
  return model.apiModelId;
}

export function getModelsByProvider(providerId: string): AIModel[] {
  return MODELS.filter((model) => model.provider === providerId);
}

export function getModelsByCapability(capability: ModelCapability): AIModel[] {
  return MODELS.filter((model) => model.capabilities.includes(capability));
}

export function getProviderById(providerId: string): ModelProvider | undefined {
  return PROVIDERS.find((p) => p.id === providerId);
}

export function formatCost(cost: number): string {
  if (cost < 0.1) {
    return `$${cost.toFixed(3)}`;
  }
  return `$${cost.toFixed(2)}`;
}

export default MODELS;
