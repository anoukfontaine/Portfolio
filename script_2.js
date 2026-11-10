/* ============================================================
   01 — THEMES & THEME-DEPENDENT IMAGES
   Colour palettes, persisted theme, animated eye, and image variants.
   ============================================================ */
const themes = [
  {
    bg: "#FAF6ED",
    text: "#344ECD",
    muted: "#8D9ADB",
    p1: "#001268",
    p4: "#CD4834",
    p2: "#94A4F3",
    imageFilter: "none",
  },
  {
    bg: "#112228",
    text: "#E6E8FF",
    muted: "#868F9E",
    p1: "#B892FF",
    p4: "#95F8D8",
    p2: "#6120DB",
    imageFilter: "brightness(.97) saturate(.95) contrast(.97)",
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
  updateHeroIllustration(index);
  updateThemeImages(index);
  const logoImage = document.getElementById("site-logo");
  if (logoImage) {
    logoImage.src =
      index === 1
        ? "/Images/Home/0_logo_AF_theme_2.png"
        : "/Images/Home/0_logo_AF_theme_1.png";
  }
}
let themeIndex = parseInt(localStorage.getItem("theme-index"), 10) || 0;

applyTheme(themeIndex);
document.getElementById("theme-toggle").addEventListener("click", () => {
  themeIndex = (themeIndex + 1) % themes.length;
  applyTheme(themeIndex);
  localStorage.setItem("theme-index", themeIndex);
});
const eyeButton = document.getElementById("theme-toggle");
const eyeLid = eyeButton.querySelector(".eye-lid");
const eyeUpperLine = eyeButton.querySelector(".eye-upper-line");
const eyeLashes = eyeButton.querySelector(".eye-lashes");
const eyeHover = window.matchMedia("(hover: hover)");
const eyeReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let eyeHovered = false;
let eyeFrame;
let eyeProgress = themeIndex === 1 ? 1 : 0;

function drawEye(progress) {
  // 0 = open, 1 = closed.
  const lidCurve = -6 + 68 * progress;
  eyeLid.setAttribute("d", `M3 28 Q40 -6 77 28 Q40 ${lidCurve} 3 28Z`);
  eyeUpperLine.setAttribute("d", `M3 28 Q40 ${lidCurve} 77 28`);
  eyeLashes.style.transform = `scaleY(${1 - 2 * progress})`;
}

function animateEye() {
  cancelAnimationFrame(eyeFrame);
  const normallyClosed = themeIndex === 1;
  const target = Number(eyeHovered ? !normallyClosed : normallyClosed);
  const start = eyeProgress;
  const startedAt = performance.now();
  if (eyeReducedMotion.matches) {
    eyeProgress = target;
    drawEye(target);
    return;
  }
  function frame(now) {
    const time = Math.min((now - startedAt) / 350, 1);
    const eased = time * time * (3 - 2 * time);
    eyeProgress = start + (target - start) * eased;
    drawEye(eyeProgress);
    if (time < 1) {
      eyeFrame = requestAnimationFrame(frame);
    }
  }
  eyeFrame = requestAnimationFrame(frame);
}
eyeButton.addEventListener("pointerenter", () => {
  if (!eyeHover.matches) return;
  eyeHovered = true;
  animateEye();
});
eyeButton.addEventListener("pointerleave", () => {
  eyeHovered = false;
  animateEye();
});
// Your existing click listener changes themeIndex first.
eyeButton.addEventListener("click", animateEye);
drawEye(eyeProgress);

function updateHeroIllustration(index) {
  const illustration = document.getElementById("hero-illustration");
  if (!illustration) return;
  illustration.src = `/Images/Home/0_2_Illustration_theme_${index + 1}.png`;
}

function updateThemeImages(index) {
  document.querySelectorAll("[data-theme-src]").forEach((image) => {
    const pattern = image.dataset.themeSrc;
    if (!pattern) return;
    image.src = pattern.replace("{theme}", index + 1);
  });
}

/* ============================================================
   02 — CONTACT VERB INTERACTION
   Cycles the interactive verb in the contact footer.
   ============================================================ */
document.addEventListener("click", (event) => {
  const word = event.target.closest("#contact-verb");
  if (!word) return;
  const words = window.contactVerbs?.length
    ? window.contactVerbs
    : [
        "work",
        "dream",
        "imagine",
        "build",
        "improve",
        "optimize",
        "design",
        "create",
      ];
  const current = words.indexOf(word.textContent.trim());
  const next = (current + 1) % words.length;
  word.textContent = words[next];
  window.contactVerbIndex = next;
});

/* ============================================================
   03 — CUSTOM CURSOR
   Activates the cursor for fine pointers and restores the system cursor when appropriate.
   ============================================================ */
const cursor = document.getElementById("cursor");
if (cursor) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const blendModeSupported =
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("mix-blend-mode", "difference");
  let customCursorActive = false;
  const canUseCustomCursor = () => finePointer.matches && blendModeSupported;
  const deactivateCustomCursor = () => {
    customCursorActive = false;
    document.documentElement.classList.remove("custom-cursor");
    cursor.classList.remove("hovering");
    cursor.style.opacity = "0";
  };
  const moveCustomCursor = (e) => {
    if (!canUseCustomCursor()) {
      deactivateCustomCursor();
      return;
    }
    /* First position + show the custom cursor */
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursor.style.opacity = "1";
    /* Only now hide the native cursor */
    if (!customCursorActive) {
      document.documentElement.classList.add("custom-cursor");
      customCursorActive = true;
    }
  };
  document.addEventListener("mousemove", moveCustomCursor);
  const hoverables = 'a, button, [role="button"], .cursor-grow';
  document.addEventListener("mouseover", (e) => {
    if (!customCursorActive) return;
    if (e.target.matches(hoverables) || e.target.closest(hoverables)) {
      cursor.classList.add("hovering");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.matches(hoverables) || e.target.closest(hoverables)) {
      cursor.classList.remove("hovering");
    }
  });
  /* Restore normal cursor if we leave the page */
  document.documentElement.addEventListener(
    "mouseleave",
    deactivateCustomCursor,
  );
  /* Restore normal cursor if browser/window loses focus */
  window.addEventListener("blur", deactivateCustomCursor);
  /* Restore it if device switches to touch/pen etc. */
  if (typeof finePointer.addEventListener === "function") {
    finePointer.addEventListener("change", (e) => {
      if (!e.matches) {
        deactivateCustomCursor();
      }
    });
  }
}

