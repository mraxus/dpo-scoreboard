const Pool = require('pg').Pool;

const { DATABASE_URL, PSQL_SSL } = process.env;

const pool = new Pool({
  connectionString: `${DATABASE_URL}${PSQL_SSL ? `?ssl=${PSQL_SSL}` : ''}`,
});

function query(input, params = []) {
  return new Promise((res, rej) => {
    pool.query(input, params, (err, results) => {
      if (err) return rej(err);
      return res(results);
    });
  });
}

async function getOrCreateTeamIdByName(name) {
  const { rows } = await query('SELECT id FROM teams WHERE name ILIKE $1', [
    name,
  ]);
  if (rows.length) return rows[0].id;

  const result = await query(
    'INSERT INTO teams (name) VALUES($1) RETURNING id',
    [name]
  );
  return result.rows[0].id;
}

const recordGame = ({ winning_team_id, losing_team_id, played_at }) =>
  played_at
    ? query(
        'INSERT INTO games (winning_team_id, losing_team_id, played_at) VALUES($1, $2, $3)',
        [winning_team_id, losing_team_id, played_at]
      )
    : query(
        'INSERT INTO games (winning_team_id, losing_team_id) VALUES($1, $2)',
        [winning_team_id, losing_team_id]
      );

const getTeams = () => query('SELECT * FROM teams ORDER BY name');
const getGames = () => query('SELECT * FROM games ORDER BY played_at');

module.exports = {
  getGames,
  getTeams,
  getOrCreateTeamIdByName,
  recordGame,
};
