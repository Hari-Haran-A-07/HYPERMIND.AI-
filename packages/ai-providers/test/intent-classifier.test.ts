import { describe, it, expect } from 'vitest';
import { IntentClassifier } from '../src/router/intent-classifier';

describe('IntentClassifier', () => {
  const classifier = new IntentClassifier();

  it('should classify code generation requests', () => {
    const res1 = classifier.classify('Write a TypeScript function to parse JWT tokens and validate signatures');
    expect(res1.primaryIntent).toBe('code_generation');
    expect(classifier.getRecommendedModelType(res1)).toBe('code');

    const res2 = classifier.classify('```python\ndef fibonacci(n):\n    return n\n```');
    expect(res2.primaryIntent).toBe('code_generation');
  });

  it('should classify code debugging requests', () => {
    const res = classifier.classify(
      'TypeError: Cannot read properties of undefined (reading "map") at UserService.getUsers (user.service.ts:42:15). Fix this bug.'
    );
    expect(res.primaryIntent).toBe('code_debug');
    expect(classifier.getRecommendedModelType(res)).toBe('code');
  });

  it('should classify math and LaTeX expressions', () => {
    const res = classifier.classify('Prove that \\sum_{k=1}^n k = \\frac{n(n+1)}{2} using mathematical induction.');
    expect(res.primaryIntent).toBe('math');
    expect(classifier.getRecommendedModelType(res)).toBe('reasoning');
    expect(res.complexity).toBe('high');
  });

  it('should classify reasoning and analytical comparison', () => {
    const res = classifier.classify(
      'Analyze the trade-offs between monolithic architecture and microservices in high-throughput financial systems.'
    );
    expect(res.primaryIntent).toBe('reasoning');
    expect(classifier.getRecommendedModelType(res)).toBe('reasoning');
  });

  it('should classify creative writing prompts', () => {
    const res = classifier.classify('Write a science fiction short story about an AI discovering emotion in deep space.');
    expect(res.primaryIntent).toBe('creative');
  });

  it('should classify research requests', () => {
    const res = classifier.classify('What is the history of quantum computing and summarize current hardware approaches?');
    expect(res.primaryIntent).toBe('research');
  });

  it('should classify image analysis when image attachments or text cues are present', () => {
    const resWithAttachment = classifier.classify('What does this show?', [{ type: 'image/png', name: 'diagram.png' }]);
    expect(resWithAttachment.primaryIntent).toBe('image_analysis');
    expect(classifier.getRecommendedModelType(resWithAttachment)).toBe('multimodal');

    const resWithText = classifier.classify('Look at this screenshot and explain the error in the UI.');
    expect(resWithText.primaryIntent).toBe('image_analysis');
  });

  it('should classify document analysis when document attachments are present', () => {
    const res = classifier.classify('Summarize key findings from this paper', [{ type: 'application/pdf', name: 'report.pdf' }]);
    expect(res.primaryIntent).toBe('document_analysis');
    expect(classifier.getRecommendedModelType(res)).toBe('multimodal');
  });

  it('should classify simple conversational greetings as fast low complexity', () => {
    const res = classifier.classify('Hello! How are you today?');
    expect(res.primaryIntent).toBe('conversation');
    expect(res.complexity).toBe('low');
    expect(classifier.getRecommendedModelType(res)).toBe('fast');
  });

  it('should evaluate complexity appropriately based on content length and structure', () => {
    const lowRes = classifier.classify('Hi');
    expect(lowRes.complexity).toBe('low');

    const medRes = classifier.classify('Explain how React useEffect cleanup works in component unmounting.');
    expect(medRes.complexity).toBe('medium');

    const highRes = classifier.classify(
      'Prove the Riemann hypothesis for all non-trivial zeros and calculate the integral \\int_0^\\infty \\frac{x^{s-1}}{e^x - 1} dx with full step-by-step rigorous logical steps and error margins.'
    );
    expect(highRes.complexity).toBe('high');
  });
});
