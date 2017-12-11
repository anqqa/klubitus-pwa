import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import { InputAdornment } from 'material-ui/Input';
import type { Theme } from 'material-ui/styles/index';
import { withStyles } from 'material-ui/styles/index';
import React from 'react';
import Eye from 'react-feather/dist/icons/eye';
import EyeOff from 'react-feather/dist/icons/eye-off';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';


type Props = {
  classes:      Object;
  handleSubmit: Function;
  submitting:   Boolean;
}

type State = {
  password:     String;
  showPassword: Boolean;
  username:     String;
}

class LoginForm extends React.PureComponent<Props, State> {
  state = {
    password:     '',
    showPassword: false,
    username:     '',
  };


  handleChange = event => this.setState({ password: event.target.value });

  handleMouseDownPassword = event => event.preventDefault();

  handleTogglePassword = () => this.setState({ showPassword: !this.state.showPassword });


  render() {
    const { classes, error, handleSubmit, submitting } = this.props;

    const endAdornment = (
      <InputAdornment position="end">
        <IconButton onClick={this.handleTogglePassword}
                    onMouseDown={this.handleMouseDownPassword}
                    title="Show password">
          {this.state.showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
        </IconButton>
      </InputAdornment>
    );

    return(
      <form onSubmit={handleSubmit}>

        <FormControl className={classes.formControl} fullWidth>
          <Field autoFocus
                 component={TextField}
                 error={!!error}
                 label="Username or email"
                 name="username"
                 required />
        </FormControl>

        <FormControl className={classes.formControl} fullWidth>
          <Field component={TextField}
                 error={!!error}
                 helperText={error}
                 InputProps={{endAdornment}}
                 label="Password"
                 name="password"
                 onChange={this.handleChange}
                 required
                 type={this.state.showPassword ? 'text' : 'password'}
                 value={this.state.password} />
        </FormControl>

        <Button className={classes.button}
                color="primary"
                disabled={submitting}
                raised
                type="submit">
          {submitting ? 'Logging in...' : 'Login'}
        </Button>

      </form>
    );
  }
}


// Styles
const styles = (theme: Theme) => ({

  button: {
    width: '100%',
  },

  formControl: {
    marginBottom: theme.spacing.unit * 3,
  },

});


export default compose(
  withStyles(styles, { withTheme: true }),
  reduxForm({ form: 'login' }),
)(LoginForm);
