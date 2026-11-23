/**
 * @file intent-classifier.ts
 * @description Two-stage intent classification engine for routing prompts to specialized models.
 * Stage 1: Sub-5ms deterministic regex pattern matching, attachment analysis, and heuristic complexity scoring.
 * Stage 2: Optional LLM-assisted verification for ambiguous or low-confidence prompts.
 * @package @hypermind/ai-providers
 */

import type { ProviderAdapter } from '../interfaces/provider-adapter.interface';

/**
 * High-level intent categories recognized by the classifier.
 */
export type IntentType =
  | 'conversation'
  | 'code_generation'
  | 'code_debug'
  | 'research'
  | 'creative'
  | 'math'
  | 'reasoning'
  | 'document_analysis'
  | 'image_analysis';

/**
 * Task complexity level derived from prompt length, structure, and technical requirements.
 */
export type TaskComplexity = 'low' | 'medium' | 'high';

/**
 * Result payload containing the identified intent and complexity telemetry.
 */
export interface ClassificationResult {
  /** Dominant identified intent */
  primaryIntent: IntentType;
  /** Secondary intents identified above significance threshold */
  secondaryIntents: IntentType[];
  /** Inferred execution complexity */
  complexity: TaskComplexity;
  /** Confidence score ranging from 0.0 to 1.0 */
  confidence: number;
  /** Method used to achieve this classification */
  classificationMethod: 'heuristic' | 'llm';
}

/**
 * Heuristic pattern weight rule.
 */
interface PatternRule {
  pattern: RegExp;
  weight: number;
}

// ---------------------------------------------------------------------------
// Precompiled Regex Patterns for Sub-5ms Stage 1 Evaluation
// ---------------------------------------------------------------------------

