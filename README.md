# How to Run

```
[FROM frontend folder] `npm install` `npm start`
[FROM backed folder] `npm install` `npm start`
```

## Features
- Drafting application that can be used by a person alone and can give suggestions / draft on its own using AI.
- Online drafting application that lets two users draft against each other in real time.
- Draft sandbox application that lets the user change any pick or ban in the draft at any time. Good for theory crafting.
- Tier List - users can move Pokemon in Pokemon Unite into different tiers.
- Comp Scorer - input a comp and get a score to rate how good or bad it is.
- Stat Tracker - tracks the stats of all pokemon, players, teams, etc in pro games.
- Comp Tracker - has logs of comps played by pro teams at different events.
- Trait Table - a table that shows the traits that the AI uses to make decisions about how to draft. 

### Additional Aspects
- Google OAuth implemented to let certain known users change the database.

# How To Put On Heroku

- Push all edits to git.
- `git push heroku master` to see edits on Heroku and build the website.
- Make sure environment variables are correct on Heroku

## Other things

- Run `npm run lint` in either frontend or backend to run linter.