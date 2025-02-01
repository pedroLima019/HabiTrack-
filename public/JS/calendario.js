document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const modal = document.getElementById("eventModal");
  const viewModal = document.getElementById("viewEventModal");
  const closeBtn = document.querySelector("#eventModal .close");
  const closeViewModalBtn = document.querySelector("#viewEventModal .close");
  const completedCheckbox = document.getElementById("completed");
  let selectedEvent = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "pt-br",
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev, today",
      center: "title",
      right: "dayGridMonth, timeGridWeek, timeGridDay, next",
    },
    buttonText: { today: "Hoje", month: "Mês", week: "Semana", day: "Dia" },

    dateClick: (info) => {
      modal.style.display = "block";
      document.getElementById("eventStart").value = info.dateStr;
      selectedEvent = null;
    },

    eventClick: (info) => {
      selectedEvent = info.event;
      document.getElementById("viewEventTitle").textContent =
        selectedEvent.title;
      document.getElementById("viewEventStart").textContent =
        selectedEvent.start?.toLocaleString("pt-BR") || "Não especificado";
      document.getElementById("viewEventEnd").textContent =
        selectedEvent.end?.toLocaleString("pt-BR") || "Não especificado";

      const eventTitleElement = document.getElementById("viewEventTitle");
      
      const eventStartISO = selectedEvent.start.toISOString().split(".")[0] + "Z"
      const habits = JSON.parse(localStorage.getItem("habits")) || [];
      const habit = habits.find(
        (h) => h.title === selectedEvent.title && h.start === eventStartISO
      );

      completedCheckbox.checked = habit?.completed || false;
      eventTitleElement.classList.toggle("completed", habit?.completed);

      completedCheckbox.removeEventListener("change", updateHabitCompletion);
      completedCheckbox.addEventListener("change", () => {
        updateHabitCompletion(eventTitleElement);
      });
      viewModal.style.display = "block";
    },
  });

  function updateHabitCompletion(eventTitleElement) {
    const isChecked = completedCheckbox.checked;
    eventTitleElement.classList.toggle("completed", isChecked);
    selectedEvent.setProp("backgroundColor", isChecked ? "#4CAF50" : "#FF5722");
    selectedEvent.setProp("borderColor", isChecked ? "#4CAF50" : "#FF5722");

    const eventStartISO = selectedEvent.start.toISOString();
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    let habitIndex = habits.findIndex(
      (h) => h.title === selectedEvent.title && h.start === eventStartISO
    );

    if (habitIndex !== -1) {
      habits[habitIndex].completed = isChecked;
    } else {
      habits.push({
        title: selectedEvent.title,
        start: eventStartISO,
        completed: isChecked,
      });
    }

    localStorage.setItem("habits", JSON.stringify(habits));
  }

  calendar.render();

  let habits = JSON.parse(localStorage.getItem("habits")) || [];
  habits.forEach((habit) => {
    calendar.addEvent(habit);
  });

  function closeModal(modalElement) {
    modalElement.style.display = "none";
  }

  closeBtn.addEventListener("click", () => closeModal(modal));
  closeViewModalBtn.addEventListener("click", () => closeModal(viewModal));

  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
    if (event.target === viewModal) closeModal(viewModal);
  });

  document.getElementById("addEventButton").addEventListener("click", () => {
    const title = document.getElementById("eventTitle").value.trim();
    const start = document.getElementById("eventStart").value.trim();
    const startTime = document.getElementById("eventStartTime").value.trim();
    const end = document.getElementById("eventEnd").value.trim();
    const endTime = document.getElementById("eventEndTime").value.trim();

    if (!title || !start || !startTime) {
      alert(
        "Por favor, preencha todos os campos obrigatórios (Título, Data e Hora de Início). "
      );
      return;
    }

    const eventData = {
      title,
      start:
        new Date(`${start}T${startTime}`).toISOString().split(".")[0] + "Z",
      ...(end && endTime
        ? {
            end:
              new Date(`${end}T${endTime}`).toISOString().split(".")[0] + "Z",
          }
        : {}),
      completed: false,
    };

    calendar.addEvent(eventData);
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits.push(eventData);
    localStorage.setItem("habits", JSON.stringify(habits));
    closeModal(modal);
    document.getElementById("eventForm").reset();
  });

  document.getElementById("editEventButton").addEventListener("click", () => {
     if(!selectedEvent){
       alert("ERRO: Nenhum evento selecionado para edição.")
     }
    document.getElementById("eventTitle").value = selectedEvent.title;
    document.getElementById("eventStart").value = selectedEvent.start
      .toISOString()
      .split("T")[0];
    document.getElementById("eventStartTime").value = selectedEvent.start
      .toISOString()
      .split("T")[1]
      .substring(0, 5);
    document.getElementById("eventEnd").value =
      selectedEvent.end?.toISOString().split("T")[0] || "";
    document.getElementById("eventEndTime").value =
      selectedEvent.end?.toISOString().split("T")[1].substring(0, 5) || "";
    closeModal(viewModal);
    modal.style.display = "block";
  });

  document.getElementById("removeEventBtn").addEventListener("click", () => {
    if (!selectedEvent) return;
    if (!confirm("Tem certeza que deseja excluir ?")) return;

    selectedEvent.remove();
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    const eventStart = selectedEvent.start.toISOString().split(".")[0] + "Z";
    habits = habits.filter(
      (habit) =>
        habit.title !== selectedEvent.title || habit.start !== eventStart
    );

    localStorage.setItem("habits", JSON.stringify(habits));
    closeModal(viewModal);
    alert("Hábito excluído com sucesso!");
  });
});