/* ============================================================
   04 — MOBILE MENU & SCROLL NAVIGATION
   Opens and closes mobile navigation; routes links to homepage sections.
   ============================================================ */
const hamburger = document.getElementById("nav-hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const sidebarDrawer = document.getElementById("site-sidebar");
const drawerViewport = window.matchMedia("(max-width: 1020px)");

if (hamburger && sidebarDrawer) {
  function setDrawerOpen(open) {
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    document.documentElement.classList.toggle("menu-open", open);
  }

  hamburger.addEventListener("click", () => {
    const open = hamburger.getAttribute("aria-expanded") === "true";
    setDrawerOpen(!open);

    if (!open) sidebarDrawer.querySelector("a")?.focus();
  });

  sidebarDrawer.addEventListener("click", (event) => {
    if (drawerViewport.matches && event.target.closest("a")) {
      setDrawerOpen(false);
      hamburger.focus({ preventScroll: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      hamburger.getAttribute("aria-expanded") === "true"
    ) {
      setDrawerOpen(false);
      hamburger.focus();
    }
  });

  drawerViewport.addEventListener("change", () => setDrawerOpen(false));
}

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
    const href = link.getAttribute("href");
    // Extract the section hash whether the link is "#work", "/#work"
    // or an older path such as "../index.html#work".
    const hash = href && href.includes("#") ? `#${href.split("#")[1]}` : href;
    const target =
      hash && hash.startsWith("#") ? document.querySelector(hash) : null;
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    document.documentElement.classList.remove("menu-open");
    /*
     * Homepage:
     * The section exists, so scroll to it smoothly.
     */
    if (target) {
      e.preventDefault();
      requestAnimationFrame(() => {
        smoothScrollTo(hash, hash === "#contact" ? 100 : 72);
      });
      return;
    }
    /*
     * Case-study page:
     * The section does not exist here, so go back to
     * the homepage and open the requested section.
     */
    e.preventDefault();
    window.location.href = getHomeSectionUrl(hash);
  });
});

