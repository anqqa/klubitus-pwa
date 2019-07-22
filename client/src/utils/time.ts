import endOfISOWeek from 'date-fns/end_of_iso_week';
import endOfMonth from 'date-fns/end_of_month';
import format from 'date-fns/format';
import setISOWeek from 'date-fns/set_iso_week';
import startOfISOWeek from 'date-fns/start_of_iso_week';

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
export const dateRange = (
  year?: number,
  month?: number,
  week?: number,
  day?: number
): { from: Date; to: Date; range: 'day' | 'week' | 'month' | 'year' } => {
  let from;
  let to;
  let range;

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

export const fuzzyTimeDistance = (since: Date): string => {
  const now: Date = new Date();
  const distance: number = now.valueOf() - since.valueOf();

  if (distance < MINUTE) {
    return `${distance}s`;
  } else if (distance < HOUR) {
    return `${Math.round(distance / MINUTE)}min`;
  } else if (distance < DAY) {
    return `${Math.round(distance / HOUR)}h`;
  } else if (distance < MONTH) {
    return `${Math.round(distance / DAY)}d`;
  } else if (now.getFullYear() === since.getFullYear()) {
    return format(since, 'MMM D');
  } else {
    return format(since, "MMM 'YY");
  }
};

export const hours = (from: Date, to: Date): string => {
  return format(from, 'HH:mm') + (to ? '–' + format(to, 'HH:mm') : '→');
};
