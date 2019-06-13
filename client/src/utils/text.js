const colors = [
  'amber',
  'blue',
  'blue-grey',
  'brown',
  'cyan',
  'deep-orange',
  'deep-purple',
  'green',
  'grey',
  'indigo',
  'light-blue',
  'light-green',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
];

export const colorFromText = text => {
  let number = 0;

  for (let c = 0; c < text.length; c++) {
    number += text.charCodeAt(c);
  }

  return colors[number % colors.length];
};

const formatter = new Intl.NumberFormat();

export const count = (number, singular, plural) => {
  return `${formatter.format(number)} ${number === 1 ? singular : plural}`;
};

export const nFormatter = (number, digits, bytes) => {
  const regex = /\.0+|(\.[0-9]*[1-9])0+$/;
  const base = bytes ? 1024 : 1000;
  const symbols = [
    { value: base ** 0, symbol: '' },
    { value: base ** 1, symbol: 'k' },
    { value: base ** 2, symbol: 'M' },
    { value: base ** 3, symbol: 'G' },
    { value: base ** 4, symbol: 'T' },
    { value: base ** 5, symbol: 'P' },
    { value: base ** 6, symbol: 'E' },
  ];

  let i;
  for (i = symbols.length - 1; i > 0; i--) {
    if (number > symbols[i].value) {
      break;
    }
  }

  const value = (number / symbols[i].value).toFixed(digits).replace(regex, '$1');

  return `${value}${symbols[i].symbol}${bytes ? 'B' : ''}`;
};

export const pad = (number, size) => {
  let padded = String(number);

  while (padded.length < size) {
    padded = '0' + padded;
  }

  return padded;
};

export const slug = text => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[àáäâã]/g, 'a') // Transliterate
    .replace(/[èéëê]/g, 'e')
    .replace(/[ìíïî]/g, 'i')
    .replace(/[òóöôõ]/g, 'o')
    .replace(/[ùúüû]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    .replace(/[^\w]/g, '-') // Dashify
    .replace(/-+/g, '-') // Collapse dashes
    .replace(/^-/, '') // Trim leading and trailing dashes
    .replace(/-$/, '');
};
