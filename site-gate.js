(function () {
  const PASSWORD = "noodlesoup";
  const STORAGE_KEY = "site-gate-unlocked";

  document.addEventListener("DOMContentLoaded", () => {
    const gate = document.getElementById("site-gate");
    const content = document.getElementById("site-content");

    if (!gate || !content) return;

    // Already unlocked
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      gate.style.display = "none";
      return;
    }

    // Hide portfolio
    content.style.visibility = "hidden";
    content.style.position = "absolute";
    content.style.inset = "0";

    const input = document.getElementById("site-gate-input");
    const button = document.getElementById("site-gate-submit");
    const error = document.getElementById("site-gate-error");

    function unlock() {
      if (input.value === PASSWORD) {
        localStorage.setItem(STORAGE_KEY, "true");

        gate.classList.add("site-gate-hide");

        setTimeout(() => {
          gate.style.display = "none";
          content.style.visibility = "visible";
          content.style.position = "";
          content.style.inset = "";
        }, 350);
      } else {
        error.style.display = "block";
        input.value = "";
        input.focus();
      }
    }

    button.addEventListener("click", unlock);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") unlock();
    });
  });
})();
