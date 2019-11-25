<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-flex md8>
        <header>
          <h1 class="display-1">{{ title }}</h1>
        </header>

        <nav class="text-center" role="navigation" aria-label="pagination">
          <v-btn :to="localePath(pagination.previous.url)" nuxt text>
            &laquo; {{ pagination.previous.title }}
          </v-btn>
          <v-btn :to="localePath(pagination.next.url)" nuxt text>
            {{ pagination.next.title }} &raquo;
          </v-btn>
        </nav>

        <section v-for="(day, dayIndex) in days" :key="dayIndex">
          <v-subheader class="title" v-text="day.header" />

          <v-divider />

          <event-card v-for="(event, eventIndex) in day.events" :key="eventIndex" :event="event" />
        </section>

        <nav class="text-center" role="navigation" aria-label="pagination">
          <v-btn :to="localePath(pagination.previous.url)" nuxt text>
            &laquo; {{ pagination.previous.title }}
          </v-btn>
          <v-btn :to="localePath(pagination.next.url)" nuxt text>
            {{ pagination.next.title }} &raquo;
          </v-btn>
        </nav>
      </v-flex>

      <v-flex md4>
        <v-date-picker
          v-model="selectedDate"
          first-day-of-week="1"
          full-width
          no-title
          show-week
          @input="dateSelected"
          class="mb-4"
        />

        <keep-alive>
          <event-list title="New events" type="latest" />
        </keep-alive>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { addDays, addMonths, format, parseISO } from 'date-fns';
import { Component, Vue } from 'nuxt-property-decorator';
import { RawLocation } from 'vue-router';

import EventCard from '@/components/events/EventCard.vue';
import EventList from '@/components/events/EventList.vue';
import Event from '@/models/Event';
import { dateRange as buildTitle } from '@/utils/text';
import { DateRange, dateRange } from '@/utils/time';
import { eventCalendarRoute } from '@/utils/url';

interface DayGroup {
  header: string;
  events: Array<Event | { hours: string; url: RawLocation }>;
}

const buildPagination = (from: Date, to: Date, range: DateRange) => {
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
    previous: { title: previousTitle, url: eventCalendarRoute(range, previousDate) },
    next: { title: nextTitle, url: eventCalendarRoute(range, nextDate) },
  };
};

const groupByDate = (data: Event[]): DayGroup[] => {
  const days: DayGroup[] = [];
  let events: any[] = [];
  let today;

  data.forEach(event => {
    const header = format(parseISO(event.begins_at!), 'EEEE, MMMM do');

    if (header !== today) {
      today = header;
      events = [];

      if (today) {
        days.push({ header, events });
      }
    }

    events.push(event);
  });

  return days;
};

@Component({
  components: { EventCard, EventList },
  head: { title: 'Events' },
})
export default class EventsIndex extends Vue {
  days: DayGroup[] = [];
  highlighted: { from: Date; to: Date } | null = null;
  range: DateRange = 'week';
  selectedDate: string = format(new Date(), 'yyyy-MM-dd');
  title: string = 'Events';

  async asyncData({ params }) {
    const { year, month, week, day } = params;

    [year, month, week, day].map(parseInt);

    // Get date range
    const { from, to, range } = dateRange(year, month, week, day);

    // Fetch events
    const events = await new Event()
      .filter('ends_at', 'gte', format(from, 'yyyy-MM-dd'))
      .filter('begins_at', 'lte', format(to, "yyyy-MM-dd'T'23:59:59"))
      .limit(10)
      .sort('begins_at', 'ASC')
      .get();

    const days = groupByDate(events);
    const title = buildTitle(from, to);
    const pagination = buildPagination(from, to, range);

    return {
      days,
      highlighted: { from, to },
      pagination,
      range,
      selectedDate: format(from, 'yyyy-MM-dd'),
      title,
    };
  }

  dateSelected(date: string) {
    const route = this.localePath(eventCalendarRoute(this.range, new Date(date)));

    this.$router.push(route);
  }

  validate({ params }) {
    const year = !params.year || /^\d{4}$/.test(params.year);
    const month = !params.month || /^[01]?\d$/.test(params.month);
    const week = !params.week || /^[0-5]?\d$/.test(params.week);
    const day = !params.day || /^[0-3]?\d$/.test(params.day);

    return year && month && week && day;
  }
}
</script>
