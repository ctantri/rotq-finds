const frmFinds = document.getElementById("finds-form");
const btnLoadPlayers = document.getElementById("load-players-button");
const btnSummarise = document.getElementById("summarise-button");
const txtPlayers = document.getElementById("players-textarea");
const slctGuild = document.getElementById("guild");
const slctPlayer = document.getElementById("player");
const fldItem = document.getElementById("item");
const ulItemList = document.getElementById("item-list");
const inPrice = document.getElementById("price");
let myGuild = "";
let players = {};
let finds = {};

const items = {
  "violet": {"group": "flowers", "tier": "green", "name": "violet", "required": 1, "min": 10},
  "tofu": {"group": "ingredients", "tier": "green", "name": "tofu", "required": 1, "min": 10},
  "rice": {"group": "ingredients", "tier": "green", "name": "rice", "required": 1, "min": 10},
  "noodles": {"group": "ingredients", "tier": "green", "name": "noodles", "required": 1, "min": 10},
  "nut": {"group": "ingredients", "tier": "green", "name": "nut", "required": 1, "min": 10},
  "egg": {"group": "ingredients", "tier": "green", "name": "egg", "required": 1, "min": 10},
  "duck egg": {"group": "ingredients", "tier": "green", "name": "duck egg", "required": 1, "min": 10},
  "seasoning": {"group": "ingredients", "tier": "green", "name": "seasoning", "required": 1, "min": 10},
  "apple": {"group": "ingredients", "tier": "green", "name": "apple", "required": 1, "min": 10},
  "scallion": {"group": "ingredients", "tier": "green", "name": "scallion", "required": 1, "min": 10},
  "tomato": {"group": "ingredients", "tier": "green", "name": "tomato", "required": 1, "min": 10},
  "flour": {"group": "ingredients", "tier": "blue", "name": "flour", "required": 2, "min": 20},
  "wine": {"group": "ingredients", "tier": "blue", "name": "wine", "required": 2, "min": 20},
  "pork": {"group": "ingredients", "tier": "blue", "name": "pork", "required": 2, "min": 20},
  "pepper": {"group": "ingredients", "tier": "blue", "name": "pepper", "required": 2, "min": 20},
  "cabbage": {"group": "ingredients", "tier": "blue", "name": "cabbage", "required": 2, "min": 20},
  "mushroom": {"group": "ingredients", "tier": "blue", "name": "mushroom", "required": 2, "min": 20},
  "bok choy": {"group": "ingredients", "tier": "blue", "name": "bok choy", "required": 2, "min": 20},
  "carrot": {"group": "ingredients", "tier": "blue", "name": "carrot", "required": 2, "min": 20},
  "chicken": {"group": "ingredients", "tier": "purple", "name": "chicken", "required": 2, "min": 30},
  "shrimps": {"group": "ingredients", "tier": "purple", "name": "shrimps", "required": 2, "min": 30},
  "roast pork": {"group": "ingredients", "tier": "purple", "name": "roast pork", "required": 2, "min": 30},
  "eggplant": {"group": "ingredients", "tier": "purple", "name": "eggplant", "required": 2, "min": 50},
  "peach petal": {"group": "ingredients", "tier": "purple", "name": "peach petal", "required": 2, "min": 50},
  "beef": {"group": "ingredients", "tier": "orange", "name": "beef", "required": 2, "min": 50},
  "mutton": {"group": "ingredients", "tier": "orange", "name": "mutton", "required": 2, "min": 50},
  "duck": {"group": "ingredients", "tier": "orange", "name": "duck", "required": 2, "min": 50},
  "spice": {"group": "ingredients", "tier": "orange", "name": "spice", "required": 2, "min": 50},
  "herbs": {"group": "ingredients", "tier": "orange", "name": "herbs", "required": 1, "min": 60},
  "glass bait": {"group": "baits", "tier": "purple", "name": "glass bait", "required": 3, "min": 40},
  "niblet": {"group": "baits", "tier": "purple", "name": "niblet", "required": 3, "min": 40},
  "silver bait": {"group": "baits", "tier": "purple", "name": "silver bait", "required": 3, "min": 45},
  "squid": {"group": "baits", "tier": "orange", "name": "squid", "required": 3, "min": 50},
  "jerky": {"group": "baits", "tier": "orange", "name": "jerky", "required": 3, "min": 60}
};

