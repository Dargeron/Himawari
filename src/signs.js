import {L} from './i18n.js';

// Translate lettering as a separate SVG layer. The recovered image pixels,
// outlines, buildings and hotspot geometry remain exactly the author's.
// Only the Chinese edition re-letters the signs.
export function translatedSigns(name) {
  if (L.code !== 'zh-CN') return null;
  const specs = {
    Escola: {
      size: [395, 258],
      labels: [
        {polygon: '135,62 237,61 235,80 136,81', fill: '#c9baad', x: 186, y: 78, size: 19, text: '学校', spacing: 8},
      ],
    },
    Pizza: {
      size: [228, 255],
      labels: [
        {
          polygon: '82,110 189,115 188,128 82,123',
          fill: '#d6a99f',
          x: 136,
          y: 123,
          size: 13,
          text: '费马披萨店',
          rotate: 3,
        },
        {
          polygon: '87,203 99,204 110,249 99,249',
          fill: '#c4878e',
          x: 98,
          y: 218,
          size: 11,
          text: '热披萨',
          vertical: true,
          rotate: -10,
        },
      ],
    },
    mapa_joc: {
      size: [1280, 974],
      labels: [
        {
          polygon: '428,133 529,133 528,153 429,155',
          fill: '#cfc0b7',
          x: 478,
          y: 151,
          size: 23,
          text: '学校',
          spacing: 10,
        },
        {
          polygon: '881,509 989,513 989,526 881,522',
          fill: '#d6a99f',
          x: 935,
          y: 523,
          size: 18,
          text: '费马披萨店',
          rotate: 3,
        },
        {
          polygon: '885,605 895,605 905,647 895,647',
          fill: '#c4878e',
          x: 897,
          y: 617,
          size: 12,
          text: '热披萨',
          vertical: true,
          rotate: -10,
        },
      ],
    },
  };
  const spec = specs[name];
  if (!spec) return null;
  const ns = 'http://www.w3.org/2000/svg',
    svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + spec.size.join(' '));
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('translated-signs');
  for (const label of spec.labels) {
    const group = document.createElementNS(ns, 'g');
    if (label.rotate) group.setAttribute('transform', `rotate(${label.rotate} ${label.x} ${label.y})`);
    const patch = document.createElementNS(ns, 'polygon');
    patch.setAttribute('points', label.polygon);
    patch.setAttribute('fill', label.fill);
    svg.append(patch);
    const chars = label.vertical ? [...label.text] : [label.text];
    for (const [i, char] of chars.entries()) {
      const text = document.createElementNS(ns, 'text');
      text.setAttribute('x', label.x);
      text.setAttribute('y', label.y + i * (label.size + 2));
      text.setAttribute('font-size', label.size);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', label.text === '学校' ? '#55483f' : '#804348');
      if (label.spacing) text.setAttribute('letter-spacing', label.spacing);
      text.textContent = char;
      group.append(text);
    }
    svg.append(group);
  }
  return svg;
}
