# Custom class to hold team comp information. The 5 characters that make it up and whether that team comp won
class TeamComp:
    def __init__(self, char1, char2, char3, char4, char5, ban1, ban2, team, region, isFirst):
        self.char1 = char1
        self.char2 = char2
        self.char3 = char3
        self.char4 = char4
        self.char5 = char5
        self.ban1 = ban1
        self.ban2 = ban2
        self.team = team
        self.region = region
        self.firstPick = True if isFirst == "fp" else False
    def __str__(self):
        return "%13s %13s %13s %13s %13s \t %13s %13s %13s %13s\n" % (self.char1, self.char2, self.char3, self.char4, self.char5, self.ban1, self.ban2, self.team, self.region)
    
class Match:
    def __init__(self, team1, team2, winningTeam, event, date):
        self.team1 = team1
        self.team2 = team2
        self.winningTeam = winningTeam
        self.event = event
        self.date = date
    def __str__(self):
        return "%12s%s\n%12s%s\n\t\t^^^\t\t%12s%20s%20s%20s\t\t^^^\n\n--------------------------------------------------\n\n" % ("Team 1:", self.team1.__str__(), "Team 2:", self.team2.__str__(), "Match Stats:", "Winning Team: "+self.winningTeam, "Event: "+self.event, "Date: "+self.date)

class CharStats:
    def __init__(self, name, numPicks, numBans, numWins, numLosses, roundsPicked):
        self.name = name
        self.numPicks = numPicks
        self.numBans = numBans
        self.numWins = numWins
        self.numLosses = numLosses
        self.roundsPicked = roundsPicked
    def __str__(self):
        return "%18s: %10d %10d %10d %10d" % (self.name, self.numPicks, self.numBans, self.numWins, self.numLosses)
    
class Stats:
    def __init__(self, matches, characterStats):
        self.matches = matches
        self.characterStats = characterStats
    def __str__(self):
        returnString = ""
        returnString += "%11s %13s %13s %13s %13s %13s \t %13s %13s %13s %13s\n" % ("", "Char 1", "Char 2", "Char 3", "Char 4", "Char 5", "Ban 1", "Ban 2", "Team", "Region")
        for match in self.matches:
            returnString += match.__str__()
        returnString += "\n\n"
        returnString += "%18s: %10s %10s %10s %10s %11s %11s %11s %11s %18s\n" % ("Name", "# Pick", "# Ban", "# Win", "# Loss", "Pick Rate", "Ban Rate", "Presence", "Win Rate", "Pick Str")
        numMatches = len(self.matches)
        for char in self.characterStats:
            returnString += char.__str__()
            returnString += "%10.1f%s %10.1f%s %10.1f%s %10.1f%s %18s\n" % ((char.numPicks/numMatches)*100, "%", (char.numBans/numMatches)*100, "%", ((char.numPicks+char.numBans)/numMatches)*100, "%", (char.numWins/char.numPicks)*100 if char.numPicks>0 else 0, "%", char.roundsPicked)
        f = open("results.txt", "w")
        f.write(returnString)
        return returnString
                                                                                         