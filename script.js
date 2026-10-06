
// Le JavaScript prépare la partie (cartes mélangées), gère le chrono et les records.
// Données
// Les héros (liste du site officiel, récupérée avec l'OverFast API).
const HEROES = [
  { id: 'ana', name: 'Ana', role: 'Support' },
  { id: 'anran', name: 'Anran', role: 'Damage' },
  { id: 'ashe', name: 'Ashe', role: 'Damage' },
  { id: 'baptiste', name: 'Baptiste', role: 'Support' },
  { id: 'bastion', name: 'Bastion', role: 'Damage' },
  { id: 'brigitte', name: 'Brigitte', role: 'Support' },
  { id: 'cassidy', name: 'Cassidy', role: 'Damage' },
  { id: 'dmon', name: 'D.Mon', role: 'Tank' },
  { id: 'dva', name: 'D.Va', role: 'Tank' },
  { id: 'domina', name: 'Domina', role: 'Tank' },
  { id: 'doomfist', name: 'Doomfist', role: 'Tank' },
  { id: 'echo', name: 'Echo', role: 'Damage' },
  { id: 'emre', name: 'Emre', role: 'Damage' },
  { id: 'freja', name: 'Freja', role: 'Damage' },
  { id: 'genji', name: 'Genji', role: 'Damage' },
  { id: 'hanzo', name: 'Hanzo', role: 'Damage' },
  { id: 'hazard', name: 'Hazard', role: 'Tank' },
  { id: 'illari', name: 'Illari', role: 'Support' },
  { id: 'jetpack-cat', name: 'Jetpack Cat', role: 'Support' },
  { id: 'junker-queen', name: 'Junker Queen', role: 'Tank' },
  { id: 'junkrat', name: 'Junkrat', role: 'Damage' },
  { id: 'juno', name: 'Juno', role: 'Support' },
  { id: 'kiriko', name: 'Kiriko', role: 'Support' },
  { id: 'lifeweaver', name: 'Lifeweaver', role: 'Support' },
  { id: 'lucio', name: 'Lúcio', role: 'Support' },
  { id: 'mauga', name: 'Mauga', role: 'Tank' },
  { id: 'mei', name: 'Mei', role: 'Damage' },
  { id: 'mercy', name: 'Mercy', role: 'Support' },
  { id: 'mizuki', name: 'Mizuki', role: 'Support' },
  { id: 'moira', name: 'Moira', role: 'Support' },
  { id: 'orisa', name: 'Orisa', role: 'Tank' },
  { id: 'pharah', name: 'Pharah', role: 'Damage' },
  { id: 'ramattra', name: 'Ramattra', role: 'Tank' },
  { id: 'reaper', name: 'Reaper', role: 'Damage' },
  { id: 'reinhardt', name: 'Reinhardt', role: 'Tank' },
  { id: 'roadhog', name: 'Roadhog', role: 'Tank' },
  { id: 'shion', name: 'Shion', role: 'Damage' },
  { id: 'sierra', name: 'Sierra', role: 'Damage' },
  { id: 'sigma', name: 'Sigma', role: 'Tank' },
  { id: 'sojourn', name: 'Sojourn', role: 'Damage' },
  { id: 'soldier-76', name: 'Soldier: 76', role: 'Damage' },
  { id: 'sombra', name: 'Sombra', role: 'Damage' },
  { id: 'symmetra', name: 'Symmetra', role: 'Damage' },
  { id: 'torbjorn', name: 'Torbjörn', role: 'Damage' },
  { id: 'tracer', name: 'Tracer', role: 'Damage' },
  { id: 'vendetta', name: 'Vendetta', role: 'Damage' },
  { id: 'venture', name: 'Venture', role: 'Damage' },
  { id: 'widowmaker', name: 'Widowmaker', role: 'Damage' },
  { id: 'winston', name: 'Winston', role: 'Tank' },
  { id: 'wrecking-ball', name: 'Wrecking Ball', role: 'Tank' },
  { id: 'wuyang', name: 'Wuyang', role: 'Support' },
  { id: 'zarya', name: 'Zarya', role: 'Tank' },
  { id: 'zenyatta', name: 'Zenyatta', role: 'Support' },
];

// Les modes
const MODES = {
  12: { rank: 'Bronze', icon: 'images/ranks/bronze.webp' },
  24: { rank: 'Silver', icon: 'images/ranks/silver.webp' },
  36: { rank: 'Gold', icon: 'images/ranks/gold.webp' },
};

const RECORDS_KEY = 'overwatch-memory-records';

// Éléments de la page 

const home = document.getElementById('home');
const game = document.getElementById('game');
const board = document.getElementById('board');
const victory = document.getElementById('victory');
const pairsText = document.getElementById('pairs');
const timeText = document.getElementById('time');

