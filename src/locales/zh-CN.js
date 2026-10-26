import {L} from '../i18n.js';

// Simplified Chinese edition: Julian narrates. Original comparison strings stay
// English (`raw`); only displayed text and these interface strings change.
let historyReplacements = null;

export default {
  code: 'zh-CN',
  route: 'zh-CN',
  saveKey: 'himawari-2026-zh-CN-save',
  settingsKey: 'himawari-2026-zh-CN-settings',
  narrator: '朱利安',
  otherLanguage: {code: 'en', route: 'en', label: 'English'},

  phases: {Dawn: '黎明', Morning: '早晨', Noon: '中午', Afternoon: '下午', Dusk: '黄昏', Night: '夜晚'},
  destinations: {
    1: {name: '家里', description: '窗里的一点光'},
    2: {name: '公园', description: '树下的秘密'},
    3: {name: '废品场', description: '别人遗忘的东西'},
    4: {name: '仓库区', description: '铁锈、灰尘，还有未解的事'},
    5: {name: '费马的披萨店', description: '一片本地八卦'},
    6: {name: '水处理厂', description: '循着水走'},
    7: {name: '中央大道', description: '每个人都会经过'},
    8: {name: '学校', description: '活到老，学到老'},
  },
  items: {
    'Strange artifact': '古怪装置', Barricade: '路障', Chocolate: '巧克力', Crowbar: '撬棍',
    Flowers: '花束', Gun: '枪', Poison: '毒药', Sandwich: '三明治', 'School key': '学校钥匙',
  },
  endings: {1: '邻居', 2: '狙击手', 3: '毒药', 4: '太阳毁灭者', 5: '明天'},
  kinds: {
    'Diary entry': '日记记录', Quotation: '原文摘录', 'Person mentioned': '提到的人物',
    'Place visited': '去过的地方', 'Object recorded': '记录过的物品',
  },
  people: [
    ['gardener', '园丁', /园丁|\bgardener\b/i],
    ['sweeper', '清洁工', /清洁工|street sweeper/i],
    ['neighbour', '我的邻居', /邻居|neighbou?r/i],
    ['fermat', '费马', /费马|\bFermat\b/i],
    ['children', '孩子们', /孩子|\bchildren\b/i],
    ['guard', '保安', /保安|\bguard\b/i],
    ['hobo', '流浪汉', /流浪汉|\bhobo\b/i],
    ['teacher', '萨默斯女士', /萨默斯女士|Miss Summers/i],
    ['valentine', '瓦伦丁·萨默斯', /瓦伦丁·萨默斯|Valentine Summers/i],
    ['sniper', '狙击手', /狙击手|\bsniper\b/i],
  ],
  diaryEvents: {
    wood: '我在废品场拿到了木板、钉子和锤子。',
    barricade: '我用床和木板封住了门。这一天剩下的时间，我都只能待在家里。',
    love: '清洁工决定追求爱情，放下职责，然后离开了。',
    gun: '我在仓库找到狙击手的枪，把它扔进了一块土豆田。',
    herbicide: '我用除草剂打扫了费马的厕所，再往瓶子里灌满清水。',
    neighbourStopped: '我阻止了邻居的袭击。随后，一个狙击手射杀了向日葵。',
    substitute: '公园里的孩子提起一位代课老师，他还没到学校。',
    schoolEntry: '我以那位学校正在等的代课老师的身份进了学校，并得到了去教室的路线。',
  },
  clues: {
    first: '普通的闲聊，也许比看起来更重要。先听听，再决定今天要做什么。',
    connections: '一个眼熟的徽记，可以把人和地方连起来。沿着你确实注意到的联系找下去。',
    neighbour: '执行计划的人，也有自己的生活。留意邻居和清洁工在乎什么。',
    feelings: '职责和感情，正把一个人拉向不同的方向。他说起她时，仔细听。',
    sniper: '一声枪响，需要的不只是一个愿意开枪的人。想想你已经了解到的那些准备。',
    weapon: '就算暂时进不去，知道危险从哪里开始也很有用。其他地方，也许能提供越过障碍的办法。',
    poison: '回想一下，谁听到你的向日葵时，反应有些古怪。他们周围某件普通的东西，也许值得仔细看看。',
    fermat: '费马的反应还是很可疑。当你有理由在那里多待一会儿时，留意身边的东西。每个人都有自己的作息，一天也只够去五个地方：某天傍晚才知道的东西，也许能在第二天一早打开一扇门。',
    gardener: '一个把植物当命的人，听说水的事一定会气坏。赶在傍晚前找到他——黄昏时他就离开公园了。',
    destroyer: '那个声音有些耳熟。之前的交谈，也许能把她和某个留下个人痕迹的地方联系起来。',
    school: '要进学校，也许得先了解它每天的安排。外面的人，可能比门卫知道得更多。',
    inside: '你已经到了学校。听清路线，留意哪些房间和你调查的人有关。',
    preparations: '有些发现能留到下次循环；白天做的事却不能。看看今天你已经重新做过哪些防备。',
  },
  forecast: {
    survived: '向日葵活下来了。明天到了。',
    handled: '我知道的那些威胁，今晚都已经处理好了。',
    unknown: '今晚还不确定。我还没见过接下来会发生什么。',
    known: [null, '照目前的情况，今晚会遭到邻居的袭击。', '照目前的情况，今晚会遭到狙击手的枪击。', '照目前的情况，今晚会遇到毒药。', '照目前的情况，今晚会遇到太阳毁灭者。'],
  },
  preparations: {
    love: '清洁工已经选择了爱情。',
    gun: '狙击手的武器已经移走。',
    poison: '除草剂已经换成清水。',
  },

  // Julian's cached Mandarin number words: 亿, 万, 千, 百, 十, with 零 ("and")
  // marking a skipped place value.
  numberScale: [[1e8, 'hundredMillion'], [1e4, 'tenThousand'], [1e3, 'thousand'], [100, 'hundred'], [10, 'ten']],
  numberJoin: (amount, rest) => rest < amount / 10,
  martin: ['Martin', '马丁'],
  spell(char) {
    const c = char.toUpperCase();
    if (/[A-Z]/.test(c)) return 'letter:' + c;
    if (/[0-9]/.test(c)) return 'number:' + c;
    return L.pronunciations?.[char] ? 'syllable:' + L.pronunciations[char] : null;
  },

  // Typed answers: the translated name is an alias, and surrounding spaces,
  // letter case and full-width characters don't matter. A wrong name or PIN
  // stays wrong.
  inputValue(value) {
    const text = String(value).normalize('NFKC').trim();
    const raw = text === '马丁' || /^martin$/i.test(text) ? 'Martin' : text;
    const display = raw === 'Martin' ? '马丁' : text;
    return {raw, text: display, parts: [{text: display}]};
  },
  relocalize(value) {
    const parts = value.parts.map(p => (p.id === undefined ? {...p, text: p.text === 'Martin' ? '马丁' : p.text} : p));
    return {...value, parts, text: parts.map(p => (p.id === undefined ? p.text : L.literals[p.id]?.text || '')).join('')};
  },
  // Old reading history predates passage ids. Translate only known authored
  // segments, longest first, and leave player-typed text untouched.
  historyLabel(text) {
    historyReplacements ??= Object.entries(L.literals)
      .flatMap(([id, v]) => [...new Set([v.raw, L.englishHistory?.[id]])]
        .filter(raw => raw && raw !== v.text && raw.length > 1)
        .map(raw => ({raw, text: v.text})))
      .sort((a, b) => b.raw.length - a.raw.length);
    let result = String(text);
    for (const value of historyReplacements) if (result.includes(value.raw)) result = result.split(value.raw).join(value.text);
    return result;
  },

};
