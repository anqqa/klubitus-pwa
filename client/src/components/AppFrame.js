// @flow
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import withStyles from 'material-ui/styles/withStyles';
import type { Theme } from 'material-ui/styles';
import * as React from 'react';
import Menu from 'react-feather/dist/icons/menu';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import { compose } from 'redux';

import AppDrawer from './AppDrawer';
import { appBars } from './routes';
import { feathersAuthentication } from '../feathers';
import { renderRoutes } from 'react-router-config';


type ProvidedProps = {
  classes: Object;
  history: RouterHistory;
  theme:   Theme;
}

type StateProps = {
  isAuthenticated: boolean;
  user?:           Object;
}

type DispatchProps = {
  handleLogout: Function;
}

type Props = {
  children: React.Node;
}


type State = {
  drawerOpen: boolean;
}


class AppFrame extends React.Component<ProvidedProps & StateProps & DispatchProps & Props, State> {
  state = { drawerOpen: false };


  componentDidMount() {

    // Remove SSR CSS
    const jssStyles = document.getElementById('jss-server-side');

    console.log(jssStyles);

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

  }


  componentWillReceiveProps(nextProps: ProvidedProps & StateProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {

      // Logged in
      const { history, history: { location }} = this.props;

      if (location.pathname === '/login') {
        history.goBack();
      }

    }
    else if (this.props.isAuthenticated && !nextProps.isAuthenticated) {

      // Logged out

    }
  }


  handleDrawerToggle = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };


  handleLogout = event => {
    event.preventDefault();

    this.props.handleLogout();
  };


  render() {
    const { children, classes, isAuthenticated, user } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>

          <AppBar className={classes.appBar} color="default">
            <Toolbar>
              <IconButton aria-label="open drawer"
                          className={classes.navIconHide}
                          onClick={this.handleDrawerToggle}>
                <Menu />
              </IconButton>

              <div className={classes.appBarFlex}>
                {renderRoutes(appBars)}
              </div>

              {isAuthenticated
                ? <div>
                  <Button component={Link} to={`/user/${user.username}`}>Profile</Button>
                  <Button onClick={this.handleLogout}>Logout</Button>
                </div>
                : <div>
                  <Button component={Link} to="/login">Login</Button>
                  <Button component={Link} to="/register">Register</Button>
                </div>}

            </Toolbar>
          </AppBar>

          <AppDrawer className={classes.drawer}
                     isOpen={this.state.drawerOpen}
                     onClose={this.handleDrawerToggle} />

          <main id="content" className={classes.content}>
            {children}
          </main>

        </div>
      </div>
    );
  }
}


// Redux
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isSignedIn,
  user:            state.auth.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleLogout: () => { dispatch(feathersAuthentication.logout()); }
});


// Styles
const drawerWidth = 200;

const styles = (theme: Theme) => ({

  '@global': {
    html: {
      background: theme.palette.background.default,
    },

    a: {
      textDecoration: 'none',
    }
  },

  root: {
    display:  'flex',
    flexGrow: 1,
  },

  appFrame: {
    display:  'flex',
    flexGrow: 1,
    position: 'relative',
  },

  appBar: {
    marginLeft: drawerWidth,
    position:   'absolute',

    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },

  appBarFlex: {
    flex: 1,
  },

  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },

  drawer: {
    display:  'flex',
    flexGrow: 1,
  },

  content: theme.mixins.gutters({
    backgroundColor: theme.palette.background.default,
    display:         'flex',
    flex:            '1 1 100%',
    // height:          'calc(100% - 56px)',
    marginTop:       56,
    maxWidth:        '100%',
    padding:         theme.spacing.unit * 3,

    [theme.breakpoints.up('sm')]: {
      // height:    'calc(100% - 64px)',
      marginTop: 64,
    }
  })

});



export default withRouter(compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(AppFrame));
