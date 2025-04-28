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

  // Create a custom title with an image
  const TitleWithImage = {
    id: 'titleWithImage',
    beforeDraw(chart) {
      const { ctx } = chart;
      const { top, left, right, bottom, width, height } = chart.chartArea;
      
      // Calculate title position (centered at the top)
      const titleText = data.pokemon_name;
      const titleX = (left + right) / 2;
      const titleY = 22; // Fixed position further down from the top
      
      // Set title font
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      
      // Calculate text width
      const textWidth = ctx.measureText(titleText).width;
      
      // Draw the title text
      ctx.fillText(titleText, titleX, titleY);
      
      // Load and draw image
      const image = new Image();
      image.src = `/assets/Draft/headshots/${data.pokemon_name}.png`;
      
      // Calculate image dimensions and position
      const imgSize = 28;
      const imgX = titleX - (textWidth / 2) - imgSize - 8;
      const imgY = titleY - imgSize / 2;
      
      // Draw circular background with border for the image
      ctx.beginPath();
      ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2 + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Always reset the image when the pokemon changes
      if (chart.titleImage && chart.titlePokemon !== data.pokemon_name) {
        chart.titleImage = null;
      }
      
      // Draw the image when it loads
      image.onload = () => {
        // Save the image to the chart for reference
        chart.titleImage = image;
        chart.titlePokemon = data.pokemon_name;
        
        // Create a circular clipping region
        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw the image inside the clipping region
        ctx.drawImage(image, imgX, imgY, imgSize, imgSize);
        ctx.restore();
      };
    },
    // Add afterEvent to redraw the image on hover
    afterEvent(chart, args) {
      if (chart.titleImage) {
        const { ctx } = chart;
        const { top, left, right } = chart.chartArea;
        
        // Get the stored title text
        const titleText = data.pokemon_name;
        const titleX = (left + right) / 2;
        const titleY = 22;
        
        // Check if the pokemon has changed
        if (chart.titlePokemon !== data.pokemon_name) {
          return; // Skip drawing the old image if pokemon changed
        }
        
        // Calculate text width and image position
        ctx.font = 'bold 16px Arial';
        const textWidth = ctx.measureText(titleText).width;
        
        const imgSize = 28;
        const imgX = titleX - (textWidth / 2) - imgSize - 8;
        const imgY = titleY - imgSize / 2;
        
        // Redraw circular background with border
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2 + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Redraw the image in a circular clip
        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(chart.titleImage, imgX, imgY, imgSize, imgSize);
        ctx.restore();
        
        // Redraw the title text
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        ctx.fillText(titleText, titleX, titleY);
      }
    }
  };
  
  return (
    <>
      {!showPokemonData && <BaseDataChart data={data} orderBy={orderBy} setShowPokemonData={setShowPokemonData} titleWithImage={TitleWithImage} />}
      {showPokemonData && <PokemonDataChart data={data} setShowPokemonData={setShowPokemonData} titleWithImage={TitleWithImage} />}
    </>
  );
}

function BaseDataChart({ data, orderBy, setShowPokemonData, titleWithImage }) {
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
        display: false, // We'll use custom title plugin instead
      },
      tooltip: { // When hovering over a bar, this is the hover box.
        bodyFont: {
          size: 10 // Making the tooltip text 1 point smaller
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
    layout: {
      padding: {
        top: 50 // Adds more space at the top
      }
    },
    barPercentage: 0.85,
    categoryPercentage: 0.85,
  };

  return (
    <div style={{ height: '250px', width: '100%' }} onClick={() => setShowPokemonData(true)}>
      <Bar data={chartData} options={options} plugins={[titleWithImage]} key={data.pokemon_name} />
    </div>
  );
}

function PokemonDataChart({ data, setShowPokemonData, titleWithImage }) {
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
            'rgba(75, 192, 192, 0.6)',  // Round 1
            'rgba(75, 192, 192, 0.6)',  // Round 2
            'rgba(75, 192, 192, 0.6)',  // Round 3
            'rgba(75, 192, 192, 0.6)',  // Round 4
            'rgba(75, 192, 192, 0.6)',  // Round 5
            'rgba(75, 192, 192, 0.6)'   // Round 6
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
        display: false, // We'll use custom title plugin instead
      },
      tooltip: { // When hovering over a bar, this is the hover box.
        bodyFont: {
          size: 10 // Making the tooltip text 1 point smaller
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
            size: 8
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
    layout: {
      padding: {
        top: 50 // Adds more space at the top
      }
    },
    barPercentage: 0.85,
    categoryPercentage: 0.85,
  };

  return (
    <div style={{ height: '250px', width: '100%' }} onClick={() => setShowPokemonData(false)}>
      <Bar data={chartData} options={options} plugins={[titleWithImage]} key={data.pokemon_name} />
    </div>
  );
}

export default StatsBarChart;