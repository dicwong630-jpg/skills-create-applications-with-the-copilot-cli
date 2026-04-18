/**
 * generator.js
 * AI video generation helpers.
 *
 * Provides functions for defining scene parameters, building
 * text-to-video prompts, and managing AI generation jobs.
 *
 * In production these functions would call a model API such as
 * Runway ML, Stable Video Diffusion, or Sora.  Here they return
 * structured mock data so the module can be used and tested offline.
 */

/**
 * Supported video resolutions.
 * @readonly
 * @enum {string}
 */
const RESOLUTIONS = {
  SD: "640x480",
  HD: "1280x720",
  FHD: "1920x1080",
  "4K": "3840x2160",
};

/**
 * Supported video styles for AI generation.
 * @readonly
 * @type {string[]}
 */
const VIDEO_STYLES = [
  "realistic",
  "cinematic",
  "anime",
  "3d-animation",
  "pixel-art",
  "watercolor",
];

/**
 * Create a video generation job descriptor.
 * @param {Object} options
 * @param {string} options.prompt      - Text description of the video.
 * @param {string} [options.style]     - Visual style (default "realistic").
 * @param {string} [options.resolution]- Target resolution key from RESOLUTIONS (default "HD").
 * @param {number} [options.duration]  - Duration in seconds (default 5).
 * @param {number} [options.fps]       - Frames per second (default 24).
 * @param {string} [options.negativePrompt] - Concepts to avoid.
 * @returns {{id: string, status: string, prompt: string, style: string, resolution: string, duration: number, fps: number, negativePrompt: string, createdAt: string}}
 */
function createGenerationJob(options) {
  const {
    prompt,
    style = "realistic",
    resolution = "HD",
    duration = 5,
    fps = 24,
    negativePrompt = "",
  } = options;

  if (!prompt || prompt.trim().length === 0) {
    throw new Error("A non-empty prompt is required to create a generation job");
  }
  if (!VIDEO_STYLES.includes(style)) {
    throw new Error(`Unknown style "${style}". Choose from: ${VIDEO_STYLES.join(", ")}`);
  }
  if (!RESOLUTIONS[resolution]) {
    throw new Error(`Unknown resolution "${resolution}". Choose from: ${Object.keys(RESOLUTIONS).join(", ")}`);
  }
  if (duration <= 0 || duration > 60) {
    throw new Error("Duration must be between 1 and 60 seconds");
  }
  if (fps < 1 || fps > 120) {
    throw new Error("FPS must be between 1 and 120");
  }

  return {
    id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: "queued",
    prompt: prompt.trim(),
    style,
    resolution: RESOLUTIONS[resolution],
    duration,
    fps,
    negativePrompt: negativePrompt.trim(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Simulate advancing a job through the generation pipeline.
 * @param {Object} job - Job descriptor returned by createGenerationJob.
 * @returns {Object} Updated job with new status and, when complete, an outputUrl.
 */
function advanceJobStatus(job) {
  const pipeline = ["queued", "preprocessing", "generating", "postprocessing", "complete"];
  const currentIndex = pipeline.indexOf(job.status);

  if (currentIndex === -1 || currentIndex === pipeline.length - 1) {
    return job; // Already complete or unknown status.
  }

  const updated = { ...job, status: pipeline[currentIndex + 1] };

  if (updated.status === "complete") {
    updated.outputUrl = `https://cdn.example.com/videos/${job.id}.mp4`;
    updated.completedAt = new Date().toISOString();
    updated.durationRendered = job.duration;
  }

  return updated;
}

/**
 * Build an optimised text-to-video prompt from structured scene parameters.
 * @param {Object} scene
 * @param {string} scene.subject     - Main subject or character description.
 * @param {string} scene.action      - What the subject is doing.
 * @param {string} scene.setting     - Location or environment.
 * @param {string} [scene.lighting]  - Lighting description.
 * @param {string} [scene.camera]    - Camera movement / shot type.
 * @param {string} [scene.mood]      - Mood or atmosphere.
 * @returns {string} Optimised prompt string.
 */
function buildScenePrompt(scene) {
  const { subject, action, setting, lighting = "", camera = "", mood = "" } = scene;

  if (!subject || !action || !setting) {
    throw new Error("scene.subject, scene.action, and scene.setting are required");
  }

  const parts = [
    `${subject} ${action}`,
    `in ${setting}`,
    lighting && `${lighting} lighting`,
    camera && `${camera} shot`,
    mood && `${mood} atmosphere`,
  ].filter(Boolean);

  return parts.join(", ");
}

module.exports = {
  RESOLUTIONS,
  VIDEO_STYLES,
  createGenerationJob,
  advanceJobStatus,
  buildScenePrompt,
};
