<template>
  <v-layout row wrap>
    <v-flex tag="h1" class="headline">{{ title }}</v-flex>

    <v-flex v-for="(day, dayIndex) in days" :key="dayIndex" xs12 tag="section">
      <h2 class="subheading mt-3">{{ day.header }}</h2>

      <v-card v-for="(event, eventIndex) in day.events" :key="eventIndex" flat tile class="transparent">
        <v-container grid-list-xs>
          <v-layout row wrap>
            <v-flex sm2 xs12>
              <v-card-media :src="event.flyer_front_url" height="80px" />
            </v-flex>

            <v-flex sm10 xs12>
              <v-card-title>
                <v-flex tag="h3" class="subheading" xs12>
                  <nuxt-link :to="`/events/${event.id}`">{{ event.name }}</nuxt-link>
                </v-flex>
                <div>
                  {{ event.hours }}
                  &sdot; {{ event.venue_name }}, {{ event.city_name }}
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

  </v-layout>
</template>


<script>
  import addDays from 'date-fns/add_days';
  import endOfMonth from 'date-fns/end_of_month';
  import format from 'date-fns/format';
  import setISOWeek from 'date-fns/set_iso_week';
  import startOfISOWeek from 'date-fns/start_of_iso_week';
  import VDivider from 'vuetify/es5/components/VDivider';

  export default {
    async asyncData({ app, params }) {
      let { year, month, week, day } = params;

      // Get date range
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

      // Fetch events
      const { data } = await app.$axios.get('events', {
        params: { from: format(from, 'YYYY-MM-DD'), to: format(to, 'YYYY-MM-DD') }
      });

      // Events grouped by date
      const days = [];
      let events = [];
      let today;

      data.data.forEach(event => {
        const header = format(event.begins_at, 'dddd, MMMM Do');

        if (header !== today) {
          today  = header;
          events = [];

          if (today) {
            days.push({ header, events });
          }
        }

        // Opening hours
        const hours = [format(event.begins_at, 'HH:mm')];

        if (event.ends_at) {
          hours.push('-');
          hours.push(format(event.ends_at, 'HH:mm'));
        }
        else {
          hours.push('-&gt;');
        }

        events.push({ ...event, hours: hours.join(' ') });
      });

      // Build title
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

      return { days, title: 'Events, ' + dates.join(' – ') };
    },

    components: { VDivider },

    data() {
      return {}
    },

    head: {
      title: 'Events'
    },

    methods: {},

    validate({ params }) {
      const year  = !params.year || /^\d{4}$/.test(params.year);
      const month = !params.month || /^[01]?\d$/.test(params.month);
      const week  = !params.week || /^[0-5]?\d$/.test(params.week);
      const day   = !params.day || /^[0-3]?\d$/.test(params.day);

      return year && month && week && day;
    }
  }
</script>
