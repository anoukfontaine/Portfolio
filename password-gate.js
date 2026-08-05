/* ============================================================
   TEMPORARY PASSWORD GATE
   - Not real security, just a soft lock for a few weeks.
   - index.html: hover shows the password box on desktop,
     tap shows it on mobile. Clicking inside it pins it open
     so it won't vanish while you're typing.
   - yellow.html / climate.html: full-page gate if visited directly.
   - To remove: delete the <script src="password-gate.js"> /
     <script src="../password-gate.js"> lines, then delete this file.
   ============================================================ */
(function () {
  // 1. Set your password here.
  var PASSWORD = "noodlesoup";

  // 2. Filenames of the pages that should be protected.
  //var PROTECTED_PAGES = ["yellow.html", "climate.html"];

  function filenameOf(pathOrHref) {
    return pathOrHref.split("?")[0].split("#")[0].split("/").pop();
  }
  function storageKey(filename) {
    return "pw-gate-" + filename;
  }
  function isUnlocked(filename) {
    return localStorage.getItem(storageKey(filename)) === "unlocked";
  }
  function unlock(filename) {
    localStorage.setItem(storageKey(filename), "unlocked");
  }

  var currentFile = filenameOf(location.pathname);

  // ============================================================
  // CASE 1: we're ON a protected page itself
  // ============================================================
  if (PROTECTED_PAGES.indexOf(currentFile) !== -1) {
    if (isUnlocked(currentFile)) return;

    document.documentElement.style.visibility = "hidden";

    document.addEventListener("DOMContentLoaded", function () {
      var style = document.createElement("style");
      style.textContent =
        "#pw-gate-overlay{position:fixed;inset:0;z-index:9999;display:flex;" +
        "align-items:center;justify-content:center;background:rgba(249,249,249,.82);" +
        "backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);" +
        "font-family:var(--font,sans-serif);color:var(--color-text,#1a1a1a);" +
        "animation:pwFadeIn .35s ease both;}" +
        ".pw-gate-box{text-align:center;max-width:360px;padding:40px 32px;border-radius:24px;" +
        "background:rgba(255,255,255,.72);box-shadow:0 24px 80px rgba(0,0,0,.12);" +
        "animation:pwPopIn .45s cubic-bezier(.2,.8,.2,1) both;}" +
        ".pw-gate-box p{margin:0 0 8px;font-size:20px;font-weight:500;letter-spacing:-.02em;}" +
        ".pw-gate-box span{display:block;margin:0 0 22px;font-size:14px;color:var(--color-text-muted,#666);}" +
        "#pw-gate-input{display:block;width:100%;box-sizing:border-box;padding:13px 14px;" +
        "margin-bottom:12px;border:1px solid rgba(0,0,0,.14);border-radius:999px;" +
        "background:rgba(255,255,255,.9);font-family:inherit;font-size:14px;outline:none;" +
        "transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease;}" +
        "#pw-gate-input:focus{border-color:var(--color-text,#1a1a1a);" +
        "box-shadow:0 0 0 4px rgba(0,0,0,.06);}" +
        "#pw-gate-submit{width:100%;padding:13px 20px;border:none;border-radius:999px;" +
        "background:var(--color-text,#1a1a1a);color:var(--color-bg,#f9f9f9);" +
        "font-family:inherit;font-size:14px;cursor:pointer;transition:transform .2s ease,opacity .2s ease;}" +
        "#pw-gate-submit:hover{transform:translateY(-1px);opacity:.9;}" +
        "#pw-gate-error{color:#c0392b;font-size:13px;margin:12px 0 0;display:none;}" +
        ".pw-shake{animation:pwShake .35s ease both;}" +
        "@keyframes pwFadeIn{from{opacity:0}to{opacity:1}}" +
        "@keyframes pwPopIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}" +
        "@keyframes pwShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}50%{transform:translateX(5px)}75%{transform:translateX(-3px)}}";

      document.head.appendChild(style);

      var overlay = document.createElement("div");
      overlay.id = "pw-gate-overlay";
      overlay.innerHTML =
        '<div class="pw-gate-box">' +
        "<p>Oops, this case study is not public.</p>" +
        "<span>Password available upon request.</span>" +
        '<input type="password" id="pw-gate-input" placeholder="Enter password" autofocus />' +
        '<button id="pw-gate-submit">Unlock case study</button>' +
        '<p id="pw-gate-error">Nope. The secret door remains closed.</p>' +
        "</div>";

      document.body.appendChild(overlay);
      document.documentElement.style.visibility = "visible";

      var input = document.getElementById("pw-gate-input");
      var error = document.getElementById("pw-gate-error");

      function showError() {
        error.style.display = "block";
        input.value = "";
        input.focus();

        input.classList.remove("pw-shake");
        void input.offsetWidth;
        input.classList.add("pw-shake");
      }

      function tryUnlock() {
        if (input.value === PASSWORD) {
          unlock(currentFile);
          overlay.remove();
        } else {
          showError();
        }
      }

      document
        .getElementById("pw-gate-submit")
        .addEventListener("click", tryUnlock);

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") tryUnlock();
      });
    });

    return;
  }

  // ============================================================
  // CASE 2: we're on a listing page / portfolio cards
  // ============================================================
  document.addEventListener("DOMContentLoaded", function () {
    var isHoverCapable = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    var cardStyleInjected = false;

    function injectCardStyle() {
      if (cardStyleInjected) return;
      cardStyleInjected = true;

      var style = document.createElement("style");
      style.textContent =
        ".pw-gate-card-overlay{position:absolute;inset:0;z-index:5;display:flex;" +
        "align-items:center;justify-content:center;border-radius:var(--radius-md,8px);" +
        "background:rgba(0,0,0,.48);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);" +
        "animation:pwCardFade .25s ease both;}" +
        ".pw-gate-card-box{text-align:center;padding:24px;max-width:280px;color:#fff;" +
        "animation:pwCardPop .3s cubic-bezier(.2,.8,.2,1) both;}" +
        ".pw-gate-card-box p{margin:0 0 6px;color:#fff;font-size:16px;font-weight:500;letter-spacing:-.01em;}" +
        ".pw-gate-card-box span{display:block;margin:0 0 14px;color:rgba(255,255,255,.72);font-size:12px;}" +
        ".pw-gate-card-input{display:block;width:100%;box-sizing:border-box;padding:10px 12px;" +
        "margin-bottom:10px;border:1px solid rgba(255,255,255,.32);border-radius:999px;" +
        "background:rgba(255,255,255,.14);color:#fff;font-family:inherit;font-size:13px;outline:none;" +
        "transition:border-color .2s ease,background .2s ease,transform .2s ease;}" +
        ".pw-gate-card-input:focus{border-color:rgba(255,255,255,.8);background:rgba(255,255,255,.2);}" +
        ".pw-gate-card-input::placeholder{color:rgba(255,255,255,.55);}" +
        ".pw-gate-card-submit{padding:9px 18px;border:none;border-radius:999px;" +
        "background:#fff;color:#1a1a1a;font-family:inherit;font-size:13px;cursor:pointer;" +
        "transition:transform .2s ease,opacity .2s ease;}" +
        ".pw-gate-card-submit:hover{transform:translateY(-1px);opacity:.92;}" +
        ".pw-gate-card-error{display:none;color:#ffd0d0;font-size:12px;margin:9px 0 0;}" +
        ".pw-shake{animation:pwShake .35s ease both;}" +
        "@keyframes pwCardFade{from{opacity:0}to{opacity:1}}" +
        "@keyframes pwCardPop{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}" +
        "@keyframes pwShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}50%{transform:translateX(5px)}75%{transform:translateX(-3px)}}";

      document.head.appendChild(style);
    }

    function openCardGate(card, href, filename, pinned) {
      if (card.querySelector(".pw-gate-card-overlay")) return;

      injectCardStyle();

      var overlay = document.createElement("div");
      overlay.className = "pw-gate-card-overlay";
      overlay.innerHTML =
        '<div class="pw-gate-card-box">' +
        "<p>Oops, private case study.</p>" +
        "<span>Password available upon request.</span>" +
        '<input type="password" class="pw-gate-card-input" placeholder="Password" />' +
        '<button type="button" class="pw-gate-card-submit">Unlock</button>' +
        '<p class="pw-gate-card-error">Wrong password. Very dramatic.</p>' +
        "</div>";

      card.appendChild(overlay);

      var input = overlay.querySelector(".pw-gate-card-input");
      var error = overlay.querySelector(".pw-gate-card-error");
      var submit = overlay.querySelector(".pw-gate-card-submit");

      var state = { pinned: !!pinned };
      card.__pwGateState = state;

      if (pinned) input.focus();

      function showError() {
        error.style.display = "block";
        input.value = "";
        input.focus();

        input.classList.remove("pw-shake");
        void input.offsetWidth;
        input.classList.add("pw-shake");
      }

      function tryUnlock() {
        if (input.value === PASSWORD) {
          unlock(filename);
          window.location.href = href;
        } else {
          showError();
        }
      }

      overlay.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        state.pinned = true;

        if (e.target === submit) {
          tryUnlock();
        } else {
          input.focus();
        }
      });

      input.addEventListener("keydown", function (e) {
        e.stopPropagation();

        if (e.key === "Enter") tryUnlock();
        if (e.key === "Escape") closeCardGate(card);
      });
    }

    function closeCardGate(card) {
      var overlay = card.querySelector(".pw-gate-card-overlay");
      if (overlay) overlay.remove();
      card.__pwGateState = null;
    }

    var links = document.querySelectorAll("a[href]");

    links.forEach(function (link) {
      var href = link.getAttribute("href");
      var filename = filenameOf(href);

      if (PROTECTED_PAGES.indexOf(filename) === -1) return;
      if (isUnlocked(filename)) return;

      if (getComputedStyle(link).position === "static") {
        link.style.position = "relative";
      }

      link.addEventListener("click", function (e) {
        e.preventDefault();

        if (!link.__pwGateState) {
          openCardGate(link, href, filename, true);
        } else {
          link.__pwGateState.pinned = true;
        }
      });

      if (isHoverCapable) {
        link.addEventListener("mouseenter", function () {
          if (isUnlocked(filename)) return;
          openCardGate(link, href, filename, false);
        });

        link.addEventListener("mouseleave", function () {
          var state = link.__pwGateState;
          if (state && !state.pinned) closeCardGate(link);
        });
      }
    });

    document.addEventListener("click", function (e) {
      document
        .querySelectorAll(".pw-gate-card-overlay")
        .forEach(function (overlay) {
          var card = overlay.parentElement;
          if (!card.contains(e.target)) closeCardGate(card);
        });
    });
  });
})();
