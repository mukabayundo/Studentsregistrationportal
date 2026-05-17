// ─── CATEGORY COLORS ───────────────────────────────────────────────────────
const categoryColors = {
  Technology: { bg: '#eff6ff', text: '#3b82f6' },
  Science:    { bg: '#f0fdf4', text: '#22c55e' },
  Arts:       { bg: '#fdf4ff', text: '#a855f7' },
  Sports:     { bg: '#fff7ed', text: '#f97316' },
  Business:   { bg: '#fffbeb', text: '#eab308' },
  Health:     { bg: '#fff1f2', text: '#f43f5e' },
  Other:      { bg: '#f3f4f6', text: '#6b7280' },
};

// ─── DEFAULT EVENTS ────────────────────────────────────────────────────────
const defaultEvents = [
  { id: 1, title: "AI Bootcamp",        category: "Technology", seats: 30, registered: 12 },
  { id: 2, title: "Science Fair 2025",  category: "Science",    seats: 50, registered: 20 },
  { id: 3, title: "Drama Festival",     category: "Arts",       seats: 40, registered: 40 },
  { id: 4, title: "Inter-School Rugby", category: "Sports",     seats: 60, registered: 5  },
  { id: 5, title: "Startup Pitch Day",  category: "Business",   seats: 25, registered: 10 },
  { id: 6, title: "Health & Wellness",  category: "Health",     seats: 35, registered: 8  },
];

// ─── LOAD / SAVE (Local Storage) ──────────────────────────────────────────
function loadEvents() {
  const saved = localStorage.getItem('eduevents_data');
  return saved ? JSON.parse(saved) : defaultEvents;
}

function saveEvents() {
  localStorage.setItem('eduevents_data', JSON.stringify(events));
}

// ─── STATE ─────────────────────────────────────────────────────────────────
let events = loadEvents();
let searchQuery = '';
let nextId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;

// ─── TOAST NOTIFICATION ────────────────────────────────────────────────────
function showToast(msg, color = '#0f0e17') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ─── UPDATE STATS ──────────────────────────────────────────────────────────
function updateStats() {
  const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);
  const totalSeats      = events.reduce((sum, e) => sum + e.seats, 0);
  const remaining       = totalSeats - totalRegistered;

  document.getElementById('statTotal').textContent      = events.length;
  document.getElementById('statRegistered').textContent = totalRegistered;
  document.getElementById('statSeats').textContent      = remaining;
}

// ─── RENDER EVENTS ─────────────────────────────────────────────────────────
function renderEvents() {
  const grid    = document.getElementById('eventsGrid');
  const countEl = document.getElementById('eventCount');
  grid.innerHTML = '';

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery) ||
    e.category.toLowerCase().includes(searchQuery)
  );

  countEl.textContent = filtered.length
    ? `${filtered.length} event${filtered.length > 1 ? 's' : ''} found`
    : '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state col-span-3">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p class="font-semibold text-gray-500" style="font-family:'Syne',sans-serif">No events found</p>
        <p class="text-sm mt-1">Try a different search or add a new event.</p>
      </div>`;
    updateStats();
    return;
  }

  filtered.forEach((event, idx) => {
    const remaining = event.seats - event.registered;
    const pct       = Math.round((event.registered / event.seats) * 100);
    const isFull    = remaining <= 0;
    const hasNone   = event.registered <= 0;
    const colors    = categoryColors[event.category] || categoryColors.Other;

    // Seat bar color: green → yellow → red
    const barColor = pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#22c55e';

    const card = document.createElement('div');
    card.className = 'event-card bg-white rounded-2xl p-5 flex flex-col gap-4';
    card.style.animationDelay = `${idx * 0.06}s`;

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-bold text-base leading-snug" style="font-family:'Syne',sans-serif">${event.title}</h3>
        <span class="badge flex-shrink-0" style="background:${colors.bg};color:${colors.text}">${event.category}</span>
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>${event.registered} registered</span>
          <span>${remaining} left</span>
        </div>
        <div class="seat-bar-track">
          <div class="seat-bar-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="text-xs text-gray-400 mt-0.5">${event.seats} total seats</div>
      </div>

      <div class="flex gap-2 mt-auto">
        <button
          class="btn-register flex-1"
          data-id="${event.id}"
          data-action="register"
          ${isFull ? 'disabled' : ''}
        >${isFull ? 'Full' : 'Register'}</button>
        <button
          class="btn-cancel flex-1"
          data-id="${event.id}"
          data-action="cancel"
          ${hasNone ? 'disabled' : ''}
        >Cancel</button>
      </div>
    `;

    grid.appendChild(card);
  });

  updateStats();
}

// ─── REGISTER / CANCEL BUTTON CLICKS ──────────────────────────────────────
document.getElementById('eventsGrid').addEventListener('click', function(e) {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const id     = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const event  = events.find(ev => ev.id === id);
  if (!event) return;

  if (action === 'register') {
    if (event.registered >= event.seats) {
      showToast('No seats available!', '#ef4444');
      return;
    }
    event.registered++;
    showToast(`✓ Registered for "${event.title}"`);
  }

  if (action === 'cancel') {
    if (event.registered <= 0) {
      showToast('Nothing to cancel.', '#6b7280');
      return;
    }
    event.registered--;
    showToast(`✗ Cancelled registration for "${event.title}"`, '#f97316');
  }

  saveEvents();
  renderEvents();
});

// ─── SEARCH ────────────────────────────────────────────────────────────────
function handleSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderEvents();
}

document.getElementById('searchInput').addEventListener('input', function() {
  handleSearch(this.value);
  document.getElementById('searchInputMobile').value = this.value;
});

document.getElementById('searchInputMobile').addEventListener('input', function() {
  handleSearch(this.value);
  document.getElementById('searchInput').value = this.value;
});

// ─── FORM VALIDATION & SUBMIT ──────────────────────────────────────────────
document.getElementById('addEventForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const titleEl = document.getElementById('eventTitle');
  const catEl   = document.getElementById('eventCategory');
  const seatsEl = document.getElementById('eventSeats');

  const errTitle    = document.getElementById('errTitle');
  const errCategory = document.getElementById('errCategory');
  const errSeats    = document.getElementById('errSeats');

  const title    = titleEl.value.trim();
  const category = catEl.value.trim();
  const seats    = parseInt(seatsEl.value);

  let valid = true;

  // Reset errors
  [errTitle, errCategory, errSeats].forEach(el => el.classList.remove('show'));
  [titleEl, catEl, seatsEl].forEach(el => el.style.borderColor = '');

  if (!title) {
    errTitle.classList.add('show');
    titleEl.style.borderColor = '#ef4444';
    valid = false;
  }
  if (!category) {
    errCategory.classList.add('show');
    catEl.style.borderColor = '#ef4444';
    valid = false;
  }
  if (!seatsEl.value || isNaN(seats) || seats < 1) {
    errSeats.classList.add('show');
    seatsEl.style.borderColor = '#ef4444';
    valid = false;
  }

  if (!valid) return;

  const newEvent = {
    id: nextId++,
    title,
    category,
    seats,
    registered: 0,
  };

  events.push(newEvent);
  saveEvents();
  renderEvents();

  this.reset();
  showToast(`✓ "${title}" added successfully!`, '#22c55e');

  document.getElementById('eventsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ─── INIT ──────────────────────────────────────────────────────────────────
renderEvents();