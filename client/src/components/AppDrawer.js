// @flow
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuItem } from 'material-ui/Menu';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import type { Theme } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import * as React from 'react';
import Calendar from 'react-feather/dist/icons/calendar';
import MessageCircle from 'react-feather/dist/icons/message-circle';
import { Link } from 'react-router-dom';


type Props = {
  classes:   Object;
  className: string;
  isOpen:    boolean;
  onClose:   () => void;
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
    const { className, classes, isOpen, onClose } = this.props;

    const drawer = (
      <div>
        <Toolbar>
          <Link to="/">
            <Typography variant="title">
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
                  onClose={onClose}
                  open={isOpen}
                  variant="temporary">
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden mdDown implementation="css">
          <Drawer classes={{ paper: classes.paper }}
                  open
                  variant="permanent">
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}


const drawerWidth = 200;

const styles = (theme: Theme) => ({

  button: {
    borderRadius:   0,
    color:          theme.palette.text.secondary,
    justifyContent: 'flex-start',
  },

  header: theme.mixins.toolbar,

  paper: {
    flexGrow: 1,
    width:  drawerWidth,

    [theme.breakpoints.up('md')]: {
      position: 'relative',
      width:    drawerWidth,
    }
  },

});


export default withStyles(styles, { withTheme: true })(AppDrawer);
