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
      OtherAttr: row["Other Attr"] || undefined,
    });
  })
  .on('end', () => {
    const jsContent = `const pokemonData = ${JSON.stringify(results, null, 2)};

export default pokemonData;`;
    
    fs.writeFileSync(outputFilePath, jsContent, 'utf8');
    console.log('Conversion complete! Check pokemonData.js');
  });