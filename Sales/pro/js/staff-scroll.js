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
} from "../assets/js/staff-scroll-utils.js";

const staffSearchEl = document.getElementById("staff-search");
const clearSearchBtn = document.getElementById("clear-search-btn");
const cityCheckboxList = document.getElementById("city-checkbox-list");
const datePickerEl = document.getElementById("date-picker");

const staffLabelsContainer = document.getElementById("staff-labels-container");
const timelineScrollContainer = document.getElementById("timeline-scroll-container");
const timelineHeaderContainer = document.getElementById("timeline-header-container");
const timelineRowsContainer = document.getElementById("timeline-rows-container");

let currentStaff = [];
let selectedCities = [];
let currentSearchQuery = "";

let modifiedEvents = [];

function setupScrollSync() {
  staffLabelsContainer.addEventListener("scroll", () => {
    timelineScrollContainer.scrollTop = staffLabelsContainer.scrollTop;
  });

  timelineScrollContainer.addEventListener("scroll", () => {
    staffLabelsContainer.scrollTop = timelineScrollContainer.scrollTop;
    timelineHeaderContainer.scrollLeft = timelineScrollContainer.scrollLeft;
  });

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
    const savedScrollTop = timelineScrollContainer.scrollTop;
    const savedScrollLeft = timelineScrollContainer.scrollLeft;

    const staff = await fetchStaffData(selectedDate);
    currentStaff = staff;
    setStaffData(staff);

    updateHourWidthCSS();
    renderHours();
    renderVerticalGridLines();
    renderStaffLabels(staff);
    renderTimelineRows(staff);
    updateCurrentTimeLine();

    filterStaff(currentSearchQuery, selectedCities);

    timelineScrollContainer.scrollTop = savedScrollTop;
    timelineScrollContainer.scrollLeft = savedScrollLeft;
    staffLabelsContainer.scrollTop = savedScrollTop;
    timelineHeaderContainer.scrollLeft = savedScrollLeft;

    modifiedEvents = [];
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
    const savedScrollTop = timelineScrollContainer.scrollTop;
    const savedScrollLeft = timelineScrollContainer.scrollLeft;

    await fetchAndRenderStaff(datePickerEl.value);

    timelineScrollContainer.scrollTop = savedScrollTop;
    timelineScrollContainer.scrollLeft = savedScrollLeft;
    staffLabelsContainer.scrollTop = savedScrollTop;
    timelineHeaderContainer.scrollLeft = savedScrollLeft;
  }, intervalMs);
}

// Helper wrapper to safely call initZoomAndThemeListeners
function initZoom() {
  try {
    // Assuming initZoomAndThemeListeners sets up zoom UI controls and takes a callback when zoom changes
    initZoomAndThemeListeners(() => {
      filterStaff(currentSearchQuery, selectedCities);
      updateHourWidthCSS();    // Might need to update CSS widths on zoom change
      renderHours();
      renderVerticalGridLines();
      renderTimelineRows(currentStaff);
      updateCurrentTimeLine();
    });
  } catch (e) {
    console.error("Failed to initialize zoom and theme listeners:", e);
  }
}

// Save Changes button (unchanged)
const saveChangesBtn = document.createElement("button");
saveChangesBtn.id = "save-changes-btn";
saveChangesBtn.textContent = "Save Changes";
saveChangesBtn.style.margin = "10px";
saveChangesBtn.style.padding = "8px 12px";
saveChangesBtn.style.fontSize = "14px";
document.body.insertBefore(saveChangesBtn, document.body.firstChild);

saveChangesBtn.addEventListener("click", async () => {
  if (modifiedEvents.length === 0) {
    alert("No changes to save.");
    return;
  }

  try {
    const response = await fetch("update_events.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ updates: modifiedEvents })
    });
    const result = await response.json();

    if (result.success) {
      alert("Changes saved successfully.");
      modifiedEvents = [];
      await fetchAndRenderStaff(datePickerEl.value);
    } else {
      alert("Failed to save changes: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    alert("Error saving changes: " + err.message);
  }
});

function trackModifiedEvent(event) {
  const index = modifiedEvents.findIndex(e =>
    e.userId === event.userId &&
    e.original_staff_uniqueId === event.original_staff_uniqueId &&
    e.original_start_time === event.original_start_time
  );

  if (index >= 0) {
    modifiedEvents[index] = event;
  } else {
    modifiedEvents.push(event);
  }
}

function onEventChanged(updatedEvent) {
  trackModifiedEvent(updatedEvent);
  updateCurrentStaffEvent(updatedEvent);
}

function updateCurrentStaffEvent(detail) {
  for (const staff of currentStaff) {
    if (staff.staff_uniqueId === detail.original_staff_uniqueId) {
      const eventIndex = staff.events.findIndex(event =>
        event.userId === detail.userId && event.start_time === detail.original_start_time
      );
      if (eventIndex !== -1) {
        if (detail.staff_uniqueId !== detail.original_staff_uniqueId) {
          staff.events.splice(eventIndex, 1);

          const newStaff = currentStaff.find(s => s.staff_uniqueId === detail.staff_uniqueId);
          if (newStaff) {
            const updatedEvent = {
              userId: detail.userId,
              start_time: detail.start_time,
              end_time: detail.end_time,
            };
            newStaff.events.push(updatedEvent);
          }
        } else {
          staff.events[eventIndex].start_time = detail.start_time;
          staff.events[eventIndex].end_time = detail.end_time;
        }
        break;
      }
    }
  }
}

function setupEventChangeListeners() {
  timelineRowsContainer.addEventListener("eventDragEnd", (e) => {
    const d = e.detail;
    onEventChanged({
      userId: d.userId,
      staff_uniqueId: d.newStaffId,
      start_time: d.newStartTime,
      end_time: d.newEndTime,
      original_staff_uniqueId: d.originalStaffId,
      original_start_time: d.originalStartTime,
    });
  });

  timelineRowsContainer.addEventListener("eventResizeEnd", (e) => {
    const d = e.detail;
    onEventChanged({
      userId: d.userId,
      staff_uniqueId: d.staffId,
      start_time: d.newStartTime,
      end_time: d.newEndTime,
      original_staff_uniqueId: d.staffId,
      original_start_time: d.originalStartTime,
    });
  });
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

// Main init function
async function initApp() {
  await fetchAndRenderStaff();
  await fetchAndRenderCities();
  setupSearch();
  setupDatePicker();
  setupScrollSync();
  startAutoRefresh(5000);
  setupEventChangeListeners();

  safeInitZoomAndThemeListeners(() => filterStaff(currentSearchQuery, selectedCities));
}

// Run the app
initApp();
