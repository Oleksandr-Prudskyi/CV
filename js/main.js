fetch("/img/logos-sprite.svg")
  .then(function (r) {
    return r.text();
  })
  .then(function (t) {
    var box = document.createElement("div");
    box.style.display = "none";
    box.innerHTML = t;
    var svg = box.querySelector("svg");
    if (svg) document.body.insertBefore(svg, document.body.firstChild);
  })
  .catch(function (e) {
    console.warn("Logo sprite load failed:", e);
  });

function initializeApp() {
  "use strict";

  function isMobile() {
    return window.innerWidth <= 768;
  }
  function copyEmail() {
    var email = "oleksandr.prudskyi@gmail.com";
    navigator.clipboard
      .writeText(email)
      .then(function () {
        document.querySelectorAll(".btn-copy").forEach(function (btn) {
          var originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="ph ph-check-circle"></i> Zkopírováno!';
          btn.classList.add("copied");
          setTimeout(function () {
            btn.innerHTML = originalHTML;
            btn.classList.remove("copied");
          }, 2000);
        });
      })
      .catch(function () {
        var textArea = document.createElement("textarea");
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Email zkopírován: " + email);
      });
  }

  document.querySelectorAll(".btn-copy").forEach(function (btn) {
    btn.addEventListener("click", copyEmail);
  });
  var counterYearsEl = document.getElementById("counterYears");
  var counterMonthsEl = document.getElementById("counterMonths");
  var counterDaysEl = document.getElementById("counterDays");
  var counterHoursEl = document.getElementById("counterHours");

  function updateWorkCounter() {
    var startYear = 2021,
      startMonth = 7,
      startDay = 16;

    var nowStr = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Prague",
    });
    var now = new Date(nowStr);

    var years = now.getFullYear() - startYear;
    var months = now.getMonth() - startMonth;
    var days = now.getDate() - startDay;
    var hours = now.getHours();

    if (hours < 0) {
      days--;
      hours += 24;
    }
    if (days < 0) {
      months--;
      var prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    years = Math.max(0, years);
    months = Math.max(0, months);
    days = Math.max(0, days);
    hours = Math.max(0, hours);

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    if (counterYearsEl) counterYearsEl.textContent = pad(years);
    if (counterMonthsEl) counterMonthsEl.textContent = pad(months);
    if (counterDaysEl) counterDaysEl.textContent = pad(days);
    if (counterHoursEl) counterHoursEl.textContent = pad(hours);
  }

  updateWorkCounter();
  var counterInterval = setInterval(updateWorkCounter, 1000);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearInterval(counterInterval);
    } else {
      updateWorkCounter();
      counterInterval = setInterval(updateWorkCounter, 1000);
    }
  });
  var contactBar = document.getElementById("contactBar");
  var aboutSection = document.getElementById("aboutSection");
  var goitSection = document.getElementById("goitContainer");
  var scrollTicking = false;
  var hideContactBarForGoit = false;

  function updateContactBarVisibility() {
    if (!contactBar || !aboutSection) return;
    var aboutTop = aboutSection.getBoundingClientRect().top;
    var shouldShowByScroll = aboutTop <= 80;
    var shouldShow = shouldShowByScroll && !hideContactBarForGoit;
    contactBar.classList.toggle("visible", shouldShow);
  }

  if (goitSection && "IntersectionObserver" in window) {
    var goitObserver = new IntersectionObserver(
      function (entries) {
        var entry = entries[0];
        var goitIsDeepInView =
          !!entry && entry.boundingClientRect.top <= window.innerHeight * 0.35;
        hideContactBarForGoit = !!(
          entry &&
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.6 &&
          goitIsDeepInView
        );
        updateContactBarVisibility();
      },
      {
        root: null,
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
        rootMargin: "0px 0px -20% 0px",
      },
    );

    goitObserver.observe(goitSection);
  }

  window.addEventListener("scroll", function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      updateContactBarVisibility();
      scrollTicking = false;
    });
  });

  updateContactBarVisibility();
  var observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);
  document.querySelectorAll(".section").forEach(function (section) {
    observer.observe(section);
  });
  document.getElementById("dlCvBtn").addEventListener("click", function () {
    var btn = this;
    if (btn.classList.contains("downloading") || btn.classList.contains("done"))
      return;
    btn.classList.add("downloading");
    setTimeout(function () {
      btn.classList.remove("downloading");
      btn.classList.add("done");
      if (isMobile()) {
        var link = document.createElement("a");
        link.href = "Files/CV_Oleksandr_Prudskyi.pdf?v=2";
        link.download = "Files/CV_Oleksandr_Prudskyi.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open("Files/CV_Oleksandr_Prudskyi.pdf?v=2", "_blank");
      }
      setTimeout(function () {
        btn.classList.remove("done");
      }, 2500);
    }, 700);
  });
  var socialBtn = document.getElementById("socialBtn");
  var socialPanel = document.getElementById("socialPanel");

  if (socialBtn) {
    socialBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      socialPanel.classList.toggle("open");
    });
  }

  document.addEventListener("click", function (e) {
    var wrapper = document.querySelector(".social-box");
    if (socialPanel && wrapper && !wrapper.contains(e.target)) {
      socialPanel.classList.remove("open");
    }
  });
  var telegramLink = document.querySelector(".telegram-link");
  if (telegramLink) {
    telegramLink.addEventListener("click", function (e) {
      if (isMobile()) {
        e.preventDefault();
        window.location.href = "tg://resolve?domain=PrO_Libra";
      }
    });
  }
  var photoModal = document.getElementById("photoModal");
  var avatarBtn = document.getElementById("avatarPlaceholder");
  var modalCloseBtn = document.querySelector(".photo-modal-close");

  var previousFocus = null;

  function openPhotoModal() {
    previousFocus = document.activeElement;
    photoModal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closePhotoModal() {
    photoModal.classList.remove("open");
    document.body.style.overflow = "";
    if (previousFocus) previousFocus.focus();
  }

  if (avatarBtn) avatarBtn.addEventListener("click", openPhotoModal);
  if (photoModal) photoModal.addEventListener("click", closePhotoModal);
  if (modalCloseBtn)
    modalCloseBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closePhotoModal();
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePhotoModal();
    if (e.key === "Tab" && photoModal.classList.contains("open")) {
      e.preventDefault();
      if (modalCloseBtn) modalCloseBtn.focus();
    }
  });
}
console.log(
  "[main.js] Module loaded, document.readyState:",
  document.readyState,
);

function safeInitialize() {
  if (window.__appInitialized) {
    console.log("[main.js] App already initialized, skipping");
    return;
  }

  window.__appInitialized = true;
  console.log("[main.js] Initializing app");
  if (!document.getElementById("socialBtn")) {
    console.log("[main.js] socialBtn not found, waiting for DOM");
    return;
  }

  initializeApp();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeInitialize);
} else {
  safeInitialize();
}
window.initializeApp = initializeApp;
