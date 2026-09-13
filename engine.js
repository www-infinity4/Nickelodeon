(function () {
  "use strict";

  const BLOCK_SECONDS = 30 * 60;
  const DAY_SECONDS = 24 * 60 * 60;

  function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function dayStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;
  }

  function hashString(input) {
    let h = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededRandom(seed) {
    let x = seed || 1;
    return function () {
      x += 0x6D2B79F5;
      let t = x;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(items, seed) {
    const out = items.slice();
    const rand = seededRandom(seed);
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function interleaveShows(items) {
    const buckets = new Map();
    items.forEach((item) => {
      if (!buckets.has(item.show)) buckets.set(item.show, []);
      buckets.get(item.show).push(item);
    });
    const names = Array.from(buckets.keys());
    const out = [];
    let previous = "";
    while (out.length < items.length) {
      let choice = names
        .filter((name) => buckets.get(name).length && name !== previous)
        .sort((a, b) => buckets.get(b).length - buckets.get(a).length)[0];
      if (!choice) choice = names.find((name) => buckets.get(name).length);
      if (!choice) break;
      out.push(buckets.get(choice).shift());
      previous = choice;
    }
    return out;
  }

  function buildSchedule(catalog, date, excludedIds) {
    const excluded = excludedIds || new Set();
    const eligible = catalog.filter((item) => item.cleared && item.videoId && !excluded.has(item.videoId));
    if (!eligible.length) return [];

    const key = dateKey(date);
    const seed = hashString(`Nickelodeon|${key}`);
    const pool = interleaveShows(shuffled(eligible, seed));
    const start = dayStart(date);
    const schedule = [];

    for (let i = 0; i < 48; i += 1) {
      const movie = pool[i % pool.length];
      const slotStart = start + i * BLOCK_SECONDS;
      const slotEnd = slotStart + BLOCK_SECONDS;
      const runtime = Math.max(60, Math.min(movie.runtimeSeconds || 1320, BLOCK_SECONDS));
      schedule.push({
        index: i,
        movie,
        start: slotStart,
        end: slotEnd,
        segments: [
          {type:"program", start:slotStart, end:slotStart + runtime, videoId:movie.videoId, mediaOffset:0, movie},
          {type:"station", start:slotStart + runtime, end:slotEnd, movie}
        ]
      });
    }
    return schedule;
  }

  function findSlot(schedule, nowSeconds) {
    return schedule.find((slot) => nowSeconds >= slot.start && nowSeconds < slot.end) || schedule[0] || null;
  }

  function findSegment(slot, nowSeconds) {
    if (!slot) return null;
    return slot.segments.find((segment) => nowSeconds >= segment.start && nowSeconds < segment.end) || slot.segments[slot.segments.length - 1];
  }

  function formatTime(seconds) {
    return new Date(seconds * 1000).toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
  }

  // Compatibility with the shared Infinity channel remote/live-guide contract.
  function createDaySchedule(nowMs, catalog) {
    return buildSchedule(catalog, new Date(nowMs)).map((slot) => ({
      id: `${dateKey(new Date(nowMs))}-${String(slot.index).padStart(2,"0")}`,
      movie: slot.movie,
      startsAtMs: slot.start * 1000,
      endsAtMs: slot.end * 1000,
      blockSeconds: BLOCK_SECONDS
    }));
  }

  function resolve(nowMs, schedule) {
    const block = schedule.find((slot) => nowMs >= slot.startsAtMs && nowMs < slot.endsAtMs) || schedule[0] || null;
    return {block};
  }

  window.HermitEngine = {
    BLOCK_SECONDS,
    DAY_SECONDS,
    dateKey,
    buildSchedule,
    findSlot,
    findSegment,
    formatTime,
    createDaySchedule,
    resolve
  };
})();
