import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Input, { InputAdornment, InputLabel } from 'material-ui/Input';
import type { Theme } from 'material-ui/styles/index';
import { withStyles } from 'material-ui/styles/index';
import React from 'react';
import Eye from 'react-feather/dist/icons/eye';
import EyeOff from 'react-feather/dist/icons/eye-off';
import Facebook from 'react-feather/dist/icons/facebook';
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
          <Button className={classes.button} variant="raised">
            <Facebook className={classes.buttonIcon} /> Login with Facebook
          </Button>
        </Grid>

        <Grid className={classes.item} item>
          <Divider />
        </Grid>

        <Grid className={classes.item} item>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="input-email">Email</InputLabel>
            <Input id="input-email" name="email" type="text" />
          </FormControl>

          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="input-username">Username</InputLabel>
            <Input id="input-username" name="username" type="text" />
          </FormControl>

          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="input-password">Password</InputLabel>
            <Input id="input-password"
                   name="password"
                   onChange={this.handleChange('password')}
                   type={this.state.showPassword ? 'text' : 'password'}
                   value={this.state.password}
                   endAdornment={
                     <InputAdornment position="end">
                       <IconButton onClick={this.handleTogglePassword}
                                   onMouseDown={this.handleMouseDownPassword}
                                   title="Show password">
                         {this.state.showPassword ? <EyeOff size={16} /> : <Eye size={16}/>}
                       </IconButton>
                     </InputAdornment>
                   } />
          </FormControl>

          <Button className={classes.button} color="primary" variant="raised">
            Register
          </Button>

        </Grid>

        <Grid className={classes.item} container justify="space-between">
          <Grid item>
            <Button component={Link} size="small" to="/login">Login</Button>
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
