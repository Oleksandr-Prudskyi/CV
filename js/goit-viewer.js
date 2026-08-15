function initializeGoitViewer() {
  var items = window.GOIT_ITEMS || [];
  var list = document.getElementById("goitSiteList");
  var frame = document.getElementById("goitSiteFrame");
  var viewport = document.getElementById("goitViewport");
  var linkBtn = document.getElementById("goitLinkBtn");
  var deviceBar = document.getElementById("goitDeviceBar");
  var radios = deviceBar
    ? deviceBar.querySelectorAll('input[type="radio"]')
    : [];

  var current = -1;
  var deviceWidth = 1440;
  var goitToggle = document.getElementById("goitToggle");
  var infoBox = document.getElementById("goitInfoBox");
  var listCollapse = document.getElementById("goitListCollapse");
  var mobileCardsRoot = null;
  var inlineDetails = null;
  var mobileDetailsVisible = true;
  var mobileExpandedIndexes = new Set();
  var mobileDetailNodes = new Map();

  function buildInlineDetailsHTML(item, index) {
    var linkHtml = item.href
      ? '<span class="goit-mobile-card-link">' +
        '<svg class="goit-link-icon"><use href="/preview/goit-icons.svg#icon-link"></use></svg>' +
        "Link</span>"
      : "";

    var cardTagOpen = item.href
      ? '<a href="' +
        item.href +
        '" target="_blank" rel="noopener" class="goit-mobile-card goit-mobile-card--' +
        (item.cardClass || "") +
        ' is-active" data-index="' +
        index +
        '">'
      : '<div class="goit-mobile-card goit-mobile-card--' +
        (item.cardClass || "") +
        ' is-active" data-index="' +
        index +
        '">';
    var cardTagClose = item.href ? "</a>" : "</div>";

    return (
      '<div class="goit-info-box goit-info-box--inline">' +
      (item.desc || "") +
      "</div>" +
      cardTagOpen +
      '<span class="goit-mobile-card-logo">' +
      (item.icon || "") +
      "</span>" +
      linkHtml +
      cardTagClose
    );
  }

  function animateDetailOpen(detail, targetBtn, item, index) {
    if (!detail || !targetBtn) return;

    detail.innerHTML = buildInlineDetailsHTML(item, index);
    detail.dataset.ownerIndex = String(index);

    if (
      detail.parentNode !== targetBtn.parentNode ||
      detail.previousElementSibling !== targetBtn
    ) {
      targetBtn.insertAdjacentElement("afterend", detail);
    }

    detail.classList.add("is-open");
    detail.style.height = "0px";
    detail.style.opacity = "0";
    detail.style.transform = "translateY(-8px)";

    requestAnimationFrame(function () {
      var height = detail.scrollHeight;
      detail.style.height = height + "px";
      detail.style.opacity = "1";
      detail.style.transform = "translateY(0)";
    });

    var onEndOpen = function (e) {
      if (e.propertyName !== "height") return;
      detail.removeEventListener("transitionend", onEndOpen);
      if (detail.classList.contains("is-open")) {
        detail.style.height = "auto";
      }
    };
    detail.removeEventListener("transitionend", onEndOpen);
    detail.addEventListener("transitionend", onEndOpen);
  }

  function animateDetailClose(detail, done) {
    if (!detail || !detail.parentNode) {
      if (done) done();
      return;
    }

    detail.style.height = detail.scrollHeight + "px";
    detail.classList.remove("is-open");

    requestAnimationFrame(function () {
      detail.style.height = "0px";
      detail.style.opacity = "0";
      detail.style.transform = "translateY(-8px)";
    });

    var onEndClose = function (e) {
      if (e.propertyName !== "height") return;
      detail.removeEventListener("transitionend", onEndClose);
      if (!detail.classList.contains("is-open") && detail.parentNode) {
        detail.parentNode.removeChild(detail);
      }
      if (done) done();
    };
    detail.removeEventListener("transitionend", onEndClose);
    detail.addEventListener("transitionend", onEndClose);
  }

  function animateInlineOpen(targetBtn, item, index) {
    animateDetailOpen(inlineDetails, targetBtn, item, index);
  }

  function animateInlineClose(done) {
    animateDetailClose(inlineDetails, done);
  }

  function openMobileDetail(button, item, index) {
    if (!button) return null;

    var detail = mobileDetailNodes.get(index);
    if (!detail) {
      detail = document.createElement("div");
      detail.className = "goit-inline-details";
      mobileDetailNodes.set(index, detail);
    }

    if (
      detail.classList.contains("is-open") &&
      detail.dataset.ownerIndex === String(index)
    ) {
      return detail;
    }

    animateDetailOpen(detail, button, item, index);
    return detail;
  }

  function closeMobileDetail(detail, onClosed) {
    animateDetailClose(detail, onClosed);
  }

  function isMobileLayout() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function updateMobileDetailsVisibility() {
    var mobile = isMobileLayout();
    var shouldHide = mobile && !mobileDetailsVisible;

    if (mobile) {
      if (infoBox) infoBox.style.display = "none";
      if (mobileCardsRoot) mobileCardsRoot.style.display = "none";
    }

    if (!mobile && infoBox) {
      if (current >= 0 && items[current] && items[current].desc) {
        infoBox.style.display = "";
      } else {
        infoBox.style.display = "none";
      }
    }

    if (!mobile && mobileCardsRoot) {
      mobileCardsRoot.style.display = "";
    }

    if (!list) return;

    var buttons = list.querySelectorAll(".list-item");

    if (mobile) {
      for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var detail = mobileDetailNodes.get(i);
        var item = items[i] || {};
        var shouldExpand = mobileExpandedIndexes.has(i);

        button.classList.toggle("is-expanded", shouldExpand);
        button.setAttribute("aria-pressed", String(shouldExpand));

        if (shouldExpand) {
          openMobileDetail(button, item, i);
        } else if (detail) {
          closeMobileDetail(detail, function () {
            if (mobileDetailNodes.get(i) === detail) {
              mobileDetailNodes.delete(i);
            }
          });
        }
      }
      return;
    }

    for (var i = 0; i < buttons.length; i++) {
      var expanded = i === current && (!mobile || mobileDetailsVisible);
      buttons[i].classList.toggle("is-expanded", expanded);
      buttons[i].setAttribute("aria-pressed", String(expanded));
    }

    if (inlineDetails) {
      if (current >= 0 && !shouldHide) {
        var targetBtn = buttons[current];
        if (targetBtn) {
          var item = items[current] || {};
          var ownerIndex = inlineDetails.dataset.ownerIndex;
          var shouldMove = ownerIndex !== String(current);

          if (inlineDetails.parentNode && shouldMove) {
            animateInlineClose(function () {
              animateInlineOpen(targetBtn, item, current);
            });
          } else if (!inlineDetails.parentNode) {
            animateInlineOpen(targetBtn, item, current);
          } else {
            animateInlineOpen(targetBtn, item, current);
          }
        }
      } else {
        animateInlineClose();
      }
    }
  }
  if (goitToggle && listCollapse) {
    goitToggle.addEventListener("click", function () {
      var open = this.classList.toggle("is-open");
      this.setAttribute("aria-expanded", String(open));
      if (open) {
        listCollapse.style.height = "auto";
        var h = listCollapse.scrollHeight;
        listCollapse.style.height = "0px";
        listCollapse.offsetHeight;
        listCollapse.style.height = h + "px";
      } else {
        listCollapse.style.height = listCollapse.scrollHeight + "px";
        listCollapse.offsetHeight;
        listCollapse.style.height = "0px";
      }
    });

    listCollapse.addEventListener("transitionend", function () {
      if (goitToggle.classList.contains("is-open")) {
        listCollapse.style.height = "auto";
      }
    });
  }
  function layout() {
    if (!viewport) return;
    var box = viewport.getBoundingClientRect();
    if (!box.width || !box.height) return;
    var safeDeviceWidth = Math.max(1, deviceWidth || 1440);
    var scale = Math.min(1, box.width / safeDeviceWidth);
    frame.style.width = safeDeviceWidth + "px";
    frame.style.height = box.height / scale + "px";
    frame.style.transform = "scale(" + scale + ")";
    frame.style.left =
      Math.max(0, (box.width - safeDeviceWidth * scale) / 2) + "px";
  }

  function setDeviceByWidth(width) {
    deviceWidth = width;
    if (!deviceBar) return;
    var target = deviceBar.querySelector('input[data-width="' + width + '"]');
    if (target) {
      target.checked = true;
    }
    layout();
  }
  function loadFrame(item) {
    if (!frame) return;
    frame.classList.remove("is-ready");
    if (item && item.src) {
      frame.removeAttribute("srcdoc");
      frame.src =
        item.src + (item.src.indexOf("?") < 0 ? "?" : "&") + "v=" + Date.now();
    } else {
      frame.removeAttribute("src");
      frame.srcdoc = placeholder(item ? item.title : "Project preview");
      frame.classList.add("is-ready");
    }
  }
  function select(index, forceShow) {
    if (isMobileLayout()) {
      var item = items[index];
      current = index;

      if (typeof forceShow === "boolean" && forceShow) {
        mobileExpandedIndexes.add(index);
      } else {
        if (mobileExpandedIndexes.has(index)) {
          mobileExpandedIndexes.delete(index);
        } else {
          mobileExpandedIndexes.add(index);
        }
      }

      if (item && typeof item.deviceWidth === "number") {
        setDeviceByWidth(item.deviceWidth);
      }

      loadFrame(item);
      if (linkBtn) linkBtn.href = item.href || "#";
      if (infoBox) {
        infoBox.innerHTML = item.desc || "";
      }
      if (list) {
        var buttons = list.querySelectorAll(".list-item");
        for (var i = 0; i < buttons.length; i++) {
          var expanded = mobileExpandedIndexes.has(i);
          buttons[i].classList.toggle("is-active", expanded);
          buttons[i].classList.toggle("is-expanded", expanded);
          buttons[i].setAttribute("aria-pressed", String(expanded));
        }
      }

      layout();
      updateMobileDetailsVisibility();
      return;
    }

    var sameIndex = current === index;
    if (sameIndex) return;
    current = index;
    var item = items[index];

    if (item && typeof item.deviceWidth === "number") {
      setDeviceByWidth(item.deviceWidth);
    }

    loadFrame(item);
    if (linkBtn) linkBtn.href = item.href || "#";
    if (infoBox) {
      infoBox.innerHTML = item.desc || "";
    }
    if (list) {
      var buttons = list.querySelectorAll(".list-item");
      for (var i = 0; i < buttons.length; i++) {
        if (i === index) {
          buttons[i].classList.add("is-active");
          buttons[i].setAttribute("aria-pressed", "true");
        } else {
          buttons[i].classList.remove("is-active");
          buttons[i].setAttribute("aria-pressed", "false");
        }
      }
    }
    var cards = document.querySelectorAll(".goit-mobile-card");
    for (var c = 0; c < cards.length; c++) {
      if (parseInt(cards[c].dataset.index, 10) === index) {
        cards[c].classList.add("is-active");
      } else {
        cards[c].classList.remove("is-active");
      }
    }

    layout();
    updateMobileDetailsVisibility();
  }
  if (list && items.length) {
    inlineDetails = document.createElement("div");
    inlineDetails.className = "goit-inline-details";

    items.forEach(function (item, i) {
      var btn = document.createElement("button");
      btn.className = "list-item goit-list-item";
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML =
        '<span class="arrow">' +
        '<span class="arrow-body"></span>' +
        '<span class="arrow-top"></span>' +
        '<span class="arrow-bot"></span>' +
        "</span>" +
        '<span class="item-number">' +
        (i + 1) +
        ".</span>" +
        '<span class="item-title">' +
        item.title +
        "</span>";

      btn.addEventListener("focus", function () {
        if (isMobileLayout()) return;
        select(i);
      });
      btn.addEventListener("click", function () {
        if (isMobileLayout()) {
          select(i);
          return;
        }
        select(i);
      });

      list.appendChild(btn);
    });
  }
  if (items.length) {
    var mobileCards = document.createElement("div");
    mobileCards.className = "goit-mobile-cards";
    items.forEach(function (item, i) {
      if (!item.icon) return;
      var card;
      if (item.href) {
        card = document.createElement("a");
        card.href = item.href;
        card.target = "_blank";
        card.rel = "noopener";
      } else {
        card = document.createElement("div");
      }
      card.className =
        "goit-mobile-card" +
        (item.cardClass ? " goit-mobile-card--" + item.cardClass : "");
      card.dataset.index = i;
      var linkHtml = item.href
        ? '<span class="goit-mobile-card-link">' +
          '<svg class="goit-link-icon"><use href="/preview/goit-icons.svg#icon-link"></use></svg>' +
          "Link</span>"
        : "";
      card.innerHTML =
        '<span class="goit-mobile-card-logo">' +
        (item.icon || "") +
        "</span>" +
        linkHtml;
      mobileCards.appendChild(card);
    });
    var sidebar = document.querySelector(".goit-sidebar");
    if (sidebar) sidebar.appendChild(mobileCards);
    mobileCardsRoot = mobileCards;
  }
  for (var r = 0; r < radios.length; r++) {
    radios[r].addEventListener("change", function () {
      deviceWidth = parseInt(this.dataset.width, 10);
      layout();
    });
  }

  if (items.length > 0 && typeof items[0].deviceWidth === "number") {
    setDeviceByWidth(items[0].deviceWidth);
  }
  if (frame) {
    frame.addEventListener("load", function () {
      frame.classList.add("is-ready");
    });
  }
  window.addEventListener("resize", function () {
    if (!isMobileLayout()) {
      mobileDetailsVisible = true;
    }
    updateMobileDetailsVisibility();
    requestAnimationFrame(layout);
  });
  if (items.length > 0) {
    if (isMobileLayout()) {
      mobileDetailsVisible = false;
    }
    select(0, !isMobileLayout());
    updateMobileDetailsVisibility();
  }
}
function placeholder(title) {
  return (
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    "<style>*{margin:0;padding:0;box-sizing:border-box}" +
    "body{background:#f8f8ff;color:#4f42b5;font-family:Georgia,serif;" +
    "display:flex;flex-direction:column;justify-content:center;align-items:center;" +
    "min-height:100vh;text-align:center;gap:12px}" +
    "h1{font-size:44px;line-height:1.2;color:#2a1b5d;letter-spacing:.4px}" +
    "p{font-size:24px;line-height:1.35;font-weight:600}" +
    ".dot{width:6px;height:6px;border-radius:50%;background:#d4af37;" +
    "animation:pulse 1.4s ease-in-out infinite}" +
    ".dots{display:flex;gap:6px}" +
    ".dot:nth-child(2){animation-delay:.2s}" +
    ".dot:nth-child(3){animation-delay:.4s}" +
    "@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}" +
    "50%{opacity:1;transform:scale(1.2)}}" +
    "</style></head><body>" +
    "<h1>" +
    title +
    "</h1>" +
    '<div class="dots"><span class="dot"></span>' +
    '<span class="dot"></span><span class="dot"></span></div>' +
    "<p>Coming soon</p></body></html>"
  );
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGoitViewer);
} else {
  initializeGoitViewer();
}
