import format from 'date-fns/format';

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

export const colorFromText = (text: string): string => {
  let index = 0;

  for (let c = 0; c < text.length; c++) {
    index += text.charCodeAt(c);
  }

  return colors[index % colors.length];
};

const formatter = new Intl.NumberFormat();

export const count = (value: number, singular: string, plural: string): string => {
  return `${formatter.format(value)} ${value === 1 ? singular : plural}`;
};

export const dateRange = (from: Date, to: Date): string => {
  let dates: string[] = [];

  if (from.getFullYear() === to.getFullYear()) {
    if (from.getMonth() === to.getMonth()) {
      if (from.getDate() === to.getDate()) {
        dates = [format(from, 'MMMM do yyyy')]; // Same date
      } else {
        dates = [format(from, 'd'), format(to, 'd MMM yyyy')]; // Same month
      }
    } else {
      dates = [format(from, 'd MMM'), format(to, 'd MMM yyyy')]; // Same year
    }
  } else {
    dates = [format(from, 'd MMM yyyy'), format(to, 'd MMM yyyy')]; // Nothing same
  }

  return dates.join('–');
};

export const nFormatter = (value: number, digits: number, bytes?: boolean): string => {
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
    if (value > symbols[i].value) {
      break;
    }
  }

  const result = (value / symbols[i].value).toFixed(digits).replace(regex, '$1');

  return `${result}${symbols[i].symbol}${bytes ? 'B' : ''}`;
};

export const pad = (value: number, size: number): string => {
  let padded = String(value);

  while (padded.length < size) {
    padded = '0' + padded;
  }

  return padded;
};

export const slug = (text?: string): string => {
  if (!text) {
    return '';
  }

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
