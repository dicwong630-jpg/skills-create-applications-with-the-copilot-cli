/**
 * processor.js
 * Video processing and post-production pipeline helpers.
 *
 * Provides utilities for composing multi-scene videos, applying
 * post-processing effects, and managing render queues.
 */

/**
 * Supported post-processing effects.
 * @readonly
 * @type {string[]}
 */
const EFFECTS = [
  "color-grade",
  "sharpen",
  "denoise",
  "stabilize",
  "slow-motion",
  "timelapse",
  "vignette",
  "film-grain",
];

/**
 * Compose multiple completed generation jobs into a single video sequence.
 * @param {Object[]} jobs   - Array of completed job descriptors (status must be "complete").
 * @param {Object}  [opts]
 * @param {string}  [opts.transition] - Transition effect between clips ("cut"|"fade"|"dissolve"), default "cut".
 * @param {string}  [opts.outputName] - Base name for the composed output file.
 * @returns {{outputUrl: string, totalDuration: number, clips: number, transition: string}}
 */
function composeVideo(jobs, opts = {}) {
  const { transition = "cut", outputName = "composed_output" } = opts;

  const incomplete = jobs.filter((j) => j.status !== "complete");
  if (incomplete.length > 0) {
    throw new Error(
      `${incomplete.length} job(s) are not yet complete. Wait for all jobs to finish before composing.`
    );
  }
  if (jobs.length === 0) {
    throw new Error("At least one completed job is required to compose a video");
  }

  const validTransitions = ["cut", "fade", "dissolve"];
  if (!validTransitions.includes(transition)) {
    throw new Error(`Unknown transition "${transition}". Choose from: ${validTransitions.join(", ")}`);
  }

  const totalDuration = jobs.reduce((sum, j) => sum + j.durationRendered, 0);

  return {
    outputUrl: `https://cdn.example.com/composed/${outputName}_${Date.now()}.mp4`,
    totalDuration,
    clips: jobs.length,
    transition,
    composedAt: new Date().toISOString(),
  };
}

/**
 * Apply one or more post-processing effects to a video.
 * @param {string}   videoUrl - URL of the source video.
 * @param {string[]} effects  - List of effect names to apply (order matters).
 * @param {Object}  [params]  - Optional key-value parameters for specific effects.
 * @returns {{inputUrl: string, outputUrl: string, effectsApplied: string[], params: Object, processedAt: string}}
 */
function applyEffects(videoUrl, effects, params = {}) {
  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("A valid videoUrl string is required");
  }
  if (!Array.isArray(effects) || effects.length === 0) {
    throw new Error("Provide at least one effect to apply");
  }

  const unknown = effects.filter((e) => !EFFECTS.includes(e));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown effect(s): ${unknown.join(", ")}. Available: ${EFFECTS.join(", ")}`
    );
  }

  const outputUrl = videoUrl.replace(/\.mp4$/, `_processed_${Date.now()}.mp4`);

  return {
    inputUrl: videoUrl,
    outputUrl,
    effectsApplied: effects,
    params,
    processedAt: new Date().toISOString(),
  };
}

/**
 * Add subtitles / captions to a video.
 * @param {string} videoUrl  - Source video URL.
 * @param {Array<{start: number, end: number, text: string}>} captions - Caption entries.
 * @returns {{outputUrl: string, captionCount: number, addedAt: string}}
 */
function addCaptions(videoUrl, captions) {
  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("A valid videoUrl string is required");
  }
  if (!Array.isArray(captions) || captions.length === 0) {
    throw new Error("Provide at least one caption entry");
  }

  for (const cap of captions) {
    if (typeof cap.start !== "number" || typeof cap.end !== "number" || !cap.text) {
      throw new Error(
        "Each caption must have numeric start/end (seconds) and a text string"
      );
    }
    if (cap.start >= cap.end) {
      throw new Error(
        `Caption start (${cap.start}s) must be less than end (${cap.end}s)`
      );
    }
  }

  return {
    outputUrl: videoUrl.replace(/\.mp4$/, `_captioned_${Date.now()}.mp4`),
    captionCount: captions.length,
    addedAt: new Date().toISOString(),
  };
}

/**
 * Extract a thumbnail frame from a video at a given timestamp.
 * @param {string} videoUrl    - Source video URL.
 * @param {number} [timestamp] - Time in seconds (default 0).
 * @returns {{videoUrl: string, thumbnailUrl: string, timestamp: number}}
 */
function extractThumbnail(videoUrl, timestamp = 0) {
  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("A valid videoUrl string is required");
  }
  if (typeof timestamp !== "number" || timestamp < 0) {
    throw new Error("timestamp must be a non-negative number");
  }

  const base = videoUrl.replace(/\.mp4$/, "");
  return {
    videoUrl,
    thumbnailUrl: `${base}_thumb_${timestamp}s.jpg`,
    timestamp,
  };
}

module.exports = {
  EFFECTS,
  composeVideo,
  applyEffects,
  addCaptions,
  extractThumbnail,
};
