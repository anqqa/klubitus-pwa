import React from 'react';
import { connect } from 'react-redux';
import { feathersServices } from '../feathers';
import { Card, CardContent, CardMedia, Typography, withStyles } from 'material-ui';
import type { Theme } from 'material-ui/styles';
import { Link } from 'react-router-dom';


type ProvidedProps = {
  classes: Object;
  match:   Object;
  theme:   *;
}

type ConnectedProps = {
  events: Object;
}

type DispatchProps = {
  fetchEvents: Function;
}

class Events extends React.PureComponent<ProvidedProps & ConnectedProps & DispatchProps> {

  componentWillMount() {
    const { events } = this.props;

    if (!events.isFinished && !events.isLoading) {
      this.props.fetchEvents();
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

const styledEvents = withStyles(styles, { withTheme: true })(Events);


const mapDispatchToProps = dispatch => {
  return {
    fetchEvents: () => dispatch(feathersServices.events.find()),
  };
};


const mapStateToProps = state => {
  return {
    events: state.events,
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(styledEvents);

