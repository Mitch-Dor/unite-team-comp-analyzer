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

#### How To Add A New Pokemon:

- Add headshot asset
- Add move assets
- Add to playable_characters table in db editor
- Add to pokemon_moves table in db editor
- Add to pokemon_attributes in db editor
- Add to tier_list in db editor

#### Setting Up The DB:

- Run all the SQL to create and populate tables
- You may need to specially select settings to get certain ID's to auto increment and set their starting value correctly.
    - Set up auto-increment in the settings of whatever DB is being used.
    - Set starting value using:
```
SELECT SETVAL(
  pg_get_serial_sequence('events', 'event_id'),
  (SELECT MAX(event_id) FROM events)
);
```
```
SELECT SETVAL(
  pg_get_serial_sequence('professional_comps', 'comp_id'),
  (SELECT MAX(comp_id) FROM professional_comps)
);
```
```
SELECT SETVAL(
  pg_get_serial_sequence('professional_matches', 'match_id'),
  (SELECT MAX(match_id) FROM professional_matches)
);
```
```
SELECT SETVAL(
  pg_get_serial_sequence('professional_players', 'player_id'),
  (SELECT MAX(player_id) FROM professional_players)
);
```
```
SELECT SETVAL(
  pg_get_serial_sequence('professional_sets', 'set_id'),
  (SELECT MAX(set_id) FROM professional_sets)
);
```
SELECT SETVAL(
  pg_get_serial_sequence('professional_teams', 'team_id'),
  (SELECT MAX(team_id) FROM professional_teams)
);
```