/* =============================================
   THEME TOGGLE
============================================= */
const themes = [
  {
    bg: "#F9F9F9",
    text: "#1A1A1A",
    muted: "rgba(0,0,0,0.6)",
    p1: "#FCDEA4",
    p2: "#b8ebda",
    p3: "#528AAF",
    p4: "#8862AA",
    p5: "#287E70",
    imageFilter: "none",
  },
  {
    bg: "#1A1A1A",
    text: "#F9F9F9",
    muted: "rgba(255,255,255,0.4)",
    p1: "#FFB72C",
    p2: "#4bad8c",
    p3: "#19537A",
    p4: "#572F7A",

    p5: "#16584D",
    imageFilter: "brightness(.97) saturate(.95) contrast(.97)",
  },
  {
    bg: "#FFD2B4",
    text: "#9D4434",
    muted: "rgba(233,79,16,0.7)",
    p1: "#F4A367",
    p2: "#657749",
    p3: "#B05A6B",
    p4: "#90726E",
    p5: "#776B49",
    imageFilter: "brightness(.98) saturate(.9)",
  },
  {
    bg: "#E5E8FF",
    text: "#D45D5D",
    muted: "rgba(212, 93, 93, 0.8)",
    p1: "#F4CC99",
    p2: "#81c0ab",
    p3: "#BCD2EE",
    p4: "#9B7EDE",
    p5: "#3A4E48",
    imageFilter: "brightness(.98) saturate(.9)",
  },
];

function applyTheme(index) {
  const t = themes[index];
  document.documentElement.style.setProperty("--color-bg", t.bg);
  document.documentElement.style.setProperty("--color-text", t.text);
  document.documentElement.style.setProperty("--color-text-muted", t.muted);
  document.documentElement.style.setProperty("--project-1", t.p1);
  document.documentElement.style.setProperty("--project-2", t.p2);
  document.documentElement.style.setProperty("--project-3", t.p3);
  document.documentElement.style.setProperty("--project-4", t.p4);
  document.documentElement.style.setProperty("--project-5", t.p5);
  document.documentElement.style.setProperty("--image-filter", t.imageFilter);
}

let themeIndex = parseInt(localStorage.getItem("theme-index"), 10) || 0;

document.getElementById("theme-toggle").addEventListener("click", () => {
  themeIndex = (themeIndex + 1) % themes.length;
  applyTheme(themeIndex);
  localStorage.setItem("theme-index", themeIndex);
});

/* =============================================
                   CUSTOM CURSOR
============================================= */
const cursor = document.getElementById("cursor");

if (cursor) {
  document.documentElement.classList.add("custom-cursor");

  document.addEventListener("mousemove", (e) => {
    cursor.style.opacity = "1";
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  const hoverables = 'a, button, [role="button"], .cursor-grow';

  document.addEventListener("mouseover", (e) => {
    if (e.target.matches(hoverables) || e.target.closest(hoverables)) {
      cursor.classList.add("hovering");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.matches(hoverables) || e.target.closest(hoverables)) {
      cursor.classList.remove("hovering");
    }
  });
}

/* =============================================
   NAV — language switch & theme toggle
============================================= */
const languages = ["EN", "DE", "FR"];
let langIndex = Math.max(
  0,
  languages.indexOf((localStorage.getItem("lang") || "en").toUpperCase()),
);
const langBtn = document.querySelector(".nav-lang");
langBtn.childNodes[0].textContent = languages[langIndex];

langBtn.addEventListener("mouseenter", () => {
  const nextIndex = (langIndex + 1) % languages.length;
  langBtn.childNodes[0].textContent = languages[nextIndex];
});

langBtn.addEventListener("mouseleave", () => {
  langBtn.childNodes[0].textContent = languages[langIndex];
});

langBtn.addEventListener("click", () => {
  langIndex = (langIndex + 1) % languages.length;
  langBtn.childNodes[0].textContent = languages[langIndex];
  if (window.applyLanguage) {
    window.applyLanguage(languages[langIndex].toLowerCase());
  }
});

let moonRotation = themeIndex * 90;
const themeNavBtn = document.querySelector(".nav-theme");
themeNavBtn.addEventListener("click", function () {
  moonRotation += 90;
  document.documentElement.style.setProperty(
    "--moon-rotation",
    `${moonRotation}deg`,
  );
});

/* =============================================
   NAV — sidebar, mobile menu & scroll
============================================= */
const hamburger = document.getElementById("nav-hamburger");
const mobileMenu = document.getElementById("mobile-menu");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
  document.body.classList.toggle(
    "menu-open",
    mobileMenu.classList.contains("open"),
  );
});