const CODE_GENERATION_PATTERNS: PatternRule[] = [
  // Explicit code action verbs paired with software entities
  {
    pattern: /\b(?:write|implement|create|build|generate|develop|scaffold|refactor|design|code|program)\s+(?:a|an|the|some)?\s*(?:new\s+)?(?:function|api|class|component|hook|endpoint|script|module|algorithm|test|server|client|database|query|service|cli|utility|helper|schema|crud|handler|middleware|controller|route|pipeline|worker|microservice)\b/i,
    weight: 8,
  },
  // Technology-specific implementation requests
  {
    pattern: /\b(?:write|code|create|build|give\s+me)\s+(?:a|an|some)?\s*(?:typescript|javascript|python|rust|golang|go|java|c\+\+|c#|sql|react|vue|svelte|next\.?js|node\.?js|fastapi|express|django|flask|dockerfile|kubernetes|terraform)\b/i,
    weight: 7,
  },
  // Code fence markers
  {
    pattern: /```(?:typescript|javascript|python|rust|go|golang|java|cpp|c\+\+|csharp|c#|sql|html|css|bash|sh|zsh|yaml|json|toml|swift|kotlin|php|ruby|scala|r|dart)/i,
    weight: 10,
  },
  {
    pattern: /```\s*[\r\n]/,
    weight: 6,
  },
  // Syntax constructs
  {
    pattern: /\b(?:const|let|var)\s+[a-zA-Z_$][\w$]*\s*=\s*(?:function|\(.*?\)|\b\w+\()/i,
    weight: 6,
  },
  {
    pattern: /\b(?:async\s+)?function\s+[a-zA-Z_$][\w$]*\s*\(/i,
    weight: 6,
  },
  {
    pattern: /\bdef\s+[a-zA-Z_]\w*\s*\(.*?\)\s*:/i,
    weight: 6,
  },
  {
    pattern: /\bclass\s+[A-Z]\w*(?:\s+extends|\s+implements|\s*\{|\s*:)/i,
    weight: 6,
  },
  {
    pattern: /\bimport\s+.*?from\s+['"][^'"]+['"]/i,
    weight: 5,
  },
  {
    pattern: /\bexport\s+(?:default\s+)?(?:function|class|const|interface|type)\b/i,
    weight: 6,
  },
  {
    pattern: /\binterface\s+[A-Z]\w*\s*\{/i,
    weight: 6,
  },
  {
    pattern: /\btype\s+[A-Z]\w*\s*=\s*/i,
    weight: 5,
  },
  {
    pattern: /\bfn\s+[a-zA-Z_]\w*\s*\(.*?\)\s*(?:->|\{)/i,
    weight: 6,
  },
  {
    pattern: /\bfunc\s+(?:\(.*?\)\s+)?[a-zA-Z_]\w*\s*\(/i,
    weight: 6,
  },
  {
    pattern: /\bSELECT\s+.*?\s+FROM\s+.*?(?:\s+WHERE|\s+GROUP\s+BY|\s+ORDER\s+BY)?/i,
    weight: 7,
  },
  {
    pattern: /\bhow\s+to\s+(?:implement|build|code|write|create)\s+.*\s+in\s+(?:typescript|javascript|python|rust|go|react|next\.?js|node)\b/i,
    weight: 7,
  },
];

const CODE_DEBUG_PATTERNS: PatternRule[] = [
  // Debugging actions
  {
    pattern: /\b(?:debug|fix|troubleshoot|resolve|solve|diagnose|patch)\s+(?:this|the|my)?\s*(?:bug|error|issue|problem|crash|warning|failure|fault|exception|leak|hang|freeze|segfault|defect|regression)\b/i,
    weight: 9,
  },
  {
    pattern: /\bwhy\s+is\s+(?:this|my|the)\s+(?:code|function|loop|query|app|build|test)\s+(?:failing|crashing|hanging|broken|returning\s+undefined|not\s+working|throwing|producing\s+an\s+error)\b/i,
    weight: 8,
  },
  {
    pattern: /\bwhat(?:'s|\s+is)\s+wrong\s+with\s+(?:this|my)\s+(?:code|function|implementation|regex|query|snippet)\b/i,
    weight: 8,
  },
  {
    pattern: /\bhelp\s+me\s+fix\b/i,
    weight: 6,
  },
  // Error keywords & stack traces
  {
    pattern: /\b(?:stack\s*trace|traceback|uncaught\s+exception|fatal\s+error)\b/i,
    weight: 9,
  },
  {
    pattern: /\b(?:TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError|IndexError|KeyError|ValueError|AttributeError|ZeroDivisionError|NullPointerException|ClassNotFoundException|SQLException|Seg(?:mentation)?\s*fault)\b/i,
    weight: 9,
  },
  {
    pattern: /\b(?:panic:\s+runtime\s+error|errno\s+\d+|exit\s+code\s+[1-9]\d*)\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:line\s+\d+:\s*(?:error|warning)|at\s+[a-zA-Z0-9_$./]+\s*\([^\)]+:\d+:\d+\))/i,
    weight: 9,
  },
  {
    pattern: /\b(?:received\s+status\s+(?:4\d\d|5\d\d)|HTTP\s+(?:4\d\d|5\d\d)\s+Error)\b/i,
    weight: 7,
  },
];

const MATH_PATTERNS: PatternRule[] = [
  // LaTeX fractions and root operators
  {
    pattern: /\\frac\{.*?\}\{.*?\}/i,
    weight: 10,
  },
  {
    pattern: /\\(?:sum|prod|int|oint|sqrt|partial|nabla|lim|infty)\b/i,
    weight: 9,
  },
  // LaTeX symbols and relations
  {
    pattern: /\\(?:forall|exists|times|div|pm|approx|equiv|neq|leq|geq|in|subset|cup|cap|to|rightarrow|Rightarrow|Leftarrow|Leftrightarrow)\b/i,
    weight: 8,
  },
  // Greek mathematical constants
  {
    pattern: /\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Sigma|Phi|Psi|Omega)\b/i,
    weight: 7,
  },
  // LaTeX display math fences
  {
    pattern: /\$\$[\s\S]+?\$\$/,
    weight: 10,
  },
  {
    pattern: /\\\[[\s\S]+?\\\]/,
    weight: 10,
  },
  {
    pattern: /\\\([\s\S]+?\\\)/,
    weight: 8,
  },
  // Mathematical terminology & proof words
  {
    pattern: /\b(?:prove|proof|theorem|lemma|corollary|conjecture|axiom|proposition)\b/i,
    weight: 9,
  },
  {
    pattern: /\b(?:calculate|compute|evaluate|integrate|differentiate|solve)\s+(?:the\s+)?(?:equation|integral|derivative|limit|expression|sum|probability|determinant|matrix|eigenvalues?|eigenvectors?|roots?)\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:derivative|integral|differential\s+equation|polynomial|logarithm|logarithmic|prime\s+number|combinatorics|permutation|combination|trigonometry|linear\s+algebra|calculus|fourier\s+transform|laplace\s+transform|taylor\s+series)\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:dy\/dx|d\/dx|\bf\(x\)\s*=|f'\([a-zA-Z]\)|sin\^?2?\(|cos\^?2?\(|tan\^?2?\(|log_\d+|ln\()\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:solve\s+for\s+[a-zA-Z]|quadratic\s+formula|pythagorean\s+theorem|standard\s+deviation|expected\s+value|variance)\b/i,
    weight: 7,
  },
  {
    pattern: /\b\d+\s*[\+\-\*\/\^]\s*\d+\s*(?:[\+\-\*\/\^]\s*\d+\s*)*\s*=\s*(?:\?|\b)/i,
    weight: 7,
  },
];

const REASONING_PATTERNS: PatternRule[] = [
  {
    pattern: /\b(?:explain\s+why|explain\s+the\s+rationale|why\s+would|why\s+does)\b/i,
    weight: 7,
  },
  {
    pattern: /\b(?:analyze|compare|contrast|evaluate|critique|assess|appraise)\s+(?:the\s+)?(?:differences?|advantages?|disadvantages?|pros\s+and\s+cons|trade-?offs?|implications?|impact)\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:reason\s+about|think\s+through|walk\s+through|step-by-step\s+analysis|first\s+principles)\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:deduce|infer|hypothesis|counter-?argument|logical\s+fallacy|causal\s+relationship|root\s+cause\s+analysis)\b/i,
    weight: 7,
  },
  {
    pattern: /\b(?:what\s+are\s+the\s+(?:pros\s+and\s+cons|trade-?offs|consequences|implications))\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:compare\s+.*\s+(?:with|to|and|versus|vs\.?)\s+.*)\b/i,
    weight: 7,
  },
];

const CREATIVE_PATTERNS: PatternRule[] = [
  {
    pattern: /\b(?:write|compose|craft|pen|draft)\s+(?:a|an)?\s*(?:[\w-]+\s+)*?(?:story|short\s+story|poem|poetry|haiku|sonnet|limerick|script|screenplay|essay|song|lyrics|novel|novella|fiction|tale|dialogue|scene|monologue|play)\b/i,
    weight: 9,
  },
  {
    pattern: /\b(?:creative\s+writing|tell\s+me\s+a\s+story|once\s+upon\s+a\s+time|in\s+a\s+world\s+where)\b/i,
    weight: 9,
  },
  {
    pattern: /\b(?:imagine|brainstorm|generate\s+(?:ideas|names|slogans|taglines|concepts|prompts|titles))\b/i,
    weight: 7,
  },
  {
    pattern: /\b(?:world-?building|character\s+(?:arc|development|profile)|plot\s+twist|narrative\s+arc)\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:roleplay|pretend\s+you\s+are|act\s+as\s+a\s+character)\b/i,
    weight: 8,
  },
];

