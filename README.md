#  EduEvents — Student Event Registration Dashboard

A responsive Student Event Registration Dashboard built with **HTML5**, **Tailwind CSS**, and **Vanilla JavaScript**.

---

## Project Structure

```
project/
├── index.html   → Structure & Styling (HTML5 + Tailwind CSS)
└── Student.js       → All JavaScript Logic
```

---

##  How to Run

1. Download both files `index.html` and `app.js`
2. Put them in the **same folder**
3. Open `index.html` in your browser
4. Done — no installation needed

---

## Features

| Feature | Description |
|---|---|
| View Events | See all available events as cards |
| Register | Click Register to book a seat |
| Cancel | Click Cancel to free up your seat |
| Add Event | Use the form to create new events |
| Search | Filter events by title or category |
| Local Storage | Data is saved even after page refresh |
| Live Stats | Total events, registered students, seats left |
| Responsive | Works on mobile, tablet, and desktop |

---

##  Technologies Used

- **HTML5** — Semantic structure (`<nav>`, `<section>`, `<footer>`)
- **Tailwind CSS** — Utility-first styling via CDN
- **Vanilla JavaScript** — All logic, no frameworks
- **Local Storage** — Browser-side data persistence

---

##  Local Storage

Data is automatically saved every time you:
- Register for an event
- Cancel a registration
- Add a new event

On page refresh, all your data is restored automatically.

---

##  JavaScript Methods Used

| Method | Where Used |
|---|---|
| `push()` | Add new event to array |
| `find()` | Find event by ID |
| `filter()` | Search/filter events |
| `forEach()` | Loop through events to render cards |
| `reduce()` | Calculate total stats |
| `JSON.stringify()` | Save data to localStorage |
| `JSON.parse()` | Load data from localStorage |

---

##  Author

Built as a student assignment project.
