const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Change these two based on the file/event to convert drafts from
const inputFilePath = path.join(__dirname, 'TeamComps.csv');  // Change to your actual CSV file name
const outputFilePath = path.join(__dirname, 'compsData.js');  // Change output to compsData.js

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Process each row into a structured team composition object
    const compData = {
      team1: {
        pokemon: [
          row["T1Poke1"] || "",
          row["T1Poke2"] || "",
          row["T1Poke3"] || "",
          row["T1Poke4"] || "",
          row["T1Poke5"] || ""
        ],
        moves: [
          { move1: row["T1Poke1Move1"] || "", move2: row["T1Poke1Move2"] || "" },
          { move1: row["T1Poke2Move1"] || "", move2: row["T1Poke2Move2"] || "" },
          { move1: row["T1Poke3Move1"] || "", move2: row["T1Poke3Move2"] || "" },
          { move1: row["T1Poke4Move1"] || "", move2: row["T1Poke4Move2"] || "" },
          { move1: row["T1Poke5Move1"] || "", move2: row["T1Poke5Move2"] || "" }
        ],
        bans: [
          row["T1Ban1"] || "",
          row["T1Ban2"] || ""
        ],
        name: row["T1Name"] || "",
        region: row["T1Region"] || "",
        players: [
          row["T1Player1"] || "",
          row["T1Player2"] || "",
          row["T1Player3"] || "",
          row["T1Player4"] || "",
          row["T1Player5"] || ""
        ],
      },
      team2: {
        pokemon: [
          row["T2Poke1"] || "",
          row["T2Poke2"] || "",
          row["T2Poke3"] || "",
          row["T2Poke4"] || "",
          row["T2Poke5"] || ""
        ],
        moves: [
          { move1: row["T2Poke1Move1"] || "", move2: row["T2Poke1Move2"] || "" },
          { move1: row["T2Poke2Move1"] || "", move2: row["T2Poke2Move2"] || "" },
          { move1: row["T2Poke3Move1"] || "", move2: row["T2Poke3Move2"] || "" },
          { move1: row["T2Poke4Move1"] || "", move2: row["T2Poke4Move2"] || "" },
          { move1: row["T2Poke5Move1"] || "", move2: row["T2Poke5Move2"] || "" }
        ],
        bans: [
          row["T2Ban1"] || "",
          row["T2Ban2"] || ""
        ],
        name: row["T2Name"] || "",
        region: row["T2Region"] || "",
        players: [
          row["T2Player1"] || "",
          row["T2Player2"] || "",
          row["T2Player3"] || "",
          row["T2Player4"] || "",
          row["T2Player5"] || ""
        ],
      },
      firstPick: row["FirstPick"] || "",
      winningTeam: parseInt(row["WinningTeam"]) || 0,
      event: row["Event"] || "",
      matchDate: row["MatchDate"] || ""
    };
    
    results.push(compData);
  })
  .on('end', () => {
    const jsContent = `const compsData = ${JSON.stringify(results, null, 2)};

module.exports = compsData;`;
    
    fs.writeFileSync(outputFilePath, jsContent, 'utf8');
    console.log('Conversion complete! Check compsData.js');
  });