from classes import *

# Step 1: Read in all match and comp data from a file
f = open("records.txt", "r")
# The two following lists are lists of team comps and whether they won or not. When matchup becomes relevant teamOneList[i] fought teamTwoList[i]
matches = [] # Will hold all the completed Match objects
listOfLines = f.read().split('\n')
for i in range(0, len(listOfLines), 3):
    matchInformation = listOfLines[i+2].split('|') # Splits winning team into matchInformation[0], event into matchInformation[1], date into matchInformation[2]

    # Team 1 info
    teamOneInfo = listOfLines[i].split('|') # Splits picks into teamOneInfo[0], bans into teamOneInfo[1], team info teamOneInfo[2], region into teamOneInfo[3], first pick or last pick into teamOneInfo[4]
    teamOneMons = teamOneInfo[0].split(',')
    teamOneBans = teamOneInfo[1].split(',')
    teamOne = TeamComp(teamOneMons[0], teamOneMons[1], teamOneMons[2], teamOneMons[3], teamOneMons[4], teamOneBans[0], teamOneBans[1], teamOneInfo[2], teamOneInfo[3], teamOneInfo[4])
    
    # Team 2 info
    teamTwoInfo = listOfLines[i+1].split('|')
    teamTwoMons = teamTwoInfo[0].split(',')
    teamTwoBans = teamTwoInfo[1].split(',')
    teamTwo = TeamComp(teamTwoMons[0], teamTwoMons[1], teamTwoMons[2], teamTwoMons[3], teamTwoMons[4], teamTwoBans[0], teamTwoBans[1], teamTwoInfo[2], teamTwoInfo[3], teamTwoInfo[4])
    
    newMatch = Match(teamOne, teamTwo, matchInformation[0], matchInformation[1], matchInformation[2])
    matches.append(newMatch)

# Step 1.5 - Do a little extra analysis on pick rates and stuff like that

numMatches = len(matches)
# Open a file containing all the characters' names
f2 = open("characters.txt", "r")
characterNames = [] # Stores just the working names, used later in the analysis
characters = [] # Will store all the completed CharStats objects
listOfCharacters = f2.read().split('\n')
for line in listOfCharacters:
    charNames = line.split(',') # 0 is all caps, 1 is normal
    workingName = charNames[1]
    characterNames.append(workingName)
    matchesBanned = 0
    matchesPlayed = 0
    matchesWon = 0
    matchesLost = 0
    roundsPicked = "" # This is going to be a string that has the round number the pokemon was picked each time. Rounds go from 1-6. Count the number of time a number appears to know how many times it was picked in that round
    # Go through every match to add up data from each match
    for match in matches:
        # Bans
        if(match.team1.ban1 == workingName or match.team1.ban2 == workingName):
            matchesBanned += 1
        # Matches Played
        if(match.team1.char1 == workingName or match.team1.char2 == workingName or match.team1.char3 == workingName or match.team1.char4 == workingName or match.team1.char5 == workingName):
            matchesPlayed += 1
            # Since they played in the match, what round were they picked in?
            if(match.team1.char1 == workingName):
                roundsPicked += "1" if match.team1.firstPick == True else "2"
            elif (match.team1.char2 == workingName):
                roundsPicked += "3" if match.team1.firstPick == True else "2"
            elif (match.team1.char3 == workingName):
                roundsPicked += "3" if match.team1.firstPick == True else "4"
            elif (match.team1.char4 == workingName):
                roundsPicked += "5" if match.team1.firstPick == True else "4"
            elif (match.team1.char5 == workingName):
                roundsPicked += "5" if match.team1.firstPick == True else "6"
            # Win or Lose?
            if(match.winningTeam == "1"):
                matchesWon += 1
            else:
                matchesLost += 1
        # Bans
        if(match.team2.ban2 == workingName or match.team2.ban2 == workingName):
            matchesBanned += 1
        # Matches Played
        if(match.team2.char1 == workingName or match.team2.char2 == workingName or match.team2.char3 == workingName or match.team2.char4 == workingName or match.team2.char5 == workingName):
            matchesPlayed += 1
            # Since they played in the match, what round were they picked in?
            if(match.team2.char1 == workingName):
                roundsPicked += "1" if match.team2.firstPick == True else "2"
            elif (match.team2.char2 == workingName):
                roundsPicked += "3" if match.team2.firstPick == True else "2"
            elif (match.team2.char3 == workingName):
                roundsPicked += "3" if match.team2.firstPick == True else "4"
            elif (match.team2.char4 == workingName):
                roundsPicked += "5" if match.team2.firstPick == True else "4"
            elif (match.team2.char5 == workingName):
                roundsPicked += "5" if match.team2.firstPick == True else "6"
            # Win or Lose?
            if(match.winningTeam == "2"):
                matchesWon += 1
            else:
                matchesLost += 1

    # Character stats are done
    newCharacter = CharStats(workingName, matchesPlayed, matchesBanned, matchesWon, matchesLost, roundsPicked)
    characters.append(newCharacter)

cumulatedStats = Stats(matches, characters) # Stats object is an accumulation of all Match and CharStats objects that can do some analysis on these objects.
print(cumulatedStats)



