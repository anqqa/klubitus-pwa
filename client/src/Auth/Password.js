import Button from 'material-ui/Button';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import type { Theme } from 'material-ui/styles/index';
import { withStyles } from 'material-ui/styles/index';
import Typography from 'material-ui/Typography';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';


type ProvidedProps = {
  classes: Object;
  match:   Object;
  theme:   Theme;
}

type State = {
  password:     String;
  showPassword: Boolean;
  username:      String;
}

class Login extends React.PureComponent<ProvidedProps, State> {
  state = {
    password:     '',
    showPassword: false,
    username:     '',
  };


  handleChange = prop => event => this.setState({ [prop]: event.target.value });

  handleMouseDownPassword = event => event.preventDefault();

  handleTogglePassword = () => this.setState({ showPassword: !this.state.showPassword });


  render() {
    const { classes } = this.props;

    return(
      <Grid alignItems="center"
            className={classes.container}
            container
            direction="column"
            justify="center">
        <Grid className={classes.item} item>
          <Typography gutterBottom type="title">
            Forgot password
          </Typography>

          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="input-email">Email</InputLabel>
            <Input id="input-email" name="email" type="email" />
            <FormHelperText>Enter your email and we will send you a password reset mail.</FormHelperText>
          </FormControl>

          <Button className={classes.button} color="primary" raised>
            Reset password
          </Button>
        </Grid>

        <Grid className={classes.item} container justify="space-between">
          <Grid item>
            <Button component={Link} dense to="/login">Login</Button>
          </Grid>
          <Grid item>
            <Button component={Link} dense to="/register">Register</Button>
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

  formControl: {
    marginBottom: theme.spacing.unit,
  },

  item: {
    width: 280,
  }

});


// Redux
const mapStateToProps = state => ({
});


export default compose(
  withStyles(styles, { withTheme: true}),
  connect(mapStateToProps),
)(Login);
