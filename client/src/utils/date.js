// @flow

/**
 * Get a date of Monday of week and year.
 *
 * @param   {number}  week
 * @param   {number}  year
 * @return  {Date}
 */
export const dateFromISOWeek = (week: number, year: number) => {
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const dow  = date.getDay();

  if (dow <= 4) {
    date.setDate(date.getDate() - dow + 1);
  }
  else {
    date.setDate(date.getDate() + 8 - dow);
  }

  return date;
};


/**
 * Get the start of the week.
 *
 * @param   {Date}  [date]
 * @return  {Date}
 */
export const monday = (date?: Date) => {
  const output = date ? new Date(date.valueOf()) : new Date();
  output.setHours(0, 0, 0, 0);

  const dow = output.getDay();

  if (dow < 1) {
    output.setDate(output.getDate() - 6);
  }
  else if (dow > 1 ) {
    output.setDate(output.getDate() - dow + 1);
  }

  return output;
};
