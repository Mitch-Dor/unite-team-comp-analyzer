import { useState } from 'react';
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

function StatsBarChart({ data, orderBy }) {
  const [showPokemonData, setShowPokemonData] = useState(false);
  
  return (
    <>
      {!showPokemonData && <BaseDataChart data={data} orderBy={orderBy} setShowPokemonData={setShowPokemonData} />}
      {showPokemonData && <PokemonDataChart data={data} setShowPokemonData={setShowPokemonData} />}
    </>
  );
}

function BaseDataChart({ data, orderBy, setShowPokemonData }) {
  const chartData = {
    labels: (() => { // x-axis labels
      switch(orderBy) {
        case 'ban':
          return ['Ban Rate'];
        case 'pick':
          return ['Pick Rate'];
        case 'presence':
          return ['Presence'];
        case 'win':
          return ['Win Rate'];
        case 'pickOrder':
          return ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6'];
        default:
          return ['Ban Rate', 'Pick Rate', 'Presence', 'Win Rate'];
      }
    })(),
    datasets: [
      {
        label: 'Stats',
        data: (() => { // Data itself in each bar
          switch(orderBy) {
            case 'ban':
              return [data.ban_rate];
            case 'pick':
              return [data.pick_rate];
            case 'presence':
              return [data.presence];
            case 'win':
              return [data.win_rate];
            case 'pickOrder':
              return [data.pick_round_1, data.pick_round_2, data.pick_round_3, data.pick_round_4, data.pick_round_5, data.pick_round_6];
            default:
              return [data.ban_rate, data.pick_rate, data.presence, data.win_rate];
          }
        })(),
        backgroundColor: (() => { // Color of each bar
          switch(orderBy) {
            case 'ban':
              return ['rgba(255, 99, 132, 0.6)'];
            case 'pick':
              return ['rgba(54, 162, 235, 0.6)'];
            case 'presence':
              return ['rgba(255, 206, 86, 0.6)'];
            case 'win':
              return ['rgba(75, 192, 192, 0.6)'];
            case 'pickOrder':
              return ['rgba(75, 192, 192, 0.6)'];
            default:
              return [
                'rgba(255, 99, 132, 0.6)',  // Red for Ban Rate
                'rgba(54, 162, 235, 0.6)',  // Blue for Pick Rate
                'rgba(255, 206, 86, 0.6)',  // Yellow for Presence
                'rgba(75, 192, 192, 0.6)'  // Green for Win Rate
              ];
          }
        })(),
        borderColor: (() => { // Border color of each bar
          switch(orderBy) {
            case 'ban':
              return ['rgba(255, 99, 132, 1)'];
            case 'pick':
              return ['rgba(54, 162, 235, 1)'];
            case 'presence':
              return ['rgba(255, 206, 86, 1)'];
            case 'win':
              return ['rgba(75, 192, 192, 1)'];
            case 'pickOrder':
              return ['rgba(75, 192, 192, 1)'];
            default:
              return [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
              ];
          }
        })(),
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
      tooltip: { // When hovering over a bar, this is the hover box.
        callbacks: orderBy !== "pickOrder" ? {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        } : {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
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
        max: orderBy !== "pickOrder" ? 100 : 10, // Set max to 100
        ticks: orderBy !== "pickOrder" ? { // y axis labels
          callback: function(value) {
            return value + '%'; // Add percentage sign
          },
        } : {
          callback: function(value) {
            return value;
          },
        }
      },
    },
    barPercentage: 0.85,
    categoryPercentage: 0.85,
  };

  return (
    <div style={{ height: '250px', width: '100%' }} onClick={() => setShowPokemonData(true)}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function PokemonDataChart({ data, setShowPokemonData }) {
  const chartData = {
    labels: ['Ban Rate', 'Pick Rate', 'Presence', 'Win Rate', 'Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', "Picks " + data.movesets[0].move_1 + " + " + data.movesets[0].move_2, "Wins " + data.movesets[0].move_1 + " + " + data.movesets[0].move_2, "Picks " + data.movesets[1].move_1 + " + " + data.movesets[1].move_2, "Wins " + data.movesets[1].move_1 + " + " + data.movesets[1].move_2, "Picks " + data.movesets[2].move_1 + " + " + data.movesets[2].move_2, "Wins " + data.movesets[2].move_1 + " + " + data.movesets[2].move_2, "Picks " + data.movesets[3].move_1 + " + " + data.movesets[3].move_2, "Wins " + data.movesets[3].move_1 + " + " + data.movesets[3].move_2], // x-axis labels
    datasets: [
      {
        label: 'Stats',
        data: [data.ban_rate, data.pick_rate, data.presence, data.win_rate, data.pick_round_1, data.pick_round_2, data.pick_round_3, data.pick_round_4, data.pick_round_5, data.pick_round_6, data.movesets[0].requested_usages, data.movesets[0].requested_wins, data.movesets[1].requested_usages, data.movesets[1].requested_wins, data.movesets[2].requested_usages, data.movesets[2].requested_wins, data.movesets[3].requested_usages, data.movesets[3].requested_wins], // Data itself in each bar
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)'], // Color of each bar
        borderColor: [], // Border color of each bar
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
      tooltip: { // When hovering over a bar, this is the hover box.
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
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
        ticks: { // y axis labels
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
    <div style={{ height: '250px', width: '100%' }} onClick={() => setShowPokemonData(false)}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default StatsBarChart;