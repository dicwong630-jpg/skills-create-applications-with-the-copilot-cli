/**
 * ai-video/index.js
 * Entry point for the AI video generation module.
 *
 * Usage example:
 *   const aiVideo = require('./ai-video');
 *
 *   const job = aiVideo.createGenerationJob({
 *     prompt: 'A futuristic city skyline at sunset',
 *     style: 'cinematic',
 *     resolution: 'HD',
 *     duration: 10,
 *   });
 *
 *   const prompt = aiVideo.buildScenePrompt({
 *     subject: 'A lone astronaut',
 *     action: 'walking on Mars',
 *     setting: 'a red desert landscape',
 *     lighting: 'golden hour',
 *     camera: 'wide-angle',
 *     mood: 'epic',
 *   });
 */

const {
  RESOLUTIONS,
  VIDEO_STYLES,
  createGenerationJob,
  advanceJobStatus,
  buildScenePrompt,
} = require("./generator");

const {
  EFFECTS,
  composeVideo,
  applyEffects,
  addCaptions,
  extractThumbnail,
} = require("./processor");

/**
 * Convenience helper: create and immediately "run" a job through the full
 * simulated pipeline, returning the completed job descriptor.
 * @param {Object} options - Same options as createGenerationJob.
 * @returns {Object} Completed job descriptor with outputUrl.
 */
function generateVideo(options) {
  let job = createGenerationJob(options);
  // Advance through each pipeline stage.
  while (job.status !== "complete") {
    job = advanceJobStatus(job);
  }
  return job;
}

module.exports = {
  // Constants
  RESOLUTIONS,
  VIDEO_STYLES,
  EFFECTS,
  // Generator
  createGenerationJob,
  advanceJobStatus,
  buildScenePrompt,
  // Processor
  composeVideo,
  applyEffects,
  addCaptions,
  extractThumbnail,
  // High-level helpers
  generateVideo,
};
