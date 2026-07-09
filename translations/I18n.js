/* =============================================
   I18N ENGINE
   - English lives directly in the HTML (the default/fallback).
   - Other languages live in translations/<lang>.json.
   - Every translatable element carries data-i18n="some.key.path"
     matching the JSON's nested structure.
   - Switching back to "en" restores the original HTML exactly,
     no reload needed.
   - The cycling "contact verb" button isn't static text, so it's
     handled separately: window.contactVerbs holds the active list,
     which script.js's click handler reads from.
============================================= */
(function () {
  const DEFAULT_CONTACT_VERBS = [
    "work",
    "dream",
    "imagine",
    "build",
    "improve",
    "optimize",
    "design",
    "create",
  ];

  function resolveKey(dict, key) {
    return key
      .split(".")
      .reduce((obj, part) => (obj ? obj[part] : undefined), dict);
  }

  function applyContactVerbs(verbs) {
    window.contactVerbs = verbs;
    window.contactVerbIndex = 0;

    const contactVerbEl = document.getElementById("contact-verb");
    if (contactVerbEl) contactVerbEl.textContent = verbs[0];

    // The spacer reserves layout width equal to the longest word,
    // so it needs to track whichever word is longest per language.
    const spacerEl = document.querySelector(".contact-verb-spacer");
    if (spacerEl) {
      spacerEl.textContent = verbs.reduce(
        (longest, word) => (word.length > longest.length ? word : longest),
        verbs[0],
      );
    }
  }

  window.applyLanguage = async function applyLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");

    if (lang === "en") {
      elements.forEach((el) => {
        if (el.dataset.i18nOriginal !== undefined) {
          el.innerHTML = el.dataset.i18nOriginal;
        }
      });
      applyContactVerbs(DEFAULT_CONTACT_VERBS);
      localStorage.setItem("lang", "en");
      document.documentElement.lang = "en";
      return;
    }

    let dict;
    try {
      const res = await fetch(getPath(`translations/${lang}.json`));
      dict = await res.json();
    } catch (err) {
      console.error(`i18n: could not load translations for "${lang}"`, err);
      return;
    }

    elements.forEach((el) => {
      const value = resolveKey(dict, el.dataset.i18n);
      if (value === undefined) return;

      if (el.dataset.i18nOriginal === undefined) {
        el.dataset.i18nOriginal = el.innerHTML;
      }
      el.innerHTML = value;
    });

    applyContactVerbs(
      (dict.contact && dict.contact.verbs) || DEFAULT_CONTACT_VERBS,
    );

    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  };

  // Apply saved language preference. This script is loaded via loader.js
  // after the footer component is already injected into the DOM, so it's
  // safe to run immediately rather than waiting for DOMContentLoaded
  // (which has typically already fired by this point).

  // Apply saved language preference, or browser language on first visit.
  function getBrowserLang() {
    const browserLang = navigator.language || navigator.userLanguage || "en";
    const shortLang = browserLang.slice(0, 2).toLowerCase();

    const supportedLangs = ["en", "de", "fr"];

    return supportedLangs.includes(shortLang) ? shortLang : "en";
  }

  const saved = localStorage.getItem("lang");
  const initialLang = saved || getBrowserLang();

  if (initialLang !== "en") {
    window.applyLanguage(initialLang);
  } else {
    applyContactVerbs(DEFAULT_CONTACT_VERBS);
    document.documentElement.lang = "en";
  }
})();
