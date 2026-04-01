// ==========================================
// Copy email
// ==========================================
function copyEmail() {
  const email = "oleksandr.prudskyi@gmail.com";
  navigator.clipboard
    .writeText(email)
    .then(() => {
      document.querySelectorAll(".copy-btn, .copy-btn-hero").forEach((btn) => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Zkopírováno!';
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove("copied");
        }, 2000);
      });
    })
    .catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Email zkopírován: " + email);
    });
}

// ==========================================
// Toggle expandable work details
// ==========================================
function toggleDetails(card) {
  const details = card.querySelector(".exp-details");
  const isExpanded = card.classList.contains("expanded");

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

// ==========================================
// Digital Work Counter (from 16.08.2021)
// Uses Europe/Prague timezone
// ==========================================
const counterYearsEl = document.getElementById("counterYears");
const counterMonthsEl = document.getElementById("counterMonths");
const counterDaysEl = document.getElementById("counterDays");
const counterHoursEl = document.getElementById("counterHours");
function updateWorkCounter() {
  const startYear = 2021,
    startMonth = 7,
    startDay = 16;

  const nowStr = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Prague",
  });
  const now = new Date(nowStr);

  let years = now.getFullYear() - startYear;
  let months = now.getMonth() - startMonth;
  let days = now.getDate() - startDay;
  let hours = now.getHours();

  if (hours < 0) {
    days--;
    hours += 24;
  }
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
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

  const pad = (n) => (n < 10 ? "0" + n : String(n));

  if (counterYearsEl) counterYearsEl.textContent = pad(years);
  if (counterMonthsEl) counterMonthsEl.textContent = pad(months);
  if (counterDaysEl) counterDaysEl.textContent = pad(days);
  if (counterHoursEl) counterHoursEl.textContent = pad(hours);
}

updateWorkCounter();
setInterval(updateWorkCounter, 1000);

// ==========================================
// Scroll behavior: contact bar & indicator
// ==========================================
window.addEventListener("scroll", () => {
  const contactBar = document.getElementById("contactBar");
  const scrollIndicator = document.getElementById("scrollIndicator");
  const aboutSection = document.getElementById("aboutSection");

  const aboutTop = aboutSection.getBoundingClientRect().top;

  if (aboutTop <= 80) {
    contactBar.classList.add("visible");
    scrollIndicator.classList.remove("visible");
  } else {
    contactBar.classList.remove("visible");
    scrollIndicator.classList.add("visible");
  }
});

// ==========================================
// Intersection Observer for scroll animations
// ==========================================
// Intersection Observer for scroll animations
// ==========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);
document.querySelectorAll(".section").forEach((section) => {
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
    // Перевіряємо, чи це мобільний пристрій (за User-Agent або шириною екрана)
    var isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth <= 768;
    if (isMobile) {
      // Для мобільних: примусове скачування файлу
      var link = document.createElement("a");
      link.href = "CV_Oleksandr_Prudskyi.pdf?v=2";
      link.download = "CV_Oleksandr_Prudskyi.pdf"; // Цей атрибут дає команду "скачати"
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Для комп'ютерів: відкриття у новій вкладці
      window.open("CV_Oleksandr_Prudskyi.pdf?v=2", "_blank");
    }
    setTimeout(function () {
      btn.classList.remove("done");
    }, 2500);
  }, 700);
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
