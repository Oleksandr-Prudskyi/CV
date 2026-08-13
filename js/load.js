(function () {
  "use strict";

  var fragments = document.querySelectorAll("[data-load]");
  var scripts = [
    "js/main.js",
    "js/experience.js",
    "js/animations.js",
    "js/goit-data.js",
    "js/goit-viewer.js",
  ];

  function loadFragment(element) {
    return fetch(element.dataset.load)
      .then(function (response) {
        if (!response.ok)
          throw new Error("Could not load " + element.dataset.load);
        return response.text();
      })
      .then(function (html) {
        element.outerHTML = html;
      });
  }

  function loadScript(path) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = path;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  Promise.all(Array.from(fragments, loadFragment))
    .then(function () {
      return scripts.reduce(function (promise, path) {
        return promise.then(function () {
          return loadScript(path);
        });
      }, Promise.resolve());
    })
    .catch(function (error) {
      console.error("Page component loading failed:", error);
    });
})();
