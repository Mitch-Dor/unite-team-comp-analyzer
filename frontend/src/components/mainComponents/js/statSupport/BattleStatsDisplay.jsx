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
import MatchDisplay from '../proMatchSupport/MatchDisplay';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BattleStatsDisplay({ character, match, mode, orderBy, totalData }) {
  return (
    <div className="indivBattleStatItems">
      {mode === 'allPokemon' && <AllPokemonChart data={character} orderBy={orderBy} totalData={totalData} />}
      {mode === 'individual' && <MatchDisplaysChart data={match} />}
    </div>
  );
}

// By default display an individual little square per pokemon with:
  // kills, assists, and score as numbers.
  // dealt, taken, healed as white text on colored bars
  // number of times picked in each role as a bar chart
// When orderBy is not "all", make it one long graph the user can scroll down that has just that value shown on a bar graph 
function AllPokemonChart({ data, orderBy, totalData }) {
  let chartData = {};
  if (orderBy === 'all') {
    const numDataPoints = parseInt(data.num_times_top) + parseInt(data.num_times_exp_share_top) + parseInt(data.num_times_jungle) + parseInt(data.num_times_bot) + parseInt(data.num_times_exp_share_bot);
    chartData = {
      labels: ['Top Carry', 'Top EXP Share', 'Jungle Carry', 'Bot Carry', 'Bot EXP Share'], // x-axis
      datasets: [
      {
        label: 'Stats',
        data: [((data.num_times_top/numDataPoints)*100).toFixed(2), ((data.num_times_exp_share_top/numDataPoints)*100).toFixed(2), ((data.num_times_jungle/numDataPoints)*100).toFixed(2), ((data.num_times_bot/numDataPoints)*100).toFixed(2), ((data.num_times_exp_share_bot/numDataPoints)*100).toFixed(2)],
        backgroundColor:  ['rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(175, 75, 209, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(175, 75, 209, 1)'],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend to save space
      },
      title: {
        display: true,
        text: 'Positions Picked',
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
        callbacks: {
          label: function(context) {
            switch(context.label) {
              case 'Top Carry':
                return `${context.dataset.label}: ${context.raw}% (${data.num_times_top})`;
              case 'Top EXP Share':
                return `${context.dataset.label}: ${context.raw}% (${data.num_times_exp_share_top})`;
              case 'Jungle Carry':
                return `${context.dataset.label}: ${context.raw}% (${data.num_times_jungle})`;
              case 'Bot Carry':
                return `${context.dataset.label}: ${context.raw}% (${data.num_times_bot})`;
              case 'Bot EXP Share':
                return `${context.dataset.label}: ${context.raw}% (${data.num_times_exp_share_bot})`;
              default:
                return `${context.dataset.label}: ${context.raw}%`;
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
      <div className="allPokemonAllStatsDisplay">
        <div className="headshotAndNameRow">
          <img 
            src={`/assets/Draft/headshots/${data.pokemon_name}.png`} 
            alt={data.pokemon_name} 
            className="pokemon-icon"
          />
          <div>{data.pokemon_name}</div>
        </div>
        <div className="killsAssistsScoredDisplay">
          <div className="statNumber kills">{parseFloat(data.mean_kills).toFixed(2)}</div>
          <div className="statNumber assists">{parseFloat(data.mean_assists).toFixed(2)}</div>
          <div className="statNumber scored">{parseFloat(data.mean_scored).toFixed(2)}</div>
        </div>
        <div className="dealtTakenHealedDisplay">
          <div className="statBar dealt">
            <div className="statBarFill red" style={{width: '100%'}}></div>
            <span className="indivStatBarText">{parseFloat(data.mean_dealt).toFixed(2)}</span>
          </div>
          <div className="statBar taken">
            <div className="statBarFill blue" style={{width: '100%'}}></div>
            <span className="indivStatBarText">{parseFloat(data.mean_taken).toFixed(2)}</span>
          </div>
          <div className="statBar healed">
            <div className="statBarFill green" style={{width: '100%'}}></div>
            <span className="indivStatBarText">{parseFloat(data.mean_healed).toFixed(2)}</span>
          </div>
        </div>
        <div style={{ height: '100%', width: '284px', backgroundColor: 'white', borderRadius: '5px', padding: '8px' }}>
          <div style={{ minWidth: `50px` }}> {/* 60px per bar, adjust as needed */}
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    )
  } else {
    chartData = {
      labels: totalData.map(char => char.pokemon_name), // x-axis labels (pokemon names)
      datasets: [
      {
        label: 'Stats',
        data: (() => { // Data itself in each bar
          switch(orderBy) {
            case 'kills':
              return totalData.map(char => char.mean_kills);
            case 'assists':
              return totalData.map(char => char.mean_assists);
            case 'points':
              return totalData.map(char => char.mean_scored);
            case 'dealt':
              return totalData.map(char => char.mean_dealt);
            case 'taken':
              return totalData.map(char => char.mean_taken);
            case 'healed':
              return totalData.map(char => char.mean_healed);
            default:
              return [];
          }
        })(),
        backgroundColor: (() => {
          const color = (() => {
            switch(orderBy) {
              case 'kills': return 'rgba(255, 99, 132, 0.6)';
              case 'assists': return 'rgba(54, 162, 235, 0.6)';
              case 'points': return 'rgba(255, 206, 86, 0.6)';
              case 'dealt': return 'rgba(255, 99, 132, 0.6)';
              case 'taken': return 'rgba(54, 162, 235, 0.6)';
              case 'healed': return 'rgba(75, 192, 192, 0.6)';
              default: return 'rgba(255, 99, 132, 0.6)';
            }
          })();
          return totalData.map(() => color); // repeat the color for each bar
        })(),
        borderColor: (() => {
          const color = (() => {
            switch(orderBy) {
              case 'kills': return 'rgba(255, 99, 132, 1)';
              case 'assists': return 'rgba(54, 162, 235, 1)';
              case 'points': return 'rgba(255, 206, 86, 1)';
              case 'dealt': return 'rgba(255, 99, 132, 1)';
              case 'taken': return 'rgba(54, 162, 235, 1)';
              case 'healed': return 'rgba(75, 192, 192, 1)';
              default: return 'rgba(255, 99, 132, 1)';
            }
          })();
          return totalData.map(() => color); // repeat the color for each bar
        })(),
        borderWidth: 1,
      },
    ],
  }
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
        text: (() => {
          switch(orderBy) {
            case 'kills': return 'Kills';
            case 'assists': return 'Assists';
            case 'points': return 'Points Scored';
            case 'dealt': return 'Damage Dealt';
            case 'taken': return 'Damage Taken';
            case 'healed': return 'Damage Healed';
          }
        }),
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
        callbacks: {
          label: function(context) {
            switch(context.label) {
              default:
                return `${context.dataset.label}: ${context.raw}`;
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
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: { // y axis labels
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
    <div style={{ height: '100%', width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: `${totalData.length * 60}px` }}> {/* 60px per bar, adjust as needed */}
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

// Display comps the pokemon appeared in that match the criteria. The comp is displayed with each team, their pokemon, 
// and their moves represented with just the featured Pokemon having its data like kills listed with it. There must be a link to the VOD containing the match for VOD review.
function MatchDisplaysChart({ data }) {
  return (
    <MatchDisplay match={data} advancedDataMode={true} />
);

}

export default BattleStatsDisplay;