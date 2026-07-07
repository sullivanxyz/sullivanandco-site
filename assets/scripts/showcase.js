/* ==========================================================================
   Sullivan & Co — Showcase demos
   Four self-contained interactive demos. Vanilla JS, no dependencies.
   All data is illustrative sample data.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Analytics — every event funnels through main.js's scTrack helper.
     Event names: showcase_demo_engaged {project, source}
                  showcase_demo_interacted {project, action}
     ------------------------------------------------------------------------ */
  const PROJECT = { rx: "rolodex", bg: "budget", nb: "newborn_log", dm: "family_domain" };
  function track(name, params) {
    if (typeof window.scTrack === "function") window.scTrack(name, params);
  }

  /* ------------------------------------------------------------------------
     Collapsible stage + tabs
     ------------------------------------------------------------------------ */
  const stage = document.getElementById("showcase");
  const toggleBar = document.getElementById("showcaseToggle");
  const tabs = document.querySelectorAll(".showcase-tab");
  const panels = document.querySelectorAll(".showcase-panel");

  function currentProject() {
    const active = document.querySelector(".showcase-tab.active");
    return active ? PROJECT[active.dataset.panel] : "rolodex";
  }
  function setCollapsed(collapsed) {
    if (!stage) return;
    stage.classList.toggle("collapsed", collapsed);
    if (toggleBar) toggleBar.setAttribute("aria-expanded", String(!collapsed));
  }
  function activatePanel(key, source) {
    tabs.forEach(function (t) { t.classList.toggle("active", t.dataset.panel === key); });
    panels.forEach(function (p) { p.classList.toggle("active", p.id === "sc-" + key); });
    setCollapsed(false);
    track("showcase_demo_engaged", { project: PROJECT[key], source: source || "unknown" });
  }

  if (toggleBar) {
    toggleBar.addEventListener("click", function () {
      const opening = stage.classList.contains("collapsed");
      setCollapsed(!opening);
      if (opening) {
        track("showcase_demo_engaged", { project: currentProject(), source: "bar" });
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { activatePanel(tab.dataset.panel, "tab"); });
  });

  /* Deep links: the offer cards jump straight to their demo via
     data-showcase="rx|bg|nb|dm", expanding the stage if collapsed. */
  document.querySelectorAll("[data-showcase]").forEach(function (link) {
    link.addEventListener("click", function () {
      activatePanel(link.dataset.showcase, "offer_card");
      if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Nav "Showcase" link: expand the stage so it doesn't land on a closed bar. */
  document.querySelectorAll('a[href="#showcase"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (stage && stage.classList.contains("collapsed")) {
        setCollapsed(false);
        track("showcase_demo_engaged", { project: currentProject(), source: "nav" });
      }
    });
  });

  /* helpers */
  function el(tag, cls, html) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }
  function svgEl(tag, attrs) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function money(n) {
    const sign = n < 0 ? "−" : "";
    return sign + "$" + Math.abs(n).toLocaleString("en-US");
  }

  /* ==========================================================================
     Demo 1 — Wedding Guest Rolodex
     ========================================================================== */
  (function rolodex() {
    const root = document.getElementById("rxApp");
    if (!root) return;

    const TABLES = [
      {
        id: 1, name: "Jen's Parents & Their Friends", tags: ["Family", "Bride"], seats: 10,
        guests: ["Bill", "Diane", "Carol", "Frank", "Rita", "Sam", "Lois", "Gene", "Pat", "Marie"],
        links: [4, 6]
      },
      {
        id: 2, name: "Syracuse Inner Circle", tags: ["Friends", "Groom"], seats: 8,
        guests: ["Tony", "Dave", "Priya", "Marcus", "Jess", "Colin", "Dana", "Ray"],
        links: [3]
      },
      {
        id: 3, name: "Eric's HS Friends + Partners", tags: ["Friends", "Groom"], seats: 10,
        guests: ["Mike", "Cathy", "Greg", "Kevin", "Kelly"],
        links: [2]
      },
      {
        id: 4, name: "Under-35 Cousins Across the Aisle", tags: ["Family", "Both"], seats: 8,
        guests: ["Emma", "Jack", "Olivia", "Nate", "Chloe", "Ben", "Grace"],
        links: [1, 6]
      },
      {
        id: 5, name: "Jen's Work Crew", tags: ["Friends", "Bride"], seats: 8,
        guests: ["Aisha", "Tom", "Lena", "Steph", "Victor", "Nora"],
        links: [1]
      },
      {
        id: 6, name: "Aunts, Uncles & the Loud End", tags: ["Family", "Both"], seats: 10,
        guests: ["Joe", "Meg", "Sal", "Terri", "Lou", "Fran", "Artie", "Deb", "Gus"],
        links: [1, 4]
      }
    ];

    /* Hand-written details for a few guests; the rest get sensible defaults. */
    const DETAILS = {
      "Mike":  { rel: "HS lacrosse teammate — groom's side", rsvp: "Confirmed", addr: true,  note: "Bringing a plus-one, name TBD." },
      "Cathy": { rel: "HS friend — groom's side", rsvp: "Confirmed", addr: true,  note: "Gluten-free. Knows Priya from college." },
      "Greg":  { rel: "HS friend — groom's side", rsvp: "Waiting on RSVP", addr: false, note: "Moved recently — chase new address for the card list." },
      "Kevin": { rel: "HS friend — groom's side", rsvp: "Confirmed", addr: true,  note: "Offered to run the late-night playlist." },
      "Kelly": { rel: "HS friend — groom's side", rsvp: "Confirmed", addr: true,  note: "Overlaps with Table 2 — seat within waving distance." },
      "Bill":  { rel: "Father of the bride", rsvp: "Confirmed", addr: true, note: "Giving the first toast." },
      "Emma":  { rel: "Cousin — bride's side", rsvp: "Confirmed", addr: true, note: "Table captain for the under-35s." },
      "Tony":  { rel: "College roommate — groom's side", rsvp: "Confirmed", addr: true, note: "Best man." }
    };

    let activeTable = 3;      /* start on the reference example */
    let activeGuest = null;

    /* Layout */
    const listCol = el("div");
    listCol.appendChild(el("p", "rx-col-label", "Tables"));
    const listWrap = el("div", "rx-tables");
    listCol.appendChild(listWrap);

    const webCol = el("div", "rx-web");
    webCol.appendChild(el("p", "rx-col-label", "Relationship web"));
    const svgWrap = el("div", "rx-svg-wrap");
    webCol.appendChild(svgWrap);
    const detail = el("div", "rx-detail");
    webCol.appendChild(detail);

    root.appendChild(listCol);
    root.appendChild(webCol);

    function renderList() {
      listWrap.innerHTML = "";
      TABLES.forEach(function (t) {
        const btn = el("button", "rx-table" + (t.id === activeTable ? " active" : ""));
        const pct = Math.round((t.guests.length / t.seats) * 100);
        btn.innerHTML =
          '<div class="rx-table-top"><span class="rx-table-num">' + t.id + '</span>' +
          '<span class="rx-table-name">' + t.name + "</span></div>" +
          '<div class="rx-tags">' + t.tags.map(function (g) { return '<span class="rx-tag">' + g + "</span>"; }).join("") + "</div>" +
          '<div class="rx-seatbar"><div class="rx-seatbar-track"><div class="rx-seatbar-fill" style="width:' + pct + '%"></div></div>' +
          '<span class="rx-seatbar-count">' + t.guests.length + " of " + t.seats + "</span></div>";
        btn.addEventListener("click", function () {
          selectTable(t.id);
          track("showcase_demo_interacted", { project: "rolodex", action: "select_table" });
        });
        listWrap.appendChild(btn);
      });
    }

    function renderWeb() {
      const t = TABLES.find(function (x) { return x.id === activeTable; });
      const W = 420, H = 420, cx = 210, cy = 210;
      const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
        "aria-label": "Relationship web for table " + t.id });

      /* dashed links from the big ring to related mini-clusters */
      const miniSlots = [
        { x: 44, y: 44 }, { x: 376, y: 44 }, { x: 44, y: 376 }, { x: 376, y: 376 }, { x: 376, y: 210 }
      ];
      const others = TABLES.filter(function (x) { return x.id !== activeTable; });

      others.forEach(function (o, i) {
        const s = miniSlots[i % miniSlots.length];
        if (t.links.indexOf(o.id) !== -1) {
          svg.appendChild(svgEl("line", { class: "rx-link", x1: cx, y1: cy, x2: s.x, y2: s.y }));
        }
      });

      /* big ring */
      svg.appendChild(svgEl("circle", { class: "rx-ring", cx: cx, cy: cy, r: 100 }));

      /* center tag pills */
      t.tags.forEach(function (tag, i) {
        const y = cy - 16 + i * 26;
        const w = tag.length * 7 + 26;
        svg.appendChild(svgEl("rect", { class: "rx-pill", x: cx - w / 2, y: y - 11, width: w, height: 20, rx: 10 }));
        const txt = svgEl("text", { class: "rx-pill-label", x: cx, y: y + 3 });
        txt.textContent = tag;
        svg.appendChild(txt);
      });

      /* guest nodes on the ring rim + open seats */
      const total = t.seats;
      for (let i = 0; i < total; i++) {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / total;
        const gx = cx + Math.cos(ang) * 118;
        const gy = cy + Math.sin(ang) * 118;
        if (i < t.guests.length) {
          const name = t.guests[i];
          const node = svgEl("circle", {
            class: "rx-node" + (name === activeGuest ? " selected" : ""),
            cx: gx, cy: gy, r: 24
          });
          node.addEventListener("click", function () {
            selectGuest(name, t);
            track("showcase_demo_interacted", { project: "rolodex", action: "select_guest" });
          });
          svg.appendChild(node);
          const label = svgEl("text", { class: "rx-node-label", x: gx, y: gy + 3.5 });
          label.textContent = name;
          svg.appendChild(label);
        } else {
          svg.appendChild(svgEl("circle", { class: "rx-node-open", cx: gx, cy: gy, r: 20 }));
          const plus = svgEl("text", { class: "rx-node-plus", x: gx, y: gy + 4.5 });
          plus.textContent = "+";
          svg.appendChild(plus);
        }
      }

      /* mini-clusters for the other tables */
      others.forEach(function (o, i) {
        const s = miniSlots[i % miniSlots.length];
        const mini = svgEl("circle", { class: "rx-mini", cx: s.x, cy: s.y, r: 17 });
        mini.addEventListener("click", function () {
          selectTable(o.id);
          track("showcase_demo_interacted", { project: "rolodex", action: "select_table" });
        });
        svg.appendChild(mini);
        const num = svgEl("text", { class: "rx-mini-label", x: s.x, y: s.y + 3.5 });
        num.textContent = o.id;
        svg.appendChild(num);
        const nm = svgEl("text", { class: "rx-mini-name", x: s.x, y: s.y + 30 });
        nm.textContent = o.name.length > 22 ? o.name.slice(0, 21) + "…" : o.name;
        svg.appendChild(nm);
      });

      svgWrap.innerHTML = "";
      svgWrap.appendChild(svg);
    }

    function renderDetail(t) {
      if (!activeGuest) {
        detail.innerHTML = "Tap a guest to see their card — relationship, RSVP, and whether their address is on file for the holiday-card list.";
        return;
      }
      const d = DETAILS[activeGuest] || {
        rel: (t.tags[0] === "Family" ? "Family" : "Friend") + " — " +
             (t.tags[1] === "Bride" ? "bride's side" : t.tags[1] === "Groom" ? "groom's side" : "both sides"),
        rsvp: "Confirmed", addr: true, note: "No notes yet."
      };
      detail.innerHTML =
        "<strong>" + activeGuest + "</strong> · " + d.rel +
        '<div class="rx-detail-meta">' +
        '<span class="rx-check"><i class="fas ' + (d.rsvp === "Confirmed" ? "fa-check" : "fa-hourglass-half") + '"></i>' + d.rsvp + "</span>" +
        '<span class="rx-check"><i class="fas ' + (d.addr ? "fa-address-card" : "fa-triangle-exclamation") + '"></i>' +
        (d.addr ? "Address on file" : "No address yet") + "</span></div>" + d.note;
    }

    function selectTable(id) {
      activeTable = id;
      activeGuest = null;
      renderList();
      renderWeb();
      renderDetail(TABLES.find(function (x) { return x.id === id; }));
    }
    function selectGuest(name, t) {
      activeGuest = name;
      renderWeb();
      renderDetail(t);
    }

    selectTable(activeTable);
  })();

  /* ==========================================================================
     Demo 2 — Family Budget
     ========================================================================== */
  (function budget() {
    const root = document.getElementById("bgApp");
    if (!root) return;

    const MONTHS = [
      {
        label: "April 2026", income: 12400,
        verdict: "$85 left over — quiet month, right where it should be.",
        buckets: [
          { name: "Foundations", sub: "the non-negotiables", planned: 5200, lines: [
            ["Mortgage", 3200], ["Childcare", 950], ["Insurance", 480], ["Utilities", 335], ["Subscriptions", 190]] },
          { name: "Lifestyle", sub: "the living", planned: 3400, lines: [
            ["Groceries", 1080], ["Dining out", 640], ["Kids", 410], ["Home", 460], ["Everything else", 570]] },
          { name: "Future", sub: "pay yourselves first", planned: 3800, lines: [
            ["401(k) top-up", 1500], ["Brokerage", 1200], ["529 plans", 600], ["Cash buffer", 500]] }
        ]
      },
      {
        label: "May 2026", income: 12400,
        verdict: "$420 left over — swept to the cash buffer on the 31st.",
        buckets: [
          { name: "Foundations", sub: "the non-negotiables", planned: 5200, lines: [
            ["Mortgage", 3200], ["Childcare", 950], ["Insurance", 480], ["Utilities", 290], ["Subscriptions", 190]] },
          { name: "Lifestyle", sub: "the living", planned: 3400, lines: [
            ["Groceries", 1110], ["Dining out", 520], ["Kids", 380], ["Home", 330], ["Everything else", 530]] },
          { name: "Future", sub: "pay yourselves first", planned: 3800, lines: [
            ["401(k) top-up", 1500], ["Brokerage", 1200], ["529 plans", 600], ["Cash buffer", 500]] }
        ]
      },
      {
        label: "June 2026", income: 12400,
        verdict: "$160 over — Lifestyle ran hot. Two anniversaries, one long weekend. Worth it, and now it's visible.",
        buckets: [
          { name: "Foundations", sub: "the non-negotiables", planned: 5200, lines: [
            ["Mortgage", 3200], ["Childcare", 950], ["Insurance", 480], ["Utilities", 310], ["Subscriptions", 200]] },
          { name: "Lifestyle", sub: "the living", planned: 3400, lines: [
            ["Groceries", 1140], ["Dining out", 780], ["Kids", 460], ["Home", 620], ["Everything else", 620]] },
          { name: "Future", sub: "pay yourselves first", planned: 3800, lines: [
            ["401(k) top-up", 1500], ["Brokerage", 1200], ["529 plans", 600], ["Cash buffer", 500]] }
        ]
      }
    ];

    let monthIdx = MONTHS.length - 1;
    const openBuckets = { Lifestyle: true };   /* start with the interesting one open */

    function bucketTotal(b) {
      return b.lines.reduce(function (s, l) { return s + l[1]; }, 0);
    }

    function render() {
      const m = MONTHS[monthIdx];
      const spent = m.buckets.reduce(function (s, b) { return s + bucketTotal(b); }, 0);
      const left = m.income - spent;
      const future = bucketTotal(m.buckets[2]);
      const rate = Math.round((future / m.income) * 100);

      root.innerHTML = "";

      const head = el("div", "bg-head");
      const nav = el("div", "bg-month");
      const prev = el("button", "bg-nav", '<i class="fas fa-chevron-left"></i>');
      const next = el("button", "bg-nav", '<i class="fas fa-chevron-right"></i>');
      prev.disabled = monthIdx === 0;
      next.disabled = monthIdx === MONTHS.length - 1;
      prev.setAttribute("aria-label", "Previous month");
      next.setAttribute("aria-label", "Next month");
      prev.addEventListener("click", function () {
        monthIdx--; render();
        track("showcase_demo_interacted", { project: "budget", action: "change_month" });
      });
      next.addEventListener("click", function () {
        monthIdx++; render();
        track("showcase_demo_interacted", { project: "budget", action: "change_month" });
      });
      nav.appendChild(prev);
      nav.appendChild(el("span", "bg-month-label", m.label));
      nav.appendChild(next);
      head.appendChild(nav);

      const stats = el("div", "bg-stats");
      stats.appendChild(el("div", "", '<span class="bg-stat-num' + (left < 0 ? " over" : "") + '">' + money(left) +
        '</span><span class="bg-stat-label">left this month</span>'));
      stats.appendChild(el("div", "", '<span class="bg-stat-num">' + rate +
        '%</span><span class="bg-stat-label">savings rate</span>'));
      head.appendChild(stats);
      root.appendChild(head);

      root.appendChild(el("p", "bg-verdict", m.verdict));

      const wrap = el("div", "bg-buckets");
      m.buckets.forEach(function (b) {
        const actual = bucketTotal(b);
        const over = actual > b.planned;
        const maxScale = Math.max(actual, b.planned) * 1.08;
        const bucket = el("div", "bg-bucket" + (openBuckets[b.name] ? " open" : ""));

        const headBtn = el("button", "bg-bucket-head");
        headBtn.innerHTML =
          '<span class="bg-bucket-name">' + b.name + "<small>" + b.sub + "</small></span>" +
          '<span class="bg-bar"><span class="bg-bar-fill' + (over ? " over" : "") +
          '" style="width:' + Math.min(100, (actual / maxScale) * 100) + '%"></span>' +
          '<span class="bg-bar-plan" style="left:' + (b.planned / maxScale) * 100 + '%"></span></span>' +
          '<span class="bg-bucket-nums"><strong>' + money(actual) + "</strong> / " + money(b.planned) + "</span>" +
          '<span class="bg-caret"><i class="fas fa-chevron-down"></i></span>';
        headBtn.addEventListener("click", function () {
          openBuckets[b.name] = !openBuckets[b.name];
          bucket.classList.toggle("open");
          track("showcase_demo_interacted", { project: "budget", action: "toggle_bucket" });
        });
        bucket.appendChild(headBtn);

        const lines = el("div", "bg-lines");
        b.lines.forEach(function (l) {
          lines.appendChild(el("div", "bg-line", "<span>" + l[0] + "</span><span>" + money(l[1]) + "</span>"));
        });
        bucket.appendChild(lines);
        wrap.appendChild(bucket);
      });
      root.appendChild(wrap);

      root.appendChild(el("p", "bg-principle",
        "Three buckets. One weekly glance. Every dollar gets a job — the tick mark is the plan, the bar is real life."));
    }

    render();
  })();

  /* ==========================================================================
     Demo 3 — Newborn Log
     ========================================================================== */
  (function newborn() {
    const root = document.getElementById("nbApp");
    if (!root) return;

    const now = Date.now();
    const MIN = 60000, HR = 3600000;
    function ago(mins) { return new Date(now - mins * MIN); }

    /* type: feed | diaper | sleep (sleep has end) */
    let entries = [
      { type: "feed",   time: ago(130),  note: "Bottle, 4 oz" },
      { type: "diaper", time: ago(80),   note: "Wet" },
      { type: "sleep",  time: ago(220),  end: ago(145), note: "" },
      { type: "feed",   time: ago(330),  note: "Nursed, 20 min" },
      { type: "diaper", time: ago(290),  note: "Dirty" },
      { type: "sleep",  time: ago(480),  end: ago(345), note: "" },
      { type: "feed",   time: ago(510),  note: "Bottle, 3.5 oz" },
      { type: "diaper", time: ago(500),  note: "Wet" },
      { type: "sleep",  time: ago(700),  end: ago(530), note: "" },
      { type: "feed",   time: ago(720),  note: "Nursed, 15 min" },
      { type: "diaper", time: ago(715),  note: "Wet" },
      { type: "sleep",  time: ago(960),  end: ago(740), note: "" },
      { type: "feed",   time: ago(980),  note: "Bottle, 4 oz" },
      { type: "sleep",  time: ago(1260), end: ago(1000), note: "" },
      { type: "feed",   time: ago(1290), note: "Nursed, 25 min" },
      { type: "diaper", time: ago(1285), note: "Dirty" }
    ];
    let sleepStart = null;

    const LABELS = { feed: "Feed", diaper: "Diaper", sleep: "Sleep" };
    const ICONS = { feed: "fa-bottle-droplet", diaper: "fa-droplet", sleep: "fa-moon" };

    function fmtTime(d) {
      return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    function fmtAgo(d) {
      const mins = Math.max(0, Math.round((Date.now() - d.getTime()) / MIN));
      if (mins < 60) return mins + "m";
      return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
    }
    function fmtDur(ms) {
      const mins = Math.round(ms / MIN);
      return mins < 60 ? mins + " min" : Math.floor(mins / 60) + "h " + (mins % 60) + "m";
    }

    function render() {
      root.innerHTML = "";

      /* stats */
      const lastFeed = entries.filter(function (e) { return e.type === "feed"; })
        .sort(function (a, b) { return b.time - a.time; })[0];
      const diapers24 = entries.filter(function (e) {
        return e.type === "diaper" && Date.now() - e.time.getTime() < 24 * HR;
      }).length;
      let sleepMs = entries.filter(function (e) { return e.type === "sleep" && e.end; })
        .reduce(function (s, e) { return s + (e.end - e.time); }, 0);
      if (sleepStart) sleepMs += Date.now() - sleepStart;

      const stats = el("div", "nb-stats");
      stats.appendChild(el("div", "nb-stat", '<span class="nb-stat-num">' + fmtAgo(lastFeed.time) +
        '</span><span class="nb-stat-label">since last feed</span>'));
      stats.appendChild(el("div", "nb-stat", '<span class="nb-stat-num">' + diapers24 +
        '</span><span class="nb-stat-label">diapers · 24h</span>'));
      stats.appendChild(el("div", "nb-stat", '<span class="nb-stat-num">' + (sleepMs / HR).toFixed(1) + "h" +
        '</span><span class="nb-stat-label">sleep · 24h</span>'));
      root.appendChild(stats);

      /* action buttons */
      const actions = el("div", "nb-actions");
      const feedBtn = el("button", "nb-btn", '<i class="fas ' + ICONS.feed + '"></i>Feed');
      const diapBtn = el("button", "nb-btn", '<i class="fas ' + ICONS.diaper + '"></i>Diaper');
      const sleepBtn = el("button", "nb-btn" + (sleepStart ? " nb-sleeping" : ""),
        sleepStart
          ? '<i class="fas fa-sun"></i>Wake (' + fmtDur(Date.now() - sleepStart) + ")"
          : '<i class="fas ' + ICONS.sleep + '"></i>Sleep');
      feedBtn.addEventListener("click", function () {
        log("feed", "Bottle, 4 oz");
        track("showcase_demo_interacted", { project: "newborn_log", action: "log_feed" });
      });
      diapBtn.addEventListener("click", function () {
        log("diaper", "Wet");
        track("showcase_demo_interacted", { project: "newborn_log", action: "log_diaper" });
      });
      sleepBtn.addEventListener("click", function () {
        track("showcase_demo_interacted", { project: "newborn_log", action: "sleep_toggle" });
        if (sleepStart) {
          entries.push({ type: "sleep", time: new Date(sleepStart), end: new Date(), note: "", isNew: true });
          sleepStart = null;
        } else {
          sleepStart = Date.now();
        }
        render();
      });
      actions.appendChild(feedBtn);
      actions.appendChild(diapBtn);
      actions.appendChild(sleepBtn);
      root.appendChild(actions);

      /* 24h pattern strip */
      const stripLabel = el("div", "nb-strip-label", "<span>24 hours ago</span><span>now</span>");
      root.appendChild(stripLabel);
      const strip = el("div", "nb-strip");
      for (let i = 0; i < 24; i++) {
        const hStart = Date.now() - (24 - i) * HR;
        const hEnd = hStart + HR;
        let cls = "nb-cell";
        const asleep = entries.some(function (e) {
          return e.type === "sleep" && e.end && e.time.getTime() < hEnd && e.end.getTime() > hStart;
        }) || (sleepStart && sleepStart < hEnd && Date.now() > hStart);
        const fed = entries.some(function (e) {
          return e.type === "feed" && e.time.getTime() >= hStart && e.time.getTime() < hEnd;
        });
        if (asleep) cls += " sleep";
        else if (fed) cls += " feed";
        strip.appendChild(el("div", cls));
      }
      root.appendChild(strip);
      root.appendChild(el("div", "nb-legend",
        '<span class="lg-sleep">asleep</span><span class="lg-feed">fed</span><span>awake</span>'));

      /* log list */
      const list = el("ul", "nb-log");
      entries.slice().sort(function (a, b) { return b.time - a.time; }).slice(0, 9)
        .forEach(function (e) {
          const li = el("li", e.isNew ? "nb-new" : "");
          const detail = e.type === "sleep" && e.end
            ? fmtDur(e.end - e.time)
            : e.note;
          li.innerHTML = '<span class="nb-log-time">' + fmtTime(e.time) + "</span>" +
            '<span class="nb-log-type"><i class="fas ' + ICONS[e.type] + '"></i>' + LABELS[e.type] + "</span>" +
            "<span>" + (detail || "") + "</span>";
          list.appendChild(li);
        });
      root.appendChild(list);
    }

    function log(type, note) {
      entries.push({ type: type, time: new Date(), note: note, isNew: true });
      render();
    }

    render();
    /* keep "since last feed" and sleep timer fresh */
    setInterval(function () {
      const panel = document.getElementById("sc-nb");
      if (panel && panel.classList.contains("active")) render();
    }, 30000);
  })();

  /* ==========================================================================
     Demo 4 — Family Domain (concept teaser)
     ========================================================================== */
  (function domainHub() {
    const root = document.getElementById("dmApp");
    if (!root) return;

    const MEMBERS = [
      { id: "drew", initial: "D", name: "Drew" },
      { id: "jen",  initial: "J", name: "Jen" },
      { id: "mia",  initial: "M", name: "Mia, 8" },
      { id: "theo", initial: "T", name: "Theo, 5" }
    ];

    const ADDRESSES = [
      { addr: "hello@", kind: "front door", to: ["drew", "jen"],
        desc: "The household's public address. School forms, contractors, RSVPs — one inbox both parents see, no personal email exposed." },
      { addr: "kids@", kind: "list", to: ["drew", "jen"],
        desc: "Everything the school sends lands here — copied to both parents, searchable in one place. No more “did you see the permission slip?”" },
      { addr: "sitters@", kind: "list", to: ["drew", "jen"],
        desc: "The address you give babysitters and carpools. Reaches you both, and you can retire it without changing your real email." },
      { addr: "everyone@", kind: "list", to: ["drew", "jen", "mia", "theo"],
        desc: "The whole household, one address. Grandparents' photos hit everyone at once — including the kids' starter inboxes." },
      { addr: "drew@ / jen@", kind: "personal", to: ["drew", "jen"],
        desc: "Personal addresses on your own domain — yours for life, no matter which provider is behind it. (Selecting one lights up its owner.)" }
    ];

    const browser = el("div", "dm-browser");
    browser.innerHTML =
      '<div class="dm-browser-bar"><div class="dm-dots"><span></span><span></span><span></span></div>' +
      '<div class="dm-url"><i class="fas fa-lock"></i>thesullivans.family</div></div>';

    const body = el("div", "dm-body");
    const list = el("div", "dm-list");
    const right = el("div", "dm-right");
    const familyRow = el("div", "dm-family");
    const desc = el("div", "dm-desc");

    const avatarEls = {};
    MEMBERS.forEach(function (m) {
      const member = el("div", "dm-member",
        '<div class="dm-avatar">' + m.initial + '</div><div class="dm-member-name">' + m.name + "</div>");
      familyRow.appendChild(member);
      avatarEls[m.id] = member;
    });

    let activeIdx = 0;
    const addrBtns = [];

    function select(i) {
      activeIdx = i;
      const a = ADDRESSES[i];
      addrBtns.forEach(function (b, j) { b.classList.toggle("active", j === i); });
      MEMBERS.forEach(function (m) {
        avatarEls[m.id].classList.toggle("lit", a.to.indexOf(m.id) !== -1);
      });
      desc.innerHTML = a.desc;
    }

    ADDRESSES.forEach(function (a, i) {
      const btn = el("button", "dm-addr",
        a.addr + "thesullivans.family" + '<span class="dm-addr-kind">' + a.kind + "</span>");
      btn.addEventListener("click", function () {
        select(i);
        track("showcase_demo_interacted", { project: "family_domain", action: "select_address" });
      });
      addrBtns.push(btn);
      list.appendChild(btn);
    });

    right.appendChild(familyRow);
    right.appendChild(desc);
    body.appendChild(list);
    body.appendChild(right);
    browser.appendChild(body);
    root.appendChild(browser);

    root.appendChild(el("ul", "dm-points",
      "<li>One address for school forms — not four inboxes and a group text.</li>" +
      "<li>Addresses outlive providers. Switch email hosts; keep your name.</li>" +
      "<li>Kids inherit a real address at the right age, not a number-salad Gmail.</li>"));

    select(0);
  })();
})();
