function buildLookupMatrix(teams) {
  const template = teams.reduce(
    (o, { id }) => ({
      ...o,
      [id]: 0,
    }),
    {}
  );

  return teams.reduce(
    (o, { id }) => ({
      ...o,
      [id]: { ...template },
    }),
    {}
  );
}

async function getData() {
  return {
    games: await (await fetch('/api/games')).json(),
    teams: await (await fetch('/api/teams')).json(),
  };
}

async function getTabularData() {
  const { games, teams } = await getData();
  const { loses, wins } = games.reduce(
    ({ loses, wins }, { losing_team_id: l, winning_team_id: w }) => ({
      loses: { ...loses, [l]: (loses[l] || 0) + 1 },
      wins: { ...wins, [w]: (wins[w] || 0) + 1 },
    }),
    { loses: {}, wins: {} }
  );
  const winMatrix = buildLookupMatrix(teams);
  const teamsInfo = teams.map(
    (team) => ({
      ...team,
      loses: loses[team.id],
      wins: wins[team.id],
    }),
    {}
  );
  games.forEach(({ losing_team_id, winning_team_id }) => {
    winMatrix[winning_team_id][losing_team_id] += 1;
  });

  return {
    scoreboard: winMatrix,
    teams: teamsInfo,
  };
}

async function addScore() {
  const winner = document.getElementById('input1').value;
  const loser = document.getElementById('input2').value;

  await fetch('/api/games', {
    body: JSON.stringify({ winner, loser }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
  location.reload();
}

async function renderTable() {
  const { scoreboard, teams } = await getTabularData();
  const table = document.getElementById('table');

  if (scoreboard !== null) {
    const tableHeader = `<tr><th></th>${teams
      .map(
        ({ name }) => `<th><span>${name.replace(/\s/, '&nbsp;')}</span></th>`
      )
      .join('')}<th></th></tr>`;
    const tableContent = teams
      .map(
        ({ id, name }) =>
          `<tr><td>${name}</td>${teams
            .map(({ id: id2 }) =>
              id === id2
                ? `<td class="black-cell" />`
                : `<td class="t-border">${scoreboard[id][id2]}</td>`
            )
            .join('')}<td class="hidden">${name}</td></tr>`
      )
      .join('\n');

    table.innerHTML = `<table>${tableHeader}${tableContent}</table>`;
  } else {
    table.innerHTML = '';
  }
}
