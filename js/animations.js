(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    function initHeroBgDraw() {
      var symbol = document.getElementById("icon-ukr-picture");
      var heroSection = document.querySelector(".hero");
      var heroBgSvg = document.querySelector(".hero-bg-svg");
      if (!symbol || !heroSection || !heroBgSvg) return;

      var drawSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      drawSvg.setAttribute("class", "hero-bg-draw");
      drawSvg.setAttribute("viewBox", symbol.getAttribute("viewBox"));
      drawSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
      drawSvg.setAttribute("aria-hidden", "true");

      var paths = symbol.querySelectorAll("path");
      paths.forEach(function (p) {
        var clone = p.cloneNode(true);
        drawSvg.appendChild(clone);
      });

      heroSection.insertBefore(drawSvg, heroBgSvg);

      var drawPaths = drawSvg.querySelectorAll("path");
      drawPaths.forEach(function (path) {
        var length = path.getTotalLength ? path.getTotalLength() : 200;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      });

      anime({
        targets: drawPaths,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInOutSine",
        duration: function () {
          return anime.random(1200, 2800);
        },
        delay: anime.stagger(35, { from: "first" }),
        complete: function () {
          heroBgSvg.classList.add("revealed");
          anime({
            targets: drawSvg,
            opacity: 0,
            duration: 1200,
            easing: "easeOutQuad",
          });
        },
      });
    }

    var spriteCheck = document.getElementById("icon-ukr-picture");
    if (spriteCheck) {
      initHeroBgDraw();
    } else {
      var bodyObserver = new MutationObserver(function () {
        if (document.getElementById("icon-ukr-picture")) {
          bodyObserver.disconnect();
          initHeroBgDraw();
        }
      });
      bodyObserver.observe(document.body, { childList: true, subtree: true });
    }
    var contactBar = document.getElementById("contactBar");
    var logoSvg = document.querySelector(".top-logo svg");
    var logoAnimated = false;

    if (contactBar && logoSvg) {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName === "class") {
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
                easing: "easeOutCubic",
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
          }
        });
      });
      observer.observe(contactBar, { attributes: true });
    }
    var socialPanel = document.getElementById("socialPanel");
    if (socialPanel) {
      var panelObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName === "class") {
            if (socialPanel.classList.contains("open")) {
              var links = socialPanel.querySelectorAll(".social-links a");
              anime({
                targets: links,
                scale: [0, 1],
                opacity: [0, 1],
                delay: anime.stagger(80, { start: 120 }),
                duration: 450,
                easing: "easeOutBack",
              });
              var nickname = socialPanel.querySelector(".social-nickname");
              if (nickname) {
                anime({
                  targets: nickname,
                  opacity: [0, 1],
                  translateX: [-15, 0],
                  duration: 400,
                  easing: "easeOutCubic",
                });
              }
            }
          }
        });
      });
      panelObserver.observe(socialPanel, { attributes: true });
    }
    var skillTags = document.querySelectorAll(".skill-tag");
    if (skillTags.length > 0) {
      skillTags.forEach(function (tag) {
        tag.style.opacity = "0";
        tag.style.transform = "scale(0) translateY(30px)";
      });

      var skillsGrid = document.querySelector(".skills-list");
      if (skillsGrid) {
        var skillObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                anime({
                  targets: ".skill-tag",
                  opacity: [0, 1],
                  scale: [0, 1],
                  translateY: [30, 0],
                  delay: anime.stagger(60, { from: "first" }),
                  duration: 500,
                  easing: "easeOutBack",
                });
                skillObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.05 },
        );
        skillObserver.observe(skillsGrid);
      }
    }
    var contactCards = document.querySelectorAll(".contact-grid .contact-card");
    if (contactCards.length > 0) {
      contactCards.forEach(function (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px) scale(0.85)";
      });

      setTimeout(function () {
        anime({
          targets: ".contact-grid .contact-card",
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.85, 1],
          delay: anime.stagger(150),
          duration: 700,
          easing: "easeOutBack",
        });
      }, 800);
    }
    var sectionTitles = document.querySelectorAll(".title-section");
    sectionTitles.forEach(function (title) {
      var titleObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              anime({
                targets: entry.target,
                opacity: [0.5, 1],
                translateX: [-20, 0],
                duration: 700,
                easing: "easeOutCubic",
              });
              titleObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );
      titleObserver.observe(title);
    });
    var floatingActions = document.querySelector(".side-buttons");
    if (floatingActions) {
      var buttons = floatingActions.querySelectorAll(
        ".download-btn, .social-btn",
      );
      setTimeout(function () {
        anime({
          targets: buttons,
          scale: [1, 1.2, 1],
          duration: 900,
          delay: anime.stagger(200),
          easing: "easeInOutSine",
        });
      }, 2500);
    }
  });
})();