function getHomeSectionUrl(hash) {
  return `/index_2.html${hash}`;
}

/* ============================================================
   05 — DESKTOP SIDEBAR NAVIGATION
   Smooth section scrolling, active links, and case-study sub-navigation.
   ============================================================ */
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

/* ============================================================
   06 — INTERACTIVE HERO
   Sorts hero letters into groups when the illustration is clicked; restores them on the next click.
   ============================================================ */
const heroIllustrationToggle = document.getElementById(
  "hero-illustration-toggle",
);
let isCleaned = false,
  sortedEls = [],
  originalHidden = [];
// Elements whose text will be scattered into individual letter spans
const textTargets = [".hero-headline", ".hero-languages"];
// Toggle between sort and unsort when clicking the illustration
if (heroIllustrationToggle) {
  heroIllustrationToggle.addEventListener("click", () => {
    isCleaned ? unsort() : sort();
    isCleaned = !isCleaned;
    heroIllustrationToggle.setAttribute(
      "aria-label",
      isCleaned ? "Restore text" : "Sort data",
    );
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
  // Hide underlines during sorting
  document.querySelectorAll(".hero-headline a, .hero-data").forEach((el) => {
    el.style.textDecorationColor = "transparent";
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
    sortedEls.forEach((el) => el.remove());
    sortedEls = [];
  }, totalLetterTime);
  // --- STEP 3: Restore extra elements (dot, clock, button) after letters settle ---
  setTimeout(() => {
    // Restore underlines
    document.querySelectorAll(".hero-headline a, .hero-data").forEach((el) => {
      el.style.textDecorationColor = "";
    });
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

/* ============================================================
   07 — HOMEPAGE ENTRANCE & SCROLL REVEALS
   Sets up scroll-triggered reveal animations and resets them on page revisits.
   ============================================================ */
(() => {
  const services = document.querySelector("#services");
  const work = document.querySelector("#work");
  const about = document.querySelector("#about");
  /*
   * Homepage only.
   */
  if (
    document.body.classList.contains("case-page") ||
    !services ||
    !work ||
    !about ||
    !("IntersectionObserver" in window)
  ) {
    document.documentElement.classList.remove("page-entering");
    return;
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;
  const revealElements = new Set();
  /* ---------------------------------------------
     Helper
  --------------------------------------------- */
  const prepareReveal = (element, type = "text", delay = 0) => {
    if (!element || element.dataset.homeRevealReady === "true") {
      return;
    }
    element.dataset.homeRevealReady = "true";
    element.classList.add(`home-reveal-${type}`);
    element.style.setProperty("--home-reveal-delay", `${delay}ms`);
    revealElements.add(element);
  };
  /*
   * Only now activate the hidden states.
   * If JS fails, the homepage remains completely visible.
   */
  document.documentElement.classList.add("home-motion-ready");
  /* =============================================
     HERO
     Gentle load sequence
  ============================================= */
  prepareReveal(document.querySelector(".hero-headline"), "text", 60);
  /*
   * Fade only:
   * .hero-illustration-btn already uses transform
   * for its horizontal positioning.
   */
  prepareReveal(document.querySelector(".hero-illustration-btn"), "fade", 180);
  /* =============================================
     SERVICES
  ============================================= */
  prepareReveal(services.querySelector(".expertise-content"), "text", 0);
  /* =============================================
     SELECTED WORK
  ============================================= */
  work.querySelectorAll(".work-list .work-card").forEach((card, index) => {
    prepareReveal(card, "visual", index * 70);
  });
  /* =============================================
     ABOUT
  ============================================= */
  prepareReveal(about.querySelector(".about-editorial-photo"), "visual", 0);
  prepareReveal(about.querySelector(".about-editorial-label"), "text", 40);
  prepareReveal(about.querySelector(".about-editorial-copy"), "text", 90);

  prepareReveal(document.querySelector(".testimonials-editorial"), "text", 0);

  prepareReveal(about.querySelector(".about-extra-facts"), "text", 0);
  prepareReveal(about.querySelector(".about-extra-illustration"), "fade", 90);
  /* =============================================
     HERO OPENING ANIMATION
     Always plays when entering the homepage
  ============================================= */
  const heroOpeningElements = [
    document.querySelector(".hero-headline"),
    document.querySelector(".hero-illustration-btn"),
  ].filter(Boolean);
  const heroOpeningElementsSet = new Set(heroOpeningElements);
  /* =============================================
     OBSERVER
     Everything after the hero
  ============================================= */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -10% 0px",
    },
  );
  function resetAndStartHomepage() {
    /*
     * Forget all reveals from the previous visit.
     */
    revealElements.forEach((element) => {
      element.classList.remove("is-visible");
    });
    /*
     * Stop old observer state.
     */
    observer.disconnect();
    /*
     * Force the hidden state to register.
     */
    void document.documentElement.offsetHeight;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        /*
         * Hero appears immediately and smoothly.
         */
        heroOpeningElements.forEach((element) => {
          element.classList.add("is-visible");
        });
        document.documentElement.classList.remove("page-entering");
        /*
         * Everything below the hero waits for scroll.
         */
        revealElements.forEach((element) => {
          if (!heroOpeningElementsSet.has(element)) {
            observer.observe(element);
          }
        });
      });
    });
  }
  /*
   * First visit.
   */
  resetAndStartHomepage();
  /*
   * Every time the homepage is shown again,
   * treat it like a completely fresh visit.
   */
  window.addEventListener("pageshow", () => {
    resetAndStartHomepage();
  });
})();

