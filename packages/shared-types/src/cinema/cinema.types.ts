/**
 * Future Cinematic AI Architecture — Extensible Service Interfaces
 *
 * These interfaces define contracts for future AI-powered cinematic production modules.
 * They are NOT implemented in the current release. Any attempt to call these services
 * will result in a NotImplementedError.
 *
 * Planned for Day 7+ of the development roadmap.
 *
 * @package @hypermind/shared-types
 */

/**
 * Error thrown when accessing prospective or unimplemented cinematic AI services.
 */
export class NotImplementedError extends Error {
  constructor(serviceName: string) {
    super(`${serviceName} is not yet implemented. Planned for future release.`);
    this.name = 'NotImplementedError';
  }
}

/**
 * Request payload for screenplay generation.
 * @remarks Future Module — Not Yet Implemented
 */
export interface ScreenplayRequest {
  title: string;
  genre: string;
  synopsis: string;
  targetLength?: number;
}

/**
 * Output format of a screenplay generation run.
 * @remarks Future Module — Not Yet Implemented
 */
export interface ScreenplayResult {
  screenplay: string;
  scenes: number;
  estimatedDuration: string;
}

/**
 * Service contract for automated screenplay writing and narrative development.
 * @remarks Future Module — Not Yet Implemented
 */
export interface IScreenplayService {
  generateScreenplay(request: ScreenplayRequest): Promise<ScreenplayResult>;
  developCharacterArc(characterName: string, storyContext: string): Promise<string>;
}

/**
 * Specification for generating a cinematic character concept.
 * @remarks Future Module — Not Yet Implemented
 */
export interface CharacterRequest {
  description: string;
  style: string;
  role: string;
}

/**
 * Generated character profile and visual guide.
 * @remarks Future Module — Not Yet Implemented
 */
export interface CharacterResult {
  characterId: string;
  visualDescription: string;
  traits: string[];
}

/**
 * Service contract for character generation and visual consistency.
 * @remarks Future Module — Not Yet Implemented
 */
export interface ICharacterGenerationService {
  generateCharacter(request: CharacterRequest): Promise<CharacterResult>;
}

/**
 * Specification for generating a storyboard sequence.
 * @remarks Future Module — Not Yet Implemented
 */
export interface StoryboardRequest {
  sceneDescription: string;
  shotCount: number;
  style: string;
}

/**
 * Storyboard panel output data.
 * @remarks Future Module — Not Yet Implemented
 */
export interface StoryboardResult {
  panels: Array<{
    shotNumber: number;
    description: string;
    cameraAngle: string;
  }>;
}

/**
 * Service contract for visual storyboard and shot layout creation.
 * @remarks Future Module — Not Yet Implemented
 */
export interface IStoryboardService {
  generateStoryboard(request: StoryboardRequest): Promise<StoryboardResult>;
}

/**
 * Service contract for visual asset and concept art rendering.
 * @remarks Future Module — Not Yet Implemented
 */
export interface IImageGenerationService {
  generateImage(
    prompt: string,
    options?: { style?: string; resolution?: string }
  ): Promise<{ imageUrl: string; seed: number }>;
}

/**
 * Service contract for cinematic video rendering and synthesis.
 * @remarks Future Module — Not Yet Implemented
 */
export interface IVideoGenerationService {
  generateVideo(
    prompt: string,
    options?: { duration?: number; resolution?: string; fps?: number }
  ): Promise<{ videoUrl: string; duration: number }>;
}

/**
 * Service contract for skeletal or generative animation workflows.
 * @remarks Future Module — Not Yet Implemented
 */
export interface IAnimationService {
  generateAnimation(
    characterId: string,
    action: string,
    options?: { duration?: number; style?: string }
  ): Promise<{ animationUrl: string }>;
}

/**
 * Service contract for voice acting, dialogue synthesis, and voice cloning.
 * @remarks Future Module — Not Yet Implemented
 */
export interface IVoiceProductionService {
  generateVoice(
    text: string,
    options?: { voice?: string; emotion?: string; language?: string }
  ): Promise<{ audioUrl: string; duration: number }>;
  cloneVoice(sampleAudioUrl: string): Promise<{ voiceId: string }>;
}

/**
 * Structured breakdown of a scene for cinematic planning.
 * @remarks Future Module — Not Yet Implemented
 */
export interface ScenePlan {
  sceneNumber: number;
  description: string;
  characters: string[];
  location: string;
  mood: string;
  cameraWork: string[];
  lighting: string;
  duration: string;
}

/**
 * Service contract for multi-scene production planning and breakdown.
 * @remarks Future Module — Not Yet Implemented
 */
export interface IScenePlanningService {
  planScene(description: string, context?: string): Promise<ScenePlan>;
  planFullProduction(screenplay: string): Promise<ScenePlan[]>;
}
