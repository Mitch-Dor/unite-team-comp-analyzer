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
        backgroundColor: 'rgba(75,192,192,0.4)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default StatsBarChart;