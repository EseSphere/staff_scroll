document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// END DOMAIN LOCK
// ⚡ TIMELINE
let staff = [];
let filteredStaff = [];

function roundToTwoDecimals(num) {
  return Math.round(num * 100) / 100;
}

const staffLabelsEl = document.getElementById("staff-labels");
const timelineHeaderEl = document.getElementById("timeline-header");
const verticalGridLinesEl = document.getElementById("vertical-grid-lines");
const timelineRowsEl = document.getElementById("timeline-rows");
const currentTimeLineEl = document.getElementById("current-time-line");
const zoomRangeEl = document.getElementById("zoom-range");
const zoomValueEl = document.getElementById("zoom-value");
const themeToggle = document.getElementById("theme-toggle");
const staffSearchEl = document.getElementById("staff-search");
const clearSearchBtn = document.getElementById("clear-search-btn");
const staffLabelsContainer = document.getElementById("staff-labels-container");
const timelineHeaderContainer = document.getElementById("timeline-header-container");
const timelineScrollContainer = document.getElementById("timeline-scroll-container");
const popup = document.getElementById("popup");
const tooltip = document.getElementById("tooltip");

let hourWidth = parseInt(zoomRangeEl.value, 10);
const totalHours = 24;

// ✅ Utility to format decimal hours to HH:MM
function formatDecimalTime(decimal) {
  const totalMinutes = Math.round(decimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function updateHourWidthCSS() {
  document.documentElement.style.setProperty('--hour-width', hourWidth + 'px');
  renderHours();
}

function renderHours() {
  timelineHeaderEl.innerHTML = "";
  for (let i = 0; i < 24; i++) {
    const hourCell = document.createElement("div");
    hourCell.className = "hour-cell";
    hourCell.textContent = i.toString().padStart(2, '0') + ":00";
    timelineHeaderEl.appendChild(hourCell);
  }
}

function renderVerticalGridLines() {
  verticalGridLinesEl.innerHTML = "";
  verticalGridLinesEl.style.gridTemplateColumns = `repeat(${totalHours}, ${hourWidth}px)`;

  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 0; i < totalHours; i++) {
    const gridLine = document.createElement("div");
    gridLine.classList.add("vertical-grid-line");
    if (i === currentHour) {
      gridLine.classList.add("current-hour-line");
    }
    verticalGridLinesEl.appendChild(gridLine);
  }
}

function renderStaffLabels(filteredStaff) {
  const rowHeight = 120;
  staffLabelsEl.innerHTML = "";

  filteredStaff.forEach((member) => {
    const totalHours = member.events.reduce((sum, event) => {
      const duration = event.end - event.start;
      return sum + (duration > 0 ? duration : 0);
    }, 0);

    const container = document.createElement("div");
    container.className = "staff-label";
    container.style.height = `${rowHeight}px`;
    container.style.minHeight = `${rowHeight}px`;
    container.style.boxSizing = "border-box";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";

    const nameEl = document.createElement("div");
    nameEl.className = "staff-name";
    nameEl.textContent = member.name;

    const hoursEl = document.createElement("div");
    hoursEl.className = "staff-hours";
    hoursEl.textContent = `${formatDecimalTime(totalHours)} hrs`;

    container.appendChild(nameEl);
    container.appendChild(hoursEl);
    staffLabelsEl.appendChild(container);
  });
}


function renderTimelineRows(filteredStaff) {
  const rowHeight = 120; // <-- Set your desired row height here
  timelineRowsEl.innerHTML = "";
  const linesContainer = document.createElement("div");
  linesContainer.className = "lines-container";

  const now = new Date();
  const currentTimeDecimal = now.getHours() + now.getMinutes() / 60;

  filteredStaff.forEach((member, rowIndex) => {
    const row = document.createElement("div");
    row.className = "timeline-row";
    row.style.height = `${rowHeight}px`;

    const eventsLayer = document.createElement("div");
    eventsLayer.className = "events-layer";

    const events = member.events
      .filter((event) => event.end > 0 && event.start < totalHours)
      .sort((a, b) => a.start - b.start);

    const eventEls = [];
    const eventLayers = [];

    events.forEach((event) => {
      const roundedStart = Math.round(event.start * 100) / 100;
      const roundedEnd = Math.round(event.end * 100) / 100;

      const leftPx = roundedStart * hourWidth;
      const widthPx = (roundedEnd - roundedStart) * hourWidth;

      const eventEl = document.createElement("div");
      eventEl.className = "event-bar";
      eventEl.textContent = event.title;

      // Determine background color based on description and current time
      const descLower = (event.description || "").toLowerCase();
      let bgColor = member.color; // Default to member color

      const TOLERANCE = 0.0001; // tiny float tolerance to avoid rounding issues

      if (descLower === "completed") {
        bgColor = "#16a085"; // green for completed
      } else if (descLower === "scheduled") {
        if (currentTimeDecimal - roundedEnd > TOLERANCE) {
          // Missed or overdue event (past)
          bgColor = "#c0392b"; // red
        } else if (
          currentTimeDecimal + TOLERANCE >= roundedStart &&
          currentTimeDecimal - TOLERANCE <= roundedEnd
        ) {
          // Ongoing event
          bgColor = "#c0392b"; // red
        } else if (currentTimeDecimal + TOLERANCE < roundedStart) {
          // Future event
          bgColor = "#2c3e50"; // dark blue for future scheduled
        }
      }





      eventEl.style.backgroundColor = bgColor;
      eventEl.style.left = `${leftPx}px`;
      eventEl.style.width = `${widthPx}px`;

      // Determine vertical layer (no overlap)
      let layer = 0;
      while (true) {
        const conflict = eventLayers[layer]?.some(e =>
          !(roundedEnd <= e.start || roundedStart >= e.end)
        );
        if (!conflict) break;
        layer++;
      }

      if (!eventLayers[layer]) eventLayers[layer] = [];
      eventLayers[layer].push({ start: roundedStart, end: roundedEnd });

      eventEl.style.top = `${layer * 32}px`;
      eventEl.style.position = "absolute";

      eventEl.addEventListener("click", (e) => {
        e.stopPropagation();
        showPopup(event, member, eventEl);
      });

      eventEl.addEventListener("mouseenter", (e) => {
        const rect = eventEl.getBoundingClientRect();
        tooltip.style.opacity = "1";
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 28}px`;
        tooltip.textContent = `${event.title} (${formatDecimalTime(roundedStart)} - ${formatDecimalTime(roundedEnd)})`;
      });

      eventEl.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
      });

      eventsLayer.appendChild(eventEl);
      eventEls.push({ event, el: eventEl });
    });

    // Draw connector lines
    for (let i = 0; i < eventEls.length - 1; i++) {
      const current = eventEls[i];
      const next = eventEls[i + 1];

      const x1 = current.event.end * hourWidth;
      const x2 = next.event.start * hourWidth;
      const y = rowIndex * rowHeight + 40;

      const line = document.createElement("div");
      line.className = "connector-line";
      line.style.left = `${x1}px`;
      line.style.top = `${y}px`;
      line.style.width = `${x2 - x1}px`;
      linesContainer.appendChild(line);
    }

    // Add run labels
    const runMap = new Map();
    eventEls.forEach(({ event }) => {
      if (event.run) {
        if (!runMap.has(event.run)) {
          runMap.set(event.run, []);
        }
        runMap.get(event.run).push(event);
      }
    });

    runMap.forEach((events, runName) => {
      if (events.length === 0) return;

      // Find earliest start time of the run events
      const earliestStart = Math.min(...events.map(e => e.start));

      // Calculate label horizontal position at first event start
      const left = earliestStart * hourWidth;

      // Calculate vertical position below events (consider max layer height)
      const maxLayer = eventLayers.length;
      const layerHeight = 32;
      const verticalPadding = 5;
      const baseRowTop = rowIndex * rowHeight;

      const label = document.createElement("div");
      label.className = "run-label";
      label.textContent = runName;
      label.title = runName;

      label.style.position = "absolute";
      label.style.left = `${left}px`;
      label.style.top = `${baseRowTop + maxLayer * layerHeight + verticalPadding + 10}px`; // Below events
      label.style.transform = "translateX(0)";  // align left edge at 'left'
      linesContainer.appendChild(label);
    });

    row.appendChild(eventsLayer);
    timelineRowsEl.appendChild(row);
  });

  timelineRowsEl.appendChild(linesContainer);

  const totalHeight = rowHeight * filteredStaff.length;
  verticalGridLinesEl.style.height = totalHeight + 'px';
  currentTimeLineEl.style.height = totalHeight + 'px';
}


function showPopup(event, member, eventEl) {
  popup.style.display = "block";
  popup.innerHTML = `
    <div class="popup-header">${event.title} &nbsp; &nbsp; &nbsp; &nbsp; 
    <button style='width:50px; font-size:13px; height:auto; border:none; padding:3px; cursor:pointer; border-radius:5px; 
      background-color:rgba(192, 57, 43,1.0); color:#fff;' id="event-details-btn" data-event-id="${event.id}">
        Modify
      </button></div>
    <hr />
    <div class="popup-row"><strong>Status:</strong> ${event.description}</div>
    <hr />
    <div class="popup-row"><strong>Transportation:</strong> ${member.department}</div>
    <hr />
    <div class="popup-row"><strong>Time:</strong> ${formatDecimalTime(Math.round(event.start * 100) / 100)} - ${formatDecimalTime(Math.round(event.end * 100) / 100)}</div>
    <hr />
    <div class="popup-row"><strong>Run:</strong> ${event.run}</div>
    <div class="popup-row">
    <hr>
    </div>
  `;

  const rect = eventEl.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - popupRect.width / 2;
  if (left < 10) left = 10;
  if (left + popupRect.width > window.innerWidth - 10)
    left = window.innerWidth - popupRect.width - 10;

  let top = rect.top - popupRect.height - 10;
  if (top < 10) top = rect.bottom + 10;

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;

  const button = popup.querySelector("#event-details-btn");
  if (button) {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const eventId = button.getAttribute("data-event-id");
      window.location.href = `../care-call-details?userId=${eventId}`;
    });
  }
}

document.addEventListener("click", (e) => {
  if (popup.style.display === "block" && !popup.contains(e.target)) {
    popup.style.display = "none";
  }
});

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

zoomRangeEl.addEventListener("input", (e) => {
  hourWidth = parseInt(e.target.value, 10);
  localStorage.setItem("hourWidth", hourWidth);
  zoomValueEl.textContent = hourWidth;
  updateHourWidthCSS();
  renderHours();
  renderVerticalGridLines();
  renderTimelineRows(filteredStaff);
  updateCurrentTimeLine();
});

function filterStaff() {
  const query = staffSearchEl.value.trim().toLowerCase();

  // Get all checked cities
  const selectedCities = Array.from(document.querySelectorAll(".city-checkbox:checked"))
    .map(cb => cb.value);

  console.log("Selected cities:", selectedCities); // For debugging

  filteredStaff = staff.filter(member => {
    const matchesName = member.name.toLowerCase().includes(query);

    // Use 'group' as the city property
    const matchesCity = selectedCities.length === 0 || selectedCities.includes(member.group);
    return matchesName && matchesCity;
  });

  console.log("Filtered staff count:", filteredStaff.length); // For debugging
  clearSearchBtn.style.display = query ? "inline" : "none";

  renderStaffLabels(filteredStaff);
  renderTimelineRows(filteredStaff);
  staffLabelsContainer.scrollTop = 0;
  timelineScrollContainer.scrollTop = 0;
}



staffSearchEl.addEventListener("input", filterStaff);
clearSearchBtn.addEventListener("click", () => {
  staffSearchEl.value = "";
  filterStaff();
  staffSearchEl.focus();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

function updateCurrentTimeLine() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const left = (hour + minutes / 60) * hourWidth;
  currentTimeLineEl.style.left = `${left}px`;

  const buffer = 100;
  const visibleLeft = timelineScrollContainer.scrollLeft;
  const visibleRight = visibleLeft + timelineScrollContainer.clientWidth;
  if (left < visibleLeft || left > visibleRight - buffer) {
    timelineScrollContainer.scrollLeft = left - buffer;
  }
}

setInterval(updateCurrentTimeLine, 60 * 1000);
const datePickerEl = document.getElementById("date-picker");
datePickerEl.addEventListener("change", () => {
  fetchAndRenderStaff(datePickerEl.value);
});

async function fetchAndRenderStaff(selectedDate) {
  try {
    const dateParam = selectedDate ? `?date=${selectedDate}` : "";
    const response = await fetch("getStaffWithEvents.php" + dateParam);
    if (!response.ok) throw new Error("Network response was not ok");
    staff = await response.json();
    filteredStaff = staff;

    updateHourWidthCSS();
    renderHours();
    renderVerticalGridLines();
    renderStaffLabels(filteredStaff);
    renderTimelineRows(filteredStaff);
    updateCurrentTimeLine();
  } catch (err) {
    console.error("Failed to load data:", err);
    alert("Error loading staff and event data.");
  }
}


const cityCheckboxList = document.getElementById("city-checkbox-list");

async function fetchAndRenderCities() {
  try {
    const response = await fetch("getcities.php"); // <-- Adjust URL if needed
    if (!response.ok) throw new Error("Failed to fetch cities");

    const cities = await response.json();
    cityCheckboxList.innerHTML = "";

    cities.forEach(city => {
      const li = document.createElement("li");
      li.style.listStyle = "none";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = city;
      checkbox.id = `city-checkbox-${city}`;
      checkbox.classList.add("city-checkbox");

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = city;
      label.style.marginLeft = "8px";

      li.appendChild(checkbox);
      li.appendChild(label);
      cityCheckboxList.appendChild(li);

      // Trigger filter when city checkbox is toggled
      checkbox.addEventListener("change", () => {
        filterStaff();
      });
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
}



async function init() {
  await fetchAndRenderCities();
  const savedHourWidth = localStorage.getItem("hourWidth");
  if (savedHourWidth !== null) {
    hourWidth = parseInt(savedHourWidth, 10);
    zoomRangeEl.value = hourWidth;
    zoomValueEl.textContent = hourWidth;
  }

  const today = new Date().toISOString().split("T")[0];
  datePickerEl.value = today;
  await fetchAndRenderStaff(today);
}

init();
 