// staff-scroll-utils.js
const staffLabelsEl = document.getElementById("staff-labels");
const timelineHeaderEl = document.getElementById("timeline-header");
const verticalGridLinesEl = document.getElementById("vertical-grid-lines");
const timelineRowsEl = document.getElementById("timeline-rows");
const currentTimeLineEl = document.getElementById("current-time-line");
const zoomRangeEl = document.getElementById("zoom-range");
const zoomValueEl = document.getElementById("zoom-value");
const themeToggle = document.getElementById("theme-toggle");
const staffLabelsContainer = document.getElementById("staff-labels-container");
const timelineHeaderContainer = document.getElementById("timeline-header-container");
const timelineScrollContainer = document.getElementById("timeline-scroll-container");
const popup = document.getElementById("popup");
const tooltip = document.getElementById("tooltip");
const datePickerEl = document.getElementById("date-picker");

const totalHours = 24;
let hourWidth = parseInt(localStorage.getItem('hourWidth')) || parseInt(zoomRangeEl.value, 10);
zoomRangeEl.value = hourWidth;
zoomValueEl.textContent = `${hourWidth}px`;

let staff = [];

function formatDecimalTime(decimal) {
  const totalMinutes = Math.round(decimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function setStaffData(data) {
  staff = data;
}

function setHourWidth(newWidth) {
  hourWidth = newWidth;
  localStorage.setItem('hourWidth', hourWidth);
  zoomRangeEl.value = hourWidth;
  zoomValueEl.textContent = `${hourWidth}px`;
  updateHourWidthCSS();
  renderVerticalGridLines();
  updateCurrentTimeLine();
  centerCurrentTimeLine();
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
  const rowHeight = 120;
  timelineRowsEl.innerHTML = "";
  const linesContainer = document.createElement("div");
  linesContainer.className = "lines-container";

  const now = new Date();
  const currentTimeDecimal = now.getHours() + now.getMinutes() / 60;

  const SNAP_INTERVAL = 0.25;
  function snapToGrid(value) {
    return Math.round(value / SNAP_INTERVAL) * SNAP_INTERVAL;
  }

  let draggingEvent = null;
  let dragOffsetX = 0;

  filteredStaff.forEach((member, rowIndex) => {
    const row = document.createElement("div");
    row.className = "timeline-row";
    row.style.height = `${rowHeight}px`;

    const eventsLayer = document.createElement("div");
    eventsLayer.className = "events-layer";
    eventsLayer.style.position = "relative";

    const events = member.events
      .filter(event => event.end > 0 && event.start < totalHours)
      .sort((a, b) => a.start - b.start);

    const eventEls = [];
    const eventLayers = [];

    events.forEach(event => {
      // 🔧 Ensure IDs are always set
      if (!event.userId) event.userId = member.userId;
      if (!event.staff_uniqueId) event.staff_uniqueId = member.staff_uniqueId;

      const roundedStart = Math.round(event.start * 100) / 100;
      const roundedEnd = Math.round(event.end * 100) / 100;

      const leftPx = roundedStart * hourWidth;
      const widthPx = (roundedEnd - roundedStart) * hourWidth;

      const eventEl = document.createElement("div");
      eventEl.className = "event-bar";
      eventEl.textContent = event.title;

      const descLower = (event.description || "").toLowerCase();
      let bgColor = member.color;

      const TOLERANCE = 0.0001;
      if (descLower === "completed") {
        bgColor = "#16a085";
      } else if (descLower === "scheduled") {
        if (currentTimeDecimal - roundedEnd > TOLERANCE ||
            (currentTimeDecimal + TOLERANCE >= roundedStart &&
             currentTimeDecimal - TOLERANCE <= roundedEnd)) {
          bgColor = "#c0392b";
        } else if (currentTimeDecimal + TOLERANCE < roundedStart) {
          bgColor = "#2c3e50";
        }
      }

      eventEl.style.backgroundColor = bgColor;
      eventEl.style.left = `${leftPx}px`;
      eventEl.style.width = `${widthPx}px`;
      eventEl.style.position = "absolute";
      eventEl.style.transition = "left 0.3s ease, width 0.3s ease";

      let layer = 0;
      while (
        eventLayers[layer]?.some(
          e => !(roundedEnd <= e.start || roundedStart >= e.end)
        )
      ) {
        layer++;
      }
      if (!eventLayers[layer]) eventLayers[layer] = [];
      eventLayers[layer].push({ start: roundedStart, end: roundedEnd });

      eventEl.style.top = `${layer * 32}px`;

      eventEl.setAttribute("draggable", "true");
      eventEl.addEventListener("dragstart", e => {
        dragOffsetX = e.offsetX;
        draggingEvent = { event, member, element: eventEl };
        e.dataTransfer.effectAllowed = "move";

        if (e.dataTransfer.setDragImage) {
          const crt = eventEl.cloneNode(true);
          crt.style.position = "absolute";
          crt.style.top = "-9999px";
          crt.style.left = "-9999px";
          document.body.appendChild(crt);
          e.dataTransfer.setDragImage(crt, dragOffsetX, e.offsetY);
          setTimeout(() => document.body.removeChild(crt), 0);
        }
      });

      eventEl.addEventListener("dragend", () => {
        draggingEvent = null;
      });

      const resizeHandle = document.createElement("div");
      resizeHandle.className = "resize-handle";
      resizeHandle.style.position = "absolute";
      resizeHandle.style.right = "0";
      resizeHandle.style.top = "0";
      resizeHandle.style.width = "8px";
      resizeHandle.style.height = "100%";
      resizeHandle.style.cursor = "ew-resize";
      resizeHandle.style.background = "rgba(255,255,255,0.3)";
      eventEl.appendChild(resizeHandle);

      resizeHandle.addEventListener("mousedown", e => {
        e.stopPropagation();
        e.preventDefault();
        const startX = e.clientX;
        const initialWidthPx = eventEl.offsetWidth;
        const eventRef = event;

        function onMouseMove(moveEvent) {
          const deltaX = moveEvent.clientX - startX;
          let newWidthPx = Math.max(10, initialWidthPx + deltaX);
          let newEnd = roundedStart + newWidthPx / hourWidth;
          newEnd = snapToGrid(newEnd);
          newEnd = Math.min(totalHours, newEnd);

          const otherEvents = member.events.filter(ev => ev !== eventRef);
          otherEvents.forEach(ev => {
            if (!(newEnd <= ev.start || roundedStart >= ev.end) && newEnd > ev.start) {
              newEnd = ev.start;
              newWidthPx = (newEnd - roundedStart) * hourWidth;
            }
          });

          eventRef.end = newEnd;
          eventEl.style.width = `${newWidthPx}px`;

          if (tooltip.style.opacity === "1") {
            tooltip.textContent = `${eventRef.title} (${formatDecimalTime(eventRef.start)} - ${formatDecimalTime(eventRef.end)})`;
          }
        }

        function onMouseUp() {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          filterStaff();
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      eventEl.addEventListener("click", e => {
        e.stopPropagation();
        showPopup(event, member, eventEl);
      });

      eventEl.addEventListener("mouseenter", () => {
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

    row.addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    row.addEventListener("drop", e => {
      e.preventDefault();
      if (!draggingEvent) return;

      const eventsLayerRect = eventsLayer.getBoundingClientRect();
      const dropX = e.clientX - eventsLayerRect.left;
      let newStart = Math.max(0, (dropX - dragOffsetX) / hourWidth);
      newStart = snapToGrid(newStart);

      const duration = draggingEvent.event.end - draggingEvent.event.start;
      let newEnd = Math.min(totalHours, newStart + duration);

      const targetEvents = member.events.filter(ev => ev !== draggingEvent.event);
      targetEvents.forEach(ev => {
        if (!(newEnd <= ev.start || newStart >= ev.end)) {
          newStart = ev.end;
          newStart = snapToGrid(newStart);
          newEnd = Math.min(totalHours, newStart + duration);
        }
      });

      draggingEvent.event.start = newStart;
      draggingEvent.event.end = newEnd;

      // 🔧 Always assign updated IDs
      draggingEvent.event.userId = member.userId;
      draggingEvent.event.staff_uniqueId = member.staff_uniqueId;

      if (draggingEvent.member !== member) {
        const oldEvents = draggingEvent.member.events;
        const idx = oldEvents.indexOf(draggingEvent.event);
        if (idx > -1) oldEvents.splice(idx, 1);
        member.events.push(draggingEvent.event);
      }

      draggingEvent = null;
      filterStaff();
    });

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

    const runMap = new Map();
    eventEls.forEach(({ event }) => {
      if (event.run) {
        if (!runMap.has(event.run)) runMap.set(event.run, []);
        runMap.get(event.run).push(event);
      }
    });

    runMap.forEach((events, runName) => {
      if (events.length === 0) return;
      const earliestStart = Math.min(...events.map(e => e.start));
      const left = earliestStart * hourWidth;
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
      label.style.top = `${baseRowTop + maxLayer * layerHeight + verticalPadding + 10}px`;
      label.style.transform = "translateX(0)";
      linesContainer.appendChild(label);
    });

    row.appendChild(eventsLayer);
    timelineRowsEl.appendChild(row);
  });

  timelineRowsEl.appendChild(linesContainer);
  const totalHeight = rowHeight * filteredStaff.length;
  verticalGridLinesEl.style.height = totalHeight + "px";
  currentTimeLineEl.style.height = totalHeight + "px";
}









function showPopup(event, member, eventEl) {
  popup.style.display = "block";
  popup.innerHTML = `
    <div class="popup-header">${event.title} &nbsp; &nbsp; &nbsp; &nbsp; 
    <a href='../event-details?userId=${event.id}' style='width:100px; font-size:13px; height:50px; border:none; text-decoration:none;
    padding:7px; cursor:pointer; border-radius:5px; background-color:rgba(192, 57, 43,1.0); color:#fff;' id="event-details-btn">
        Modify
    </a>
    </div>
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

  //const button = popup.querySelector("#event-details-btn");
  //if (button) {
    //button.addEventListener("click", () => {
   //   alert("Modify event ID: " + button.dataset.eventId);
   // });
 // }

  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && e.target !== eventEl) {
      popup.style.display = "none";
    }
  }, { once: true });
}

function centerCurrentTimeLine() {
  const now = new Date();
  const currentTimeDecimal = now.getHours() + now.getMinutes() / 60;
  const redLinePosition = currentTimeDecimal * hourWidth;

  const containerWidth = timelineScrollContainer.clientWidth;
  const scrollTo = redLinePosition - containerWidth / 2;

  timelineScrollContainer.scrollLeft = scrollTo > 0 ? scrollTo : 0;
  timelineHeaderContainer.scrollLeft = timelineScrollContainer.scrollLeft;
}

function updateCurrentTimeLine() {
  const now = new Date();
  const currentTimeDecimal = now.getHours() + now.getMinutes() / 60;
  currentTimeLineEl.style.left = currentTimeDecimal * hourWidth + "px";
  setTimeout(updateCurrentTimeLine, 60000); 
}

function filterStaff(searchQuery = "", selectedCities = []) {
  const query = searchQuery.trim().toLowerCase();

  const filteredStaff = staff.filter(member => {
    const matchesName = member.name.toLowerCase().includes(query);
    const matchesCity = selectedCities.length === 0 || selectedCities.includes(member.group);
    return matchesName && matchesCity;
  });

  renderStaffLabels(filteredStaff);
  renderTimelineRows(filteredStaff);
  renderVerticalGridLines(); 
  updateCurrentTimeLine();

  staffLabelsContainer.scrollTop = 0;
  timelineScrollContainer.scrollTop = 0;

  centerCurrentTimeLine();
}

function initZoomAndThemeListeners(onFilterCallback) {
  zoomRangeEl.value = hourWidth;
  zoomValueEl.textContent = `${hourWidth}px`;

  zoomRangeEl.addEventListener("input", () => {
    const newWidth = parseInt(zoomRangeEl.value, 10);
    setHourWidth(newWidth);
    onFilterCallback();
  });

  themeToggle.addEventListener("change", (event) => {
    if (event.target.checked) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("darkTheme", "true");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("darkTheme", "false");
    }
  });

  // Apply saved theme on load
  if (localStorage.getItem("darkTheme") === "true") {
    document.body.classList.add("dark-theme");
    themeToggle.checked = true;
  }
}

function syncVerticalScrolls() {
  let isSyncingScroll = false;

  staffLabelsContainer.addEventListener('scroll', () => {
    if (isSyncingScroll) return;
    isSyncingScroll = true;
    timelineScrollContainer.scrollTop = staffLabelsContainer.scrollTop;
    isSyncingScroll = false;
  });

  timelineScrollContainer.addEventListener('scroll', () => {
    if (isSyncingScroll) return;
    isSyncingScroll = true;
    staffLabelsContainer.scrollTop = timelineScrollContainer.scrollTop;
    isSyncingScroll = false;

    // Keep timeline header horizontal scroll in sync (already done in centerCurrentTimeLine)
    timelineHeaderContainer.scrollLeft = timelineScrollContainer.scrollLeft;
  });
}


let allowedDomains = [];
let domainsLoaded = false;

/**
 * Fetch allowed domains from server
 */
async function loadAllowedDomains() {
  try {
    const response = await fetch("https://staffscroll.co.uk/roster/pro/assets/api/getAllowedDomains.php");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    allowedDomains = await response.json();
    console.log("Allowed domains from server:", allowedDomains);
    domainsLoaded = true;
  } catch (error) {
    console.error("Failed to fetch allowed domains:", error);
  }
}

/**
 * Check if domain is authorized
 * @param {string} domain
 * @returns {boolean}
 */
function isValidDomain(domain) {
  if (!domainsLoaded) {
    console.warn("Allowed domains not yet loaded");
    return false;
  }

  return allowedDomains
    .map(d => d.toLowerCase().replace(/^www\./, '')) // normalize entries
    .includes(domain.toLowerCase().replace(/^www\./, ''));
}

// Immediately invoked function to run domain check
(async () => {
  await loadAllowedDomains();

  const currentDomain = window.location.hostname;
  console.log("Current domain:", currentDomain);

  if (!domainsLoaded) {
    console.error("Domain list could not be loaded. Aborting check.");
    return;
  }

  if (isValidDomain(currentDomain)) {
    console.log("✅ Domain is authorized.");
  } else {
    console.warn("⛔ Domain is not authorized.");
    document.body.innerHTML = "";
    document.body.style.backgroundColor = "white";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.color = "red";
    document.body.style.fontSize = "32px";

    const errorDiv = document.createElement("div");
    errorDiv.textContent = `Domain "${currentDomain}" is not authorized.`;
    document.body.appendChild(errorDiv);
  }
})();


export {
  setStaffData,
  updateHourWidthCSS,
  syncVerticalScrolls,
  renderHours,
  renderVerticalGridLines,
  renderStaffLabels,
  renderTimelineRows,
  updateCurrentTimeLine,
  filterStaff,
  initZoomAndThemeListeners,
  loadAllowedDomains,
  isValidDomain,
};