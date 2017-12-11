// @flow

import React from 'react';
import Typography from 'material-ui/Typography';
import type { Theme } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';


export function Loading(props) {
  const { classes, error, timedOut, pastDelay } = props;

  if (error) {
    return <div className={classes.paper}><Typography color="error" type="body1">Error!</Typography></div>;
  }
  else if (timedOut) {
    return <div className={classes.paper}><Typography type="body1">Still loading...</Typography></div>;
  }
  else if (pastDelay) {
    return <div className={classes.paper}><Typography type="body1">Loading...</Typography></div>;
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
