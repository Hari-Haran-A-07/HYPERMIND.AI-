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
  name: string;
  provider: string;
  providerName: string;
  description: string;
  contextWindow: string;
  contextWindowTokens?: number;
  capabilities: ModelCapability[];
  costPer1MInput: number;
  costPer1MOutput: number;
  status: ModelStatus;
  iconColor: string;
  badgeColor?: string;
  badge?: string;
  isPopular?: boolean;
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
    id: 'nvidia',
    name: 'NVIDIA',
    icon: 'Cpu',
    color: '#76B900',
    description: 'Optimized neural computing models engineered for synthetic data and enterprise tasks.',
  },
  {
    id: 'open-weight',
    name: 'Open-weight',
    icon: 'Layers',
    color: '#8B5CF6',
    description: 'Leading open-weight foundation models deployable with complete data ownership.',
  },
];

export const MODELS: AIModel[] = [
  // Anthropic
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    providerName: 'Anthropic',
    description: 'Most intelligent model for complex reasoning, multi-step coding, and nuanced prose.',
    contextWindow: '200K',
    contextWindowTokens: 200000,
    capabilities: ['reasoning', 'code', 'vision', 'tools', 'general'],
    costPer1MInput: 3.0,
    costPer1MOutput: 15.0,
    status: 'available',
    iconColor: '#D97757',
    badgeColor: '#D97757',
    badge: 'Flagship',
    isPopular: true,
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    providerName: 'Anthropic',
    description: 'Lightning-fast responses with exceptional coding ability at a fraction of the latency.',
    contextWindow: '200K',
    contextWindowTokens: 200000,
    capabilities: ['fast', 'code', 'general'],
    costPer1MInput: 0.8,
    costPer1MOutput: 4.0,
    status: 'available',
    iconColor: '#D97757',
    badgeColor: '#D97757',
    badge: 'Fast',
  },

  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    providerName: 'OpenAI',
    description: 'Omni-modal flagship model with native audio, vision, fast inference, and robust tool-calling.',
    contextWindow: '200K',
    contextWindowTokens: 200000,
    capabilities: ['vision', 'tools', 'reasoning', 'multimodal', 'general'],
    costPer1MInput: 2.5,
    costPer1MOutput: 10.0,
    status: 'available',
    iconColor: '#10A37F',
    badgeColor: '#10A37F',
    badge: 'Multimodal',
    isPopular: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini',
    provider: 'openai',
    providerName: 'OpenAI',
    description: 'Cost-efficient small model designed for high-throughput, low-latency daily tasks.',
    contextWindow: '128K',
    contextWindowTokens: 128000,
    capabilities: ['fast', 'vision', 'tools', 'general'],
    costPer1MInput: 0.15,
    costPer1MOutput: 0.6,
    status: 'available',
    iconColor: '#10A37F',
    badgeColor: '#10A37F',
    badge: 'Affordable',
  },

  // Google
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    providerName: 'Google',
    description: 'Ultra-long 1M context window for processing extensive documents, code repositories, and audio.',
    contextWindow: '1M',
    contextWindowTokens: 1000000,
    capabilities: ['multimodal', 'reasoning', 'vision', 'code', 'general'],
    costPer1MInput: 3.5,
    costPer1MOutput: 10.5,
    status: 'available',
    iconColor: '#4285F4',
    badgeColor: '#4285F4',
    badge: '1M Context',
    isPopular: true,
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    providerName: 'Google',
    description: 'High-frequency multimodal model built for ultra-fast summarization and real-time processing.',
    contextWindow: '1M',
    contextWindowTokens: 1000000,
    capabilities: ['fast', 'multimodal', 'vision', 'general'],
    costPer1MInput: 0.075,
    costPer1MOutput: 0.3,
    status: 'available',
    iconColor: '#4285F4',
    badgeColor: '#4285F4',
    badge: 'Fast',
  },

  // DeepSeek
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    description: 'Specialized open reasoning model utilizing reinforced chain-of-thought verification for STEM and logic.',
    contextWindow: '64K',
    contextWindowTokens: 64000,
    capabilities: ['reasoning', 'code', 'general'],
    costPer1MInput: 0.55,
    costPer1MOutput: 2.19,
    status: 'available',
    iconColor: '#0066FF',
    badgeColor: '#0066FF',
    badge: 'Reasoning',
    isPopular: true,
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    description: '671B Mixture-of-Experts architecture delivering frontier-grade general capabilities at extreme efficiency.',
    contextWindow: '128K',
    contextWindowTokens: 128000,
    capabilities: ['general', 'code', 'fast'],
    costPer1MInput: 0.14,
    costPer1MOutput: 0.28,
    status: 'available',
    iconColor: '#0066FF',
    badgeColor: '#0066FF',
    badge: 'MoE',
  },

  // NVIDIA
  {
    id: 'nemotron-4',
    name: 'Nemotron-4',
    provider: 'nvidia',
    providerName: 'NVIDIA',
    description: 'Enterprise-grade synthetic data generation and dialogue alignment optimized on TensorRT-LLM.',
    contextWindow: '128K',
    contextWindowTokens: 128000,
    capabilities: ['reasoning', 'general'],
    costPer1MInput: 0.2,
    costPer1MOutput: 0.8,
    status: 'preview',
    iconColor: '#76B900',
    badgeColor: '#76B900',
    badge: 'Community',
  },

  // Open-weight
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B',
    provider: 'open-weight',
    providerName: 'Meta',
    description: 'Industry-standard open foundation model with high general reasoning and tool call accuracy.',
    contextWindow: '128K',
    contextWindowTokens: 128000,
    capabilities: ['general', 'code', 'reasoning', 'tools'],
    costPer1MInput: 0.52,
    costPer1MOutput: 0.75,
    status: 'available',
    iconColor: '#0081FB',
    badgeColor: '#0081FB',
    badge: 'Open Weight',
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'open-weight',
    providerName: 'Mistral AI',
    description: 'Frontier multilingual and advanced coding powerhouse with native JSON output and function calling.',
    contextWindow: '128K',
    contextWindowTokens: 128000,
    capabilities: ['reasoning', 'code', 'tools', 'general'],
    costPer1MInput: 2.0,
    costPer1MOutput: 6.0,
    status: 'available',
    iconColor: '#FF7000',
    badgeColor: '#FF7000',
    badge: 'Multilingual',
  },
];

export const DEFAULT_MODEL_ID = 'claude-3-5-sonnet';

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
