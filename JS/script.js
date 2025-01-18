const sidebarBtn = document.getElementById("menu_sidebar");

sidebarBtn.addEventListener("click", () => {
  sidebarBtn.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "pt-br",
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth, timeGridWeek, timeGridDay",
    },
    events: [
      {
        title: "Evento 1",
        start: "2025-01-18",
        end: "2025-01-19",
      },
      {
        title: "Evento 2",
        start: "2025-01-20T10:00:00",
        end: "2025-01-20T12:00:00",
      },
    ],
  });
  calendar.render();
});
