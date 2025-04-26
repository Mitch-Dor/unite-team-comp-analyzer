import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatsBarChart({ data }) {
  const chartData = {
    labels: ['Ban Rate', 'Pick Rate', 'Presence', 'Win Rate'],
    datasets: [
      {
        label: 'Stats',
        data: [data.ban_rate, data.pick_rate, data.presence, data.win_rate],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // Red for Ban Rate
          'rgba(54, 162, 235, 0.6)',  // Blue for Pick Rate
          'rgba(255, 206, 86, 0.6)',  // Yellow for Presence
          'rgba(75, 192, 192, 0.6)',  // Green for Win Rate
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend to save space
      },
      title: {
        display: true,
        text: data.pokemon_name,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100, // Set max to 100
        ticks: {
          callback: function(value) {
            return value + '%'; // Add percentage sign
          },
        }
      },
    },
    barPercentage: 0.85,
    categoryPercentage: 0.85,
  };

  return (
    <div style={{ height: '250px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default StatsBarChart;