import type { Theme } from 'material-ui/styles/index';
import pink from 'material-ui/colors/pink';
import createMuiTheme from 'material-ui/styles/createMuiTheme';

const theme: Theme = createMuiTheme({
  overrides: {
    MuiButton: {
      // raised: {
      // border: '1px solid rgba(255, 255, 255, 0.25)',
      // transition: transitions.create(['border-color'], { duration: transitions.duration.short }),
      // '&:hover': {
      //    borderColor: 'rgba(255, 255, 255, 1)',
      //  },
      // },
    },
  },

  palette: {
    background: {
      appBar:  '#111111',
      default: '#000000',
      paper:   '#222222',
    },
    primary: pink,
    secondary: {
      main: '#999999',
    },
    type: 'dark'
  },

  typography: {
    htmlFontSize: 10,
  }
});

export default theme;
