const ctx = document.getElementById("timeline");

Chart.defaults.backgroundColor = '#9BD0F5';

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        backgroundColor: '#9BD0F5',
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});


const cretaceous = document.getElementById('cretaceous').getContext('2d');

const data = {
  labels: ['Tyrannosaurus rex', 'Triceratops', 'Velociraptor', 'Stegosaurus', 'Brontosaurus'],
  datasets: [{
    label: 'Cretaceous Period Dinosaurs',
    data: [12, 8, 6, 4, 2],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
    ],
    borderWidth: 1,
  }],
};

const options = {
  title: {
    display: true,
    text: 'Cretaceous Period Dinosaurs',
  },
};

const cretaceousChart = new Chart(cretaceous, {
  type: 'line',
  data: data,
  options: options,
});