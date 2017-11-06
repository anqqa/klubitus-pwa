// @flow
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import type { Theme } from 'material-ui/styles';
import {
  AppBar, Button, Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography,
  withStyles
} from 'material-ui';
import * as React from 'react';
import { Link } from 'react-router-dom';


const theme: Theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});


type ProvidedProps = {
  classes: Object;
  theme:   *;
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

class AppShell extends React.Component<ProvidedProps & Props, State> {

  state = {
    drawerOpen: false,
  };


  onToggleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };


  render() {
    const { classes, theme } = this.props;

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

        <List>
          {routes.map((route, index) => (
            <ListItem className={classes.drawerItem} disableGutters key={index}>
              <Button activeClassName={classes.drawerButtonActive}
                      className={classes.drawerButton}
                      component={Link}
                      disableRipple
                      to={route.path}
                      variant="button">
                {route.title}
              </Button>
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>

            <AppBar className={classes.appBar}>
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
              {React.cloneElement(this.props.children)}
            </main>

          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}


const drawerWidth = 240;

const styles = (theme: Theme) => ({

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

  drawerItem: {
    paddingBottom: 0,
    paddingTop:    0,
  },

  drawerButton: {
    borderRadius:   0,
    color:          theme.palette.text.secondary,
    justifyContent: 'flex-start',
    width:          '100%',
  },

  drawerButtonActive: {
    color: theme.palette.text.primary,
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


export default withStyles(styles, { withTheme: true })(AppShell);
