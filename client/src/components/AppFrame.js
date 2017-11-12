// @flow
import type { Theme } from 'material-ui/styles';
import { AppBar, Divider, Drawer, Hidden, IconButton, MenuItem, Toolbar, Typography, withStyles } from 'material-ui';
import * as React from 'react';
import { Link } from 'react-router-dom';


type ProvidedProps = {
  classes: Object;
  theme:   Theme;
}

type Props = {
  children: React.Node;
  title:    string;
}

type State = {
  drawerOpen: boolean;
}


const routes = [
  {
    path:  '/events',
    title: 'Events',
  },
  {
    path:  '/forum',
    title: 'Forum',
  }
];

class AppFrame extends React.Component<ProvidedProps & Props, State> {

  state = {
    drawerOpen: false,
  };


  onToggleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };


  render() {
    const { children, classes } = this.props;

    const drawer = (
      <div>
        <Toolbar>
          <Link to="/">
            <Typography type="title">
              klubitus
            </Typography>
          </Link>
        </Toolbar>

        <Divider />

        {routes.map((route, index) => (
          <MenuItem className={classes.drawerButton}
                    component={Link}
                    disableRipple
                    key={index}
                    to={route.path}>
            {route.title}
          </MenuItem>
        ))}

      </div>
    );

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>

          <AppBar className={classes.appBar} color="default">
            <Toolbar>
              <IconButton aria-label="open drawer"
                          className={classes.navIconHide}
                          color="contrast"
                          onClick={this.onToggleDrawer}>
                menu
              </IconButton>
              <Typography type="title">
                klubitus
              </Typography>
            </Toolbar>
          </AppBar>

          <Hidden mdUp>
            <Drawer classes={{ paper: classes.drawerPaper }}
                    ModalProps={{ keepMounted: true }}
                    onRequestClose={this.onToggleDrawer}
                    open={this.state.drawerOpen}
                    type="temporary">
              {drawer}
            </Drawer>
          </Hidden>

          <Hidden mdDown implementation="css">
            <Drawer classes={{ paper: classes.drawerPaper }}
                    open
                    type="permanent">
              {drawer}
            </Drawer>
          </Hidden>

          <main id="content" className={classes.content}>
            {children}
          </main>

        </div>
      </div>
    );
  }
}


const drawerWidth = 240;

const styles = (theme: Theme) => ({

  '@global': {
    html: {
      background: theme.palette.background.default,
    },
    body: {

    },
  },

  root: {
    overflow:  'hidden',
    width:     '100%',
  },

  appFrame: {
    display:  'flex',
    height:   '100%',
    position: 'relative',
    width:    '100%',
  },

  appBar: {
    marginLeft: drawerWidth,
    position:   'absolute',

    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },

  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },

  drawerHeader: theme.mixins.toolbar,

  drawerPaper:  {
    width: 250,

    [theme.breakpoints.up('md')]: {
      height:   '100%',
      position: 'relative',
      width:    drawerWidth,
    }
  },

  drawerButton: {
    borderRadius:   0,
    color:          theme.palette.text.secondary,
    justifyContent: 'flex-start',
  },

  content: {
    backgroundColor: theme.palette.background.default,
    height:          'calc(100% - 56px)',
    marginTop:       56,
    padding:         theme.spacing.unit * 3,
    width:           '100%',

    [theme.breakpoints.up('sm')]: {
      height:    'calc(100% - 64px)',
      marginTop: 64,
    }
  }

});


export default withStyles(styles, { withTheme: true })(AppFrame);
