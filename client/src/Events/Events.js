// @flow

import { DateTime, Interval } from 'luxon';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import type { Theme } from 'material-ui/styles';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import slug from 'slug';

import Pagination from '../components/Pagination';
import { services } from '../store';
import { dateFromISOWeek, monday } from '../utils/date';


type ProvidedProps = {
  classes: Object;
  match:   Object;
  theme:   Theme;
}

type ConnectedProps = {
  events: Object;
}

class Events extends React.PureComponent<ProvidedProps & ConnectedProps> {
  fromDate: DateTime;
  toDate:   DateTime;


  componentWillMount() {
    this.getDateRange();
    this.fetchEvents();
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
      this.getDateRange(nextProps);
      this.fetchEvents();
    }
  }


  fetchEvents() {
    const query = {
      $limit:    100,
      $select:   ['begins_at', 'ends_at', 'city_name', 'flyer_front_url', 'id', 'name', 'venue_name'],
      $sort:     { begins_at: 1 },
      begins_at: { $lt: this.toDate.toISODate() },
      ends_at:   { $gte: this.fromDate.toISODate() },
    };

    services.events.find({ query });
  }


  getDateRange(props?: ProvidedProps) {
    const { params: { week, year } } = (props || this.props).match;

    if (week && year) {
      this.fromDate = DateTime.fromJSDate(dateFromISOWeek(week, year));
    }
    else {
      this.fromDate = DateTime.fromJSDate(monday());
    }

    this.toDate = this.fromDate.plus({ weeks: 1});
  }


  groupEvents(events) {
    const grouped = [];
    let header    = null;

    // Group events by date
    events.forEach(event => {
      const beginsAt = DateTime.fromISO(event.begins_at);
      const myHeader = beginsAt.toLocaleString(DateTime.DATE_HUGE);

      // New date
      if (header !== myHeader) {
        header = myHeader;

        grouped.push({ events: [], header, key: 'group-' + beginsAt.toISOWeekDate() });
      }

      grouped[grouped.length - 1].events.push(event);
    });

    return grouped;
  }


  renderEvents(props) {
    const { classes, events } = props;

    const grouped = this.groupEvents(events);

    return grouped.map((group: { events: Object[], header: string, key: string }) => (
      <div key={group.key}>
        <Typography gutterBottom>{group.header}</Typography>

        {group.events.map(event => {
          const beginsAt = DateTime.fromISO(event.begins_at);
          const endsAt   = DateTime.fromISO(event.ends_at);

          return (
            <Card className={classes.card} key={`event-${event.id}`}>
              <CardMedia className={classes.flyer}
                         image={event.flyer_front_url} />

              <CardContent className={classes.content}>
                <Typography className={classes.city} variant="body2">{event.city_name}</Typography>

                <Link to={`/event/${event.id}-${slug(event.name, { lower: true })}`}>
                  <Typography variant="title">{event.name}</Typography>
                </Link>

                <Typography color="secondary" variant="subheading">
                  {beginsAt.toLocaleString(DateTime.TIME_24_SIMPLE)} - {endsAt.toLocaleString(DateTime.TIME_24_SIMPLE)}
                  @ {event.venue_name}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
    ));
  }


  render() {
    const { classes, events } = this.props;

    if (events.isError) {
      return <h1>Fail</h1>
    }

    if (events.isLoading || !events.queryResult) {
      return <h1>Loading...</h1>
    }


    // Pagination
    const previousWeek = this.fromDate.minus({ weeks: 1 });
    const previousTo   = previousWeek.toFormat("'/events/'yyyy'/week/'W");
    const nextWeek     = this.fromDate.plus({ weeks: 1 });
    const nextTo       = nextWeek.toFormat("'/events/'yyyy'/week/'W");
    const pagination   = <Pagination previous={previousTo}
                                     previousText="Previous week"
                                     next={nextTo}
                                     nextText="Next week" />;

    // Header
    const today  = DateTime.local();
    const toDate = this.fromDate.plus({ days: 6 });

    const title = Interval.fromDateTimes(this.fromDate, toDate).contains(today)
      ? 'Events this week' : `Events on week ${this.fromDate.toFormat('W/yyyy')}`;

    const dateParts = [
      this.fromDate.toLocaleString({
        day:   'numeric',
        month: 'short',
        year:  this.fromDate.year !== toDate.year ? 'numeric' : undefined,
      }),
      toDate.toLocaleString({ day: 'numeric', month: 'short', year: 'numeric' }),
    ];

    const subtitle = dateParts.join(' - ');


    return (
      <section className={classes.container}>
        <Typography variant="title">{title}</Typography>
        <Typography variant="subheading" color="secondary">{subtitle}</Typography>

        {pagination}

        {this.renderEvents({ events: events.queryResult.data, classes })}

        {pagination}
      </section>
    );
  }
}


// Styles
const styles = (theme: Theme) => ({

  card: {
    display:      'flex',
    marginBottom: theme.spacing.unit,
  },

  city: {
    color:  theme.palette.text.hint,
    float: 'right',
  },

  container: {
    flex: '1 1 auto',
  },

  content: {
    flex: '1 1 auto',
  },

  flyer: {
    backgroundPosition: 'top center',
    backgroundSize:     'cover',
    flex:               '0 0 auto',
    overflow:           'hidden',
    width:              120,
  },

});


// Redux
const mapStateToProps = state => ({
  events: state.events,
});


export default compose(
  withStyles(styles, { withTheme: true}),
  connect(mapStateToProps),
)(Events);