function smoothScrollTo(href, offset) {
  const target = document.querySelector(href);
  if (!target) return;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - offset,
    behavior: "smooth",
  });
}

document.querySelectorAll(".mobile-menu-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const href = link.getAttribute("href");
    smoothScrollTo(href, href === "#contact" ? 150 : 72);
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

/* =============================================
   GLOBAL LEFT SIDEBAR NAVIGATION
============================================= */

const sidebarLinks = document.querySelectorAll(".left-sidebar a[data-target]");
const sidebarSub = document.querySelector(".left-sidebar-sub");
const sidebarSubLinks = document.querySelectorAll(".left-sidebar-sub-item");

const sidebarSubSectionIds = Array.from(sidebarSubLinks).map(
  (link) => link.dataset.target,
);

sidebarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.getElementById(link.dataset.target);

    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const onSidebarScroll = () => {
  let current = null;
  let currentSub = null;

  sidebarLinks.forEach((link) => {
    const target = document.getElementById(link.dataset.target);

    if (
      target &&
      target.getBoundingClientRect().top <= window.innerHeight * 0.5
    ) {
      current = link.dataset.target;
    }
  });

  sidebarSubSectionIds.forEach((id) => {
    const section = document.getElementById(id);

    if (
      section &&
      section.getBoundingClientRect().top <= window.innerHeight * 0.5
    ) {
      currentSub = id;
    }
  });

  const processEl = document.getElementById("section-process");
  const productEl = document.getElementById("section-product");

  const showSub =
    processEl &&
    productEl &&
    processEl.getBoundingClientRect().top <= window.innerHeight * 0.5 &&
    productEl.getBoundingClientRect().top > 0;

  if (!showSub) {
    currentSub = null;
  }

  if (sidebarSub) {
    sidebarSub.classList.toggle("visible", showSub);
  }

  sidebarLinks.forEach((link) => {
    const target = link.dataset.target;
    const isSubItem = link.classList.contains("left-sidebar-sub-item");

    let isActive = false;

    if (isSubItem) {
      isActive = target === currentSub;
    } else {
      isActive = target === current && !currentSub;
    }

    link.classList.toggle("active", isActive);
  });
};

if (sidebarLinks.length > 0) {
  window.addEventListener("scroll", onSidebarScroll);
  onSidebarScroll();
}
/* =============================================
   NAV — logo collapse on scroll
============================================= */
const hideOrder = [14, 13, 12, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1];
const showOrder = [...hideOrder].reverse();
const logoLetters = document.querySelectorAll(".logo .l[data-i]");
const byIndex = {};
logoLetters.forEach((el) => (byIndex[el.dataset.i] = el));

const isCasePage = document.body.classList.contains("case-page");

let isScrolled = false;
let timers = [];

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function showFull() {
  clearTimers();
  showOrder.forEach((i, pos) => {
    timers.push(
      setTimeout(() => byIndex[i].classList.remove("hide"), pos * 35),
    );
  });
}

function showShort() {
  clearTimers();
  hideOrder.forEach((i, pos) => {
    timers.push(setTimeout(() => byIndex[i].classList.add("hide"), pos * 35));
  });
}

window.addEventListener("scroll", () => {
  if (isCasePage) return;

  const scrolled = window.scrollY > 60;
  if (scrolled === isScrolled) return;

  isScrolled = scrolled;

  if (scrolled) showShort();
  else if (window.innerWidth >= 900) showFull();
});

const logo = document.querySelector(".logo");

function checkLogoWidth() {
  if (isCasePage) {
    showShort();
    return;
  }

  if (window.innerWidth < 900) showShort();
  else if (!isScrolled) showFull();
}

checkLogoWidth();
window.addEventListener("resize", checkLogoWidth);

logo.addEventListener("mouseenter", () => {
  if (window.innerWidth >= 900) showFull();
});

logo.addEventListener("mouseleave", () => {
  if (isCasePage) {
    showShort();
    return;
  }

  if (isScrolled && window.innerWidth >= 900) showShort();
});

/* =============================================
                   CASE STUDY
                ============================================= */
/* =============================================
   CASE STUDY PROCESS BAR LINE
============================================= */

const alignProcessLine = () => {
  const dot = document.querySelector(".cs-process-bar-dot");
  const steps = document.querySelector(".cs-process-bar-steps");

  if (!dot || !steps) return;

  const dotRect = dot.getBoundingClientRect();
  const stepsRect = steps.getBoundingClientRect();

  const topOffset = dotRect.top - stepsRect.top + dotRect.height / 2;

  steps.style.setProperty("--line-top", topOffset + "px");
};

alignProcessLine();
window.addEventListener("resize", alignProcessLine);

/* =============================================
   CASE STUDY LIGHTBOX
============================================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

document.querySelectorAll(".cs-lightbox-trigger").forEach((img) => {
  img.addEventListener("click", () => {
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  });
});

if (lightboxClose && lightbox) {
  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("open");
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      lightbox.classList.remove("open");
    }
  });
}

/* =============================================
 CASE STUDY ITERATIONS TOGGLE
============================================= */

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill-btn--toggle");
  if (!btn) return;

  document
    .querySelectorAll(".pill-btn--toggle")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");

  const target = btn.dataset.target;
  const before = document.getElementById("iterations-before");
  const after = document.getElementById("iterations-after");

  if (before) before.classList.toggle("hidden", target !== "before");
  if (after) after.classList.toggle("hidden", target !== "after");
});

