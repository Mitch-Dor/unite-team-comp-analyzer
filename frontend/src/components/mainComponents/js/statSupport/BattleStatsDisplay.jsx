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
import SlickMatchDisplay from '../proMatchSupport/SlickMatchDisplay';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BattleStatsDisplay({ character, match, mode }) {
  return (
    <div className="battle-stats-display-container">
      {mode === 'allPokemon' && <AllPokemonChart data={character} />}
      {mode === 'individual' && <MatchDisplaysChart data={match} />}
    </div>
  );
}

// By default display an individual little square per pokemon with:
  // kills, assists, and score as numbers.
  // dealt, taken, healed as white text on colored bars
  // number of times picked in each role as a bar chart
// When orderBy is not "all", make it one long graph the user can scroll down that has just that value shown on a bar graph 
function AllPokemonChart({ data }) {
  let chartData = {};
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
    <div className="battle-stats-all-pokemon-all-stats-container">
      <div className="battle-stats-apas-headshot-and-name-row">
        <img 
          src={`/assets/Draft/headshots/${data.pokemon_name}.png`} 
          alt={data.pokemon_name} 
          className="battle-stats-apas-pokemon-icon"
        />
        <div>{data.pokemon_name}</div>
      </div>
      <div className="battle-stats-apas-kills-assists-scored-display">
        <div className="comp-display-statNumber kills">{parseFloat(data.mean_kills).toFixed(2)}</div>
        <div className="comp-display-statNumber assists">{parseFloat(data.mean_assists).toFixed(2)}</div>
        <div className="comp-display-statNumber scored">{parseFloat(data.mean_scored).toFixed(2)}</div>
      </div>
      <div className="battle-stats-apas-dealt-taken-healed-display">
        <div className="comp-display-statBar dealt">
          <div className="comp-display-statBarFill red" style={{width: '100%'}}></div>
          <span className="battle-stats-apas-stat-bar-text">{parseFloat(data.mean_dealt).toFixed(2)}</span>
        </div>
        <div className="comp-display-statBar taken">
          <div className="comp-display-statBarFill blue" style={{width: '100%'}}></div>
          <span className="battle-stats-apas-stat-bar-text">{parseFloat(data.mean_taken).toFixed(2)}</span>
        </div>
        <div className="comp-display-statBar healed">
          <div className="comp-display-statBarFill green" style={{width: '100%'}}></div>
          <span className="battle-stats-apas-stat-bar-text">{parseFloat(data.mean_healed).toFixed(2)}</span>
        </div>
      </div>
      <div style={{ height: '100%', width: '284px', backgroundColor: 'white', borderRadius: '5px', padding: '8px' }}>
        <div style={{ minWidth: `50px` }}> {/* 60px per bar, adjust as needed */}
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}

// Display comps the pokemon appeared in that match the criteria. The comp is displayed with each team, their pokemon, 
// and their moves represented with just the featured Pokemon having its data like kills listed with it. There must be a link to the VOD containing the match for VOD review.
function MatchDisplaysChart({ data }) {
  return (
    <div className="stats-slick-match-display-container">
      <SlickMatchDisplay match={data} team1_name={data.team1_name} team2_name={data.team2_name} advancedDataMode={true} />
    </div>
);

}

export default BattleStatsDisplay;