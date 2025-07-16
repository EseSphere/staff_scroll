// staff-scroll.js

import {
  setStaffData,
  updateHourWidthCSS,
  renderHours,
  renderVerticalGridLines,
  renderStaffLabels,
  renderTimelineRows,
  updateCurrentTimeLine,
  filterStaff,
  initZoomAndThemeListeners,
  loadAllowedDomains,
  isValidDomain,
} from "../assets/js/staff-scroll-utils.js";

const staffSearchEl = document.getElementById("staff-search");
const clearSearchBtn = document.getElementById("clear-search-btn");
const cityCheckboxList = document.getElementById("city-checkbox-list");
const datePickerEl = document.getElementById("date-picker");

// Elements for syncing scroll
const staffLabelsContainer = document.getElementById("staff-labels-container");
const timelineScrollContainer = document.getElementById("timeline-scroll-container");
const timelineHeaderContainer = document.getElementById("timeline-header-container");

let currentStaff = [];
let selectedCities = [];
let currentSearchQuery = "";

const domain = window.location.hostname;

// --- Scroll sync setup ---
function setupScrollSync() {
  // Sync vertical scrolling between staff labels and timeline rows
  staffLabelsContainer.addEventListener("scroll", () => {
    timelineScrollContainer.scrollTop = staffLabelsContainer.scrollTop;
  });

  timelineScrollContainer.addEventListener("scroll", () => {
    staffLabelsContainer.scrollTop = timelineScrollContainer.scrollTop;
    // Sync horizontal scroll with timeline header
    timelineHeaderContainer.scrollLeft = timelineScrollContainer.scrollLeft;
  });

  // Sync horizontal scrolling from header to timeline rows
  timelineHeaderContainer.addEventListener("scroll", () => {
    timelineScrollContainer.scrollLeft = timelineHeaderContainer.scrollLeft;
  });
}

async function fetchStaffData(selectedDate) {
  const dateParam = selectedDate ? `?date=${selectedDate}` : "";
  const response = await fetch("getStaffWithEvents.php" + dateParam);
  if (!response.ok) throw new Error("Network response was not ok");
  const staff = await response.json();
  return staff;
}

async function fetchAndRenderStaff(selectedDate) {
  try {
    // Save scroll positions before fetching
    const savedScrollTop = timelineScrollContainer.scrollTop;
    const savedScrollLeft = timelineScrollContainer.scrollLeft;

    const staff = await fetchStaffData(selectedDate);
    currentStaff = staff;
    setStaffData(staff);

    // Update UI components after data update
    updateHourWidthCSS();
    renderHours();
    renderVerticalGridLines();
    renderStaffLabels(staff);
    renderTimelineRows(staff);
    updateCurrentTimeLine();

    filterStaff(currentSearchQuery, selectedCities);

    // Restore scroll positions after rendering
    timelineScrollContainer.scrollTop = savedScrollTop;
    timelineScrollContainer.scrollLeft = savedScrollLeft;
    staffLabelsContainer.scrollTop = savedScrollTop;
    timelineHeaderContainer.scrollLeft = savedScrollLeft;
  } catch (err) {
    console.error("Failed to load data:", err);
    alert("Error loading staff and event data.");
  }
}

async function fetchAndRenderCities() {
  try {
    const response = await fetch("getcities.php");
    if (!response.ok) throw new Error("Network response was not ok");
    const cities = await response.json();

    cityCheckboxList.innerHTML = "";
    cities.forEach((city) => {
      const label = document.createElement("label");
      label.classList.add("city-checkbox-label");
      label.style.display = "block";
      label.style.cursor = "pointer";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = city;
      checkbox.className = "city-checkbox";

      checkbox.addEventListener("change", () => {
        updateSelectedCities();
        filterStaff(currentSearchQuery, selectedCities);
      });

      const cityText = document.createElement("span");
      cityText.textContent = city;
      cityText.style.marginLeft = "6px";

      label.appendChild(checkbox);
      label.appendChild(cityText);
      cityCheckboxList.appendChild(label);
    });
  } catch (err) {
    console.error("Failed to load cities:", err);
  }
}

function updateSelectedCities() {
  selectedCities = Array.from(
    cityCheckboxList.querySelectorAll("input.city-checkbox:checked")
  ).map((input) => input.value);
}

function setupSearch() {
  staffSearchEl.addEventListener("input", () => {
    currentSearchQuery = staffSearchEl.value;
    filterStaff(currentSearchQuery, selectedCities);
  });

  clearSearchBtn.addEventListener("click", () => {
    staffSearchEl.value = "";
    currentSearchQuery = "";
    filterStaff(currentSearchQuery, selectedCities);
  });
}

function setupDatePicker() {
  datePickerEl.addEventListener("change", async () => {
    const selectedDate = datePickerEl.value;
    await fetchAndRenderStaff(selectedDate);
  });
}

function startAutoRefresh(intervalMs) {
  setInterval(async () => {
    // Save scroll positions before update
    const savedScrollTop = timelineScrollContainer.scrollTop;
    const savedScrollLeft = timelineScrollContainer.scrollLeft;

    await fetchAndRenderStaff(datePickerEl.value);

    // Restore scroll positions after update
    timelineScrollContainer.scrollTop = savedScrollTop;
    timelineScrollContainer.scrollLeft = savedScrollLeft;
    staffLabelsContainer.scrollTop = savedScrollTop;
    timelineHeaderContainer.scrollLeft = savedScrollLeft;
  }, intervalMs);
}

async function checkDomainAndLoadData(domain) {
  // Await loading allowed domains first
  await loadAllowedDomains();

  if (!isValidDomain(domain)) {
    document.body.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:red;font-size:32px;">
        "${domain}" is not authorized.
      </div>
    `;
    return;
  }

  await fetchAndRenderStaff();
  await fetchAndRenderCities();
  setupSearch();
  setupDatePicker();
  initZoomAndThemeListeners(() => filterStaff(currentSearchQuery, selectedCities));
  setupScrollSync();
  startAutoRefresh(5000);
}

const datePrevBtn = document.getElementById("date-prev");
const dateNextBtn = document.getElementById("date-next");

function changeDateByDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function updateDateAndFetch(newDate) {
  datePickerEl.value = newDate;
  await fetchAndRenderStaff(newDate);
}

datePrevBtn.addEventListener("click", async () => {
  const currentDate = datePickerEl.value || new Date().toISOString().slice(0, 10);
  const newDate = changeDateByDays(currentDate, -1);
  await updateDateAndFetch(newDate);
});

dateNextBtn.addEventListener("click", async () => {
  const currentDate = datePickerEl.value || new Date().toISOString().slice(0, 10);
  const newDate = changeDateByDays(currentDate, 1);
  await updateDateAndFetch(newDate);
});

// Start the app
(async () => {
  await checkDomainAndLoadData(domain);
})();