/* =============================================
 CASE STUDY SURVEY RESULTS TOGGLE
============================================= */

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill-btn--single");
  if (!btn) return;

  const surveyDetails = document.getElementById("survey-details");
  if (!surveyDetails) return;

  const isOpen = !surveyDetails.classList.contains("hidden");

  surveyDetails.classList.toggle("hidden", isOpen);

  btn.textContent = isOpen ? "See all results" : "Hide results";
});
/* =============================================
   DESIGN DECISIONS
============================================= */

const decisionButtons = document.querySelectorAll("[data-decision-tab]");
const decisionHotspots = document.querySelectorAll(".cs-hotspot");

function showDecisionCategory(category) {
  decisionHotspots.forEach((hotspot) => {
    hotspot.classList.toggle(
      "show-card",
      hotspot.dataset.decisionCategory === category,
    );
  });
}

decisionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    decisionButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    showDecisionCategory(button.dataset.decisionTab);
  });
});

// Initial state
showDecisionCategory("ia");
/* =============================================
 CASE STUDY GALLERY
============================================= */

const gallery = document.querySelector(".cs-pdf-gallery");

if (gallery) {
  const slides = gallery.querySelectorAll("img");
  const prevBtn = gallery.querySelector(".cs-gallery-prev");
  const nextBtn = gallery.querySelector(".cs-gallery-next");

  let current = 0;
  let isTransitioning = false;
  let autoPlay;

  slides[current].classList.add("active");

  function showSlide(next) {
    if (isTransitioning || next === current) return;

    isTransitioning = true;

    slides[next].classList.add("active");

    setTimeout(() => {
      slides[current].classList.remove("active");
      current = next;
      isTransitioning = false;
    }, 800);
  }

  function restartAutoPlay() {
    clearInterval(autoPlay);

    autoPlay = setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, 3000);
  }

  nextBtn?.addEventListener("click", () => {
    showSlide((current + 1) % slides.length);
    restartAutoPlay();
  });

  prevBtn?.addEventListener("click", () => {
    showSlide((current - 1 + slides.length) % slides.length);
    restartAutoPlay();
  });

  restartAutoPlay();
}