const RESEARCH_PATTERNS: PatternRule[] = [
  {
    pattern: /\b(?:research|investigate|find\s+information|look\s+up|explore)\s+(?:about|on|regarding)?\b/i,
    weight: 8,
  },
  {
    pattern: /\bwhat\s+is\s+(?:the\s+difference\s+between|a|an|the|known\s+about)\b/i,
    weight: 6,
  },
  {
    pattern: /\bhow\s+(?:does|do|did)\s+.*?\s+(?:work|function|operate|arise)\b/i,
    weight: 7,
  },
  {
    pattern: /\b(?:explain|describe)\s+(?:how|what|the\s+concept\s+of|the\s+difference)\b/i,
    weight: 7,
  },
  {
    pattern: /\b(?:summarize|provide\s+a\s+summary|overview|briefing|executive\s+summary|synthesis)\s+of\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:history\s+of|background\s+on|evolution\s+of|timeline\s+of)\b/i,
    weight: 7,
  },
  {
    pattern: /\b(?:state\s+of\s+the\s+art|literature\s+review|current\s+trends\s+in|market\s+overview)\b/i,
    weight: 8,
  },
  {
    pattern: /\bwho\s+(?:is|was|were|invented|discovered|founded)\b/i,
    weight: 6,
  },
];

const CONVERSATION_PATTERNS: PatternRule[] = [
  {
    pattern: /^(?:hi|hello|hey|greetings|howdy|good\s+(?:morning|afternoon|evening|day)|sup|yo)\b/i,
    weight: 9,
  },
  {
    pattern: /\b(?:how\s+are\s+you|how's\s+it\s+going|what's\s+up|who\s+are\s+you|what\s+can\s+you\s+do)\b/i,
    weight: 8,
  },
  {
    pattern: /\b(?:thank\s+you|thanks|appreciate\s+it|bye|goodbye|see\s+ya|have\s+a\s+good\s+one)\b/i,
    weight: 8,
  },
  {
    pattern: /^(?:yes|no|ok|okay|sure|cool|great|nice|got\s+it|understood|yep|nope)[.!]?$/i,
    weight: 9,
  },
];

