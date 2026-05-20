// LOAD EVENTS FROM LOCAL STORAGE
let events = JSON.parse(localStorage.getItem("events")) || [

  {
    id: 1,
    title: "AI Bootcamp",
    category: "Technology",
    seats: 30,
    registered: 10
  },

  {
    id: 2,
    title: "Science Fair",
    category: "Science",
    seats: 50,
    registered: 20
  }

];



// SELECT HTML ELEMENTS
let eventsContainer = document.getElementById("eventsContainer");

let totalEvents = document.getElementById("totalEvents");

let totalRegistered = document.getElementById("totalRegistered");

let remainingSeats = document.getElementById("remainingSeats");

let searchInput = document.getElementById("searchInput");



// SAVE TO LOCAL STORAGE
function saveEvents() {

  localStorage.setItem(
    "events",
    JSON.stringify(events)
  );

}



// UPDATE STATISTICS
function updateStats() {

  totalEvents.textContent = events.length;



  let registered = events.reduce(function(total, event) {

    return total + event.registered;

  }, 0);



  totalRegistered.textContent = registered;



  let seats = events.reduce(function(total, event) {

    return total + event.seats;

  }, 0);



  remainingSeats.textContent = seats - registered;

}



// DISPLAY EVENTS
function renderEvents(eventList = events) {

  eventsContainer.innerHTML = "";



  eventList.forEach(function(event) {

    let remaining = event.seats - event.registered;



    let card = document.createElement("div");



    card.className =
      "bg-white rounded-xl shadow p-5 space-y-4";



    card.innerHTML = `
<h3 class="text-xl sm:text-2xl font-bold break-words">
        ${event.title}
      </h3>

      <p>
        Category:
        <span class="font-semibold">
          ${event.category}
        </span>
      </p>

      <p>
        Seats:
        <span class="font-semibold">
          ${event.seats}
        </span>
      </p>

      <p>
        Registered:
        <span class="font-semibold">
          ${event.registered}
        </span>
      </p>

      <p>
        Remaining:
        <span class="font-semibold">
          ${remaining}
        </span>
      </p>

   <div class="flex flex-col sm:flex-row gap-3">

        <button
          onclick="registerEvent(${event.id})"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Register
        </button>

        <button
          onclick="cancelRegistration(${event.id})"
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cancel
        </button>

      </div>

    `;



    eventsContainer.appendChild(card);

  });



  updateStats();

}



// REGISTER
function registerEvent(id) {

  let event = events.find(function(item) {

    return item.id === id;

  });



  if(event.registered < event.seats) {

    event.registered++;

    saveEvents();

    renderEvents();

  } else {

    alert("No seats available");

  }

}



// CANCEL REGISTRATION
function cancelRegistration(id) {

  let event = events.find(function(item) {

    return item.id === id;

  });



  if(event.registered > 0) {

    event.registered--;

    saveEvents();

    renderEvents();

  }

}



// ADD EVENT
document
  .getElementById("eventForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();



    let title =
      document.getElementById("title").value.trim();

    let category =
      document.getElementById("category").value.trim();

    let seats =
      parseInt(document.getElementById("seats").value);



    // VALIDATION
    if(title === "" || category === "" || seats <= 0) {

      alert("Please fill all fields correctly");

      return;

    }



    // NEW EVENT OBJECT
    let newEvent = {

      id: Date.now(),

      title: title,

      category: category,

      seats: seats,

      registered: 0

    };



    // ADD TO ARRAY
    events.push(newEvent);



    // SAVE
    saveEvents();



    // REFRESH UI
    renderEvents();



    // CLEAR FORM
    document.getElementById("eventForm").reset();

});



// SEARCH EVENTS
searchInput.addEventListener("input", function() {

  let value =
    searchInput.value.toLowerCase();



  let filteredEvents = events.filter(function(event) {

    return (
      event.title.toLowerCase().includes(value) ||
      event.category.toLowerCase().includes(value)
    );

  });



  renderEvents(filteredEvents);

});



// START
renderEvents();