let currentMode = null; 
let foundPairs = 0;
let startTime = 0;
let timerId = null;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(tenths) {
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor(tenths / 10) % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths % 10}`;
}

// Records (gardés dans le navigateur avec localStorage)

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

function showRecords() {
  const records = loadRecords();

  // Le tableau "Your records"
  document.getElementById('records').innerHTML = Object.keys(MODES)
    .map((mode) => {
      const best = records[mode] ? formatTime(records[mode]) : '—';
      return `<li><img src="${MODES[mode].icon}" alt="" /> ${MODES[mode].rank}
        <span class="records-size">${mode} cards</span> <strong>${best}</strong></li>`;
    })
    .join('');

  for (const element of document.querySelectorAll('[data-best]')) {
    const time = records[element.dataset.best];
    element.textContent = time ? `Best ${formatTime(time)}` : 'Best —';
  }
}

// Accueil

// La bande de portraits qui défile. La liste est mise deux fois pour que la boucle de l'animation ne se voie pas (.roster-track dans style.css).
function showRoster() {
  const items = HEROES.map(
    (hero) => `<li><img src="images/heroes/${hero.id}.webp" alt="" loading="lazy" /></li>`,
  ).join('');
  document.getElementById('roster').innerHTML = items + items;
}

function showHome() {
  stopTimer();
  board.innerHTML = '';
  game.hidden = true;
  victory.hidden = true;
  home.hidden = false;
  showRecords();
}

// Partie

function createCard(hero, pairNumber, position) {
  const label = `Card ${position + 1}`;
  return `
    <li class="card pair-${pairNumber}" style="--position: ${position}">
      <div class="card-inner" aria-hidden="true">
        <div class="card-back"><svg><use href="#logo" /></svg></div>
        <div class="card-front role-${hero.role.toLowerCase()}">
          <img src="images/heroes/${hero.id}.webp" alt="" />
          <p class="card-name">${hero.name}</p>
          <p class="card-role">${hero.role}</p>
        </div>
      </div>
      <details class="pick" name="turn"><summary aria-label="${label}"></summary><p class="sr-only">${hero.name}.</p></details>
      <details class="miss" name="turn"><summary aria-label="${label}"></summary><p class="sr-only">${hero.name}. Not a match.</p></details>
      <details class="found"><summary aria-label="${label}"></summary><p class="sr-only">${hero.name}. It's a match!</p></details>
    </li>`;
}

function startGame(mode) {
  currentMode = mode;
  foundPairs = 0;

  // 2 héros au hasard, chacun en deux exemplaires, puis on mélange.
  const heroes = shuffle(HEROES).slice(0, mode / 2);
  const cards = shuffle([...heroes.entries(), ...heroes.entries()]);
  board.innerHTML = cards.map(([pair, hero], position) => createCard(hero, pair, position)).join('');
  
  board.className = `board board-${mode}`;

  document.getElementById('hud-rank').src = MODES[mode].icon;
  document.getElementById('pairs-total').textContent = mode / 2;
  pairsText.textContent = 0;

  home.hidden = true;
  victory.hidden = true;
  game.hidden = false;
  startTimer();
}

function startTimer() {
  stopTimer();
  startTime = Date.now();
  timeText.textContent = formatTime(0);
  timerId = setInterval(() => {
    timeText.textContent = formatTime(elapsedTenths());
  }, 100);
}

function stopTimer() {
  clearInterval(timerId);
}

function elapsedTenths() {
  return Math.floor((Date.now() - startTime) / 100);
}

// Quand une paire est trouvée
board.addEventListener(
  'toggle',
  (event) => {
    const details = event.target;
    if (!details.classList.contains('found') || !details.open) return;

    foundPairs++;
    pairsText.textContent = foundPairs;

    for (const pick of board.querySelectorAll('.pick[open]')) pick.open = false;

    if (foundPairs === currentMode / 2) win();
  },
  true,
);

function win() {
  stopTimer();
  const time = elapsedTenths();
  timeText.textContent = formatTime(time);

  const records = loadRecords();
  const isNewRecord = !records[currentMode] || time < records[currentMode];
  if (isNewRecord) {
    records[currentMode] = time;
    saveRecords(records);
  }

  document.getElementById('victory-time').textContent = formatTime(time);
  document.getElementById('victory-best').textContent = formatTime(records[currentMode]);
  document.getElementById('new-record').hidden = !isNewRecord;

  setTimeout(() => (victory.hidden = false), 600);
}

// Boutons

for (const button of document.querySelectorAll('.mode')) {
  button.addEventListener('click', () => startGame(Number(button.dataset.mode)));
}

document.getElementById('play-again').addEventListener('click', () => startGame(currentMode));
document.getElementById('back-to-menu').addEventListener('click', showHome);
document.getElementById('quit').addEventListener('click', showHome);

document.getElementById('reset-records').addEventListener('click', () => {
  saveRecords({});
  showRecords();
});

// Démarrage 

showRoster();
showRecords();
