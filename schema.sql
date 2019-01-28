CREATE TABLE teams (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL
);

CREATE TABLE games (
  id serial PRIMARY KEY,
  played_at DATE NOT NULL DEFAULT current_timestamp,
  winning_team_id INTEGER NOT NULL,
  losing_team_id INTEGER NOT NULL,
  CONSTRAINT winners_games_teams_fkey FOREIGN KEY (winning_team_id)
    REFERENCES teams (id) MATCH SIMPLE,
  CONSTRAINT losers_games_teams_fkey FOREIGN KEY (losing_team_id)
    REFERENCES teams (id) MATCH SIMPLE
);
