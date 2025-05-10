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
              return [((data.pick_round_1 / data.picks) * 100.0).toFixed(1), ((data.pick_round_2 / data.picks) * 100.0).toFixed(1), ((data.pick_round_3 / data.picks) * 100.0).toFixed(1), ((data.pick_round_4 / data.picks) * 100.0).toFixed(1), ((data.pick_round_5 / data.picks) * 100.0).toFixed(1), ((data.pick_round_6 / data.picks) * 100.0).toFixed(1)];
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
              return ['rgba(192, 75, 161, 0.6)'];
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
              return ['rgba(192, 75, 161, 0.6)'];
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
        bodyFont: {
          size: 10 // Making the tooltip text smaller
        },
        callbacks: orderBy !== "pickOrder" ? {
          label: function(context) {
            switch(context.label) {
              case "Ban Rate":
                return `${context.label}: ${data.bans} bans over ${data.total_matches} total matches (${context.raw}%)`;
              case "Pick Rate":
                return `${context.label}: ${data.picks} picks over ${data.total_matches} total matches (${context.raw}%)`;
              case "Presence":
                return `${context.label}: ${data.presence}% presence over ${data.total_matches} total matches (${context.raw}%)`;
              case "Win Rate":
                return `${context.label}: ${data.wins} wins over ${data.picks} total picks (${context.raw}%)`;
              default:
                return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        } : {
          label: function(context) {
            const roundMap = {
              'Round 1': { count: data.pick_round_1, label: 'round 1' },
              'Round 2': { count: data.pick_round_2, label: 'round 2' },
              'Round 3': { count: data.pick_round_3, label: 'round 3' },
              'Round 4': { count: data.pick_round_4, label: 'round 4' },
              'Round 5': { count: data.pick_round_5, label: 'round 5' },
              'Round 6': { count: data.pick_round_6, label: 'round 6' },
            };
            
            const roundInfo = roundMap[context.label];
            if (roundInfo) {
              return `${context.label}: ${roundInfo.count} ${roundInfo.label} picks over ${data.picks} total picks (${context.raw}%)`;
            }
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
        max: 100,
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
    <div style={{ height: '250px', width: '100%' }} onClick={() => setShowPokemonData(true)}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function PokemonDataChart({ data, setShowPokemonData }) {
  const chartData = {
    labels: (() => {
      const baseLabels = ['Ban Rate', 'Pick Rate', 'Presence', 'Win Rate', 'Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6'];
      
      // Add moveset labels only if they exist
      if (data.movesets && data.movesets.length > 0) {
        for (let i = 0; i < data.movesets.length; i++) {
          const moveset = data.movesets[i];
          if (moveset) {
            baseLabels.push(`Pick Rate ${moveset.move_1} + ${moveset.move_2}`);
            baseLabels.push(`Win Rate ${moveset.move_1} + ${moveset.move_2}`);
          }
        }
      }
      
      return baseLabels;
    })(),
    datasets: [
      {
        label: 'Stats',
        data: (() => {
          const baseData = [
            data.ban_rate, 
            data.pick_rate, 
            data.presence, 
            data.win_rate,
           ((data.pick_round_1 / data.picks) * 100).toFixed(1), 
           ((data.pick_round_2 / data.picks) * 100).toFixed(1), 
           ((data.pick_round_3 / data.picks) * 100).toFixed(1), 
           ((data.pick_round_4 / data.picks) * 100).toFixed(1), 
           ((data.pick_round_5 / data.picks) * 100).toFixed(1), 
           ((data.pick_round_6 / data.picks) * 100).toFixed(1)
          ];
          
          // Add moveset data only if they exist
          if (data.movesets && data.movesets.length > 0) {
            for (let i = 0; i < data.movesets.length; i++) {
              const moveset = data.movesets[i];
              if (moveset) {
                // Calculate pick rate for this moveset
                const pickRate = data.picks > 0 ? 
                  parseFloat(((moveset.requested_usages / data.picks) * 100).toFixed(1)) : 0;
                
                // Calculate win rate for this moveset
                const winRate = moveset.requested_usages > 0 ? 
                  parseFloat(((moveset.requested_wins / moveset.requested_usages) * 100).toFixed(1)) : 0;
                
                baseData.push(pickRate);
                baseData.push(winRate);
              }
            }
          }
          
          return baseData;
        })(),
        backgroundColor: (() => {
          const colors = [
            'rgba(255, 99, 132, 0.6)',  // Ban Rate
            'rgba(54, 162, 235, 0.6)',  // Pick Rate
            'rgba(255, 206, 86, 0.6)',  // Presence
            'rgba(75, 192, 192, 0.6)',  // Win Rate
            'rgba(192, 75, 161, 0.6)',  // Round 1
            'rgba(192, 75, 161, 0.6)',  // Round 2
            'rgba(192, 75, 161, 0.6)',  // Round 3
            'rgba(192, 75, 161, 0.6)',  // Round 4
            'rgba(192, 75, 161, 0.6)',  // Round 5
            'rgba(192, 75, 161, 0.6)'   // Round 6
          ];
          
          // Add colors for movesets
          if (data.movesets && data.movesets.length > 0) {
            for (let i = 0; i < data.movesets.length; i++) {
              if (data.movesets[i]) {
                // Add two colors for each moveset (pick rate and win rate)
                colors.push('rgba(153, 102, 255, 0.6)');
                colors.push('rgba(255, 159, 64, 0.6)');
              }
            }
          }
          
          return colors;
        })(),
        borderColor: [],
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
        bodyFont: {
          size: 8 // Making the tooltip text smaller to fit all the data with movesets
        },
        callbacks: {
          label: function(context) {
            switch(context.label) {
              case "Ban Rate":
                return `${context.label}: ${data.bans} bans over ${data.total_matches} total matches (${context.raw}%)`;
              case "Pick Rate":
                return `${context.label}: ${data.picks} picks over ${data.total_matches} total matches (${context.raw}%)`;
              case "Presence":
                return `${context.label}: ${data.presence}% presence over ${data.total_matches} total matches (${context.raw}%)`;
              case "Win Rate":
                return `${context.label}: ${data.wins} wins over ${data.picks} total picks (${context.raw}%)`;
              case "Round 1":
                return `${context.label}: ${data.pick_round_1} round 1 picks over ${data.picks} total picks (${context.raw}%)`;
              case "Round 2":
                return `${context.label}: ${data.pick_round_2} round 2 picks over ${data.picks} total picks (${context.raw}%)`;
              case "Round 3":
                return `${context.label}: ${data.pick_round_3} round 3 picks over ${data.picks} total picks (${context.raw}%)`;
              case "Round 4":
                return `${context.label}: ${data.pick_round_4} round 4 picks over ${data.picks} total picks (${context.raw}%)`;
              case "Round 5":
                return `${context.label}: ${data.pick_round_5} round 5 picks over ${data.picks} total picks (${context.raw}%)`;
              case "Round 6":
                return `${context.label}: ${data.pick_round_6} round 6 picks over ${data.picks} total picks (${context.raw}%)`;
              default:
                // Check if this is a moveset tooltip
                if (context.label.startsWith('Pick Rate ')) {
                  // Find the moveset data
                  const moveName = context.label.replace('Pick Rate ', '');
                  const movesetData = data.movesets.find(m => `${m.move_1} + ${m.move_2}` === moveName);
                  if (movesetData) {
                    return `${context.label}: ${movesetData.requested_usages} picks over ${data.picks} total picks (${context.raw}%)`;
                  }
                } else if (context.label.startsWith('Win Rate ')) {
                  // Find the moveset data
                  const moveName = context.label.replace('Win Rate ', '');
                  const movesetData = data.movesets.find(m => `${m.move_1} + ${m.move_2}` === moveName);
                  if (movesetData) {
                    return `${context.label}: ${movesetData.requested_wins} wins over ${movesetData.requested_usages} picks (${context.raw}%)`;
                  }
                }
                return `${context.label}: ${context.raw}%`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          font: {
            size: 7
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