// Document file types & extensions
const DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/json',
]);

const DOCUMENT_EXTENSIONS = /\.(pdf|docx|doc|txt|csv|xlsx|xls|md|rtf)$/i;

// Image file types & extensions
const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  'image/bmp',
]);

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i;

/**
 * Two-stage intent classification engine for routing prompts to specialized models.
 */
export class IntentClassifier {
  /**
   * Stage 1: Deterministic heuristic classification executing in under 5 milliseconds.
   *
   * @param message Text prompt content to evaluate
   * @param attachments Optional attachment descriptors attached to the prompt
   * @returns Detailed ClassificationResult containing primary/secondary intents and complexity
   */
  classify(message: string, attachments?: Array<{ type: string; name?: string }>): ClassificationResult {
    const trimmed = (message || '').trim();

    // 1. Analyze attachments first
    let hasImageAttachment = false;
    let hasDocumentAttachment = false;

    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        const type = (att.type || '').toLowerCase();
        const name = (att.name || '').toLowerCase();

        if (IMAGE_MIME_TYPES.has(type) || type.startsWith('image/') || IMAGE_EXTENSIONS.test(name)) {
          hasImageAttachment = true;
        } else if (
          DOCUMENT_MIME_TYPES.has(type) ||
          type.startsWith('text/') ||
          DOCUMENT_EXTENSIONS.test(name) ||
          type.includes('pdf') ||
          type.includes('document')
        ) {
          hasDocumentAttachment = true;
        }
      }
    }

    // 2. Score text against all intent rule sets
    const scores: Record<IntentType, number> = {
      conversation: 0,
      code_generation: 0,
      code_debug: 0,
      research: 0,
      creative: 0,
      math: 0,
      reasoning: 0,
      document_analysis: 0,
      image_analysis: 0,
    };

    // Apply attachment weights
    if (hasImageAttachment) {
      scores.image_analysis += 20;
    }
    if (hasDocumentAttachment) {
      scores.document_analysis += 20;
    }

    // Evaluate regex patterns
    this.accumulateScore(trimmed, CODE_DEBUG_PATTERNS, scores, 'code_debug');
    this.accumulateScore(trimmed, CODE_GENERATION_PATTERNS, scores, 'code_generation');
    this.accumulateScore(trimmed, MATH_PATTERNS, scores, 'math');
    this.accumulateScore(trimmed, REASONING_PATTERNS, scores, 'reasoning');
    this.accumulateScore(trimmed, CREATIVE_PATTERNS, scores, 'creative');
    this.accumulateScore(trimmed, RESEARCH_PATTERNS, scores, 'research');
    this.accumulateScore(trimmed, CONVERSATION_PATTERNS, scores, 'conversation');

    // Contextual text indicators for attachments when no metadata was passed
    if (!hasImageAttachment) {
      if (
        /(?:look\s+at|what(?:'s|\s+is)\s+in|describe|analyze|read|ocr|inspect|transcribe)\s+(?:this|the|attached)\s+(?:image|picture|photo|screenshot|diagram|drawing|graphic)/i.test(
          trimmed
        )
      ) {
        scores.image_analysis += 12;
      }
    }

    if (!hasDocumentAttachment) {
      if (
        /(?:summarize|analyze|read|review|extract\s+from|parse|examine)\s+(?:this|the|attached)\s+(?:document|pdf|file|paper|report|contract|spreadsheet|csv)/i.test(
          trimmed
        )
      ) {
        scores.document_analysis += 12;
      }
    }

    // If both code generation and debug fired, resolve priority
    if (scores.code_debug > 0 && scores.code_debug >= scores.code_generation * 0.7) {
      // Errors or debug requests take priority over generic generation
      scores.code_debug += 4;
    }

    // 3. Sort intents by score
    const rankedIntents = (Object.keys(scores) as IntentType[]).sort(
      (a, b) => scores[b] - scores[a]
    );

    const highestIntent = rankedIntents[0];
    const highestScore = scores[highestIntent];

    let primaryIntent: IntentType = 'conversation';
    let confidence = 0.65;

    if (highestScore > 0) {
      if (highestIntent === 'conversation' || highestScore >= 3) {
        primaryIntent = highestIntent;
      } else {
        // Weak match fallback to conversation
        primaryIntent = 'conversation';
      }
    } else {
      primaryIntent = 'conversation';
    }

    // Determine secondary intents with score above significance threshold
    const secondaryIntents: IntentType[] = [];
    for (const intent of rankedIntents) {
      if (intent !== primaryIntent && scores[intent] >= 4 && scores[intent] >= highestScore * 0.35) {
        secondaryIntents.push(intent);
      }
    }

    // Calculate confidence score
    if (hasImageAttachment || hasDocumentAttachment) {
      confidence = 0.96;
    } else if (highestScore >= 16) {
      confidence = 0.95;
    } else if (highestScore >= 10) {
      confidence = 0.88;
    } else if (highestScore >= 5) {
      confidence = 0.78;
    } else if (highestScore >= 3) {
      confidence = 0.68;
    } else if (primaryIntent === 'conversation' && scores.conversation > 0) {
      confidence = 0.85;
    } else {
      confidence = 0.55;
    }

    // 4. Calculate Task Complexity
    const complexity = this.calculateComplexity(trimmed, primaryIntent, scores, attachments);

    return {
      primaryIntent,
      secondaryIntents,
      complexity,
      confidence,
      classificationMethod: 'heuristic',
    };
  }

  /**
   * Helper to evaluate a pattern collection against text and accumulate intent score.
   */
  private accumulateScore(
    text: string,
    rules: PatternRule[],
    scores: Record<IntentType, number>,
    intent: IntentType
  ): void {
    for (const rule of rules) {
      if (rule.pattern.test(text)) {
        scores[intent] += rule.weight;
      }
    }
  }

  /**
   * Calculate task complexity based on message length, code fences, equations, and multi-step indicators.
   */
  private calculateComplexity(
    message: string,
    primaryIntent: IntentType,
    scores: Record<IntentType, number>,
    attachments?: Array<{ type: string }>
  ): TaskComplexity {
    const len = message.length;
    const lineCount = message.split('\n').length;
    const hasAttachments = Boolean(attachments && attachments.length > 0);

    // Simple conversation shortcut — short greetings and small talk are always low complexity
    if (primaryIntent === 'conversation' && len < 80 && lineCount <= 2 && scores.conversation > 0) {
      return 'low';
    }

    // High complexity conditions
    if (
      // Math proof or heavy LaTeX
      (primaryIntent === 'math' && (scores.math >= 15 || /\\(?:int|sum|prod|frac|partial)/i.test(message))) ||
      // Multi-file, long code snippet or architecture request
      (primaryIntent === 'code_generation' && (len > 500 || lineCount > 25 || /architecture|microservice|distributed|pipeline/i.test(message))) ||
      // Deep bug investigation with stack trace
      (primaryIntent === 'code_debug' && (len > 400 || lineCount > 20 || /stack\s*trace|traceback|line\s+\d+/i.test(message))) ||
      // Heavy document analysis with attachments
      (primaryIntent === 'document_analysis' && (hasAttachments || len > 400)) ||
      // Detailed multi-faceted prompt
      (len > 600)
    ) {
      return 'high';
    }

    // Medium complexity conditions
    if (
      len >= 120 ||
      lineCount >= 6 ||
      hasAttachments ||
      primaryIntent === 'code_generation' ||
      primaryIntent === 'code_debug' ||
      primaryIntent === 'math' ||
      primaryIntent === 'reasoning' ||
      primaryIntent === 'research' ||
      scores[primaryIntent] >= 7
    ) {
      return 'medium';
    }

    // Low complexity (short conversational queries, simple greetings)
    return 'low';
  }

  /**
   * Map intent and complexity to recommended model capability profile.
   *
   * @param result Classification result
   * @returns Capability tier ('reasoning' | 'code' | 'fast' | 'multimodal' | 'general')
   */
  getRecommendedModelType(
    result: ClassificationResult
  ): 'reasoning' | 'code' | 'fast' | 'multimodal' | 'general' {
    const { primaryIntent, complexity } = result;

    // Multimodal takes priority for visual or document inputs
    if (primaryIntent === 'image_analysis' || primaryIntent === 'document_analysis') {
      return 'multimodal';
    }

    // Code generation and debugging require dedicated code model
    if (primaryIntent === 'code_generation' || primaryIntent === 'code_debug') {
      return 'code';
    }

    // Math, logic, and deep analytical reasoning
    if (primaryIntent === 'math' || primaryIntent === 'reasoning') {
      return 'reasoning';
    }

    // Short conversational messages benefit from lightning fast response
    if (primaryIntent === 'conversation' && complexity === 'low') {
      return 'fast';
    }

    // General default
    return 'general';
  }

  /**
   * Stage 2: Optional LLM-assisted classification for ambiguous queries (confidence < 0.65).
   * Falls back gracefully to heuristic result if no adapter is provided or LLM call fails.
   */
  async classifyWithLLM(
    message: string,
    adapter?: ProviderAdapter,
    attachments?: Array<{ type: string; name?: string }>
  ): Promise<ClassificationResult> {
    const heuristicResult = this.classify(message, attachments);

    // If heuristic confidence is already high or no adapter is provided, return immediately
    if (heuristicResult.confidence >= 0.75 || !adapter) {
      return heuristicResult;
    }

    try {
      const prompt = `Classify the following user message into exactly one primary intent and complexity.
Valid intents: conversation, code_generation, code_debug, research, creative, math, reasoning, document_analysis, image_analysis.
Valid complexities: low, medium, high.

User message:
"${message.slice(0, 1000)}"

Respond ONLY with a JSON object in this exact format:
{"primaryIntent":"...","secondaryIntents":[],"complexity":"...","confidence":0.9}`;

      const response = await adapter.sendMessage({
        model: adapter.supportedModels[0] || 'default',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        maxTokens: 150,
      });

      const parsed = JSON.parse(response.content.trim().replace(/^```json\s*|\s*```$/g, ''));

      if (parsed.primaryIntent && parsed.complexity) {
        return {
          primaryIntent: parsed.primaryIntent,
          secondaryIntents: Array.isArray(parsed.secondaryIntents) ? parsed.secondaryIntents : [],
          complexity: parsed.complexity,
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
          classificationMethod: 'llm',
        };
      }
    } catch {
      // Fallback silently to heuristic classification on any failure
    }

    return heuristicResult;
  }
}
