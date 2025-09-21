const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Change these two based on the file/event to convert drafts from
const inputFilePath = path.join(__dirname, 'Traits & Matches - NAIC 2024.csv');  // Change to your actual CSV file name
const outputFilePath = path.join(__dirname, 'compsData.js');  // Change output to compsData.js

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Process each row as a single match record with column-by-column approach
    const matchData = {
      // Team 1 data
      t1poke1: row["T1Poke1"] || "",
      t1poke2: row["T1Poke2"] || "",
      t1poke3: row["T1Poke3"] || "",
      t1poke4: row["T1Poke4"] || "",
      t1poke5: row["T1Poke5"] || "",
      t1ban1: row["T1Ban1"] || "",
      t1ban2: row["T1Ban2"] || "",
      t1poke1move1: row["T1Poke1Move1"] || "",
      t1poke1move2: row["T1Poke1Move2"] || "",
      t1poke2move1: row["T1Poke2Move1"] || "",
      t1poke2move2: row["T1Poke2Move2"] || "",
      t1poke3move1: row["T1Poke3Move1"] || "",
      t1poke3move2: row["T1Poke3Move2"] || "",
      t1poke4move1: row["T1Poke4Move1"] || "",
      t1poke4move2: row["T1Poke4Move2"] || "",
      t1poke5move1: row["T1Poke5Move1"] || "",
      t1poke5move2: row["T1Poke5Move2"] || "",
      t1name: row["T1Name"] || "",
      t1region: row["T1Region"] || "",
      t1player1: row["T1Player1"] || "",
      t1player2: row["T1Player2"] || "",
      t1player3: row["T1Player3"] || "",
      t1player4: row["T1Player4"] || "",
      t1player5: row["T1Player5"] || "",
      
      // Team 2 data
      t2poke1: row["T2Poke1"] || "",
      t2poke2: row["T2Poke2"] || "",
      t2poke3: row["T2Poke3"] || "",
      t2poke4: row["T2Poke4"] || "",
      t2poke5: row["T2Poke5"] || "",
      t2ban1: row["T2Ban1"] || "",
      t2ban2: row["T2Ban2"] || "",
      t2poke1move1: row["T2Poke1Move1"] || "",
      t2poke1move2: row["T2Poke1Move2"] || "",
      t2poke2move1: row["T2Poke2Move1"] || "",
      t2poke2move2: row["T2Poke2Move2"] || "",
      t2poke3move1: row["T2Poke3Move1"] || "",
      t2poke3move2: row["T2Poke3Move2"] || "",
      t2poke4move1: row["T2Poke4Move1"] || "",
      t2poke4move2: row["T2Poke4Move2"] || "",
      t2poke5move1: row["T2Poke5Move1"] || "",
      t2poke5move2: row["T2Poke5Move2"] || "",
      t2name: row["T2Name"] || "",
      t2region: row["T2Region"] || "",
      t2player1: row["T2Player1"] || "",
      t2player2: row["T2Player2"] || "",
      t2player3: row["T2Player3"] || "",
      t2player4: row["T2Player4"] || "",
      t2player5: row["T2Player5"] || "",
      
      // Match data
      firstPick: row["FirstPick"] || "",
      winningTeam: parseInt(row["WinningTeam"]) || 0,
      event: row["Event"] || "",
      matchDate: row["MatchDate"] || "",
      vodUrl: row["VOD URL"] || ""
    };
    
    results.push(matchData);
  })
  .on('end', () => {
    const jsContent = `const compsData = ${JSON.stringify(results, null, 2)};

module.exports = compsData;`;
    
    fs.writeFileSync(outputFilePath, jsContent, 'utf8');
    console.log('Conversion complete! Check compsData.js');
  });