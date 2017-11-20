// @flow
import type { Theme } from 'material-ui/styles';
import { AppBar, IconButton, Toolbar, Typography, withStyles } from 'material-ui';
import * as React from 'react';
import AppDrawer from './AppDrawer';


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

class AppFrame extends React.Component<ProvidedProps & Props, State> {

  state = {
    drawerOpen: false,
  };


  onToggleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };


  render() {
    const { children, classes } = this.props;

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

          <AppDrawer className={classes.drawer}
                     isOpen={this.state.drawerOpen}
                     onRequestClose={this.onToggleDrawer} />

          <main id="content" className={classes.content}>
            {children}
          </main>

        </div>
      </div>
    );
  }
}


const drawerWidth = 200;

const styles = (theme: Theme) => ({

  '@global': {
    html: {
      background: theme.palette.background.default,
      fontSize:   '62.5%',  // 10px
    },

    body: {

    },

    a: {
      textDecoration: 'none',
    }
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

  drawer: {
  },

  content: theme.mixins.gutters({
    backgroundColor: theme.palette.background.default,
    flex:            '1 1 100%',
    height:          'calc(100% - 56px)',
    marginTop:       56,
    maxWidth:        '100%',
    padding:         theme.spacing.unit * 3,

    [theme.breakpoints.up('sm')]: {
      height:    'calc(100% - 64px)',
      marginTop: 64,
    }
  })

});


export default withStyles(styles, { withTheme: true })(AppFrame);
