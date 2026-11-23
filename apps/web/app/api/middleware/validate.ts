/**
 * Request validation and sanitization middleware for HYPERMIND AI API endpoints.
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequestBody {
  content: string;
  modelId?: string;
  conversationId?: string;
  conversationHistory?: ChatHistoryMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Strips HTML tags and trims leading/trailing whitespace.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<[^>]*>/g, '');
}

/**
 * Validates and sanitizes chat completion request payloads.
 */
export function validateChatRequest(body: unknown): ValidationResult<ChatRequestBody> {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }],
    };
  }

  const raw = body as Record<string, unknown>;

  // 1. Content validation (required, max 100K chars)
  let content = '';
  if (typeof raw.content !== 'string') {
    errors.push({ field: 'content', message: 'Content is required and must be a string' });
  } else {
    content = sanitizeString(raw.content);
    if (!content) {
      errors.push({ field: 'content', message: 'Content cannot be empty or whitespace only' });
    } else if (content.length > 100_000) {
      errors.push({ field: 'content', message: 'Content exceeds maximum allowed length of 100,000 characters' });
    }
  }

  // 2. Model ID validation (optional, string)
  let modelId: string | undefined;
  if (raw.modelId !== undefined && raw.modelId !== null) {
    if (typeof raw.modelId !== 'string') {
      errors.push({ field: 'modelId', message: 'modelId must be a string' });
    } else {
      modelId = raw.modelId.trim();
    }
  }

  // 3. Conversation ID validation (optional, string)
  let conversationId: string | undefined;
  if (raw.conversationId !== undefined && raw.conversationId !== null) {
    if (typeof raw.conversationId !== 'string') {
      errors.push({ field: 'conversationId', message: 'conversationId must be a string' });
    } else {
      conversationId = raw.conversationId.trim();
    }
  }

  // 4. System prompt validation (optional, string, max 50K chars)
  let systemPrompt: string | undefined;
  if (raw.systemPrompt !== undefined && raw.systemPrompt !== null) {
    if (typeof raw.systemPrompt !== 'string') {
      errors.push({ field: 'systemPrompt', message: 'systemPrompt must be a string' });
    } else {
      systemPrompt = sanitizeString(raw.systemPrompt);
      if (systemPrompt.length > 50_000) {
        errors.push({ field: 'systemPrompt', message: 'systemPrompt exceeds maximum allowed length of 50,000 characters' });
      }
    }
  }

  // 5. Temperature validation (optional, 0.0 - 2.0)
  let temperature: number | undefined;
  if (raw.temperature !== undefined && raw.temperature !== null) {
    if (typeof raw.temperature !== 'number' || Number.isNaN(raw.temperature)) {
      errors.push({ field: 'temperature', message: 'temperature must be a valid number' });
    } else if (raw.temperature < 0.0 || raw.temperature > 2.0) {
      errors.push({ field: 'temperature', message: 'temperature must be between 0.0 and 2.0' });
    } else {
      temperature = raw.temperature;
    }
  }

  // 6. Max tokens validation (optional, integer 1 - 32768)
  let maxTokens: number | undefined;
  if (raw.maxTokens !== undefined && raw.maxTokens !== null) {
    if (typeof raw.maxTokens !== 'number' || !Number.isInteger(raw.maxTokens)) {
      errors.push({ field: 'maxTokens', message: 'maxTokens must be an integer' });
    } else if (raw.maxTokens < 1 || raw.maxTokens > 32_768) {
      errors.push({ field: 'maxTokens', message: 'maxTokens must be between 1 and 32,768' });
    } else {
      maxTokens = raw.maxTokens;
    }
  }

  // 7. Conversation history validation (optional, array of messages)
  let conversationHistory: ChatHistoryMessage[] | undefined;
  if (raw.conversationHistory !== undefined && raw.conversationHistory !== null) {
    if (!Array.isArray(raw.conversationHistory)) {
      errors.push({ field: 'conversationHistory', message: 'conversationHistory must be an array' });
    } else {
      conversationHistory = [];
      const validRoles = new Set(['user', 'assistant', 'system']);

      for (let i = 0; i < raw.conversationHistory.length; i++) {
        const item = raw.conversationHistory[i];
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push({
            field: `conversationHistory[${i}]`,
            message: 'Each conversation history item must be an object',
          });
          continue;
        }

        const msgObj = item as Record<string, unknown>;
        if (typeof msgObj.role !== 'string' || !validRoles.has(msgObj.role)) {
          errors.push({
            field: `conversationHistory[${i}].role`,
            message: "Message role must be 'user', 'assistant', or 'system'",
          });
        }

        if (typeof msgObj.content !== 'string') {
          errors.push({
            field: `conversationHistory[${i}].content`,
            message: 'Message content must be a string',
          });
        }

        if (
          typeof msgObj.role === 'string' &&
          validRoles.has(msgObj.role) &&
          typeof msgObj.content === 'string'
        ) {
          conversationHistory.push({
            role: msgObj.role as 'user' | 'assistant' | 'system',
            content: sanitizeString(msgObj.content),
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      content,
      modelId,
      conversationId,
      conversationHistory,
      systemPrompt,
      temperature,
      maxTokens,
    },
  };
}
