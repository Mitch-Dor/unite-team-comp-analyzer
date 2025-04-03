const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const inputFilePath = path.join(__dirname, 'Traits & Matches - Traits Trial.csv');
const outputFilePath = path.join(__dirname, 'pokemonData.js');

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    results.push({
      Name: row["Name"],
      EarlyGame: row["Early Game"],
      MidGame: row["Mid Game"],
      LateGame: row["Late Game"],
      Mobility: row["Mobility"],
      Range: row["Range"],
      Bulk: row["Bulk"],
      Damage: row["Damage"],
      DamageType: row["Damage Type"],
      DamageAffect: row["Damage Affect"],
      CC: row["CC"],
      PlayStyle: row["Play Style"],
      Classification: row["Classification"],
      Class: row["Class"],
      OtherAttr: row["Other Attr"] || "None",
      CanEXPShare: row["CanEXPShare"] || "None",
      CanTopLaneCarry: row["CanTopLaneCarry"] || "None",
      CanJungleCarry: row["CanJungleCarry"] || "None",
      CanBottomLaneCarry: row["CanBottomLaneCarry"] || "None",
      BestLane: row["BestLane"] || "None",
      AssumedMove1: row["Assumed Move 1"] || "None",
      AssumedMove2: row["Assumed Move 2"] || "None"
    });
  })
  .on('end', () => {
    const jsContent = `const pokemonData = ${JSON.stringify(results, null, 2)};

module.exports = pokemonData;`;
    
    fs.writeFileSync(outputFilePath, jsContent, 'utf8');
    console.log('Conversion complete! Check pokemonData.js');
  });