const btnLoadPlayers = document.getElementById('load-players-button');
const slctPlayerSelect = document.getElementById('player-select');
let players;

function parseCSV(file) {
  const rows = file.indexOf('\r') > 0 ? file.split('\r\n') : file.split('\n'); // Allowing for Windows files that use \r
  const data = rows.map(row => row.split(','));
  return data;
}

function loadPlayers() {
  const file = document.getElementById('player-upload').files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const csv = e.target.result;
    players = parseCSV(csv);

    for (let player of players) {
      const option = document.createElement('option');
      option.value = player[0];
      option.innerText = player[0];
      slctPlayerSelect.append(option);
    }
  }

  reader.readAsText(file);
}

btnLoadPlayers.addEventListener('click', loadPlayers);