/* =============================================
 CASE STUDY DESIGN DECISIONs - HOTSPOTS
============================================= */

const spotlightZones = document.querySelectorAll(".cs-spotlight-zone");

const spotlightImage = document.querySelector(".cs-spotlight-image--visible");

if (spotlightImage) {
  spotlightImage.addEventListener(
    "mouseenter",
    () => {
      document.querySelectorAll(".initial-active").forEach((zone) => {
        zone.classList.remove("initial-active");
      });
    },
    { once: true },
  );
}

document.addEventListener("mousemove", (event) => {
  let hoveredZone = null;

  spotlightZones.forEach((zone) => {
    const rect = zone.getBoundingClientRect();

    const isInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (isInside) {
      if (!hoveredZone) {
        hoveredZone = zone;
      }

      const hoveredArea = hoveredZone.offsetWidth * hoveredZone.offsetHeight;
      const currentArea = zone.offsetWidth * zone.offsetHeight;

      if (currentArea < hoveredArea) {
        hoveredZone = zone;
      }
    }
  });

  spotlightZones.forEach((zone) => {
    zone.classList.remove("group-active");
  });

  if (hoveredZone) {
    const group = hoveredZone.dataset.group;

    if (group) {
      document
        .querySelectorAll(`.cs-spotlight-zone[data-group="${group}"]`)
        .forEach((zone) => zone.classList.add("group-active"));
    } else {
      hoveredZone.classList.add("group-active");
    }
  }
});

/* =============================================
                   MAIN PAGE
                ============================================= */

/* =============================================
                   HERO — clock
                ============================================= */
