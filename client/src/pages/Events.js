import { Card, CardContent, CardMedia, Typography, withStyles } from 'material-ui';
import type { Theme } from 'material-ui/styles';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import slug from 'slug';

import { services } from '../store';


type ProvidedProps = {
  classes: Object;
  match:   Object;
  theme:   Theme;
}

type ConnectedProps = {
  events: Object;
}

class Events extends React.PureComponent<ProvidedProps & ConnectedProps> {

  componentWillMount() {
    services.events.find({
      query: {
        $select: ['id', 'flyer_front_url', 'name', 'venue_name'],
        $sort:   { begins_at: 1 },
        ends_at: { $gte: new Date() },
      },
    });
  }


  render() {
    const { classes, events, match } = this.props;

    if (events.isError) {
      return <h1>Fail</h1>
    }

    if (events.isLoading || !events.queryResult) {
      return <h1>Loading...</h1>
    }

    return events.queryResult.data.map((event, index) => (
      <Card className={classes.card} key={`event-${event.id}`}>
        <CardMedia className={classes.flyer} image={event.flyer_front_url} />

        <CardContent className={classes.content}>
          <Link to={`${match.url}/${event.id}-${slug(event.name, { lower: true })}`}>
            <Typography type="title">{event.name}</Typography>
          </Link>
          <Typography type="subheading" color="secondary">
            @ {event.venue_name}
          </Typography>
        </CardContent>
      </Card>
    ));
  }
}


// Styles
const styles = (theme: Theme) => ({

  card: {
    display: 'flex',
  },

  content: {
    flex: '1 0 auto',
  },

  flyer: {
    height: 80,
    width:  80,
  }

});


// Redux
const mapStateToProps = state => ({
  events: state.events,
});


export default compose(
  withStyles(styles, { withTheme: true}),
  connect(mapStateToProps),
)(Events);
