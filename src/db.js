const Pool = require('pg').Pool;

const { DATABASE_URL, PSQL_SSL } = process.env;

const pool = new Pool({
	connectionString: `${DATABASE_URL}${PSQL_SSL ? `?ssl=${PSQL_SSL}` : ''}`,
});

function query(input) {
	return new Promise((res, rej) => {
		pool.query(input, (err, results) => {
			if (err) return rej(err);
			return res(results);
		});
	});
}

const getTeams = () => query('SELECT * FROM teams ORDER BY id');
const getGames = () => query('SELECT * FROM games ORDER BY played_at');

module.exports = {
	getGames,
	getTeams,
};