function updateClock() {
  const clock = document.getElementById("cet-clock");

  if (!clock) return;

  const cet = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Europe/Zurich",
    }),
  );

  clock.textContent = [cet.getHours(), cet.getMinutes(), cet.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

updateClock();
setInterval(updateClock, 1000);

/* =============================================
   HERO — "Tidy up data" animation
   Button toggles between sort() and unsort()
============================================= */
const cleanBtn = document.getElementById("clean-data-btn");
let isCleaned = false,
  sortedEls = [],
  originalHidden = [];

// Elements whose text will be scattered into individual letter spans
const textTargets = [
  ".hero-headline",
  ".hero-links .link-text",
  ".hero-description",
  ".availability-text",
  ".hero-location",
];

// Toggle between sort and unsort on button click
if (cleanBtn) {
  cleanBtn.addEventListener("click", () => {
    isCleaned ? unsort() : sort();
    isCleaned = !isCleaned;
    cleanBtn.classList.toggle("active");
  });
}

function sort() {
  // --- STEP 1: Get hero dimensions for layout calculations ---
  const heroRect = document.querySelector(".hero").getBoundingClientRect();
  const vw = window.innerWidth,
    vh = heroRect.height,
    topY = heroRect.top + window.scrollY;

  // --- STEP 2: Wrap every character in textTargets into individual spans ---
  // Letters get .char-span, non-letter visible chars get .misc-span
  textTargets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (el.dataset.wrapped) return;
      el.dataset.wrapped = "1";
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach((node) => {
        const parent = node.parentElement;
        const html = [...node.textContent]
          .map((ch) => {
            if (/[a-zA-Z]/.test(ch))
              return `<span class="char-span">${ch}</span>`;
            if (ch.trim())
              return `<span class="misc-span">${ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch === "&" ? "&amp;" : ch}</span>`;
            return ch;
          })
          .join("");
        const temp = document.createElement("span");
        temp.innerHTML = html;
        while (temp.firstChild) parent.insertBefore(temp.firstChild, node);
        parent.removeChild(node);
      });
      originalHidden.push({ el });
    });
  });

  // --- STEP 3: Collect all .char-span elements with their position and style ---
  let allChars = [];
  textTargets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.querySelectorAll(".char-span").forEach((span) => {
        const rect = span.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const pStyle = window.getComputedStyle(
          span.closest("h1,p,a") || span.parentElement,
        );
        allChars.push({
          ch: span.textContent,
          fs: parseFloat(
            window.getComputedStyle(span).fontSize || pStyle.fontSize,
          ),
          fw: parseInt(
            window.getComputedStyle(span).fontWeight || pStyle.fontWeight,
          ),
          fi: window.getComputedStyle(span).fontStyle || pStyle.fontStyle,
          color: window.getComputedStyle(
            span.closest("h1,p,a,em") || span.parentElement,
          ).color,
          fromX: rect.left + rect.width / 2,
          fromY: rect.top,
          span,
        });
      });
    });
  });

  // --- STEP 4: Group characters by letter (case-insensitive) ---
  const groups = {};
  allChars.forEach((c) => {
    const key = c.ch.toUpperCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  });

  // --- STEP 5: Sort letter groups by total visual weight (font size based) ---
  // and assign target column positions along the bottom of the hero
  const padding = 48;
  const sortedLetters = Object.keys(groups).sort(
    (a, b) =>
      groups[a].reduce((s, c) => s + Math.sqrt(c.fs) * 7, 0) -
      groups[b].reduce((s, c) => s + Math.sqrt(c.fs) * 7, 0),
  );
  const colW = (vw - padding * 2) / sortedLetters.length;
  sortedLetters.forEach((letter, li) => {
    const group = groups[letter];
    group.sort((a, b) => b.fs + b.fw * 0.01 - (a.fs + a.fw * 0.01));
    const x = padding + colW * li + colW * 0.5;
    let currentY = topY + vh - 8;
    group.forEach((c) => {
      currentY -= Math.sqrt(c.fs) * 7;
      c.targetX = x;
      c.targetY = currentY - c.fs * 0.5;
      c.opacity = 1;
    });
  });

  // --- STEP 6: Animate each character to its target column position ---
  // Hide the original span, spawn a floating div clone, animate it to target
  allChars.forEach((c, i) => {
    setTimeout(() => {
      c.span.style.transition = "opacity 0.2s ease";
      c.span.style.opacity = "0";
      const div = document.createElement("div");
      div.classList.add("sorted-letter");
      div.textContent = c.ch;
      div.dataset.fromX = c.fromX;
      div.dataset.fromY = c.fromY + window.scrollY;
      div.style.cssText = `position:absolute;font-size:${c.fs}px;font-weight:${c.fw};font-style:${c.fi || "normal"};left:${c.fromX}px;top:${c.fromY + window.scrollY}px;opacity:${c.opacity};transform:translateX(-50%);transition:none;pointer-events:none;z-index:40;font-family:var(--font);color:${c.color};white-space:nowrap;`;
      document.body.appendChild(div);
      sortedEls.push(div);
      div.offsetHeight;
      div.style.transition =
        "left 0.8s cubic-bezier(0.76,0,0.24,1), top 0.8s cubic-bezier(0.76,0,0.24,1)";
      div.style.left = c.targetX + "px";
      div.style.top = c.targetY + "px";
    }, i * 12);
  });

  // --- STEP 7: Fade out punctuation and link arrows, disable hero links ---
  document.querySelectorAll(".misc-span, .link-arrow").forEach((span) => {
    span.style.transition = "opacity 0.5s ease";
    span.style.opacity = "0";
  });
  document.querySelectorAll(".hero-links a").forEach((a) => {
    a.style.pointerEvents = "none";
  });

  // --- STEP 8: Fade out extra non-text elements (dot, clock) ---
  const extraEls = [
    document.querySelector(".availability-dot"),
    document.querySelector("#cet-clock"),
  ].filter(Boolean);
  extraEls.forEach((el, i) => {
    originalHidden.push({ el, wasExtra: true });
    setTimeout(
      () => {
        el.style.transition = "opacity 0.4s ease";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      },
      allChars.length * 12 - i * 80,
    );
  });
}

