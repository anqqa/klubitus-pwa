import endOfMonth from 'date-fns/end_of_month';
import endOfISOWeek from 'date-fns/end_of_iso_week';
import setISOWeek from 'date-fns/set_iso_week';
import startOfISOWeek from 'date-fns/start_of_iso_week';
import format from 'date-fns/format';

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

/**
 * Build a date range from given arguments, returning first and last date.
 *
 * @param  {number}  [year]
 * @param  {number}  [month]
 * @param  {number}  [week]
 * @param  {number}  [day]
 * @return  {{from: Date, to: Date, range: string}}
 */
export const dateRange = (year, month, week, day) => {
  let from, to, range;

  if (!year) {
    // Default to this week if no date given
    from = startOfISOWeek(new Date());
    to = endOfISOWeek(from);
    range = 'week';
  } else {
    if (week) {
      from = startOfISOWeek(setISOWeek(new Date(year, 1, 10), week));
      to = endOfISOWeek(from);
      range = 'week';
    } else {
      from = new Date(year, month ? month - 1 : 0, day ? day : 1);

      if (!month) {
        to = new Date(year, 11, 31);
        range = 'year';
      } else if (!day) {
        to = endOfMonth(from);
        range = 'month';
      } else {
        to = from;
        range = 'day';
      }
    }
  }

  return { from, to, range };
};

export const fuzzyTimeDistance = since => {
  const now = new Date();
  const distance = now - since;

  if (distance < MINUTE) {
    return `${distance}s`;
  } else if (distance < HOUR) {
    return `${Math.round(distance / MINUTE)}min`;
  } else if (distance < DAY) {
    return `${Math.round(distance / HOUR)}h`;
  } else if (distance < MONTH) {
    return `${Math.round(distance / DAY)}d`;
  } else if (now.getYear() === since.getYear()) {
    return format(since, 'MMM D');
  } else {
    return format(since, "MMM 'YY");
  }
};

export const hours = (from, to) => {
  return format(from, 'HH:mm') + (to ? '–' + format(to, 'HH:mm') : '→');
};
