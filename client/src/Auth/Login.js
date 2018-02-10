import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import type { Theme } from 'material-ui/styles/index';
import { withStyles } from 'material-ui/styles/index';
import React from 'react';
import Facebook from 'react-feather/dist/icons/facebook';
import { Link, withRouter } from 'react-router-dom';

import LoginForm from './LoginForm';
import { feathersAuthentication } from '../feathers';
import { SubmissionError } from 'redux-form';


type ProvidedProps = {
  classes: Object;
  match:   Object;
  theme:   Theme;
}

class Login extends React.PureComponent<ProvidedProps, State> {

  handleSubmit = (values, dispatch) => new Promise((resolve, reject) => {
    const strategy = values.username.indexOf('@') > 0 ? 'email' : 'username';

    dispatch(feathersAuthentication.authenticate({
      [strategy]: values.username,
      password:   values.password,
      strategy:   strategy,
    }))
      .then(resolve)
      .catch(err => reject(err.type === 'FeathersError'
        ? new SubmissionError({ ...err.errors, _error: err.message || '' })
        : err
      ));
  });


  render() {
    const { classes } = this.props;

    return(
      <Grid alignItems="center"
            className={classes.container}
            container
            direction="column"
            justify="center">
        <Grid className={classes.item} item>
          <Button className={classes.button} variant="raised">
            <Facebook className={classes.buttonIcon} /> Login with Facebook
          </Button>
        </Grid>

        <Grid className={classes.item} item>
          <Divider />
        </Grid>

        <Grid className={classes.item} item>
          <LoginForm onSubmit={this.handleSubmit} />
        </Grid>

        <Grid className={classes.item} container justify="space-between">
          <Grid item>
            <Button component={Link} size="small" to="/password">Forgot password</Button>
          </Grid>
          <Grid item>
            <Button component={Link} size="small" to="/register">Register</Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}


// Styles
const styles = (theme: Theme) => ({

  button: {
    width: '100%',
  },

  buttonIcon: {
    marginRight: theme.spacing.unit,
  },

  container: {
    flexGrow: 1,
  },

  item: {
    width: 280,
  }

});


export default withRouter(withStyles(styles, { withTheme: true})(Login));
