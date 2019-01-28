const express = require('express');
const bodyParser = require('body-parser');

const { name, version } = require('../package');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', name, version });
});

app.get('/api/games', async (req, res) => {
  const games = await db.getGames();
  res.json(games.rows);
});
app.post('/api/games', async (req, res) => {
  const { winner, loser, played_at } = req.body;

  if (!winner || !loser) {
    return res.status(400).json({
      error: 'winner and loser must be set in application/json format',
    });
  }
  const payload = {
    winning_team_id: await db.getOrCreateTeamIdByName(winner),
    losing_team_id: await db.getOrCreateTeamIdByName(loser),
    played_at,
  };

  await db.recordGame(payload);

  res.json({ recorded: true });
});

app.get('/api/teams', async (req, res) => {
  const teams = await db.getTeams();
  res.json(teams.rows);
});
