import { Bar } from 'react-chartjs-2';

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

  return <Bar data={chartData} />;
}

export default StatsBarChart;