document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const modal = document.getElementById("eventModal");
  const viewModal = document.getElementById("viewEventModal");
  const closeBtn = document.querySelector("#eventModal .close");
  const closeViewModalBtn = document.querySelector("#viewEventModal .close");

  let selectedEvent = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "pt-br",
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev, today,",
      center: "title",
      end: "dayGridMonth, timeGridWeek, timeGridDay, next",
    },
    buttonText: {
      today: "Hoje",
      month: "mês",
      week: "semana",
      day: "dia",
    },
    dateClick: function (info) {
      modal.style.display = "block";
      document.getElementById("eventStart").value = info.dateStr;
      selectedEvent = null;
    },
    eventClick: function (info) {
      selectedEvent = info.event;

      document.getElementById("viewEventTitle").textContent = info.event.title;
      document.getElementById("viewEventStart").textContent = info.event.start
        ? info.event.start.toLocaleString("pt-BR")
        : "Não especificado";
      document.getElementById("viewEventEnd").textContent = info.event.end
        ? info.event.end.toLocaleString("pt-BR")
        : "Não especificado";

      viewModal.style.display = "block";
    },
  });

  calendar.render();

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  closeViewModalBtn.addEventListener("click", function () {
    viewModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
    if (event.target === viewModal) {
      viewModal.style.display = "none";
    }
  });

  document
  .getElementById("addEventButton")
  .addEventListener("click", async function () {
    const title = document.getElementById("eventTitle").value.trim();
    const start = document.getElementById("eventStart").value.trim();
    const startTime = document.getElementById("eventStartTime").value.trim();
    const end = document.getElementById("eventEnd").value.trim();
    const endTime = document.getElementById("eventEndTime").value.trim();

    // Validação dos campos obrigatórios
    if (!title || !start || !startTime) {
      alert(
        "Por favor, preencha todos os campos obrigatórios (Título, Data e Hora de Início)."
      );
      return;
    }


    const startDateTime = `${start}T${startTime}`;
    const endDateTime = end && endTime ? `${end}T${endTime}` : null;

    const eventData = {
      title: title,
      start: startDateTime, 
      ...(endDateTime && { end: endDateTime }),
    };

    try {
 
      calendar.addEvent(eventData);

      let habits = JSON.parse(localStorage.getItem("habits")) || [];
      habits.push(eventData);
      localStorage.setItem("habits", JSON.stringify(habits));

      modal.style.display = "none";
      document.getElementById("eventForm").reset();
    } catch (error) {
      console.error("Erro ao adicionar o evento:", error);
    }
  });


  document
    .getElementById("editEventButton")
    .addEventListener("click", function () {
      if (selectedEvent) {
        document.getElementById("eventTitle").value = selectedEvent.title;
        document.getElementById("eventStart").value = selectedEvent.start
          ? selectedEvent.start.toISOString().split("T")[0]
          : "";
        document.getElementById("eventStartTime").value = selectedEvent.start
          ? selectedEvent.start.toISOString().split("T")[1].substring(0, 5)
          : "";
        document.getElementById("eventEnd").value = selectedEvent.end
          ? selectedEvent.end.toISOString().split("T")[0]
          : "";
        document.getElementById("eventEndTime").value = selectedEvent.end
          ? selectedEvent.end.toISOString().split("T")[1].substring(0, 5)
          : "";

        viewModal.style.display = "none";
        modal.style.display = "block";
      }
    });

  document
    .getElementById("removeEventBtn")
    .addEventListener("click", function () {
      if (selectedEvent) {
        const confirmDelete = confirm("Tem certeza que deseja excluir ?");

        if (confirmDelete) {
          selectedEvent.remove();

          let habits = JSON.parse(localStorage.getItem("habits")) || [];
          habits.filter(
            (habit) =>
              habit.title !== selectedEvent.title ||
              habit.start !== selectedEvent.start.toISOString()
          );
          localStorage.setItem("habits", JSON.stringify(habits));

          viewModal.style.display = "none";
          alert("Habito excluído com sucesso ! ");
        }
      }
    });
});
