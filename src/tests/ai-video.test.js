/**
 * src/tests/ai-video.test.js
 * Unit tests for the AI video generation module.
 * Uses Node.js built-in test runner (node --test).
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  RESOLUTIONS,
  VIDEO_STYLES,
  createGenerationJob,
  advanceJobStatus,
  buildScenePrompt,
} = require("../ai-video/generator");

const {
  EFFECTS,
  composeVideo,
  applyEffects,
  addCaptions,
  extractThumbnail,
} = require("../ai-video/processor");

const { generateVideo } = require("../ai-video");

// ── createGenerationJob ───────────────────────────────────────────────────────

describe("createGenerationJob", () => {
  const validOptions = {
    prompt: "A sunset over the ocean",
    style: "cinematic",
    resolution: "HD",
    duration: 5,
    fps: 24,
  };

  it("returns a job descriptor with expected fields", () => {
    const job = createGenerationJob(validOptions);
    assert.ok(job.id.startsWith("job_"));
    assert.equal(job.status, "queued");
    assert.equal(job.prompt, "A sunset over the ocean");
    assert.equal(job.style, "cinematic");
    assert.equal(job.resolution, RESOLUTIONS.HD);
    assert.equal(job.duration, 5);
    assert.equal(job.fps, 24);
  });

  it("applies default values when optional fields are omitted", () => {
    const job = createGenerationJob({ prompt: "Minimal prompt" });
    assert.equal(job.style, "realistic");
    assert.equal(job.resolution, RESOLUTIONS.HD);
    assert.equal(job.duration, 5);
    assert.equal(job.fps, 24);
  });

  it("throws for an empty prompt", () => {
    assert.throws(
      () => createGenerationJob({ prompt: "   " }),
      /non-empty prompt/
    );
  });

  it("throws for an unknown style", () => {
    assert.throws(
      () => createGenerationJob({ prompt: "test", style: "manga" }),
      /Unknown style/
    );
  });

  it("throws for an unknown resolution", () => {
    assert.throws(
      () => createGenerationJob({ prompt: "test", resolution: "8K" }),
      /Unknown resolution/
    );
  });

  it("throws for duration out of range (zero)", () => {
    assert.throws(
      () => createGenerationJob({ prompt: "test", duration: 0 }),
      /Duration must be between/
    );
  });

  it("throws for duration out of range (too long)", () => {
    assert.throws(
      () => createGenerationJob({ prompt: "test", duration: 61 }),
      /Duration must be between/
    );
  });

  it("accepts all known video styles", () => {
    for (const style of VIDEO_STYLES) {
      assert.doesNotThrow(() => createGenerationJob({ prompt: "test", style }));
    }
  });

  it("accepts all known resolutions", () => {
    for (const resolution of Object.keys(RESOLUTIONS)) {
      assert.doesNotThrow(() => createGenerationJob({ prompt: "test", resolution }));
    }
  });
});

// ── advanceJobStatus ──────────────────────────────────────────────────────────

describe("advanceJobStatus", () => {
  it('advances from "queued" to "preprocessing"', () => {
    const job = createGenerationJob({ prompt: "test" });
    assert.equal(job.status, "queued");
    const next = advanceJobStatus(job);
    assert.equal(next.status, "preprocessing");
  });

  it('sets outputUrl when status becomes "complete"', () => {
    let job = createGenerationJob({ prompt: "test", duration: 3 });
    while (job.status !== "complete") {
      job = advanceJobStatus(job);
    }
    assert.ok(job.outputUrl.includes(job.id));
    assert.ok("completedAt" in job);
    assert.equal(job.durationRendered, 3);
  });

  it("does not advance a complete job", () => {
    let job = createGenerationJob({ prompt: "test" });
    while (job.status !== "complete") {
      job = advanceJobStatus(job);
    }
    const unchanged = advanceJobStatus(job);
    assert.equal(unchanged.status, "complete");
  });
});

// ── buildScenePrompt ──────────────────────────────────────────────────────────

describe("buildScenePrompt", () => {
  it("builds a prompt from required fields", () => {
    const prompt = buildScenePrompt({
      subject: "A dragon",
      action: "flying over mountains",
      setting: "a snowy landscape",
    });
    assert.ok(prompt.includes("A dragon"));
    assert.ok(prompt.includes("flying over mountains"));
    assert.ok(prompt.includes("a snowy landscape"));
  });

  it("includes optional lighting, camera, and mood when provided", () => {
    const prompt = buildScenePrompt({
      subject: "A robot",
      action: "running",
      setting: "a city",
      lighting: "neon",
      camera: "tracking",
      mood: "tense",
    });
    assert.ok(prompt.includes("neon lighting"));
    assert.ok(prompt.includes("tracking shot"));
    assert.ok(prompt.includes("tense atmosphere"));
  });

  it("throws when required fields are missing", () => {
    assert.throws(
      () => buildScenePrompt({ subject: "Test" }),
      /required/
    );
  });
});

// ── composeVideo ──────────────────────────────────────────────────────────────

describe("composeVideo", () => {
  function makeCompletedJob(duration = 5) {
    let job = createGenerationJob({ prompt: "test", duration });
    while (job.status !== "complete") {
      job = advanceJobStatus(job);
    }
    return job;
  }

  it("returns composition metadata for a list of completed jobs", () => {
    const jobs = [makeCompletedJob(5), makeCompletedJob(3)];
    const result = composeVideo(jobs);
    assert.equal(result.clips, 2);
    assert.equal(result.totalDuration, 8);
    assert.ok(result.outputUrl.includes("composed"));
  });

  it("defaults to cut transition", () => {
    const result = composeVideo([makeCompletedJob()]);
    assert.equal(result.transition, "cut");
  });

  it("accepts valid transitions", () => {
    for (const t of ["cut", "fade", "dissolve"]) {
      assert.doesNotThrow(() => composeVideo([makeCompletedJob()], { transition: t }));
    }
  });

  it("throws for unknown transition", () => {
    assert.throws(
      () => composeVideo([makeCompletedJob()], { transition: "wipe" }),
      /Unknown transition/
    );
  });

  it("throws when jobs array is empty", () => {
    assert.throws(() => composeVideo([]), /At least one/);
  });

  it("throws when a job is not complete", () => {
    const incomplete = createGenerationJob({ prompt: "test" });
    assert.throws(() => composeVideo([incomplete]), /not yet complete/);
  });
});

// ── applyEffects ──────────────────────────────────────────────────────────────

describe("applyEffects", () => {
  const url = "https://cdn.example.com/videos/test.mp4";

  it("returns processed URL for valid effects", () => {
    const result = applyEffects(url, ["color-grade", "sharpen"]);
    assert.ok(result.outputUrl.includes("processed"));
    assert.deepEqual(result.effectsApplied, ["color-grade", "sharpen"]);
  });

  it("throws for unknown effects", () => {
    assert.throws(
      () => applyEffects(url, ["unknown-effect"]),
      /Unknown effect/
    );
  });

  it("throws for empty effects list", () => {
    assert.throws(() => applyEffects(url, []), /at least one effect/);
  });

  it("throws for invalid videoUrl", () => {
    assert.throws(() => applyEffects(null, ["sharpen"]), /valid videoUrl/);
  });

  it("accepts all known effects", () => {
    assert.doesNotThrow(() => applyEffects(url, EFFECTS));
  });
});

// ── addCaptions ───────────────────────────────────────────────────────────────

describe("addCaptions", () => {
  const url = "https://cdn.example.com/videos/test.mp4";
  const captions = [
    { start: 0, end: 2, text: "Hello world" },
    { start: 2, end: 5, text: "This is a caption" },
  ];

  it("returns metadata with correct caption count", () => {
    const result = addCaptions(url, captions);
    assert.equal(result.captionCount, 2);
    assert.ok(result.outputUrl.includes("captioned"));
  });

  it("throws for empty caption list", () => {
    assert.throws(() => addCaptions(url, []), /at least one caption/);
  });

  it("throws when start >= end", () => {
    assert.throws(
      () => addCaptions(url, [{ start: 3, end: 2, text: "bad" }]),
      /less than end/
    );
  });

  it("throws for invalid videoUrl", () => {
    assert.throws(() => addCaptions("", captions), /valid videoUrl/);
  });
});

// ── extractThumbnail ──────────────────────────────────────────────────────────

describe("extractThumbnail", () => {
  const url = "https://cdn.example.com/videos/test.mp4";

  it("returns thumbnail URL at default timestamp 0", () => {
    const result = extractThumbnail(url);
    assert.equal(result.timestamp, 0);
    assert.ok(result.thumbnailUrl.endsWith("_thumb_0s.jpg"));
  });

  it("uses provided timestamp", () => {
    const result = extractThumbnail(url, 3.5);
    assert.equal(result.timestamp, 3.5);
    assert.ok(result.thumbnailUrl.includes("3.5s"));
  });

  it("throws for negative timestamp", () => {
    assert.throws(
      () => extractThumbnail(url, -1),
      /non-negative/
    );
  });

  it("throws for invalid videoUrl", () => {
    assert.throws(() => extractThumbnail(null), /valid videoUrl/);
  });
});

// ── generateVideo (high-level) ─────────────────────────────────────────────────

describe("generateVideo", () => {
  it("returns a complete job with outputUrl", () => {
    const job = generateVideo({
      prompt: "A futuristic city at night",
      style: "cinematic",
    });
    assert.equal(job.status, "complete");
    assert.ok(typeof job.outputUrl === "string" && job.outputUrl.length > 0);
  });
});
