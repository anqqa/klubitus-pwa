import { Button, Divider, Typography, withStyles } from 'material-ui';
import type { Theme } from 'material-ui/styles/index';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { services } from '../store';


type ProvidedProps = {
  classes: Object;
  match:   Object;
}

type ConnectedProps = {
  event: Object;
}

class Event extends React.PureComponent<ProvidedProps & ConnectedProps> {

  componentWillMount() {
    const { match } = this.props;

    services.events.get(parseInt(match.params.id));
  }


  render() {
    const { classes, events } = this.props;

    if (events.isError) {
      return <h1>Fail</h1>
    }

    if (events.isLoading || !events.data) {
      return <h1>Loading...</h1>
    }

    const event    = events.data;
    const beginsAt = moment(event.begins_at);
    const endsAt   = moment(event.ends_at);

    return (
      <div>
        <header className={classes.header}>
          <img alt="Flyer" src={event.flyer_front_url} />

          <Typography className={classes.date}
                      type="subheading">{beginsAt.format('dddd, MMMM Do YYYY')}</Typography>

          <Typography className={classes.title}
                      type="headline">{event.name}</Typography>

          <Typography type="body2">
            {event.venue_name} {event.city_name}<br />
            {beginsAt.format('HH:mm')} - {endsAt.format('HH:mm')}
          </Typography>

          {event.facebook_id &&
            <Button color="default"
                    component="a"
                    href={`https://facebook.com/events/${event.facebook_id}/`}>Facebook Event</Button>}
        </header>

        <Divider className={classes.divider} />

        <Typography>
          {event.info.split("\n\n").map(paragraph =>
            <p>
              {paragraph.split("\n").map(line => <span>{line}<br /></span>)}
            </p>)}
        </Typography>
      </div>
    );
  }
}


// Styles
const styles = (theme: Theme) => ({

  divider: {
    margin: theme.spacing.unit,
  },

  header: {
    textAlign:     'center',
    textTransform: 'uppercase',
  },

  title: {
    margin: theme.spacing.unit,
  }

});


// Redux
const mapStateToProps = state => ({
  events: state.events,
});


export default compose(
  withStyles(styles, { withTheme: true}),
  connect(mapStateToProps),
)(Event);
