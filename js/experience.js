(function () {
  "use strict";

  function toggleDetails(card) {
    var details = card.querySelector(".work-details");
    var isExpanded = card.classList.contains("expanded");

    if (isExpanded) {
      details.style.maxHeight = "0px";
      details.style.opacity = "0";
      card.classList.remove("expanded");
    } else {
      card.classList.add("expanded");
      details.style.maxHeight = details.scrollHeight + "px";
      details.style.opacity = "1";
    }
  }

  function init() {
    bindTabClicks();
    bindGlowTracking();
    bindCardClicks();
  }

  function bindTabClicks() {
    var tabs = document.querySelectorAll(".work-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        selectCard(parseInt(tab.dataset.index));
      });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectCard(parseInt(tab.dataset.index));
          return;
        }
        var tabsArr = Array.from(tabs);
        var currentIdx = tabsArr.indexOf(tab);
        var nextIdx = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          nextIdx = (currentIdx + 1) % tabsArr.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          nextIdx = (currentIdx - 1 + tabsArr.length) % tabsArr.length;
        }
        if (nextIdx >= 0) {
          e.preventDefault();
          var nextTab = tabsArr[nextIdx];
          nextTab.focus();
          selectCard(parseInt(nextTab.dataset.index));
        }
      });
    });
  }

  function selectCard(index) {
    document.querySelectorAll(".work-tab").forEach(function (tab) {
      var isActive = parseInt(tab.dataset.index) === index;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    document.querySelectorAll(".card-work").forEach(function (card) {
      var isTarget = parseInt(card.dataset.index) === index;

      if (isTarget) {
        card.classList.add("visible");
      } else {
        card.classList.remove("visible");
        card.classList.remove("expanded");
        var details = card.querySelector(".work-details");
        if (details) {
          details.style.maxHeight = "0px";
          details.style.opacity = "0";
        }
      }
    });
  }

  function bindCardClicks() {
    var container = document.querySelector(".work-card-container");
    if (!container) return;

    document.querySelectorAll(".card-work").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-expanded", String(card.classList.contains("expanded")));

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDetails(card);
          card.setAttribute("aria-expanded", String(card.classList.contains("expanded")));
        }
      });
    });

    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-show-more");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        var card = btn.closest(".card-work");
        toggleDetails(card);
        if (card) {
          card.setAttribute("aria-expanded", String(card.classList.contains("expanded")));
        }
        return;
      }

      var card = e.target.closest(".card-work");
      if (card) {
        toggleDetails(card);
        card.setAttribute("aria-expanded", String(card.classList.contains("expanded")));
      }
    });
  }

  function bindGlowTracking() {
    var ticking = false;
    document.addEventListener("mousemove", function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var tabs = document.querySelectorAll(".work-tab");
        tabs.forEach(function (tab) {
          var rect = tab.getBoundingClientRect();
          tab.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
          tab.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
        });
        ticking = false;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
