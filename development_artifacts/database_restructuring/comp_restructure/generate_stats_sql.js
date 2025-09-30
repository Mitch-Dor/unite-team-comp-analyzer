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

// Generate SQL UPDATE statements for picks table to add position_played
function generatePicksPositionSQL(picksPositionData) {
    let sql = '-- Update picks table with position_played data\n';
    sql += '-- This will update existing picks with their position_played information\n\n';
    
    const updates = picksPositionData.map(pick => {
        const compId = pick.comp_id;
        const pokemonId = pick.pokemon_id;
        const positionPlayed = pick.position_played;
        
        return `UPDATE picks SET position_played = '${positionPlayed}' WHERE comp_id = ${compId} AND pokemon_id = ${pokemonId};`;
    });
    
    sql += updates.join('\n') + '\n\n';
    return sql;
}

// Generate SQL INSERT statements for pokemon_performance table
function generatePokemonPerformanceSQL(pokemonPerformanceData) {
    let sql = '-- Pokemon performance data\n';
    sql += '-- Insert performance statistics for each pokemon in each comp\n\n';
    
    sql += 'INSERT INTO pokemon_performance (comp_id, pokemon_id, kills, assists, points_scored, damage_dealt, damage_taken, damage_healed) VALUES\n';
    
    const values =  pokemonPerformanceData.map(row => {
        const compId = row.comp_id;
        const pokemonId = row.pokemon_id;
        const kills = row.kills || 0;
        const assists = row.assists || 0;
        const pointsScored = row.points_scored || 0;
        const damageDealt = row.damage_dealt || 0;
        const damageTaken = row.damage_taken || 0;
        const damageHealed = row.damage_healed || 0;
        
        return `(${compId}, ${pokemonId}, ${kills}, ${assists}, ${pointsScored}, ${damageDealt}, ${damageTaken}, ${damageHealed})`;
    });
    
    sql += values.join(',\n') + '\n';
    return sql;
}

// Main function to generate SQL files for stats data
function generateStatsSQLFiles() {
    try {
        // Read CSV files
        const picksPositionData = readCSV(path.join(__dirname, 'Stats To Enter - picks_position.csv'));
        const pokemonPerformanceData = readCSV(path.join(__dirname, 'Stats To Enter - pokemon_performance.csv'));
        
        console.log(`Loaded ${picksPositionData.length} picks position records and ${pokemonPerformanceData.length} pokemon performance records`);
        
        // Generate SQL content
        let allSQL = '-- Generated SQL for stats data\n';
        allSQL += '-- Generated on: ' + new Date().toISOString() + '\n\n';
        
        // Add picks position updates
        allSQL += generatePicksPositionSQL(picksPositionData);
        
        // Add pokemon performance inserts
        allSQL += generatePokemonPerformanceSQL(pokemonPerformanceData);
        
        // Write to file
        const outputPath = path.join(__dirname, 'stats_data.sql');
        fs.writeFileSync(outputPath, allSQL, 'utf8');
        
        console.log(`Stats SQL file generated successfully: ${outputPath}`);
        
        // Also create individual files
        const outputDir = path.join(__dirname, 'generated_sql');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        
        fs.writeFileSync(path.join(outputDir, 'picks_position_updates.sql'), generatePicksPositionSQL(picksPositionData), 'utf8');
        fs.writeFileSync(path.join(outputDir, 'pokemon_performance.sql'), generatePokemonPerformanceSQL(pokemonPerformanceData), 'utf8');
        
        console.log('Individual stats SQL files created in generated_sql directory');
        
    } catch (error) {
        console.error('Error generating stats SQL files:', error);
    }
}

// Run the generation
generateStatsSQLFiles();
