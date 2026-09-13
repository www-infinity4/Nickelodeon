(function () {
  "use strict";

  const engine = window.HermitEngine;
  if (!engine) return;

  // Canonical 1986–1996 Nickelodeon identity. As verified full-program sources are
  // added to data/catalog.js, these shows automatically move into the primary pool.
  const PRIMARY_SHOWS = new Set([
    "Double Dare",
    "Eureeka's Castle",
    "Noozles",
    "Hey Dude",
    "Clarissa Explains It All",
    "Salute Your Shorts",
    "The Adventures of Pete & Pete",
    "Nickelodeon GUTS",
    "GUTS",
    "Legends of the Hidden Temple",
    "The Secret World of Alex Mack",
    "Are You Afraid of the Dark?",
    "Rugrats",
    "Doug",
    "The Ren & Stimpy Show",
    "Rocko's Modern Life",
    "All That",
    "Aaahh!!! Real Monsters",
    "Kenan & Kel"
  ]);

  const NICK_JR_SHOWS = new Set(["Eureeka's Castle", "Noozles"]);
  const GAME_SHOWS = new Set(["Double Dare", "Nickelodeon GUTS", "GUTS", "Legends of the Hidden Temple"]);
  const NIGHT_SHOWS = new Set(["Are You Afraid of the Dark?"]);

  // These remain valid period shows, but they are filler—not the identity of the channel.
  const ACQUIRED_FILLER = new Set(["Count Duckula", "Inspector Gadget", "Heathcliff"]);

  // Official/authorized source targets. These are intentionally not silently rebroadcast
  // by the YouTube player. They document the next sources to wire when an authorized
  // embeddable feed is available.
  window.NICKELODEON_SOURCE_TARGETS = [
    {show:"Eureeka's Castle", era:"1989–1996 Nick Jr.", status:"official-stream", provider:"Paramount+", url:"https://www.paramountplus.com/shows/eureekas-castle/"},
    {show:"Double Dare", era:"1986–1990s Nickelodeon", status:"official-youtube", provider:"Nickelodeon", videoId:"XEZCY95JliY"},
    {show:"Salute Your Shorts", era:"1991–1992 Nickelodeon", status:"official-stream", provider:"Paramount+", url:"https://www.paramountplus.com/shows/salute-your-shorts/"},
    {show:"Clarissa Explains It All", era:"1991–1994 Nickelodeon", status:"official-stream", provider:"Paramount+", url:"https://www.paramountplus.com/shows/clarissa-explains-it-all/"},
    {show:"Hey Dude", era:"1989–1991 Nickelodeon", status:"official-stream", provider:"Paramount+", url:"https://www.paramountplus.com/shows/hey-dude/"},
    {show:"Legends of the Hidden Temple", era:"1993–1995 Nickelodeon", status:"official-stream", provider:"Paramount+", url:"https://www.paramountplus.com/shows/legends-of-the-hidden-temple/"},
    {show:"90's Kids", era:"official classic Nickelodeon live stream", status:"official-free-live", provider:"Pluto TV", url:"https://pluto.tv/us/watch/live-tv/30685/"},
    {show:"90s Kids TV 2", era:"official classic Nickelodeon live stream", status:"official-free-live", provider:"Pluto TV", url:"https://pluto.tv/us/watch/live-tv/29798/"},
    {show:"Noozles", era:"Nickelodeon 1988–1993", status:"verified-history-source-needed", provider:"Pending authorized full-program source"}
  ];

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

  function shuffle(items, seed) {
    const out = items.slice();
    const random = seededRandom(seed);
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function playable(catalog, excluded) {
    return catalog.filter((item) => item && item.cleared && item.videoId && !excluded.has(item.videoId));
  }

  function byShows(items, names) {
    return items.filter((item) => names.has(item.show));
  }

  function choose(pool, state, seed, slotIndex, maxPerShow) {
    if (!pool.length) return null;
    const rotated = shuffle(pool, hashString(`${seed}|${slotIndex}`));
    const freshEpisode = rotated.find((item) => !state.usedIds.has(item.id) && item.show !== state.previousShow && (state.showCounts[item.show] || 0) < maxPerShow);
    const nonRepeatShow = rotated.find((item) => item.show !== state.previousShow && (state.showCounts[item.show] || 0) < maxPerShow);
    const underCap = rotated.find((item) => (state.showCounts[item.show] || 0) < maxPerShow);
    const pick = freshEpisode || nonRepeatShow || underCap || rotated[0];
    state.usedIds.add(pick.id);
    state.showCounts[pick.show] = (state.showCounts[pick.show] || 0) + 1;
    state.previousShow = pick.show;
    return pick;
  }

  function buildNickSchedule(catalog, date, excludedIds) {
    const excluded = excludedIds || new Set();
    const eligible = playable(catalog, excluded);
    if (!eligible.length) return [];

    const primary = eligible.filter((item) => PRIMARY_SHOWS.has(item.show));
    const nickJr = byShows(primary, NICK_JR_SHOWS);
    const games = byShows(primary, GAME_SHOWS);
    const night = byShows(primary, NIGHT_SHOWS);
    const filler = eligible.filter((item) => ACQUIRED_FILLER.has(item.show));
    const other = eligible.filter((item) => !PRIMARY_SHOWS.has(item.show) && !ACQUIRED_FILLER.has(item.show));

    const key = engine.dateKey(date);
    const seed = `Nickelodeon-1986-1996|${key}`;
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;
    const blockSeconds = 30 * 60;
    const state = {usedIds:new Set(), showCounts:Object.create(null), previousShow:""};
    const schedule = [];

    for (let i = 0; i < 48; i += 1) {
      const hour = i / 2;
      let pool;
      let cap = 8;

      if (hour >= 6 && hour < 9) {
        // Nick Jr. morning. Until authorized Eureeka/Noozles embeds are available,
        // use only a small amount of period filler rather than inventing sources.
        pool = nickJr.length ? nickJr : (filler.length ? filler : primary);
        cap = nickJr.length ? 6 : 3;
      } else if (hour >= 9 && hour < 12) {
        // Classic game-show window: Double Dare/GUTS/Legends first.
        pool = games.length ? games.concat(primary) : primary;
        cap = 5;
      } else if (hour >= 18 && hour < 22) {
        // Prime time is actual Nickelodeon identity, not acquired-cartoon filler.
        pool = primary.length ? primary : eligible;
        cap = 7;
      } else if (hour >= 22 || hour < 2) {
        // SNICK-style late block.
        pool = night.length ? night.concat(primary) : primary;
        cap = 7;
      } else {
        // Daytime: two Nick-original slots for every one acquired-filler opportunity.
        const allowFiller = i % 3 === 2;
        pool = allowFiller && filler.length ? filler.concat(primary) : primary;
        cap = allowFiller ? 4 : 7;
      }

      if (!pool || !pool.length) pool = other.length ? other : eligible;
      const movie = choose(pool, state, seed, i, cap) || eligible[i % eligible.length];
      const slotStart = start + i * blockSeconds;
      const slotEnd = slotStart + blockSeconds;
      const runtime = Math.max(60, Math.min(movie.runtimeSeconds || 1320, blockSeconds));
      schedule.push({
        index:i,
        movie,
        start:slotStart,
        end:slotEnd,
        segments:[
          {type:"program", start:slotStart, end:slotStart + runtime, videoId:movie.videoId, mediaOffset:0, movie},
          {type:"station", start:slotStart + runtime, end:slotEnd, movie}
        ]
      });
    }
    return schedule;
  }

  engine.buildSchedule = buildNickSchedule;
  engine.createDaySchedule = function (nowMs, catalog) {
    return buildNickSchedule(catalog, new Date(nowMs)).map((slot) => ({
      id:`${engine.dateKey(new Date(nowMs))}-${String(slot.index).padStart(2,"0")}`,
      movie:slot.movie,
      startsAtMs:slot.start * 1000,
      endsAtMs:slot.end * 1000,
      blockSeconds:30 * 60
    }));
  };

  window.NICKELODEON_PROGRAMMING_POLICY = {
    era:"1986–1996",
    primary:Array.from(PRIMARY_SHOWS),
    filler:Array.from(ACQUIRED_FILLER),
    rule:"Nickelodeon originals and real Nick-era blocks lead the schedule. Acquired cartoons are limited filler, never the channel identity."
  };
})();
