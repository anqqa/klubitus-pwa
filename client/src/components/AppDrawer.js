// @flow
import type { Theme } from 'material-ui/styles';
import {
  Divider, Drawer, Hidden, ListItemIcon, ListItemText, MenuItem, Toolbar, Typography,
  withStyles
} from 'material-ui';
import * as React from 'react';
import { Calendar, MessageCircle } from 'react-feather';
import { Link } from 'react-router-dom';


type Props = {
  classes:        Object;
  className:      string;
  isOpen:         boolean;
  onRequestClose: () => void;
}

const routes = [
  {
    icon:  <Calendar />,
    path:  '/events',
    title: 'Events',
  },
  {
    icon:  <MessageCircle />,
    path:  '/forum',
    title: 'Forum',
  }
];

class AppDrawer extends React.Component<Props> {
  render() {
    const { className, classes, isOpen, onRequestClose } = this.props;

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
          <MenuItem className={classes.button}
                    component={Link}
                    disableRipple
                    key={index}
                    to={route.path}>
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText primary={route.title} />
          </MenuItem>
        ))}

      </div>
    );

    return (
      <div className={className}>
        <Hidden mdUp>
          <Drawer classes={{ paper: classes.paper }}
                  ModalProps={{ keepMounted: true }}
                  onRequestClose={onRequestClose}
                  open={isOpen}
                  type="temporary">
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden mdDown implementation="css">
          <Drawer classes={{ paper: classes.paper }}
                  open
                  type="permanent">
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}


const drawerWidth = 240;

const styles = (theme: Theme) => ({

  button: {
    borderRadius:   0,
    color:          theme.palette.text.secondary,
    justifyContent: 'flex-start',
  },

  header: theme.mixins.toolbar,

  paper: {
    width:  250,

    [theme.breakpoints.up('md')]: {
      height:   '100%',
      position: 'relative',
      width:    drawerWidth,
    }
  },

});


export default withStyles(styles, { withTheme: true })(AppDrawer);
