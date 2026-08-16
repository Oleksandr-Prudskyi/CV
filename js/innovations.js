(function () {
  "use strict";

  function isMobile() {
    return window.innerWidth <= 768;
  }

  var progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  var scrollTick = false;
  window.addEventListener("scroll", function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      var scrollTop = window.scrollY;
      var docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + "%";
      scrollTick = false;
    });
  });

  if (!isMobile()) {
    var heroBgSvg = document.querySelector(".hero-bg-svg");
    var heroBgDraw = document.querySelector(".hero-bg-draw");
    var heroSection = document.querySelector(".hero");

    if (heroSection) {
      var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      var parallaxTick = false;

      window.addEventListener("scroll", function () {
        if (parallaxTick) return;
        parallaxTick = true;
        requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          if (scrollY < heroBottom) {
            var offset = scrollY * 0.35;
            var transform = "scaleX(1.2) translateY(" + offset + "px)";
            if (heroBgSvg) heroBgSvg.style.transform = transform;
            if (heroBgDraw) heroBgDraw.style.transform = transform;
          }
          parallaxTick = false;
        });
      });
    }
  }

  var counterIds = [
    "counterYears",
    "counterMonths",
    "counterDays",
    "counterHours",
  ];
  var prevCounterValues = {};

  counterIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) prevCounterValues[id] = el.textContent;
  });

  var flipObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      var el = m.target.nodeType === 3 ? m.target.parentElement : m.target;
      if (!el || !el.id) return;

      if (
        el.classList.contains("counter-number") &&
        prevCounterValues[el.id] !== el.textContent
      ) {
        prevCounterValues[el.id] = el.textContent;
        el.classList.remove("flip");
        void el.offsetWidth;
        el.classList.add("flip");
      }
    });
  });

  counterIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      flipObserver.observe(el, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  });

  var typedEl = document.getElementById("typedText");
  if (typedEl) {
    var cursorEl = typedEl.nextElementSibling;
    var cursorInterval = null;

    if (cursorEl) {
      var cursorOn = true;
      cursorInterval = setInterval(function () {
        cursorOn = !cursorOn;
        cursorEl.style.opacity = cursorOn ? "1" : "0";
      }, 400);
    }

    var phrases = [
      "Vítejte na mém CV",
      "Přeji Vám krásný den",
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 80;
    var deleteSpeed = 40;
    var pauseAfterType = 3000;
    var pauseAfterDelete = 400;

    function typeStep() {
      var current = phrases[phraseIndex];

      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeStep, pauseAfterType);
          return;
        }
        setTimeout(typeStep, typeSpeed + Math.random() * 40);
      } else {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex++;
          if (phraseIndex >= phrases.length) {
            if (cursorInterval) clearInterval(cursorInterval);
            var subtitle = typedEl.parentElement;
            subtitle.style.animation = "none";
            subtitle.style.transition = "opacity 0.6s ease";
            subtitle.style.opacity = "0";
            return;
          }
          setTimeout(typeStep, pauseAfterDelete);
          return;
        }
        setTimeout(typeStep, deleteSpeed);
      }
    }

    setTimeout(typeStep, 1200);
  }

  if (!isMobile()) {
    var workCards = document.querySelectorAll(".card-work");
    workCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        if (!card.classList.contains("visible")) return;

        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        card.classList.remove("tilt-reset");
        card.classList.add("tilt-active");
        card.style.transform =
          "rotateY(" + x * 5 + "deg) rotateX(" + -y * 5 + "deg)";
      });

      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilt-active");
        card.classList.add("tilt-reset");
        card.style.transform = "";

        card.addEventListener(
          "transitionend",
          function () {
            card.classList.remove("tilt-reset");
          },
          { once: true }
        );
      });
    });
  }

  if (!isMobile()) {
    var trailColors = ["#7d2432", "#a33d43", "#b18a4a", "#c6a66b"];
    var trailPool = [];
    var trailSize = 12;
    var trailIndex = 0;
    var trailThrottle = 0;

    for (var t = 0; t < trailSize; t++) {
      var dot = document.createElement("div");
      dot.className = "cursor-dot";
      dot.style.background = trailColors[t % trailColors.length];
      document.body.appendChild(dot);
      trailPool.push(dot);
    }

    document.addEventListener("mousemove", function (e) {
      var now = Date.now();
      if (now - trailThrottle < 40) return;
      trailThrottle = now;

      var dot = trailPool[trailIndex % trailSize];
      dot.style.opacity = "0.7";
      dot.style.transform = "scale(1)";
      dot.style.left = e.clientX - 3 + "px";
      dot.style.top = e.clientY - 3 + "px";
      dot.style.transition = "none";

      void dot.offsetWidth;

      dot.style.transition =
        "opacity 600ms ease-out, transform 600ms ease-out";
      dot.style.opacity = "0";
      dot.style.transform = "scale(0.2)";

      trailIndex++;
    });
  }

  if (!isMobile()) {
    var magneticBtns = document.querySelectorAll(".side-buttons .circle-btn");
    var magnetRadius = 80;
    var magnetStrength = 0.3;

    document.addEventListener("mousemove", function (e) {
      magneticBtns.forEach(function (btn) {
        var rect = btn.getBoundingClientRect();
        var btnCenterX = rect.left + rect.width / 2;
        var btnCenterY = rect.top + rect.height / 2;

        var distX = e.clientX - btnCenterX;
        var distY = e.clientY - btnCenterY;
        var distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < magnetRadius) {
          var pull = (1 - distance / magnetRadius) * magnetStrength;
          var moveX = distX * pull;
          var moveY = distY * pull;

          btn.classList.remove("magnetic-reset");
          btn.classList.add("magnetic-active");
          btn.style.transform =
            "translate(" + moveX + "px, " + moveY + "px) scale(1.08)";
        } else {
          if (btn.classList.contains("magnetic-active")) {
            btn.classList.remove("magnetic-active");
            btn.classList.add("magnetic-reset");
            btn.style.transform = "";

            btn.addEventListener(
              "transitionend",
              function () {
                btn.classList.remove("magnetic-reset");
              },
              { once: true }
            );
          }
        }
      });
    });
  }
})();
