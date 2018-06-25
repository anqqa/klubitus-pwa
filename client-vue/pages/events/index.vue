<template>
  <main>
    <h1>{{ title }}</h1>

    <div class="row">

      <div class="col">
        <nav class="nav-inline" role="navigation" aria-label="pagination">
          <ul class="is-horizontal-center">
            <li>
              <nuxt-link :to="localePath(pagination.previous.url)">
                &laquo; {{ pagination.previous.title }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="localePath(pagination.next.url)">
                {{ pagination.next.title }} &raquo;
              </nuxt-link>
            </li>
          </ul>
        </nav>

        <section v-for="(day, dayIndex) in days" :key="dayIndex">
          <h2 class="h6">{{ day.header }}</h2>

          <hr>

          <div v-for="(event, eventIndex) in day.events" :key="eventIndex" class="row">
            <div class="col is-narrow flyer">
              <figure class="image is-16by9">
                <img :src="event.flyer_front_url">
              </figure>
            </div>

            <div class="col">
              <nuxt-link :to="localePath(event.url)">{{ event.name }}</nuxt-link><br>
              <span class="text--secondary">{{ event.hours }}</span>
              &sdot;
              <span>{{ event.venue_name }}, {{ event.city_name }}</span>
            </div>
          </div>
        </section>

        <nav class="nav-inline" role="navigation" aria-label="pagination">
          <ul class="is-horizontal-center">
            <li>
              <nuxt-link :to="localePath(pagination.previous.url)">
                &laquo; {{ pagination.previous.title }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="localePath(pagination.next.url)">
                {{ pagination.next.title }} &raquo;
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="col-3">
        <keep-alive>
          <EventList title="New events" type="latest" />
        </keep-alive>
      </div>

    </div>
  </main>
</template>


<script>
  import addDays from 'date-fns/add_days';
  import addMonths from 'date-fns/add_months';
  import endOfMonth from 'date-fns/end_of_month';
  import format from 'date-fns/format';
  import getISOWeek from 'date-fns/get_iso_week';
  import setISOWeek from 'date-fns/set_iso_week';
  import startOfISOWeek from 'date-fns/start_of_iso_week';

  import { hours, pad, slug } from '../../utils/text';
  import EventList from '../../components/events/EventList';


  const buildPagination = (from, to, range) => {
    const pagination = {
      previous: { title: undefined, url: undefined },
      next:     { title: undefined, url: undefined },
    };
    let previousDate, nextDate;

    switch (range) {

      case 'day':
        previousDate = addDays(from, -1);
        nextDate     = addDays(from, 1);

        pagination.previous.title = 'Previous day';
        pagination.previous.url   = {
          name:   'events-date',
          params: {
            year:  previousDate.getFullYear(),
            month: pad(previousDate.getMonth() + 1, 2),
            day:   pad(previousDate.getDate(), 2),
          }
        };
        pagination.next.title     = 'Next day';
        pagination.next.url       = {
          name:   'events-date',
          params: {
            year:  nextDate.getFullYear(),
            month: pad(nextDate.getMonth() + 1, 2),
            day:   pad(nextDate.getDate(), 2),
          }
        };
        break;

      case 'week':
        previousDate = addDays(from, -7);
        nextDate     = addDays(from, 7);

        pagination.previous.title = 'Previous week';
        pagination.previous.url   = {
          name:   'events-week',
          params: {
            year: previousDate.getFullYear(),
            week: pad(getISOWeek(previousDate), 2),
          }
        };
        pagination.next.title     = 'Next week';
        pagination.next.url       = {
          name:   'events-week',
          params: {
            year: nextDate.getFullYear(),
            week: pad(getISOWeek(nextDate), 2),
          }
        };
        break;

      case 'month':
        previousDate = addMonths(from, -1);
        nextDate     = addMonths(from, 1);

        pagination.previous.title = 'Previous month';
        pagination.previous.url   = {
          name:   'events-date',
          params: {
            year:  previousDate.getFullYear(),
            month: pad(previousDate.getMonth() + 1, 2),
          }
        };
        pagination.next.title     = 'Next month';
        pagination.next.url       = {
          name:   'events-date',
          params: {
            year:  nextDate.getFullYear(),
            month: pad(nextDate.getMonth() + 1, 2),
          }
        };
        break;

    }

    return pagination;
  };


  const buildRange = (year, month, week, day) => {
    let from, to, range;

    if (!year) {

      // Default to this week if no date given
      from  = startOfISOWeek(new Date());
      to    = addDays(from, 7);
      range = 'week';

    }
    else {
      if (week) {
        from  = startOfISOWeek(setISOWeek(new Date(parseInt(year), 1, 10), parseInt(week)));
        to    = addDays(from, 7);
        range = 'week';
      }
      else {
        from  = new Date(parseInt(year), parseInt(month) - 1, day ? parseInt(day) : 1);
        to    = day ? from : endOfMonth(from);
        range = day ? 'day' : 'month';
      }
    }

    return { from, to, range };
  };


  const buildTitle = (from, to) => {
    let dates = [];

    if (from.getFullYear() === to.getFullYear()) {
      if (from.getMonth() === to.getMonth()) {
        if (from.getDate() === to.getDate()) {
          dates = [format(from, 'MMMM Do YYYY')];  // Same date
        }
        else {
          dates = [format(from, 'D'), format(to, 'D MMM YYYY')];  // Same month
        }
      }
      else {
        dates = [format(from, 'D MMM'), format(to, 'D MMM YYYY')];  // Same year
      }
    }
    else {
      dates = [format(from, 'D MMM YYYY'), format(to, 'D MMM YYYY')];  // Nothing same
    }

    return `Events, ${dates.join('–')}`
  };


  const groupByDate = data => {
    const days = [];
    let events = [];
    let today;

    data.forEach(event => {
      const header = format(event.begins_at, 'dddd, MMMM Do');

      if (header !== today) {
        today  = header;
        events = [];

        if (today) {
          days.push({ header, events });
        }
      }

      events.push({
        ...event,
        hours: hours(event.begins_at, event.ends_at),
        url:   { name: 'events-id', params: { id: `${event.id}-${slug(event.name)}` }},
      });
    });

    return days;
  };


  export default {
    async asyncData({ app, params }) {
      let { year, month, week, day } = params;

      // Get date range
      const { from, to, range } = buildRange(year, month, week, day);

      // Fetch events
      const { data } = await app.$axios.$get('events', {
        params: { from: format(from, 'YYYY-MM-DD'), to: format(to, 'YYYY-MM-DD') }
      });

      const days       = groupByDate(data);
      const title      = buildTitle(from, to);
      const pagination = buildPagination(from, to, range);

      return { days, pagination, title };
    },

    components: { EventList },

    head: {
      title: 'Events'
    },

    validate({ params }) {
      const year  = !params.year || /^\d{4}$/.test(params.year);
      const month = !params.month || /^[01]?\d$/.test(params.month);
      const week  = !params.week || /^[0-5]?\d$/.test(params.week);
      const day   = !params.day || /^[0-3]?\d$/.test(params.day);

      return year && month && week && day;
    }

  }
</script>


<style scoped>
  .flyer .image { width: 120px }
</style>
