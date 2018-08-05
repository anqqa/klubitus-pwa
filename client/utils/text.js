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


export const pad = (number, size) => {
  let padded = String(number);

  while (padded.length < size) {
    padded = '0' + padded;
  }

  return padded;
};


export const slug = text => {
  return text.toString().toLowerCase()
    .replace(/[àáäâã]/g, 'a')  // Transliterate
    .replace(/[èéëê]/g, 'e')
    .replace(/[ìíïî]/g, 'i')
    .replace(/[òóöôõ]/g, 'o')
    .replace(/[ùúüû]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    .replace(/[^\w]/g, '-')   // Dashify
    .replace(/-+/g, '-')      // Collapse dashes
    .replace(/^-/, '')        // Trim leading and trailing dashes
    .replace(/-$/, '');
};