function unsort() {
  const reversed = [...sortedEls].reverse(),
    totalLetterTime = reversed.length * 12 + 800;
  const allSpans = [...document.querySelectorAll(".char-span, .misc-span")];

  // --- STEP 1: Animate floating letter divs back to their original positions ---
  reversed.forEach((div, i) => {
    setTimeout(() => {
      div.style.transition =
        "left 0.8s cubic-bezier(0.76,0,0.24,1), top 0.8s cubic-bezier(0.76,0,0.24,1)";
      div.style.left = div.dataset.fromX + "px";
      div.style.top = div.dataset.fromY + "px";

      // Once back in place, restore the original hidden span and remove the clone
      setTimeout(() => {
        const fromX = parseFloat(div.dataset.fromX),
          fromY = parseFloat(div.dataset.fromY) - window.scrollY;
        const ms = allSpans.find((s) => {
          if (s.dataset.restored) return false;
          const r = s.getBoundingClientRect();
          return (
            Math.abs(r.left + r.width / 2 - fromX) < 2 &&
            Math.abs(r.top - fromY) < 4
          );
        });
        if (ms) {
          ms.dataset.restored = "1";
          ms.style.transition = "none";
          ms.style.opacity = "1";
        }
        div.style.opacity = "0";
      }, 800);
    }, i * 12);
  });

  // --- STEP 2: Clean up all char/misc spans and remove floating letter divs ---
  setTimeout(() => {
    allSpans.forEach((s) => delete s.dataset.restored);
    document
      .querySelectorAll(".char-span, .misc-span, .link-arrow")
      .forEach((span) => {
        span.style.transition = "none";
        span.style.opacity = "";
      });
    document.querySelectorAll(".hero-links a").forEach((a) => {
      a.style.pointerEvents = "";
    });
    sortedEls.forEach((el) => el.remove());
    sortedEls = [];
  }, totalLetterTime);

  // --- STEP 3: Restore extra elements (dot, clock, button) after letters settle ---
  setTimeout(() => {
    originalHidden
      .filter((o) => o.wasExtra)
      .forEach(({ el }) => {
        el.style.transition = "opacity 0.4s ease, border-color 0.3s ease";
        el.style.opacity = "1";
        el.style.borderColor = "";
        el.style.pointerEvents = "";
      });
    originalHidden = [];
  }, totalLetterTime + 300);
}
/* =============================================
   SERVICES JS
============================================= */

function fixVennTextScale() {
  const svg = document.querySelector(".venn-svg");
  if (!svg) return;
  const scaleX = svg.getBoundingClientRect().width / 1440;
  document
    .querySelectorAll(".venn-label-short")
    .forEach((el) => (el.style.fontSize = 13 / scaleX + "px"));
  document
    .querySelectorAll(".venn-expanded-item:not(.venn-dot)")
    .forEach((el) => (el.style.fontSize = 13 / scaleX + "px"));
  document
    .querySelectorAll(".venn-expanded-title")
    .forEach((el) => (el.style.fontSize = 11 / scaleX + "px"));
  document
    .querySelectorAll(".venn-dot")
    .forEach((el) => (el.style.fontSize = 20 / scaleX + "px"));
}
fixVennTextScale();
window.addEventListener("resize", fixVennTextScale);

document.querySelectorAll(".service-card").forEach((card) => {
  const group = document.querySelector(
    `.venn-group[data-key="${card.dataset.key}"]`,
  );
  if (!group) return;
  const circle = group.querySelector(".venn-circle");
  card.addEventListener("mouseenter", () => {
    circle.style.fill = "var(--color-bg)";
    group.parentNode.appendChild(group);
  });
  card.addEventListener("mouseleave", () => {
    circle.style.fill = "transparent";
  });
});

const serviceCardsEl = document.getElementById("service-cards-overlay");
const vennSvgEl = document.querySelector(".venn-svg");
let showingCards = false;
const keyMap = { design: 0, data: 1, business: 2, development: 3 };