function parseData(data) {
  // Allowing for Windows files that use \r
  const rows = data.indexOf("\r") > 0 ? data.split("\r\n") : data.split("\n");
  return rows.map(row => row.split(","));
}

function objectifyPlayerData(arrPlayer) {
  // Expected arrPlayer format: [name, guild]
  return {
    "name": arrPlayer[0],
    "guild": arrPlayer[1]
  };
}

function isNewPlayer(name) {
  return !(name in players);
}

function addPlayer(objPlayer) {
  if (isNewPlayer(objPlayer.name))
    players[objPlayer.name] = objPlayer;
  else
    alert(`${objPlayer.name} is already on the list.`);
}

function loadPlayers() {
  const rawData = txtPlayers.value;

  if (rawData) {
    const parsedData = parseData(rawData);

    for (let row of parsedData) {
      const objPlayer = objectifyPlayerData(row);
      addPlayer(objPlayer);
    }

    for (let player in players) {
      const name = players[player].name;
      const guild = players[player].guild;

      if (isNotAlreadyLoaded(name))
        loadPlayer(name);
      
      if (isNotAlreadyLoaded(guild))
        loadGuild(guild);
    }
  }

  txtPlayers.value = "";
}

function loadPlayer(name) {
  const option = document.createElement("option");
  option.value = name;
  option.innerText = name;
  slctPlayer.append(option);
}

function loadGuild(guild) {
  const option = document.createElement("option");
  option.value = guild;
  option.innerText = guild;
  slctGuild.append(option);
}

function isNotAlreadyLoaded(text) {
  return document.querySelector(`option[value="${text}"]`) == null;
}

function adjustMinPrice(event) {
  const item = event.currentTarget.value;
  const min = items[item]["min"];
  inPrice.min = min;
  inPrice.value = min;
}

function loadItems() {
  for (let item in items) {
    // Load items into form.
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    
    label.htmlFor = `item-${item}`;
    label.innerText = item;

    input.type = "radio";
    input.id = `item-${item}`;
    input.name = "item";
    input.value = item;
    input.required = true;
    input.addEventListener("change", adjustMinPrice);

    span.id = `${input.id}-summary`;
    
    li.append(input, label, span);
    ulItemList.append(li);

    // Initialise finds object with items, to be ready to save entries.
    finds[item] = {};
  }
}

function getLowestPrice(item) {
  // Numeric object property keys are automatically sorted in ascending 
  // order, so the first one is the lowest.
  return Object.keys(finds[item])[0];
}

function save(event) {
  const data = new FormData(frmFinds);
  const item = data.get("item");
  const price = data.get("price");
  let player = data.get("player");

  if (players[player]["guild"] == slctGuild.value)
    player = `our ${player}`;

  if (price in finds[item])
    finds[item][price].push(player);
  else
    finds[item][price] = [player];

  // Display current lowest price and total number of finds so far 
  // next to the item label.
  const span = document.getElementById(`item-${item}-summary`);
  span.innerText = generateItemSummary(item);

  event.preventDefault();
}

function generateItemSummary(item) {
  let summary = "";
  let playerCount = 0;
  const required = items[item]["required"];

  for (let price in finds[item]) {
    playerCount += finds[item][price].length;
    summary += `${price} (${finds[item][price].join(", ")})`;
    if (playerCount >= required) {
      summary += ";";
      break;
    } else {
      summary += " & ";
    }
  }

  return summary;
}

function generateSummary() {
  let summary = "";

  for (let item in items)
    if (Object.keys(finds[item]).length > 0)
      summary += `${item} ${generateItemSummary(item)}\n`;

  console.log(summary);
}

btnLoadPlayers.addEventListener("click", loadPlayers);
frmFinds.addEventListener("submit", save);
btnSummarise.addEventListener("click", generateSummary);
loadItems();