/* ============================================================
   08 — LANGUAGE GREETING BUTTONS
   Synchronizes greeting selection with the active site language.
   ============================================================ */
const greetingButtons = document.querySelectorAll(
  ".hero-languages button[data-lang]",
);

function syncGreetingButtons() {
  const currentLanguage = document.documentElement.lang
    .slice(0, 2)
    .toLowerCase();
  greetingButtons.forEach((button) => {
    const selected = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}
let greetingLanguageSwitching = false;
greetingButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (greetingLanguageSwitching) return;
    if (typeof window.applyLanguage !== "function") return;
    const language = button.dataset.lang;
    greetingLanguageSwitching = true;
    try {
      await window.applyLanguage(language);
      syncGreetingButtons();
    } catch (error) {
      console.error("Could not switch language:", error);
    } finally {
      greetingLanguageSwitching = false;
    }
  });
});
/* Keep selection correct after initial language detection
   or a language change elsewhere on the page. */
const greetingLanguageObserver = new MutationObserver(syncGreetingButtons);
greetingLanguageObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});
syncGreetingButtons();

/* ============================================================
   09 — FOOTER VISIBILITY & THEME BUTTON
   Hides the theme control when the contact footer is visible.
   Works even when the footer is inserted after the script runs.
   ============================================================ */
