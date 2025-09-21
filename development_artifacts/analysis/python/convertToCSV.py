# Asked ChatGPT to write this for me to save time.

import csv

def convert_to_csv(input_filename, output_filename):
    # Read data from the input file
    with open(input_filename, 'r', encoding='utf-8') as file:
        data = file.read()
    
    # Split the input data into lines
    lines = data.strip().split('\n')
    
    # Define the CSV header with separate columns for each Pokemon and Ban
    header = [
        "Team1Pokemon1", "Team1Pokemon2", "Team1Pokemon3", "Team1Pokemon4", "Team1Pokemon5",
        "Team1Ban1", "Team1Ban2", "Team1Name", "Team1Region", "FirstPick?",
        "Team2Pokemon1", "Team2Pokemon2", "Team2Pokemon3", "Team2Pokemon4", "Team2Pokemon5",
        "Team2Ban1", "Team2Ban2", "Team2Name", "Team2Region", "FirstPick?",
        "WinningTeam", "Event", "MatchDate"
    ]
    
    # Prepare the CSV data
    csv_data = [header]
    
    # Process lines in groups of three
    for i in range(0, len(lines), 3):
        # Initialize empty fields for the data
        team1_pokemon = [''] * 5
        team1_bans = [''] * 2
        team1_name = ''
        team1_region = ''
        first_pick1 = ''
        
        team2_pokemon = [''] * 5
        team2_bans = [''] * 2
        team2_name = ''
        team2_region = ''
        first_pick2 = ''
        
        winning_team = ''
        event = ''
        match_date = ''
        
        # Process the first line (Team 1's information)
        if i < len(lines):
            fields = lines[i].split('|')
            team1_pokemon = fields[0].split(',') if len(fields) > 0 else [''] * 5
            team1_bans = fields[1].split(',') if len(fields) > 1 else [''] * 2
            team1_name = fields[2] if len(fields) > 2 else ''
            team1_region = fields[3] if len(fields) > 3 else ''
            first_pick1 = fields[4] if len(fields) > 4 else ''
        
        # Process the second line (Team 2's information)
        if i + 1 < len(lines):
            fields = lines[i + 1].split('|')
            team2_pokemon = fields[0].split(',') if len(fields) > 0 else [''] * 5
            team2_bans = fields[1].split(',') if len(fields) > 1 else [''] * 2
            team2_name = fields[2] if len(fields) > 2 else ''
            team2_region = fields[3] if len(fields) > 3 else ''
            first_pick2 = fields[4] if len(fields) > 4 else ''
        
        # Process the third line (Winning team, event, and match date)
        if i + 2 < len(lines):
            fields = lines[i + 2].split('|')
            winning_team = fields[0] if len(fields) > 0 else ''
            event = fields[1] if len(fields) > 1 else ''
            match_date = fields[2] if len(fields) > 2 else ''
        
        # Append the formatted row to csv_data
        csv_data.append([
            *team1_pokemon, *team1_bans, team1_name, team1_region, first_pick1,
            *team2_pokemon, *team2_bans, team2_name, team2_region, first_pick2,
            winning_team, event, match_date
        ])
    
    # Write data to the output CSV file
    with open(output_filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerows(csv_data)

# Example usage
convert_to_csv('records.txt', 'matches.csv')
