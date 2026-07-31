(function () {
  "use strict";

  function init() {
    bindTabClicks();
    bindGlowTracking();
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
        }
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          var next = tab.nextElementSibling || tabs[0];
          next.focus();
        }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          var prev = tab.previousElementSibling || tabs[tabs.length - 1];
          prev.focus();
        }
      });
    });
  }

  function selectCard(index) {
    document.querySelectorAll(".work-tab").forEach(function (tab) {
      var isActive = parseInt(tab.dataset.index) === index;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    document.querySelectorAll(".work-card").forEach(function (card) {
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

  function bindGlowTracking() {
    document.addEventListener("mousemove", function (e) {
      var tabs = document.querySelectorAll(".work-tab");
      tabs.forEach(function (tab) {
        var rect = tab.getBoundingClientRect();
        tab.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
        tab.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

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
