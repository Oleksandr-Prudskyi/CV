// SVG Sprite Loader
fetch("./logo/logos-sprite.svg")
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

// Copy email
function copyEmail() {
  var email = "oleksandr.prudskyi@gmail.com";
  navigator.clipboard
    .writeText(email)
    .then(function () {
      document
        .querySelectorAll(".copy-btn, .copy-btn-hero")
        .forEach(function (btn) {
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

// Toggle expandable work details
function toggleDetails(card) {
  var details = card.querySelector(".exp-details");
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

// Digital Work Counter (from 16.08.2021, Europe/Prague timezone)
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
setInterval(updateWorkCounter, 1000);

// Scroll behavior: contact bar
window.addEventListener("scroll", function () {
  var contactBar = document.getElementById("contactBar");
  var aboutSection = document.getElementById("aboutSection");
  var aboutTop = aboutSection.getBoundingClientRect().top;

  if (aboutTop <= 80) {
    contactBar.classList.add("visible");
  } else {
    contactBar.classList.remove("visible");
  }
});

// Intersection Observer for scroll animations
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

// Download CV Button
document.getElementById("dlCvBtn").addEventListener("click", function () {
  var btn = this;
  if (btn.classList.contains("downloading") || btn.classList.contains("done"))
    return;
  btn.classList.add("downloading");
  setTimeout(function () {
    btn.classList.remove("downloading");
    btn.classList.add("done");
    var isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth <= 768;
    if (isMobile) {
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

// Social Panel Toggle
function toggleSocialPanel(e) {
  if (e) e.stopPropagation();
  document.getElementById("socialPanel").classList.toggle("open");
}
document.addEventListener("click", function (e) {
  var panel = document.getElementById("socialPanel");
  var wrapper = document.querySelector(".social-wrapper");
  if (panel && wrapper && !wrapper.contains(e.target)) {
    panel.classList.remove("open");
  }
});

// Telegram: mobile opens app, desktop opens new tab
document.querySelector(".telegram-link").addEventListener("click", function (e) {
  var isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth <= 768;
  if (isMobile) {
    e.preventDefault();
    window.location.href = "tg://resolve?domain=PrO_Libra";
  }
});

// Photo Lightbox
function openPhotoModal() {
  document.getElementById("photoModal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closePhotoModal() {
  document.getElementById("photoModal").classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closePhotoModal();
});
