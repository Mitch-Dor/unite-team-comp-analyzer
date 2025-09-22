const fs = require('fs');
const path = require('path');

// Read CSV files
function readCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').replace(/\r/g, ''));
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            const value = values[index];
            obj[header] = value ? value.replace(/"/g, '').replace(/\r/g, '') : null;
        });
        return obj;
    });
}

// Generate SQL INSERT statements for matches table
function generateMatchesSQL(matchesData) {
    let sql = '-- Matches table data\n';
    sql += 'INSERT INTO matches (match_id, set_id, comp_1_id, comp_2_id) VALUES\n';
    
    const values = matchesData.map(match => {
        return `(${match.match_id}, ${match.set_id}, ${match.team_1_comp_id}, ${match.team_2_comp_id})`;
    });
    
    sql += values.join(',\n') + ';\n\n';
    return sql;
}

// Generate SQL INSERT statements for comps table
function generateCompsSQL(compsData, matchesData) {
    let sql = '-- Comps table data\n';
    sql += 'INSERT INTO comps (comp_id, did_win, first_pick, team_id) VALUES\n';
    
    // Create a map to find team_id for each comp_id
    const compToTeamMap = {};
    matchesData.forEach(match => {
        compToTeamMap[match.team_1_comp_id] = match.team_1_id;
        compToTeamMap[match.team_2_comp_id] = match.team_2_id;
    });
    
    const values = compsData.map(comp => {
        const teamId = compToTeamMap[comp.comp_id] || 1; // Default to 1 if not found
        
        return `(${comp.comp_id}, ${comp.did_win === '1' ? 'true' : 'false'}, ${comp.first_pick === '1' ? 'true' : 'false'}, ${teamId})`;
    });
    
    sql += values.join(',\n') + ';\n\n';
    return sql;
}

// Generate SQL INSERT statements for picks table
function generatePicksSQL(compsData, matchesData) {
    let sql = '-- Picks table data\n';
    sql += 'INSERT INTO picks (comp_id, pokemon_id, pick_position, player_id, move_1_id, move_2_id) VALUES\n';
    
    // Create a map to find player IDs for each comp_id
    const compToPlayersMap = {};
    matchesData.forEach(match => {
        // Team 1 players
        compToPlayersMap[match.team_1_comp_id] = [
            match.team_1_player_1,
            match.team_1_player_2,
            match.team_1_player_3,
            match.team_1_player_4,
            match.team_1_player_5
        ];
        
        // Team 2 players
        compToPlayersMap[match.team_2_comp_id] = [
            match.team_2_player_1,
            match.team_2_player_2,
            match.team_2_player_3,
            match.team_2_player_4,
            match.team_2_player_5
        ];
    });
    
    const values = [];
    
    compsData.forEach(comp => {
        const players = compToPlayersMap[comp.comp_id];
        const firstPick = comp.first_pick === '1';
        
        // Define pick positions based on first pick status
        const pickPositions = firstPick ? [1, 4, 5, 8, 9] : [2, 3, 6, 7, 10];
        
        // Process each pokemon (1-5)
        for (let i = 1; i <= 5; i++) {
            const pokemonId = comp[`pokemon_${i}`];
            if (pokemonId && players && players[i - 1]) {
                const move1Id = comp[`pokemon_${i}_move_1`];
                const move2Id = comp[`pokemon_${i}_move_2`];
                const playerId = players[i - 1];
                const pickPosition = pickPositions[i - 1]; // Use the correct draft order position
                
                values.push(`(${comp.comp_id}, ${pokemonId}, ${pickPosition}, ${playerId}, ${move1Id}, ${move2Id})`);
            }
        }
    });
    
    sql += values.join(',\n') + ';\n\n';
    return sql;
}

// Generate SQL INSERT statements for bans table
function generateBansSQL(matchesData) {
    let sql = '-- Bans table data\n';
    sql += 'INSERT INTO bans (comp_id, pokemon_id, ban_position) VALUES\n';
    
    const values = [];
    
    matchesData.forEach(match => {
        // Team 1 bans (first_pick team)
        if (match.team_1_ban_1) {
            values.push(`(${match.team_1_comp_id}, ${match.team_1_ban_1}, 1)`);
        }
        if (match.team_1_ban_2) {
            values.push(`(${match.team_1_comp_id}, ${match.team_1_ban_2}, 3)`);
        }
        
        // Team 2 bans (second_pick team)
        if (match.team_2_ban_1) {
            values.push(`(${match.team_2_comp_id}, ${match.team_2_ban_1}, 2)`);
        }
        if (match.team_2_ban_2) {
            values.push(`(${match.team_2_comp_id}, ${match.team_2_ban_2}, 4)`);
        }
    });
    
    sql += values.join(',\n') + ';\n\n';
    return sql;
}

// Main function to generate all SQL files
function generateSQLFiles() {
    try {
        // Read CSV files
        const compsData = readCSV(path.join(__dirname, 'professional_comps_dump.csv'));
        const matchesData = readCSV(path.join(__dirname, 'professional_matches_dump.csv'));
        
        console.log(`Loaded ${compsData.length} comps and ${matchesData.length} matches`);
        
        // Generate SQL content
        let allSQL = '-- Generated SQL for new database structure\n';
        allSQL += '-- Generated on: ' + new Date().toISOString() + '\n\n';
        
        allSQL += generateMatchesSQL(matchesData);
        allSQL += generateCompsSQL(compsData, matchesData);
        allSQL += generatePicksSQL(compsData, matchesData);
        allSQL += generateBansSQL(matchesData);
        
        // Write to file
        const outputPath = path.join(__dirname, 'generated_data.sql');
        fs.writeFileSync(outputPath, allSQL, 'utf8');
        
        console.log(`SQL file generated successfully: ${outputPath}`);
        
        // Also create individual files for each table
        const outputDir = path.join(__dirname, 'generated_sql');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        
        fs.writeFileSync(path.join(outputDir, 'matches.sql'), generateMatchesSQL(matchesData), 'utf8');
        fs.writeFileSync(path.join(outputDir, 'comps.sql'), generateCompsSQL(compsData, matchesData), 'utf8');
        fs.writeFileSync(path.join(outputDir, 'picks.sql'), generatePicksSQL(compsData, matchesData), 'utf8');
        fs.writeFileSync(path.join(outputDir, 'bans.sql'), generateBansSQL(matchesData), 'utf8');
        
        console.log('Individual SQL files created in generated_sql directory');
        
    } catch (error) {
        console.error('Error generating SQL files:', error);
    }
}

// Run the generation
generateSQLFiles();
