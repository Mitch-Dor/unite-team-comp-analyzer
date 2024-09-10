# Copy pasted from ChatGPT

import csv

def convert_to_csv(input_filename, output_filename):
    # Read data from the input file
    with open(input_filename, 'r', encoding='utf-8') as file:
        data = file.read()
    
    # Split the input data into lines
    lines = data.strip().split('\n')
    
    # Define the CSV header based on the provided categories
    header = [
        "Team1Pokemon", "Team1Bans", "Team1Name", "Team1Region", "FirstPick?",
        "Team2Pokemon", "Team2Bans", "Team2Name", "Team2Region", "FirstPick?",
        "WinningTeam", "Event", "MatchDate"
    ]
    
    # Prepare the CSV data
    csv_data = [header]
    for line in lines:
        # Split each line into fields
        fields = line.split('|')
        # Handle the case where there might be fewer fields in the input data
        if len(fields) < 7:
            fields.extend([''] * (7 - len(fields)))  # Fill missing fields for each line
        
        # Separate FirstPick? and Team2Bans
        team1_bans = fields[1] if len(fields) > 1 else ''
        team1_name = fields[2] if len(fields) > 2 else ''
        team1_region = fields[3] if len(fields) > 3 else ''
        first_pick = fields[4] if len(fields) > 4 else ''
        
        team2_bans = fields[5] if len(fields) > 5 else ''
        team2_name = fields[6] if len(fields) > 6 else ''
        team2_region = fields[7] if len(fields) > 7 else ''
        winning_team = fields[8] if len(fields) > 8 else ''
        event = fields[9] if len(fields) > 9 else ''
        match_date = fields[10] if len(fields) > 10 else ''
        
        csv_data.append([
            fields[0], team1_bans, team1_name, team1_region, first_pick,
            team2_bans, team2_name, team2_region, first_pick,
            winning_team, event, match_date
        ])
    
    # Write data to the output CSV file
    with open(output_filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerows(csv_data)

# Example usage
convert_to_csv('records.txt', 'matches.csv')
