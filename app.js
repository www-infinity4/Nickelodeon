(function () {
  "use strict";

  const engine = window.HermitEngine;
  const catalog = window.NICKELODEON_CATALOG || [];
  const els = {
    clock: document.getElementById("stationClock"),
    title: document.getElementById("programTitle"),
    eyebrow: document.getElementById("programEyebrow"),
    time: document.getElementById("programTime"),
    stationCard: document.getElementById("stationCard"),
    stationCardTitle: document.getElementById("stationCardTitle"),
    stationCardTime: document.getElementById("stationCardTime"),
    enter: document.getElementById("enterChannel"),
    startOver: document.getElementById("startOver"),
    rewind: document.getElementById("rewind30"),
    live: document.getElementById("joinLive"),
    share: document.getElementById("shareChannel"),
    shareStatus: document.getElementById("shareStatus"),
    progressBar: document.getElementById("progressBar"),
    elapsed: document.getElementById("elapsedLabel"),
    remaining: document.getElementById("remainingLabel"),
    nextGrid: document.getElementById("nextGrid"),
    guideRows: document.getElementById("guideRows"),
    guideDate: document.getElementById("guideDate")
  };

  let scheduleDate = new Date();
  let schedule = engine.buildSchedule(catalog, scheduleDate);
  let ytPlayer = null;
  let ytReady = false;
  let entered = false;
  let liveMode = true;
  let loadedKey = "";
  let failedVideo = "";
  let lastSlotIndex = -1;

  function nowSeconds() { return Date.now() / 1000; }
  function playerNode() { return document.getElementById("player"); }
  function artFor(item) {
    return item && item.videoId ? `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg` : "assets/channel-share.svg";
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>\"]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
  }
  function formatDuration(seconds) {
    const n = Math.max(0, Math.round(seconds));
    const m = Math.floor(n / 60);
    const s = String(n % 60).padStart(2, "0");
    return `${m}:${s}`;
  }
  function currentSlot(ts) { return engine.findSlot(schedule, ts == null ? nowSeconds() : ts); }
  function currentSegment(slot, ts) { return engine.findSegment(slot, ts == null ? nowSeconds() : ts); }
  function episodeName(item) { return item ? `${item.show} — ${item.title}` : "Nickelodeon"; }

  function ensureToday() {
    const now = new Date();
    if (engine.dateKey(now) !== engine.dateKey(scheduleDate)) {
      scheduleDate = now;
      schedule = engine.buildSchedule(catalog, scheduleDate);
      loadedKey = "";
      failedVideo = "";
      lastSlotIndex = -1;
      renderGuide();
      renderNext();
    }
  }

  function setProgramArt(item) {
    const url = artFor(item);
    document.body.style.setProperty("--program-art", `url('${url}')`);
  }

  function renderHeader(slot) {
    if (!slot) return;
    const item = slot.movie;
    els.eyebrow.textContent = item.eraLabel || `Nickelodeon · ${item.year}`;
    els.title.textContent = episodeName(item);
    els.time.textContent = `${engine.formatTime(slot.start)} – ${engine.formatTime(slot.end)}`;
    setProgramArt(item);
  }

  function renderStationCard(slot, message) {
    if (!slot) return;
    els.stationCard.hidden = false;
    const node = playerNode();
    if (node) node.hidden = true;
    els.stationCardTitle.textContent = message || "Next full episode at the half hour";
    els.stationCardTime.textContent = `Next: ${engine.formatTime(slot.end)}`;
  }

  function showPlayer() {
    els.stationCard.hidden = true;
    const node = playerNode();
    if (node) node.hidden = false;
  }

  function syncPlayer(force) {
    ensureToday();
    const now = nowSeconds();
    const slot = currentSlot(now);
    if (!slot) return;
    renderHeader(slot);
    const segment = currentSegment(slot, now);
    if (!segment || segment.type !== "program") {
      renderStationCard(slot);
      loadedKey = "station-" + slot.index;
      return;
    }
    if (segment.videoId === failedVideo) {
      renderStationCard(slot, "Source unavailable — skipped, not replaced by a clip");
      return;
    }
    if (!entered || !ytReady || !ytPlayer) return;

    const key = `${slot.index}:${segment.videoId}`;
    const target = Math.max(0, Math.floor(now - segment.start + (segment.mediaOffset || 0)));
    showPlayer();
    if (force || loadedKey !== key) {
      loadedKey = key;
      ytPlayer.loadVideoById({videoId: segment.videoId, startSeconds: target});
    } else if (liveMode && typeof ytPlayer.getCurrentTime === "function") {
      const actual = Number(ytPlayer.getCurrentTime() || 0);
      if (Math.abs(actual - target) > 8) ytPlayer.seekTo(target, true);
    }
  }

  function renderProgress() {
    const now = nowSeconds();
    const slot = currentSlot(now);
    if (!slot) return;
    const pct = Math.max(0, Math.min(100, ((now - slot.start) / (slot.end - slot.start)) * 100));
    els.progressBar.style.width = `${pct}%`;
    els.elapsed.textContent = formatDuration(now - slot.start);
    els.remaining.textContent = `-${formatDuration(slot.end - now)}`;
  }

  function renderNext() {
    const slot = currentSlot();
    if (!slot) return;
    const items = [];
    for (let offset = 1; offset <= 3; offset += 1) {
      const next = schedule[(slot.index + offset) % schedule.length];
      if (next) items.push(next);
    }
    els.nextGrid.innerHTML = items.map((next) => {
      const item = next.movie;
      return `<article class="next-card" style="--card-art:url('${artFor(item)}')">
        <time>${esc(engine.formatTime(next.start))}</time>
        <div><h3>${esc(item.show)}</h3><p>${esc(item.title)}</p></div>
      </article>`;
    }).join("");
  }

  function renderGuide() {
    const formatter = new Intl.DateTimeFormat([], {weekday:"long", month:"long", day:"numeric"});
    els.guideDate.textContent = formatter.format(scheduleDate);
    const now = nowSeconds();
    els.guideRows.innerHTML = schedule.map((slot) => {
      const item = slot.movie;
      const current = now >= slot.start && now < slot.end;
      return `<div class="guide-row${current ? " current" : ""}">
        <time>${esc(engine.formatTime(slot.start))}</time>
        <div><strong>${esc(item.show)}</strong><br><span>${esc(item.title)}</span></div>
        <span>${esc(item.eraLabel || String(item.year))}</span>
      </div>`;
    }).join("");
  }

  function updateClock() {
    const now = new Date();
    els.clock.textContent = now.toLocaleTimeString([], {hour:"numeric", minute:"2-digit", second:"2-digit"});
  }

  function updateShareStatus() {
    const shares = Number(localStorage.getItem("infinity_nick_shares") || 0);
    const stars = Math.floor(shares / 10);
    els.shareStatus.textContent = `${shares % 10}/10 shares · ${stars} ⭐`;
  }

  async function shareChannel() {
    const payload = {
      title: "Nickelodeon 1986–1996 — Live Channel",
      text: "A synchronized classic Nickelodeon-style channel built around full episodes from the 1986–1996 era.",
      url: location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(location.href);
      }
      const next = Number(localStorage.getItem("infinity_nick_shares") || 0) + 1;
      localStorage.setItem("infinity_nick_shares", String(next));
      updateShareStatus();
      window.dispatchEvent(new CustomEvent("infinity:share", {detail:{channel:"Nickelodeon", reward:0.1}}));
    } catch (err) {
      if (err && err.name !== "AbortError") els.shareStatus.textContent = "Share unavailable";
    }
  }

  function startOver() {
    liveMode = false;
    const slot = currentSlot();
    if (!slot || !ytReady || !ytPlayer) return;
    const segment = slot.segments[0];
    if (segment && segment.type === "program") {
      showPlayer();
      loadedKey = `manual:${slot.index}:${segment.videoId}`;
      ytPlayer.loadVideoById({videoId:segment.videoId, startSeconds:0});
    }
  }

  function rewind30() {
    liveMode = false;
    if (!ytReady || !ytPlayer || typeof ytPlayer.getCurrentTime !== "function") return;
    ytPlayer.seekTo(Math.max(0, Number(ytPlayer.getCurrentTime() || 0) - 30), true);
  }

  function joinLive() {
    liveMode = true;
    syncPlayer(true);
  }

  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player("player", {
      width:"100%",
      height:"100%",
      playerVars:{playsinline:1, rel:0, modestbranding:1, enablejsapi:1},
      events:{
        onReady:function () { ytReady = true; if (entered) syncPlayer(true); },
        onError:function () {
          const slot = currentSlot();
          const segment = currentSegment(slot);
          failedVideo = segment && segment.videoId ? segment.videoId : "";
          renderStationCard(slot, "Source unavailable — skipped, not replaced by a clip");
        },
        onStateChange:function (event) {
          if (event.data === YT.PlayerState.ENDED && liveMode) {
            const slot = currentSlot();
            renderStationCard(slot);
          }
        }
      }
    });
  };

  els.enter.addEventListener("click", function () {
    entered = true;
    els.enter.hidden = true;
    syncPlayer(true);
  });
  els.startOver.addEventListener("click", startOver);
  els.rewind.addEventListener("click", rewind30);
  els.live.addEventListener("click", joinLive);
  els.share.addEventListener("click", shareChannel);

  renderGuide();
  renderNext();
  updateClock();
  updateShareStatus();
  const initial = currentSlot();
  if (initial) {
    lastSlotIndex = initial.index;
    renderHeader(initial);
  }

  setInterval(function () {
    updateClock();
    ensureToday();
    renderProgress();
    const slot = currentSlot();
    if (slot && slot.index !== lastSlotIndex) {
      lastSlotIndex = slot.index;
      renderNext();
      renderGuide();
      if (liveMode) syncPlayer(true);
    } else if (liveMode) {
      syncPlayer(false);
    }
  }, 1000);

  window.infinityChannelState = {
    get schedule() { return schedule; },
    get currentSlot() { return currentSlot(); },
    channel:"Nickelodeon"
  };
})();
