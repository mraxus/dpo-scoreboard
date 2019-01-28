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

app.get('/api/teams', async (req, res) => {
	const teams = await db.getTeams();
	res.json(teams.rows);
});
