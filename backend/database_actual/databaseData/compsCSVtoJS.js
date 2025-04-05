const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Change these two based on the file/event to convert drafts from
const inputFilePath = path.join(__dirname, 'Traits & Matches - Traits Trial.csv');
const outputFilePath = path.join(__dirname, 'pokemonData.js');

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    results.push({
      name: row["Name"],
      early_game: row["Early Game"],
      mid_game: row["Mid Game"],
      late_game: row["Late Game"],
      mobility: row["Mobility"],
      range: row["Range"],
      bulk: row["Bulk"],
      damage: row["Damage"],
      damage_type: row["Damage Type"],
      damage_affect: row["Damage Affect"],
      cc: row["CC"],
      play_style: row["Play Style"],
      classification: row["Classification"],
      class: row["Class"],
      other_attr: row["Other Attr"] || "None",
      can_exp_share: row["CanEXPShare"] || "None",
      can_top_lane_carry: row["CanTopLaneCarry"] || "None",
      can_jungle_carry: row["CanJungleCarry"] || "None",
      can_bottom_lane_carry: row["CanBottomLaneCarry"] || "None",
      best_lane: row["BestLane"] || "None",
      assumed_move_1: row["Assumed Move 1"] || "None",
      assumed_move_2: row["Assumed Move 2"] || "None"
    });
  })
  .on('end', () => {
    const jsContent = `const pokemonData = ${JSON.stringify(results, null, 2)};

module.exports = pokemonData;`;
    
    fs.writeFileSync(outputFilePath, jsContent, 'utf8');
    console.log('Conversion complete! Check pokemonData.js');
  });