function watchContactFooter() {
  const footer = document.getElementById("contact");
  const toggle = document.getElementById("theme-toggle");
  if (!footer || !toggle) return false;
  const observer = new IntersectionObserver(([entry]) => {
    toggle.classList.toggle("is-hidden", entry.isIntersecting);
  });
  observer.observe(footer);
  return true;
}
// Also handles a footer loaded after the main script.
if (!watchContactFooter()) {
  const footerLoaderObserver = new MutationObserver(() => {
    if (watchContactFooter()) {
      footerLoaderObserver.disconnect();
    }
  });
  footerLoaderObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

//line for the process project 1

document.querySelectorAll(".process").forEach((process) => {
  const path = process.querySelector(".process__connector path");
  const icons = [...process.querySelectorAll(".process__step > .icon")];
  const steps = icons.map((icon) => icon.parentElement);

  if (!path || icons.length !== 4) return;

  function drawConnector() {
    const bounds = process.getBoundingClientRect();
    const [observe, design, build, test] = icons.map((icon) => {
      const rect = icon.getBoundingClientRect();

      return {
        x: rect.left - bounds.left + rect.width / 2,
        y: rect.top - bounds.top + rect.height / 2,
      };
    });

    if (window.matchMedia("(max-width: 760px)").matches) {
      const twoColumns = window.matchMedia("(max-width: 500px)").matches;
      const iconRects = icons.map((icon) => icon.getBoundingClientRect());
      const segments = [];

      for (let index = 0; index < iconRects.length - 1; index++) {
        const start = iconRects[index];
        const end = iconRects[index + 1];
        const goesRight = !twoColumns && index % 2 === 0;

        const startX = (goesRight ? start.right : start.left) - bounds.left;
        const endX = (goesRight ? end.right : end.left) - bounds.left;
        const startY = start.top - bounds.top + start.height / 2;
        const endY = end.top - bounds.top + end.height / 2;

        const controlX = goesRight
          ? Math.min(bounds.width - 2, startX + 160)
          : Math.max(2, startX - 110);

        segments.push(
          `M ${startX} ${startY}
           C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`,
        );
      }

      path.setAttribute("d", segments.join(" "));
      return;
    }

    const topRowBottom =
      Math.max(
        ...steps.slice(0, 2).map((step) => step.getBoundingClientRect().bottom),
      ) - bounds.top;

    const buildTop = icons[2].getBoundingClientRect().top - bounds.top;
    const middleY = (topRowBottom + buildTop) / 2;

    const rightX = bounds.width - 2;
    const leftX = Math.max(2, build.x - 80);
    const rightTurn = Math.min(80, (rightX - design.x) / 2);
    const leftTurn = Math.min(40, build.x - leftX);

    path.setAttribute(
      "d",
      `
      M ${observe.x} ${observe.y}
      H ${rightX - rightTurn}
      C ${rightX + rightTurn / 3} ${design.y},
        ${rightX + rightTurn / 3} ${middleY},
        ${rightX - rightTurn} ${middleY}
      H ${leftX + leftTurn}
      C ${leftX - leftTurn / 3} ${middleY},
        ${leftX - leftTurn / 3} ${build.y},
        ${leftX + leftTurn} ${build.y}
      H ${test.x}
    `,
    );
  }

  const observer = new ResizeObserver(drawConnector);
  observer.observe(process);
  steps.forEach((step) => observer.observe(step));
  drawConnector();
});

/* =============================================
   SOLUTION — AUTOMATED BEFORE / AFTER USER FLOW
============================================= */
(() => {
  const flow = document.querySelector("[data-solution-flow]");
  if (!flow) return;

  const stage = flow.querySelector(".cs-solution-flow-stage");
  const buttons = Array.from(flow.querySelectorAll("[data-flow-state]"));
  if (!stage || buttons.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const BEFORE_HOLD = 3000;
  const AFTER_HOLD = 3200;
  const RETURN_FADE = 320;

  let state = "before";
  let timer = null;
  let returnTimer = null;
  let userControlled = false;
  let isVisible = false;
  let isReturning = false;

  const updateButtons = (nextState) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.flowState === nextState;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const clearFlowTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const clearReturnTimer = () => {
    if (returnTimer) {
      clearTimeout(returnTimer);
      returnTimer = null;
    }
  };

  const cancelReturn = () => {
    if (!isReturning) return;
    clearReturnTimer();
    isReturning = false;
    stage.classList.remove("is-return-fading");
    stage.classList.remove("is-resetting");
    flow.classList.remove("is-resetting");
  };

  const flowArrows = [
    ["start", "M68.8 252 H111.7", "M68.8 252 H185.3"],
    ["middle", "M492.8 252 H518.1", "M358.4 252 H474.9"],
    ["end", "M950.4 252 H978.9", "M689.6 252 H806.1"],
  ];

  function updateFlowArrows(isAfter) {
    for (const [name, before, after] of flowArrows) {
      stage
        .querySelector(`.cs-flow-arrow--${name}`)
        ?.setAttribute("d", isAfter ? after : before);
    }
  }

  const setAfter = () => {
    cancelReturn();
    if (state === "after") return;

    stage.classList.add("is-after");
    updateFlowArrows(true);
    state = "after";
    updateButtons(state);
  };

  const setBeforeSmooth = (onComplete) => {
    if (state === "before" || isReturning) {
      onComplete?.();
      return;
    }

    isReturning = true;
    clearReturnTimer();

    // 1. Fade the complete After state away as one unit.
    stage.classList.add("is-return-fading");

    returnTimer = setTimeout(() => {
      returnTimer = null;

      // 2. While invisible, snap every node/line back to the Before geometry.
      flow.classList.add("is-resetting");
      stage.classList.add("is-resetting");
      stage.classList.remove("is-after");
      updateFlowArrows(false);
      state = "before";
      updateButtons(state);

      // Commit the invisible reset before restoring transitions.
      stage.getBoundingClientRect();
      stage.classList.remove("is-resetting");
      flow.classList.remove("is-resetting");

      // 3. On the next frame, fade the complete Before state back in.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stage.classList.remove("is-return-fading");
          isReturning = false;
          onComplete?.();
        });
      });
    }, RETURN_FADE);
  };

  const scheduleNext = () => {
    clearFlowTimer();
    if (userControlled || !isVisible || isReturning) return;

    timer = setTimeout(
      () => {
        timer = null;

        if (state === "before") {
          // Keep the existing Before -> After transformation exactly as it is.
          setAfter();
          scheduleNext();
        } else {
          // After -> Before is intentionally different: fade out, invisible reset,
          // fade in. Only restart the hold once the Before state is visible again.
          setBeforeSmooth(() => {
            if (!userControlled && isVisible) scheduleNext();
          });
        }
      },
      state === "before" ? BEFORE_HOLD : AFTER_HOLD,
    );
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      userControlled = true;
      clearFlowTimer();

      const nextState = button.dataset.flowState;
      updateButtons(nextState);

      if (nextState === "after") {
        setAfter();
      } else {
        setBeforeSmooth();
      }
    });
  });

  // Start the loop only when the flow is actually visible, so visitors see
  // the complex state first instead of arriving halfway through the cycle.
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = Boolean(entry?.isIntersecting);

      if (isVisible) {
        scheduleNext();
      } else {
        clearFlowTimer();
      }
    },
    { threshold: 0.35 },
  );

  observer.observe(flow);

  // Keep reduced-motion users on the same interaction model, but transitions
  // themselves are reduced to near-instant by CSS.
  reducedMotion.addEventListener?.("change", () => {
    if (!userControlled && isVisible) scheduleNext();
  });
})();

