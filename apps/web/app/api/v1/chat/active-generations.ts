/**
 * Shared store for active AI generation AbortControllers.
 * Used by the chat route to register active generations
 * and by the cancel route to abort them.
 *
 * This is a separate module because Next.js Route Handlers
 * only allow exporting HTTP method handlers (GET, POST, etc.)
 * and cannot export arbitrary values.
 */

const activeGenerations = new Map<string, AbortController>();

export default activeGenerations;
