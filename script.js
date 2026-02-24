const frmFinds = document.getElementById("finds-form");
const btnLoadPlayers = document.getElementById("load-players-button");
const btnSummarise = document.getElementById("summarise-button");
const txtPlayers = document.getElementById("players-textarea");
const slctGuild = document.getElementById("guild");
const slctPlayer = document.getElementById("player");
const fldItem = document.getElementById("item");
const ulItemList = document.getElementById("item-list");
const inPrice = document.getElementById("price");
const txtSummary = document.getElementById("summary-text");
const sections = document.getElementsByTagName("section");
const navPlayers = document.getElementById("nav-players");
const navFinds = document.getElementById("nav-finds");
const navSummary = document.getElementById("nav-summary");
let myGuild = "";
let players = {};
let finds = {};
let groups = {};

const items = {
  "violet": {"group": "FLOWERS", "name": "violet", "min": 10},
  "tofu": {"group": "INGREDIENTS: GREEN", "name": "tofu", "min": 10},
  "rice": {"group": "INGREDIENTS: GREEN", "name": "rice", "min": 10},
  "noodles": {"group": "INGREDIENTS: GREEN", "name": "noodles", "min": 10},
  "nut": {"group": "INGREDIENTS: GREEN", "name": "nut", "min": 10},
  "egg": {"group": "INGREDIENTS: GREEN", "name": "egg", "min": 10},
  "duck egg": {"group": "INGREDIENTS: GREEN", "name": "duck egg", "min": 10},
  "seasoning": {"group": "INGREDIENTS: GREEN", "name": "seasoning", "min": 10},
  "apple": {"group": "INGREDIENTS: GREEN", "name": "apple", "min": 10},
  "scallion": {"group": "INGREDIENTS: GREEN", "name": "scallion", "min": 10},
  "tomato": {"group": "INGREDIENTS: GREEN", "name": "tomato", "min": 10},
  "flour": {"group": "INGREDIENTS: BLUE", "name": "flour", "min": 20},
  "wine": {"group": "INGREDIENTS: BLUE", "name": "wine", "min": 20},
  "pork": {"group": "INGREDIENTS: BLUE", "name": "pork", "min": 20},
  "pepper": {"group": "INGREDIENTS: BLUE", "name": "pepper", "min": 20},
  "cabbage": {"group": "INGREDIENTS: BLUE", "name": "cabbage", "min": 20},
  "mushroom": {"group": "INGREDIENTS: BLUE", "name": "mushroom", "min": 20},
  "bok choy": {"group": "INGREDIENTS: BLUE", "name": "bok choy", "min": 20},
  "carrot": {"group": "INGREDIENTS: BLUE", "name": "carrot", "min": 20},
  "chicken": {"group": "INGREDIENTS: PURPLE", "name": "chicken", "min": 30},
  "shrimps": {"group": "INGREDIENTS: PURPLE", "name": "shrimps", "min": 30},
  "roast pork": {"group": "INGREDIENTS: PURPLE", "name": "roast pork", "min": 30},
  "eggplant": {"group": "INGREDIENTS: PURPLE", "name": "eggplant", "min": 50},
  "peach petal": {"group": "INGREDIENTS: PURPLE", "name": "peach petal", "min": 50},
  "beef": {"group": "INGREDIENTS: ORANGE", "name": "beef", "min": 50},
  "mutton": {"group": "INGREDIENTS: ORANGE", "name": "mutton", "min": 50},
  "duck": {"group": "INGREDIENTS: ORANGE", "name": "duck", "min": 50},
  "spice": {"group": "INGREDIENTS: ORANGE", "name": "spice", "min": 50},
  "herbs": {"group": "INGREDIENTS: ORANGE", "name": "herbs", "min": 60},
  "glass bait": {"group": "BAITS", "name": "glass bait", "min": 40},
  "niblet": {"group": "BAITS", "name": "niblet", "min": 40},
  "silver bait": {"group": "BAITS", "name": "silver bait", "min": 45},
  "squid": {"group": "BAITS", "name": "squid", "min": 50},
  "jerky": {"group": "BAITS", "name": "jerky", "min": 60}
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
    // List our own guild members first
    if (player.indexOf("our") == 0)
      finds[item][price].unshift(player);
    else
      finds[item][price].push(player);
  else
    finds[item][price] = [player];

  // Display current lowest price and total number of finds so far 
  // next to the item label.
  const span = document.getElementById(`item-${item}-summary`);
  span.innerText = generateItemSummary(item);

  const option = document.getElementById(`item-${item}`);
  option.checked = false;

  event.preventDefault();
}

function generateItemSummary(item) {
  let summary = "";

  const min = items[item]["min"];
  const cheapest = getLowestPrice(item);
  const nextCheapest = Object.keys(finds[item])[1];
  const isNotEnoughCheapest = finds[item][cheapest].length < 2;
  
  summary += `${cheapest} (${finds[item][cheapest].join(", ")})`;
  
  if (cheapest == min && nextCheapest && isNotEnoughCheapest) {
    if (nextCheapest == min + 1)
      summary += ` & ${nextCheapest} (${finds[item][nextCheapest].join(", ")})`;
  }

  return summary;
}

function populateGroups() {
  for (let item of Object.values(items)) {
    let {group, name} = item;
    
    if (group in groups)
      groups[group].push(name);
    else
      groups[group] = [name];
  }
}

function generateSummary() {
  let summary = "";

  populateGroups();

  for (let group in groups) {
    summary += `[${group}] `;

    for (let item of groups[group])
      if (Object.keys(finds[item]).length > 0)
        summary += `${item} ${generateItemSummary(item)}; `;

    summary += "\n\n";
  }

  txtSummary.value = summary;
}

function showSection(event) {
  const clicked = event.currentTarget.innerText;

  for (let section in sections) {
    const id = sections[section].id;
    if (id) {
      if (id.indexOf(clicked) == 0)
        sections[section].classList.remove("hidden");
      else
        sections[section].classList.add("hidden");
    }
  }
}


navPlayers.addEventListener("click", showSection);
navFinds.addEventListener("click", showSection);
navSummary.addEventListener("click", showSection);
btnLoadPlayers.addEventListener("click", loadPlayers);
frmFinds.addEventListener("submit", save);
btnSummarise.addEventListener("click", generateSummary);
loadItems();