function morphToCards() {
  vennSvgEl.style.transition = "none";
  vennSvgEl.style.transform = "scale(1)";
  vennSvgEl.style.opacity = "1";
  serviceCardsEl.classList.add("animating");
  vennSvgEl.classList.add("hidden");
  document.querySelectorAll(".venn-label-short").forEach((l) => {
    l.style.transition = "opacity 0.5s ease";
    l.style.opacity = "0";
  });
  document
    .querySelectorAll(".venn-circle")
    .forEach((c) => (c.style.visibility = "hidden"));
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll(".service-card");
    const svgRect = vennSvgEl.getBoundingClientRect(),
      scaleX = svgRect.width / 1440,
      scaleY = svgRect.height / 950;
    document.querySelectorAll(".venn-group").forEach((group) => {
      const card = cards[keyMap[group.dataset.key]];
      if (!card) return;
      const circle = group.querySelector(".venn-circle");
      const cx = +circle.getAttribute("cx"),
        cy = +circle.getAttribute("cy"),
        r = +circle.getAttribute("r");
      const circleX = svgRect.left + cx * scaleX,
        circleY = svgRect.top + cy * scaleY,
        circleR = r * scaleX;
      const cardRect = card.getBoundingClientRect();
      const clone = document.createElement("div");
      clone.style.cssText = `position:fixed;left:${circleX - circleR}px;top:${circleY - circleR}px;width:${circleR * 2}px;height:${circleR * 2}px;border-radius:50%;border:1px solid var(--color-text);background:transparent;z-index:1000;pointer-events:none;transition:all 0.7s cubic-bezier(0.76,0,0.24,1);box-sizing:border-box;`;
      document.body.appendChild(clone);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          clone.style.left = cardRect.left + "px";
          clone.style.top = cardRect.top + "px";
          clone.style.width = cardRect.width + "px";
          clone.style.height = cardRect.height + "px";
          clone.style.borderRadius = "4px";
        }),
      );
      setTimeout(() => clone.remove(), 720);
    });
    setTimeout(() => {
      document
        .querySelectorAll(
          ".service-card-title, .service-card-items, .service-card-divider",
        )
        .forEach((el) => {
          el.style.opacity = "0";
          el.style.transition = "none";
        });
      serviceCardsEl.classList.remove("animating");
      serviceCardsEl.classList.add("visible");
      document
        .querySelectorAll(".venn-circle")
        .forEach((c) => (c.style.visibility = ""));
      document.querySelectorAll(".venn-label-short").forEach((l) => {
        l.style.transition = "none";
        l.style.opacity = "";
      });
      setTimeout(() => {
        document
          .querySelectorAll(
            ".service-card-title, .service-card-items, .service-card-divider",
          )
          .forEach((el) => {
            el.style.transition = "opacity 2s ease";
            el.style.opacity = "1";
          });
        setTimeout(() => {
          document
            .querySelectorAll(
              ".service-card-title, .service-card-items, .service-card-divider",
            )
            .forEach((el) => {
              el.style.transition = "";
              el.style.opacity = "";
            });
        }, 2100);
      }, 50);
    }, 720);
  });
}

