if (!document.getElementById("cursor")) {
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  document.body.prepend(cursor);
}
function loadComponent(selector, path) {
  const container = document.querySelector(selector);

  if (!container) return Promise.resolve();

  return fetch(path)
    .then((response) => response.text())
    .then((html) => {
      container.innerHTML = html;
    });
}

function loadScript(path) {
  const script = document.createElement("script");
  script.src = path;
  document.body.appendChild(script);
}
function getPath(path) {
  const isInWorkFolder = window.location.pathname.includes("/work/");
  return isInWorkFolder ? "../" + path : path;
}

Promise.all([loadComponent("#footer", getPath("components/footer.html"))]).then(
  () => {
    loadScript(getPath("script.js"));
  },
);