// Story notes: show the right notes for the current step in a project story.

document.querySelectorAll(".project-story").forEach((story) => {
  const steps = [...story.querySelectorAll("[data-story-step]")];
  const notes = [...story.querySelectorAll("[data-story-notes]")];
  let frame = null;

  function updateNotes() {
    frame = null;
    let active = steps[0].dataset.storyStep;

    if (window.matchMedia("(max-width: 760px)").matches) {
      for (let index = 0; index < steps.length - 1; index++) {
        const painCard = steps[index].querySelector(".project-story__card");
        if (painCard.getBoundingClientRect().bottom > 24) break;

        active = steps[index + 1].dataset.storyStep;
      }
    } else {
      const trigger = window.innerHeight * 0.5;

      for (const step of steps) {
        if (step.getBoundingClientRect().top > trigger) break;
        active = step.dataset.storyStep;
      }
    }

    notes.forEach((group) => {
      group.classList.toggle("is-active", group.dataset.storyNotes === active);
    });
  }

  function scheduleUpdate() {
    if (frame === null) frame = requestAnimationFrame(updateNotes);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateNotes();
});

document.querySelectorAll(".project-story__visual").forEach((figure) => {
  const image = figure.querySelector("img");
  const svg = figure.querySelector(".project-story__notes");
  const grid = figure.closest(".layout-grid");
  const stepsColumn = figure
    .closest(".project-story")
    ?.querySelector(".project-story__steps");

  if (!image || !svg || !grid || !stepsColumn) return;

  const notes = svg.querySelectorAll("[data-side]");

  function positionNotes() {
    const frame = svg.getBoundingClientRect();
    const screen = image.getBoundingClientRect();

    if (!frame.width || !frame.height || !screen.height) return;

    svg.setAttribute("viewBox", `0 0 ${frame.width} ${frame.height}`);

    const visualStyle = getComputedStyle(figure);
    const gap = parseFloat(visualStyle.getPropertyValue("--note-gap"));
    const gutter = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const visualColumns =
      Number(visualStyle.gridColumnEnd) - Number(visualStyle.gridColumnStart);
    const columnStep = (frame.width + gutter) / visualColumns;

    if (window.matchMedia("(760px < width <= 1020px)").matches) {
      // Calculate the five-column height even if the image is currently compact.
      const wideImageWidth = 5 * columnStep - gutter;
      const wideImageHeight = screen.height * (wideImageWidth / screen.width);
      const notesSpace =
        parseFloat(visualStyle.paddingTop) +
        parseFloat(visualStyle.paddingBottom);
      const stickyTop = parseFloat(visualStyle.top);
      const bottomClearance = 12;
      const needsCompact =
        stickyTop + wideImageHeight + notesSpace + bottomClearance >
        window.innerHeight;

      if (figure.classList.contains("is-compact") !== needsCompact) {
        figure.classList.toggle("is-compact", needsCompact);
        // The ResizeObserver will reposition the notes at the new width.
        return;
      }
    }

    const imageLeft = screen.left - frame.left;
    const imageTop = screen.top - frame.top;
    const imageBottom = imageTop + screen.height;
    const labelRightEdge = Math.min(
      frame.width,
      stepsColumn.getBoundingClientRect().left - frame.left - 12,
    );

    notes.forEach((note) => {
      const label = note.querySelector("text");
      const line = note.querySelector("path");
      const rect = note.querySelector("rect");
      if (!label || !line || !rect || !note.dataset.box) return;

      const [left, top, width, height] = note.dataset.box
        .trim()
        .split(/\s+/)
        .map(Number);

      const boxX = imageLeft + (screen.width * left) / 100;
      const boxY = imageTop + (screen.height * top) / 100;
      const boxWidth = (screen.width * width) / 100;
      const boxHeight = (screen.height * height) / 100;

      rect.setAttribute("x", boxX);
      rect.setAttribute("y", boxY);
      rect.setAttribute("width", boxWidth);
      rect.setAttribute("height", boxHeight);

      const above = note.dataset.side === "top";
      const imageEdge = above ? imageTop : imageBottom;

      label.setAttribute("text-anchor", "start");
      label.setAttribute(
        "dominant-baseline",
        above ? "text-after-edge" : "text-before-edge",
      );

      const labelWidth = label.getComputedTextLength();
      let column = Math.max(4, Math.min(7, Number(note.dataset.col) || 4));
      let labelX = (column - 4) * columnStep;

      while (column > 4 && labelX + labelWidth > labelRightEdge) {
        column -= 1;
        labelX = (column - 4) * columnStep;
      }

      const stackedStory = window.matchMedia("(width <= 760px)").matches;
      const sameSideNotes = [...note.parentElement.children].filter(
        (item) => item.dataset.side === note.dataset.side,
      );
      const noteIndex = sameSideNotes.indexOf(note);
      const useSideConnector = false;
      const offset = 0;

      if (stackedStory) {
        labelX = Math.min(noteIndex, 1) * columnStep;
      }

      const lineX = labelX + labelWidth / 2;
      const labelY = imageEdge + (above ? -1 : 1) * (gap + offset);
      const lineEndY = labelY + (above ? 6 : -6);
      const bendY = (imageEdge + lineEndY) / 2;

      label.setAttribute("x", labelX);
      label.setAttribute("y", labelY);

      const textBounds = label.getBBox();
      const sideX = textBounds.x + textBounds.width + 6;
      const sideY = textBounds.y + textBounds.height / 2;
      const elbowX = sideX + 10;
      const targetX = useSideConnector ? elbowX : lineX;

      const inset = Math.min(8, boxWidth / 2);
      const anchorX = Math.max(
        boxX + inset,
        Math.min(targetX, boxX + boxWidth - inset),
      );
      const anchorY = above ? boxY : boxY + boxHeight;

      line.setAttribute(
        "d",
        useSideConnector
          ? `M ${anchorX} ${anchorY} V ${bendY} H ${elbowX} V ${sideY} H ${sideX}`
          : `M ${anchorX} ${anchorY} V ${bendY} H ${lineX} V ${lineEndY}`,
      );
    });
  }
  const observer = new ResizeObserver(positionNotes);
  observer.observe(figure);
  observer.observe(image);
  window.addEventListener("resize", positionNotes);
  document.fonts.ready.then(positionNotes);
});

document.querySelectorAll(".project-story").forEach((story) => {
  const visual = story.querySelector(".project-story__visual");
  const steps = story.querySelector(".project-story__steps");
  if (!visual || !steps) return;

  const desktopMotion = window.matchMedia(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  );
  const easeDistance = 160;
  let frame = null;

  function updateStickyEase() {
    frame = null;

    if (!desktopMotion.matches) {
      visual.style.removeProperty("translate");
      return;
    }

    const style = getComputedStyle(visual);
    const naturalTop =
      steps.getBoundingClientRect().top + parseFloat(style.marginTop);
    const distance = naturalTop - parseFloat(style.top);

    if (Math.abs(distance) >= easeDistance) {
      visual.style.removeProperty("translate");
      return;
    }

    const progress = (distance + easeDistance) / (2 * easeDistance);
    const easedOffset = easeDistance * progress ** 2;
    const stickyOffset = Math.max(distance, 0);

    visual.style.translate = `0 ${easedOffset - stickyOffset}px`;
  }

  function scheduleUpdate() {
    if (frame === null) {
      frame = requestAnimationFrame(updateStickyEase);
    }
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  desktopMotion.addEventListener("change", scheduleUpdate);
  scheduleUpdate();
});

(() => {
  const links = document.querySelectorAll(
    '.left-sidebar .sidebar-projects a[href^="#"]:not([aria-current="page"])',
  );

  const sections = Array.from(links, (link) => ({
    link,
    section: document.getElementById(link.hash.slice(1)),
  })).filter(({ section }) => section);

  if (!sections.length) return;

  let framePending = false;

  function updateActiveSection() {
    framePending = false;
    const readingLine = window.innerHeight * 0.25;
    let currentLink = null;

    for (const { link, section } of sections) {
      const { top, bottom } = section.getBoundingClientRect();

      if (top <= readingLine && bottom > readingLine) {
        currentLink = link;
      }
    }

    const product = document.getElementById("product");

    if (product && product.getBoundingClientRect().top <= readingLine) {
      currentLink = null;
    }

    for (const { link } of sections) {
      const active = link === currentLink;
      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateActiveSection);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  scheduleUpdate();
})();

document.querySelectorAll(".hero-languages").forEach((row) => {
  function updateLanguageFade() {
    const maxScroll = row.scrollWidth - row.clientWidth;

    row.toggleAttribute("data-fade-left", row.scrollLeft > 1);
    row.toggleAttribute("data-fade-right", maxScroll - row.scrollLeft > 1);
  }

  row.addEventListener("scroll", updateLanguageFade, { passive: true });

  const observer = new ResizeObserver(updateLanguageFade);
  observer.observe(row);
  row.querySelectorAll("button").forEach((button) => observer.observe(button));

  updateLanguageFade();
});

(() => {
  const sidebar = document.querySelector(".left-sidebar");
  if (!sidebar) return;

  const links = document.querySelectorAll(".left-sidebar a, #theme-toggle");
  const desktop = window.matchMedia("(width > 1020px)");
  let frame = null;

  function updateSidebarColors() {
    frame = null;

    const footer = desktop.matches
      ? document.querySelector(".contact-footer")
      : null;
    const footerBounds = footer?.getBoundingClientRect();

    links.forEach((link) => {
      const bounds = link.getBoundingClientRect();
      const midpoint = bounds.top + bounds.height / 2;
      const overFooter =
        footerBounds &&
        midpoint >= footerBounds.top &&
        midpoint < footerBounds.bottom;

      link.classList.toggle("is-over-footer", Boolean(overFooter));
    });
  }

  function scheduleSidebarUpdate() {
    if (frame === null) {
      frame = requestAnimationFrame(updateSidebarColors);
    }
  }

  window.addEventListener("scroll", scheduleSidebarUpdate, { passive: true });
  window.addEventListener("resize", scheduleSidebarUpdate);
  window.addEventListener("load", scheduleSidebarUpdate);
  scheduleSidebarUpdate();
})();
(() => {
  const key = "portfolio-show-grid";
  const button = document.getElementById("grid-toggle");

  function setGridVisible(visible) {
    document.body.classList.toggle("show-grid", visible);
    button?.setAttribute("aria-pressed", String(visible));
  }

  setGridVisible(localStorage.getItem(key) === "true");

  button?.addEventListener("click", () => {
    const visible = !document.body.classList.contains("show-grid");

    setGridVisible(visible);
    localStorage.setItem(key, String(visible));
  });
})();
