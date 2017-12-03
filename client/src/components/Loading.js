// @flow

import React from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import type { Theme } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';


export function Loading(props) {
  const { classes, error, timedOut, pastDelay } = props;

  if (error) {
    return <Paper className={classes.paper}><Typography color="error" type="body1">Error!</Typography></Paper>;
  }
  else if (timedOut) {
    return <Paper className={classes.paper}><Typography type="body1">Still loading...</Typography></Paper>;
  }
  else if (pastDelay) {
    return <Paper className={classes.paper}><Typography type="body1">Loading...</Typography></Paper>;
  }
  else {
    return null;
  }
}


const styles = (theme: Theme) => ({
  paper: theme.mixins.gutters({
    flex:     '1 0 auto',
    height:   20,
    padding:  theme.spacing.unit * 3
  }),
});

export default withStyles(styles, { withTheme: true })(Loading);
