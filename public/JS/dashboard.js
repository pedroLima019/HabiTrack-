document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("myChart").getContext("2d");

  const data = {
    labels: ["Concluídos", "Não Concluídos", "Progresso (%)"],
    datasets: [
      {
        label: "Monitoramento de Hábitos",
        data: [0, 0, 0],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "bar", // Pode ser alterado para 'pie' ou 'doughnut'
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Progresso dos Hábitos",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  const progressChart = new Chart(ctx, config);

  function updateChart(habits) {
    const completed = habits.filter((habit) => habit.completed).length;
    const notCompleted = habits.length - completed;
    const progress =
      habits.length > 0 ? ((completed / habits.length) * 100).toFixed(2) : 0;

    data.datasets[0].data = [completed, notCompleted, progress];
    progressChart.update();
  }

  
  const storedHabits = JSON.parse(localStorage.getItem("habits")) || [];
  updateChart(storedHabits);

  document
    .getElementById("addEventButton")
    .addEventListener("click", function () {
      const habits = JSON.parse(localStorage.getItem("habits")) || [];
      updateChart(habits);
    });

  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("complete-habit")) {
      const habitIndex = e.target.dataset.index;
      const habits = JSON.parse(localStorage.getItem("habits")) || [];
      if (habits[habitIndex]) {
        habits[habitIndex].completed = true;
        localStorage.setItem("habits", JSON.stringify(habits));
        updateChart(habits);
      }
    }
  });
});
