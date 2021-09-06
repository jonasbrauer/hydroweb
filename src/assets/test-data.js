export const planetChartData = {
  type: 'line',
  data: {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        data: [1.2, 1.1, 1.0, 0.9, 1.4, 1.3, 1.3],
        backgroundColor: '#8FBC8B',
        borderColor: '#1E5631',
        borderWidth: 3,
      },
    ],
  },
  options: {
    legend: {
      display: false,
    },
    responsive: true,
    lineTension: 1,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            padding: 25,
          },
        },
      ],
    },
  },
};

export default planetChartData;
