import { Card, CardContent, CardMedia, Typography, withStyles } from 'material-ui';
import type { Theme } from 'material-ui/styles';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { services } from '../store';
import { compose } from 'redux';


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
    const { events } = this.props;

    if (!events.isFinished && !events.isLoading) {
      services.events.find();
    }
  }

  render() {
    const { classes, events, match } = this.props;

    if (events.isLoading) {
      return <h1>Loading...</h1>
    }

    if (events.isError || !events.queryResult) {
      return <h1>Fail</h1>
    }

    return (
      <div>
        {events.queryResult.data.map((event, index) => (
          <Card className={classes.card} key={`event-${event.id}`}>
            <CardMedia className={classes.flyer} image={event.flyer_front_url}>
            </CardMedia>

            <CardContent className={classes.content}>
              <Link to={`${match.url}/${event.id}`}>
                <Typography type="headline">{event.name}</Typography>
              </Link>
              <Typography type="subheading" color="secondary">
                @ {event.venue_name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
    height: 100,
    width:  100,
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
