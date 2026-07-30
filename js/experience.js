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
      });
    });
  }

  function selectCard(index) {
    document.querySelectorAll(".work-tab").forEach(function (tab) {
      tab.classList.toggle("active", parseInt(tab.dataset.index) === index);
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
