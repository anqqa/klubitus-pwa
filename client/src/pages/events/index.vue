<template>
  <main class="row">
    <div class="sidebar col-3">
      <datepicker
        :highlighted="highlighted"
        :inline="true"
        :monday-first="true"
        :open-date="highlighted.from"
        wrapper-class="calendar"
        @selected="dateSelected"
      />
    </div>

    <div class="col main-content">
      <header>
        <h1>{{ title }}</h1>
      </header>

      <nav class="pagination" role="navigation" aria-label="pagination">
        <nuxt-link :to="localePath(pagination.previous.url)" class="button pagination-previous">
          &laquo; {{ pagination.previous.title }}
        </nuxt-link>
        <nuxt-link :to="localePath(pagination.next.url)" class="button pagination-next">
          {{ pagination.next.title }} &raquo;
        </nuxt-link>
      </nav>

      <section v-for="(day, dayIndex) in days" :key="dayIndex">
        <h2>{{ day.header }}</h2>

        <hr />

        <div v-for="(event, eventIndex) in day.events" :key="eventIndex" class="row">
          <div class="col is-narrow flyer">
            <figure class="image is-16by9">
              <img :src="event.flyer_front_url" />
            </figure>
          </div>

          <div class="col">
            <nuxt-link :to="localePath(event.url)">{{ event.name }}</nuxt-link>
            <br />
            <span class="text--secondary">{{ event.hours }}</span>
            &sdot;
            <span>{{ event.venue_name }}, {{ event.city_name }}</span>
          </div>
        </div>
      </section>

      <nav class="pagination" role="navigation" aria-label="pagination">
        <nuxt-link :to="localePath(pagination.previous.url)" class="button pagination-previous">
          &laquo; {{ pagination.previous.title }}
        </nuxt-link>
        <nuxt-link :to="localePath(pagination.next.url)" class="button pagination-next">
          {{ pagination.next.title }} &raquo;
        </nuxt-link>
      </nav>
    </div>

    <div class="col-3 sidebar">
      <keep-alive>
        <event-list title="New events" type="latest" />
      </keep-alive>
    </div>
  </main>
</template>

<script>
import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import format from 'date-fns/format';
import getISOWeek from 'date-fns/get_iso_week';
import Datepicker from 'vuejs-datepicker';

import EventList from '../../components/events/EventList';
import { pad, slug } from '../../utils/text';
import { dateRange, hours } from '../../utils/time';

const buildPagination = (from, to, range) => {
  let previousDate, nextDate, previousTitle, nextTitle;

  switch (range) {
    case 'day':
      previousTitle = 'Previous day';
      nextTitle = 'Next day';
      previousDate = addDays(from, -1);
      nextDate = addDays(from, 1);
      break;

    case 'week':
      previousTitle = 'Previous week';
      nextTitle = 'Next week';
      previousDate = addDays(from, -7);
      nextDate = addDays(from, 7);
      break;

    case 'month':
      previousTitle = 'Previous month';
      nextTitle = 'Next month';
      previousDate = addMonths(from, -1);
      nextDate = addMonths(from, 1);
      break;
  }

  return {
    previous: { title: previousTitle, url: getRoute(range, previousDate) },
    next: { title: nextTitle, url: getRoute(range, nextDate) },
  };
};

const buildTitle = (from, to) => {
  let dates = [];

  if (from.getFullYear() === to.getFullYear()) {
    if (from.getMonth() === to.getMonth()) {
      if (from.getDate() === to.getDate()) {
        dates = [format(from, 'MMMM Do YYYY')]; // Same date
      } else {
        dates = [format(from, 'D'), format(to, 'D MMM YYYY')]; // Same month
      }
    } else {
      dates = [format(from, 'D MMM'), format(to, 'D MMM YYYY')]; // Same year
    }
  } else {
    dates = [format(from, 'D MMM YYYY'), format(to, 'D MMM YYYY')]; // Nothing same
  }

  return `Events, ${dates.join('–')}`;
};

const getRoute = (range, date) => {
  const route = { name: 'events-year-month-day', params: { year: date.getFullYear() } };

  switch (range) {
    case 'day':
      route.name = 'events-year-month-day';
      route.params.month = pad(date.getMonth() + 1, 2);
      route.params.day = pad(date.getDate(), 2);
      break;

    case 'week':
      route.name = 'events-year-wk-week';
      route.params.week = pad(getISOWeek(date), 2);
      break;

    case 'month':
      route.name = 'events-year-month';
      route.params.month = pad(date.getMonth() + 1, 2);
  }

  return route;
};

const groupByDate = data => {
  const days = [];
  let events = [];
  let today;

  data.forEach(event => {
    const header = format(event.begins_at, 'dddd, MMMM Do');

    if (header !== today) {
      today = header;
      events = [];

      if (today) {
        days.push({ header, events });
      }
    }

    events.push({
      ...event,
      hours: hours(event.begins_at, event.ends_at),
      url: {
        name: 'events-id',
        params: { id: `${event.id}-${slug(event.name)}` },
      },
    });
  });

  return days;
};

export default {
  async asyncData({ app, params }) {
    let { year, month, week, day } = params;

    [year, month, week, day].map(parseInt);

    // Get date range
    const { from, to, range } = dateRange(year, month, week, day);

    // Fetch events
    const { data } = await app.$axios.$get('events', {
      params: {
        from: format(from, 'YYYY-MM-DD'),
        to: format(to, 'YYYY-MM-DD'),
      },
    });

    const days = groupByDate(data);
    const title = buildTitle(from, to);
    const pagination = buildPagination(from, to, range);

    return { days, highlighted: { from, to }, pagination, range, title };
  },

  components: { Datepicker, EventList },

  methods: {
    dateSelected(date) {
      const route = this.localePath(getRoute(this.range, date));

      this.$router.push(route);
    },
  },

  head: {
    title: 'Events',
  },

  validate({ params }) {
    const year = !params.year || /^\d{4}$/.test(params.year);
    const month = !params.month || /^[01]?\d$/.test(params.month);
    const week = !params.week || /^[0-5]?\d$/.test(params.week);
    const day = !params.day || /^[0-3]?\d$/.test(params.day);

    return year && month && week && day;
  },
};
</script>

<style scoped>
.flyer {
  flex-basis: 120px;
}
</style>
