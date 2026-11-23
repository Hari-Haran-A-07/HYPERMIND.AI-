/**
 * Automated test suite for HYPERMIND AI API v1 backend endpoints & middleware.
 */

import assert from 'node:assert';
import { checkRateLimit, resetRateLimits } from '../middleware/rate-limit';
import { validateChatRequest, sanitizeString } from '../middleware/validate';
import { POST as chatHandler } from '../v1/chat/route';
import activeGenerations from '../v1/chat/active-generations';
import { POST as cancelHandler } from '../v1/chat/cancel/route';
import { GET as modelsHandler } from '../v1/models/route';
import { GET as modelStatusHandler } from '../v1/models/[id]/status/route';
import { NextRequest } from 'next/server';

async function runTests() {
  console.log('--- STARTING HYPERMIND AI API TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`[PASS] ${name}`);
        passed++;
      })
      .catch((err) => {
        console.error(`[FAIL] ${name}:`, err.message);
        failed++;
      });
  }

  // 1. Rate Limiting Tests
  await test('rate-limit: allows requests under limit', () => {
    resetRateLimits();
    const config = { windowMs: 1000, maxRequests: 2 };
    const r1 = checkRateLimit('client-1', config);
    assert.strictEqual(r1.allowed, true);
    assert.strictEqual(r1.remaining, 1);

    const r2 = checkRateLimit('client-1', config);
    assert.strictEqual(r2.allowed, true);
    assert.strictEqual(r2.remaining, 0);

    const r3 = checkRateLimit('client-1', config);
    assert.strictEqual(r3.allowed, false);
    assert.strictEqual(r3.remaining, 0);
    assert.ok(r3.retryAfterMs! > 0);
  });

  await test('rate-limit: resets correctly', () => {
    resetRateLimits();
    const config = { windowMs: 1000, maxRequests: 1 };
    checkRateLimit('client-reset', config);
    const blocked = checkRateLimit('client-reset', config);
    assert.strictEqual(blocked.allowed, false);

    resetRateLimits();
    const allowed = checkRateLimit('client-reset', config);
    assert.strictEqual(allowed.allowed, true);
  });

  // 2. Validation & Sanitization Tests
  await test('validate: sanitizeString removes HTML tags', () => {
    const raw = '<b>Bold text</b> <script>alert(1)</script>';
    const sanitized = sanitizeString(raw);
    assert.strictEqual(sanitized, 'Bold text alert(1)');
  });

  await test('validate: validates valid chat request body', () => {
    const valid = validateChatRequest({
      content: 'Explain quantum computing in simple terms',
      modelId: 'claude-3-5-sonnet',
      temperature: 0.7,
      maxTokens: 2048,
      conversationHistory: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello! How can I help you today?' },
      ],
    });

    assert.strictEqual(valid.valid, true);
    assert.ok(valid.data);
    assert.strictEqual(valid.data.content, 'Explain quantum computing in simple terms');
    assert.strictEqual(valid.data.modelId, 'claude-3-5-sonnet');
    assert.strictEqual(valid.data.temperature, 0.7);
    assert.strictEqual(valid.data.maxTokens, 2048);
    assert.strictEqual(valid.data.conversationHistory?.length, 2);
  });

  await test('validate: rejects empty or non-string content', () => {
    const r1 = validateChatRequest({ content: '   ' });
    assert.strictEqual(r1.valid, false);
    assert.ok(r1.errors?.some((e) => e.field === 'content'));

    const r2 = validateChatRequest({ content: 12345 });
    assert.strictEqual(r2.valid, false);
    assert.ok(r2.errors?.some((e) => e.field === 'content'));
  });

  await test('validate: rejects out-of-range temperature & maxTokens', () => {
    const r1 = validateChatRequest({ content: 'test', temperature: 2.5 });
    assert.strictEqual(r1.valid, false);
    assert.ok(r1.errors?.some((e) => e.field === 'temperature'));

    const r2 = validateChatRequest({ content: 'test', maxTokens: 999999 });
    assert.strictEqual(r2.valid, false);
    assert.ok(r2.errors?.some((e) => e.field === 'maxTokens'));
  });

  await test('validate: validates conversation history roles', () => {
    const invalid = validateChatRequest({
      content: 'test',
      conversationHistory: [
        { role: 'invalid-role', content: 'bad message' },
      ],
    });
    assert.strictEqual(invalid.valid, false);
    assert.ok(invalid.errors?.some((e) => e.field.includes('conversationHistory')));
  });

  // 3. Models Endpoint Tests
  await test('models route: returns model catalog with provider configuration status', async () => {
    resetRateLimits();
    const req = new NextRequest('http://localhost:3000/api/v1/models', {
      method: 'GET',
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });

    const res = await modelsHandler(req);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.models));
    assert.ok(Array.isArray(json.providers));
    assert.ok(Array.isArray(json.configuredProviders));
    assert.ok(json.models.length > 0);

    const firstModel = json.models[0];
    assert.ok('id' in firstModel);
    assert.ok('name' in firstModel);
    assert.ok('provider' in firstModel);
    assert.ok('available' in firstModel);
    assert.ok('providerConfigured' in firstModel);
  });

  // 4. Model Status Endpoint Tests
  await test('model status route: returns 404 for unknown model', async () => {
    resetRateLimits();
    const req = new NextRequest('http://localhost:3000/api/v1/models/non-existent-model/status', {
      method: 'GET',
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });

    const res = await modelStatusHandler(req, { params: { id: 'non-existent-model' } });
    assert.strictEqual(res.status, 404);
    const json = await res.json();
    assert.ok(json.error);
  });

  await test('model status route: returns valid status payload for known model', async () => {
    resetRateLimits();
    const req = new NextRequest('http://localhost:3000/api/v1/models/claude-3-5-sonnet/status', {
      method: 'GET',
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });

    const res = await modelStatusHandler(req, { params: { id: 'claude-3-5-sonnet' } });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.modelId, 'claude-3-5-sonnet');
    assert.strictEqual(json.provider, 'anthropic');
    assert.ok('healthy' in json);
    assert.ok('status' in json);
    assert.ok('circuitBreaker' in json);
    assert.ok('lastChecked' in json);
  });

  // 5. Chat Endpoint Tests
  await test('chat route: rejects invalid JSON body', async () => {
    resetRateLimits();
    const req = new NextRequest('http://localhost:3000/api/v1/chat', {
      method: 'POST',
      body: 'invalid-json{{{',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
    });

    const res = await chatHandler(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error, 'Invalid JSON body');
  });

  await test('chat route: rejects invalid request payload', async () => {
    resetRateLimits();
    const req = new NextRequest('http://localhost:3000/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ content: '' }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
    });

    const res = await chatHandler(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error, 'Validation failed');
    assert.ok(Array.isArray(json.details));
  });

  await test('chat route: enforces rate limiting', async () => {
    resetRateLimits();
    const ip = '192.168.1.100';

    for (let i = 0; i < 60; i++) {
      checkRateLimit(ip, { windowMs: 60000, maxRequests: 60 });
    }

    const req = new NextRequest('http://localhost:3000/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello' }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
    });

    const res = await chatHandler(req);
    assert.strictEqual(res.status, 429);
    assert.strictEqual(res.headers.get('Retry-After'), '60');
  });

  // 6. Cancel Endpoint Tests
  await test('cancel route: rejects missing messageId', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/chat/cancel', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'content-type': 'application/json' },
    });

    const res = await cancelHandler(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error, 'messageId is required');
  });

  await test('cancel route: returns 404 for unknown messageId', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/chat/cancel', {
      method: 'POST',
      body: JSON.stringify({ messageId: 'unknown-uuid-1234' }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await cancelHandler(req);
    assert.strictEqual(res.status, 404);
  });

  await test('cancel route: successfully cancels active generation', async () => {
    const testMessageId = 'test-active-message-456';
    const controller = new AbortController();
    activeGenerations.set(testMessageId, controller);

    assert.strictEqual(controller.signal.aborted, false);
    assert.strictEqual(activeGenerations.has(testMessageId), true);

    const req = new NextRequest('http://localhost:3000/api/v1/chat/cancel', {
      method: 'POST',
      body: JSON.stringify({ messageId: testMessageId }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await cancelHandler(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.cancelled, true);
    assert.strictEqual(json.messageId, testMessageId);
    assert.strictEqual(controller.signal.aborted, true);
    assert.strictEqual(activeGenerations.has(testMessageId), false);
  });

  console.log(`\n--- TEST SUMMARY: ${passed} passed, ${failed} failed ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
