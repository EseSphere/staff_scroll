<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Weekly Staff Calendar</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <link rel="stylesheet" href="./style.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>

<body>

    <h3>Weekly Staff Calendar</h3>

    <div class="week-controls" role="group" aria-label="Week navigation controls">
        <button id="prevWeek" class="btn btn-primary" aria-label="Previous week">← Previous Week</button>
        <button id="todayBtn" class="btn btn-outline-primary" aria-label="Go to current week">Today</button>
        <div id="weekRange" aria-live="polite" aria-atomic="true"></div>
        <button id="nextWeek" class="btn btn-primary" aria-label="Next week">Next Week →</button>
        <button id="darkModeToggle" aria-pressed="false" aria-label="Toggle dark mode">Dark Mode</button>
    </div>

    <div id="searchContainer">
        <input type="search" id="searchInput" placeholder="Search staff by name..." aria-label="Search staff" />
    </div>

    <div id="calendar-container" role="region" aria-label="Weekly staff calendar">
        <div id="calendar-header" aria-hidden="true">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
        </div>
        <div id="calendar" tabindex="0" aria-live="polite" aria-atomic="true"></div>
    </div>

    <div id="loadingSpinner" role="status" aria-live="polite" aria-label="Loading"></div>

    <div id="errorMsg" role="alert">
        Error loading staff data.
        <button id="retryBtn" class="btn btn-danger btn-sm" style="margin-left:1rem;">Retry</button>
    </div>

    <section id="staffDisplay" aria-live="polite" aria-atomic="true" aria-label="Staff members for selected day" hidden>
        <h5 id="staffDayLabel"></h5>
        <ul id="staffList"></ul>
    </section>

    <!-- Staff details modal -->
    <div id="modalOverlay"></div>
    <div id="staffModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDesc">
        <button id="modalCloseBtn" aria-label="Close staff details">×</button>
        <h4 id="modalTitle">Staff Member Details</h4>
        <p id="modalDesc">Loading...</p>
    </div>

    <script>
        (() => {
            // Data
            const staffData = [{
                    id: 1,
                    name: "Alice",
                    days: [1, 3, 5]
                },
                {
                    id: 2,
                    name: "Bob",
                    days: [0, 2, 4]
                },
                {
                    id: 3,
                    name: "Charlie",
                    days: [6, 0, 1]
                },
                {
                    id: 4,
                    name: "Dana",
                    days: [3, 4, 5]
                },
                {
                    id: 5,
                    name: "Evan",
                    days: [1, 2, 3, 4, 5]
                },
                {
                    id: 6,
                    name: "Fiona",
                    days: [0, 6]
                },
                {
                    id: 7,
                    name: "George",
                    days: [2, 3, 5]
                },
                {
                    id: 8,
                    name: "Helen",
                    days: [1, 4, 6]
                },
                {
                    id: 9,
                    name: "Iris",
                    days: [0, 1, 2]
                },
                {
                    id: 10,
                    name: "Jack",
                    days: [3, 4, 5, 6]
                }
            ];

            // Constants
            const maxVisibleBadges = 4;

            // Elements
            const weekRange = document.getElementById('weekRange');
            const prevWeekBtn = document.getElementById('prevWeek');
            const nextWeekBtn = document.getElementById('nextWeek');
            const todayBtn = document.getElementById('todayBtn');
            const calendarEl = document.getElementById('calendar');
            const staffDisplay = document.getElementById('staffDisplay');
            const staffDayLabel = document.getElementById('staffDayLabel');
            const staffList = document.getElementById('staffList');
            const searchInput = document.getElementById('searchInput');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const errorMsg = document.getElementById('errorMsg');
            const retryBtn = document.getElementById('retryBtn');
            const darkModeToggle = document.getElementById('darkModeToggle');

            const modal = document.getElementById('staffModal');
            const modalOverlay = document.getElementById('modalOverlay');
            const modalCloseBtn = document.getElementById('modalCloseBtn');
            const modalTitle = document.getElementById('modalTitle');
            const modalDesc = document.getElementById('modalDesc');

            // State
            let currentWeekStart = getStartOfWeek(new Date());
            let filteredStaffData = staffData;
            let darkMode = false;

            // Helpers
            function getStartOfWeek(date) {
                const d = new Date(date);
                const day = d.getDay();
                d.setHours(0, 0, 0, 0);
                d.setDate(d.getDate() - day);
                return d;
            }

            function formatDate(d) {
                return d.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                });
            }

            function formatFullDate(d) {
                return d.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            function addDays(date, days) {
                const newDate = new Date(date);
                newDate.setDate(newDate.getDate() + days);
                return newDate;
            }

            // Render week range in header
            function renderWeekRange() {
                const startStr = formatDate(currentWeekStart);
                const end = addDays(currentWeekStart, 6);
                const endStr = formatDate(end);
                weekRange.textContent = `${startStr} – ${endStr}`;
            }

            // Get staff for a specific day (0=Sun...6=Sat)
            function getStaffForDay(dayIndex) {
                return filteredStaffData.filter(s => s.days.includes(dayIndex));
            }

            // Render calendar day badges
            function renderCalendar() {
                calendarEl.innerHTML = '';
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                for (let i = 0; i < 7; i++) {
                    const date = addDays(currentWeekStart, i);
                    const dayIndex = date.getDay();

                    // Filter staff badges for the day
                    let dayStaff = getStaffForDay(dayIndex);

                    // Apply search filter
                    if (searchInput.value.trim()) {
                        const searchTerm = searchInput.value.trim().toLowerCase();
                        dayStaff = dayStaff.filter(s => s.name.toLowerCase().includes(searchTerm));
                    }

                    // Create day cell
                    const cell = document.createElement('div');
                    cell.classList.add('calendar-cell');
                    cell.tabIndex = 0;
                    cell.setAttribute('role', 'button');
                    cell.setAttribute('aria-label', `${formatFullDate(date)} with ${dayStaff.length} staff member${dayStaff.length !== 1 ? 's' : ''}`);
                    cell.dataset.dayIndex = dayIndex;

                    if (date.getTime() === today.getTime()) {
                        cell.classList.add('today');
                    }

                    // Date label
                    const dateLabel = document.createElement('div');
                    dateLabel.className = 'calendar-date';
                    dateLabel.textContent = date.getDate();
                    cell.appendChild(dateLabel);

                    // Staff badges container
                    const badgesContainer = document.createElement('div');
                    badgesContainer.className = 'staff-badges';

                    // Show maxVisibleBadges, then a more badge if needed
                    const visibleStaff = dayStaff.slice(0, maxVisibleBadges);
                    visibleStaff.forEach(staff => {
                        const badge = document.createElement('div');
                        badge.className = 'staff-badge';
                        badge.textContent = staff.name;
                        badge.tabIndex = 0;
                        badge.title = `View details for ${staff.name}`;
                        badge.dataset.staffId = staff.id;

                        badge.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showStaffDetails(staff.id);
                        });

                        badge.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                showStaffDetails(staff.id);
                            }
                        });

                        badgesContainer.appendChild(badge);
                    });

                    if (dayStaff.length > maxVisibleBadges) {
                        const moreBadge = document.createElement('div');
                        moreBadge.className = 'more-badge';
                        moreBadge.textContent = `+${dayStaff.length - maxVisibleBadges} more`;
                        badgesContainer.appendChild(moreBadge);
                    }

                    cell.appendChild(badgesContainer);

                    // Click or key to select day
                    cell.addEventListener('click', () => {
                        renderStaffDisplay(dayIndex, dayStaff);
                    });

                    cell.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            renderStaffDisplay(dayIndex, dayStaff);
                        }
                    });

                    calendarEl.appendChild(cell);
                }
            }

            // Render staff list below calendar for selected day
            function renderStaffDisplay(dayIndex, staff) {
                staffDayLabel.textContent = `Staff on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex]}`;
                staffList.innerHTML = '';

                if (staff.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = 'No staff scheduled.';
                    li.className = 'no-staff';
                    staffList.appendChild(li);
                } else {
                    staff.forEach(s => {
                        const li = document.createElement('li');
                        li.textContent = s.name;
                        staffList.appendChild(li);
                    });
                }
                staffDisplay.hidden = false;
                staffDisplay.focus();
            }

            // Show modal with staff details (mocked info)
            function showStaffDetails(staffId) {
                const staff = staffData.find(s => s.id === staffId);
                if (!staff) return;

                modalTitle.textContent = staff.name;
                modalDesc.textContent = 'Loading staff details...';

                modal.classList.add('show');
                modalOverlay.classList.add('show');
                modalCloseBtn.focus();

                // Simulate async fetch for details
                setTimeout(() => {
                    modalDesc.textContent = `Name: ${staff.name}\nScheduled Days: ${staff.days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}`;
                }, 700);
            }

            // Hide modal
            function closeModal() {
                modal.classList.remove('show');
                modalOverlay.classList.remove('show');
            }

            // Loading simulation (for retry)
            function loadStaffData() {
                loadingSpinner.style.display = 'block';
                errorMsg.style.display = 'none';
                staffDisplay.hidden = true;
                calendarEl.innerHTML = '';

                return new Promise((resolve, reject) => {
                    // Simulate loading delay + random fail
                    setTimeout(() => {
                        loadingSpinner.style.display = 'none';

                        if (Math.random() < 0.05) {
                            errorMsg.style.display = 'block';
                            reject(new Error('Failed to load data'));
                        } else {
                            resolve(staffData);
                        }
                    }, 800);
                });
            }

            // Keyboard calendar navigation: arrow keys to move focus
            function setupCalendarKeyboardNavigation() {
                calendarEl.addEventListener('keydown', e => {
                    const focus = document.activeElement;
                    if (!focus.classList.contains('calendar-cell')) return;

                    let index = Array.from(calendarEl.children).indexOf(focus);
                    if (index === -1) return;

                    switch (e.key) {
                        case 'ArrowRight':
                            e.preventDefault();
                            if (index < 6) calendarEl.children[index + 1].focus();
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            if (index > 0) calendarEl.children[index - 1].focus();
                            break;
                        case 'ArrowUp':
                        case 'ArrowDown':
                            e.preventDefault();
                            // Could implement moving by week rows in bigger calendar, skip here
                            break;
                    }
                });
            }

            // Apply filtered staff data after search
            function applySearchFilter() {
                const term = searchInput.value.trim().toLowerCase();
                if (!term) {
                    filteredStaffData = staffData;
                } else {
                    filteredStaffData = staffData.filter(s => s.name.toLowerCase().includes(term));
                }
                renderCalendar();
                staffDisplay.hidden = true;
            }

            // Dark mode toggle
            function toggleDarkMode() {
                darkMode = !darkMode;
                document.body.classList.toggle('dark-mode', darkMode);
                darkModeToggle.setAttribute('aria-pressed', darkMode);
                darkModeToggle.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
            }

            // Event listeners
            prevWeekBtn.addEventListener('click', () => {
                currentWeekStart.setDate(currentWeekStart.getDate() - 7);
                renderWeekRange();
                renderCalendar();
                staffDisplay.hidden = true;
            });

            nextWeekBtn.addEventListener('click', () => {
                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
                renderWeekRange();
                renderCalendar();
                staffDisplay.hidden = true;
            });

            todayBtn.addEventListener('click', () => {
                currentWeekStart = getStartOfWeek(new Date());
                renderWeekRange();
                renderCalendar();
                staffDisplay.hidden = true;
            });

            searchInput.addEventListener('input', () => {
                applySearchFilter();
            });

            retryBtn.addEventListener('click', () => {
                errorMsg.style.display = 'none';
                loadAndRender();
            });

            darkModeToggle.addEventListener('click', toggleDarkMode);

            modalCloseBtn.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', closeModal);

            // Escape key closes modal
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && modal.classList.contains('show')) {
                    closeModal();
                }
            });

            // Initialize
            async function loadAndRender() {
                try {
                    await loadStaffData();
                    renderWeekRange();
                    renderCalendar();
                    setupCalendarKeyboardNavigation();
                } catch {
                    // Error shown inside loadStaffData
                }
            }

            loadAndRender();

        })();
    </script>
</body>

</html>