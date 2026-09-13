import anime from "animejs";

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // Narrow viewports show fills only; stroke overlay is desktop-only because
    // fine paths clump into noise at reduced sizes.
    function initHeroBg() {
      var symbol = document.getElementById("icon-ukr-picture");
      var heroSection = document.querySelector(".hero");
      var heroBgSvg = document.querySelector(".hero-bg-svg");
      if (!symbol || !heroSection || !heroBgSvg) return;

      var isNarrowViewport = window.matchMedia("(max-width: 1023px)").matches;
      heroBgSvg.setAttribute(
        "preserveAspectRatio",
        isNarrowViewport ? "xMidYMid slice" : "xMidYMid meet",
      );
      heroBgSvg.classList.add("revealed");

      if (isNarrowViewport) return;

      var drawSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      drawSvg.setAttribute("class", "hero-bg-draw");
      drawSvg.setAttribute("viewBox", symbol.getAttribute("viewBox"));
      drawSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      drawSvg.setAttribute("aria-hidden", "true");
      symbol.querySelectorAll("path").forEach(function (p) {
        drawSvg.appendChild(p.cloneNode(true));
      });
      heroSection.insertBefore(drawSvg, heroBgSvg);
    }
    if (document.getElementById("icon-ukr-picture")) {
      initHeroBg();
    } else {
      var bodyObserver = new MutationObserver(function () {
        if (document.getElementById("icon-ukr-picture")) {
          bodyObserver.disconnect();
          initHeroBg();
        }
      });
      bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Contact bar top logo animation triggers when the bar becomes visible on scroll.
    var contactBar = document.getElementById("contactBar");
    var logoSvg = document.querySelector(".top-logo svg");
    var logoAnimated = false;
    if (contactBar && logoSvg) {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName !== "class") return;
          var isVisible = contactBar.classList.contains("visible");
          if (isVisible && !logoAnimated) {
            logoAnimated = true;
            logoSvg.style.transition = "none";
            anime({
              targets: logoSvg,
              scale: [0.6, 1.03, 1],
              rotate: ["-3deg", "0deg"],
              opacity: [0, 1],
              duration: 1200,
              easing: "easeInOutCubic",
              complete: function () {
                logoSvg.style.transition = "";
              },
            });
          }
          if (!isVisible) {
            logoAnimated = false;
            logoSvg.style.opacity = "0";
            logoSvg.style.transform = "scale(0.3)";
          }
        });
      });
      observer.observe(contactBar, { attributes: true });
    }

    // Social panel link animation runs when the panel opens on click.
    var socialPanel = document.getElementById("socialPanel");
    if (socialPanel) {
      var panelObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName !== "class") return;
          if (!socialPanel.classList.contains("open")) return;
          var links = socialPanel.querySelectorAll(".social-links a");
          var nickname = socialPanel.querySelector(".social-nickname");
          anime.remove(links);
          if (nickname) anime.remove(nickname);
          links.forEach(function (link) {
            link.style.opacity = "0";
            link.style.transform = "translateX(-20px)";
          });
          anime({
            targets: links,
            translateX: [-20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100, { from: "first" }),
            duration: 400,
            easing: "easeOutCubic",
          });
          if (nickname) {
            nickname.style.opacity = "0";
            nickname.style.transform = "translateX(-15px)";
            anime({
              targets: nickname,
              opacity: [0, 1],
              translateX: [-15, 0],
              duration: 350,
              easing: "easeOutCubic",
            });
          }
        });
      });
      panelObserver.observe(socialPanel, { attributes: true });
    }
  });
})();
