import getISOWeek from 'date-fns/getISOWeek';
import { RawLocation } from 'vue-router';

import { pad } from '@/utils/text';
import { DateRange } from '@/utils/time';

export const avatarUrl = (url: string): string =>
  url && url.startsWith('avatar/') ? `/${url}` : url;

export const eventCalendarRoute = (range: DateRange, date: Date): RawLocation => {
  const route: RawLocation = {
    name: 'events-year-month-day',
    params: { year: date.getFullYear().toString() },
  };

  switch (range) {
    case 'day':
      route.name = 'events-year-month-day';
      route.params!.month = pad(date.getMonth() + 1, 2);
      route.params!.day = pad(date.getDate(), 2);
      break;

    case 'week':
      route.name = 'events-year-wk-week';
      route.params!.week = pad(getISOWeek(date), 2);
      break;

    case 'month':
      route.name = 'events-year-month';
      route.params!.month = pad(date.getMonth() + 1, 2);
  }

  return route;
};
