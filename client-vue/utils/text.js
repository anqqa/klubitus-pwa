import format from 'date-fns/format';


export const hours = (from, to) => {
  return format(from, 'HH:mm') + (to ? '–' + format(to, 'HH:mm') : '→');
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
