import format from 'date-fns/format';


const MINUTE = 60;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;
const MONTH  = 30 * DAY;

export const fuzzyTimeDistance = (since) => {
  const now      = new Date();
  const distance = now - since;

  if (distance < MINUTE) {
    return `${distance}s`;
  }
  else if (distance < HOUR) {
    return `${Math.round(distance / MINUTE)}min`;
  }
  else if (distance < DAY) {
    return `${Math.round(distance / HOUR)}h`;
  }
  else if (distance < MONTH) {
    return `${Math.round(distance / DAY)}d`;
  }
  else if (now.getYear() === since.getYear()) {
    return format(since, 'MMM D');
  }
  else {
    return format(since, 'MMM \'YY');
  }
};


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
