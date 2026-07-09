(function () {
  const PASSWORD = "noodlesoup";
  const STORAGE_KEY = "site-gate-unlocked";

  document.addEventListener("DOMContentLoaded", () => {
    const gate = document.getElementById("site-gate");
    const content = document.getElementById("site-content");
    const input = document.getElementById("site-gate-input");
    const button = document.getElementById("site-gate-submit");
    const error = document.getElementById("site-gate-error");

    if (!gate || !content || !input || !button || !error) return;

    if (localStorage.getItem(STORAGE_KEY) === "true") {
      gate.style.display = "none";
      document.body.classList.remove("gate-locked");
      return;
    }

    document.body.classList.add("gate-locked");

    content.style.visibility = "hidden";
    content.style.position = "absolute";
    content.style.inset = "0";

    function unlock() {
      if (input.value === PASSWORD) {
        localStorage.setItem(STORAGE_KEY, "true");

        document.body.classList.remove("gate-locked");
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