# Step 2: Run an analysis to see if there are common groups of Pokemon winning together, as well as if there are common groups of Pokemon being picked together
    # I can just do pairs or I can start big and then take the winning large groups and cut them into smaller and smaller pieces to find what about it works. 
    # Note: May want to do some special for the really common picks that are just being picked regardless
    # This analysis should probably run just based on Pokemon first.
    # Then, we may want to take these groups of Pokemon and see if we can find groups of traits in common from that to make it easier to search.

# Maybe start with assuming the players know best and just look for what teammates a Pokemon is often picked with rather than trying to hyper analyze winrate with different teammates (at least to start)
charactersToJoin = characterNames.copy() # Create a copy of the list of characters so that we can remove one at a time so we don't repeat character combinations
charactersToJoin.pop(0) # Pop first because then we could have a duo of the same character which is not possible 
duoOccurancesWinrate = [] # This is going to hold a tuple of (char1Name, char2Name, Occurances, WinrateTogether)
for character in characterNames: # Use charNames to through every character combination because we don't need to shrink this at all
    charactersLeft = charactersToJoin.copy() # Need this copy of charactersToJoin because this is the one we will pop from in each iteration, but for the next iteration of character we only want one less character in charactersToJoin
    while(len(charactersLeft) != 0): # When len == 0 we have no combinations left
        currentlyMatching = charactersLeft.pop(0) # Pop our character we are currently matching with
        occurances = 0 # Local variable to hold how many times this combo was picked
        wins = 0 # Local variable to hold how many times this combo was picked and won together
        for match in cumulatedStats.matches: # Need to go through every match to check first if character is present, if it is then we check if currentlyMatching is on the same team. If yes we have a match and can record stats  
            # Team 1
            if (match.team1.char1 == character or match.team1.char2 == character or match.team1.char3 == character or match.team1.char4 == character or match.team1.char5 == character):
                if (match.team1.char1 == currentlyMatching or match.team1.char2 == currentlyMatching or match.team1.char3 == currentlyMatching or match.team1.char4 == currentlyMatching or match.team1.char5 == currentlyMatching):
                    # The two were picked together
                    occurances += 1
                    if (match.winningTeam == "1"):
                        wins += 1
            # Team 2: Same thing but done separately because we don't want to count when a character was picked on one team and the other was picked on the other team
            elif (match.team2.char1 == character or match.team2.char2 == character or match.team2.char3 == character or match.team2.char4 == character or match.team2.char5 == character): # elif because if one is on team one, it can't be on team two
                if (match.team2.char1 == currentlyMatching or match.team2.char2 == currentlyMatching or match.team2.char3 == currentlyMatching or match.team2.char4 == currentlyMatching or match.team2.char5 == currentlyMatching):
                    # The two were picked together
                    occurances += 1
                    if (match.winningTeam == "2"):
                        wins += 1
        # We have run through all the matches, add the resulting tuple
        duoOccurancesWinrate.append((character, currentlyMatching, occurances, wins))
    charactersToJoin.pop(0) # Move charactersToJoin forward 1 iteration with charNames
    if(len(charactersToJoin) == 0): # No more characters left to join with, we're done
        break

# Remove duos that never occur
nonZeroDuos = []
for duo in duoOccurancesWinrate:
    if (duo[2] != 0):
        nonZeroDuos.append(duo)

# Analyze duo data:
# Maybe display duos that together have a higher winrate than they each do separately?
# OR display duos that together have a higher winrate than the AVERAGE of the two duos separately
greatDuos = []
badDuos = []
for duo in nonZeroDuos:
    characterOneData = None
    characterTwoData = None
    # Pull full data out for winrates
    for char in cumulatedStats.characterStats:
        if char.name == duo[0]:
            characterOneData = char
        if char.name == duo[1]:
            characterTwoData = char
    duoWinrate = (duo[2]/duo[3]) if duo[3] != 0 else 0
    significanceThreshold = 3
    if (duoWinrate > int(characterOneData.numWins)/int(characterOneData.roundsPicked) and duoWinrate > int(characterTwoData.numWins)/int(characterTwoData.roundsPicked) and duo[2]>significanceThreshold) or (duoWinrate >= 0.75 and duo[2] > significanceThreshold): # Winrate of the duo is lower than each individual pokemon OR above a high threshhold with significant numbers of games
        greatDuos.append(duo)
    elif (duoWinrate < int(characterOneData.numWins)/int(characterOneData.roundsPicked) and duoWinrate < int(characterTwoData.numWins)/int(characterTwoData.roundsPicked) and duo[2]>significanceThreshold) and duo[2] > significanceThreshold: # Winrate of the duo is lower than each individual pokemon AND the duo must have been played a significant number of times
        badDuos.append(duo)

for duo in greatDuos:
    print(duo)

# Step 2.5 Look through good duos and try and find what makes them good. Break each duo into its combinations of traits and then count the occurances of these trait combinations
# IF NOT GETTING GOOD RESULTS: Maybe go an extra step and check if these combinations are not present in bad duos


# Step 3 (Maybe not in the same run): Run an analysis to see if a certain set of synergies is beating another certain set of synergies often