function morphToDiagram() {
  const cards = document.querySelectorAll(".service-card");
  const svgRect = vennSvgEl.getBoundingClientRect(),
    scaleX = svgRect.width / 1440,
    scaleY = svgRect.height / 950;
  document
    .querySelectorAll(
      ".service-card-title, .service-card-items, .service-card-divider",
    )
    .forEach((el) => {
      el.style.transition = "opacity 0.3s ease";
      el.style.opacity = "0";
    });
  setTimeout(() => {
    vennSvgEl.classList.remove("hidden");
    document
      .querySelectorAll(".venn-circle")
      .forEach((c) => (c.style.visibility = "hidden"));
    document.querySelectorAll(".venn-group").forEach((group) => {
      const card = cards[keyMap[group.dataset.key]];
      if (!card) return;
      const circle = group.querySelector(".venn-circle");
      const cx = +circle.getAttribute("cx"),
        cy = +circle.getAttribute("cy"),
        r = +circle.getAttribute("r");
      const circleX = svgRect.left + cx * scaleX,
        circleY = svgRect.top + cy * scaleY,
        circleR = r * scaleX;
      const cardRect = card.getBoundingClientRect();
      const clone = document.createElement("div");
      clone.style.cssText = `position:fixed;left:${cardRect.left}px;top:${cardRect.top}px;width:${cardRect.width}px;height:${cardRect.height}px;border-radius:4px;border:1px solid var(--color-text);background:transparent;z-index:1000;pointer-events:none;transition:all 0.7s cubic-bezier(0.76,0,0.24,1);box-sizing:border-box;`;
      document.body.appendChild(clone);
      serviceCardsEl.classList.remove("visible");
      serviceCardsEl.classList.remove("animating");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          clone.style.left = circleX - circleR + "px";
          clone.style.top = circleY - circleR + "px";
          clone.style.width = circleR * 2 + "px";
          clone.style.height = circleR * 2 + "px";
          clone.style.borderRadius = "50%";
        }),
      );
      setTimeout(() => clone.remove(), 720);
    });
    setTimeout(() => {
      document
        .querySelectorAll(".venn-circle")
        .forEach((c) => (c.style.visibility = ""));
      document.querySelectorAll(".venn-label-short").forEach((l) => {
        l.style.opacity = "0";
        l.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          l.style.opacity = "";
        }, 50);
      });
      document
        .querySelectorAll(
          ".service-card-title, .service-card-items, .service-card-divider",
        )
        .forEach((el) => {
          el.style.transition = "";
          el.style.opacity = "";
        });
      vennSvgEl.classList.add("is-hovered");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          vennSvgEl.style.transition = "";
          vennSvgEl.style.transform = "";
          vennSvgEl.style.opacity = "";
        }),
      );
    }, 720);
  }, 300);

  vennSvgEl.addEventListener(
    "mouseleave",
    function onLeave() {
      vennSvgEl.classList.remove("is-hovered");
      vennSvgEl.removeEventListener("mouseleave", onLeave);
    },
    { once: true },
  );
}

if (vennSvgEl) {
  vennSvgEl.addEventListener("click", () => {
    if (!showingCards) {
      showingCards = true;
      morphToCards();
    }
  });
}

if (serviceCardsEl) {
  serviceCardsEl.addEventListener("click", () => {
    if (showingCards) {
      showingCards = false;
      morphToDiagram();
    }
  });
}

/*function initServiceCarousel() {
  const track = document.querySelector(".service-cards");

  if (!track || !track.children.length) return;

  if (window.innerWidth > 768) {
    track.style.transform = "";
    track.style.transition = "";
    return;
  }

  const cards = [...track.children],
    total = cards.length;

  setTimeout(() => goTo(0), 50);
  let startX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener(
    "touchend",
    (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? idx + 1 : idx - 1);
    },
    { passive: true },
  );
  const overlay = document.querySelector(".service-cards-overlay");
  overlay.addEventListener("click", (e) => {
    const ow = overlay.offsetWidth,
      cx = e.clientX - overlay.getBoundingClientRect().left,
      cw = cards[0].offsetWidth,
      sw = (ow - cw) / 2;
    if (cx < sw) goTo(idx - 1);
    else if (cx > sw + cw) goTo(idx + 1);
  });
}
window.addEventListener("resize", initServiceCarousel);
initServiceCarousel();
*/
/* =============================================
                   ABOUT — accordion
                ============================================= */
document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item"),
      isOpen = item.classList.contains("open");
    document
      .querySelectorAll(".accordion-item")
      .forEach((i) => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

/* =============================================
                   CONTACT JS— cycling verb
                ============================================= */
const contactVerb = document.getElementById("contact-verb");
const defaultVerbs = [
  "work",
  "dream",
  "imagine",
  "build",
  "improve",
  "optimize",
  "design",

  "create",
];

const contactPlusBtn = document.getElementById("contact-plus");

if (contactPlusBtn && contactVerb) {
  contactPlusBtn.addEventListener("click", () => {
    const verbs = window.contactVerbs || defaultVerbs;
    const currentIndex = window.contactVerbIndex || 0;
    const nextIndex = (currentIndex + 1) % verbs.length;

    window.contactVerbIndex = nextIndex;
    contactVerb.textContent = verbs[nextIndex];

    contactPlusBtn.classList.add("spinning");

    contactPlusBtn.addEventListener(
      "animationend",
      () => contactPlusBtn.classList.remove("spinning"),
      { once: true },
    );
  });
}
