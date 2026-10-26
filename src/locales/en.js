// English edition: Harry narrates. Story text lives in locales/en/*.json; this
// module holds interface wording and the few language-specific behaviours.
export default {
  code: 'en',
  route: 'en',
  saveKey: 'himawari-2026-save',
  settingsKey: 'himawari-2026-settings',
  narrator: 'Harry',
  otherLanguage: {code: 'zh-CN', route: 'zh-CN', label: '简体中文'},

  phases: {Dawn: 'Dawn', Morning: 'Morning', Noon: 'Noon', Afternoon: 'Afternoon', Dusk: 'Dusk', Night: 'Night'},
  destinations: {
    1: {name: 'Home', description: 'A little light in the window'},
    2: {name: 'The park', description: 'Secrets beneath the trees'},
    3: {name: 'The scrapyard', description: 'Someone else’s forgotten things'},
    4: {name: 'The warehouses', description: 'Rust, dust, and loose ends'},
    5: {name: 'Fermat’s pizzeria', description: 'A slice of local gossip'},
    6: {name: 'The water plant', description: 'Follow the water'},
    7: {name: 'The main avenue', description: 'Everyone passes through'},
    8: {name: 'The school', description: 'Never too old to learn'},
  },
  items: {
    'Strange artifact': 'Strange artifact', Barricade: 'Barricade', Chocolate: 'Chocolate', Crowbar: 'Crowbar',
    Flowers: 'Flowers', Gun: 'Gun', Poison: 'Poison', Sandwich: 'Sandwich', 'School key': 'School key',
  },
  endings: {1: 'The neighbour', 2: 'The sniper', 3: 'Poison', 4: 'The Destroyer of Suns', 5: 'Tomorrow'},
  kinds: {
    'Diary entry': 'Diary entry', Quotation: 'Quotation', 'Person mentioned': 'Person mentioned',
    'Place visited': 'Place visited', 'Object recorded': 'Object recorded',
  },
  people: [
    ['gardener', 'The gardener', /\bgardener\b/i],
    ['sweeper', 'The street sweeper', /street sweeper/i],
    ['neighbour', 'My neighbour', /neighbou?r/i],
    ['fermat', 'Fermat', /\bFermat\b/i],
    ['children', 'The children', /\bchildren\b/i],
    ['guard', 'The guard', /\bguard\b/i],
    ['hobo', 'The hobo', /\bhobo\b/i],
    ['teacher', 'Miss Summers', /Miss Summers/i],
    ['valentine', 'Valentine Summers', /Valentine Summers/i],
    ['sniper', 'The sniper', /\bsniper\b/i],
  ],
  diaryEvents: {
    wood: 'I collected wooden planks, nails, and a hammer at the scrapyard.',
    barricade: 'I barricaded the door with my bed and the planks. I had to stay home for the rest of the day.',
    love: 'The street sweeper left after deciding to pursue love instead of duty.',
    gun: 'I found the sniper’s gun in the warehouse and threw it into a potato field.',
    herbicide: 'I used the herbicide to clean Fermat’s toilet and refilled its bottle with plain water.',
    neighbourStopped: 'I stopped my neighbour’s attack. Then a sniper shot the sunflower.',
    substitute: 'The children in the park mentioned a substitute teacher who had not arrived at school.',
    schoolEntry: 'I entered the school as the expected substitute teacher and was given directions to the classroom.',
  },
  clues: {
    first: 'Ordinary conversations may matter more than they seem. Listen before deciding what to do with the day.',
    connections: 'A familiar emblem can connect people to places. Follow the connections you have actually noticed.',
    neighbour: 'The people carrying out a plan have lives of their own. Watch what your neighbour and the street sweeper care about.',
    feelings: 'Duty and affection are pulling someone in different directions. Listen closely when he talks about her.',
    sniper: 'A shot needs more than someone willing to fire it. Think about what you have learned of the preparations.',
    weapon: 'Knowing where a danger begins is useful even when you cannot get inside yet. Other places may offer a way past the obstacle.',
    poison: 'Think back to people who reacted oddly to your sunflower. Something ordinary in their surroundings may deserve a closer look.',
    fermat: 'Fermat’s reaction still seems suspicious. Pay attention to what is around you when you have a reason to spend time there.',
    destroyer: 'That voice sounded familiar. Your earlier conversations may connect her to a place where people leave personal traces.',
    school: 'Getting into the school may depend on understanding its everyday routine. The people outside it can know more than the gatekeeper.',
    inside: 'You have reached the school. Listen to directions and notice which rooms connect to the person you are investigating.',
    preparations: 'Some discoveries survive the loop; things you do during the day do not. Check which precautions you have repeated today.',
  },
  forecast: {
    survived: 'The sunflower survived. Tomorrow is here.',
    handled: 'The threats I know have been dealt with for tonight.',
    unknown: 'Tonight is uncertain. I haven’t seen what comes next.',
    known: [null, 'Tonight, as things stand: my neighbour’s attack.', 'Tonight, as things stand: the sniper’s shot.', 'Tonight, as things stand: poison.', 'Tonight, as things stand: the Destroyer of Suns.'],
  },
  preparations: {
    love: 'The street sweeper has chosen love.',
    gun: 'The sniper’s weapon has been removed.',
    poison: 'The herbicide has been replaced with water.',
  },

  // Harry's cached number words. "and" joins hundreds to their remainder.
  numberScale: [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand'], [100, 'hundred']],
  numberJoin: (amount, rest) => amount === 100,
  martin: ['Martin'],
  // Typed answers: surrounding spaces (phone keyboards add one after
  // autocomplete), letter case and full-width characters don't matter.
  // A wrong name or PIN stays wrong.
  inputValue(value) {
    const text = String(value).normalize('NFKC').trim();
    return /^martin$/i.test(text) ? 'Martin' : text;
  },
  spell(char) {
    const c = char.toUpperCase();
    return /[A-Z]/.test(c) ? 'letter:' + c : /[0-9]/.test(c) ? 'number:' + c : null;
  },

};
